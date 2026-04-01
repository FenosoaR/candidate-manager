import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { validate } from '../../src/middleware/validate.middleware'
import { createCandidateSchema } from '../../src/validators/candidate.validator'
import { authMiddleware } from '../../src/middleware/auth.middeware'

process.env.JWT_SECRET = 'test-secret'

const mockRes = () => {
  const res = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('authMiddleware', () => {
  it('calls next() with valid token', () => {
    const token = jwt.sign({ id: '1', email: 'a@b.com' }, 'test-secret')
    const req = { headers: { authorization: `Bearer ${token}` } } as Request
    const res = mockRes()
    const next = jest.fn() as NextFunction
    authMiddleware(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('returns 401 with no token', () => {
    const req = { headers: {} } as Request
    const res = mockRes()
    authMiddleware(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('returns 401 with invalid token', () => {
    const req = { headers: { authorization: 'Bearer invalid.token.here' } } as Request
    const res = mockRes()
    authMiddleware(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('returns 401 when authorization header has no Bearer prefix', () => {
    const req = { headers: { authorization: 'Basic sometoken' } } as Request
    const res = mockRes()
    authMiddleware(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(401)
  })
})

describe('validate middleware', () => {
  it('calls next() with valid body', () => {
    const req = {
      body: { firstName: 'Jean', lastName: 'Dupont', email: 'j@d.com', position: 'Dev' }
    } as Request
    const res = mockRes()
    const next = jest.fn() as NextFunction
    validate(createCandidateSchema)(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('returns 400 with invalid body', () => {
    const req = { body: { email: 'notanemail' } } as Request
    const res = mockRes()
    validate(createCandidateSchema)(req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ details: expect.any(Array) })
    )
  })
})