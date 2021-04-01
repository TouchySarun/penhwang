/**
 * response from 
 * @param {boolean} isSuccess 
 * @param {string} message 
 * @param {any} data 
 */
const Form = (isSuccess, message, data) => {
  if(!isSuccess) isSuccess = false
  if(!message) message = ""
  if(!data) data = {} 
  return {
    isSuccess,
    message,
    data
  }
}

module.exports = Form