const fs = require('fs');
const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");

beforeAll(async () => {
    await setupStrapi();
});

afterAll(async () => {
    await cleanupStrapi();
});

it("strapi is defined", () => {
    expect(strapi).toBeDefined();
});


// require('./public');
require('./public/signup');

// require('./user');

// require('./manager');
// require('./manager/organizations');

// require('./supplier');
// require('./supplier/organizations');