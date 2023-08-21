const { DataTypes, Sequelize} = require('sequelize');
const db = require('../../db/config');
const TipoSala = require('./TipoSala');

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
    cantidad_filas: {
        type: DataTypes.INTEGER,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
});



Sala.belongsTo(TipoSala,{
    foreignKey: {
    allowNull: false
}});

TipoSala.hasMany(Sala)

module.exports = Sala;