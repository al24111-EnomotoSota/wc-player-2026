/**
 * お気に入り選手の型。
 * 一覧画面を API 再取得なしで描画できるよう、表示に必要な最小情報を保持する。
 */
export interface FavoritePlayer {
  id: number
  name: string
  photo: string | null
  position: string | null
  number: number | null
  teamName: string
  country: string
  /** 追加日時（追加順ソート用、epoch ミリ秒） */
  addedAt: number
}
