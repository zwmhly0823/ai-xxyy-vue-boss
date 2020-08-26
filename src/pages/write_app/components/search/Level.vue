<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-08-26 16:27:40
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-26 17:18:40
-->
<template>
  <el-select
    v-model="levelData"
    clearable
    size="mini"
    multiple
    :courseType="courseType"
    :emitName="emitName"
    :placeholder="placeholder"
    @change="levelChange"
  >
    <el-option
      v-for="item in levelList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    /**
     * @description 课程类型
     * @params '0'---> 体验课；'1'---> 系统课
     */
    courseType: {
      type: String,
      default: '0'
    },
    emitName: {
      type: String,
      default: 'level'
    },
    placeholder: {
      type: String,
      default: '难度'
    }
  },
  data() {
    return {
      levelData: null,
      trialLevelList: [
        {
          label: 'S1',
          value: 'S1'
        },
        {
          label: 'S2',
          value: 'S2'
        }
      ],
      systemlList: [
        {
          label: 'S1',
          value: 'S1'
        },
        {
          label: 'S2',
          value: 'S2'
        },
        {
          label: 'S3',
          value: 'S3'
        },
        {
          label: 'S4',
          value: 'S4'
        },
        {
          label: 'S5',
          value: 'S5'
        },
        {
          label: 'S6',
          value: 'S6'
        }
      ]
    }
  },
  computed: {
    levelList() {
      return this.courseType === '0' ? this.trialLevelList : this.systemlList
    }
  },
  methods: {
    levelChange(level) {
      this.$emit(
        'result',
        level.length > 0 ? { [this.emitName]: this.levelData } : ''
      )
    }
  }
}
</script>
<style lang="scss" scoped></style>
