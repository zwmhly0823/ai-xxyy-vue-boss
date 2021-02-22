/*
 * @Descripttion: 美术-课程难度
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-10-13 21:14:38
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-24 17:13:07
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
 * 体验课里面  显示 M1 M2 M3 M4   传值  对应  S1 S2 S3 S4
 * 系统课里面  显示 MA MB   传值  对应  S8 S9
 * */
// export const SUP_LEVEL_LIST_UPPER = formatSupList()

export const SUP_LEVEL_LIST_LOWER = [
  { id: 'S8', text: 'MA' },
  { id: 'S9', text: 'MB' },
]
export const SUP_LEVEL_LIST_UPPER = [
  { id: 'S1', text: 'M1' },
  { id: 'S2', text: 'M2' },
  { id: 'S3', text: 'M3' },
  { id: 'S4', text: 'M4' },
]
export const SUP_LEVEL_TRIAL = {
  S1:'M1',
  S2:'M2',
  S3:'M3',
  S4:'M4'
}
export const SUP_LEVEL_SYSTEM = {
  S8:'MA',
  S9:'MB',
}
export const SUP_LEVEL_ALL = {
  S1:'M1',
  S2:'M2',
  S3:'M3',
  S4:'M4',
  S8:'MA',
  S9:'MB',
}
/**
 * 用于特殊情况下，体验课
 */
const trialKey = [1, 2, 3]
export const SUP_LEVEL_LIST_TRIAL = SUP_LEVEL_LIST_UPPER.filter((item) =>
  trialKey.includes(item.id)
)

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
//   const arr = deepClone(SUP_LEVEL_LIST_UPPER)
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
 * 前端转班级名称历史数据 - S1,S2
 * 0817期S1-3班级 -> 0817期S1-进阶-3班级
 * 0817期S2-3班级 -> 0817期S2-基础-3班级
 *
 * S2L1U3 -> S2-基础L1U3
 */
export function formatTeamNameSup(teamName) {
  
  if (!teamName) return
  const upperName = teamName.toLocaleUpperCase()
  let idx = -1
  if (upperName.indexOf('S1') > -1) {
    idx = upperName.indexOf('S1')
  }
  if (upperName.indexOf('S2') > -1) {
    idx = upperName.indexOf('S2')
  }
  if (upperName.indexOf('S4') > -1) {
    idx = upperName.indexOf('S4')
  }
  if (upperName.indexOf('S5') > -1) {
    idx = upperName.indexOf('S5')
  }

  if (idx >= 0 && !upperName.includes('基础') && !upperName.includes('进阶')) {
    const s = upperName.substr(idx, 2)
    teamName = teamName.replace(s, SUP_LEVEL_UPPER[s])
    
  }
  // if (
  //   upperName.includes('S1') &&
  //   !upperName.includes('基础') &&
  //   !upperName.includes('进阶')
  // ) {
  //   teamName = teamName.replace('S1', 'S1-进阶')
  // }
  // if (
  //   upperName.includes('S2') &&
  //   !upperName.includes('基础') &&
  //   !upperName.includes('进阶')
  // ) {
  //   teamName = teamName.replace('S2', 'S2-基础')
  // }
  return teamName
}

/**
 * 美术 - 课程难度更改 END
 */
export function formatTeamNameSupReverse(teamName) {
  if (!teamName) return
  const upperName = teamName.toLocaleUpperCase()
  let idx = -1
  if (upperName.indexOf('S1-基础') > -1) {
    idx = upperName.indexOf('S1-基础')
  }
  if (upperName.indexOf('S1-进阶') > -1) {
    idx = upperName.indexOf('S1-进阶')
  }
  if (upperName.indexOf('S2-基础') > -1) {
    idx = upperName.indexOf('S2-基础')
  }
  if (upperName.indexOf('S2-进阶') > -1) {
    idx = upperName.indexOf('S2-进阶')
  }
  if (upperName.indexOf('S3专项技能课') > -1) {
    idx = upperName.indexOf('S3专项技能课')
  }

  if (idx >= 0) {
    const s = upperName.substr(idx, 5)
    teamName = teamName.replace(s, SUP_LEVEL_LIST_UPPER_REVERSE.get(s))
  }
  return teamName
}

// 课程难度替换

export function courseLevelReplace(name) {
  if(!name)return
  let result = ''
  const reg = /S(\d{1,2})/
  const str = name.match(reg)
  if (str) {
    const num = str[0]
    result = name.replace(reg, SUP_LEVEL_ALL[num])
  } else {
    result = name
  }
  return result
}