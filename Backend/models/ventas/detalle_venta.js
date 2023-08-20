const { DataTypes} = require('sequelize');
const db = require('../../db/config');
const Venta = require('./Venta');

const DetalleVenta = db.define('detalle_ventas', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    precio: {
        type: DataTypes.DECIMAL(10,2),
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

DetalleVenta.belongsTo(Venta,{
    foreignKey: {
    allowNull: false
}});

Venta.hasMany(DetalleVenta)


module.exports = Venta;