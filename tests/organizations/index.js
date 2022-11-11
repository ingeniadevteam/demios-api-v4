const request = require('supertest');

it("should return hello world", async () => {
    await request(strapi.server.httpServer)
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + process.env.ADMIN_TOKEN)
    .expect('Content-Type', /json/)
    .get("/api/organizations")
    .expect(200) // Expect response http code 200
    .then((data) => {
        expect(data.name).toBe("Clysema");
    });
});
