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

afterEach(async () => { await Candidate.deleteMany({}) })

const base = { firstName: 'Test', lastName: 'User', email: 'test@cov.com', position: 'Dev' }

describe('CandidateService - edge cases for 100% coverage', () => {
  it('update returns null for unknown id', async () => {
    const result = await service.update(new mongoose.Types.ObjectId().toString(), { position: 'X' })
    expect(result).toBeNull()
  })

  it('softDelete returns null for unknown id', async () => {
    const result = await service.softDelete(new mongoose.Types.ObjectId().toString())
    expect(result).toBeNull()
  })

  it('validate returns null for unknown id', async () => {
    jest.setTimeout(10000)
    const result = await service.validate(new mongoose.Types.ObjectId().toString())
    expect(result).toBeNull()
  })

  it('findAll returns empty array when no candidates', async () => {
    const result = await service.findAll()
    expect(result.data).toHaveLength(0)
    expect(result.total).toBe(0)
  })

  it('findAll with search returns empty when no match', async () => {
    await service.create(base)
    const result = await service.findAll(1, 10, 'ZZZ_NO_MATCH')
    expect(result.data).toHaveLength(0)
  })

  it('findAll searches by lastName', async () => {
    await service.create(base)
    const result = await service.findAll(1, 10, 'User')
    expect(result.data[0].lastName).toBe('User')
  })

  it('findAll searches by position', async () => {
    await service.create(base)
    const result = await service.findAll(1, 10, 'Dev')
    expect(result.data[0].position).toBe('Dev')
  })

  it('findAll paginates correctly on page 2', async () => {
    await Promise.all([
      service.create({ ...base, email: 'p1@cov.com' }),
      service.create({ ...base, email: 'p2@cov.com' }),
      service.create({ ...base, email: 'p3@cov.com' }),
    ])
    const result = await service.findAll(2, 2)
    expect(result.data).toHaveLength(1)
    expect(result.total).toBe(3)
  })
})