const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Sample = require('../models/Sample');

const TEST_DB_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/curate_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
  await Sample.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Samples API', () => {
  it('GET /samples returns 200 and an array', async () => {
    const res = await request(app).get('/samples');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /samples returns JSON', async () => {
    const res = await request(app).get('/samples');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('GET /samples/:id returns 404 for a non-existent id', async () => {
    const res = await request(app).get('/samples/507f1f77bcf86cd799439011');
    expect(res.statusCode).toBe(404);
  });

  it('GET /samples/:id returns 400 for a malformed id', async () => {
    const res = await request(app).get('/samples/not-a-valid-id');
    expect(res.statusCode).toBe(400);
  });

  it('POST /samples creates a sample and returns it', async () => {
    const res = await request(app)
      .post('/samples')
      .send({ content: 'test sample', type: 'text' });
    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe('test sample');
  });
});