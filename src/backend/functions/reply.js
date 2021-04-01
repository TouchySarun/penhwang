const line = require('./line')
const myurl = require('./url');
const db = require('./db');
const alertTo = require('./aleartTo');
const response = require('./returnFrom');
const errorHandle = require('./errorHandle')
const errormessage = require('./errormessage');


const SettingReply = async (req, res) => {
  const replyToken = req.body.replyToken;
  const employeeId = req.body.userId;
  const message = [{
    "type":"template",
    "altText":"ตั้งค่า",
    "template":{
      "type":"carousel",
      "columns":[
        {
          "thumbnailImageUrl":"https://sv1.picz.in.th/images/2021/03/11/D3YJiP.png",
          "title":"ข้อมูลส่วนตัว",
          "text":"เลือกเพื่อขอดู ข้อมูลส่วนตัว เช่น สิทธิ์วันลา ประวัติคำขอ",
          "actions": [
            {
              "type":"uri",
              "label":"เลือก",
              "uri":`https://penhwangmobile.netlify.app/profile/${employeeId}`
            }
          ],
          "imageBackgroundColor":"#FFFFFF"
        },{
          "thumbnailImageUrl":"https://sv1.picz.in.th/images/2021/03/11/D3Y2Sb.png",
          "title":"ประวัติการลงเวลา",
          "text":"เลือกเพื่อขอดู หลักฐานการลงเวลา เช่น เข้างาน ออกงาน เมื่อไร",
          "actions":[
            {
              "type":"uri",
              "label":"เลือก",
              "uri":`https://penhwangmobile.netlify.app/timeline/${employeeId}`
            }
          ],
          "imageBackgroundColor":"#FFFFFF"
        },{
          "thumbnailImageUrl":"https://sv1.picz.in.th/images/2021/03/11/D3YCif.png",
          "title":"เข้าสู่ระบบ",
          "text":"ขอรหัสผ่านเพื่อเข้าสู่เว็บแอปพลิเคชั่น(สำหรับฝ่ายบุคคลเท่านั้น)",
          "actions":[
            {
              "type":"uri",
              "label":"เลือก",
              "uri":`${myurl.frontendMobile}/loginReq/${employeeId}`
            }
          ],
          "imageBackgroundColor":"#FFFFFF"
        }
      ]
    }
  }]
  // line.Reply(replyToken, message);
  // I don't use reply bc many times I have bug with replyToken
  line.Post(employeeId, message);
  res.send('reply success');
}
const SlotReply = async (req, res) => {
  // this function has been use in many place in many input's pattern
  // TODO make them same pattern 
  const employee1 = req.params.employeeId;
  const employee2 = req.body.userId;
  const replyToken = req.body.replyToken;
  const employeeId = employee1||employee2;
  try {
    const emp = await db.collection('employee').doc(employeeId).get();
    let slot = new Array(7).fill({});
    if(emp.data().slot){
      slot = emp.data().slot.time||[];
    }
    const message = line.slotMessage(slot);
    if(replyToken){
      line.Reply(replyToken, message);
    }else{
      line.Post(employeeId, message);
    }
    return res.send(response(
      true, 
      "Success get slot",
      { slot }
    ))
  } catch (error) {
    return res.send(errorHandle(error), "Can't get employee's slot.")
  }
}
const ChangeSlotReply = async (req, res) => {
  const replyToken = req.body.replyToken;
  const employeeId = req.body.userId;
  const message = line.ButtonMessage({
    title: "เปลี่ยนกะ",
    text: "เลือกเพื่อเข้าสู่เว็บจัดการกะ",
    alt:"เปลี่ยนกะ",
    img: "https://sv1.picz.in.th/images/2021/03/16/DgnjzW.png",
    action: [
      {
        "type": "uri",
        "label": "คลิ๊กเพื่อเปลี่ยนกะ",
        "uri": `${myurl.frontendMobile}/changeSlot/${employeeId}`
      },
    ]
  })
  // line.Reply(replyToken, message);
  line.Post(employeeId, message);
  res.send('reply success');
}
const RequestReply = async (req, res) => {
  const replyToken = req.body.replyToken;
  const employeeId = req.body.userId;
  message = line.ButtonMessage({
    title: "ขอลา",
    text: "เลือกเพื่อสร้างฟอร์มขอลา",
    alt:"ขอลา",
    img: "https://www.img.in.th/images/5dfbbff4a010135e3f6ff5a84fc99499.png?fbclid=IwAR0hDONZV89-e2Ij3hRHc5Gy-m7wgz0R2yi6k2emkwn0k9dYKTvZ9_oOADs",
    action: [
      {
        "type": "uri",
        "label": "ไปกัน",
        "uri": `${myurl.frontendMobile}/leave/${employeeId}`
      },
    ]
  })
  // line.Reply(replyToken, message);
  line.Post(employeeId, message);
  res.send('reply success');
}
const newEmpReply = async (req, res) => {
  const replyToken = req.body.replyToken;
  const employeeId = req.body.userId;
  const message = line.ButtonMessage({
    title: "สมัครพนักงาน",
    text: "เข้าร่วมบริษัท",
    alt: "สมัครพนักงาน",
    img: "https://sv1.picz.in.th/images/2021/03/11/D3Yywl.png",
    action: [
      {
        "type": "uri",
        "label": "ไปกัน",
        "uri": `${myurl.frontendMobile}/startform/${employeeId}`
      }
    ]
  })
  // line.Reply(replyToken, message);
  line.Post(employeeId, message);
  res.send('reply success');
}
module.exports = {
  SettingReply,
  SlotReply,
  ChangeSlotReply,
  RequestReply,
  newEmpReply,
}
