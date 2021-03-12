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
  createDepartment(params) {
    return axios.post('/api/b/boss/v1/department/addDepartment', params)
  },
  updateDepartment(params) {
    return axios.post('/api/b/boss/v1/department/updateDepartment', params)
  },
  getDepartmentTree(params) {
    return axios.get('/api/b/boss/v1/department/getDepartmentTree', params)
  },
  getdepartmentAllList(params) {
    return axios.get('/api/b/boss/v1/department/getPageDepartment', params)
  },
  // 添加/编辑员工
  addStaff(params) {
    return axios.post('/api/b/boss/v1/staff/add', params)
  },
  updateStaff(params) {
    return axios.post('/api/b/boss/v1/staff/update', params)
  },
  // 获取员工列表
  getStaffList(params) {
    return axios.post('/api/b/boss/v1/staff/getPage', params)
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
