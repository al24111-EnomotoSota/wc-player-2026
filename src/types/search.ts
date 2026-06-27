/**
 * 検索機能の型定義。
 * 検索条件: 国名（部分一致）・背番号。
 */

export interface SearchParams {
  /** 国名（日本語/英語の部分一致） */
  country?: string
  /** 背番号 */
  number?: number
}

/** 検索結果の選手（正規化済み） */
export interface SearchPlayerResult {
  id: number
  name: string
  photo: string | null
  position: string | null
  number: number | null
  teamName: string
  teamLogo: string | null
  country: string
  nationality: string | null
}

/** 検索成功レスポンス */
export interface SearchSuccessResponse {
  data: SearchPlayerResult[]
  meta: {
    total: number
    params: SearchParams
  }
}

/** 検索エラーレスポンス（設計書 3.2 のエラー形式に準拠） */
export interface SearchErrorResponse {
  error: {
    code: string
    message: string
    statusCode: number
  }
}

export type SearchResponse = SearchSuccessResponse | SearchErrorResponse

export function isSearchError(res: SearchResponse): res is SearchErrorResponse {
  return 'error' in res
}
