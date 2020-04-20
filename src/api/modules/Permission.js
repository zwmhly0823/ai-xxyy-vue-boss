/**
 * 权限管理 接口， api/t/v1/teacher/role/getAllTeacher/byRole?teacherId=6
 * 返回的是teacher数组对象，包括传过来的id用户。 如果返回空数组，说明是最低级，只看自己就可以了
 */

import axios from '../axiosConfig'

export default {
  // 获取当前登录老师的权限，下属全部老师
  // @teacher_id: 当前老师ID， @onlyId: bool，为true只返回所有老师的id
  async getAllTeacherByRole({ teacherId = '', onlyId = true } = {}) {
    if (teacherId) {
      const res = await axios.get(
        '/api/t/v1/teacher/role/getAllTeacher/byRole',
        {
          teacherId
        }
      )
      if (res && res.payload && res.payload.length > 0) {
        return onlyId ? res.payload.map((t) => t.id) : res.payload
      }
      return [teacherId]
    }
    return []
  }
}
