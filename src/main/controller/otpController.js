const db = require('../utils/azureSql.js');
const TABLES = require('../variables/tables.js').TABLES;
const HTTP = require('../variables/status.js').HTTP;
let OTP_QUERY = require('../variables/otp_sql.js').QUERY;


const getOtprecord = async (req, res) => {
    const first_name = req.query.first_name;
    const email = req.query.email;
    const sql = OTP_QUERY.SELECT
        .replace('<tableName>', TABLES.OTP)
        .replace('<first_name>', first_name)
        .replace('<email>', email);

    const result = await db.getRecord(sql);
    if (result.rowsAffected[0] !== 0) {
        const response = "Phone : " + result.recordset[0].phone;
        // logger.info(response);
        res.status(HTTP.OK.code)
            .json(response)
    } else {
        res.status(HTTP.NOT_FOUND.code)
            .json({ message: `Otp record with first_name: ${first_name} and email: ${email} does not exist in the system` })
    }
}

const createOtprecord = async (req, res) => {
    // logger.info(obj);
    const id = req.body.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone = req.body.phone;

    const sql = OTP_QUERY.INSERT
        .replace('<tableName>', TABLES.OTP)
        .replace('<id>', id)
        .replace('<first_name>', first_name)
        .replace('<last_name>', last_name)
        .replace('<email>', email)
        .replace('<phone>', phone);

    const result = await db.insertRecord(sql);
    // logger.info(result);

    if (result.rowsAffected[0] === 1) {
        res.status(HTTP.CREATED.code)
            .json({ message: `Otp Record created with email ${email} and phone number ${phone}` })
    } else {
        res.status(HTTP.BAD_REQUEST.code)
            .json({ message: `Bad request body sent..` })
    }
}



// exporting modules, to be used in the other .js files
module.exports = { createOtprecord, getOtprecord }

