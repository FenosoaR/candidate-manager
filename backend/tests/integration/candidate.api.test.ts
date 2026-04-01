import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import { Candidate } from '../../src/models/Candidate';
import { connectDB } from '../../src/config/database';

let mongod: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  await connectDB(mongod.getUri());
  token = jwt.sign({ id: 'test-user', email: 'test@test.com' }, 'test-secret', { expiresIn: '1h' });
});

afterAll(async () => { await mongoose.disconnect(); await mongod.stop(); });
afterEach(async () => { await Candidate.deleteMany({}); });

const auth = () => ({ Authorization: `Bearer ${token}` });
const candidatePayload = { firstName: 'Alice', lastName: 'Martin', email: 'alice@test.com', position: 'QA' };

describe('POST /api/candidates', () => {
  it('creates a candidate (201)', async () => {
    const res = await request(app).post('/api/candidates').set(auth()).send(candidatePayload);
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('alice@test.com');
  });

  it('rejects invalid payload (400)', async () => {
    const res = await request(app).post('/api/candidates').set(auth()).send({ email: 'bad' });
    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
  });

  it('rejects duplicate email (409)', async () => {
    await request(app).post('/api/candidates').set(auth()).send(candidatePayload);
    const res = await request(app).post('/api/candidates').set(auth()).send(candidatePayload);
    expect(res.status).toBe(409);
  });

  it('blocks unauthenticated (401)', async () => {
    const res = await request(app).post('/api/candidates').send(candidatePayload);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/candidates/:id', () => {
  it('returns a candidate (200)', async () => {
    const created = await request(app).post('/api/candidates').set(auth()).send(candidatePayload);
    const res = await request(app).get(`/api/candidates/${created.body._id}`).set(auth());
    expect(res.status).toBe(200);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get(`/api/candidates/${new mongoose.Types.ObjectId()}`).set(auth());
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/candidates/:id', () => {
  it('updates a candidate (200)', async () => {
    const created = await request(app).post('/api/candidates').set(auth()).send(candidatePayload);
    const res = await request(app).put(`/api/candidates/${created.body._id}`).set(auth()).send({ position: 'Senior QA' });
    expect(res.status).toBe(200);
    expect(res.body.position).toBe('Senior QA');
  });
});

describe('DELETE /api/candidates/:id', () => {
  it('soft deletes (200)', async () => {
    const created = await request(app).post('/api/candidates').set(auth()).send(candidatePayload);
    const res = await request(app).delete(`/api/candidates/${created.body._id}`).set(auth());
    expect(res.status).toBe(200);
  });
});

describe('POST /api/candidates/:id/validate', () => {
  it('validates a candidate (200)', async () => {
    jest.setTimeout(10000);
    const created = await request(app).post('/api/candidates').set(auth()).send(candidatePayload);
    const res = await request(app).post(`/api/candidates/${created.body._id}/validate`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('validated');
  });
});

describe('Security', () => {
  it('blocks NoSQL injection attempt', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .set(auth())
      .send({ email: { $gt: '' }, firstName: 'hack', lastName: 'hack', position: 'hack' });
    expect([400, 409]).toContain(res.status);
  });
});