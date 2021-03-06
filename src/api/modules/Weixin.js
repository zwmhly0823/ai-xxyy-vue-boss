/*
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-13 14:38:28
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-06 19:02:41
 */
// import axios from '../axios'
import axios from '../axiosConfig'
export default {
  // 微信管理列表（微信号）
  getWeChatTeacherPage(params, currentPage) {
    const obj = JSON.stringify(params)
    return axios.get(`/graphql/v1/boss`, {
      query: `{
        WeChatTeacherPage(query:${obj=='""'?obj:JSON.stringify(obj)},page: ${currentPage}) {
          totalElements
          totalPages
          number
          content {
            id
            wechat_no
            wechat_qr_code
            nickname
            teacher_id
            head_img_url
            wechat_id
            wechat_record_id
            wechat_status
          }
        }
      }`
    })
  },
  // 微信管理列表（关联老师，所在部门）
  getTeacherList(params) {
    const obj = JSON.stringify({ id: params })
    return axios.get(`/graphql/v1/boss`, {
      query: `{
        TeacherList(query: ${JSON.stringify(obj)}) {
          id
          realname
          phone
          department {
            id
            name
            pname
          }
        }
      }`
    })
  },
  // 微信管理列表（使用状态）
  getTeacherWeixinRelationList(params) {
    const obj = JSON.stringify({ weixin_id: params })
    return axios.get(`/graphql/v1/teacher`, {
      query: `{
        TeacherWeixinRelationList(query: ${JSON.stringify(obj)}) {
            teacher_id
            weixin_id
            is_effective
        }
      }`
    })
  },
  // 老师手机号模糊搜索
  getTeacherListEx(key, value) {
    const query = `{ "bool": { "must": [{ "wildcard": { "${key}": "*${value}*" } }] } }`
    return axios.post('/graphql/v1/teacher', {
      query: `
      {
        TeacherListEx(query:${JSON.stringify(query)})
        {
          id
          phone
          realname
        }
      }
      `
    })
  },
  // 老师微信号模糊搜索
  getWeChatTeacherListEx(weixinkey, value) {
    const query = `{ "bool": { "must": [{ "wildcard": { "${weixinkey}": "*${value}*" } }] } }`
    return axios.post('/graphql/v1/boss', {
      query: `
      {
        WeChatTeacherListEx(query:${JSON.stringify(query)})
        {
          id
          wechat_no
        }
      }
      `
    })
  },
  // wechat_id模糊搜索
  getWechatIdListEx(id, query) {
    // const p = {
    //   [`${id}.like`]: { [`${id}.keyword`]: `*${query}*` }
    // }
    // const params = JSON.stringify(p)
    let params
    if (id === 'wechat_id') {
      params = `{ "bool": { "must": [{ "wildcard": { "${id}.keyword": "*${query}*" } }] } }`
    } else {
      params = `{ "bool": { "must": [{ "term": { "${id}": "${query}" } }] } }`
    }
    return axios.post('/graphql/v1/toss', {
      query: `
      {
        WeChatTeacherListEx(query:${JSON.stringify(params)})
        {
          id
          ${id}
        }
      }
      `
    })
  }
  // wechat_id精准搜索
  // getWechatIdList(id, query) {
  //   const params = `{ "${id}": "*${query}*" }`
  //   return axios.post('/graphql/v1/toss', {
  //     query: `
  //     {
  //       WeChatTeacherList(query:${JSON.stringify(params)})
  //       {
  //         id
  //         ${id}
  //       }
  //     }
  //     `
  //   })
  // }
}
