import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { MemoryRouter } from 'react-router-dom'
import { it, expect } from 'vitest'
import { Login } from './Login'

expect.extend(toHaveNoViolations)

it('Login has no a11y violations', async () => {
  const { container } = render(
    <MemoryRouter><Login /></MemoryRouter>
  )
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})