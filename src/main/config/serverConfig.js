const passwordConfig = require('./passwordConfig');

// Create a configuration object for our Azure SQL connection parameters
var dbConfig = {
  server: "servermortgage.database.windows.net",
  database: "Mortgages",
  user: "test",
  password: passwordConfig.getPassword(),
  port: 1433,
  options: {
    encrypt: true
  }
};

// exporting modules, to be used in the other .js files
module.exports = { dbConfig };
