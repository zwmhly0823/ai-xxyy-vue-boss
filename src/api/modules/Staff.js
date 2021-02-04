/**
 * @Descripttion: BOSS - 社群销售
 * @Author: songyanan
 * @Date: 2020-06-17 15:31:26
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-17 17:10:30
 */
import axios from '../axiosConfig'

export default {
  // 获取角色
  getRoleList(query = '') {
    return axios.post('/graphql/v1/toss', {
      query: `{
        RoleList(query: ${JSON.stringify(query)}){
          id
          name
        }
      }`
    })
  },
  // 添加/编辑员工
  addStaff(params) {
    return axios.post('/api/b/v1/staff/addStaff', params)
  },
  // 获取员工列表
  getStaffList(page = 1, query = '', size = '20') {
    const sort = JSON.stringify({ id: 'desc' })
    return axios.post('/graphql/v1/toss', {
      query: `{
        StaffPage(page: ${page}, query: ${JSON.stringify(
        query
      )}, sort: ${JSON.stringify(sort)}, size: ${size}){
          totalPages
          totalElements
          content {
            id
            real_name
            user_name
            mobile
            status
            role_id
            is_login,
            password
          }
        }
      }`
    })
  },
  //  员工id，姓名模糊搜索
  StaffListEx(name, params) {
    const quer = `{ "bool": { "must": [{ "wildcard": { "${name}": "*${params}*" } }] } }`
    return axios.post('/graphql/v1/toss', {
      query: `
      {
        StaffListEx(query:${JSON.stringify(quer)})
        {
          id
          real_name
        }
      }
      `
    })
  }
}
