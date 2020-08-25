/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 17:35:28
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-11 11:48:27
 */
import axios from '../axiosConfig'

export default {
  /**
   * 添加点评信息
   * @params reviewVoice 传入实体
   * */
  addRiviewInform(reviewVoice) {
    return axios.post(`/api/b/v1/reviewVoice/addReviewVoice`, reviewVoice)
  },
  /**
   * 获取语音库列表
   * */
  getAudioList(number, size = 10) {
    return axios.get(
      `/api/b/v1/reviewVoice/getPageReviewVoice?pageNum=${number}&pageSize=${size}`
    )
  },
  /**
   * 更新点评语音是否禁用
   * @params reviewVoice 传入实体
   * */
  audioIsUse(reviewVoice) {
    return axios.get(`/api/b/v1/reviewVoice/updateReviewVoice`, reviewVoice)
  },
  /**
   * 获取课程2.0
   * */
  getCourseLessons(params) {
    return axios.get(`/api/k/v1/courseware/getCoursewares/typeNo?no=${params}`)
  },
  /**
   * 获取课程
   * */
  getCourseLesson(params) {
    return axios.get(`/api/k/v1/courseware/getCoursewares/no?no=${params}`)
  },
  /**
   * 获取TV课程列表
   * */
  getTVCourseLesson(params) {
    return axios.get(`/api/k/v1/courseware/getCoursewares/type/level`, params)
  },
  /**
   * 待点评数据
   * @params number 第几页
   * @params size 每页展示多少条
   * */
  getToView(number, size = 5) {
    return axios.get(
      `/api/tm/v1/teacher/manager/courseTask/all/notCommentTask?pageNumber=${number}&pageSize=${size}`
    )
  },
  /**
   * 获取待点评信息
   * @params courseId 课程id
   * */
  getToViewInform(courseId) {
    return axios.get(`/api/b/v1/reviewVoice/courses?courseIds=${courseId}`)
  },
  /**
   * 生成语音
   * */
  syntheticSpeech(voices) {
    return axios.post(`/api/home/v1/config/merge/voice`, voices)
  },
  /**
   * 发送语音
   * */
  generateSpeech(voices) {
    return axios.post(`/api/tm/v1/teacher/manager/saveTaskComment`, voices)
  },
  /**
   *  已点评数据
   * @params number 第几页
   * @params size 每页展示多少条
   * */
  getHaveRiview(number, size = 5) {
    return axios.get(
      `/api/tm/v1/teacher/manager/courseTask/all/commentTask?pageNumber=${number}&pageSize=${size}`
    )
  },
  // 获取系统课名称 - 模糊搜索. typNo-课程类型
  getCoursewareSearch(query = '', typeNo = [0, 1, 8, 9]) {
    const newquery = {
      bool: { must: [{ wildcard: { 'title.keyword': `*${query}*` } }] }
    }
    if (typeNo) {
      newquery.bool.must.push({ terms: { type_no: typeNo } })
    }
    const q = JSON.stringify(newquery)
    const sort = `{ "id": "desc" }`
    return axios.post('/graphql/v1/toss', {
      query: `
        {
         CoursewareListEx(query: ${JSON.stringify(q)}, sort: ${JSON.stringify(
        sort
      )}) {
            id
            title
          }
        }
      `
    })
  },
  /**
   * 一键禁用/取消
   * */
  batchUpdateReviewVoice(params) {
    return axios.get(`/api/b/v1/reviewVoice/batchUpdateReviewVoice`, params)
  },
  /**
   * 删除
   * */
  delReviewVoice(params) {
    return axios.get(`/api/b/v1/reviewVoice/delReviewVoice`, params)
  }
}
