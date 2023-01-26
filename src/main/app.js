const express = require("express");
const bodyParser = require('body-parser');
const prospect_route = require('./route/prospect_route.js');
const intent_route = require('./route/intent_route.js');
const prospect_information_route = require('./route/prospect_information_route');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/openapi3.0.3.json');
const env = require('./config/envconfig').env;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// swagger contract
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// prospect api entry point
const app_entry_point = env.APP_ENTRY_POINT + env.APP_VERSION;

app.use(app_entry_point,
    prospect_route.prospectRoutes,
    intent_route.intentRoutes,
    prospect_information_route.prospectInformationRoutes
);


module.exports = app;