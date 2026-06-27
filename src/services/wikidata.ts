/**
 * Wikidata クライアント
 *
 * 用途:
 *  - 選手の補足情報（生年月日・身長・所属クラブ・画像など）を取得
 *  - SPARQL での横断検索、エンティティ単体取得、Commons 画像 URL 解決
 *
 * API キー不要。ただし Wikimedia の User-Agent ポリシーにより
 * WIKIDATA_USER_AGENT の指定が必須（連絡先を含めること）。
 * https://meta.wikimedia.org/wiki/User-Agent_policy
 *
 * サーバーサイド専用。
 */
import { fetchJson } from './http'

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'
const ENTITY_DATA_BASE = 'https://www.wikidata.org/wiki/Special:EntityData'

function userAgent(): string {
  return process.env.WIKIDATA_USER_AGENT ?? 'wc-player-2026/1.0 (unset-contact)'
}

// --- SPARQL ---

interface SparqlBinding {
  [key: string]: { type: string; value: string; 'xml:lang'?: string }
}

interface SparqlResponse {
  head: { vars: string[] }
  results: { bindings: SparqlBinding[] }
}

/** 正規化済みの選手概要（Wikidata 由来） */
export interface WikidataPlayer {
  /** Wikidata エンティティ ID（例: Q615） */
  id: string
  nameJa: string | null
  nameEn: string | null
  /** Commons の画像ファイル名（P18）。未設定なら null */
  image: string | null
  birthDate: string | null
  heightCm: number | null
  clubLabel: string | null
}

/**
 * 生の SPARQL クエリを実行して bindings を返す。
 */
export async function runSparql(query: string, revalidate = 60 * 60 * 24): Promise<SparqlBinding[]> {
  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`
  const data = await fetchJson<SparqlResponse>(url, {
    source: 'wikidata',
    revalidate,
    headers: {
      Accept: 'application/sparql-results+json',
      'User-Agent': userAgent(),
    },
  })
  return data.results.bindings
}

/** SPARQL の値を取り出すヘルパー（QID は URI 末尾を切り出す） */
function val(b: SparqlBinding, key: string): string | null {
  return b[key]?.value ?? null
}
function qid(b: SparqlBinding, key: string): string | null {
  const v = b[key]?.value
  return v ? (v.split('/').pop() ?? null) : null
}

export const wikidata = {
  /**
   * 名前でサッカー選手（occupation=association football player, Q937857）を検索。
   */
  async searchPlayers(name: string, limit = 10): Promise<WikidataPlayer[]> {
    const safe = name.replace(/["\\]/g, '')
    const query = `
SELECT ?player ?playerLabel ?image ?birthDate ?height ?clubLabel WHERE {
  ?player wdt:P106 wd:Q937857 ;
          rdfs:label ?label .
  FILTER(CONTAINS(LCASE(?label), LCASE("${safe}")))
  FILTER(LANG(?label) IN ("ja", "en"))
  OPTIONAL { ?player wdt:P18 ?image. }
  OPTIONAL { ?player wdt:P569 ?birthDate. }
  OPTIONAL { ?player wdt:P2048 ?height. }
  OPTIONAL { ?player wdt:P54 ?club. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ja,en". }
}
LIMIT ${limit}`

    const bindings = await runSparql(query)
    return bindings.map((b) => ({
      id: qid(b, 'player') ?? '',
      nameJa: val(b, 'playerLabel'),
      nameEn: null,
      image: extractCommonsFileName(val(b, 'image')),
      birthDate: val(b, 'birthDate'),
      heightCm: parseHeight(val(b, 'height')),
      clubLabel: val(b, 'clubLabel'),
    }))
  },

  /**
   * エンティティ単体を Special:EntityData から取得（SPARQL より軽量・安定）。
   * 主要プロパティを正規化して返す。
   */
  async getPlayerEntity(entityId: string): Promise<WikidataPlayer | null> {
    if (!/^Q\d+$/.test(entityId)) return null

    const url = `${ENTITY_DATA_BASE}/${entityId}.json`
    const data = await fetchJson<{ entities: Record<string, RawEntity> }>(url, {
      source: 'wikidata',
      revalidate: 60 * 60 * 24,
      headers: { 'User-Agent': userAgent() },
    })

    const entity = data.entities?.[entityId]
    if (!entity) return null

    return {
      id: entityId,
      nameJa: entity.labels?.ja?.value ?? null,
      nameEn: entity.labels?.en?.value ?? null,
      image: extractCommonsFileName(claimString(entity, 'P18')),
      birthDate: claimTime(entity, 'P569'),
      heightCm: parseHeight(claimQuantity(entity, 'P2048')),
      clubLabel: null, // クラブは QID のみ。ラベルが必要なら別途解決
    }
  },

  /**
   * Commons のファイル名から実画像 URL を生成。
   * next.config.ts の remotePatterns(upload.wikimedia.org)に対応。
   * @param width 取得する横幅（px）。サムネイル生成
   */
  imageUrl(fileName: string, width = 400): string {
    const normalized = fileName.replace(/ /g, '_')
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
      normalized,
    )}?width=${width}`
  },
}

// --- Special:EntityData の生型（必要分のみ） ---

interface RawEntity {
  labels?: Record<string, { language: string; value: string }>
  claims?: Record<string, RawClaim[]>
}

interface RawClaim {
  mainsnak?: {
    datavalue?: {
      value:
        | string
        | { time?: string }
        | { amount?: string }
        | Record<string, unknown>
    }
  }
}

function claimString(entity: RawEntity, prop: string): string | null {
  const v = entity.claims?.[prop]?.[0]?.mainsnak?.datavalue?.value
  return typeof v === 'string' ? v : null
}

function claimTime(entity: RawEntity, prop: string): string | null {
  const v = entity.claims?.[prop]?.[0]?.mainsnak?.datavalue?.value
  if (v && typeof v === 'object' && 'time' in v && typeof v.time === 'string') {
    // 例: "+1987-06-24T00:00:00Z" → "1987-06-24"
    return v.time.replace(/^\+/, '').slice(0, 10)
  }
  return null
}

function claimQuantity(entity: RawEntity, prop: string): string | null {
  const v = entity.claims?.[prop]?.[0]?.mainsnak?.datavalue?.value
  if (v && typeof v === 'object' && 'amount' in v && typeof v.amount === 'string') {
    return v.amount.replace(/^\+/, '')
  }
  return null
}

// --- 共通ヘルパー ---

/** SPARQL の image URL（commons URL）または生ファイル名からファイル名を抽出 */
function extractCommonsFileName(value: string | null): string | null {
  if (!value) return null
  if (value.startsWith('http')) {
    return decodeURIComponent(value.split('/').pop() ?? '')
  }
  return value
}

/** 身長を cm の数値に正規化（メートル単位や文字列に対応） */
function parseHeight(value: string | null): number | null {
  if (!value) return null
  const n = Number.parseFloat(value)
  if (Number.isNaN(n)) return null
  // P2048 はメートル単位（例: 1.7）。cm に変換
  return n < 3 ? Math.round(n * 100) : Math.round(n)
}
