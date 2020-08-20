/*
 * @Descripttion: 多科目名称配置
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 17:36:34
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-20 12:14:33
 */

const subjects = {
  'bear-art': '小熊美术',
  'msb-writing': '美术宝写字'
}

const subjectsArr = function() {
  const list = []
  for (const key in subjects) {
    if (Object.keys(subjects).includes(key)) {
      const title = subjects[key]
      list.push({ key, title })
    }
  }
  return list
}
const subjectsList = subjectsArr()

export { subjects, subjectsList }
