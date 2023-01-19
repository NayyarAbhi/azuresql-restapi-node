const HTTP = require('./variables/status.js').HTTP;
const app = require('./app.js');

const port = 8001

app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});


// unknown request
app.get('*', (req, res) => res.status(HTTP.BAD_REQUEST.code).json({ message: 'not a valid request' }));
