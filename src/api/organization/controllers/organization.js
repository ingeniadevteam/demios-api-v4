'use strict';

/**
* organization controller
*/

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::organization.organization', ({ strapi }) => ({
    async find(ctx) {
        const { query, state } = ctx;
        const user = state.user;
        
        if (!user || user.role.type !== 'manager') {
            query.populate = '',
            query.fields = [
                'name',
                'office',
                'supplierValidators'
            ];
        }

        // Calling the default core action
        const { data, meta } = await super.find(ctx);
        return { data, meta };
    },
    async findOne(ctx) {
        const { id } = ctx.params;
        const { query, state } = ctx;
        const user = state.user;

        if (user.role.type !== 'manager') {
            query.populate = '',
            query.fields = [
                'name',
                'office',
                'supplierValidators'
            ];
        }
        
        const entity = await strapi.service('api::organization.organization').findOne(id, query);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        
        return this.transformResponse(sanitizedEntity);
    },
}));

