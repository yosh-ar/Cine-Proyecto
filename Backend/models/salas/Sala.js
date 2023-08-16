const { DataTypes, Sequelize} = require('sequelize');
const db = require('../../db/config');

const Sala = db.define('salas', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    nombre: {
        type: DataTypes.STRING(50),
    },
    capacidad: {
        type: DataTypes.INTEGER,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
});


module.exports = Sala;