
const moment = require('moment');
const customFormatterHora = (date)=>{
    return moment.tz(date, 'America/Guatemala').format('YYYY-MM-DD HH:mm:ss');
}
const customFormatter= (date)=>{
    return moment.tz(date, 'America/Guatemala').format('YYYY-MM-DD');
}



module.exports = {
    customFormatterHora,
    customFormatter
}