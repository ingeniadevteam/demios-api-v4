const request = require('supertest');

// user mock data
const mockUserData = {
    username: "OrgManager1",
    email: "orgmanager1@demios.es",
    provider: "local",
    password: "1234abc",
    confirmed: true,
    blocked: null,
};


it('manager should create an organization', async () => {
    /** Gets the default user role */
    const roles = await strapi.service('plugin::users-permissions.role').find({}, []);
    const managerRole = roles.find(role => role.type === 'manager');
    const role = managerRole ? managerRole.id : null;
   
    /** Creates a new user an push to database */
    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUserData,
        role,
    });

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    const organization = {
        name: 'ACME'
    };

    await request(strapi.server.httpServer)
    .post('/api/organizations')
    // .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + jwt)
    .send({ data: organization })
    // .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body.data).toBeDefined();
        expect(data.body.data.attributes).toBeDefined();
        expect(data.body.data.attributes.name).toBe('ACME');
    });    
});


it('manager should list organizations', async () => {
    /** Gets the default user role */
    const roles = await strapi.service('plugin::users-permissions.role').find({}, []);
    const managerRole = roles.find(role => role.type === 'manager');
    const role = managerRole ? managerRole.id : null;
   
    /** Creates a new user an push to database */
    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUserData,
        username: "OrgManager2",
        email: "orgmanager2@demios.es",
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
