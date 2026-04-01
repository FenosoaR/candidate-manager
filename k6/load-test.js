import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 500,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE = 'http://localhost:3001';

export function setup() {
  const res = http.post(`${BASE}/api/auth/login`,
    JSON.stringify({ email: 'admin@test.com', password: 'Admin1234!' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  return { token: JSON.parse(res.body).token };
}

export default function (data) {
  const payload = JSON.stringify({
    firstName: 'Load',
    lastName: 'Test',
    email: `lt${__VU}_${__ITER}@test.com`,
    position: 'Engineer',
  });

  const res = http.post(`${BASE}/api/candidates`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
  });

  check(res, {
    'status is 201': r => r.status === 201,
    'response time < 2s': r => r.timings.duration < 2000,
  });
  sleep(0.1);
}