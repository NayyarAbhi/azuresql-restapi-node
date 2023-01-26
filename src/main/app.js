const express = require("express");
const bodyParser = require('body-parser');
const prospect_route = require('./route/prospect_route.js');
const intent_route = require('./route/intent_route.js');
const prospect_information_route = require('./route/prospect_information_route');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/openapi3.0.3.json');
const envConfig = require('./helpers/config/evnconfig_reader.js');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// swagger contract
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//prospect api entry point
const app_entry_point = envConfig.entryPoint() + envConfig.version();

app.use(app_entry_point,
    prospect_route.prospectRoutes,
    intent_route.intentRoutes,
    prospect_information_route.prospectInformationRoutes
);


module.exports = app;