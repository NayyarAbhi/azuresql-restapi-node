// Create a configuration object for our Azure SQL connection parameters
var dbConfig = {
  server: "serverforloan.database.windows.net",
  database: "homeloan", 
  user: "laksh",
  password: "Password123",
  port: 1433,
  options: {
        encrypt: true
    }
 };

// exporting modules, to be used in the other .js files
module.exports = { dbConfig };