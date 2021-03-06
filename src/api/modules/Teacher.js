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
  getDepartmentTree(id = 0) {
    return axios.get(`/api/t/v2/department/getDepartmentTree?id=${id}`)
  },
  /**
   * 新增、编辑组织结构
   * */
  createDepartment(params) {
    Object.assign(params,{subject:"MUSIC_APP"})
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
  // 招生排期
  getTeacherRealnameAndId(page = 1, query = '', size = '3000') {
    return axios.post('/graphql/v1/boss', {
      query: `{
        TeacherManagePage(page: ${page}, query: ${query ||
        null}, size:${size}) {
          number
          totalPages
          totalElements
          content {
            id
            realname
            weixin_ids
          }
        }
      }`
    })
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
            ding_userid
            phone
            status
            is_login
            head_image
            join_date
            leave_date
            level
            leave_train
            teacher_status
            data_auth
            work_place
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
            teacherLevelInfo{
              level
              level_name
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
    return axios.post('/graphql/v1/toss', {
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
  // 获取所有部门列表
  getdepartmentAllList() {
    //  JSON.stringify(querys)
    const querys = {
      del: 0
    }
    return axios.post('/graphql/v1/toss', {
      query: `{
          TeacherDepartmentList(query:${JSON.stringify(
            JSON.stringify(querys)
          )},size:1000){
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
  },
  // 全部总数
  departmentTree() {
    return axios.get(`/api/t/v1/department/count/departmentTree`)
  },
  // 获取职场
  getWorkPlace() {
    return axios.get(`/api/t/v1/teacher/getWorkPlace`)
  },
  // 获取全部班级列表
  StudentTeamList(teamName) {
    const params = JSON.stringify({
      'team_name.like': { 'team_name.keyword': `*${teamName}*` }
    })
    return axios.post('/graphql/v1/toss', {
      query: `{
        StudentTeamList(query: ${JSON.stringify(params)}){
          id
          team_name
        }
      }`
    })
  },
  /**
   * 水军微信
   * http://ai-app-dev.meixiu.mobi/api/t/jsondoc-ui.html?url=/api/t/jsondoc#
   */
  // 创建/编辑水军微信号
  saveWaterArmy(params = {}) {
    return axios.post('/api/t/v1/navy/saveNavy', params)
  },

  // 水军微信 列表（查询）@weixinNo；@wechat_status body: departmentIds []
  getWaterArmyPage(
    { weixinNo = '', wechat_status = '', departmentIds = [] } = {},
    pageNum = 1,
    pageSize = 20
  ) {
    let url = `/api/t/v1/navy/getNavyPage?pageSize=${pageSize}&pageNum=${pageNum}`
    if (weixinNo) {
      url += `&weixinNo=${weixinNo}`
    }
    if (wechat_status || wechat_status === 0) {
      url += `&wechat_status=${wechat_status}`
    }
    return axios.post(
      url,
      departmentIds && departmentIds.length > 0 ? departmentIds : null
    )
  }

  /**
   * 水军微信 END
   */
}
