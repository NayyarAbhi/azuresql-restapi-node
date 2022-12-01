const express = require("express");
const bodyParser = require('body-parser');
const prospect_route = require('./route/prospect_route.js');
const otp_route = require('./route/otp_route.js');
const HTTP = require('./variables/status.js').HTTP;

const port = 9041;
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//prospect request
app.use('/prospect', prospect_route.prospectRoutes);

//otp request
app.use('/otpservices', otp_route.otpRoutes);

// unknown request
app.get('*', (req, res) => res.status(HTTP.BAD_REQUEST.code).json({ message: 'not a valid request' }));
