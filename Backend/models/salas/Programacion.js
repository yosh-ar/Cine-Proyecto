const { DataTypes, Sequelize} = require('sequelize');
const db = require('../../db/config');
const User = require('../User/User');

const Programacion = db.define('programacion', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    fecha: {
        type:  DataTypes.DATEONLY,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
});

Programacion.belongsTo(User,{
    foreignKey: {
    allowNull: false
}});

User.hasMany(Programacion);


module.exports = Programacion;