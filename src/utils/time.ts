// 封装一个函数，获取一个时间描述的结果：当前早上|上午|下午|晚上
export const getTime = () => {
  let message = '';
  // 通过内置构造函数Date
  let hours = new Date().getHours();
  if (hours <= 5) {
    message = '凌晨'
  }
  else if (hours > 5 && hours <= 9) {
    message = '早上'
  } else if (hours > 9 && hours <= 12) {
    message = '上午'
  } else if (hours > 12 && hours <= 18) {
    message = '下午'
  } else if (hours > 18 && hours <= 24) {
    message = '晚上'
  }
  return message;
}