/**
 * @Descripttion: BOSS - 社群销售
 * @version:
 * @Author: Yangjiyong
 * @Date: 2020-04-07 13:52:26
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-16 17:10:30
 */
import axios from '../axiosConfig'

export default {
  /**
   * 组织机构列表
   * */
  getDepartmentTree(id) {
    return axios.get(`/api/t/v1/department/getDepartmentTree?id=${id}`)
  },
  /**
   * 新增、编辑组织结构
   * */
  createDepartment(params) {
    return axios.post(`/api/t/v1/department/createDepartment`, params)
  },
  /**
   * 删除组织结构
   * */
  deleteDepartmentById(departmentId) {
    return axios.post(
      `/api/t/v1/department/deleteDepartmentById?departmentId=${departmentId}`
    )
  },
  getOssSign() {
    return axios.get(`/api/home/v1/ossconfig/getStsPubWriteToken`)
  },
  // 老师列表
  getTeacherPage(page = 1, query = '', size = '20') {
    const sort = `{"id": "desc"}`
    return axios.post('/graphql/v1/boss', {
      query: `{
        TeacherManagePage(page: ${page}, query: ${query ||
        null}, size:${size}, sort: ${JSON.stringify(sort)}) {
          number
          totalPages
          totalElements
          content {
            id
            realname
            sex
            nickname
            phone
            status
            is_login
            head_image
            join_date
            leave_date
            level
            leave_train
            department {
              id
              name
              pid
              pname
            }
            duty {
              id
              name
            }
            rank {
              id
              name
            }
            weixin {
              id
              weixin_no
            }
          }
        }
      }`
    })
  },
  // 老师部门关系
  // getTeacherDepartmentRelation(query) {
  //   return axios.post('/graphql/boss', {
  //     query: `{
  //       TeacherDepartmentRelationList(query: ${query}){
  //         id
  //         name
  //       }
  //     }`
  //   })
  // },
  // 老师职务
  getTeacherDutyList() {
    return axios.post('/graphql/v1/boss', {
      query: `{
          TeacherDutyList{
            id
            name
          }
        }`
    })
  },
  // 获取教师详情
  getTeacherDetail(id) {
    return axios.get(`/api/t/v1/teacher/getTeacherDetail?teacherId=${id}`)
  },
  // 上传头像
  getPubWriteSinged() {
    return axios.get(`/api/home/v1/ossconfig/getPubWriteSinged`)
  },
  // 部门
  getdepartmentList() {
    return axios.post('/graphql/v1/boss', {
      query: `{
         TeacherDepartmentPage(query: "") {
            number
            totalPages
            totalElements
            content {
              id
              pid
              name
            }
          }
        }`
    })
  },
  // 职级
  TeacherRankList() {
    return axios.post('/graphql/v1/boss', {
      query: `{
         TeacherRankList{
            id
            name
          }
        }`
    })
  },
  // 级别
  courseSupList() {
    return axios.post('/graphql/filter', {
      query: `{
          courseSupList{
            id
            name
          }
       }`
    })
  },
  // 新建老师
  createTeacher(params) {
    console.log(params)
    return axios.post(`/api/t/v1/teacher/createTeacher`, params)
  },
  //  编辑老师
  updateTeacher(params) {
    return axios.put(`/api/t/v1/teacher/updateTeacher`, params)
  },
  //  老师手机号，姓名模糊搜索
  teacherListEx(name, params) {
    const quer = `{ "bool": { "must": [{ "wildcard": { "${name}": "*${params}*" } }] } }`
    return axios.post('/graphql/v1/teacher', {
      query: `
      {
        TeacherListEx(query:${JSON.stringify(quer)})
        {
          phone
          realname
          nickname
        }
      }
      `
    })
  },
  // 新增老师 添加微信
  WeChatTeacherList() {
    const query = `{"teacher_id":{"lte":0}}`
    return axios.post(`/graphql/v1/toss`, {
      query: `{
          WeChatTeacherList(query: ${JSON.stringify(query)}) {
            id
            wechat_no
            teacher_id
          }
        }`
    })
  },
  // 老师微信号模糊搜索
  getWeChatTeacherListEx(weixinkey, value) {
    const query = `{ "bool": { "must": [{ "wildcard": { "${weixinkey}": "*${value}*" } },{"term":{"teacher_id":0}}] } }`
    return axios.post('/graphql/v1/toss', {
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
  // 新增微信 获取老师name id
  TeacherList(query = '', value) {
    const querys = {
      bool: { must: [{ wildcard: { 'realname.keyword': `*${value}*` } }] }
    }
    if (query) querys.bool.must.push({ term: query })
    const q = JSON.stringify(querys)
    return axios.post('/graphql/v1/teacher', {
      query: `{
        TeacherListEx(query:${JSON.stringify(q)},size:100) {
          realname
          id
        }
       }`
    })
  },
  // 新增微信 添加
  relation(params) {
    return axios.post(`/api/t/v1/wechat/teacher/create/relation`, params)
  },
  // 微信编辑接口
  WeChatTeacher(query = '') {
    return axios.post('/graphql/v1/teacher', {
      query: `{
        WeChatTeacher(query:${JSON.stringify(query)}) {
          id
          wechat_no
          wechat_qr_code
          head_img_url
          teacher_id
        }
       }`
    })
  },
  // 微信编辑接口
  TeacherWeixinRelation(query = '') {
    return axios.post('/graphql/v1/teacher', {
      query: `{
        TeacherWeixinRelation(query:${JSON.stringify(query)}) {
          teacher_id
          is_effective
        }
       }`
    })
  },
  // 微信编辑接口
  getTeacher(query = '') {
    return axios.post('/graphql/v1/teacher', {
      query: `{
        Teacher(query:${JSON.stringify(query)}) {
          department_id
          realname
          id
        }
       }`
    })
  },
  getTeacherIdByCategory({ queryParams = '' }) {
    return axios.get('/graphql/v1/toss', {
      query: `{
        StudentTeamList(
            query: ${JSON.stringify(queryParams)}
        ) {
            teacher_id
        }
      }`
    })
  },
  // 难度
  supList() {
    return axios.post('/graphql/filter', {
      query: `{
        courseSupList{
            id
            name
          }
        }
      `
    })
  },
  // 商品类型
  productTopicList() {
    return axios.post('/graphql/filter', {
      query: `{
          productTopic{
            id
            name
          }
       }`
    })
  },
  // 根據期數和課程類型獲取版本信息
  getVersionByCourseVersion(params) {
    return axios.get(
      `/api/t/v1/teacher/course/enroll/courseVersion?period=${params.period}&courseType=${params.courseType}`
    )
  }
}
