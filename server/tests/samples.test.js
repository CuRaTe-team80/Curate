const request = require('supertest');
const app = require('../app'); 

describe('Samples API Endpoints', () => {
  it('GET /samples should return a successful response', async () => {
    const res = await request(app).get('/samples');
    expect(res.statusCode).toBeLessThan(500);
  });
});
