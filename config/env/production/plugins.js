'use strict';

module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
            providerOptions: {
                bucketName: 'facturas_proveedores',
                publicFiles: true,
                uniform: false,
                serviceAccount: env.json('GCS_SERVICE_ACCOUNT'),
                baseUrl: 'https://storage.googleapis.com/{bucket-name}',
                basePath: '',
            },
        }
    },
    email: {
        config: {
            provider: 'mailgun',
            providerOptions: {
                key: env('MAILGUN_API_KEY'),
                domain: env('MAILGUN_DOMAIN'),
                url: env('MAILGUN_URL', 'https://api.mailgun.net'),
            },
            settings: {
                defaultFrom: 'info@email.demios.es',
                defaultReplyTo: 'info@email.demios.es',
            },
        },
    }
});
