// Importing packages
const sql = require("mssql");
const { dbConfig } = require("../../../../src/main/config/ServerConfig");


// declaring variables
let conn = null;
let isConnected = false;

// initiating azure sql connection
// to be called form before block of mocha
async function setConnection() {
    if (!isConnected) {
        conn = await new sql.ConnectionPool(dbConfig).connect();
        isConnected = true;
        console.log('DB connection successful');
    } else {
        console.log("Already connected....")
    }
}

// get the conneciton 
// to be called each time the request has to be executed
async function getConnection() {
    return await conn;
}

// closing azure sql connection
// to be called after before block of mocha
async function closeConnection() {
    if (isConnected) {
        await conn.close();
        isConnected = false;
        console.log('DB connection closed');
    } else {
        console.log('DB connection is already closed.....')
    }
}



module.exports = { setConnection, closeConnection, getConnection }

