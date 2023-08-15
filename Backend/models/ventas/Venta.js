const { DataTypes} = require('sequelize');
const db = require('../../db/config');
const User = require('../User/User');

const Venta = db.define('ventas', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    no_venta : {
        type: DataTypes.STRING(50),
    },
    fecha_venta: {
        type: DataTypes.DATEONLY,
    },
    fecha_hora: {
        type: DataTypes.DATE,
    },

    total_boletos : {
        type: DataTypes.INTEGER,
    },
    total_venta : {
        type: DataTypes.DECIMAL(10,2),
    },
  
    estado_venta: {
        type: DataTypes.BOOLEAN,
        defaultValue : true
    },
});

Venta.belongsTo(User,{
    foreignKey: {
    allowNull: false
}});

User.hasMany(Venta)


module.exports = Venta;