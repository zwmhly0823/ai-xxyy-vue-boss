/*
 * @Descripttion: 美术-课程难度
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-10-13 21:14:38
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-14 15:50:31
 */
// import { deepClone } from '@/utils'
/**
 * 美术 - 课程难度更改
 * ‘S1-基础’ 新增S4 ； ‘S1-进阶’ 原S1 ；‘S2-基础’ 原S2； 'S2-进阶' 新增S5； 'S3' 原S3 ；
 */
export const SUP_LEVEL = {
  4: 'S1-基础',
  1: 'S1-进阶',
  2: 'S2-基础',
  5: 'S2-进阶',
  3: 'S3'
}
// 小写s
// export const SUP_LEVEL_LOWER = {
//   s4: 'S1-基础',
//   s1: 'S1-进阶',
//   s2: 'S2-基础',
//   s5: 'S2-进阶',
//   s3: 'S3'
// }
// // S大写的情况
// export const SUP_LEVEL_UPPER = {
//   S4: 'S1-基础',
//   S1: 'S1-进阶',
//   S2: 'S2-基础',
//   S5: 'S2-进阶',
//   S3: 'S3'
// }

// 对象， 大小写s
export const SUP_LEVEL_LOWER = formatSup('s')
export const SUP_LEVEL_UPPER = formatSup('S')

/**
 * 数组
 * [{id: 'S1', text:'S1-基础'}]
 * */
// export const SUP_LEVEL_LIST = formatSupList()
export const SUP_LEVEL_LIST = [
  { id: 4, text: 'S1-基础' },
  { id: 1, text: 'S1-进阶' },
  { id: 2, text: 'S2-基础' },
  { id: 5, text: 'S2-进阶' },
  { id: 3, text: 'S3' }
]
export const SUP_LEVEL_LIST_LOWER = [
  { id: 's4', text: 'S1-基础' },
  { id: 's1', text: 'S1-进阶' },
  { id: 's2', text: 'S2-基础' },
  { id: 's5', text: 'S2-进阶' },
  { id: 's3', text: 'S3' }
]
export const SUP_LEVEL_LIST_UPPER = [
  { id: 'S4', text: 'S1-基础' },
  { id: 'S1', text: 'S1-进阶' },
  { id: 'S2', text: 'S2-基础' },
  { id: 'S5', text: 'S2-进阶' },
  { id: 'S3', text: 'S3' }
]

// export const SUP_LEVEL_LIST_LOWER = formatSupList('s')
// export const SUP_LEVEL_LIST_UPPER = formatSupList()

function formatSup(flag = 'S') {
  const obj = {}
  for (const key in SUP_LEVEL) {
    if (Object.keys(SUP_LEVEL).includes(key)) {
      const item = SUP_LEVEL[key]
      obj[`${flag}${key}`] = item
    }
  }
  return obj
}

// flag: s-S
// function formatSupList(flag = 'S') {
//   let list = []
//   const arr = deepClone(SUP_LEVEL_LIST)
//   list = arr.map((item) => {
//     item.id = `${flag}${item.id}`
//     return item
//   })
//   return list
// }

// 根据s级别，获取对应文案; s-级别，upper-是否大写，默认小写 false
export function getSubLevel(s, upper = false) {
  if (!s) return ''
  return (upper ? SUP_LEVEL_UPPER[s] : SUP_LEVEL_LOWER[s]) || ''
}

/**
 * 美术 - 课程难度更改 END
 */
