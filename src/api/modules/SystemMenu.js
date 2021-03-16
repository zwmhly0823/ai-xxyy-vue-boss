import axios from '../axiosConfig'

export default {
  getMenuList(queryParams) {
    return axios.get('/api/b/boss/v1/menu/list')
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
    return axios.post(`/api/b/boss/v1/menu/delete`, params)
  }
}
