/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-21 11:58:33
 * @Last Modified by: chengweihua
 * @Last Modified time: 2020-04-01 16:03:38
 * @Description: 班级
 */
import axios from '../axiosConfig'
import newAxios from '../axios.js'

export default {
  // 获取体验课状态列表
  getExperienceStatusList(params) {
    return axios.post(`/graphql/team`, params)
  },
  // 学员列表获取所有优惠券
  getAllCoupons(params) {
    return newAxios.get(`/api/s/v1/coupon/getAllCoupons?page=${params}`)
  },
  // 批量发放优惠券
  sendCoupon(id, params) {
    return newAxios.post(
      `/api/s/v1/coupon/send/batch/sendCoupon?couponId=${id}`,
      params
    )
  },
  // 生成完课榜 / 生成作品展
  finishClassList({ queryParams }) {
    return axios.post('/graphql/getStuRankingList', {
      query: `{
                getStuComRankingList(query : ${JSON.stringify(queryParams)}){
                student_id
                mobile
                username
                head
                completeArr {
                current_lesson
                is_complete
                }
            }
          }`
    })
  },
  exhibitionOfWorks({ QueryParams }) {
    return axios.post('/graphql/getStuRankingList', {
      query: `{
            getStuTaskRankingList(query : ${JSON.stringify(QueryParams)}){
            student_id
            mobile
            username
            head
            completeArr {
            current_lesson
            task_image
                }
                }
                  }`
    })
  }
}
