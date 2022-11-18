'use strict';

module.exports = ({ env }) => ({
    email: {
        config: {
            provider: 'strapi-provider-email-console',
            settings: {
                defaultFrom: 'info@email.demios.es',
                defaultReplyTo: 'info@email.demios.es',
            },
        },
    }
});