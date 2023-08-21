const {Router} = require('express');
const {check} = require('express-validator');



const {login,validarToken} = require('../controllers/auth.controller');
const router = Router();
const {validarCampos} = require('../middlewares');

router.post('/login', [
    check('user', 'El usuario no es valido'),
    check('password', 'Debe ingresar la contraseña').not().isEmpty(),
    validarCampos
], login)

router.post('/checkToken', validarToken);
module.exports = router;