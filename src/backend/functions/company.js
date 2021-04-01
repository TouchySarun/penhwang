const db = require('./db');

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const company = db.collection('company');
const employee = db.collection('employee');
const auth = require('./auth');
const errormessage = require('./errormessage');
const response = require('./returnFrom');
const cors = require('cors')({origin: true});
const errorHandle = require('./errorHandle');
const line = require('./line');
/**
 * sign up new company
 * @param name string
 * @param tel string
 * @param email string
 * @param address object
 * @return passcode, refs(company, role, slot)
 */
const SignUpCompany = async (req, res) => {
  data = req.body;
  const replyToken = req.body.replyToken;
  const employeeId = req.body.userId;
  const passcode = await getNewPasscode();
  try {
    const emp = await employee.doc(employeeId).get();
    if(!emp.exists){
      const employeeRef = await employee
      .doc(employeeId)
      .set({
        companyId: passcode,
        email:"",
        isEmployed: true,
        isManager: false,
        lineId: "",
        name: "default name",
        tel:"",
        salary: {},
        slot:{},
        role:'',
        roleId: '',
        slotId: '',
        pos:"ผู้สร้างบริษัท",
      })
      const docRef = await company
      .doc(passcode)
      .set({
        passcode,
        employees: [employeeId],
        managers: [employeeId], 
        address:{},// prevent bug
        creator: employeeId,
      })
      var {role, slot} = await setUpCompany(passcode);
      db.collection('LastAttendenceCheck').doc(passcode).set({date: new Date()});
      const otp1 = auth.Login1(employeeId, passcode);
      console.log(otp1);
      line.Reply(replyToken, [{
        "type": "text",
        "text": `รหัสยืนยันของคุณคือ ${otp1}
      `}])
      // line.Post(employeeId,  [{
      //   "type": "text",
      //   "text": `รหัสยืนยันของคุณคือ ${otp1}
      // `}]);
      return res.send(response(
        true, 
        `Complete sign up new company!! This is your passcode: [ ${passcode} ]`, 
        {passcode: passcode, ref:{company:docRef,employee: employeeRef, role, slot}}
      ));
    }else{
      line.Reply(replyToken, [{
        "type": "text",
        "text": 'คุณอยู่ในบริษัทอยู่แล้ว ไม่สามารถสร้างบริษัทใหม่ได้'
      }]);
      return res.send(errorHandle({}, 'creator must do not have any company'))
    }
  } catch (error) {
    return res.send(errorHandle(error, "Can't sign up your company."));
  }
}
const Get = async (req, res) => {
  try{
    const companyRef = await company.doc(req.body.passcode).get()
    return res.send(response( 
      true,
      'Get company data complete',
      companyRef.data()
    ))
  }catch (error) {
    return res.send(errorHandle(error, "Can't get company."));
  }
}
/**
 * edit company detail
 * @param companyData name, tel, email, address
 * @return company 
 */
const Edit = async (req, res) => {
  data = req.body 
  delete data.employeeId
  delete data.token
  try{
    const companyRef = await company.doc(data.passcode)
    .update(data)
    return res.send(response( 
      true,
      'Edit company data complete',
      {company:companyRef}
    ))
  }catch (error) {
    return res.send(errorHandle(error, "Can't edit company."));
  }
}
const Delete = async (req, res) => {
  try {
    const ref = await company.doc(req.body.passcode).delete();
    return res.send(response(
      true,
      "Delete company success.",
      {ref}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't delete company."))
  }
}
/**
 * @return passcode array
 */
const GetOldPasscode = async (req, res) => {
  const passcode = oldPasscode();
  return res.send(response(
    true,
    `success get old passcode`,
    {passcode}
  ));
}
/**
 * @param {*} passcode string 
 * @return roles array
 */
const GetRole = async (req, res) => {
  const passcode = req.body.passcode;
  const RoleRef = await company
  .doc(passcode)
  .collection('roles')
  .get()
  let roles = []
  if(RoleRef.empty){
    response.message = errormessage().wrongPasscode
    return response
  }
  RoleRef.forEach(
    snapshot => {
      roles.push(snapshot.data()) 
    }
  )
  return res.send(response(
    true, 
    "Success get Role", 
    {roles}
  ))
}
/**
 * 
 * @param {*} passcode string
 * @return slots
 */
const GetSlot = async (req, res) => {
  const passcode = req.body.passcode;
  let slots = []
  const RoleRef = await company
  .doc(passcode)
  .collection('slots')
  .get()
  RoleRef.forEach(
    snapshot => {
      slots.push(snapshot.data()) 
    }
  )
  return res.send(response(
    true, 
    "Success get Slot", 
    {slots}
  ))
}

const GetLocation = async (req, res) => {
  let locations = [];
  try {
    const LoRef = await company
    .doc(req.body.passcode)
    .collection('locations')
    .get()
    LoRef.forEach(
      snapshot => {
        locations.push(snapshot.data())
      }
    )
    return res.send(response(
      true, 
      "Success get Locations.",
      {locations}
    ))
  } catch (error){
    return res.send(errorHandle(error, "Can't get locations."))
  }
}

const GetLeave = async (req, res) => {
  let leaves = [];
  try {
    const leaveRef = await company
    .doc(req.body.passcode)
    .collection('leaves')
    .where('delete', '==', false)
    .get()
    leaveRef.forEach(
      snapshot => {
        leaves.push(snapshot.data())
      }
    )
    return res.send(response(
      true, 
      "Success get leaves.",
      {leaves}
    ))
  } catch (error){
    return res.send(errorHandle(error, "Can't get leaves."))
  }
}

const UpdateManagers = async (req, res) => {
  const passcode = req.body.passcode;
  try{
    const ref = await company.doc(passcode)
    .update({
      managers: req.body.managers
    });
    return res.send(response(
      true,
      "Success set managers.",
      {ref}
    ))
  }catch(err){
    return res.send(errorHandle(err, "Faile to set managers"))
  }
}

const check = (data) => (data.name && data.name !== "")

const setUpCompany = async (id) => {
  var roleRef = await addDefaultRole(id)
  var slotRef = await addDefaultSlot(id)
  return {roleRef, slotRef}
}

const addDefaultRole = async (id) => {
  const docRef = await company
  .doc(id)
  .collection('roles')
  .add({
    name: "Default role",
    description: "This is auto generate role.",
    slot: ["Default slot"]
  })
  console.log('Completed add Default role. |' + docRef.id)
  return docRef.id
}

const addDefaultSlot = async (id) => {
  const docRef = await company
  .doc(id)
  .collection('slots')
  .add({
    name: "Default slot",
    description: "This is auto generate slot.",
    time: [
      {
        day_of_week: 0,
        in: '08:00:00',
        out: '17:00:00'
      },
      {
        day_of_week: 1,
        in: '08:00:00',
        out: '17:00:00'
      },
      {
        day_of_week: 2,
        in: '08:00:00',
        out: '17:00:00'
      },
      {
        day_of_week: 3,
        in: '08:00:00',
        out: '17:00:00'
      },
      {
        day_of_week: 4,
        in: '08:00:00',
        out: '17:00:00'
      },
      {
        day_of_week: 5,
        in: '08:00:00',
        out: '17:00:00'
      },
      {
        day_of_week: 6,
        in: '08:00:00',
        out: '17:00:00'
      }
    ]
  })
  console.log('Completed add Default slot. |' + docRef.id)
  return docRef.id
}

const getoldPasscode = async () => {
  let oldPasscode = []
  const snapshots = await company.get()
  snapshots.forEach(
    snapshot => {
      oldPasscode.push(snapshot.data().passcode)
    }
  )
  return oldPasscode;
}

const getNewPasscode = async () => {
  let oldPasscode = await getoldPasscode()
  let newPasscode = '00001'
  do {
    newPasscodeInt = Math.floor(Math.random() * 100000)
    newPasscode = String(newPasscodeInt)
    newPasscode = shiftZero(newPasscode, 5)
  }
  while(oldPasscode.includes(newPasscode))
  return newPasscode
}
const shiftZero = (str, n) => {
  while(str.length < n){
    str = '0' + str
  }
  return str
}

module.exports = {
  Get,
  Edit,
  Delete,
  GetOldPasscode,
  GetRole,
  GetSlot,
  GetLeave,
  GetLocation,
  SignUpCompany,
  UpdateManagers,
}