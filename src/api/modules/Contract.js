import axios from '../axiosConfig'

export default {
    /**
     * 获取合同列表
     * collaboratorName   合作方名称
     * name 合同名称
     * body 合同主体
     * contractType 合同类型
     * beginTime
     * endTime
     * page
     * size
     * subject  科目类型
     */
    getContracts(params) {
        return axios.post(
            `/api/c/v1/contract/getContracts`,
            params
        )
    },
    // 合同基础信息
    getContractInfo(query) {
        return axios.get(
            `/api/c/v1/contract/contractInfo`
        )
    },
    // ID合同基础信息
    getContractInfoById(query) {
        return axios.get(
            `/api/c/v1/contract/getContractDetail?id=${query.id}`
        )
    },
    // 创建合同
    creatContractInfo(params) {
        return axios.post(
            `/api/c/v1/contract/createContract`,
            params
        )
    },
    // 修改合同
    modifyContractInfo(params) {
        return axios.put(
            `/api/c/v1/contract/modifyContract`,
            params
        )
    },
    // 删除合同
    deleteContract(params) {
        return axios.get(
            `/api/c/v1/contract/deleteContract`
        )
    },
    // 修改合同价格
    modifyContractPrice(params) {
        return axios.put(
            `/api/c/v1/contract/modifyContractPriceDetail`,
            params
        )
    },
    // 通过ID和时间获取合同生效价格
    // id , timeStamp 时间戳
    getContractDetailByTimeStamp(query) {
        return axios.get(
            `/api/c/v1/contract/getContractDetailByTimeStamp?id=${query.id}&timeStamp=${query.time}`
        )
    },

    // 创建合同临时价格配置
    createContractPriceDetails(params) {
        return axios.post(
            `/api/c/v1/contract/createContractPriceDetails`,
            params
        )
    },
    // 停用合同临时价格
    stopContractPriceDetail(query) {
        return axios.get(
            `/api/c/v1/contract/stopContractPriceDetail`
        )
    },
    // 创建合同临时价格配置
    createContractPriceDetails(params) {
        return axios.post(
            `/api/c/contract/createContractPriceDetails`,
            params
        )
    },
    // 通过ID获取合同价格配置
    getContractPriceDetails(query) {
        return axios.get(
            `/api/c/v1/contract/getContractPriceDetails?id=${query.id}`
        )
    },
    /**
     * 获取合同筛选集合
     * key 关键字
     * keyType 关键字类型
     */
    queryContractFilters() {
        return axios.post(
            `/api/c/v1/contract/queryContractFilters`,
            params
        )
    },
}