'use strict';

const payments = require('./payments');

module.exports = (result) => {
    return {
        subject: `Has sido rechazado como proveedor en demios.es`,
        message_html: 
`Hola,
<br><br>
Sentimos comunicarte que has sido rechazado como proveedor en demios.es.
<br><br>
Gracias y disculpa las molestias.`,
    
        message_text:
`Hola,

Sentimos comunicarte que has sido rechazado como proveedor en demios.es.

Gracias y disculpa las molestias.
`,
    }
};
