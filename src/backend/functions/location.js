const db = require('./db')
const admin = require('firebase-admin')

const errormessage = require('./errormessage')
const response = require('./returnFrom')
const line = require('./line')
const alertTo = require('./aleartTo')
const errorHandle = require('./errorHandle')
const company = db.collection('company')
const employee = db.collection('employee')

const Get = async (req, res) => {
  const data = req.body;
  try {
    const ref = await company.doc(data.passcode)
    .collection('locations')
    .get()
    let locations = {}
    if(ref.empty){
      return res.send(response(
        true, 
        "Success get locations", 
        { locations }
      ));
    }
    ref.forEach(
      snapshot => {
        locations[snapshot.id] = {
          id: snapshot.id,
          ...snapshot.data()
        }
      }
    )
    return res.send(response(
      true, 
      "Success get locations", 
      { locations }
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't Get location."));
  }
}
const Add = async (req, res) => {
  const data = req.body;
  try {
    let employees = [];
    const location = await company.doc(data.passcode)
    .collection('locations').add({
      name: data.name,
      lat: data.lat,
      lng: data.lng,
      error: data.error,
      employees: data.employees,
      creator: data.employeeId,
    });
    for(const emp of data.employees){
      employees.push(
        employee.doc(emp)
        .collection('locations').doc(location.id)
        .set({
          name: data.name,
          lat: data.lat,
          lng: data.lng,
          error: data.error,
        })
      );
      alertTo(emp, `คุณได้รับสิทธิ์ในการใช้งานจุดเช็คชื่อ "${data.name}"`);
    }
    await Promise.all(employees);
    return res.send(response(
      true,
      `Success add new location with id:${location.id}.`,
      {id:location.id, ref:{location, employees}}
    ));
  } catch (error) {
    return res.send(errorHandle(error, "Can't Add location."));
  }
}
const Edit = async (req, res)=>{
  const data = req.body;
  try {
    let employees = [];
    const location = await company.doc(data.passcode)
    .collection('locations').doc(data.locationId)
    .get();
    const empLoDetail = {...data.locationDetail}
    delete empLoDetail["employees"];
    delete empLoDetail["creator"];
    if(empLoDetail !== {}){
      for(const emp of location.data().employees){
        employees.push(
          employee.doc(emp)
          .collection('locations').doc(data.locationId)
          .update(empLoDetail)
        );
      }
    }
    const ref = await company.doc(data.passcode)
    .collection('locations').doc(data.locationId)
    .update(data.locationDetail);
    
    await Promise.all(employees);

    return res.send(response(
      true,
      `Success edit location:${data.locationId} with detail:${data.locationDetail}.`,
      {ref:{location:ref, employees}}
    ))
  } catch (error) {
    return res.send(errorHandle(error, "Can't Edit location."));
  }
}

const Delete = async (req, res)=>{
  const data = req.body;
  let delEmpRefs = [];
  try {
    const location = await company.doc(data.passcode)
    .collection('locations').doc(data.locationId)
    .get();
    let delEmp = [];
    location.data().employees.forEach( emp => delEmp.push(emp));
    for(const emp of delEmp){
      delEmpRefs.push(
        employee.doc(emp)
        .collection('locations').doc(location.id)
        .delete()
      );
      alertTo(emp, `สิทธิ์ในการใช้งานจุดเช็คชื่อ "${location.data().name}" ได้ถูกยกเลิกแล้ว`);
    }
    const ref = await company.doc(data.passcode)
    .collection('locations').doc(data.locationId)
    .delete();
    await Promise.all(delEmpRefs);
    return res.send(response(
      true,
      `Success delete location:${data.locationId}. Impact to employee [${delEmp}].`,
      {ref:{location:ref, employees:delEmpRefs}}
    ));
  } catch (error) {
    return res.send(errorHandle(error, "Can't delete location."));
  }
}
const UpdateEmployee = async (req, res) => {
  const data = req.body;
  let newEmpRef = [];
  let delEmpRef = [];
  try {
    const location = await company.doc(data.passcode)
    .collection('locations').doc(data.locationId)
    .get();
    const empLoDetail = {...location.data()}
    delete empLoDetail["employees"];
    delete empLoDetail["creator"];
    const oldEmp = location.data().employees;
    const newEmp = data.employees.filter(e => !oldEmp.includes(e));
    const delEmp = oldEmp.filter(e => !data.employees.includes(e));
    for(const emp of newEmp){
      newEmpRef.push(
        employee.doc(emp)
        .collection('locations').doc(location.id)
        .set(empLoDetail)
      );
      alertTo(emp, `คุณได้รับสิทธิ์ในการใช้งานจุดเช็คชื่อ "${empLoDetail.name}"`);
    }
    for(const emp of delEmp){
      delEmpRef.push(
        employee.doc(emp)
        .collection('locations').doc(location.id)
        .delete()
      );
      alertTo(emp, `สิทธิ์ในการใช้งานจุดเช็คชื่อ "${empLoDetail.name}" ได้ถูกยกเลิกแล้ว`);
    }
    const locationDoc = await company.doc(data.passcode)
    .collection('locations').doc(data.locationId)
    .update({
      employees: data.employees
    });
    return res.send(response(
      true,
      `Success update employe of location: ${data.locationId}. new employee: [${newEmp}]. removed employee: [${delEmp}].`,
      {ref:{
        location:locationDoc, 
        employee: {
          del: delEmpRef, 
          new: newEmpRef
        }
      }}
    ));
  } catch (error) {
    return res.send(errorHandle(error, "Can't update employees that use this location."));
  }
}

module.exports = {
  Get,
  Add,
  Edit,
  Delete,
  UpdateEmployee
}