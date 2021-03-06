/*
 * @Descripttion: 美术-课程难度
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-10-13 21:14:38
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-15 21:21:11
 */
// import { deepClone } from '@/utils'
/**
 * 美术 - 课程难度更改
 * ‘S1-基础’ 新增S4 ； ‘S1-进阶’ 原S1 ；‘S2-基础’ 原S2； 'S2-进阶' 新增S5； 'S3' 原S3 ；
 */
/** 
 * 渠道信息管理添加渠道模版字典
 * 
*/
export const channelList = [
  // {
  //   value: "/channel/single/508/index/0?channelId='",
  //   label: '22元双周体验课联投模版',
  // },
  {
    value: "/channel/single/505/index/1?channelId='",
    label: '1v1美术宝9.9元双周体验课模版',
  },
  {
    value: '/channel/single/505/index/0?channelId=',
    label: '9.9元双周体验课模版',
  },
  {
    value: '/channel/single/507/index/0?channelId=',
    label: '9.9元单周体验课模版',
  },
  {
    value: '/channel/single/506/index/0?channelId=',
    label: '19元单周体验课模版',
  },
  {
    value: '/channel/single/503/index/0?channelId=',
    label: '29元双周体验课模版',
  },
  {
    value: '/channel/single/500/index/0?channelId=',
    label: '49元双周体验课模版',
  },
  {
    value: '/activityCoupon/twoHundred?channelId=',
    label: '200抵500代金券',
  },
  {
    value: '/fortyNine/newSystemYear?channelId=',
    label: '年系统课',
  },
]
export const SUP_LEVEL = {
    4: 'M1',
    1: 'M2',
    2: 'M3',
    5: 'M4',
}

export const ContractType = {
    RETAILER: '零售',
    CHANNEL: '渠道'
}

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
// 招生排期点索引传的值
export const Sup_scheduleIndex = {
        0: 2,
        1: 0,
        2: 1
    }
    //招生排期点提交传的值
export const Sup_scheduleSubmit = {
        0: 3,
        1: 0,
        2: 2
    }
    //招生排期 下载名称字段
export const Sup_scheduleDownload = {
    0: "单周体验课",
    1: "双周体验课",
    2: "系统课"
}
export const SUP_LEVEL_LIST_teacher = [
    { id: 'S1', text: 'M1' },
    { id: 'S2', text: 'M2' },
    { id: 'S3', text: 'M3' },
    { id: 'S4', text: 'M4' }
]
export const SUP_LEVEL_LIST_LOWER = [
    { id: 'S1', text: 'M1' },
    { id: 'S2', text: 'M2' },
    { id: 'S3', text: 'M3' },
    { id: 'S4', text: 'M4' }
]
export const SUP_LEVEL_LIST_UPPER = [
    { id: 'S1', text: 'M1' },
    { id: 'S2', text: 'M2' },
    { id: 'S3', text: 'M3' },
    { id: 'S4', text: 'M4' },
]
export const SUP_LEVEL_TRIAL = {
    S1: 'M1',
    S2: 'M2',
    S3: 'M3',
    S4: 'M4'
}
export const SUP_LEVEL_SYSTEM = {
    S1: 'M1',
    S2: 'M2',
    S3: 'M3',
    S4: 'M4'
}

export const SUP_LEVEL_ALL = {
        S1: 'M1',
        S2: 'M2',
        S3: 'M3',
        S4: 'M4',
        S8: 'MA',
        S9: 'MB',
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
    return teamName
}


// 课程难度替换

export function courseLevelReplace(name) {
    if (!name) return
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