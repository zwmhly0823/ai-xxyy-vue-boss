/*
 * @Descripttion: 美术宝写字接口文件
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:42:54
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-22 16:18:23
 */
import User from './modules/write_app/User' // 用户接口
import Operating from './modules/write_app/Operating' // 招生排期接口
export default Object.assign({}, { User }, { Operating })
