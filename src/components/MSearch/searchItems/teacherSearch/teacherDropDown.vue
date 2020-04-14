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
        :key="item.id"
        :label="item.name"
        :value="item.id"
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
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <!-- 登陆状态 -->
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
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <!-- 职务 -->
    <el-select
      v-model="positionData"
      class="item-style"
      clearable
      v-if="positionName"
      multiple
      size="mini"
      placeholder="选择职务"
      @change="positionChange"
    >
      <el-option
        v-for="item in positionList"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    // 职级
    rankName: {
      type: String,
      default: 'rank_no'
    },
    // 入职状态
    inductionName: {
      type: String,
      default: 'induction_no'
    },
    // 登陆状态
    landingName: {
      type: String,
      default: 'landing_no'
    },
    // 职务
    positionName: {
      type: String,
      default: 'position_no'
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
      inductionList: [
        { label: '在职', value: 'TENURE' },
        { label: '离职', value: 'LEAVE' }
      ],
      // 登陆状态
      landingList: [
        { label: '允许', value: 'YES' },
        { label: '禁止', value: 'NO' }
      ],
      // 职务列表
      positionList: [],
      // 职级value
      rankData: null,
      // 入职状态value
      inductionData: null,
      // 登陆状态value
      landingData: null,
      // 职务value
      positionData: null
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
  },
  methods: {
    // 职级
    async getrank() {
      this.$http.Teacher.TeacherRankList().then((res) => {
        const rank = res.data.TeacherRankList || []
        this.rankList = _.sortBy(rank, 'id')
      })
    },

    // 职务
    async getSup() {
      this.$http.Teacher.getTeacherDutyList().then((res) => {
        this.positionList = res.data.TeacherDutyList
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
        data.length > 0 ? { [this.landingData]: this.landingData } : ''
      )
    },
    // 职务
    positionChange(data) {
      this.$emit(
        'positionCallBack',
        data.length > 0 ? { [this.positionData]: this.positionData } : ''
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
