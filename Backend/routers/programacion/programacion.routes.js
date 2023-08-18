const {Router} = require('express');
const {check} = require('express-validator');


const {indexProgramacion,storeProgramin,anularProgramacion,indexGetSalas,listadoHorarios,getSalabyId,
     wiewProgramacion,validaProgramacion,salaMoviesDate} = require('../../controllers');
const {  programacionIdExist,
    salaIdExist,userIdExist} = require('../../helpers');
const {validarCampos,validarToken} = require('../../middlewares');

const router = Router();
router.get('/get', [
    validarToken,
    validarCampos
],indexProgramacion);
router.get('/get_salabyid', [
    check('id', 'Ingresa el número de sala').not().isEmpty(),
    check('id').custom(salaIdExist),
    validarToken,
    validarCampos
],getSalabyId);
router.get('/valida_programacion', [
    check('idSala', 'Ingresa el número de sala').not().isEmpty(),
    check('idSala').custom(salaIdExist),
    check('fecha_recibe', 'Ingresa el fecha de sala').not().isEmpty(),
    check('hora_entra', 'Ingresa la hora de sala').not().isEmpty(),
    // validarToken,
    validarCampos
],validaProgramacion);
router.get('/salas_movie', [
    check('idmovie', 'Ingresa la pelicula').not().isEmpty(),
    check('fecha_inicio', 'Ingresa la fecha inicio').not().isEmpty(),
    check('fecha_fin', 'Ingresa la fecha final').not().isEmpty(),
    validarToken,
    validarCampos
],salaMoviesDate);
router.get('/salas_horarios', [
    check('idmovie', 'Ingresa la pelicula').not().isEmpty(),
    check('fecha_inicio', 'Ingresa la fecha inicio').not().isEmpty(),
    check('fecha_fin', 'Ingresa la fecha final').not().isEmpty(),
    validarToken,
    validarCampos
],listadoHorarios);
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