module.exports = {
    init: (providerOptions = {}, settings = {}) => {
        return {
            send: async options => {
                return new Promise(resolve => {
                    strapi.log.debug(`SendEmail mock: '${settings.defaultFrom}' => '${options.to}'`);
                    strapi.log.debug(`subject: ${options.subject}`);
                    strapi.log.debug(`text: ${options.text}`);
                    strapi.log.debug(`html:`);
                    console.log(options.html);
                    resolve();
                });
            },
        };
    },
};
  