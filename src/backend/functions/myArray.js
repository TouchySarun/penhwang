/**
 * return a1 that remove a2
 * @param {*} a1 ตั้งต้น
 * @param {*} a2 ตัวลบ
 */
const arrayRemove = (a1, a2) =>{
  const out = (arr) => {
    return !a2.includes(arr)
  }
  return a1.filter(out)
}

module.exports = {
  arrayRemove
}