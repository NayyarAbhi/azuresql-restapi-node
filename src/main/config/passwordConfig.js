const fs = require('fs');

function getPassword() {
    var data
    try {
        data = fs.readFileSync('C:/Users/lakbabba/code/passwordfile.txt', 'utf8');
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    console.log(data)
    return data
  }

module.exports = { getPassword }