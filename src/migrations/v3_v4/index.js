'use strict';


module.exports = async () => {
    let manager,
        supplierValidator,
        org1, org2,
        supplier1, supplier2,
        employee1, employee2;

    // setup users
    const userCount = await strapi.service('plugin::users-permissions.user').count({});
    if (!userCount) {
        // setup admin user
        const managerRoles = await strapi.service('plugin::users-permissions.role').find({
            name: 'Manager'
        });
        const managerRole = managerRoles.find(role => role.type === 'manager');
        let role = managerRole ? managerRole.id : null;

        manager = await strapi.plugins['users-permissions'].services.user.add({
            name: 'ADMINISTRADOR',
            username: process.env.ADMIN_EMAIL,
            email: process.env.ADMIN_EMAIL,
            provider: "local",
            password: Math.random().toString(36).slice(-8),
            confirmed: true,
            blocked: null,
            role
        });

        // setup employee users
        const employeeRoles = await strapi.service('plugin::users-permissions.role').find({
            name: 'Employee'
        });
        const employeeRole = employeeRoles.find(role => role.type === 'employee');
        role = employeeRole ? employeeRole.id : null;

        supplierValidator = await strapi.plugins['users-permissions'].services.user.add({
            name: 'VALIDADOR DE PROVEEDORES',
            username: 'validador.proveedores@demios.es',
            email: 'validador.proveedores@demios.es',
            provider: "local",
            password: Math.random().toString(36).slice(-8),
            confirmed: true,
            blocked: null,
            supplierValidator: true,
            role
        });

        employee1 = await strapi.plugins['users-permissions'].services.user.add({
            name: 'EMPLEADO UNO',
            username: 'empleado1@demios.es',
            email: 'empleado1@demios.es',
            provider: "local",
            password: Math.random().toString(36).slice(-8),
            confirmed: true,
            blocked: null,
            supplierValidator: false,
            role
        });

        // setup test organizations
        const organizationsCount = await strapi.service('api::organization.organization').findOne({});
        if (!organizationsCount) {
            org1 = await strapi.service('api::organization.organization').create({ data: {
                name: 'Empresa de prueba 1',
                office: 'Madrid',
                email: 'info@empresaprueba1.com',
                supplierValidators: [supplierValidator.id]
            }});
            org2 = await strapi.service('api::organization.organization').create({ data: {
                name: 'Empresa de prueba 2',
                office: 'Madrid',
                email: 'info@empresaprueba2.com',
                supplierValidators: [supplierValidator.id]
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
    }
};
