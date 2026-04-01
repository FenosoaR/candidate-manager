import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { CandidateService } from '../../src/services/candidate.service'
import { Candidate } from '../../src/models/Candidate'

let mongod: MongoMemoryServer
let service: CandidateService

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
  service = new CandidateService()
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

afterEach(async () => {
  await Candidate.deleteMany({})
})

const base = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean@test.com',
  position: 'Dev',
}

describe('CandidateService — 100% coverage', () => {

  // ── create ──────────────────────────────────────────────
  describe('create()', () => {
    it('crée un candidat avec statut pending', async () => {
      const c = await service.create(base)
      expect(c.email).toBe('jean@test.com')
      expect(c.status).toBe('pending')
    })

    it('lève EMAIL_EXISTS si email déjà utilisé', async () => {
      await service.create(base)
      await expect(service.create(base)).rejects.toThrow('EMAIL_EXISTS')
    })
  })

  // ── findById ─────────────────────────────────────────────
  describe('findById()', () => {
    it('retourne le candidat existant', async () => {
      const c = await service.create(base)
      const found = await service.findById(c.id)
      expect(found?.email).toBe('jean@test.com')
    })

    it('retourne null pour un id inconnu', async () => {
      const found = await service.findById(new mongoose.Types.ObjectId().toString())
      expect(found).toBeNull()
    })
  })

  // ── update ───────────────────────────────────────────────
  describe('update()', () => {
    it('met à jour le poste', async () => {
      const c = await service.create(base)
      const updated = await service.update(c.id, { position: 'Lead Dev' })
      expect(updated?.position).toBe('Lead Dev')
    })

    it('retourne null pour un id inconnu', async () => {
      const result = await service.update(
        new mongoose.Types.ObjectId().toString(),
        { position: 'X' }
      )
      expect(result).toBeNull()
    })
  })

  // ── softDelete ───────────────────────────────────────────
  describe('softDelete()', () => {
    it('masque le candidat (soft delete)', async () => {
      const c = await service.create(base)
      await service.softDelete(c.id)
      const found = await service.findById(c.id)
      expect(found).toBeNull()
    })

    it('retourne null pour un id inconnu', async () => {
      const result = await service.softDelete(
        new mongoose.Types.ObjectId().toString()
      )
      expect(result).toBeNull()
    })
  })

  // ── validate ─────────────────────────────────────────────
  describe('validate()', () => {
    it('valide un candidat après 2s', async () => {
      jest.setTimeout(10000)
      const c = await service.create(base)
      const validated = await service.validate(c.id)
      expect(validated?.status).toBe('validated')
      expect(validated?.validatedAt).toBeDefined()
    })

    it('retourne null pour un id inconnu', async () => {
      jest.setTimeout(10000)
      const result = await service.validate(
        new mongoose.Types.ObjectId().toString()
      )
      expect(result).toBeNull()
    })
  })

  // ── findAll ──────────────────────────────────────────────
  describe('findAll()', () => {
    it('retourne liste vide quand aucun candidat', async () => {
      const result = await service.findAll()
      expect(result.data).toHaveLength(0)
      expect(result.total).toBe(0)
    })

    it('pagine correctement', async () => {
      await Promise.all([
        service.create({ ...base, email: 'a@test.com' }),
        service.create({ ...base, email: 'b@test.com' }),
        service.create({ ...base, email: 'c@test.com' }),
      ])
      const page1 = await service.findAll(1, 2)
      expect(page1.data).toHaveLength(2)
      expect(page1.total).toBe(3)

      const page2 = await service.findAll(2, 2)
      expect(page2.data).toHaveLength(1)
    })

    it('recherche par firstName', async () => {
      await service.create(base)
      const result = await service.findAll(1, 10, 'Jean')
      expect(result.data[0].firstName).toBe('Jean')
    })

    it('recherche par lastName', async () => {
      await service.create(base)
      const result = await service.findAll(1, 10, 'Dupont')
      expect(result.data[0].lastName).toBe('Dupont')
    })

    it('recherche par position', async () => {
      await service.create(base)
      const result = await service.findAll(1, 10, 'Dev')
      expect(result.data[0].position).toBe('Dev')
    })

    it('retourne vide si recherche sans correspondance', async () => {
      await service.create(base)
      const result = await service.findAll(1, 10, 'ZZZNOMATCH')
      expect(result.data).toHaveLength(0)
    })
  })
})