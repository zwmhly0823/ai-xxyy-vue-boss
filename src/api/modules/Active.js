import axios from '../axiosConfig'

export default {
  test(params) {
    return axios.get('/data/mongo/m1/v1/xiaoDu/listForAddress',{
      ...params
    })
  }
}
