import { renderHook, act } from '@testing-library/react'
import { beforeAll, afterAll, afterEach, it, expect, describe } from 'vitest'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'
import { useCandidate } from './useCandidate'

const BASE = 'http://localhost:3001'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useCandidate', () => {
  it('createCandidate succeeds', async () => {
    const { result } = renderHook(() => useCandidate())
    let candidate: unknown
    await act(async () => {
      candidate = await result.current.createCandidate({
        firstName: 'Bob', lastName: 'D', email: 'b@t.com', position: 'QA'
      })
    })
    expect(candidate).toBeDefined()
    expect(result.current.loading).toBe(false)
  })

  it('createCandidate sets error on failure', async () => {
    server.use(
      http.post(`${BASE}/api/candidates`, () =>
        HttpResponse.json({ error: 'EMAIL_EXISTS' }, { status: 409 })
      )
    )
    const { result } = renderHook(() => useCandidate())
    await act(async () => {
      try { await result.current.createCandidate({ firstName: 'X', lastName: 'Y', email: 'x@y.com', position: 'Z' }) }
      catch { /* expected */ }
    })
    expect(result.current.error).toBe('EMAIL_EXISTS')
  })

  it('validateCandidate succeeds', async () => {
    const { result } = renderHook(() => useCandidate())
    let updated: unknown
    await act(async () => { updated = await result.current.validateCandidate('1') })
    expect((updated as { status: string }).status).toBe('validated')
  })

  it('validateCandidate sets error on failure', async () => {
    server.use(
      http.post(`${BASE}/api/candidates/:id/validate`, () =>
        HttpResponse.json({ error: 'Not found' }, { status: 404 })
      )
    )
    const { result } = renderHook(() => useCandidate())
    await act(async () => {
      try { await result.current.validateCandidate('bad-id') }
      catch { /* expected */ }
    })
    expect(result.current.error).toBe('Erreur validation')
  })

  it('deleteCandidate succeeds', async () => {
    const { result } = renderHook(() => useCandidate())
    await act(async () => { await result.current.deleteCandidate('1') })
    expect(result.current.error).toBeNull()
  })

  it('deleteCandidate sets error on failure', async () => {
    server.use(
      http.delete(`${BASE}/api/candidates/:id`, () =>
        HttpResponse.json({ error: 'Not found' }, { status: 404 })
      )
    )
    const { result } = renderHook(() => useCandidate())
    await act(async () => {
      try { await result.current.deleteCandidate('bad-id') }
      catch { /* expected */ }
    })
    expect(result.current.error).toBe('Erreur suppression')
  })
})