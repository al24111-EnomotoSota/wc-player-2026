/**
 * 外部 API 通信の共通ユーティリティ。
 * - タイムアウト制御
 * - HTTP エラーの正規化（ExternalApiError）
 * - Next.js の fetch キャッシュ（next.revalidate）対応
 *
 * これらの関数はすべてサーバーサイドでのみ呼び出すこと。
 * API キーは NEXT_PUBLIC_ を付けない環境変数で渡し、クライアントへ漏らさない。
 */

export type ApiSource = 'api-football' | 'wikidata' | 'gemini'

export class ExternalApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly source: ApiSource,
    readonly body?: unknown,
  ) {
    super(message)
    this.name = 'ExternalApiError'
  }
}

export interface FetchJsonOptions extends Omit<RequestInit, 'signal'> {
  /** タイムアウト（ミリ秒）。デフォルト 10 秒 */
  timeoutMs?: number
  /** Next.js のキャッシュ再検証秒数 */
  revalidate?: number
  /** エラー文脈用のソース識別子 */
  source: ApiSource
}

const DEFAULT_TIMEOUT_MS = 10_000

/**
 * JSON を返す外部 API への GET/POST ヘルパー。
 */
export async function fetchJson<T>(url: string, options: FetchJsonOptions): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, revalidate, source, headers, ...rest } = options

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, {
      ...rest,
      headers: {
        Accept: 'application/json',
        ...headers,
      },
      signal: controller.signal,
      ...(revalidate !== undefined ? { next: { revalidate } } : {}),
    })

    if (!res.ok) {
      let body: unknown
      try {
        body = await res.json()
      } catch {
        body = await res.text().catch(() => undefined)
      }
      throw new ExternalApiError(
        `${source} へのリクエストが失敗しました (HTTP ${res.status})`,
        res.status,
        source,
        body,
      )
    }

    return (await res.json()) as T
  } catch (err) {
    if (err instanceof ExternalApiError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ExternalApiError(`${source} がタイムアウトしました (${timeoutMs}ms)`, 408, source)
    }
    throw new ExternalApiError(
      `${source} への接続に失敗しました: ${(err as Error).message}`,
      0,
      source,
    )
  } finally {
    clearTimeout(timer)
  }
}
