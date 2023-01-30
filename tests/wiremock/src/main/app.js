const express = require("express");
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
const domuscookievalidatorrouter = require('../routes/domuscookievalidator')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => {
          console.log(`Server running on port ${port}`);
});

//prospect api entry point
app.use('/validate', domuscookievalidatorrouter);

// unknown request
app.get('*', (req, res) => res.status(500).json({ message: 'not a valid request' }));