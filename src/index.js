'use strict';

const confRoles = require(`./roles.js`);

module.exports = {
    /**
    * An asynchronous register function that runs before
    * your application is initialized.
    *
    * This gives you an opportunity to extend code.
    */
    register(/*{ strapi }*/) {},
    
    /**
    * An asynchronous bootstrap function that runs before
    * your application gets started.
    *
    * This gives you an opportunity to set up your data model,
    * run jobs, or perform some special logic.
    */
    async bootstrap({ strapi }) {
        // setup roles
        const appRoles = await strapi.service('plugin::users-permissions.role').find();
        const updateRole = await strapi.service('plugin::users-permissions.role').updateRole;
        const createRole = await strapi.service('plugin::users-permissions.role').createRole;
        
        for (const confRole of confRoles) {
            const appRole = appRoles.find(r => r.type === confRole.name);
            if (!appRole) {
                strapi.log.debug(`bootstrap: creating '${confRole.name}' role`);
                await createRole(confRole);
            } else {
                strapi.log.debug(`bootstrap: updating role ${appRole.id} '${confRole.name}' role`);
                await updateRole(appRole.id, confRole);
            }
        }
    },
};
