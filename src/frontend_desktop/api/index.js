class API {}

// API.v1 = 'http://localhost:5001/penhwang-d350c/us-central1/app'
API.v1 = 'https://us-central1-penhwang-d350c.cloudfunctions.net/app'
// #sample of use look in company.js
// auth
API.testToken = `${API.v1}/testToken`
API.login = `${API.v1}/login`
// company
API.getCompany = `${API.v1}/getCompany`
API.companyAdd = `${API.v1}/companyAdd`
API.companyEdit = `${API.v1}/companyEdit`
API.companyDelete = `${API.v1}/companyDelete`
API.companyUpdateManager = `${API.v1}/companyUpdateManagers`
// employee
API.getEmployees = `${API.v1}/employeeGet`
API.getWorkHour = `${API.v1}/employeeWorkHour`
API.getAttendance = `${API.v1}/getAttendance`
API.employeeAdd = `${API.v1}/employeeAdd`
API.employeeEdit = `${API.v1}/employeeEdit`
API.employeeDelete = `${API.v1}/employeeDelete`
API.getEmployeeAttendance = `${API.v1}/employeeAttendance`
API.getEmployeeWorkHour = `${API.v1}/employeeWorkHour`
API.employeeUpdateSlot = `${API.v1}/employeeUpdateSlot`;
API.getLeaveRight = (employeeId) => `${API.v1}/leaveGetRight/${employeeId}`;
API.jobApplicationManage = (recipient, jobAppId, isConfirmed) => `${API.v1}/jobApplicationManage/${recipient}/${jobAppId}/${isConfirmed}`;
// role
API.roles = `${API.v1}/roleGet`
API.roleAdd = `${API.v1}/roleAdd`
API.roleEdit = `${API.v1}/roleEdit`
API.roleDelete = `${API.v1}/roleDelete`
API.roleGetSlot = `${API.v1}/roleGetSlot`
API.roleUpdateSlot = `${API.v1}/roleUpdateSlot`
API.roleGetEmployees = `${API.v1}/roleGetEmployees`
API.roleUpdateEmployees = `${API.v1}/roleUpdateEmployees`
API.roleGetManagers = `${API.v1}/roleGetManagers`
API.roleUpdateManagers = `${API.v1}/roleUpdateManagers`
// slot
API.slots = `${API.v1}/slotGet`
API.slotAdd = `${API.v1}/slotAdd`
API.slotEdit = `${API.v1}/slotEdit`
API.slotDelete = `${API.v1}/slotDelete`
API.slotGetEmployees = `${API.v1}/slotGetEmployees`
API.slotUpdateEmployees = `${API.v1}/slotUpdateEmployees`
API.changeSlotGet = `${API.v1}/slotGetRequests`
API.changeSlotReq = `${API.v1}/changeSlotReq`
API.changeSlotManage = (empId,reqId,isConfirmed,reason) => `${API.v1}/changeSlotManage/${empId}/${reqId}/${isConfirmed}/${reason}`
// leave
API.leaves = `${API.v1}/leaveGet`
API.leaveAdd = `${API.v1}/leaveAdd`
API.leaveEdit = `${API.v1}/leaveEdit`
API.leaveDelete = `${API.v1}/leaveDelete`
API.leaveGet = `${API.v1}/leaveGetRequests`
API.leaveReq = `${API.v1}/leaveReq`
API.leaveManage = (empId,owner,reqId,leaveId,isConfirmed,reason) => `${API.v1}/leaveManage/${empId}/${owner}/${reqId}/${leaveId}/${isConfirmed}/${reason}`
API.leaveUpdateEmployees = `${API.v1}/leaveUpdateEmployees`
// location
API.locations = `${API.v1}/locationGet`
API.locationAdd = `${API.v1}/locationAdd`
API.locationEdit = `${API.v1}/locationEdit`
API.locationDelete = `${API.v1}/locationDelete`
API.locationUpdateEmployees = `${API.v1}/locationUpdateEmployees`
// request
API.getAllRequest = `${API.v1}/getAllRequest`

export default API
