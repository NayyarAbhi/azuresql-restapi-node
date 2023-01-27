var express = require('express');
const fs = require('fs');
const path = require('path');

var router = express.Router();

/*router.get("/", async function(req, res) {
    try{
        response_json = JSON.parse(fs.readFileSync(path.resolve(__dirname,"db","domuscookievalidatorresponse.json")));
        //res.status(200).send(JSON.stringify(response_json));
        console.log(`GET: ${JSON.stringify(response_json)}`)
        res.status(200).send(response_json);
    }catch(err){
        res.status(500).send(JSON.stringify(err));
    }
});*/

router.post("/", async function(req, res) {
    try{
        /*response_json = {
            id : 1,
            userType : req.body.userType,
            sub : req.body.sub,
            exp : 1666343413
        }
        
        //console.log(response_json)
        fs.writeFileSync(path.resolve(__dirname,"db","domuscookievalidatorresponse.json"), JSON.stringify(response_json), 'utf8');
        //res.status(200).send(JSON.stringify(response_json));
        console.log(`POST: ${JSON.stringify(response_json)}`) */
        res.status(200).send(req.body);
    }catch(err){
        res.status(500).send("error : Error posting to Domus cookie stub" );
    }
});

module.exports = router;