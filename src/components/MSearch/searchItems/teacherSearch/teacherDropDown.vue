<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-22 15:21:56
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
        :value="item.id"
      >
      </el-option>
    </el-select>
    <!-- 销售等级 -->
    <el-select
      v-model="sellerLevelData"
      class="item-style"
      clearable
      v-if="sellerLevelName"
      multiple
      size="mini"
      placeholder="选择销售等级"
      @change="sellerLevelChange"
    >
      <el-option
        v-for="item in sellerLevelList"
        :key="item.level"
        :label="item.levelName"
        :value="item.level"
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
      default: 'status'
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
    // 销售等级
    sellerLevelName: {
      type: String,
      default: 'sellerLevel'
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
        { label: '在职', value: '0' },
        { label: '离职', value: '1' }
      ],
      // 登陆状态
      landingList: [
        { label: '允许', value: '0' },
        { label: '禁止', value: '1' }
      ],
      // 职务列表
      positionList: [],
      // 销售等级
      sellerLevelList: [
        { label: '1级社群销售', value: 1 },
        { label: '2级社群销售', value: 2 },
        { label: '3级社群销售', value: 3 },
        { label: '新兵营', value: 0 }
      ],
      // 职级value
      rankData: null,
      // 入职状态value
      inductionData: '0',
      // 登陆状态value
      landingData: null,
      // 职务value
      positionData: null,
      // 销售等级value
      sellerLevelData: null
    }
  },
  async created() {
    // 职级
    this.getSellLevel()
    await this.getrank()
    await this.getSup()
  },
  methods: {
    // 获取销售等级
    async getSellLevel(params) {
      try {
        const { payload = [] } = await this.$http.Operating.getSellLevel(params)

        this.sellerLevelList = payload
      } catch (err) {}
    },
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
      this.$emit('rankCallBack', data ? { [this.rankName]: this.rankData } : '')
    },
    // 入职状态
    inductionChange(data) {
      this.$emit(
        'inductionCallBack',
        data.length > 0 ? { [this.inductionName]: this.inductionData } : ''
      )
    },
    // 登陆状态
    landingChange(data) {
      this.$emit(
        'landingCallBack',
        data.length > 0 ? { [this.landingName]: this.landingData } : ''
      )
    },
    // 职务
    positionChange(data) {
      this.$emit(
        'positionCallBack',
        data.length > 0 ? { [this.positionName]: this.positionData } : ''
      )
    },
    // 销售等级
    sellerLevelChange(data) {
      this.$emit(
        'sellerLevelCallBack',
        data.length > 0 ? { [this.sellerLevelName]: this.sellerLevelData } : ''
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
