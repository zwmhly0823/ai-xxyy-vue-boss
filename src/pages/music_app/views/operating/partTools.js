/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2021-04-07 14:59:16
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-10 20:42:13
 */
/**
 * @description 此变量，兼容旧版本体验课新增、编辑页面组件
 */
export const viliderPeriod = 52
var single = 43
var double = 36
function geturl(){  
  let urlStr = window.location.origin;
  if(urlStr.indexOf('live')>0){
    single = 39
    double = 16
  }else if(urlStr.indexOf('prod')>0){
    single = 41
    double = 36
  }else if(urlStr.indexOf('test')>0){
    single = 43
    double = 36
  }else if(urlStr.indexOf('default')>0||urlStr.indexOf('192')>0){
    single = 57
    double = 74
  }
}
geturl()
export const singlePeriod = single
export const doublePeriod = double
