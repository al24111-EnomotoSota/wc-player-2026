import { describe, it, expect } from 'vitest'
import { countryToISO2, flagUrl } from './countries'

describe('countryToISO2', () => {
  it('既知の国名を ISO2 に変換する', () => {
    expect(countryToISO2('Japan')).toBe('jp')
    expect(countryToISO2('Brazil')).toBe('br')
    expect(countryToISO2('England')).toBe('gb-eng')
  })

  it('別名を扱う', () => {
    expect(countryToISO2('USA')).toBe('us')
    expect(countryToISO2('United States')).toBe('us')
  })

  it('前後の空白を許容する', () => {
    expect(countryToISO2(' Japan ')).toBe('jp')
  })

  it('未収録・null は null を返す', () => {
    expect(countryToISO2('Atlantis')).toBeNull()
    expect(countryToISO2(null)).toBeNull()
    expect(countryToISO2(undefined)).toBeNull()
  })
})

describe('flagUrl', () => {
  it('flagcdn の URL を生成する', () => {
    expect(flagUrl('Japan')).toBe('https://flagcdn.com/jp.svg')
  })

  it('未収録は null を返す', () => {
    expect(flagUrl('Atlantis')).toBeNull()
    expect(flagUrl(null)).toBeNull()
  })
})
