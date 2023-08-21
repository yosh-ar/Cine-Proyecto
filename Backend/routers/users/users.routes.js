const {Router} = require('express');
const {check} = require('express-validator');


const {indexUser, postUser,updateUser,activarUser,desactivarUser,selectRol} = require('../../controllers');
const {rolIdExist,userIdExist} = require('../../helpers');
const {validarCampos,validarToken} = require('../../middlewares');

const router = Router();
router.get('/get', [
    validarToken,
    validarCampos
],indexUser);
router.get('/rol',[validarToken,validarCampos], selectRol);
router.post('/store',[
    validarToken,
    check('usuario', 'El usuario del empleado es necesario').not().isEmpty(),
    check('password', 'El usuario del empleado es necesario').not().isEmpty(),
    check('rol').custom(rolIdExist),
    validarCampos
    ], postUser);

    router.put('/update',[
        validarToken,
        check('usuario', 'El usuario del empleado es necesario').not().isEmpty(),
        check('password', 'El usuario del empleado es necesario').not().isEmpty(),
 
        check('rol').custom(rolIdExist),
        check('id').custom(userIdExist),
        validarCampos
        ], updateUser);
    router.put('/desactivate', [
        validarToken,
        check('id').custom(userIdExist),
        validarCampos
    ], desactivarUser);
    router.put('/activate', [
        validarToken,
        check('id').custom(userIdExist),
        validarCampos
    ], activarUser);
module.exports = router;