const db = require('./db')
const admin = require('firebase-admin')

const errormessage = require('./errormessage')
const response = require('./returnFrom')
const line = require('./line')
const alertTo = require('./aleartTo')
const myurl = require('./url');
const errorHandle = require('./errorHandle')

const company = db.collection('company')
const employee = db.collection('employee')

const Get = async (req, res) => {
  const passcode = req.body.passcode;
  const ref = await company
    .doc(passcode)
    .collection('leaves')
    .where('delete', '==', false)
    .get()
  let leaves = {}
  if (ref.empty) {
    return res.send(response(
      true,
      "Success get Leaves", {
        leaves
      }
    ));
  }
  ref.forEach(
    snapshot => {
      leaves[snapshot.id] = {
        id: snapshot.id,
        ...snapshot.data()
      }
    }
  )
  return res.send(response(
    true,
    "Success get Leaves", {
      leaves
    }
  ))
}

const Add = async (req, res) => {
  const data = req.body
  try {
    const leaveData = {
      name: data.name,
      amount: data.amount,
      creator: data.employeeId,
      employees: data.employees,
      delete: false
    }
    const ref = await company.doc(data.passcode)
      .collection('leaves').add(leaveData);
    data.employees.forEach(emp => {
      alertTo(emp, `ขณะนี้คุณมีสิทธิ์ลา: ${data.name}`);
      employee.doc(emp)
        .collection('leaves').doc(ref.id)
        .set({
          leave: {
            name: data.name,
            amount: data.amount,
            used: 0,
            requestId: [],
            delete: false
          }
        })
    });
    return res.send(response(
      true,
      `Success add leaves with id: ${ref.id}`, {
        id: ref.id,
        ref
      }
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't Add role."));
  }
}

const Edit = async (req, res) => {
  const data = req.body
  try {
    const leave = await company.doc(data.passcode)
    .collection('leaves').doc(data.leaveId)
    .get();
    let empRefs = [];
    const empLeaveData = {...data.leaveData};
    delete empLeaveData["employees"];
    delete empLeaveData["creator"];
    await leave.data().employees.forEach(emp => {
      empRefs.push(
        employee.doc(emp)
        .collection('leaves').doc(data.leaveId)
        .update(empLeaveData)
      );
    });
    const leaveRef = await company.doc(data.passcode)
      .collection('leaves').doc(data.leaveId)
      .update(data.leaveData);
    return res.send(response(
      true,
      `Success edit detail`, {
        ref: {
          leave: leaveRef,
          employee: empRefs
        }
      }
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't edit leave."));
  }
}

const Delete = async (req, res) => {
  const data = req.body;
  let empRefs = [];
  try {
    const leave = await company.doc(data.passcode)
      .collection('leaves').doc(data.leaveId)
      .get();
    leave.data().employees.forEach(async emp => {
      const empRef = await employee.doc(emp)
        .collection('leaves').doc(data.leaveId)
        .update({delete: true});
      alertTo(emp, `การลาประเภท ${leave.data().name} ได้ถูกยกเลิกแล้ว โปรดตรวจสอบการลาของคุณ (การกระทำนี้จะไม่มีผลต่อคำขอที่ถูกอนุมัติไปก่อนหน้า แต่คำขอที่อยู่ระหว่างดำเนินการจะถูกยกเลิกทั้งหมด)`)
      empRefs.push(empRef);
    });
    const leaveRef = await company.doc(data.passcode)
      .collection('leaves').doc(data.leaveId)
      .update({delete: true});
    return res.send(response(
      true,
      `Success delete leave type.`, {
        ref: {
          leave: leaveRef,
          employee: empRefs
        }
      }
    ));
  } catch (error) {
    return res.send(errorHandle(error, "Can't delete leave."));
  }
}

const UpdateEmployee = async (req, res) => {
  const data = req.body;
  let newEmpRef = [];
  let delEmpRef = [];
  try {
    const leave = await company.doc(data.passcode)
      .collection('leaves').doc(data.leaveId)
      .get();
    const oldEmp = leave.data().employees;
    const newEmp = data.employees.filter(e => !oldEmp.includes(e));
    const delEmp = oldEmp.filter(e => !data.employees.includes(e));
    for (const emp of newEmp) {
      newEmpRef.push(employee.doc(emp)
        .collection('leaves').doc(leave.id)
        .set({
          name: leave.data().name,
          amount: leave.data().amount,
          used: 0,
          requestId: [],
          delete: false,
        }));
      alertTo(emp, `คุณได้รับสิทธิ์ในการลาประเภท "${leave.data().name}"`);
    }
    for (const emp of delEmp) {
      delEmpRef.push(employee.doc(emp)
        .collection('leaves').doc(leave.id)
        .update({delete: true}));
      alertTo(emp, `สิทธิ์ในการลาประเภท "${leave.data().name}" ได้ถูกยกเลิกแล้ว โปรดตรวจสอบการลาของคุณ (การกระทำนี้จะไม่มีผลต่อคำขอที่ถูกอนุมัติไปก่อนหน้า แต่คำขอที่อยู่ระหว่างดำเนินการจะถูกยกเลิกทั้งหมด)`);
    }
    const leaveDoc = await company.doc(data.passcode)
      .collection('leaves').doc(data.leaveId)
      .update({
        employees: data.employees
      });
    return res.send(response(
      true,
      `Success update employe of leave: ${data.leaveId}. new employee: [${newEmp}]. removed employee: [${delEmp}].`, {
        ref: {
          leave: leaveDoc,
          employee: {
            del: await Promise.all(delEmpRef),
            new: await Promise.all(newEmpRef)
          }
        }
      }
    ));
  } catch (error) {
    return res.send(errorHandle(error, "Can't update employees that use this leave."));
  }
}
/**
 * get leave right from employee
 * @param employeeId with requse url
 * @param sendMessage
 */
const GetRight = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const leaveRef = await employee.doc(employeeId)
      .collection('leaves')
      .where('delete', '==', false)
      .get();
    let leaves = [];
    leaveRef.forEach(l =>
      leaves.push({
        id: l.id,
        balance: l.data().amount - l.data().used,
        ...l.data(),
      })
    )
    return res.send(response(
      true,
      `Success get leave day right from employee ${employeeId}.`,
      {leaves}
    ));
  } catch (error) {
    return res.send(errorHandle(error, "Can't get leave."));
  }
}
/**
 * create Leave Request
 * @param {*} leaveData employeeId, start, end, reason, passcode, leaveId
 */
const Req = async (req, res) => {
  const data = req.body
  try {
    const reqData = {
      owner: data.employeeId,
      recipient: "",
      start: data.start,
      end: data.end,
      requestTime: new Date(),
      confirmedTime: {},
      isWatched: false,
      isConfirmed: false,
      reason: data.reason,
      confirmedReason: ""
    };
    const e = await employee.doc(data.employeeId).get();
    const req = await company.doc(e.data().companyId)
      .collection('leaves').doc(data.leaveId)
      .collection('requests')
      .add(reqData);
    const emp = await employee.doc(data.employeeId)
      .collection('leaves').doc(data.leaveId)
      .set({
        requestId: admin.firestore.FieldValue.arrayUnion(req.id)
      }, {merge: true});
    const manager = await employee
    .where('roleId', '==', e.data().roleId)
    .where('isManager', '==', true)
    .get()
    const message = line.confirmMessage({
      title: "ลา",
      text: "เลือกเพื่อจัดการคำขอลาของพนักงาน",
      alt:"มีพนักงานส่งคำขอลามาให้คุณ",
      img: "https://www.img.in.th/images/5dfbbff4a010135e3f6ff5a84fc99499.png?fbclid=IwAR0hDONZV89-e2Ij3hRHc5Gy-m7wgz0R2yi6k2emkwn0k9dYKTvZ9_oOADs",
      confirmUrl: `${myurl.frontendMobile}/changeSlotManage?id=${data.employeeId}&req=${req.id}&confirm=true&reason=ได้`,
      rejectUrl: `${myurl.frontendMobile}/changeSlotManage?id=${data.employeeId}&req=${req.id}&confirm=false&reason=ไม่ได้`,
    })
    manager.forEach(mn =>
      line.Post(mn.id, message)
    )
    return res.send(response(
      true,
      `Success send request. employee:${data.employeeId}, request id: ${req.id}`, {
        ref: {
          req,
          emp
        }
      }
    ));
  } catch (error) {
    if(error.code === 5){
      return res.send(errorHandle(error, "Can't send request because you have not right."));
    }
    return res.send(errorHandle(error, "Can't send request."));
  }
}
/**
 * manager Leave Request Confirmed/ not
 */
const Manage = async (req, res) => {
  const recipient =  req.params.empId;
  const owner = req.params.owner;
  const requestId =  req.params.reqId;
  const isConfirmed =  (req.params.isConfirmed === 'true');
  const confirmedReason =  req.params.reason;
  const leaveId = req.params.leaveId;
  try {
    const recipientDoc = await employee.doc(recipient).get();
    const passcode = recipientDoc.data().companyId;
    const leaveDoc = await company.doc(passcode)
    .collection('leaves').doc(leaveId)
    .collection('requests').doc(requestId)
    .update({
      isConfirmed,
      confirmedReason,
      recipient,
      isWatched: true,
      confirmedTime: new Date()
    });
    if (isConfirmed) {
      const leave = await company.doc(passcode)
      .collection('leaves').doc(leaveId)
      .collection('requests').doc(requestId)
      .get();
      const iStart = new Date(leave.data().start);
      const iEnd = new Date(leave.data().end);
      const leaveAmount = Math.ceil((iEnd - iStart) / (1000 * 3600 * 24));
      employee.doc(owner)
      .collection('leaves').doc(leaveId)
      .update({
        used: admin.firestore.FieldValue.increment(leaveAmount)
      });
      employee.doc(owner)
      .update({
        leaveInProcess: admin.firestore.FieldValue.arrayUnion({
          requestId,
          start: iStart,
          end: iEnd
        })
      });
      alertTo(owner, "คำขอของคุณได้รับการอนุมัติแล้ว");
    } else {
      alertTo(owner, "คำขอของคุณถูกปฏิเสธแล้ว");
    }
    return res.send(response(
      true,
      `Success manage leave request:( ${requestId} ).`, {
        ref: {
          leave: leaveDoc,
        }
      }
    ));
  } catch (error) {
    return res.send(errorHandle(error, "Can't manage request."));
  }
}
const GetRequests = async (passcode) => {
  const leavesDoc = await company.doc(passcode)
  .collection('leaves').get();
  let leaves = [];
  leavesDoc.forEach((leave) => leaves.push(leave.id));
  let requestData = await Promise.all(leaves.map(leave =>
    company.doc(passcode)
    .collection('leaves').doc(leave)
    .collection('requests').get()
  ));
  let requests = [];
  for(let i = 0; i < requestData.length; i++){
    requestData[i].forEach( r => {
      let x = r.data();
      x.requestTime = x.requestTime.toDate();
      if(x.confirmedTime._seconds) x.confirmedTime = x.confirmedTime.toDate();
      requests.push({
        id: r.id,
        ...x,
        leaveId: leaves[i]
      })
    })
  }
  return requests;
}
module.exports = {
  Get,
  Add,
  Edit,
  Delete,
  Req,
  GetRight,
  Manage,
  UpdateEmployee,
  GetRequests
}