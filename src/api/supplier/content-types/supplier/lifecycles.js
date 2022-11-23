'use strict';

/**
 * Lifecycle callbacks for the `supplier` model.
 */

const supplierSignupTemplate = require('../../../../templates/supplier-signup');
const supplierRejectedTemplate = require('../../../../templates/supplier-rejected');

module.exports = {
    async afterCreate(event) {
        const { result, params } = event;

        const managers = await strapi.plugins['users-permissions'].services.user.fetchAll({
            "supplierValidator": true
        });

        const template = supplierSignupTemplate(result);
        const emails = managers.map(m => m.email);
        const unique = [...new Set(emails)];

        try {
            await strapi.plugins['email'].services.email.send({
                to: unique,
                subject: template.subject,
                text: template.message_text,
                html: template.message_html,
            });
        } catch (error) {
            strapi.log.error(`supplierAfterCreate: ${error.message}`);
        }
    },

    async afterUpdate(event) {
        const { result, params } = event;

        if (params.data.status === 'rejected') {
            await strapi.plugins['users-permissions'].services.user.remove({
                email: result.email,
            });

            const template = supplierRejectedTemplate(result);

            try {
                await strapi.plugins['email'].services.email.send({
                    to: result.email,
                    subject: template.subject,
                    text: template.message_text,
                    html: template.message_html,
                });
            } catch (error) {
                strapi.log.error(`supplierBeforeUpdate: ${error.message}`);
            }
            return;
        }
    },

    async beforeUpdate(event) {
        const { model, params } = event;

        if (params.data.status === 'accepted') {
            const supplier = await strapi.service('api::supplier.supplier').findOne(params.where.id);
            const roles = await strapi.service('plugin::users-permissions.role').find({}, []);
            const supplierRole = roles.find(role => role.type === 'supplier');
            const role = supplierRole ? supplierRole.id : null;

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
        }
    }
};