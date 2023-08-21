const validaUser = require('./users/user.helpers');
const validaProgramacion = require('./programacion/programacion.helper');



module.exports = {
    ...validaUser,
    ...validaProgramacion,
}