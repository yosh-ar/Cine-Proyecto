
const UserController = require('./users/users.controller');
const salaController = require('./salas/sala.controller');
const VentaController = require('./ventas/venta.controller');
module.exports = {
    ...UserController,
    ...salaController,
    ...VentaController
}