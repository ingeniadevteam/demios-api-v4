const request = require('supertest');

// user mock data
const mockUserData = {
    username: "Manager",
    email: "manager@demios.es",
    provider: "local",
    password: "1234abc",
    confirmed: true,
    blocked: null,
};


it('should create a user and give him manger role', async () => {
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
    
    await request(strapi.server.httpServer)
    .get('/api/users/me?populate=role')
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + jwt)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body.id).toBe(user.id);
        expect(data.body.username).toBe(user.username);
        expect(data.body.email).toBe(user.email);

        expect(data.body.role).toBeDefined();
        expect(data.body.role.name).toBe('manager');
        expect(data.body.role.type).toBe('manager');
    });    
});
