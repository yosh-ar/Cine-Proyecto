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
              }
              .header {
                background-color: #007bff;
                color: white;
                text-align: center;
                padding: 10px 0;
                border-radius: 10px 10px 0 0;
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
              <p>Película: Avengers: Endgame</p>
              <p>Fecha: 15 de agosto de 2023</p>
              <p>Hora: 19:00</p>
              <p>Número de asientos: 2</p>
              <p>Total: $20.00</p>
            </div>
            
            <p>¡Disfruta de la película!</p>
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