'use strict';

const payments = require('./payments');

module.exports = (result) => {
    return {
        subject: `Bienvenido a demios.es`,
        message_html: 
`Hola,
<br><br>
Bienvenido a Demios.
<br><br>
Ya puedes acceder a la plataforma de Campos Corporación usando tu email en:
<br><br>
<a href="http://demios.es">http://demios.es</a>
<br><br>
Gracias.`,
    
        message_text:
`Hola,

Bienvenido a Demios.

Ya puedes acceder a la plataforma de Campos Corporación usando tu email en:

http://demios.es

Gracias.
`,
    }
};
