const express = require("express");
const bodyParser = require('body-parser');
const prospect_route = require('./route/prospect_route.js');
const intent_route = require('./route/intent_route.js');
const prospect_information_route = require('./route/prospect_information_route');
const HTTP = require('./variables/status.js').HTTP;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

const port = 8001;
//const host = '0.0.0.0';
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});

//prospect api entry point
app.use('/api/v1/prospect',
    prospect_route.prospectRoutes,
    intent_route.intentRoutes,
    prospect_information_route.prospectInformationRoutes

);

// unknown request
app.get('*', (req, res) => res.status(HTTP.BAD_REQUEST.code).json({ message: 'not a valid request' }));
