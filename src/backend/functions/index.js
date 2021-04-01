const express = require('express')
const app = express()
const db = require('./db')
const admin = require('firebase-admin')
const router = express.Router()
const functions = require('firebase-functions')
const jwt = require('jsonwebtoken');

const cors = require('cors')({origin: true});
app.use(cors)
const response = require('./returnFrom');
const auth = require('./auth');
const employee = require('./employee');
const company = require('./company');
const slot = require('./slot');
const role = require('./role');
const leave = require('./leave');
const clock = require('./clock');
const location = require('./location');
const reply = require('./reply');
const aleartTo = require('./aleartTo');

exports.scheduledFunction = functions
.pubsub.schedule("55 23 * * *")
.timeZone('Asia/Bangkok')
.onRun(async (context) => {
  const lat = await db.collection('LastAttendenceCheck').get();
  lat.forEach(l => employee.addLeaveAndMissAttendance(l.id))
  const jobs = await db.collection('jobLists').get();
  const today = new Date();
  const aDay = 1000 * 60 * 60 * 24;
  jobs.forEach(job => {
    try {
      const jobTime = new Date(job.data().time);
      let errTime = jobTime - today;
      if(errTime < aDay){
        if (errTime < 0) errTime = 0;
        console.log("I will do this job today.");
        setTimeout(
          ()=>{  
            if(job.data().func === 'changeSlot'){
              slot.ChangeSlot(job.data().data);
              aleartTo(job.data().employeeId, "มีการแก้ไขตารางทำงานของคุณ");
            }
            //if there are another scheduled function insert here
            db.collection('jobLists').doc(job.id).delete();
          }, errTime
        );
      }
      
    } catch (error) {
      res.send(error)
    }
  })
});
async function addLAndM (req, res, next){
  let id;
  if(req.body.id){
    id = req.body.id
  }
  if(req.body.employeeId){
    id = req.body.employeeId
  }
  const emp = await db.collection('employee').doc(id).get();
  req.body.passcode = emp.data().companyId;
  employee.addLeaveAndMissAttendance(emp.data().companyId);
  return next()
}
function checkLogin(req, res, next){
  try{
    const data = jwt.verify(req.body.token, auth.secret);
    req.body.passcode = data.passcode;
    req.body.employeeId = data.uid;
    console.log('check login pass');
    return next();
  }catch(err){
    res.send(response(false,"didn't login yet",{}));
    return false;
  }
}

router.get('/loginReq/:employeeId', auth.LoginReq);
router.post('/loginReq/:employeeId', auth.LoginReq);
router.post('/login', auth.Login);
router.post('/testToken', checkLogin, (req, res) => {
  res.send(response(true, "Yes you can use this token", {pass: true}));
});
//reply
router.post('/changeSlotReply', reply.ChangeSlotReply);
router.post('/slotReply', reply.SlotReply);
router.post('/settingReply', reply.SettingReply);
router.post('/requestReply', reply.RequestReply);
router.post('/newEmpReply', reply.newEmpReply);

//employee
router.post('/employeeAdd', employee.Add);
router.post('/employeeGet', checkLogin, employee.Get);
router.post('/employeeEdit', employee.Edit);
router.post('/employeeDelete', checkLogin, employee.Delete);
router.post('/employeeAttendance', checkLogin, employee.Attendance);
router.post('/employeeWorkHour', addLAndM, employee.WorkHour);
router.post('/employeeSlot/:employeeId', employee.Slot);
router.post('/getJobApp', async (req, res) => {
  const requests = await employee.GetJobApp(req.body.passcode);
  res.send(requests);
});
router.get('/jobApplicationManage/:recipient/:JobAppId/:isConfirmed', employee.jobApplicationManage);
router.post('/jobApplicationManage/:recipient/:JobAppId/:isConfirmed', employee.jobApplicationManage);
router.post('/getProfile',addLAndM , employee.GetProfile);
//company
router.post('/getCompany', checkLogin, company.Get);
router.post('/companyAdd', company.SignUpCompany);
router.post('/companyEdit', checkLogin, company.Edit);
router.post('/companyDelete', checkLogin, company.Delete);
router.post('/companyUpdateManagers', checkLogin, company.UpdateManagers);
router.post('/getOldPasscode', checkLogin, company.GetOldPasscode);
// role
router.post('/roleGet', checkLogin, role.Get);
router.post('/roleAdd', checkLogin, role.Add);
router.post('/roleEdit', checkLogin, role.Edit);
router.post('/roleDelete', checkLogin, role.Delete);
router.post('/roleGetSlot', checkLogin, role.GetSlot); // may not use
router.post('/roleUpdateSlot', checkLogin, role.UpdateSlot);
router.post('/roleGetEmployees', checkLogin, role.GetEmployee); // may not use
router.post('/roleUpdateEmployees', checkLogin, role.UpdateEmployee);
router.post('/roleGetManagers', checkLogin, role.GetManager);
router.post('/roleUpdateManagers', checkLogin, role.UpdateManager);
// slot 
router.post('/slotGetUsable/:employeeId', slot.GetUsable);
router.post('/changeSlotReq', slot.ChangeSlotReq);
router.get('/changeSlotManage/:empId/:reqId/:isConfirmed/:reason', slot.ChangeSlotManage);
router.post('/changeSlotManage/:empId/:reqId/:isConfirmed/:reason', slot.ChangeSlotManage);
router.post('/slotGet', checkLogin, slot.Get);
router.post('/slotAdd', checkLogin, slot.Add);
router.post('/slotEdit', checkLogin, slot.Edit);
router.post('/slotDelete', checkLogin, slot.Delete);
router.post('/slotGetEmployees', checkLogin, slot.GetEmployee); // may not use
router.post('/slotUpdateEmployees', checkLogin, slot.UpdateEmployee);
router.post('/slotGetRequests', async (req, res) => {
  const requests = await slot.GetRequests(req.body.passcode);
  res.send(requests);
});
// leave 
router.post('/leaveGetRight/:employeeId', leave.GetRight);
router.post('/leaveReq', leave.Req);
router.get('/leaveManage/:empId/:owner/:reqId/:leaveId/:isConfirmed/:reason', leave.Manage);
router.post('/leaveManage/:empId/:owner/:reqId/:leaveId/:isConfirmed/:reason', leave.Manage);
router.post('/leaveGet', checkLogin, leave.Get);
router.post('/leaveAdd', checkLogin, leave.Add);
router.post('/leaveEdit', checkLogin, leave.Edit);
router.post('/leaveDelete', checkLogin, leave.Delete);
router.post('/leaveUpdateEmployees', checkLogin, leave.UpdateEmployee);
router.post('/leaveGetRequests', async (req, res) => {
  const requests = await leave.GetRequests(req.body.passcode);
  res.send(requests);
});
// location
router.post('/locationGet', checkLogin, location.Get);
router.post('/locationAdd', checkLogin, location.Add);
router.post('/locationEdit', checkLogin, location.Edit);
router.post('/locationDelete', checkLogin, location.Delete);
router.post('/locationUpdateEmployees', checkLogin, location.UpdateEmployee);
// clock
router.post('/clockIn', clock.In);
router.post('/clockOut', clock.Out);
router.post('/clockReq', clock.Req);
router.post('/clockReply', clock.Reply);
// request 
router.post('/getAllRequest', checkLogin, async (req, res) => {
  try {
    const cs = await slot.GetRequests(req.body.passcode);
    const ja = await employee.GetJobApp(req.body.passcode);
    const le = await leave.GetRequests(req.body.passcode);
    let all = [];
    cs.forEach(c => {
      c.type = 'เปลี่ยนกะ';
      all.push(c);
    })
    ja.forEach(j => {
      j.type = 'เข้าร่วม';
      all.push(j);
    })
    le.forEach(l => {
      l.type = 'ลา';
      all.push(l);
    })
    return res.send({isSuccess: true, message:"success get all request", data:{allRequests:all}})
  } catch (err) {
    console.log(err);
    return res.send({isSuccess: false, message:"can't get all request", data:{error:err}});
  }
});
//test
router.post('/AddAtt', async (req, res) => {
  const data = req.body;
  data.workHour.date = new Date(data.workHour.date);
  try{
    db.collection('employee').doc(data.employeeId)
    .collection('workHour').doc(data.today)
    .set(data.workHour);
    return res.send(response(
      true,
      `Add ${data.employeeId} att.`,
      {}
    ))
  } catch (err) {
    return res.send(err);
  }
})
router.post('/check', async (req, res) => {
  const x = await employee.addLeaveAndMissAttendance(passcode);
  return res.send(x);
})
router.post('/getmymanager', async(req, res)=> {
  const e = await db.collection("employee").doc(req.body.employeeId).get();
  const manager = await db.collection("employee")
    .where('roleId', '==', e.data().roleId)
    .where('isManager', '==', true)
    .get()
  let ret = [];
  manager.forEach(mn =>ret.push(mn.id))
  res.send(ret);
})
router.get('/getAllDB', async (req, res) => {
  let edb = {
    LastAttendenceCheck: {},
    company: [],
    employee: [],
    tokenList: {}
  };
  // allDoc = lastCheck, company, employee, token
  const allDoc = await Promise.all([
    db.collection("LastAttendenceCheck").get(),
    db.collection("company").get(),
    db.collection("employee").get(),
    db.collection("tokenList").get()
  ])
  // do the easy first <3
  allDoc[0].forEach(l => edb.LastAttendenceCheck[l.id] = l.data());
  allDoc[3].forEach(t => edb.tokenList[t.id] = t.data());
  let jobApp = [];
  let slotReq = [];
  let leaves = [];
  let lo = [];
  let roles = [];
  let slots = [];
  allDoc[1].forEach(c => {
    edb.company.push({
      ...c.data(),
      JobApplication:[],
      changeSlotReqs:[],
      leaves:[],
      locations:[],
      roles:[],
      slots:[]
    })
    jobApp.push(db.collection("company").doc(c.id).collection("JobApplication").get())
    slotReq.push(db.collection("company").doc(c.id).collection("changeSlotReqs").get())
    leaves.push(db.collection("company").doc(c.id).collection("leaves").get())
    lo.push(db.collection("company").doc(c.id).collection("locations").get())
    roles.push(db.collection("company").doc(c.id).collection("roles").get())
    slots.push(db.collection("company").doc(c.id).collection("slots").get())
  })
  const jobAppAwaited = await Promise.all(jobApp);
  const slotReqAwaited = await Promise.all(slotReq);
  const leavesAwaited = await Promise.all(leaves);
  const loAwaited = await Promise.all(lo);
  const rolesAwaited = await Promise.all(roles);
  const slotsAwaited = await Promise.all(slots);
  for(let i=0; i<edb.company.length; i++){
    jobAppAwaited[i].forEach( ja => edb.company[i].JobApplication.push(ja.data()));
    slotReqAwaited[i].forEach( sr => edb.company[i].changeSlotReqs.push(sr.data()));
    leavesAwaited[i].forEach( l => edb.company[i].leaves.push(l.data()));
    loAwaited[i].forEach(lo => edb.company[i].locations.push(lo.data()));
    rolesAwaited[i].forEach(r => edb.company[i].roles.push(r.data()));
    slotsAwaited[i].forEach(s => edb.company[i].slots.push(s.data()));
  }
  let eleaves = [];
  let elo = [];
  let workHour = [];
  allDoc[2].forEach(e => {
    edb.employee.push({
      ...e.data(),
      leaves:[],
      locations:[],
      workHour:[]
    })
    eleaves.push(db.collection("employee").doc(e.id).collection("leaves").get());
    elo.push(db.collection("employee").doc(e.id).collection("locations").get());
    workHour.push(db.collection("employee").doc(e.id).collection("workHour").get());
  })
  const eleavesAwaited = await Promise.all(eleaves);
  const eloAwaited = await Promise.all(elo);
  const workHourAwaited = await Promise.all(workHour);
  for(let i=0; i<edb.employee.length; i++){
    eleavesAwaited[i].forEach( l => edb.employee[i].leaves.push(l.data()));
    eloAwaited[i].forEach( lo => edb.employee[i].locations.push(lo.data()));
    workHourAwaited[i].forEach( wh => edb.employee[i].workHour.push(wh.data()));
  }
  res.send(response(true, 'success get entire database.', edb))
})
app.use('/', router)
exports.app = functions.https.onRequest(app)