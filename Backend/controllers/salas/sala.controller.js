const {response, request } = require('express');
const {DetalleSala, Programacion, User} = require('../../models');

const {getPagination, getPagingData} = require('../../resources/pagination');
const {customFormatterHora,customFormatter} = require('../../resources/dates');

const sequelize = require('../../db/config');


const indexProgramacion = async(req = request, res = response)=>{
    const {page = 1, limite =10, search = '', criterio = 'usuario'} = req.query;

    let programaciones
    let response;
    const opt1 ={
        limit: parseInt(limite) || 10,
        page: parseInt(page) || 0,
    }
    const {limit, offset}  = getPagination(opt1.page, opt1.limit);
    if(search == ''){
        try{
            programaciones = await Programacion.findAndCountAll({
                offset: offset,
                limit: limit,
                order: [
                    ['createdAt', 'DESC']
                ],
                include : [
                
                    {model : User},
                ]
            });
            response = getPagingData(programaciones, page, limit);
         
        }catch(err){
        
            return res.status(400).json({
                msg: 'Algo salio mal',
                err
            });
        }
    }else{
        try{
            programaciones = await Programacion.findAndCountAll({  
                offset: offset,
                limit: limit,
                include : [
                    {model : User, where:{ [criterio]: { [Op.like]: `%${search}%`}}},

                ]
            });
            response = getPagingData(programaciones, page, limit);
            
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
    try{
        const { ...resto } = req.body;

        const t = await sequelize.transaction();
        const programacion = new Programacion({ transaction: t })
        programacion.fecha = customFormatter(new Date());
        programacion.userId = resto.userId;
        await programacion.save();

        for await(det of resto.data){
            const Detalle = new DetalleSala({ transaction: t});
            Detalle.programacionId = programacion.id;
            Detalle.salaId = det.salaId;
            Detalle.idmovie = det.idmovie;
            Detalle.fecha = det.fecha;
            Detalle.fecha_hora = det.fecha_hora;
            Detalle.hora = det.hora;
            await Datelle.save();
        }


        await t.commit();
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


module.exports = {
    storeProgramin,
    indexProgramacion,
    anularProgramacion
}


