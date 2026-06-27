import { describe, it, expect } from 'vitest'
import { normalizePosition } from './positions'

describe('normalizePosition', () => {
  it('API-Football の英語表記を GK/DF/MF/FW に正規化する', () => {
    expect(normalizePosition('Goalkeeper')).toBe('GK')
    expect(normalizePosition('Defender')).toBe('DF')
    expect(normalizePosition('Midfielder')).toBe('MF')
    expect(normalizePosition('Attacker')).toBe('FW')
  })

  it('短縮コード・大文字小文字・別表記を扱う', () => {
    expect(normalizePosition('gk')).toBe('GK')
    expect(normalizePosition('FW')).toBe('FW')
    expect(normalizePosition('forward')).toBe('FW')
    expect(normalizePosition('DEF')).toBe('DF')
  })

  it('不明・空・null は null を返す', () => {
    expect(normalizePosition(null)).toBeNull()
    expect(normalizePosition(undefined)).toBeNull()
    expect(normalizePosition('')).toBeNull()
    expect(normalizePosition('Coach')).toBeNull()
  })
})
