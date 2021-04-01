class API { }

// API.v1 = 'http://localhost:5001/penhwang-d350c/us-central1/app'
API.v1 = 'https://us-central1-penhwang-d350c.cloudfunctions.net/app'

// #sample of use look in company.js

// company
API.getCompany = `${API.v1}/getCompany`
API.setManager = `${API.v1}/setManager`
API.companyAdd = `${API.v1}/companyAdd`
API.companyEdit = `${API.v1}/companyEdit`
API.companyDelete = `${API.v1}/companyDelete`
// employee
API.getEmployees = `${API.v1}/getEmployees`
API.getWorkHour = `${API.v1}/employeeWorkHour`
API.getAttendance = `${API.v1}/getAttendance`
API.employeeAdd = `${API.v1}/employeeAdd`
API.employeeEdit = `${API.v1}/employeeEdit`
API.employeeDelete = `${API.v1}/employeeDelete`
API.employeeUpdateSlot = `${API.v1}/employeeUpdateSlot`
API.confirmJobApplication = `${API.v1}/confirmJobApplication`
API.getProfile = `${API.v1}/getProfile`
API.slotGetUsable = (empId) => `${API.v1}/slotGetUsable/${empId}`
API.loginReq = (empId) => `${API.v1}/loginReq/${empId}`
// role
API.roles = `${API.v1}/getRoles`
API.roleAdd = `${API.v1}/roleAdd`
API.roleEdit = `${API.v1}/roleEdit`
API.roleDelete = `${API.v1}/roleDelete`
API.roleGetSlot = `${API.v1}/roleGetSlot`
API.roleUpdateSlot = `${API.v1}/roleUpdateSlot`
API.roleGetEmployees = `${API.v1}/roleGetEmployees`
API.roleUpdateEmployees = `${API.v1}/roleUpdateEmployees`
// slot
API.changeSlotReq = `${API.v1}/changeSlotReq`
API.slots = `${API.v1}/getSlots`
API.slotAdd = `${API.v1}/slotAdd`
API.slotEdit = `${API.v1}/slotEdit`
API.slotDelete = `${API.v1}/slotDelete`
API.slotGetTime = `${API.v1}/slotGetTime`
API.slotUpdateTime = `${API.v1}/slotUpdateTime`
API.slotGetEmployees = `${API.v1}/slotGetEmployees`
API.slotUpdateEmployees = `${API.v1}/slotUpdateEmployees`
// leave
API.getLeaveRight = (employeeId) => `${API.v1}/leaveGetRight/${employeeId}`
API.leaves = `${API.v1}/getLeaves`
API.leaveAdd = `${API.v1}/leaveAdd`
API.leaveEdit = `${API.v1}/leaveEdit`
API.leaveDelete = `${API.v1}/leaveDelete`
API.leaveGet = `${API.v1}/leaveGet`
API.leaveReq = `${API.v1}/leaveReq`
API.leaveManage = `${API.v1}/leaveManage`
API.leaveUpdateEmployees = `${API.v1}/leaveUpdateEmployees`
// location
API.locations = `${API.v1}/getLocations`
API.locationAdd = `${API.v1}/locationAdd`
API.locationEdit = `${API.v1}/locationEdit`
API.locationDelete = `${API.v1}/locationDelete`
API.locationUpdateEmployees = `${API.v1}/locationUpdateEmployees`
// clock
API.clockReq = `${API.v1}/clockReq`
API.clockIn = `${API.v1}/clockIn`
API.clockOut = `${API.v1}/clockOut`
export default API
