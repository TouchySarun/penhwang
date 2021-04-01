const db = require('./db');

const admin = require('firebase-admin');
const auth = require('./auth');
const line = require('./line')
const myurl = require('./url');
const alertTo = require('./aleartTo')
const response = require('./returnFrom');
const errorHandle = require('./errorHandle')
const errormessage = require('./errormessage');
const { now } = require('moment');

const company = db.collection('company');
const employee = db.collection('employee');

const Get = async (req, res) => {
  try {
    const ref = await employee
    .where('companyId', '==', req.body.passcode)
    .where('isEmployed', '==', true)
    .get();
    let employees = {}
    ref.forEach(
      snapshot => {
        employees[snapshot.id] = {
          id: snapshot.id,
          ...snapshot.data()
        }
      }
    )
    return res.send(response(
      true, 
      "Success get employees", 
      {
        employees
      }
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't create employee."));
  }
}
/**
 * signup and create job application
 * @param lineUserId string
 * @param lineId string
 * @param companyId string 
 * @param name string
 * @param email string 
 * @param tel string
 */
const Add = async (req, res) => {
  const data = req.body
  try {
    const comp = await company.doc(data.companyId).get();
    if(!comp.exists){
      return res.send(errorHandle({code:1},`ไม่พบบริษัทที่ใช้ passcode นี้`));
    }else{
      const id = await auth.SignUp(data);
      const JobApp = await CreateJobApplication(data);
      return res.send(response(
        true, 
        "Sign up new employee completed.", 
        {
          employeeId: id,
          JobAppId: JobApp.id
        }
      ))
    }
  } catch (error) {
    return res.send(errorHandle(error, "Can't create employee."));
  }
};
const CreateJobApplication = async (data) => {
  const passcode = data.companyId
  const JobAppDetail = {
    owner: data.lineUserId,
    recipient: '',
    requestTime: new Date(),
    confirmedTime: '',
    isConfirmed: false,
    isWatched: false,
    name: data.name,
    lineId: data.lineId,
    email: data.email,
    tel: data.tel,
  }
  const JobAppRef = await company.doc(passcode)
  .collection('JobApplication')
  .add(JobAppDetail)
  const AlertData = {
    passcode: data.comapnyId,
    JobApp: JobAppRef.id,
    JobAppDetail: JobAppDetail
  }
  jobApplicationAlert(AlertData)
  return JobAppRef
}

const jobApplicationAlert = async (data) => {
  const company = await company.doc(data.passcode).get();
  const manager = company.data().managers;
  const confirmUrl = `${myurl.frontendMobile}/confirmJobApplication?passcode=${data.passcode}&jobapp=${data.JobApp}`;

  if(manager !== undefined && manager !== []){
    const message = line.ButtonMessage({
      img: `https://www.img.in.th/images/216d038282785fee4f7db523bd5943bf.jpg`,
      title:"มีคำขอเข้าบริษัทใหม่",
      text:`${data.JobAppDetail.name} ได้ส่งคำขอเป็นพนักงานของบริษัท กดเพื่อยืนยัน`,
      action:[
        {"type": "uri", "label": "รับเลย", "uri": confirmUrl}
      ]
    })
    manager.forEach((man) => {
      line.Post(man, message)
    })
  }
}

const jobApplicationManage = async (req, res) => {
  const recipient = req.params.recipient;
  const JobAppId = req.params.JobAppId;
  const isConfirmed = (req.params.isConfirmed === 'true');
  const recipientDoc = await employee.doc(recipient).get();
  const passcode = recipientDoc.data().companyId;
  await company.doc(passcode)
  .collection('JobApplication').doc(JobAppId)
  .update({
    recipient,
    isConfirmed,
    isWatched: true,
    confirmedTime: new Date()
  })
  //update employee status
  const jobApp = await company.doc(passcode)
  .collection('JobApplication').doc(JobAppId)
  .get();
  if(isConfirmed){
    //add this employee to company
    const emp = jobApp.data().owner;
    employee.doc(emp)
    .update({
      isEmployed: isConfirmed,
      companyId: passcode
    });
    company.doc(passcode).update({
      employees: admin.firestore.FieldValue.arrayUnion(emp)
    });
    alertTo(jobApp.data().owner, 'คำขอเข้าบริษัทของคุณ "ได้อนุมัติ" แล้ว')
  }else{
    alertTo(jobApp.data().owner, 'คำขอเข้าบริษัทของคุณ "ถูกปฏิเสธ" ')
  }
  return res.send(response( 
    true,
    `Confirm job application ${JobAppId} completed`,
    {}
  ))
}

const Edit = async (req, res) => {
  const data = req.body;
  try {
    const ref = await employee.doc(data.empId)
    .update(data.employeeDetail);
    console.log(data)
    return res.send(response(
      true,
      `Success edit employee detail`,
      {ref}
    ))
  } catch (error){
    return res.send(errorHandle(error, "Can't create employee."));
  }
}

const Delete = async (req, res) => {
  const employeeId = req.body.employeeId;
  try {
    const emp = await employee.doc(employeeId)
    .get();
    const roleId = emp.data().roleId;
    const roleRef = await company.doc(emp.data().companyId)
    .collection('roles').doc(roleId)
    .update({
      employees: admin.firestore.FieldValue.arrayRemove(employeeId),
      managers: admin.firestore.FieldValue.arrayRemove(employeeId), 
    });
    const compRef = await company.doc(emp.data().companyId)
    .update({
      employees: admin.firestore.FieldValue.arrayRemove(employeeId),
      managers: admin.firestore.FieldValue.arrayRemove(employeeId), 
    });
    const locations = await employee.doc(employeeId)
    .collection('locations').get();
    locations.forEach(l => 
      company.doc(emp.data().companyId)
      .collection('locations').doc(l.id)
      .update({
        employees: admin.firestore.FieldValue.arrayRemove(employeeId),
      })
    )
    const ref = await employee.doc(employeeId)
    .delete();
    return res.send(response(
      true,
      `Success delete employee detail`,
      {ref: {
        employee: ref, 
        company: compRef, 
        role: roleRef
      }}
    ))
  } catch (error){
    return res.send(errorHandle(error, "Can't create employee."));
  }
}

const addLeaveAndMissAttendance = async (passcode) => {
  try{
    let lastCheck = await db.collection('LastAttendenceCheck').doc(passcode).get()
    lastCheck = new Date((lastCheck.data().date).toDate());
    const checkPoint = new Date(lastCheck.setHours(0));
    const now = new Date();
    const whId = getDateStr(now);
    const twoHour = (1000*60*60*2);
    const fromLastCheck = (now - lastCheck);
    if(fromLastCheck > twoHour){
      const employees = await employee
      .where('companyId', '==', passcode)
      .where('isEmployed', '==', true)
      .get()
      db.collection('LastAttendenceCheck').doc(passcode).set({date: now});
      let allWorkHour = [];
      employees.forEach(emp => 
        allWorkHour.push(employee.doc(emp.id)
          .collection('workHour')
          .where('date', '>', checkPoint)
          .get()
        )
      )
      const allWorkHourAwaited = await Promise.all(allWorkHour);
      let whCategorized = [];
      let i = 0;
      employees.forEach(emp => {
        let thisEmp = [];
        allWorkHourAwaited[i].forEach(wh =>{
          thisEmp.push(wh.data());
        })
        if(emp.data().slot.time !== undefined){
          whCategorized.push({
            employeeId: emp.id, 
            workHour: thisEmp, 
            slot: emp.data().slot.time[now.getDay()],
            lateAfter: emp.data().slot.lateAfter,
            leaveInProcess: emp.data().leaveInProcess,
          })
        }
        i++;
      })
      whCategorized.forEach(wh => {
        w = wh.workHour.shift()
        if(w){
          //check clock out
          let match = true;
          if(wh.slot.out){
            if(now > wh.slot.out){
              w.attendance.sort((a,b)=> a.time-b.time)
              for(let j=0;j<w.attendance.length; j++){
                attendance[j].type === 1 
                ? match = false
                : match = true
              }
            }
          }
          if(!match){
            //add clock out
            console.log(`${whId} :${wh.employeeId} : Add Clock out`)
            employee.doc(wh.employeeId)
            .collection('workHour').doc(whId)
            .set({
              date: now,
              attendance: admin.firestore.FieldValue.arrayUnion({
                type: '2',
                time: today.today,
                autoCheck: true,
                location: {lat: 9.710747, lng: 101.349592},
              })
            })
          }
        } else {
          if (checkLeaveInProcess({leaves: wh.leaveInProcess, now}).some((x)=>x)) {
            // add leave type 3
            console.log(`${whId} :${wh.employeeId} : add leave`);
            employee.doc(wh.employeeId)
            .collection('workHour').doc(whId)
            .set({
              date: now,
              attendance: admin.firestore.FieldValue.arrayUnion({type: '3'})
            })
          } else if (!wh.slot.in){
            // add space type 5
            console.log(`${whId} :${wh.employeeId} : add space`);
            employee.doc(wh.employeeId)
            .collection('workHour').doc(whId)
            .set({
              date: now,
              attendance: admin.firestore.FieldValue.arrayUnion({type: '5'})
            })
          } else {
            // add miss type 4
            console.log(`${whId} :${wh.employeeId} : add miss`);
            employee.doc(wh.employeeId)
            .collection('workHour').doc(whId)
            .set({
              date: now,
              attendance: admin.firestore.FieldValue.arrayUnion({type: '4'})
            })
          }
        }
        if(wh.leaveInProcess !== undefined){
          deleteLeaveInProcess( wh.leaveInProcess, now, wh.employeeId);

        }
      })
      return {whCategorized}
    }
    return 'save'
  }catch (err){
    console.log(err)
    return 'wrong'
  }
}
const checkLeaveInProcess = ({leaves, now}) => leaves.map(l=> (now>l.start && now<l.end));

const deleteLeaveInProcess = (leaves, now, employeeId) => {
  const l1 = leaves.length;
  leaves.filter(l=> now < l.end);
  if(l1 !== leaves.length){
    console.log(employeeId + 'delete leaves. New leave in process:'+ leaves)
    // employee.doc(employeeId)
    // .update({leaveInProcess: leaves})
  }
}

const getDateStr = (date) => `${
    date.getFullYear()
  }-${
    (date.getMonth()+1 < 10)
    ? '0'+(date.getMonth()+1)
    : date.getMonth()
  }-${
    (date.getDate() < 10)
    ?'0'+date.getDate()
    : date.getDate()
  }
`


const Attendance = async (req, res) => {
  const start = new Date(req.body.start);
  const end = new Date(req.body.end);
  try {
    const employeesDoc = await employee
    .where('companyId', '==', req.body.passcode)
    .where('isEmployed', '==', true)
    .get();
    let employees = [];
    employeesDoc.forEach(e => employees.push({
      id:e.id,
      name: e.data().name,
      role: e.data().role,
      type: e.data().salary.type,
      slot: e.data().slot,
      lInP: e.data().leaveInProcess
    }))
    await addLeaveAndMissAttendance(employees);
    let AllWorkHour = [];
    employees.forEach(emp => 
      AllWorkHour.push(employee.doc(emp.id)
        .collection('workHour')
        .where('date', '>', start)
        .where('date', '<', end)
        .get()
      )
    );
    const AllAwaited = await Promise.all(AllWorkHour);
    let r = [];
    for(let i=0; i < employees.length; i++){
      let data = {
        id: employees[i].id,
        name: employees[i].name,
        role: employees[i].role,
        type: employees[i].type,
        inTime: 0,
        late: 0,
        leave: 0,
        miss: 0,
        avgWork: 0.0
      };
      let workDay = 0;
      AllAwaited[i].forEach( workHour => {
        data.avgWork += parseFloat(workHour.data().amount).toPrecision(1);
        workHour.data().attendance.forEach(att => {
          if(att.isLate){
            data.late++;
            workDay++;
          }else if(att.type === "3"){
            data.leave++;
          }else if(att.type === "4"){
            data.miss++;
          }else if(att.type === "1"){
            data.inTime++;
            workDay++;
          }
        })
      })
      data.avgWork /= Math.max(workDay, 1);
      r.push(data);
    }
    return res.send(response(
      true,
      `Success get employee attendance`,
      {attendance: r}
    ))
  } catch (error) {
    return res.send(errorHandle(error), "Can't get employee's Attendance.")
  }
}

const WorkHour = async (req, res) => {
  const start = new Date(req.body.start);
  const inputend = new Date(req.body.end);
  const end = new Date(inputend.setDate(inputend.getDate() + 1));
  try {
    const whs = await employee.doc(req.body.id)
    .collection('workHour')
    .where('date', '>', start)
    .where('date', '<=', end)
    .get();
    let workHour = [];
    whs.forEach( wh => {
      let x = wh.data();
      x.date = x.date.toDate();
      if(x.attendance){
        x.attendance.forEach(att=> {
          att.time = att.time.toDate();
        })
      }
      workHour.push(x);
    })
    return res.send(response(
      true,
      `Success get workHour.`,
      { workHour }
    ));
  } catch (error) {
    return res.send(errorHandle(error), "Can't get employee's work hour.")
  }
}

const Slot = async (req, res) => {
  const employee1 = req.params.employeeId
  const employee2 = req.body.userId
  const employeeId = employee1||employee2
  try {
    const emp = await employee.doc(employeeId).get();
    let slot = emp.data().slot.time;
    const message = line.slotMessage(slot);
    line.Post(emp.id, message) //employeeId
    return res.send(response(
      true, 
      "Success get slot",
      { slot }
    ))
  } catch (error) {
    return res.send(errorHandle(error), "Can't get employee's slot.")
  }
}

const GetJobApp = async (passcode) => {
  const doc = await company.doc(passcode)
  .collection('JobApplication').get();
  let allJobApp = [];
  doc.forEach(ja => {
    let j = ja.data();
    j.requestTime = j.requestTime.toDate();
    if(j.confirmedTime !== "") j.confirmedTime = j.confirmedTime.toDate();
    allJobApp.push({
      id: ja.id,
      ...j
    })
  })
  return allJobApp;
}
/**
 * Get all need to show employee's profile
 * @param {*} employeeId
 * @returns employee:{}, requests:[], leaveRight:[]
 */
const GetProfile = async (req, res) => {
  try {
    const profile = (await employee.doc(req.body.employeeId).get()).data();
    const allLeave = await employee.doc(req.body.employeeId)
    .collection('leaves')
    .where('delete', '==', false)
    .get();
    let leaveRight = [];
    allLeave.forEach(l =>
      leaveRight.push({
        id: l.id,
        balance: l.data().amount - l.data().used,
        ...l.data(),
      })
    )
    let requestData = []
    allLeave.forEach(l => 
      requestData.push(
        company.doc(profile.companyId)
        .collection('leaves').doc(l.id)
        .collection('requests')
        .where('owner', '==', req.body.employeeId)
        .get()
      )
    )
    const requestDataAwaited =  await Promise.all(requestData);
    let requests = [];
    requestDataAwaited.forEach(leaveReq => {
      leaveReq.forEach(r => {
        let x = r.data();
        x.requestTime = x.requestTime.toDate();
        if(x.confirmedTime._seconds) x.confirmedTime = x.confirmedTime.toDate();
        requests.push({
          id: r.id,
          ...x,
          type: 'ลา'
        })
      })
    })
    return res.send(response(
      true,
      `success get profile : ${req.body.employeeId}`,
      {employee: profile, requests, leaveRight}
    ))
  } catch (err) {
    return res.send(errorHandle(err, 'can get profile'))
  }
}

module.exports = {
  Get,
  Add,
  Edit,
  Delete, 
  WorkHour,
  Attendance,
  Slot,
  GetJobApp,
  jobApplicationManage,
  GetProfile,
  addLeaveAndMissAttendance,
}