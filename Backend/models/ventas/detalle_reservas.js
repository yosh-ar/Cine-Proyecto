const { DataTypes} = require('sequelize');
const db = require('../../db/config');

const SalaProgramacion = require('../../models/salas/DetalleSala');
const Venta = require('./Venta');

const DetalleReserva = db.define('detalle_reservas', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    fila: {
        type: DataTypes.STRING(1)
    },
    no_asiento: {
      type: DataTypes.INTEGER  
    },
  
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
});

DetalleReserva.belongsTo(SalaProgramacion,{
    foreignKey: {
    allowNull: false
}});
DetalleReserva.belongsTo(Venta,{
    foreignKey: {
    allowNull: false
}});

SalaProgramacion.hasMany(DetalleReserva)
Venta.hasMany(DetalleReserva)



module.exports = DetalleReserva;