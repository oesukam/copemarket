const wilddog = require('wilddog')
const config = {
  syncURL: "https://nnkz.wilddogio.com",
  authDomain: "nnkz.wilddog.com"
};

wilddog.initializeApp(config)

module.exports = wilddog
