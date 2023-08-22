const nodemailer = require('nodemailer');




const enviarCorreo = async (data) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MAIL,
          pass: process.env.PASSEMAIL
        }
      });

      const mailOptions = {
        from: process.env.MAIL,
        to: data.email,
        subject: 'Prueba BB',
        html: `
      <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
              }
              .ticket {
                background-color: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                text-align: center; /* Centro de contenido */
              }
              .header {
                background-color: #007bff;
                color: white;
                text-align: center;
                padding: 10px 0;
                border-radius: 10px 10px 0 0;
              }
              .header img {
                width: 80px; /* Ajustar el tamaño según necesites */
              }
              h2 {
                color: #007bff;
                margin-top: 0;
              }
              p {
                margin: 5px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
           
              <h2>¡Gracias por tu compra!</h2>
            </div>

            <div class="ticket">
              <h3>Detalles del boleto</h3>
              <p>Película: ${data.movie}</p>
              <p>Fecha: ${data.fecha}</p>
              <p>Hora: ${data.hora}</p>
              <p>Sala: ${data.sala}</p>
              <p>Número de asientos: ${data.asientos}</p>
              <p>Total: Q ${data.total}</p>
            </div>

            <p style="text-align: center;">¡Disfruta de la película!</p>
          </body>
          </html>

      `
      };
      
      // Detalles del correo electrónico
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error al enviar el correo:', error);
            return false;
          } else {
              console.log('Correo electrónico enviado:', info.response);
            return true;
          }
        });
}

module.exports ={
    enviarCorreo
}

{/* <img src="ruta_del_logotipo.png" alt="Logo de la compañía"> <!-- Agregar la ruta correcta del logotipo -->/\ */}