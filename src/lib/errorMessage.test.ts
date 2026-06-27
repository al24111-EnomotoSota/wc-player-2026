import { describe, it, expect } from 'vitest'
import { infoForStatus, infoForError } from './errorMessage'
import { ExternalApiError } from '@/services/http'

describe('infoForStatus', () => {
  it('404 は再試行不可', () => {
    const info = infoForStatus(404)
    expect(info.code).toBe('NOT_FOUND')
    expect(info.retryable).toBe(false)
  })

  it('408/429/0/5xx をそれぞれ分類する', () => {
    expect(infoForStatus(408).code).toBe('TIMEOUT')
    expect(infoForStatus(429).code).toBe('RATE_LIMIT')
    expect(infoForStatus(0).code).toBe('NETWORK')
    expect(infoForStatus(503).code).toBe('SERVER_ERROR')
  })

  it('未知のステータスは汎用エラー', () => {
    expect(infoForStatus(418).code).toBe('ERROR')
  })

  it('各分類に日本語メッセージを持つ', () => {
    expect(infoForStatus(429).message).toContain('リクエスト')
    expect(infoForStatus(408).message).toContain('タイムアウト')
  })
})

describe('infoForError', () => {
  it('ExternalApiError のステータスを利用する', () => {
    const err = new ExternalApiError('boom', 429, 'gemini')
    expect(infoForError(err).code).toBe('RATE_LIMIT')
  })

  it('通常の Error はサーバーエラー扱い', () => {
    expect(infoForError(new Error('x')).code).toBe('SERVER_ERROR')
  })
})
