# Candidate Manager

![Coverage](https://codecov.io/gh/TON_USERNAME/TON_REPO/branch/main/graph/badge.svg)

## Installation
```bash
docker-compose up --build
```

- Frontend : http://localhost:3000
- Backend  : http://localhost:3001
- Login    : admin@test.com / Admin1234!

## Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# E2E
cd frontend && npm run test:e2e

# Charge (k6)
k6 run k6/load-test.js
```

## Stratégie de tests

| Type         | Outil                | Cible            |
|--------------|----------------------|-----------------|
| Unitaires    | Jest / Vitest        | Services, hooks  |
| Intégration  | Supertest / MSW      | API, composants  |
| E2E          | Playwright           | Scénario complet |
| Charge       | k6                   | POST /candidates |
| Sécurité     | Tests manuels/API    | Injection, brute |

## Couverture

Objectif : ≥ 90% — bloquant sur la CI si non atteint.