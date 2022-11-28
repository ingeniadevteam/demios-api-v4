'use strict';

/**
 * supplier controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::supplier.supplier', ({ strapi }) => ({
    async update(ctx) {
        const { request, state, params } = ctx;
        const user = state.user;
        const supplierId = params.id;
        
        const supplier = await strapi.service('api::supplier.supplier').findOne(supplierId);
        
        // setup approvedBy
        if (request.body && request.body.data && request.body.data.status === 'accepted') {
            request.body.data.approvedBy = state.user.id;
        }

        if (
            // change from 'pending' => 'accepted
            supplier && supplier.status === 'pending' && 
            request.body && request.body.data && request.body.data.status === 'accepted'
        ) {
            const roles = await strapi.service('plugin::users-permissions.role').find({}, []);
            const supplierRole = roles.find(role => role.type === 'supplier');
            const role = supplierRole ? supplierRole.id : null;

            try {
                // create a user when approved
                const user = await strapi.plugins['users-permissions'].services.user.add({
                    name: supplier.name,
                    username: supplier.email,
                    email: supplier.email,
                    provider: "local",
                    password: Math.random().toString(36).slice(-8),
                    confirmed: true,
                    blocked: false,
                    role,
                    isSupplier: true,
                    supplier: [supplier.id]
                });

                // setup linked users
                if (!supplier.users) {
                    request.body.data.users = [user.id];
                } else {
                    if (supplier.users.indexOf(user.id) < 0) {
                        supplier.users.push(user.id);
                        request.body.data.users = supplier.users;
                    }
                }
            } catch (error) {
                strapi.log.error(`api::supplier.controller.update: ${error.message}`);
            }
        }

        const response = await super.update(ctx);

        return response;
    },
}));
