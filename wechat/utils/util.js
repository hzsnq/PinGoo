const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const cityName = (province, district, city) => {
  if (district.indexOf('区') != -1 && city.length == 0) {
    return province
  } else if (district.indexOf('县') != -1) {
    return district
  } else if (district.indexOf('区') != -1 && city.length != 0) {
    return city
  }
}

module.exports = {
  formatTime: formatTime,
  cityName: cityName
}
