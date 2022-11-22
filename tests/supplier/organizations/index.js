const request = require('supertest');

// user mock data
const mockUserData = {
    username: "Test Supplier",
    email: "supplier@demios.es",
    provider: "local",
    password: "1234abc",
    confirmed: true,
    blocked: null,
};


it('supplier should list organizations', async () => {
    /** Gets the default user role */
    const roles = await strapi.service('plugin::users-permissions.role').find({}, []);
    const supplierRole = roles.find(role => role.type === 'supplier');
    const role = supplierRole ? supplierRole.id : null;
   
    /** Creates a new user an push to database */
    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUserData,
        role,
    });

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    await request(strapi.server.httpServer)
    .get('/api/organizations')
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + jwt)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {        
        expect(data.body).toBeDefined();
        expect(data.body.data).toBeDefined();
        expect(Array.isArray(data.body.data)).toBe(true);
    });    
});
