import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchJson, ExternalApiError } from './http'

afterEach(() => vi.restoreAllMocks())

describe('fetchJson', () => {
  it('成功時に JSON を返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    )
    const data = await fetchJson<{ ok: boolean }>('https://example.test', { source: 'gemini' })
    expect(data.ok).toBe(true)
  })

  it('HTTP エラー時に status 付きの ExternalApiError を投げる', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('rate limited', { status: 429 })),
    )
    await expect(
      fetchJson('https://example.test', { source: 'api-football' }),
    ).rejects.toMatchObject({ status: 429, source: 'api-football' })
  })

  it('タイムアウト（abort）を 408 に変換する', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, opts: RequestInit) =>
          new Promise((_resolve, reject) => {
            // テストと同一 realm の DOMException で投げ、http.ts 側の instanceof 判定を確実に通す
            opts.signal?.addEventListener('abort', () =>
              reject(new DOMException('aborted', 'AbortError')),
            )
          }),
      ),
    )
    await expect(
      fetchJson('https://example.test', { source: 'wikidata', timeoutMs: 10 }),
    ).rejects.toMatchObject({ status: 408 })
  })

  it('ネットワーク失敗を status 0 に変換する', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    const err = await fetchJson('https://example.test', { source: 'gemini' }).catch(
      (e: unknown) => e,
    )
    expect(err).toBeInstanceOf(ExternalApiError)
    expect((err as ExternalApiError).status).toBe(0)
  })
})
