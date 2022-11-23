'use strict';

const payments = require('./payments');

module.exports = (result) => {
    return {
        subject: `La empresa ${result.business} se ha registrado como proveedor en demios.es`,
        message_html: 
`Hola,
<br><br>
<h2><a href="http://demios.es/#/suppliers/${result.id}">Validar proveedor</a></h2>
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
Saludos.`,
    
        message_text:
`Hola,

Enlace para validar:
http://demios.es/#/suppliers/${result.id}

Datos de registro:

Email: ${result.email}
Nombre: ${result.name}
Empresa: ${result.business}
CIF: ${result.taxid}

Método de pago pactado: ${payments[result.paymentMethod]}

Saludos.`,
    }
};
