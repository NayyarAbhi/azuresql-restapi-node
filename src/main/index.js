const express = require("express");
const bodyParser = require('body-parser');
const prospect_route = require('./route/prospect_route.js');
const HTTP = require('./variables/status.js').HTTP;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

const port = 8000;
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//prospect request
app.use('/prospect/v1', prospect_route.prospectRoutes);

// unknown request
app.get('*', (req, res) => res.status(HTTP.BAD_REQUEST.code).json({ message: 'not a valid request' }));
