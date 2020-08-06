/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-23 14:20:28
 * @LastEditors: liukun
 * @LastEditTime: 2020-07-09 21:58:24
 */

//  环境判断及获取操作人ID
export function getStaffInfo() {
  const isDev = process && process.env.NODE_ENV === 'development'
  const isTestBoss = location.href.includes('boss')
  const isTestToss = location.href.includes('toss')

  let staff = {}
  const teacherInfo = localStorage.getItem('teacher')
  const staffInfo = localStorage.getItem('staff')

  if (isDev) {
    if (teacherInfo) staff = getTeacher(teacherInfo)
    if (staffInfo) staff = getStaff(staffInfo)
    return staff
  } else {
    if (isTestToss) {
      if (!teacherInfo) return {}
      staff = getTeacher(teacherInfo)
    }
    if (isTestBoss) {
      if (!staffInfo) return {}
      staff = getStaff(staffInfo)
    }
    return staff
  }
}

function getTeacher(teacherInfo) {
  const teacher = JSON.parse(teacherInfo)
  return Object.assign(
    {},
    {
      staffId: teacher.id,
      staffName: teacher.realName,
      isStaffId: false
    }
  )
}
function getStaff(staffInfo) {
  const staff = JSON.parse(staffInfo)
  return Object.assign(
    {},
    {
      staffId: staff.id,
      staffName: staff.realName,
      staffMobile: staff.mobile,
      isStaffId:
        staff.positionId === '1' ||
        staff.positionId === '2' ||
        staff.positionId === '3'
    }
  )
}
