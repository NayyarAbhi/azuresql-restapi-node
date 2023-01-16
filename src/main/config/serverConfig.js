// Create a configuration object for our Azure SQL connection parameters
var dbConfig = {
  server: "prospectserver.database.windows.net",
  database: "prospectdb",
  user: "prospect",
  password: "Passwor!",
  port: 1433,
  options: {
    encrypt: true
  }
};

// exporting modules, to be used in the other .js files
module.exports = { dbConfig };