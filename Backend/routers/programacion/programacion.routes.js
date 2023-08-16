const {Router} = require('express');
const {check} = require('express-validator');


const {indexProgramacion,storeProgramin,anularProgramacion,indexGetSalas, wiewProgramacion,validaProgramacion} = require('../../controllers');
const {  programacionIdExist,
    salaIdExist,userIdExist} = require('../../helpers');
const {validarCampos,validarToken} = require('../../middlewares');

const router = Router();
router.get('/get', [
    validarToken,
    validarCampos
],indexProgramacion);
router.get('/valida_programacion', [

],validaProgramacion);
router.get('/get', [
    validarToken,
    validarCampos
],indexProgramacion);
router.get('/view_programacion', [
    check('id').custom(programacionIdExist),
    validarToken,
    validarCampos
],wiewProgramacion);
router.get('/get_salas', [
    validarToken,
    validarCampos
],indexGetSalas);
router.post('/store',[
    validarToken,
    check('usuario', 'El usuario del empleado es necesario').not().isEmpty(),
    check('data', 'El detalle es necesario'),
    validarCampos
    ], storeProgramin);

    router.put('/desactivate', [
        validarToken,
        check('id').custom(programacionIdExist),
        validarCampos
    ], anularProgramacion);
module.exports = router;