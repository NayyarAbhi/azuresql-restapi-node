// Create a configuration object for our Azure SQL connection parameters
var dbConfig = {
  server: "servermortgages.database.windows.net",
  database: "Mortgages",
  user: "test",
  password: "Password@1",
  port: 1433,
  options: {
    encrypt: true
  }
};

// exporting modules, to be used in the other .js files
module.exports = { dbConfig };