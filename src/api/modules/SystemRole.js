import axios from '../axiosConfig'

export default {
  getRoleList(queryParams) {
    return axios.get('/api/b/boss/v1/role/list', queryParams)
  },
  getMenuTree(queryParams) {
    return axios.get('/api/b/boss/v1/menu/getMenuTree')
  },
  getMenuInfo(queryParams) {
    return axios.get(`/api/b/boss/v1/menu/info?menuId=${queryParams}`)
  },
  add(params) {
    return axios.post(`/api/b/boss/v1/menu/add`, params)
  },
  edit(params) {
    return axios.post(`/api/b/boss/v1/menu/update`, params)
  },
  del(params) {
    return axios.post(`/api/b/boss/v1/menu/delete`, params, {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
