'use strict';

const v3_v4_migration = require('./migrations/v3_v4');
const confRoles = require(`./roles.js`);
const passwordlessLinkTemplate = require('./templates/passwordless-link');
const userWelcome = require('./templates/user-welcome');

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
        // create the User afterCreate hook
        strapi.db.lifecycles.subscribe({
            models: ['plugin::users-permissions.user'],
            async afterCreate(event) {
                const { result, params } = event;
                const template = userWelcome(result);

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
            },
        })

        // setup plugin::passwordless.passwordless
        try {
            const passwordlessSettings = {
                enabled: true,
                createUserIfNotExists: false,
                expire_period: 3600,
                confirmationUrl: process.env.UI_URL,
                from_name: 'Demios',
                from_email: 'info@email.demios.es',
                response_email: '',
                token_length: 20,
                object: 'Enlace de acceso a Demios',
                message_html: passwordlessLinkTemplate.message_html,
                message_text: passwordlessLinkTemplate.message_text
            };
            const pluginStore = strapi.store({
                environment: '',
                type: 'plugin',
                name: 'passwordless',
            });
            await pluginStore.set({key: 'settings', value: passwordlessSettings});
            strapi.log.info('Passwordless settings set');
        } catch (error) {
            console.log(error);
        }

        // setup roles
        const appRoles = await strapi.service('plugin::users-permissions.role').find();
        const updateRole = await strapi.service('plugin::users-permissions.role').updateRole;
        const createRole = await strapi.service('plugin::users-permissions.role').createRole;
        
        for (const confRole of confRoles) {
            const appRole = appRoles.find(r => r.name === confRole.name);
            if (!appRole) {
                strapi.log.debug(`bootstrap: creating '${confRole.name}' role`);
                await createRole(confRole);
            } else {
                strapi.log.debug(`bootstrap: updating role ${appRole.id} '${confRole.name}' role`);
                await updateRole(appRole.id, confRole);
            }
        }

        // run migrations
        try {
            await v3_v4_migration();
        } catch (error) {
            console.log(error);
        }
    },
};
