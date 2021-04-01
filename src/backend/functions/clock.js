const db = require('./db')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const cors = require('cors')({origin: true})
const errormessage = require('./errormessage')
const response = require('./returnFrom')
const line = require('./line')
const errorHandle = require('./errorHandle')
const myurl = require('./url');
const company = db.collection('company')
const employee = db.collection('employee')

const lineMessageData = {
  clockInImg: "https://sv1.picz.in.th/images/2021/03/16/Dgn6Of.png",
  clockOutImg: "https://sv1.picz.in.th/images/2021/03/16/DgnV68.png",
}
/**
 * send clock message(button message): Check type of last attendence of this employee if 'in' send 'clock out' if 'out' send 'clock in' if not exists add attendence and send 'clock in'
 * @param {string} userId (employeeId/ lineId)  
 * @param {string} replyToken
 * @returns {string} message
 */
const Reply = async (req, res) => {
  const data = req.body;
  const employeeId = data.userId;
  const today = getToday();
  const todayStr = createDateStr(today.y,today.m,today.d)
  try {
    const clockInMessage = line.ButtonMessage({
      alt:"clock in",
      img: lineMessageData.clockInImg,
      title:"Clock In",
      text:"Click to Clock In.",
      action:[{
        "type": "uri", 
        "label": "เลือก", 
        "uri": `${myurl.frontendMobile}/clockIn/${employeeId}`}]
    })
    const clockOutMessage = line.ButtonMessage({
      alt:"clock out",
      img: lineMessageData.clockOutImg,
      title:"Clock Out",
      text:"Click to Clock Out.",
      action:[{
        "type": "uri", 
        "label": "เลือก", 
        "uri": `${myurl.frontendMobile}/clockOut/${employeeId}`}]
    })
    const doc = await employee.doc(employeeId)
    .collection('workHour').doc(todayStr)
    .get();
    if(!doc.exists){
      await employee.doc(employeeId)
      .collection('workHour').doc(todayStr).set({
        date: today.today,
        amount: 0,
        attendance: []
      })
      line.Reply(data.replyToken, clockInMessage)
      // line.Post(employeeId, clockInMessage)
      return res.send(response(true, `complete reply with clock in button`, {message: clockInMessage}))
    }else{
      const att = doc.data().attendance
      const lastAtt = att.sort((a, b) => b.time - a.time)[0] || {}// sort by time(<-)
      if(lastAtt.type !== '2'){
        line.Reply(data.replyToken, clockOutMessage)
        // line.Post(employeeId, clockInMessage)
        return res.send(response(true, `complete reply with clock out button`, {message: clockOutMessage}))
      } else {
        line.Reply(data.replyToken, clockInMessage)
        // line.Post(employeeId, clockOutMessage)
        return res.send(response(true, `complete reply with clock in button`, {message: clockInMessage}))
      }
    }
  } catch (error) {
    return res.send(errorHandle(error, `Can't clock`))
  }
}
/**
 * return {pass, spotName}: true if this employee can check in here
 * @param {string} employeeId
 * @param {location} location (lat, lng)
 * 
 */
const Req = async (req, res) => {
  const data = req.body
  const doc = await employee.doc(data.employeeId)
  .collection('locations')
  .get()
  let locations = []
  doc.forEach(
    lo => locations.push(lo.data())
  )
  const reducer = (acc, cur) => {
    if(checkLocation(cur, data.location)){
      return {pass: true, name: cur.name}
    }else{
      return {pass: acc.pass, name: acc.name}
    }
  }
  const result = locations.reduce(reducer, {pass:false, name:""})
  if(result.pass){
    return res.send(response(true, `You can check-in here(${result.name}).`, result))
  }else{
    return res.send(response(true, "Sorry, you can't check-in here.", result))
  }
}

const In = async (req, res) => {
  const data = req.body;
  const today = getToday();
  const todayStr = createDateStr(today.y,today.m,today.d);
  try{
    const employeeRef = await employee.doc(data.employeeId).get();
    const slot = employeeRef.data().slot;
    const slotToday = slot.time?slot.time[today.dow]:{};
    const i = slotToday.in?new Date(createDateStr(today.y, today.m, today.d, slotToday.in)): today.today;
    const errorTime = ((today.today - i) / 1000) / 60 // min
    const workRef = await employee.doc(data.employeeId)
    .collection('workHour').doc(todayStr)
    .set({
      date: today.today,
      attendance: admin.firestore.FieldValue.arrayUnion({
        time: today.today,
        location: data.location,
        errorTime,
        type: '1',
        isLate: (errorTime > slot.lateAfter)
      })
    }, {merge: true});
    // line.Post(data.employeeId, [{
    //   "type": "text",
    //   "text": `คุณได้เช็คชื่อที่ ${data.spotName}.`,
    // }])
    return res.send(response(
      true,
      `Employee ${data.employeeId} clock in at ${data.spotName}.`,
      workRef
    ))
  } catch (err){
    return res.send(errorHandle(err, "Can't clock in"))
  }
}


const Out = async (req, res) => {
  const data = req.body
  const today = getToday()
  const todayStr = createDateStr(today.y,today.m,today.d)
  const employeeRef = await employee.doc(data.employeeId).get()
  const slot = employeeRef.data().slot
  const slotToday = slot.time?slot.time[today.dow]:{};
  const o = slotToday.out?new Date(createDateStr(today.y, today.m, today.d, slotToday.out)): today.today;
  const errorTime = ((today.today - o) / 1000) / 60 // min
  const docRef = await employee.doc(data.employeeId)
  .collection('workHour').doc(todayStr).get()
  const att = docRef.data().attendance
  const lastIn = att.sort((a, b) => {
    if(a.type === b.type){
      return b.time - a.time;
    }else{
      return a.type - b.type;
    }
  })[0]// sort by type(->) then time(<-)
  const amount = ((today.today/1000 - lastIn.time.toDate()/1000))/60/60 // in hour
  const workRef = await employee.doc(data.employeeId)
  .collection('workHour').doc(todayStr)
  .update({
    amount: admin.firestore.FieldValue.increment(amount),
    attendance: admin.firestore.FieldValue.arrayUnion({
      time: today.today,
      location: data.location,
      errorTime,
      type: '2'
    })
  })
  return res.send(response(
    true,
    `Employee ${data.employeeId} clock out at ${data.spotName}.`,
    workRef
  ))
}

const checkLocation = (cur, location) => {
  const La = parseFloat(location.lat)
  const Long = parseFloat(location.lng)
  const curLa = parseFloat(cur.lat)
  const curLong = parseFloat(cur.lng)
  const error = measure(La, Long, curLa, curLong)
  return (error <= cur.error)
}
function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}
const getToday = () => {
  const today = new Date()
  const y = today.getFullYear().toString()
  const m = shiftZero((today.getMonth() + 1).toString(), 2)
  const d = shiftZero((today.getDate()).toString(), 2)
  const dow = today.getDay()
  return {
    y, m, d, dow, today
  }
}
const createDateStr = (y, m, d, t) =>{
  if(t){
    return y+'-'+m+'-'+d+'T'+t+"+07:00"
  }else{
    return y+'-'+m+'-'+d
  }
}
const shiftZero = (str, n) => {
  while(str.length < n){
    str = '0' + str
  }
  return str
}
module.exports = {
  Reply,
  Req,
  In,
  Out
}