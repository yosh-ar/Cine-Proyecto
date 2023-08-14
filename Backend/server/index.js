const express = require('express');
const cors = require('cors');
const sequelize = require('../db/config')

require('./index')
// MEJORES PRACTICAS, CREANDO UNA CLASE QUE SE ENCARGARA DE NUESTRO SERVER Y RUTAS
class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        
        // PATH USER
        this.paths = {
            auth: '/api/auth',
            users: '/api/users',
        };
        
        // conexion
        this.conexion();
        // Middlewares
        this.middlewares();
        
        // Routes
        this.routes();

    }
    async conexion(){
        try {
            await sequelize.sync();
            console.log('Connection has been established successfully.');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }
    middlewares(){
        // corss
        this.app.use(cors())
        
        // Lectura y parseo del body
        // basicamente cofiguramos el tipo de dato que recibimos
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());

        // pintara lo que tenga la carpeta public
        this.app.use(express.static('public'));
    }

    // se encargara de controlar las rutas
    routes(){
        this.app.use(this.paths.auth, require('../routers/auth.routes'));
        this.app.use(this.paths.users, require('../routers/users/users.routes'));
    }
    // se encarga de encender nuestro servidor
    listen(){
        this.app.listen(this.port, ()=>{
            console.log('corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;


 

 
