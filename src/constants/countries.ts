/**
 * 国名 → ISO 3166-1 alpha-2 コードのマッピングと国旗ヘルパー。
 * API-Football は nationality を英語名で返すため、英語名をキーにする。
 * 主要サッカー国（W杯出場圏）を中心に収録。未収録は null フォールバック。
 */
const NAME_TO_ISO2: Record<string, string> = {
  // アジア
  Japan: 'jp',
  'South Korea': 'kr',
  'Korea Republic': 'kr',
  Australia: 'au',
  'Saudi Arabia': 'sa',
  Iran: 'ir',
  Qatar: 'qa',
  Iraq: 'iq',
  'United Arab Emirates': 'ae',
  Uzbekistan: 'uz',
  China: 'cn',
  // ヨーロッパ
  England: 'gb-eng',
  France: 'fr',
  Germany: 'de',
  Spain: 'es',
  Italy: 'it',
  Portugal: 'pt',
  Netherlands: 'nl',
  Belgium: 'be',
  Croatia: 'hr',
  Denmark: 'dk',
  Switzerland: 'ch',
  Poland: 'pl',
  Sweden: 'se',
  Austria: 'at',
  Serbia: 'rs',
  Ukraine: 'ua',
  Scotland: 'gb-sct',
  Wales: 'gb-wls',
  Norway: 'no',
  Turkey: 'tr',
  'Czech Republic': 'cz',
  Czechia: 'cz',
  Hungary: 'hu',
  Greece: 'gr',
  Ireland: 'ie',
  Russia: 'ru',
  // 南米
  Brazil: 'br',
  Argentina: 'ar',
  Uruguay: 'uy',
  Colombia: 'co',
  Chile: 'cl',
  Peru: 'pe',
  Ecuador: 'ec',
  Paraguay: 'py',
  Venezuela: 've',
  Bolivia: 'bo',
  // 北中米・カリブ
  USA: 'us',
  'United States': 'us',
  Mexico: 'mx',
  Canada: 'ca',
  'Costa Rica': 'cr',
  Panama: 'pa',
  Jamaica: 'jm',
  Honduras: 'hn',
  // アフリカ
  Morocco: 'ma',
  Senegal: 'sn',
  Nigeria: 'ng',
  Cameroon: 'cm',
  Ghana: 'gh',
  Egypt: 'eg',
  Algeria: 'dz',
  Tunisia: 'tn',
  'Ivory Coast': 'ci',
  "Côte d'Ivoire": 'ci',
  Mali: 'ml',
  'South Africa': 'za',
  'DR Congo': 'cd',
  // オセアニア
  'New Zealand': 'nz',
}

/** 国名から ISO2 コードを返す（未収録は null） */
export function countryToISO2(name: string | null | undefined): string | null {
  if (!name) return null
  return NAME_TO_ISO2[name] ?? NAME_TO_ISO2[name.trim()] ?? null
}

/**
 * 国旗画像 URL（flagcdn.com の SVG）。
 * next.config.ts の remotePatterns(flagcdn.com)に対応。
 */
export function flagUrl(name: string | null | undefined): string | null {
  const code = countryToISO2(name)
  return code ? `https://flagcdn.com/${code}.svg` : null
}
