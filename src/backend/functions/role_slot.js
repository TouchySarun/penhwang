const admin = require('firebase-admin');

const db = require('./db');
const company = db.collection('company');
const employee = db.collection('employee');
const response = require('./returnFrom')

const roleUpdateSlot = async (passcode, role, slot) => {
  await company.doc(passcode)
  .collection('roles').doc(role)
  .update({
    slot: slot
  })
  return response(true, `Success add slot: [ ${slot} ] to role ${role}` )
}
module.exports = {roleUpdateSlot}