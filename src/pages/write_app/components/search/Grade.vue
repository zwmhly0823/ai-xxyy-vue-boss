<!--
 * @Descripttion: 课程难度：1-5年级
    体验课（基础S1,高阶S2）, 系统课 S1-S5
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-25 11:57:39
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-26 12:10:46
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
          text: 'S1(基础)'
        },
        {
          id: '2',
          text: 'S2(高阶)'
        }
      ],
      dataListSys: [
        {
          id: '1',
          text: 'S1'
        },
        {
          id: '2',
          text: 'S2'
        },
        {
          id: '3',
          text: 'S3'
        },
        {
          id: '4',
          text: 'S4'
        },
        {
          id: '5',
          text: 'S5'
        },
        {
          id: '6',
          text: 'S6'
        }
      ]
    }
  },

  methods: {
    getData(res) {
      this.$emit('result', res)
    }
  }
}
</script>

<style lang="scss" scoped></style>
