
const UserController = require('./users/users.controller');
const salaController = require('./salas/sala.controller');
const VentaController = require('./ventas/venta.controller');
const ReporteController = require('./ventas/reportes.controller');
module.exports = {
    ...UserController,
    ...salaController,
    ...VentaController,
    ...ReporteController
}