<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-16 16:28:11
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="stageData"
      class="item-style"
      v-if="stageName"
      clearable
      multiple
      size="mini"
      placeholder="排期"
      :disabled="disableClick"
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
      v-if="supName"
      size="mini"
      multiple
      placeholder="难度"
      :disabled="disableClick"
      @change="supChange"
    >
      <el-option
        v-for="item in supList"
        :key="item.id"
        :label="item.name"
        :value="addSupS ? item.name : item.id"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="levelData"
      class="item-style"
      clearable
      v-if="levelName"
      multiple
      size="mini"
      :disabled="disableClick"
      placeholder="级别"
      @change="levelChange"
    >
      <el-option
        v-for="item in levelList"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import axios from '@/api/axios'
import { mapState } from 'vuex'

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
    },
    addSupS: {
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
  computed: {
    ...mapState({
      disableClick: (state) => {
        return state.leftbar.disableClick
      }
    })
  },
  watch: {
    channelData(val) {
      console.log(val)
    },
    addSupS(val) {
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
          this.supList.splice(
            res.data.courseSupList.filter((item) => +item.id === 0),
            1
          )
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
      console.log(data, 'ddddaaaa')

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
