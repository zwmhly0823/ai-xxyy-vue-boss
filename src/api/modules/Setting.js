import axios from '../axiosConfig'
export default {
  getDepLabelList(query) {
    return axios.post(`/api/toss/v1/toss-api/label/depLabelList`, query)
  },
  getGroupLabel(query) {
    return axios.post(
      `/api/toss/v1/toss-api/label/getGroupLabel?type=${query.type}`,
      query.teacherIds
    )
  },
  // 标签弹窗
  getTeacherLabel(query) {
    return axios.post(
      `/api/toss/v1/toss-api/label/getTeacherLabel?teacherId=${query.teacherId}`,
      query
    )
  },
  getTeacherList() {
    const query = JSON.stringify({
      duty_id: '1'
    })
    return axios.post('/graphql/v1/toss', {
      query: `{
        TeacherList(query: ${JSON.stringify(query)}, size: 300){
          id
          realname
        }
      }`
    })
  },
  // 新增标签组
  saveLabelInfo(query) {
    return axios.post(`/api/toss/v1/toss-api/label/saveLabelInfo`, query)
  },
  // 新增标签
  saveDefineLabel(query) {
    return axios.post(`/api/toss/v1/toss-api/label/saveDefineLabel`, query)
  },
  // type=1是标签，2是组
  delDefineLabel(query) {
    return axios.get(
      `/api/toss/v1/toss-api/label/delDefineLabel?labelId=${query.labelId}&teacherId=${query.teacherId}&type=${query.type}`
    )
  },
  // 打标签
  setLabelForUser(query) {
    return axios.post(`/api/toss/v1/toss-api/label/setLabelForUser`, query)
  }
}
