/**
 * ポジション定数・正規化ヘルパー。
 * API-Football は "Goalkeeper"/"Defender"/"Midfielder"/"Attacker" を返すため
 * アプリ内の GK/DF/MF/FW に正規化する。
 */
export type Position = 'GK' | 'DF' | 'MF' | 'FW'

export const POSITION_LABEL: Record<Position, string> = {
  GK: 'ゴールキーパー',
  DF: 'ディフェンダー',
  MF: 'ミッドフィールダー',
  FW: 'フォワード',
}

/** 設計書 5.1 のポジションカラー */
export const POSITION_COLOR: Record<Position, { bg: string; text: string }> = {
  GK: { bg: 'var(--color-pos-gk)', text: '#000' },
  DF: { bg: 'var(--color-pos-df)', text: '#fff' },
  MF: { bg: 'var(--color-pos-mf)', text: '#000' },
  FW: { bg: 'var(--color-pos-fw)', text: '#fff' },
}

export function normalizePosition(raw: string | null | undefined): Position | null {
  if (!raw) return null
  const v = raw.toLowerCase()
  if (v.startsWith('goal') || v === 'gk') return 'GK'
  if (v.startsWith('def') || v === 'df') return 'DF'
  if (v.startsWith('mid') || v === 'mf') return 'MF'
  if (v.startsWith('att') || v.startsWith('for') || v === 'fw') return 'FW'
  return null
}
