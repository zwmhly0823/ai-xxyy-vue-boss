import axios from '../axiosConfig'

export default {
  test(params) {
    return axios.post('/v1/mongo/search',{
      tableName: 'a_account',
      ...params
    })
  }
}
