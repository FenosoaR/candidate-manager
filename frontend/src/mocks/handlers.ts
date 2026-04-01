import { http, HttpResponse } from 'msw';

const BASE = 'http://localhost:3001';

export const handlers = [
  http.get(`${BASE}/api/candidates`, () =>
    HttpResponse.json({ data: [{ _id: '1', firstName: 'Alice', lastName: 'M', email: 'a@t.com', position: 'Dev', status: 'pending', createdAt: '' }], total: 1, page: 1, limit: 10 })
  ),
  http.post(`${BASE}/api/candidates`, () =>
    HttpResponse.json({ _id: '2', firstName: 'Bob', lastName: 'D', email: 'b@t.com', position: 'QA', status: 'pending', createdAt: '' }, { status: 201 })
  ),
  http.post(`${BASE}/api/candidates/:id/validate`, () =>
    HttpResponse.json({ _id: '1', status: 'validated' })
  ),
  http.delete(`${BASE}/api/candidates/:id`, () =>
    HttpResponse.json({ message: 'ok' })
  ),
  http.post(`${BASE}/api/auth/login`, () =>
    HttpResponse.json({ token: 'mock-token' })
  ),
];