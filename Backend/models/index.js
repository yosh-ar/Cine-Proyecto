const Rol = require('./User/Rol');
const User = require('./User/User');

const Sala = require('./salas/Sala');
const DetalleSala = require('./salas/DetalleSala');
const Programacion = require('./salas/Programacion');


const Venta = require('./ventas/Venta');
const DetalleVenta = require('./ventas/detalle_venta');
const DetalleReserva = require('./ventas/detalle_reservas');

module.exports = {
    Rol,
    User,
    Sala,
    Programacion,
    DetalleSala,
    Venta,
    DetalleVenta,
    DetalleReserva
}