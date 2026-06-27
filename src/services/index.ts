/**
 * 外部 API サービス層のエントリーポイント。
 * すべてサーバーサイドでのみ利用すること（API キー秘匿のため）。
 */
export { apiFootball } from './apiFootball'
export type {
  AFTeamEntry,
  AFPlayerEntry,
  AFFixtureEntry,
  AFTransferEntry,
} from './apiFootball'

export { wikidata, runSparql } from './wikidata'
export type { WikidataPlayer } from './wikidata'

export { getPlayerAnalysis } from './aiService'
export type { PlayerAnalysis } from './aiService'

export { ExternalApiError, fetchJson } from './http'
export type { FetchJsonOptions, ApiSource } from './http'
