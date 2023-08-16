const {Router} = require('express');
const {check} = require('express-validator');


const {indexProgramacion,storeProgramin,anularProgramacion} = require('../../controllers');
const {  programacionIdExist,
    salaIdExist,userIdExist} = require('../../helpers');
const {validarCampos,validarToken} = require('../../middlewares');

const router = Router();
router.get('/get', [
    validarToken,
    validarCampos
],indexProgramacion);
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