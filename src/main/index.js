const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const prospect_route = require('./route/prospect_route.js');
const status = require('./variables/status.js');

dotenv.config();
const port = 9038;
const app = express();
app.use(cors({ origin : '*'}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

//prospect request
app.use('/prospect', prospect_route.prospectRoutes);

// unknown request
app.get('*', (req, res) => res.status(status.HTTP.BAD_REQUEST.code).json({ message: 'not a valid request' }));
