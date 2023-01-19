const fs = require('fs')
const path = require("path")

/*let moc_values = {
    "id": 1,
    "userType": "UNAUTH_CUSTOMER",
    "sub": "identifier",
    "exp": 1666343413
}*/

async function setMocValues(value_to_set){
    //moc_values = value_to_set;
    //const JSONToFile = (obj,fileName) => fs.writeFile(`${fileName}.json`, JSON.stringify(obj, null, 2));
    try{
        //fs.writeFile('domuscookiemoc.json', JSON.stringify(value_to_set, null, 2));
        const data = JSON.stringify(value_to_set, null, 2)
        fs.writeFileSync(path.join(__dirname,"data,json"), data)
        //JSONToFile(value_to_set,'domuscookiemoc')
    }catch(err){
        console.log(err)
    }
    console.log("file written successuflly");
}

async function getMocValues(){
    let moc_values
    try{
        moc_values = fs.readFileSync(path.join(__dirname,"data,json"),'utf-8')
    }catch(err){
        console.log(err)
    }
    return JSON.parse(moc_values);
}

module.exports = {setMocValues, getMocValues}