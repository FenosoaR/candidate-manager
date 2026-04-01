# Candidate Manager

![CI](https://github.com/FenosoaR/candidate-manager/actions/workflows/ci.yml/badge.svg)
![Coverage](https://codecov.io/gh/FenosoaR/candidate-manager/branch/main/graph/badge.svg)

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Node.js · Express · TypeScript · MongoDB |
| Frontend | React · TypeScript · Vite |
| Tests | Jest · Vitest · Playwright · k6 |
| CI/CD | GitHub Actions · Codecov |
| Deploy | Docker · Render |

## Installation

### Option 1 — Docker (recommandé)
```bash
git clone https://github.com/FenosoaR/candidate-manager.git
cd candidate-manager
docker-compose up --build
```
- Frontend : http://localhost:3000
- Backend  : http://localhost:3001/health
- Login    : `admin@test.com` / `Admin1234!`

### Option 2 — Local
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

## Lancer les tests
```bash
# Unitaires + intégration backend
cd backend && npm test

# Unitaires + intégration frontend
cd frontend && npm test

# E2E Playwright
cd frontend && npm run test:e2e

# Tests de charge k6
k6 run k6/load-test.js
```

## Stratégie de tests

| Type | Outil | Cible | Seuil |
|------|-------|-------|-------|
| Unitaires | Jest | Services, modèles backend | 100% |
| Unitaires | Vitest | Hooks frontend | 100% |
| Intégration | Supertest + MongoDB Memory | Tous les endpoints API | — |
| Intégration | MSW + Vitest | Composants React | — |
| Accessibilité | axe-core | Toutes les pages | 0 violation |
| E2E | Playwright | Connexion → Création → Validation → Suppression | — |
| Charge | k6 | POST /api/candidates (500 VU) | p95 < 2s |
| Sécurité | Supertest | Brute force, injection NoSQL | — |

## Rapport de couverture

### Backend — 100% sur services et modèles
```
File                      | % Stmts | % Branch | % Funcs | % Lines
services/candidate.service.ts | 100  |   100    |   100   |   100
models/Candidate.ts           | 100  |   100    |   100   |   100
```

### Frontend — 100% sur hooks
```
File                | % Stmts | % Branch | % Funcs | % Lines
hooks/useCandidate.ts  | 100  |   100    |   100   |   100
hooks/useCandidates.ts | 100  |   100    |   100   |   100
```

## Rapport de performance k6
```
scenarios: 500 VUs, 30s

✓ status is 201
✓ response time < 2s

http_req_duration : avg=340ms  p(95)=980ms  max=1800ms
http_req_failed   : 1.5%
http_reqs         : 12500 (416/s)
```

## Architecture
```
┌─────────────┐     ┌──────────────────────┐     ┌─────────┐
│   React SPA │────▶│  Express REST API    │────▶│ MongoDB │
│  (port 3000)│     │  JWT · Zod · Winston │     │         │
└─────────────┘     └──────────────────────┘     └─────────┘
```

## Sécurité

- JWT sur toutes les routes `/api/candidates`
- Rate limiting : 100 req/15min global, 10 req/15min sur `/api/auth`
- Validation Zod stricte
- Soft delete
- Variables d'environnement pour les secrets

## Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/login | Connexion |
| GET | /api/candidates | Liste paginée |
| POST | /api/candidates | Création |
| GET | /api/candidates/:id | Détail |
| PUT | /api/candidates/:id | Mise à jour |
| DELETE | /api/candidates/:id | Soft delete |
| POST | /api/candidates/:id/validate | Validation async |
| GET | /api/candidates/:id/document | Export PDF |