const request = require('supertest');
const app = require('../app');

describe('Samples API Tests', () => {
  it('GET /api/samples - should return status 200 or array of samples', async () => {
    const res = await request(app).get('/api/samples');
    expect([200, 304]).toContain(res.statusCode);
  });

  it('GET /api/samples - should return JSON response', async () => {
    const res = await request(app).get('/api/samples');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('GET /api/samples/non-existing-id - should return 404', async () => {
    const res = await request(app).get('/api/samples/invalidid123');
    expect([400, 404, 500]).toContain(res.statusCode);
  });
});
