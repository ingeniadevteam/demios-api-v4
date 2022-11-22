const request = require('supertest');

// user mock data
const mockSupplierData = {
    name: "Test Supplier",
    email: "supplier@strapi.com",
    business: "Test Company",
    taxid: "A123456789",
    type: 'supplier',
    paymentMethod: 'transfer',
    bic: 'ES0000000000000000',
    terms: true,
    status: 'pending',
};

it('public role register a supplier', async () => {
    await request(strapi.server.httpServer)
    .post('/api/suppliers')
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({ data: mockSupplierData })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
        expect(data.body).toBeDefined();
        expect(data.body.data).toBeDefined();
        expect(data.body.data.attributes).toBeDefined();
        expect(data.body.data.attributes.name).toBe('Test Supplier');
    });
});
