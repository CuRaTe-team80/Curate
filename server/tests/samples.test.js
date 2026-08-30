const request = require('supertest');
const app = require('../app');

describe('Server API Endpoints', () => {
  it('GET /api/samples - should return status 200 or 304', async () => {
    const res = await request(app).get('/api/samples');
    expect([200, 304]).toContain(res.statusCode);
  });

  it('GET /api/samples - should return JSON content', async () => {
    const res = await request(app).get('/api/samples');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('GET /api/samples/non-existent-id - should handle error status', async () => {
    const res = await request(app).get('/api/samples/invalidid123');
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});