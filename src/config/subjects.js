/*
 * @Descripttion: 多科目名称配置
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-19 17:36:34
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-21 16:08:05
 * 美术APP
  @ApiModelProperty("美术")
  ART_APP,
  * 写字APP
  @ApiModelProperty("写字")
  WRITE_APP,
  * AI学院
  @ApiModelProperty("AI学院")
  COLLEGE_APP
 */

const subjects = {
  art_app: '小熊美术',
  write_app: '美术宝写字'
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
