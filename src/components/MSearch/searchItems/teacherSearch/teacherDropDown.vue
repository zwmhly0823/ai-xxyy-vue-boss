<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-13 17:05:48
 -->
<template>
  <div class="search-item small">
    <!-- 职级 -->
    <el-select
      v-model="rankData"
      class="item-style"
      v-if="rankName"
      clearable
      size="mini"
      placeholder="职级"
      @change="rankChange"
    >
      <el-option
        v-for="item in rankList"
        :key="item.stage"
        :label="item.stage_text"
        :value="item.stage"
      >
      </el-option>
    </el-select>
    <!-- 入职状态 -->
    <el-select
      v-model="inductionData"
      class="item-style"
      clearable
      v-if="inductionName"
      size="mini"
      placeholder="入职状态"
      @change="inductionChange"
    >
      <el-option
        v-for="item in inductionList"
        :key="item.id"
        :label="item.name"
        :value="addSupS ? item.name : item.id"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="landingData"
      class="item-style"
      clearable
      v-if="landingName"
      size="mini"
      placeholder="登陆状态"
      @change="landingChange"
    >
      <el-option
        v-for="item in landingList"
        :key="item.id"
        :label="item.name"
        :value="item.name"
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
      placeholder="选择状态"
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
export default {
  props: {
    // 职级
    rankName: {
      type: String,
      default: 'rank'
    },
    // 入职状态
    inductionName: {
      type: String,
      default: 'induction'
    },
    landingName: {
      type: String,
      default: 'landing'
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
      // 职级列表
      rankList: [],
      // 入职状态列表
      inductionList: [],
      // 登陆状态
      landingList: [],
      // 职级value
      rankData: null,
      // 入职状态value
      inductionData: null,
      levelData: null
    }
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
    // 职级
    await this.getrank()
    await this.getSup()
    await this.getLevel()
  },
  methods: {
    // 职级
    async getrank() {
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
          this.rankList = res.data.teamStageList
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
    // 职级
    rankChange(data) {
      this.$emit(
        'rankCallBack',
        data.length > 0 ? { [this.rankName]: this.rankData } : ''
      )
    },
    // 入职状态
    inductionChange(data) {
      this.$emit(
        'inductionCallBack',
        data.length > 0 ? { [this.inductionData]: this.inductionData } : ''
      )
    },
    // 登陆状态
    landingChange(data) {
      this.$emit(
        'landingCallBack',
        data.length > 0 ? { [this.landingName]: this.landingData } : ''
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
