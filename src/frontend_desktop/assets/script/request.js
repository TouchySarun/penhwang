
function managed(item, isConfirmed){
  var method = (isConfirmed)?'confirm':'reject';
  this.$store.dispatch(`request/${method}Request`, item);
}
function reqClass(t){
  if(t==='ลา'){
    return 'leave-req'
  }else if(t==='เปลี่ยนกะ'){
    return 'change-shift-req'
  }else if(t==='เข้าร่วมบริษัท'){
    return 'job-application-req'
  }
}
function reqIcon(t){
  if(t==='ลา'){
    return 'mdi-stethoscope'
  }else if(t==='เปลี่ยนกะ'){
    return 'mdi-calendar-clock'
  }else if(t==='เข้าร่วมบริษัท'){
    return 'mdi-account-plus'
  }
}
function reqColor(t){
  if(t==='ลา'){
    return 'warning'
  }else if(t==='เปลี่ยนกะ'){
    return 'accent'
  }else if(t==='เข้าร่วมบริษัท'){
    return 'error'
  }
}
function shiftZero(m){
  var res;
  (m >= 10) ? res=`${m}`: (m>0) ? res=`0${m}`: res="00";
  return res;
}
function formatDate(d){
  var date = new Date(d);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) +
  " " +
  this.shiftZero(date.getHours()) +
  ":" +
  this.shiftZero(date.getMinutes()) +
  " น.";
}
