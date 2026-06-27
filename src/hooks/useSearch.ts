'use client'

import { useCallback, useRef, useState } from 'react'
import type { SearchParams, SearchPlayerResult, SearchResponse } from '@/types/search'
import { isSearchError } from '@/types/search'

type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * /api/search を呼び出し、ローディング・結果・エラー状態を管理するフック。
 * 連続検索時は直前のリクエストを中断する。
 */
export function useSearch() {
  const [status, setStatus] = useState<Status>('idle')
  const [results, setResults] = useState<SearchPlayerResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const search = useCallback(async (params: SearchParams) => {
    // 直前のリクエストを中断
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('loading')
    setError(null)

    const query = new URLSearchParams()
    if (params.country) query.set('country', params.country)
    if (params.number !== undefined) query.set('number', String(params.number))

    try {
      const res = await fetch(`/api/search?${query.toString()}`, {
        signal: controller.signal,
      })
      const json = (await res.json()) as SearchResponse

      if (isSearchError(json)) {
        setError(json.error.message)
        setResults([])
        setStatus('error')
        return
      }

      setResults(json.data)
      setStatus('success')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return // 中断は無視
      setError('通信に失敗しました。ネットワークを確認して再試行してください。')
      setResults([])
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setStatus('idle')
    setResults([])
    setError(null)
  }, [])

  return { status, results, error, search, reset }
}
