const QUERY = {
    SELECT: 'select * from <tableName> where first_name=<first_name> and email=<email>;',
    INSERT: "INSERT <tableName> (id, first_name,last_name, email, phone) VALUES ('<id>','<first_name>','<last_name>','<email>','<phone>');"
}

// exporting modules, to be used in the other .js files
module.exports = { QUERY }