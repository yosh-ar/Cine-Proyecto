
const UserController = require('./users/users.controller');
const salaController = require('./salas/sala.controller');

module.exports = {
    ...UserController,
    ...salaController
}