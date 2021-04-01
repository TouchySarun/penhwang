
const response = require('./returnFrom');

const func = (error, message) => {
  console.log(error);
  return response(
    false,
    message,
    {error}
  )
}

module.exports = func
