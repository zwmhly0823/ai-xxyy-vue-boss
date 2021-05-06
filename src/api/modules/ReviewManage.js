/*
 * @Descripttion: 兼职老师管理 相关接口
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-11-11 17:04:48
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-27 18:52:14
 */
import axios from '../axiosConfig'
import { injectSubject } from '@/utils/index'

export default {
  /**
   * 兼职老师排期设置
   * @param {} param
   */
  // 获取兼职老师排期列表及统计
  getDispatchConfigCount() {
    return axios.get('/api/tm/v1/teacher/manager/getDispatchConfigCount')
  },

  // 检查指定期是否已配置过接口
  // return: (payload: true已配置过，false未配置过)
  dispatchTermConfigCheck(term) {
    if (!term) return
    return axios.post(
      `/api/tm/v1/teacher/manager/dispatch/term/config/check?term=${term}`
    )
  },

  // 根据期数获取对应班级列表
  // type（页面类型）：CONFIG（配置页面），RESULT（查看配置结果页面），默认CONFIG
  getTeamConfigListByTerm(term = '', type = 'CONFIG') {
    if (!term) return
    return axios.get(
      `/api/tm/v1/teacher/manager/getTeamConfigList?term=${term}&type=${type}`
    )
  },

  /** 保存班级配置信息
    onTeamIds为所有开启的班级id，
    offTeamIds为所有关闭的班级id，
    term：期数，
    action：动作类型，表示新增（编辑），ACTION_ADD（新增，默认值，可不传），ACTION_EDIT（编辑）
    /api/tm/v1/teacher/manager/dispatch/team/config?onTeamIds=1&onTeamIds=2&offTeamIds=3&offTeamIds=4&term=1
   */
  dispatchTeamConfig({
    term = '',
    onTeamIds = [],
    offTeamIds = [],
    action = 'ACTION_ADD'
  } = {}) {
    if (!term) return
    return axios.post(
      `/api/tm/v1/teacher/manager/dispatch/team/config?term=${term}&onTeamIds=${onTeamIds.join()}&offTeamIds=${offTeamIds.join()}&action=${action}`
    )
  },

  /**
   * 兼职老师配置页面获取班级信息（兼职老师配置结果）列表
   * /api/tm/v1/teacher/manager/getTeacherConfigList?term=23&teamId=2&teamId=3&type='CONFIG'
   * term（期数），
   * teamId（班级id），
     type（页面类型）：CONFIG（配置页面），RESULT（查看配置结果页面），默认CONFIG
   */
  getTeacherConfigList({ term = '', teamId = '', type = 'CONFIG' } = {}) {
    if (!term || !teamId) return
    const team = teamId.split(',') || []
    let teamStr = ''
    team.forEach((id) => {
      teamStr += `&teamId=${id}`
    })
    return axios.get(
      `/api/tm/v1/teacher/manager/getTeacherConfigList?term=${term}${teamStr}&type=${type}`
    )
  },

  /**
   * 保存 配置兼职老师：
    /api/tm/v1/teacher/manager/dispatch/teacher/config?term=23
    请求方式：POST
    参数说明：term:期数，departmentId：部门id，sup：难度级别，teamIdList:班级id集合，teacherIdList：兼职老师id集合
    请求BODY：
    {
        "departmentId":2,
        "configs":[{
            "sup":"S2",
            "teamIdList":[2,3,4],
            "teacherIdList":[4,5,6]
        }]
    }
   */
  dispatchTeacherConfig({ term = '', configs = [] } = {}) {
    if (!term) return
    return axios.post(
      `/api/tm/v1/teacher/manager/dispatch/teacher/config?term=${term}`,
      configs
    )
  },

  // 根据id获取排期名称
  // status: 需要的排期状态：0 预招生 1 招生中 2待开课 3 开课中 4 已结课'
  //  1-系统课，0-体验课
  getManagementByPeriod(query) {
    if (!query) return
    return axios.post('/graphql/v1/toss', {
      query: `{
        Management(query: ${JSON.stringify(injectSubject(query))}){
          period
          period_name
          type
          status
        }
      }`
    })
  },
  // 兼职老师数据看板
  getCasualTeacherStatisticsPage(query = {}, page = 1, size = 20, sort = '') {
    const queryObj = query || {}
    Object.assign(queryObj, {
      teacher_status: 0
    })
    return axios.post('/graphql/v1/toss', {
      query: `{
        CasualTeacherStatisticsPage(query: ${JSON.stringify(
          JSON.stringify(queryObj)
        )}, page: ${page},size: ${size}){
          totalElements
          totalPages
          number
          content {
            teacher_id
            teacherInfo {
              department_name
              realname
            }
            bind_department_info {
              name
            }
            bind_department_id
            term
            total_student_count
            dispatch_student_count
            task_count
            join_course_rate
            complete_course_rate
            continue_order_rate
            refund_order_rate
            listen_comment_rate
            today_task_count
            today_un_comment_count
            time_out_task_count
            avg_comment_second
          }
        }
      }`
    })
  },

  /**
   * 真人点评
   */
  // 真人点评检查指定期是否已配置过接口 URL：/api/tm/v1/teacher/manager/task/term/config/check?term=2
  taskConfigCheck(term = '') {
    if (!term) return
    return axios.post(
      `/api/tm/v1/teacher/manager/task/term/config/check?term=${term}`
    )
  },

  // 真人点评 - 统计页面接口
  getCommentTeamConfigCount() {
    return axios.get(
      '/api/tm/v1/teacher/manager/task/getCommentTeamConfigCount'
    )
  },

  // 配置班级页面获取班级信息（配置结果）列表
  getTaskTeamConfigListByTerm(term = '', type = 'CONFIG') {
    if (!term) return
    return axios.post(
      `/api/tm/v1/teacher/manager/task/getTeamConfigList?term=${term}&type=${type}`
    )
  },

  // 真人点评配置班级接口
  dispatchTaskTeamConfig({ term = '', onTeamIds = [], offTeamIds = [] } = {}) {
    if (!term) return
    return axios.post(
      `/api/tm/v1/teacher/manager/task/team/config?term=${term}&onTeamIds=${onTeamIds.join()}&offTeamIds=${offTeamIds.join()}`
    )
  }
}
