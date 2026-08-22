const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

const TEST_DB_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/curate_test';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth', () => {
  const testUser = { email: 'testuser@example.com', password: 'password123' };

  test('registers a new user successfully', async () => {
    const res = await request(app).post('/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  test('logs in an existing user and returns a token', async () => {
    await request(app).post('/auth/register').send(testUser);
    const res = await request(app).post('/auth/login').send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('rejects login with wrong password', async () => {
    await request(app).post('/auth/register').send(testUser);
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(400);
  });

  test('rejects access to a protected route without a token', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.statusCode).toBe(401);
  });
});