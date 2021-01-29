/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-11 15:09:40
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-04-11 15:11:37
 * @Description: BOSS
 */
import _ from 'lodash'

//  数组对象按指定key排序
export function sortByKey(arr = [], key) {
  return arr.map((item) => {
    if (item.children) {
      item.children = _.sortBy(item.children, key)
      if (item.children.children) sortByKey(item.children, key)
    }
    return item
  })
}
