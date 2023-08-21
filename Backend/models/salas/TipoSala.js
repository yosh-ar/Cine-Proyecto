const { DataTypes, Sequelize} = require('sequelize');
const db = require('../../db/config');

const TipoSala = db.define('tipo_salas', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    nombre: {
        type: DataTypes.STRING(50),
    },
    valor: {
        type: DataTypes.DECIMAL(10,2),
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
});


module.exports = TipoSala;