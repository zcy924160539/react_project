/*
格式化时间的模块
*/

// 时间格式化函数
const formate = (time) => time = time < 10 ? '0' + time : time

// 向外暴露时间格式化函数
export default function formateDate(time) {
  if (!time) return ''
  const date = new Date(time)
  const year = date.getFullYear()
  const timeArr = [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
  const [month, day, hours, minutes, seconds] = timeArr.map(time => formate(time))
  // 返回一个格式为 YYYY-MM-DD hh-mm-ss 的时间字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}