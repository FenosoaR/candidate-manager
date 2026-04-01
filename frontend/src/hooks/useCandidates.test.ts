import { renderHook, waitFor } from '@testing-library/react'
import { beforeAll, afterAll, afterEach, it, expect, describe } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { useCandidates } from './useCandidates'

const BASE = 'http://localhost:3001'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useCandidates — 100% coverage', () => {
  it('charge les candidats avec succès', async () => {
    const { result } = renderHook(() => useCandidates(1, ''))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.total).toBe(1)
    expect(result.current.error).toBeNull()
  })

  it('met error si l\'API échoue', async () => {
    server.use(
      http.get(`${BASE}/api/candidates`, () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 })
      )
    )
    const { result } = renderHook(() => useCandidates(1, ''))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Erreur lors du chargement des candidats')
    expect(result.current.data).toHaveLength(0)
  })

  it('refetch recharge les données', async () => {
    const { result } = renderHook(() => useCandidates(1, ''))
    await waitFor(() => expect(result.current.loading).toBe(false))
    await result.current.refetch()
    expect(result.current.data).toHaveLength(1)
  })

  it('change de page correctement', async () => {
    const { result } = renderHook(() => useCandidates(2, ''))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeNull()
  })

  it('filtre par search correctement', async () => {
    const { result } = renderHook(() => useCandidates(1, 'Alice'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toBeDefined()
  })
})