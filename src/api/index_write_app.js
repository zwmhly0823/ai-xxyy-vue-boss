/*
 * @Descripttion: 美术宝写字接口文件
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:42:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-24 18:06:17
 */
import User from './modules/write_app/User' // 用户接口
import Operating from './modules/write_app/Operating' // 运营中心
import DownloadExcel from './modules/write_app/DownloadExcel' // 统计模块
export default Object.assign({}, { User }, { Operating }, { DownloadExcel })
