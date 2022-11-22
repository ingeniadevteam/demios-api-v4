const request = require('supertest');

it('public role should list organizations', async () => {
    await request(strapi.server.httpServer)
    .get('/api/organizations')
    .set('accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {        
        expect(data.body).toBeDefined();
        expect(data.body.data).toBeDefined();
        expect(Array.isArray(data.body.data)).toBe(true);
    });
});
