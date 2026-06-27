/**
 * AI 選手分析サービス（Google Gemini）
 *
 * - 課金・クレカ登録不要の無料枠を利用（gemini-2.0-flash 等）。
 * - 公式 SDK は依存が重いため REST API を fetch で直接呼ぶ（追加パッケージ不要）。
 * - 生成結果は unstable_cache で Next.js Data Cache に永続化し、
 *   同じ選手への再生成（＝無料枠の消費）を防ぐ。
 * - サーバーサイド専用。GEMINI_API_KEY をクライアントへ漏らさないこと。
 */
import { unstable_cache } from 'next/cache'
import { ExternalApiError, fetchJson } from './http'
import type { PlayerDetail } from '@/types/player'

/** AI が生成する選手分析（プレースタイル・特徴） */
export interface PlayerAnalysis {
  /** プレースタイル（2〜3 文の説明） */
  playStyle: string
  /** 特徴（短い箇条書き 3〜5 個） */
  traits: string[]
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
  promptFeedback?: { blockReason?: string }
}

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models'

function buildPrompt(player: PlayerDetail): string {
  const lines = [
    `名前: ${player.name}`,
    player.nationality && `国籍: ${player.nationality}`,
    player.positionRaw && `ポジション: ${player.positionRaw}`,
    player.clubName && `所属クラブ: ${player.clubName}`,
    player.age != null && `年齢: ${player.age}`,
    `通算成績: ${player.stats.goals}ゴール / ${player.stats.assists}アシスト / ${player.stats.appearances}試合`,
  ].filter(Boolean)

  return `あなたはサッカーの専門アナリストです。以下の選手について、日本語で簡潔に分析してください。
事実が不確かな場合は一般的なポジション像に基づいて記述し、誇張や断定は避けてください。

${lines.join('\n')}

出力する内容:
- playStyle: この選手のプレースタイルを2〜3文で説明
- traits: 特徴を3〜5個の短いフレーズ（各15文字程度）で列挙`
}

/**
 * 実際に Gemini を呼び出して分析を生成（キャッシュ前の生処理）。
 */
async function generate(player: PlayerDetail): Promise<PlayerAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new ExternalApiError(
      'GEMINI_API_KEY が設定されていません（.env.local を確認）',
      500,
      'gemini',
    )
  }
  const model = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'
  const url = `${ENDPOINT}/${model}:generateContent?key=${apiKey}`

  const data = await fetchJson<GeminiResponse>(url, {
    method: 'POST',
    source: 'gemini',
    timeoutMs: 20_000,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(player) }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            playStyle: { type: 'string' },
            traits: { type: 'array', items: { type: 'string' } },
          },
          required: ['playStyle', 'traits'],
        },
      },
    }),
  })

  if (data.promptFeedback?.blockReason) {
    throw new ExternalApiError(
      `Gemini が生成をブロックしました: ${data.promptFeedback.blockReason}`,
      400,
      'gemini',
    )
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new ExternalApiError('Gemini から有効な応答が得られませんでした', 502, 'gemini')
  }

  let parsed: PlayerAnalysis
  try {
    parsed = JSON.parse(text) as PlayerAnalysis
  } catch {
    throw new ExternalApiError('Gemini の応答を解析できませんでした', 502, 'gemini')
  }

  return {
    playStyle: parsed.playStyle?.trim() ?? '',
    traits: Array.isArray(parsed.traits) ? parsed.traits.filter(Boolean).slice(0, 5) : [],
  }
}

/**
 * 選手分析を取得（キャッシュ付き）。
 * 同一選手 ID の結果は Data Cache に 30 日保持し、無料枠の消費を抑える。
 */
export async function getPlayerAnalysis(player: PlayerDetail): Promise<PlayerAnalysis> {
  const cached = unstable_cache(
    () => generate(player),
    ['player-analysis', String(player.id)],
    {
      tags: [`player-analysis-${player.id}`],
      revalidate: 60 * 60 * 24 * 30, // 30 日
    },
  )
  return cached()
}
