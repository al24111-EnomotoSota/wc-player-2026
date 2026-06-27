import type { NextRequest } from 'next/server'
import { ExternalApiError } from '@/services'
import { searchPlayers } from '@/services/searchService'
import { infoForStatus } from '@/lib/errorMessage'
import type {
  SearchPlayerResult,
  SearchErrorResponse,
  SearchSuccessResponse,
} from '@/types/search'

/**
 * GET /api/search?country=日本&number=10
 *
 * 検索条件: 国名（部分一致）・背番号。最低 1 つは必須。
 * API キーをクライアントへ漏らさないため、外部 API 呼び出しは必ずここ（サーバー）で行う。
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl
  const country = searchParams.get('country')?.trim() ?? ''
  const numberRaw = searchParams.get('number')?.trim() ?? ''

  // --- バリデーション ---
  if (!country && !numberRaw) {
    return errorResponse('EMPTY_QUERY', '国名または背番号を入力してください', 400)
  }

  let number: number | undefined
  if (numberRaw) {
    const n = Number(numberRaw)
    if (!Number.isInteger(n) || n < 1 || n > 99) {
      return errorResponse('INVALID_NUMBER', '背番号は 1〜99 の整数で入力してください', 400)
    }
    number = n
  }

  try {
    // 検索＋正規化＋絞り込みは searchService が担当（結果はキャッシュされる）
    const results = await searchPlayers({ country: country || undefined, number })
    return successResponse(results, { country: country || undefined, number })
  } catch (err) {
    if (err instanceof ExternalApiError) {
      const info = infoForStatus(err.status)
      const status = err.status >= 400 && err.status < 600 ? err.status : 502
      // 500(設定漏れ等)は開発者向けに実メッセージ、それ以外はユーザー向け定型文
      const message = err.status === 500 ? err.message : info.message
      return errorResponse(info.code, message, status)
    }
    const info = infoForStatus(500)
    return errorResponse(info.code, info.message, 500)
  }
}

// --- ヘルパー ---

function successResponse(
  data: SearchPlayerResult[],
  params: SearchSuccessResponse['meta']['params'],
): Response {
  const body: SearchSuccessResponse = {
    data,
    meta: { total: data.length, params },
  }
  return Response.json(body)
}

function errorResponse(code: string, message: string, statusCode: number): Response {
  const body: SearchErrorResponse = { error: { code, message, statusCode } }
  return Response.json(body, { status: statusCode })
}
