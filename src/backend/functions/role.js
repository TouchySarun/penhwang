const db = require('./db');

const admin = require('firebase-admin')
const company = db.collection('company');
const employee = db.collection('employee');
const errormessage = require('./errormessage');
const response = require('./returnFrom');
const errorHandle = require('./errorHandle');
const alertTo = require('./aleartTo');

const Get = async (req, res) => {
  const passcode = req.body.passcode;
  const RoleRef = await company
  .doc(passcode)
  .collection('roles')
  .get()
  let roles = {}
  if(RoleRef.empty){
    return res.send(errorHandle({}, "wrong passcode."));
  }
  let roleId = [];
  let AllEmployees = [];
  let AllManagers = []; 
  let AllSlots = [];
  RoleRef.forEach(
    snapshot => {
      roleId.push(snapshot.id);
      AllEmployees.push(employees({roleId: snapshot.id}));
      AllManagers.push(managers({roleId: snapshot.id}));
      AllSlots.push(slots({roleId: snapshot.id, passcode}))
      roles[snapshot.id] = {
        id: snapshot.id,
        ...snapshot.data()
      }
    }
  )
  const AllEmp = await Promise.all(AllEmployees);
  const AllMng = await Promise.all(AllManagers);
  const AllSlt = await Promise.all(AllSlots);
  for(let i=0; i< roleId.length; i++){
    roles[roleId[i]].employees = AllEmp[i];
    roles[roleId[i]].managers = AllMng[i];
    roles[roleId[i]].slots = AllSlt[i];
  }
  return res.send(response(
    true, 
    "Success get Role", 
    {roles}
  ))
}

const Add = async (req, res) => {
  const data = req.body
  try {
    const roleData = {
      name: data.name,
      description: data.description,
      creator: data.employeeId
    }
    const ref = await company
    .doc(data.passcode)
    .collection('roles')
    .add(roleData)
    data.managers.forEach(emp => {
      employee.doc(emp).update({
        role: data.name, 
        roleId: ref.id, 
        isManager: true
      });
      alertTo(emp, `You have add to role: ${data.name}`);
    });
    data.employees.forEach(emp => {
      employee.doc(emp).update({
        role: data.name, 
        roleId: ref.id, 
        isManager: false
      });
      alertTo(emp, `You have add to role: ${data.name}`);
    });
    data.slots.forEach(slot => {
      company.doc(data.passcode)
      .collection('slots').doc(slot)
      .update({roles: admin.firestore.FieldValue.arrayUnion(ref.id)})
    })
    return res.send(response(
      true, 
      `Success add roles with id: ${ref.id}`, 
      {id:ref.id, ref}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't Add role."));
  }
}
const Edit = async(req, res)=> {
  const data = req.body
  try {
    var empDelRefs = [];
    if(data.roleDetail.name !== undefined){
      await data.employees.forEach(emp=>{
        empDelRefs.push(employee.doc(emp).update({role: data.roleDetail.name}))
      });
      await data.managers.forEach(emp=>{
        empDelRefs.push(employee.doc(emp).update({role: data.roleDetail.name}))
      });
    }
    const roleEditRef = await company.doc(data.passcode)
    .collection('roles').doc(data.roleId)
    .update(data.roleDetail);
    return res.send(response(
      true,
      `Success edit role.`,
      {ref:{role: roleEditRef, employees: empDelRefs}}
    ))
  } catch (error){
    return res.send(errorHandle(error, "Can't edit role."));
  }
}
const Delete = async(req, res) => {
  const data = req.body
  try {
    const role = await company.doc(data.passcode)
    .collection('roles').doc(data.roleId)
    .get();
    const employees = data.employees;
    const managers = data.managers;
    const slots = data.slots;
    var slotDelRefs = [];
    var empDelRefs = [];
    if(employees){
      employees.forEach(emp=>{
        empDelRefs.push(employee.doc(emp).update({role: "", roleId: "", isManager: false}));
        alertTo(emp, `You have removed from role: ${role.data().name}`);
      });
    }
    if(managers){
      managers.forEach(emp=>{
        empDelRefs.push(employee.doc(emp).update({role: "", roleId: "", isManager: false}));
        alertTo(emp, `You have removed from role: ${role.data().name}`);
      });
    }
    if(slots){
      slots.forEach(slot => {
        slotDelRefs.push(
          company.doc(data.passcode)
          .collection('slots').doc(slot)
          .update({
            roles: admin.firestore.FieldValue.arrayRemove(data.roleId)
          })
        )
      })
    }
    const roleDelRef = await company.doc(data.passcode)
    .collection('roles').doc(data.roleId)
    .delete();
    return res.send(response(
      true,
      `Delete role ${data.roleId} success`,
      {ref:{role: roleDelRef, employees: empDelRefs}}
    ))
  } catch (error){
    return res.send(errorHandle(error, "Can't delete role."));
  }
}

const slots = async ({passcode, roleId}) => {
  try {
    const ref = await company.doc(passcode)
    .collection('slots')
    .where('roles', 'array-contains', roleId)
    .get();
    let s = []; 
    ref.forEach(r => s.push(r.id));
    return s;
  } catch (err) {
    return console.log(err);
  }
}

const GetSlot = async(req, res)=> {
  const data = req.body
  try {
    const ref = await company.doc(data.passcode)
    .collection('roles').doc(data.roleId)
    .get()
    return res.send(response(
      true,
      `Get slot form role ${data.roleId}`,
      {
        ref,
        slots: ref.data().slots,
      }
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't get slots"));
  }
}

const UpdateSlot = async (req, res) => {
  const data = req.body
  try {
    const o = await slots(data);
    const n = data.slots.filter(e => !o.includes(e));
    const d = o.filter(e => !data.slots.includes(e));
    n.forEach(slot => {
      company.doc(data.passcode)
      .collection('slots').doc(slot)
      .update({
        roles: admin.firestore.FieldValue.arrayUnion(data.roleId)
      })
    })
    d.forEach(slot => {
      company.doc(data.passcode)
      .collection('slots').doc(slot)
      .update({
        roles: admin.firestore.FieldValue.arrayRemove(data.roleId)
      })
    })
    return res.send(response(
      true, 
      `Success set slot: [ ${data.slots} ] to role ${data.roleId}`,
      {newSlot: n, delSlot: d}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't update slots from role"));
  }
}
const employees = async ({roleId}) => {
  try {
    const ref = await employee
    .where('roleId', '==', roleId)
    .where('isManager', '==', false)
    .get();
    let e = [];
    ref.forEach(r => e.push(r.id));
    return e;
  } catch (err){
    return console.log(err);
  }
}
const managers = async ({roleId}) => {
  try {
    const ref = await employee
    .where('roleId', '==', roleId)
    .where('isManager', '==', true)
    .get();
    let e = [];
    ref.forEach(r => e.push(r.id));
    return e;
  } catch (err){
    return console.log(err);
  }
}

const GetEmployee = async (req, res)=> {
  const data = req.body
  try {
    const ref = await company.doc(data.passcode)
    .collection('roles').doc(data.roleId)
    .get()
    const employees = ref.data().employees
    return res.send(response(
      true,
      `Success get employees form role ${data.roleId}`,
      {
        employee: employees,
        ref
      }
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't get employees from role"));
  }
}

const UpdateEmployee = async(req, res)=> {
  const data = req.body
  try{
    const role = await company.doc(data.passcode)
    .collection('roles').doc(data.roleId)
    .get()
    const oldEmp = await employees(data);
    const newEmp = data.employees.filter(e => !oldEmp.includes(e));
    const delEmp = oldEmp.filter(e => !data.employees.includes(e));
    var empRef = [];
    await newEmp.forEach(e => {
      empRef.push(employee.doc(e).update({
        role: role.data().name, 
        roleId: data.roleId, 
        isManager: false
      }));
      alertTo(e, `You have add to role: ${role.data().name}`)
    })
    await delEmp.forEach(e => {
      empRef.push(employee.doc(e).update({
        role: "", 
        roleId: "",
        isManager: false
      }));
      alertTo(e, `You have remove from role: ${role.data().name}`)
    })
    return res.send(response(
      true,
      `add employee ${data.employees} to role ${data.roleId}`,
      {ref:empRef, newEmployee: newEmp, oldEmployee: oldEmp}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't set role's employees."));
  }
}
const GetManager = async (req, res) => {
  try {
    const ref = await company.doc(req.body.passcode)
    .collection('roles').doc(req.body.roleId)
    .get();
    const managers = ref.data().managers;
    return res.send(response(
      true,
      `Success get managers`,
      { managers,ref }
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't get role's managers."));
  }
}
const UpdateManager = async (req, res) => {
  const data = req.body
  try{
    const role = await company.doc(data.passcode)
    .collection('roles').doc(data.roleId)
    .get()
    const oldEmp = await managers(data);
    const newEmp = data.managers.filter(e => !oldEmp.includes(e));
    const delEmp = oldEmp.filter(e => !data.managers.includes(e));
    var empRef = [];
    newEmp.forEach(e => {
      empRef.push(employee.doc(e).update({
        role: role.data().name, 
        roleId: data.roleId,
        isManager: true
      }));
      alertTo(e, `You have add to role: ${role.data().name}`);
    })
    delEmp.forEach(e => {
      empRef.push(employee.doc(e).update({
        role: "", 
        roleId: "",
        isManager: false
      }));
      alertTo(e, `You have remove from role: ${role.data().name}`);
    })
    const ref = await company.doc(data.passcode)
    .collection('roles').doc(data.roleId)
    .update({
      managers: data.managers
    })
    return res.send(response(
      true,
      `add employee ${data.managers} to role ${data.roleId}`,
      {ref:{role:ref, employees: empRef}}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't set role's managers."));
  }
}

module.exports = {
  Get,
  Add,
  Edit,
  Delete,
  GetSlot,
  UpdateSlot,
  GetEmployee,
  UpdateEmployee,
  GetManager,
  UpdateManager,
}