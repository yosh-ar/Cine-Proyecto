const {response, request } = require('express');
const {DetalleSala, Venta, DetalleVenta, User,DetalleReserva} = require('../../models');
const Sequelize = require('sequelize');
const {getPagination, getPagingData} = require('../../resources/pagination');
const {customFormatterHora,customFormatter} = require('../../resources/dates');
const sequelize = require('../../db/config');
const Op = Sequelize.Op;
const moment = require('moment');


const tikeketsVendidosFechas =  async(req = request, res = response)=>{
    const {fecha_inicio,fecha_fin} = req.query;
    try {
       
        const tatalVentas = await Venta.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('total_venta')), 'total_venta'],
                [sequelize.fn('sum', sequelize.col('total_boletos')), 'total_boletos'],
              ],
            where: {
                fecha_venta:{[Op.between]: [fecha_inicio, fecha_fin]},
            },
            
        })
        res.status(200).json({
            msg: 'Ok',
            tatalVentas
        })
    }catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = {
    tikeketsVendidosFechas
}