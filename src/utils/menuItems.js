/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2019-12-26 17:13:38
 * @Last Modified by: chengweihua
 * @Last Modified time: 2020-03-23 13:19:47
 * @Description: (顶部)模块导航 map - 显示对应名称
 * 如果 `src/pages/`下的模板名称是 小骆峰 ，link改为 中线 - 连接
 * TODO: 动态设置
 */

const menuItems = [
  {
    link: 'user',
    text: '用户',
    isShow: true
  },
  {
    link: 'order',
    text: '订单',
    isShow: true
  },
  {
    link: 'student-team',
    text: '班级',
    isShow: true
  },
  {
    link: 'operation',
    text: '运营',
    isShow: false
  },
  {
    link: 'teacher',
    text: '老师',
    isShow: true
  },
  {
    link: 'product',
    text: '商品',
    isShow: false
  },
  {
    link: 'system',
    text: '系统',
    isShow: false
  },
  {
    link: 'dashboard',
    text: 'Dashboard',
    isShow: false
  },
  {
    link: 'login',
    text: '登录',
    isShow: false
  }
]

// 获取菜单名称 @link: 模块链接或名称
function getMenuText(link) {
  if (!link) return ''
  const menu = menuItems.filter((item) => item.link === link)
  return menu[0] ? menu[0].text : ''
}

/**
 * 通过班级的当前课程计算当前开课周数及节次
 **/
function GetAgeByBrithday(birth) {
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
module.exports = { getMenuText, menuItems, GetAgeByBrithday }
