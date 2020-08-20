/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 20:42:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-19 22:19:28
 */
import User from './modules/User' // 用户接口
import Login from './modules/Login'
import NoticeCenter from './modules/NoticeCenter'
export default Object.assign({}, { Login }, { User }, { NoticeCenter })
