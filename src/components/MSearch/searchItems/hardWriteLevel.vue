<!--
 * @Descripttion: 难度级别 S1-S5
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-02 21:08:51
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="supData"
      class="item-style"
      clearable
      v-if="name"
      size="mini"
      multiple
      :subType="subType"
      :placeholder="placeholder"
      :style="myStyle"
      @change="supChange"
    >
      <el-option
        v-for="item in supList"
        :key="item.id"
        :label="item.name"
        :value="addSupS ? item.name : item.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { SUP_LEVEL_LIST_LOWER, SUP_LEVEL_LIST_UPPER } from '@/utils/supList.js'
export default {
  props: {
    placeholder: {
      type: String,
      default: '难度'
    },
    name: {
      type: String,
      default: 'sup'
    },
    subType: {
      type: String,
      default: 'sup'
    },
    addSupS: {
      type: Boolean,
      default: false
    },
    // 自定义style样式
    myStyle: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      stageList: [],
      scheduleList: [],
      supList: [],
      levelList: [],
      stageData: null,
      schedule: null,
      supData: null,
      levelData: null
    }
  },
  computed: {
    ...mapState({
      disableClick: (state) => {
        return state.leftbar.disableClick
      },
      typeStage: (state) => {
        return state.leftbar.typeStage
      }
    })
  },
  watch: {},
  async created() {
    
    this.supList =
      this.subType === '1' ? SUP_LEVEL_LIST_UPPER : SUP_LEVEL_LIST_LOWER
    // await this.getSup()
  },
  methods: {
    supChange(data) {
      // this.$emit('result', '')
      this.$emit('result', data.length > 0 ? { [this.name]: this.supData } : '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 100%;
    .item-style {
      width: 140px !important;
      margin-right: 10px;
    }
    .item-style:last-child {
      margin-right: 0px;
    }
  }
}
</style>
<style lang="scss">
.el-select__tags {
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
