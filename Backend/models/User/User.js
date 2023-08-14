const { DataTypes, Sequelize} = require('sequelize');
const db = require('../../db/config');
const Rol = require('./Rol');

const User = db.define('users', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    usuario: {
        type: DataTypes.STRING(50),
    },
    password: {
        type: DataTypes.STRING(500),
    },
    remember_token: {
        type: DataTypes.STRING(50),
    },
    estado_user: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
});
User.belongsTo(Rol,{
    foreignKey: {
    allowNull: false
}});

Rol.hasMany(User);


module.exports = User;