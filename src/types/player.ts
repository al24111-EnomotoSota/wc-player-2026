import type { Position } from '@/constants/positions'

/** 選手詳細（正規化済み・画面表示用） */
export interface PlayerDetail {
  id: number
  name: string
  photo: string | null
  position: Position | null
  positionRaw: string | null
  number: number | null
  age: number | null
  /** cm */
  height: number | null
  /** kg */
  weight: number | null
  /** 国籍（代表）の国名 */
  nationality: string | null
  flagUrl: string | null
  /** 所属クラブ名 */
  clubName: string | null
  clubLogo: string | null
  stats: PlayerStats
  transfers: TransferRecord[]
}

export interface PlayerStats {
  appearances: number
  goals: number
  assists: number
  minutes: number
  yellowCards: number
  redCards: number
}

export interface TransferRecord {
  date: string
  type: string | null
  fromClub: string
  fromLogo: string | null
  toClub: string
  toLogo: string | null
}
