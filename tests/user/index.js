const request = require('supertest');

// user mock data
const mockUserData = {
    username: "tester",
    email: "test@strapi.com",
    provider: "local",
    password: "1234abc",
    confirmed: true,
    blocked: null,
};

// it("should login user and return jwt token", async () => {
//     /** Creates a new user and save it to the database */
//     await strapi.plugins["users-permissions"].services.user.add({
//         ...mockUserData,
//     });
    
//     await request(strapi.server.httpServer)
//     .post("/api/auth/local")
//     .set("accept", "application/json")
//     .set("Content-Type", "application/json")
//     .send({
//         identifier: mockUserData.email,
//         password: mockUserData.password,
//     })
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .then((data) => {
//         expect(data.body.jwt).toBeDefined();
//     });
// });

// it('should return users data and role for authenticated user', async () => {
//     /** Gets the default user role */
//     const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
    
//     const role = defaultRole ? defaultRole.id : null;
    
//     /** Creates a new user an push to database */
//     const user = await strapi.plugins['users-permissions'].services.user.add({
//         ...mockUserData,
//         username: 'test',
//         email: 'test@strapi.com',
//         role,
//     });
    
//     const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
//         id: user.id,
//     });
    
//     await request(strapi.server.httpServer)
//     .get('/api/users/me?populate=role')
//     .set('accept', 'application/json')
//     .set('Content-Type', 'application/json')
//     .set('Authorization', 'Bearer ' + jwt)
//     .expect('Content-Type', /json/)
//     .expect(200)
//     .then(data => {
//         expect(data.body).toBeDefined();
//         expect(data.body.id).toBe(user.id);
//         expect(data.body.username).toBe(user.username);
//         expect(data.body.email).toBe(user.email);

//         expect(data.body.role).toBeDefined();
//         expect(data.body.role.id).toBe(1);
//         expect(data.body.role.name).toBe('Authenticated');
//         expect(data.body.role.type).toBe('authenticated');
//     });    
// });


it("should email user with login link", async () => {
    /** Creates a new user and save it to the database */
    await strapi.plugins["users-permissions"].services.user.add({
        confirmed: true,
        email: 'test@strapi.com',
        username: 'passwordless'
    });

    await request(strapi.server.httpServer)
    .post("/api/passwordless/send-link")
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .send({
        email: 'test@strapi.com',
    })
    .expect("Content-Type", /json/)
    // .expect(200)
    .then((data) => {
        if (data.body.error) {
            console.log(data.body.error.message);

        }
    })
    .catch(error => {
        console.log('error', error);
    });
});