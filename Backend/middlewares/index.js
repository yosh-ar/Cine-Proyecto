const validaCampos = require('./validacion/validar-campos');

const validarToken = require('./validacion/validaJWT');

module.exports = {
    ...validaCampos,
    validarToken,
}