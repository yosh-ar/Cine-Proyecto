const {response, request } = require('express');
const {DetalleSala, Programacion, User, Sala} = require('../../models');
const Sequelize = require('sequelize');
const {getPagination, getPagingData} = require('../../resources/pagination');
const {customFormatterHora,customFormatter} = require('../../resources/dates');
const sequelize = require('../../db/config');
const Op = Sequelize.Op;

const indexProgramacion = async(req = request, res = response)=>{
    const {page = 1, limite =10, search = '', criterio = 'usuario', fecha_inicio ='', fecha_fin =''} = req.query;
    // console.log('entro');
    let programacion
    let response;
    const opt1 ={
        limit: parseInt(limite) || 10,
        page: parseInt(page) || 0,
    }
    const {limit, offset}  = getPagination(opt1.page, opt1.limit);
    if(search == '' && fecha_inicio == '' && fecha_fin == '' ){
        try{
            programacion = await Programacion.findAndCountAll({
                offset: offset,
                limit: limit,
                order: [
                    ['createdAt', 'DESC']
                ],
                include : [
                    {model : User},
                ]
            });
            response = getPagingData(programacion, page, limit);
        }catch(err){
            console.log(err)
            return res.status(400).json({
                msg: 'Algo salio mal',
                err
            });
        }
    }else{
        try{
            if(criterio == 'fecha' && fecha_inicio!='' && fecha_fin !=''){
                programacion = await Programacion.findAndCountAll({  
                    where : {
                        fecha:{[Op.between]: [fecha_inicio, fecha_fin]}
                    },      
                    offset: offset,
                    limit: limit,
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include : [
                        {model : User},
                    ]
                });
            }
        
            else if(criterio =='usuario' && search !=''){
                programacion = await Programacion.findAndCountAll({  
                    offset: offset,
                    limit: limit,
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include : [
                        {model : User,     where:{ [criterio]: { [Op.like]: `%${search}%`}},},
                    ]
                });
            }
            else{
                try{
                    programacion = await Programacion.findAndCountAll({
                        offset: offset,
                        limit: limit,
                        order: [
                            ['createdAt', 'DESC']
                        ],
                        include : [
                            {model : User},
                        ]
                    });
                    response = getPagingData(programacion, page, limit);
                }catch(err){
                    console.log(err)
                    return res.status(400).json({
                        msg: 'Algo salio mal',
                        err
                    });
                }
            }
            response = getPagingData(programacion, page, limit);    
        }catch(err){
            console.log(err);
            return res.status(400).json({
                msg: 'Algo salio mal',
                err
            });
        }
    }
    res.send(response);
}
const storeProgramin = async (req, res) => {
    const t = await sequelize.transaction();
    try{
        const { ...resto } = req.body;

        const programacion = new Programacion({ transaction: t })
        programacion.fecha = customFormatter(new Date());
        programacion.userId = resto.usuario;
        await programacion.save();

        for await(det of resto.data){
            const Detalle = new DetalleSala({ transaction: t});
            Detalle.programacionId = programacion.id;
            Detalle.salaId = det.salaId;
            Detalle.nombre_pelicula = det.nombre;
            Detalle.idmovie = det.idmovie;
            Detalle.fecha = det.fecha;
            Detalle.fecha_hora = det.fecha_hora;
            Detalle.hora = det.hora;
            await Detalle.save();
        }
        await t.commit();

        res.status(200).json({
            msg: 'success'
        })
    }catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error, hable con el administrador backend'
        })    
    }
}
const anularProgramacion = async(req = resquest, res = response)=>{
    const {id} = req.body;
   
    try {
        const t = await sequelize.transaction();

        const programacion = await Programacion.findOne({where: {id : id}},{ transaction: t })
        programacion.estado = false;
        await programacion.save();
        
        const detalles = await DetalleSala.findAll({where: {programacionId : id}});
        for await (det of detalles) {
            await DetalleSala.update({estado : false}, {where: {id : det.id}},{ transaction: t } );
        }

        await t.commit();
        res.json({
            msg : 'Actualización realizada con éxito'
        });

    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrio un error, hable con el administrador backend'
        })    
    }
}
const wiewProgramacion = async ( req = request, res = response) => {
    const {id} = req.query;
    try {
        const programacion = await Programacion.findOne({
            where: {id : id},
            include : [
                {model : DetalleSala, include : [{model: Sala}]},
                
                {model : User, attributes :['usuario'],},
            ]
        })
        res.status(200).json({
            msg: 'Ok',
            programacion
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

const indexGetSalas = async (req, res) => {
    try {
        const salas = await Sala.findAll({where:{estado : true}});
        res.status(200).json({
            msg : 'ok',
            data : salas
        })
    } catch (error) {
        return res.status(400).json({ msg : 'algo salio mal', error});
    }
}

const validaProgramacion = async(req, res)=>{
    try {
        const {idSala, fecha_recibe} = req.query;
        
        const salas = await DetalleSala.findAll(
            {
                where:{
                    fecha: {
                        [Op.gte]: fecha_recibe
                      },
                      salaId : idSala,
                    estado : true
                }
            }
        );
        res.status(200).json({
            msg : 'ok',
            salas
        })
    } catch (error) {
        return res.status(400).json({ msg : 'algo salio mal', error});
    }
}

const EntradaSalida = (horario_lectura, labora_entra, labora_salida)=>{
    const entrada_mas30mins = parseFloat(labora_entra/3600).toString() + '.' +'31';
    const entrada_menos30mins = parseFloat(labora_entra-3600)/3600 + '.' +'31';
    const entra_despues = parseFloat(entrada_mas30mins)*3600;
    const entra_antes = parseFloat(entrada_menos30mins)*3600;
    
    // console.log(entra_antes/3600, entra_despues/3600, horario_lectura/3600, labora_entra/3600);

    const salida_mas30mins = parseFloat(labora_salida/3600).toString() + '.' +'31';
    const salida_menos30mins = parseFloat(labora_salida-3600)/3600 + '.' +'31';

    const sale_despues = parseFloat(salida_mas30mins)*3600;
    const sale_antes = parseFloat(salida_menos30mins)*3600;
   
    if((horario_lectura == labora_entra ) || (horario_lectura <= entra_despues && horario_lectura >= entra_antes)){
        return 'ENTRADA';
    }
    else if((horario_lectura == labora_salida ) || (horario_lectura <= sale_despues && horario_lectura >= sale_antes)){
        return 'SALIDA';
    }else{
        return 'OTRO'
    }
    
}
const Hora= (dia_actual, E_S)=>{
    let resp = 0;
    if(E_S == 1){
       resp = (dia_actual == 1) ? 6 :
        (dia_actual == 2) ? 7 :
        (dia_actual == 3) ? 8 :
        (dia_actual == 4) ? 9 :
        (dia_actual == 5) ? 10 :
        (dia_actual == 6) ? 11 : 12;
    }
    else{
        resp = (dia_actual == 1) ? 13 :
        (dia_actual == 2) ? 14 :
        (dia_actual == 3) ? 15:
        (dia_actual == 4) ? 16:
        (dia_actual == 5) ? 17 :
        (dia_actual == 6) ? 18 : 19
    }
    return resp;
}



module.exports = {
    storeProgramin,
    indexProgramacion,
    anularProgramacion,
    indexGetSalas,wiewProgramacion,validaProgramacion
}


