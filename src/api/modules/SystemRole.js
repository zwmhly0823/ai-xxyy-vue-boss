import axios from '../axiosConfig'

export default {
  getRoleList(queryParams) {
    return axios.get('/api/b/boss/v1/role/list', queryParams)
  },
  addRole(params) {
    return axios.post('/api/b/boss/v1/role/add', params)
  },
  updateRole(params) {
    return axios.post('/api/b/boss/v1/role/update', params)
  },
  deleteRole(params) {
    return axios.post('/api/b/boss/v1/role/delete', params)
  },
}
