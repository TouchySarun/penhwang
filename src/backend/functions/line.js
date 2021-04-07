const request = require('request-promise');
const mobileLink = 'https://penhwangmobile.netlify.app';

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `**********`
};

const Post = (userId, message) => {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/push`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      to: userId,
      messages: message
    })
  })
}

const Reply = (replyToken, message) => {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: replyToken,
      messages: message
    })
  })
}
/**
 * generate button message
 * @param {*} data img, title, text, action
 */
const ButtonMessage = ({img, title, text, action}) => {
  // "https://www.img.in.th/images/216d038282785fee4f7db523bd5943bf.jpg"\
  return [{
    "type": "template",
    "altText": title,
    "template": {
      "type": "buttons",
      "thumbnailImageUrl": img,
      "imageAspectRatio": "rectangle",
      "imageSize": "cover",
      "imageBackgroundColor": "#FFFFFF",
      "title": title,
      "text": text,
      "defaultAction": action[0],
      "actions": action
    }
  }]
}
const slotMessage = (slot) => {
  let contents = [
    {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {"text": "เข้างาน", "size": "xl", "align": "start","type": "text", "weight": "bold", "color": "#000000"},
        {"text": "ออกงาน", "size": "xl", "align": "end", "type": "text", "weight": "bold", "color": "#000000"}
      ]
    }
  ];
  const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
  const daysColor = ['#FF453A','#FFCC00','#FF6482','#30D158','#FF9F0A','#0A84FF','#BF5AF2']
  for(let i=0; i<7; i++){
    contents.push(
      {
        "text": days[i],
        "type": "text",
        "color": daysColor[i],
        "align": "start",
        "margin": "lg"
      }
    )
    contents.push(
      {
        "layout": "baseline",
        "type": "box",
        "contents": [
          {
            "text": (slot[i].in && slot[i].in !== "") ? slot[i].in:"-----",
            "type": "text",
            "color": "#000000",
            "align": "start"
          },
          {
            "text": (slot[i].out && slot[i].out !== "") ? slot[i].out:"-----",
            "type": "text",
            "color": "#000000",
            "align": "end"
          }
        ]
      }
    )
    contents.push(
      {
        "type": "separator",
        "color": "#C3C3C3"
      }
    )
  }
  return [{
    "type": "flex",
    "altText": "นี้คือตารางทำงานของคุณ.",
    "contents": {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": contents
      },
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "นี่คือตารางทำงานของคุณ",
            "size": "lg",
            "color": "#000000",
            "align": "start",
            "weight": "bold",
          }
        ]
      }
    }
  }]
}

const confirmMessage = ({title, text, alt, img, confirmUrl, rejectUrl }) => {
  return [{
    "type": "template",
    "altText": alt,
    "template": {
      "type": "buttons",
      "thumbnailImageUrl": img,
      "title": title,
      "text": text,
      "actions": [
        {
          "type": "uri",
          "label": "ยืนยัน",
          "uri": confirmUrl
        },
        {
          "type": "uri",
          "label": "ยืนยัน",
          "uri": rejectUrl
        }
      ]
    }
  }]
}
const CarouselMessage = ({alt, columns }) => {
  let columnsMessage = [];
  columns.forEach(c => columnsMessage.push({
    "thumbnailImageUrl": c.img,
      "title": c.title,
      "text": c.text,
      "actions": [
        {
          "type": "uri",
          "label": "เลือก",
          "uri": c.url
        }
      ],
      "imageBackgroundColor": "#FFFFFF"
  }))
  return {
    "type": "template",
    "altText": alt,
    "template": {
      "type": "carousel",
      "columns": columnsMessage
    }
  }
}

module.exports = {
  Post, 
  Reply,
  ButtonMessage,
  slotMessage,
  confirmMessage,
  CarouselMessage,
  mobileLink
}
