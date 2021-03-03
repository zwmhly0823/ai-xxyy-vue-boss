/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-13 12:10:04
 * @Last Modified by: songyanan
 * @Last Modified time: 2020-06-09 15:51:46
 * @Description: 全局公共方法，添加或改动及时全员通知。 注释一定要写详细！
 */

import { Message } from 'element-ui'
import dayjs from 'dayjs'
import store from '@/store'
import { subjects, subjectsList } from '@/config/subjects'
// import { of } from 'core-js/fn/array'https://s1.meixiu.mobi/Pc/fileUpload/1603790950384.jpeg

export const defaultHead =
  'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png'

/**
 * 是否 toss。 是toss返回 teacher_id,否则返回 null
 * 测试环境同一域名，除localstorage外，根据pathname区别
 * https://test.meixiu.mobi/ai-app-vue-toss-test/ 测试环境
 */
export function isToss() {
  let teacherId = null
  const isTestBoss = location.pathname.includes('boss-test')
  const teacher = localStorage.getItem('teacher')
  if (teacher) {
    teacherId = JSON.parse(teacher).id
  }
  if (isTestBoss) return null
  return teacherId
}

/**
 * 字符串 小驼峰转连接线
 * @param {string} str
 */
export function camel2Line(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 格式化时间戳
 * @str: 时间戳 @type: String 'd'：天 'm':分 's': 秒
 */
export function formatData(str, type = 'd') {
  if (!str || +str === 0) return ''
  let ft = 'YYYY-MM-DD'
  if (type !== 'd') {
    if (type === 'shortDay') {
      // 06-18 15:00
      ft = 'MM-DD HH:mm'
    } else {
      ft = type === 'm' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss'
    }
  }
  return dayjs.unix(Number(str) / 1000).format(ft)
}
// 时间戳转年月日
export function timestamp(stamp, type) {
  // type = 1: 月-日 时-分   type = 2: 年-月-日 时-分-秒 type = 3: 20 08 type=4 : 2019年12月12日
  const now = new Date(Number(stamp))
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const second = now.getSeconds()

  const _mouth = month > 9 ? month : '0' + month
  const _day = day > 9 ? day : '0' + day
  const _hour = hour > 9 ? hour : '0' + hour
  const _minute = minute > 9 ? minute : '0' + minute
  if (type === 1) {
    return _mouth + '-' + _day + ' ' + _hour + ':' + _minute
  } else if (type === 2) {
    const months = month <= 9 ? '0' + month : month
    const days = day <= 9 ? '0' + day : day
    const hours = hour <= 9 ? '0' + hour : hour
    const minutes = minute <= 9 ? '0' + minute : minute
    const seconds = second <= 9 ? '0' + second : second
    return (
      year +
      '-' +
      months +
      '-' +
      days +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
  } else if (type === 3) {
    return _mouth + '.' + _day
  } else if (type === 4) {
    return year + '年' + _mouth + '月' + _day + '日'
  } else if (type === 5) {
    return year + '-' + _mouth + '-' + _day
  } else if (type === 6) {
    const months = month <= 9 ? '0' + month : month
    const days = day <= 9 ? '0' + day : day
    const hours = hour <= 9 ? '0' + hour : hour
    const minutes = minute <= 9 ? '0' + minute : minute
    return months + '-' + days + ' ' + hours + ':' + minutes
  } else if (type === 7) {
    const months = month <= 9 ? '0' + month : month
    const days = day <= 9 ? '0' + day : day
    return months + '-' + days
  } else if (type === 8) {
    return year + '-' + _mouth + '-' + _day + ' ' + _hour + ':' + _minute
  }
}

/**
 * 数组对象单一属性排序
 * @arr 源数组
 * @field 排序字段名
 */
function compare(prop) {
  return function cpare(obj1, obj2) {
    let val1 = obj1[prop]
    let val2 = obj2[prop]
    val1 = Number(val1) ? Number(val1) : obj1[prop]
    val2 = Number(val2) ? Number(val2) : obj2[prop]
    if (val1 < val2) {
      return -1
    }
    if (val1 > val2) {
      return 1
    }
    return 0
  }
}
export function sortArrObject(arr, field) {
  return arr.sort(compare(field))
}

export function baseUrl() {
  let myBaseUrl = ''
  const pathname = location.pathname
  const environment = ['dev', 'test']

  const enFlag = environment.some((item, index) => {
    return pathname.includes(item)
  })
  const pathArr = pathname.split('/')
  if (enFlag) {
    myBaseUrl = `/${pathArr[1]}/`
  } else {
    myBaseUrl = '/'
  }

  return myBaseUrl
}

/**
 * 转化跨年体验课或系统课时间戳
 * @param(开课时间，结课时间)
 * return [开课时间，结课时间] 如果跨年返回YYMMDD 否则MMDD
 */

export function startToEndTime(startTime, endTime) {
  const formatS = dayjs.unix(Number(startTime) / 1000).format('YYMMDD')
  const formatE = dayjs.unix(Number(endTime) / 1000).format('YYMMDD')
  if (formatS.slice(0, 2) === formatE.slice(0, 2)) {
    return [
      dayjs.unix(Number(startTime) / 1000).format('MMDD'),
      dayjs.unix(Number(endTime) / 1000).format('MMDD')
    ]
  }
  return [formatS, formatE]
}

/**
 * 通过班级的当前课程计算当前开课周数及节次
 **/
export function GetAgeByBrithday(birth) {
  if (!birth || +birth === 0) {
    return '-'
  }
  var age = 0
  var month = 0
  var today = new Date()
  var todayYear = today.getFullYear()
  var todayMonth = today.getMonth() + 1

  const birthday = new Date(Number(birth) * 1000)
  const birthdayYear = birthday.getFullYear()
  const birthdayMonth = birthday.getMonth() + 1

  if (today.getTime() < birthday.getTime()) {
    console.log('无法计算')
    return '-'
  } else {
    age = todayYear - birthdayYear

    if (todayMonth <= birthdayMonth) {
      month = todayMonth - birthdayMonth + 12
      age--
    } else {
      month = todayMonth - birthdayMonth
    }
    return age + '岁' + month + '个月'
  }
}

/**
 * 本地存储
 * @param string { 自定义名称 } name
 * @param Object { 要存入的对象 } data
 * @param number { 0--存入 1--读取 2--删除 } type
 * @param 不加"" { sessionStorage /localStorage } target
 */
export function accessStorageData({
  name,
  data = {},
  type = 0,
  target = sessionStorage
}) {
  let res = {}
  switch (type) {
    case 0:
      target.setItem(name, JSON.stringify(data))
      console.log(`存储成功，已将${name}存入${target}`)
      break
    case 1:
      res = JSON.parse(target.getItem(name))
      if (res) {
        console.log(`读出成功，已将${name}从${target}读出`)
        return res
      } else {
        console.log(`${target}中未读取到${name}`)
        return null
      }
    case 2:
      res = JSON.parse(target.getItem(name))
      if (res) {
        target.removeItem(name)
        console.log(`删除成功，已将${name}从${target}删除`)
      } else {
        console.log(`${target}中未读取到${name} 删除失败`)
      }

      break
    default:
      break
  }
}
/**
 * js 深度克隆
 */
export function deepClone(obj) {
  const isObject = (obj) =>
    obj && (typeof obj === 'object' || typeof obj === 'function')
  if (!isObject) throw new Error('Not Reference Types')
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj }
  Reflect.ownKeys(newObj).map((key) => {
    newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
  })
  return newObj
}
/**
 * @description 如果图片路径为空,返回默认图片; 如果图片是阿里云图片,则添加限制
 * @return {sharpen || Number} 表示进行锐化处理。取值为锐化参数，参数越大，越清晰。
 * @return { DEFAUTL_URL } DEFAUTL_URL: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png?', // 默认的图片路径
 * @example ?x-oss-process=image/sharpen,100
 */
export function compressImg(imgPath, width) {
  const DEFAUTL_URL = 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png?'

  const _ossQuery = `x-oss-process=image/resize,m_lfit,w_${width}/sharpen,100`
  const _imgHost = imgPath.split('/')[2] /** 取：‘http://s1.meixiu.mobi/’ */
  const _allowPath = ['s1.meixiu.mobi']
  if (!imgPath) {
    imgPath = DEFAUTL_URL + _ossQuery
  } else if (imgPath && _allowPath.includes(_imgHost)) {
    return imgPath + '?' + _ossQuery
  }
  return imgPath
}
/**
 * url 转为 key-val形式
 */
export function url2KeyVal() {
  const search = window.location.search
  const arrObj = []

  if (search.indexOf('?') !== -1) {
    const params = search.substr(1).split('&')
    params.forEach((item) => {
      const obj = {}
      const pos = item.indexOf('=')
      if (pos !== -1) {
        const first = item.substr(0, pos)
        const last = item.substr(pos + 1)
        obj[first] = last
        arrObj.push(obj)
      }
    })
  }
  return arrObj
}

/**
 * 打开一个新页签 v1.0  - 弃用！！
 * @path: 要跳转的路由，包含模块名和router path.如 '/student-team/#/trialTeam'
 */
export function openNewTab(path, title) {
  if (!path || !title) {
    Message.error('请填写跳转路径或标题')
    return
  }
  const pathname = location.pathname
  let baseUrl = ''
  if (pathname.includes('test')) {
    const pathArr = pathname.split('/')
    baseUrl = '/' + [pathArr[1]].join('/')
  }
  const pathUrl = `${baseUrl}${path}`
  // 已打开的页签
  location.href = pathUrl
  const multiTabbed = JSON.parse(sessionStorage.getItem('multiTabbed')) || {}
  const meta = { title }

  if (!Object.keys(multiTabbed).includes(pathUrl)) {
    Object.assign(multiTabbed, { [`${pathUrl}`]: { meta } })
    sessionStorage.setItem('multiTabbed', JSON.stringify(multiTabbed))
    store.dispatch('tabbed/setTabbedList', multiTabbed)
  }
  sessionStorage.setItem('currentMultiTab', pathUrl)
  store.dispatch('tabbed/setCurrentTabbed', pathUrl)
}

/**
 * 浏览器新标签打开页面
 * @path: 要跳转的路由，包含模块名和router path.如 '/student-team/#/trialTeam'
 */
export function openBrowserTab(path, out = false) {
  if (!path) {
    Message.error('请填写跳转路径')
    return
  }
  const { pathname, origin } = location
  // 如果是外链接, 直接打开
  if (out === true) {
    window.open(path, '_blank')
    return
  }
  let baseUrl = ''
  if (pathname.includes('test') || pathname.includes('dev')) {
    const pathArr = pathname.split('/')
    baseUrl = '/' + [pathArr[1]].join('/')
  }
  const pathUrl = `${origin}${baseUrl}${path}`
  console.log(pathUrl, 'pathUrl')

  window.open(pathUrl, '_blank')
}

/**
 * 获取变量数据类型
 * Array,String,Object, Null, Undefined
 */
export function getDataType(v) {
  const type = Object.prototype.toString.call(v)
  const res = (type && type.substring(8, type.length - 1)) || ''
  return res
}

/**
 * 获取当前科目类型 返回 枚举值
 * ART_APP // 美术
  WRITE_APP // 写字
  COLLEGE_APP // AI学院
 * 
 @upper: Boolean 是否大小写
 */
export function getAppSubject(upper = true) {
  const { pathname } = location
  const env = ['dev', 'test']
  const envFlag = env.some((item) => pathname.includes(item))
  // 测试或开发环境
  const key = envFlag ? pathname.split('/')[2] : pathname.split('/')[1]
  const subject = Object.keys(subjects).includes(key) ? key : 'music_app'
  return upper ? subject.toUpperCase() : subject
}

// 获取科目cdoe: '0','1','2' (0-ART_APP, 1-WRITE_APP, 2-COLLEGE_APP)
export function getAppSubjectCode() {
  const key = getAppSubject(false)
  // return Object.keys(subjects).findIndex((item) => item === key) + ''
  let subjectCode = 3
  subjectsList.map((item, index) => {
    if (item.key === key) {
      subjectCode = item.index
    }
  })
  return subjectCode
}
// 注入 课程类型 subject 参数接受 对象和序列化的字符串
export function injectSubject(query) {
  if (!query) return
  const queryStr = typeof query === 'string' ? query : JSON.stringify(query)
  if (queryStr.includes('must')) {
    const queryObj = JSON.parse(queryStr)
    queryObj.bool.must.push({ term: { subject: getAppSubjectCode() } })
    return JSON.stringify(queryObj)
  } else {
    const queryObj = JSON.parse(queryStr)
    queryObj.subject = getAppSubjectCode()
    return JSON.stringify(queryObj)
  }
}

/**
 * 复制文字、手机号
 */
export function copyText(text, msg = '复制内容不存在，请确认') {
  if (!text) {
    Message.error('复制内容不存在，请确认')
    return
  }
  const url = text
  const oInput = document.createElement('input')
  oInput.value = url
  document.body.appendChild(oInput)
  oInput.select()
  document.execCommand('Copy')
  Message({
    message: '复制成功',
    type: 'success'
  })
  oInput.remove()
}
/**
 * 返回倒计时时间
 */
export function MillisecondToDate(msd) {
  const flag = msd > 0 ? 1 : 0
  var time = Math.abs(parseFloat(msd) / 1000)

  if (time > 60 && time < 60 * 60) {
    time =
      getZero(parseInt(time / 60.0)) +
      ':' +
      getZero(parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60))
  } else if (time >= 60 * 60) {
    time =
      getZero(parseInt(time / 3600.0)) +
      ':' +
      getZero(
        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)
      ) +
      ':' +
      getZero(
        parseInt(
          (parseFloat(
            (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
          ) -
            parseInt(
              (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
            )) *
            60
        )
      )
  } else {
    time = getZero(parseInt(time))
  }
  if (flag) {
    return time
  } else {
    return `-${time}`
  }
}
// 补零
export function getZero(num) {
  // 单数前面加0
  if (parseInt(num) < 10) {
    num = '0' + num
  }
  return num
}
export async function calcBrowerClienHeight(_this, ref, minus = 0) {
  await _this.$nextTick()
  // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
  const DomTop = _this.$refs[ref].getBoundingClientRect().y
  //  document.body.clientHeight 返回body元素内容的高度
  return document.body.clientHeight - DomTop - minus + 'px'
}