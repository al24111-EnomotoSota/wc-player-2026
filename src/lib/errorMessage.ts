/**
 * HTTP ステータス → ユーザー向けエラーメッセージのマッピング。
 * 404 / 408(タイムアウト) / 429(レート制限) / 5xx(サーバー) / 0(通信失敗) を区別する。
 */
import { ExternalApiError } from '@/services/http'

export interface ErrorInfo {
  code: string
  title: string
  message: string
  /** ユーザーが再試行して解決しうるか */
  retryable: boolean
}

export function infoForStatus(status: number): ErrorInfo {
  if (status === 404) {
    return {
      code: 'NOT_FOUND',
      title: '見つかりません',
      message: 'お探しのデータが見つかりませんでした。',
      retryable: false,
    }
  }
  if (status === 408) {
    return {
      code: 'TIMEOUT',
      title: 'タイムアウト',
      message: '通信がタイムアウトしました。時間をおいて再試行してください。',
      retryable: true,
    }
  }
  if (status === 429) {
    return {
      code: 'RATE_LIMIT',
      title: 'アクセスが集中しています',
      message: 'リクエストが多すぎます。しばらく待ってから再試行してください。',
      retryable: true,
    }
  }
  if (status === 0) {
    return {
      code: 'NETWORK',
      title: '通信エラー',
      message: 'ネットワークに接続できませんでした。接続を確認してください。',
      retryable: true,
    }
  }
  if (status >= 500) {
    return {
      code: 'SERVER_ERROR',
      title: 'サーバーエラー',
      message: 'サーバー側で問題が発生しました。時間をおいて再試行してください。',
      retryable: true,
    }
  }
  return {
    code: 'ERROR',
    title: 'エラーが発生しました',
    message: '問題が発生しました。時間をおいて再試行してください。',
    retryable: true,
  }
}

/** 任意の例外から ErrorInfo を導出（ExternalApiError ならステータスを利用） */
export function infoForError(err: unknown): ErrorInfo {
  if (err instanceof ExternalApiError) return infoForStatus(err.status)
  return infoForStatus(500)
}
