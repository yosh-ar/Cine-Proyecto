const { DataTypes, Sequelize} = require('sequelize');
const db = require('../../db/config');

const Rol = db.define('roles', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    rol: {
        type: DataTypes.STRING(50),
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
});


module.exports = Rol;