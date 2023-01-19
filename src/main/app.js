const express = require("express");
const bodyParser = require('body-parser');
const prospect_route = require('./route/prospect_route.js');
const intent_route = require('./route/intent_route.js');
const prospect_information_route = require('./route/prospect_information_route');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/readiness', (req,res) => res.status(HTTP.OK.code).json({message : 'Appilcation Ready to use'}));
app.get('/liveness', (req,res) => res.status(HTTP.OK.code).json({message : 'Appilcation is live'}));
app.get('/health', (req,res) => res.status(HTTP.OK.code).json({message : 'Appilcation is up and running'}));

//prospect api entry point
app.use('/api/v1/prospect',
    prospect_route.prospectRoutes,
    intent_route.intentRoutes,
    prospect_information_route.prospectInformationRoutes

);


module.exports = app ;