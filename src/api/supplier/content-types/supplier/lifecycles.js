'use strict';

/**
 * Lifecycle callbacks for the `supplier` model.
 */

const payments = {
    'confirming': 'Confirming',
    'transfer': 'Transferencia',
    'note': 'Pagaré',
    'bill': 'Recibo',
    'order': 'Giro',
    'other': 'Otro'
};

module.exports = {
    async afterCreate(event) {
        let subject, text, html, emails, unique;

        const { result, params } = event;

        const managers = await strapi.plugins['users-permissions'].services.user.fetchAll({
            "supplierValidator": true
        });

        emails = managers.map(m => m.email);
        
subject = `${result.name} de la empresa ${result.business}, se ha registrado como proveedor en demios.es`;
text = `Hola,

Enlace para validar:
http://demios.es/#/suppliers/${result.id}

Datos de registro:

Email: ${result.email}
Nombre: ${result.name}
Empresa: ${result.business}
CIF: ${result.taxid}

Método de pago pactado: ${payments[result.paymentMethod]}

Saludos.
`;
html = `Hola,
<br><br>
<h2><a href="http://demios.es/#/suppliers/${result.id}">Validar</a></h2>
<br><br>
<b>Datos de registro:</b>
<br><br>
Email de usuario: <b>${result.email}</b><br>
Nombre de usuario: <b>${result.name}</b><br>
Empresa: <b>${result.business}</b><br>
CIF: <b>${result.taxid}</b><br>
<br>
Método de pago pactado: <b>${payments[result.paymentMethod]}</b><br>
<br>
Saludos.`;

    unique = [...new Set(emails)];

    try {
        await strapi.plugins['email'].services.email.send({
            to: unique,
            subject,
            text,
            html,
        });
    } catch (error) {
        strapi.log.error(error.message);
    }







    },







};