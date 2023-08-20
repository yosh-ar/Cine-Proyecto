const {Router} = require('express');
const {check} = require('express-validator');


const {getReservaMovie,storeVenta} = require('../../controllers');
const {  DetalleSalaIdExist,
    salaIdExist,userIdExist} = require('../../helpers');
const {validarCampos,validarToken} = require('../../middlewares');

const router = Router();

router.get('/get_reservas', [
    check('id', 'Ingresa el id de sala').not().isEmpty(),
    check('id').custom(DetalleSalaIdExist),
    validarToken,
    validarCampos
],getReservaMovie);
router.post('/store', [
    check('usuario', 'El usuario del empleado es necesario').not().isEmpty(),
    check('data', 'El detalle es necesario'),
    check('detalleSalaId', 'Ingresa el id de sala').not().isEmpty(),
    check('detalleSalaId').custom(DetalleSalaIdExist),
    validarToken,
    validarCampos
],getReservaMovie);
module.exports = router;