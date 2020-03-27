<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-27 17:16:50
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="stageData"
      class="item-style"
      clearable
      multiple
      collapse-tags
      placeholder="期数"
      @change="stageChange"
    >
      <el-option
        v-for="item in stageList"
        :key="item.stage"
        :label="item.stage_text"
        :value="item.stage"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="supData"
      class="item-style"
      clearable
      multiple
      collapse-tags
      placeholder="难度"
      @change="supChange"
    >
      <el-option
        v-for="item in supList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="levelData"
      class="item-style"
      clearable
      multiple
      collapse-tags
      placeholder="级别"
      @change="levelChange"
    >
      <el-option
        v-for="item in levelList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  props: {
    stageName: {
      type: String,
      default: 'stage'
    },
    supName: {
      type: String,
      default: 'sup'
    },
    levelName: {
      type: String,
      default: 'current_level'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stageList: [],
      supList: [],
      levelList: [],
      stageData: null,
      supData: null,
      levelData: null
    }
  },
  watch: {
    channelData(val) {
      console.log(val)
    }
  },
  async created() {
    await this.getStage()
    await this.getSup()
    await this.getLevel()
  },
  methods: {
    // 期数
    async getStage() {
      axios
        .post('/graphql/filter', {
          query: `{  
              teamStageList{
                stage
                stage_text
              }
            }
          `
        })
        .then((res) => {
          this.stageList = res.data.teamStageList
        })
    },
    // 难度
    async getSup() {
      axios
        .post('/graphql/filter', {
          query: `{    
            courseSupList{
                id
                name
              }
            }
          `
        })
        .then((res) => {
          this.supList = res.data.courseSupList
        })
    },
    // 级别
    async getLevel() {
      axios
        .post('/graphql/filter', {
          query: `{  
              courseLevelList{
                id,
                name
              }
            }
          `
        })
        .then((res) => {
          this.levelList = res.data.courseLevelList
        })
    },
    stageChange(data) {
      this.$emit(
        'stageCallBack',
        data.length > 0 ? { [this.stageName]: this.stageData } : ''
      )
    },
    supChange(data) {
      this.$emit(
        'supCallBack',
        data.length > 0 ? { [this.supName]: this.supData } : ''
      )
    },
    levelChange(data) {
      this.$emit(
        'levelCallBack',
        data.length > 0 ? { [this.levelName]: this.levelData } : ''
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 440px !important;
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
