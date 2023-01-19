const connectionHelper = require("./DBConnectionHelper")
const sql = require("mssql");


// perform DB operation
async function performDBOperation(sqlQuery) {
    try{
        // create a request from connection
        //const req = connectionHelper.getConnection().request();
        const req = new sql.Request(await connectionHelper.getConnection()); 
        //get the response
        const response = await req.query(sqlQuery);
        return response;
    }catch(err){
        console.log(err);
    }
}

module.exports = { performDBOperation }