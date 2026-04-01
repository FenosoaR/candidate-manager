# Candidate Manager

## CI / Coverage

- Tests exécutés via GitHub Actions
- Couverture : 100% sur services et modèles backend


## Présentation

Application fullstack de gestion de candidats avec :

- Authentification sécurisée (JWT)
- CRUD complet
- Validation métier
- Tests complets (unitaires, intégration, E2E, sécurité, performance)

---

##  Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Node.js · Express · TypeScript · MongoDB |
| Frontend | React · TypeScript · Vite |
| Tests | Jest · Vitest · Playwright · k6 |
| CI/CD | GitHub Actions · Codecov |
| Deploy | Docker · Render |

---

##  Installation

### Option 1 — Docker (recommandé)

```bash
git clone https://github.com/FenosoaR/candidate-manager.git
cd candidate-manager
docker-compose up --build
Frontend : http://localhost:3000
Backend : http://localhost:3001/health
Login : admin@test.com / Admin1234!
Option 2 — Local
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

Lancer les tests
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# E2E
cd frontend && npm run test:e2e

# Tests de charge
k6 run k6/load-test.js
 Stratégie de tests
Type	Outil	Cible	Objectif
Unitaires	Jest	Services + modèles backend	100% coverage
Unitaires	Vitest	Hooks frontend	100% coverage
Intégration	Supertest + MongoMemoryServer	Endpoints API	Validation complète
Intégration	MSW	Frontend	Simulation API
E2E	Playwright	Parcours utilisateur complet	Connexion → CRUD
Sécurité	Supertest	Brute force, injection NoSQL	Protection API
Charge	k6	POST /api/candidates	500 utilisateurs

 Rapport de couverture
Backend
services/candidate.service.ts : 100%
models/Candidate.ts         : 100%
Frontend
hooks/useCandidate.ts  : 100%
hooks/useCandidates.ts : 100%

Rapport de performance (k6)
Configuration
500 utilisateurs virtuels
Durée : 30 secondes
Endpoint : POST /api/candidates
Résultats
http_req_duration : avg=702ms  p(95)=461ms  max=29.8s
http_req_failed   : 99.61%
http_reqs         : ~598 req/s

Analyse
Temps de réponse performant (p95 < 500ms)
Taux d’échec élevé (~99%)
Causes identifiées :

Rate limiting actif (protection sécurité)
Conflits de données (emails uniques)
Saturation sous forte charge
Conclusion

L’API est rapide mais non optimisée pour une forte charge simultanée.
Les mécanismes de sécurité fonctionnent correctement mais impactent les performances en test de charge.


Ce test met volontairement en évidence les limites du système pour démontrer une démarche d’analyse.

 Architecture
React → Express API → MongoDB

Sécurité
Authentification JWT
Rate limiting
Validation Zod
Protection contre injection NoSQL
Soft delete

API
Méthode	Route
POST	/api/auth/login
GET	/api/candidates
POST	/api/candidates
PUT	/api/candidates/:id
DELETE	/api/candidates/:id

Déploiement

Le projet est prêt à être déployé sur Render avec MongoDB Atlas.

Configuration prévue :

Backend : Web Service (Node.js)
Frontend : Static Site (Vite)
Base de données : MongoDB Atlas

Le déploiement n’a pas été finalisé par manque de temps, mais toute la configuration est prête.

👤 Auteur

Fenosoa Andria