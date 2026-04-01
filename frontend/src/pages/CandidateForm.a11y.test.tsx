import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { it, expect } from 'vitest'
import { CandidateForm } from './CandidateForm'

expect.extend(toHaveNoViolations)

it('CandidateForm has no a11y violations', async () => {
  const { container } = render(
    <MemoryRouter><CandidateForm /></MemoryRouter>
  )
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})