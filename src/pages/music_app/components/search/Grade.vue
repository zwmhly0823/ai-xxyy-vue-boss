<!--
 * @Descripttion: 课程难度：1-5年级
    体验课（基础S1,高阶S2）, 系统课 S1-S5
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-25 11:57:39
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-02 21:44:21
-->
<template>
  <simple-select
    :name="name"
    :placeholder="placeholder"
    :data-list="dataList"
    :multiple="multiple"
    @result="getData"
  />
</template>

<script>
import { getDataType } from '@/utils/index'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect'
export default {
  components: {
    SimpleSelect
  },
  props: {
    // 课程类型：体验课、系统课
    teamType: {
      type: String,
      default: '0'
    },
    // 需要返回的对象字段 {grade:"S1"}
    name: {
      type: String,
      default: 'grade'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 返回值的格式，默认返回 年级对应的数字（1-6）；加上‘s’或'S'，返回s1, S2
    extra: {
      type: String,
      default: ''
    }
  },
  computed: {
    dataList() {
      return this.teamType === '0' ? this.dataListTrial : this.dataListSys
    }
  },
  data() {
    return {
      dataListTrial: [
        {
          id: '1',
          text: '基础(S1)'
        },
        {
          id: '2',
          text: '高阶(S2)'
        }
      ],
      dataListSys: [
        {
          id: '1',
          text: '一年级(S1)'
        },
        {
          id: '2',
          text: '二年级(S2)'
        },
        {
          id: '3',
          text: '三年级(S3)'
        },
        {
          id: '4',
          text: '四年级(S4)'
        },
        {
          id: '5',
          text: '五年级(S5)'
        },
        {
          id: '6',
          text: '六年级(S6)'
        }
      ]
    }
  },

  methods: {
    getData(res) {
      if (res && this.extra) {
        const value = Object.values(res)[0]
        const type = getDataType(value)
        if (type === 'Array') {
          res[this.name] = value.map((item) => `${this.extra}${item}`)
        }
        if (type === 'String') res[this.name] = `${this.extra}${value}`
      }
      this.$emit('result', res)
    }
  }
}
</script>

<style lang="scss" scoped></style>
