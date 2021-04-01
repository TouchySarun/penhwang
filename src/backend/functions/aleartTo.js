const line = require('./line');

module.exports = (emp, message) => {
  console.log(emp + ": " + message);
  line.Post(emp,[{
    "type": "text",
    "text": message
  }]);
}