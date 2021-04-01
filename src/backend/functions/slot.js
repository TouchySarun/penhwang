const db = require('./db');
const admin = require('firebase-admin')

const company = db.collection('company');
const employee = db.collection('employee');
const myArray = require('./myArray')
const errormessage = require('./errormessage');
const response = require('./returnFrom');
const errorHandle = require('./errorHandle');
const myurl = require('./url');
const line = require('./line');
const alertTo = require('./aleartTo');

const Get = async (req, res) => {
  let slots = {};
  const passcode = req.body.passcode;
  try {
    const SlotRef = await company.doc(passcode)
    .collection('slots')
    .get();
    if(SlotRef.empty){
      return res.send(errorHandle({}, "wrong passcode."));
    }
    let AllEmployees = [];
    let slotId = [];
    SlotRef.forEach( snapshot => {
      AllEmployees.push(getEmployees(snapshot.id));
      slotId.push(snapshot.id);
      slots[snapshot.id] = {
        id: snapshot.id,
        ...snapshot.data(),
      }
    });
    const AllEmps = await Promise.all(AllEmployees);
    for(let i=0; i<AllEmps.length; i++){
      slots[slotId[i]].employees = AllEmps[i];
    }
    return res.send(response(
      true, 
      "Success get Slot", 
      {slots}
    ))
  } catch (error) {
    return res.send(errorHandle(error, `Can't get slots`))
  }
}
const getEmployees = async (slotId) => {
  try {
    const doc = await employee.where('slotId', '==', slotId).get();
    let employees = [];
    doc.forEach(d => employees.push(d.id));
    return employees
  } catch (error) {
    throw(error);
  }
}
const GetUsable = async (req, res) => {
  let slots = [];
  try {
    const employeeId = req.params.employeeId;
    const employeeRef = await employee.doc(employeeId).get();
    const slotRefs = await company.doc(employeeRef.data().companyId)
      .collection('slots')
      .where('roles', "array-contains", employeeRef.data().roleId)
      .get();
    slotRefs.forEach(ref => {
      slots.push({
        id:ref.id,
        ...ref.data()
      })
    })
    return res.send(response(
      true,
      `Success get usable slots from employee:${employeeRef.data().name}`,
      {slots, employee: employeeRef.data()}
    ))

  } catch (error) {
    return res.send(errorHandle(error, "Can't get slot"))
  }
}

const Add = async (req, res) => {
  const data = req.body
  try {
    const slotData = {
      name: data.name,
      time: data.time,
      lateAfter: data.lateAfter,
      creator: data.employeeId,
      roles: []
    }
    const ref = await company.doc(data.passcode)
    .collection('slots')
    .add(slotData)
    data.employees.forEach(emp => {
      employee.doc(emp)
      .update({
        slot:{
          time:data.time, 
          lateAfter: data.lateAfter
        },
        slotId: ref.id
      });
      alertTo(emp, `You have add to slot: ${data.name}`);
    });
    return res.send(response(
      true, 
      `Success add slot with id: ${ref.id}`, 
      {id:ref.id, ref}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't Add slot."));
  }
}

const Edit = async (req, res) => {
  const data = req.body
  try {
    const ref = await company.doc(data.passcode)
    .collection('slots').doc(data.slotId)
    .update(data.slotData)
    for(const emp of data.employees) {
      employee.doc(emp)
      .update({
        slotId: data.slotId,
        slot:{
          time: data.slotData.time,
          lateAfter: data.slotData.lateAfter
        }
      })
      alertTo(emp, "มีการแก้ไขตารางทำงานของคุณ");
    }
    return res.send(response(
      true,
      `Success update slot ${data.slotId}.`,
      {ref}
    ))
  } catch (error){
    return res.send(errorHandle(error, "Can't edit slot."));
  }
}
const Delete = async (req, res) => {
  const data = req.body
  try {
    var empDelRefs = [];
    const slot = await company.doc(data.passcode)
    .collection('slots').doc(data.slotId)
    .get();
    const roles = slot.data().roles;
    roles.forEach(role => {
      company.doc(data.passcode)
      .collection('roles').doc(role)
      .update({
        slots: admin.firestore.FieldValue.arrayRemove(data.slotId)
      })
    })
    data.employees.forEach(async (emp) => {
      const empRef = await employee.doc(emp).update({
        slotId: "",
        slot: {}
      });
      empDelRefs.push(empRef);
      alertTo(emp, "มีการแก้ไขตารางทำงานของคุณ");
    });

    const slotDelRef = await company.doc(data.passcode)
    .collection('slots').doc(data.slotId)
    .delete();
    return res.send(response(
      true,
      `Delete slot ${data.slotId} success`,
      {ref:{slot: slotDelRef, employees: empDelRefs}}
    ))
  } catch (error){
    return res.send(errorHandle(error, "Can't delete slot."));
  }
}

const GetEmployee = async(req, res)=>{
  const data = req.body
  try {
    const doc = await employee.where('slotId', '==', data.slotId).get();
    // firebase snapShot can't use map
    let employees = [];
    doc.forEach(d => employees.push(d.id));
    return res.send(response(
      true,
      `Success get employee from slot ${data.slotId}.`,
      {employees}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't get employees from slot."));
  }
}

const UpdateEmployee = async (req, res) => {
  const data = req.body
  try{
    const slot = await company.doc(data.passcode)
    .collection('slots').doc(data.slotId)
    .get()
    const getEmp = await employee.where('slotId', '==', data.slotId).get();
    const oldEmp = [];
    getEmp.forEach(d => oldEmp.push(d.id));
    const newEmp = data.employees.filter(e => !oldEmp.includes(e));
    const delEmp = oldEmp.filter(e => !data.employees.includes(e));
    var empRef = [];
    newEmp.forEach(e => {
      empRef.push(
        employee.doc(e)
        .update({
          slotId: data.slotId,
          slot: {
            lateAfter: slot.data().lateAfter,
            time: slot.data().time
          }
        })
      );
      alertTo(e, `มีการแก้ไขตารางทำงานของคุณ`)
    })
    delEmp.forEach(e => {
      empRef.push(
        employee.doc(e).update({
          slotId: "", 
          slot: {}
        })
      );
      alertTo(e, `มีการแก้ไขตารางทำงานของคุณ`)
    })
    return res.send(response(
      true,
      `add employee ${data.employees} to slot ${data.slotId}`,
      {ref:await Promise.all(empRef)}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't set slot's employees."));
  }
}
const GetRequests = async (passcode) => {
  var requests = [];
  const requestRef = await company.doc(passcode)
  .collection('changeSlotReqs').get()
  requestRef.forEach( req => {
    const r = req.data();
    r.requestTime = r.requestTime.toDate();
    if(r.confirmedTime !== '') r.confirmedTime = r.confirmedTime.toDate();
    requests.push({
      id: req.id,
      ...r
    })
  });
  return requests;
}
const ChangeSlotReq = async (req, res) => {
  const data = req.body;
  try {
    const reqData = {
      owner: data.employeeId,
      recipient: "",
      start: data.start,
      newSlot: data.newSlot,
      newSlotName: data.newSlotName,
      oldSlot: data.oldSlot,
      oldSlotName: data.oldSlotName,
      requestTime: new Date(),
      confirmedTime: '',
      isConfirmed: false,
      isWatched: false,
      reason: data.reason,
      confirmedReason: ''
    }
    const ref = await company.doc(data.passcode)
    .collection('changeSlotReqs').add(reqData)
    const e = await employee.doc(data.employeeId).get()
    const manager = await employee
    .where('roleId', '==', e.data().roleId)
    .where('isManager', '==', true)
    .get()
    const message = line.confirmMessage({
      title: "จัดการกะ",
      text: "เลือกเพื่อจัดการกะให้พนักงาน",
      alt:"มีพนักงานส่งคำขอเปลี่ยนกะมาให้คุณ",
      img: "https://sv1.picz.in.th/images/2021/03/16/DgnjzW.png",
      confirmUrl: `${myurl.frontendMobile}/changeSlotManage?id=${data.employeeId}&req=${ref.id}&confirm=true&reason=ได้`,
      rejectUrl: `${myurl.frontendMobile}/changeSlotManage?id=${data.employeeId}&req=${ref.id}&confirm=false&reason=ไม่ได้`,
    })
    manager.forEach(mn =>
      line.Post(mn.id, message)
    )
    return res.send(response(
      true,
      `Success send change slot request.`,
      {id: ref.id, ref}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't send request."));
  }
}

const ChangeSlotManage = async (req, res) => {
  const recipient =  req.params.empId;
  const requestId =  req.params.reqId;
  const isConfirmed =  (req.params.isConfirmed === 'true');
  const confirmedReason =  req.params.reason;
  try {
    const recipientDoc = await employee.doc(recipient).get();
    const passcode = recipientDoc.data().companyId;
    const ref = await company.doc(passcode)
    .collection('changeSlotReqs').doc(requestId)
    .update({
      isConfirmed,
      recipient,
      confirmedReason,
      isWatched: true,
      confirmedTime: new Date()
    });
    const request = await company.doc(passcode)
    .collection('changeSlotReqs').doc(requestId)
    .get();
    if(isConfirmed){
      await db.collection('jobLists')
      .add({
        time: request.data().start,
        func: "changeSlot",
        employeeId: request.data().owner,
        data: {
          passcode: passcode,
          employeeId: request.data().owner,
          newSlot: request.data().newSlot,
        }
      })
      alertTo(request.data().owner, 'คำขอเปลี่ยนกะของคุณ "ได้อนุมัติ" แล้ว');
    }else{
      alertTo(request.data().owner, 'คำขอเปลี่ยนกะของ "คุณถูกปฏิเสธ"')
    }
    return res.send(response(
      true,
      `Success manage slot.`,
      {ref}
    ));
  } catch (error) {
    return res.send(errorHandle(error, "Fail to manage the request."));
  }
}

const ChangeSlot = async ({passcode, employeeId, newSlot}) => {
  try {
    const slot = await company.doc(passcode)
    .collection('slots').doc(newSlot)
    .get();
    const empRef = await employee.doc(employeeId)
    .update({
      slotId: newSlot,
      slot: {
        lateAfter: slot.data().lateAfter,
        time: slot.data().time
      }
    })
    alertTo(employeeId, `มีการแก้ไขตารางทำงานของคุณ`)
    return response(
      true,
      `add employee ${employeeId} to slot ${newSlot}`,
      {ref:empRef}
    )

  } catch (error) {
    return errorHandle(
      error, `fail to change slot. employee: ${employeeId}/ slot: ${newSlot}`
    )
  }
}

module.exports = {
  GetUsable,
  Get,
  GetRequests,
  Add,
  Edit,
  Delete,
  GetEmployee,
  UpdateEmployee,
  ChangeSlotReq,
  ChangeSlotManage,
  ChangeSlot
}