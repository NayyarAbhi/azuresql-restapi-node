// Create a configuration object for our Azure SQL connection parameters
var dbConfig = {
  server: "otp-db-server.database.windows.net",
  database: "otpdb",
  user: "ksadmin",
  password: "Passwor!",
  port: 1433,
  options: {
    encrypt: true
  }
};

// exporting modules, to be used in the other .js files
module.exports = { dbConfig };