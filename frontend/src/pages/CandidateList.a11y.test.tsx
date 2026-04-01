import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { server } from '../mocks/server'
import { beforeAll, afterAll, afterEach, it, expect } from 'vitest'
import { CandidateList } from './CandidateList'

expect.extend(toHaveNoViolations)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('CandidateList has no a11y violations', async () => {
  const { container } = render(
    <MemoryRouter><CandidateList /></MemoryRouter>
  )
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})