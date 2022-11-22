'use strict';


module.exports = async () => {
    let manager, org1, org2, supplier1, supplier2

    // setup admin user
    const userCount = await strapi.service('plugin::users-permissions.user').count({});
    if (!userCount) {
        const roles = await strapi.service('plugin::users-permissions.role').find({
            name: 'Manager'
        });
        const managerRole = roles.find(role => role.type === 'manager');
        const role = managerRole ? managerRole.id : null;

        manager = await strapi.plugins['users-permissions'].services.user.add({
            username: process.env.ADMIN_EMAIL,
            email: process.env.ADMIN_EMAIL,
            provider: "local",
            password: Math.random().toString(36).slice(-8),
            confirmed: true,
            blocked: null,
            role
        });
    }

    // setup test organizations
    const organizationsCount = await strapi.service('api::organization.organization').findOne({});
    if (!organizationsCount) {
        org1 = await strapi.service('api::organization.organization').create({ data: {
            name: 'Empresa de prueba 1',
            office: 'Madrid',
            email: 'info@empresaprueba1.com'
        }});
        org2 = await strapi.service('api::organization.organization').create({ data: {
            name: 'Empresa de prueba 1',
            office: 'Madrid',
            email: 'info@empresaprueba1.com'
        }});
    }

    // setup suppliers
    const suppliersCount = await strapi.service('api::supplier.supplier').findOne({});
    if (!suppliersCount) {
        supplier1 = await strapi.service('api::supplier.supplier').create({ data: {
            name: "Proveedor de prueba 1",
            email: "supplier1@strapi.com",
            business: 'Empresa proveedora 1',
            taxid: "A123456789",
            type: 'supplier',
            paymentMethod: 'transfer',
            bic: 'ES0000000000000001',
            terms: true,
            status: 'pending',
        }});
        supplier2 = await strapi.service('api::supplier.supplier').create({ data: {
            name: "Proveedor de prueba 2",
            email: "supplier2@strapi.com",
            business: 'Empresa proveedora 2',
            taxid: "A987654321",
            type: 'supplier',
            paymentMethod: 'transfer',
            bic: 'ES0000000000000002',
            terms: true,
            status: 'pending',
        }});
    }
};
