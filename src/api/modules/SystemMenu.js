/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-21 11:58:33
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-05-07 19:07:22
 * @Description: 班级
 */
// import axios from '../axios'
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
    return axios.post(`/api/b/boss/v1/menu/delete`, params,{
        headers: { 'Content-Type': 'application/json' }
      })
  }
}
