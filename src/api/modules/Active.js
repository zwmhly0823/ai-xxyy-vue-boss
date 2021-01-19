import axios from '../axiosConfig'

export default {
  test(params) {
    return axios.post('/data/mongo/m1/v1/mongo/search/common',{
      tableName: 'a_account',
      ...params
    })
  }
}
