'use strict';


module.exports = {
    message_html: `<p>Hola!</p>
<p>Por favor, haz click en el enlace de abajo para acceder a Demios.</p>
<p><%= URL %>/login?loginToken=<%= CODE %></p>
<p>Gracias.</p>`,

    message_text: `Hola!
Por favor, haz click en el enlace de abajo para acceder a Demios.
<%= URL %>/login?loginToken=<%= CODE %>
Gracias.`,

};
