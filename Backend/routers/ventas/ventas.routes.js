const {Router} = require('express');
const {check} = require('express-validator');


const {getReservaMovie,storeVenta,tikeketsVendidosFechas} = require('../../controllers');
const {  DetalleSalaIdExist,
    salaIdExist,userIdExist} = require('../../helpers');
const {validarCampos,validarToken} = require('../../middlewares');

const router = Router();

router.get('/get_report_ventas', [
    check('fecha_inicio', 'Ingresa la fecha inicial').not().isEmpty(),
    check('fecha_fin', 'Ingresa la fecha final').not().isEmpty(),

    validarToken,
    validarCampos
],tikeketsVendidosFechas);
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
],storeVenta);
module.exports = router;