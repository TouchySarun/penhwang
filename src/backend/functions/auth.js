const db = require('./db');
const jwt = require('jsonwebtoken');
const errorMessage = require('./errormessage');

const company = db.collection('company');
const employee = db.collection('employee');

const response = require('./returnFrom');
const errorHandle = require('./errorHandle');
const { error } = require('firebase-functions/lib/logger');
const aleartTo = require('./aleartTo');
const secret = 'thisIsVerySecret';
// var tokenList = {};

const Login1 = (uid, passcode)=>{
  // let success = false;
  let otp = genOTP().toString();
  const token = jwt.sign(
    {
      uid,
      passcode
    },
    secret,
    {
      expiresIn: '1d',// expires in one day
    }
  );
  db.collection('tokenList').doc(otp).set({token});
  // while (!success){
  //   otp = genOTP();
  //   if(tokenList[otp] === undefined){
  //     // tokenList[otp] = token;
  //     success = true;
  //   }else{
  //     success = false;
  //   }
  // }
  return otp;
}
const LoginReq = async (req, res) => {
  try {
    const uid = req.params.employeeId;
    let success = false;
    let companyId = [];
    let otp = genOTP().toString();
    const companys = await company
    .where('managers', "array-contains", uid)
    .get();
    companys.forEach(c => companyId.push(c.id));
    if(companyId.length > 1){
      return res.send(errorHandle({}, `Something wrong this employee is in many company.`));
    }else{
      const passcode = companyId[0];
      const token = jwt.sign(
        {
          uid,
          passcode
        },
        secret,
        {
          expiresIn: '1d',// expires in one day
        }
      );
      console.log(otp +" "+token)
      await db.collection('tokenList').doc(otp).create({token});
      // while (!success){
      //   otp = genOTP();
      //   if(tokenList[otp] === undefined){
      //     // tokenList[otp] = token;
      //     success = true;
      //   }else{
      //     success = false;
      //   }
      // }
    }
    aleartTo(uid, `รหัสของคุณคือ${otp}`);
    return res.send(response(
      true, 
      'Success get OTP',
      {otp}
    ))
  } catch (err) {
    return res.send(errorHandle(err, "Can't log in"))
  }
}
const genOTP = () => {
  return  parseInt( shiftZero(Math.random() * 100000 ) );
}
const shiftZero = (n) => {
  while (n< 100000){
    n *= 10;
  }
  return n;
} 
const Login = async (req, res) => {
  try{
    // console.log(tokenList);
    const token = await db.collection('tokenList').doc(req.body.otp).get();
    // const token = tokenList[req.body.otp];
    if(token.exists){
      // delete tokenList[req.body.otp];
      db.collection('tokenList').doc(req.body.otp).delete();
      const data = jwt.verify(token.data().token, secret);
      return res.send(response(
        true,
        'Success login',
        {token:token.data().token, employeeId:data.uid}
      ))
    } else {
      return res.send(errorHandle({}, `Can't find otp in list`))
    }
    // ลบ otp นี้ใน tokenList 
  }catch (err){
    return res.send(errorHandle(err, `Can't log in`))
  }
};

const SignUp = async (data) => {
  const myData = {
    lineId: data.lineId,
    companyId: data.companyId,
    name: data.name,
    email: data.email,
    tel: data.tel,
    salary: {},
    position: '',
    weakHoliday: 0,
    role: '',
    roleId: '',
    slot: {},
    slotId: '',
    isEmployed: false,
  }
  const docRef = await db.collection('employee')
  .doc(data.lineUserId)
  .set(myData)
  return docRef.id
}
module.exports = {
  secret,
  LoginReq,
  Login,
  SignUp,
  Login1,
};