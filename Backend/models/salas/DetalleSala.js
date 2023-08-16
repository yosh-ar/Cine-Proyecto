const { DataTypes, Sequelize} = require('sequelize');
const db = require('../../db/config');
const Sala = require('./Sala');
const Programacion = require('./Programacion');

const DetalleSala = db.define('detalle_sala', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    idmovie: {
        type: DataTypes.INTEGER,
    },
    nombre_pelicula: {
        type: DataTypes.STRING(500),
    },
    fecha: {
        type:  DataTypes.DATEONLY,
    },
    fecha_hora: {
        type: DataTypes.DATE
    },
    hora: {
        type: DataTypes.TIME,
    },

    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
});

DetalleSala.belongsTo(Sala,{
    foreignKey: {
    allowNull: false
}});
DetalleSala.belongsTo(Programacion,{
    foreignKey: {
    allowNull: false
}});

Sala.hasMany(DetalleSala);
Programacion.hasMany(DetalleSala);


module.exports = DetalleSala;