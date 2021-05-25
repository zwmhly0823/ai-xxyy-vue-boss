<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-20 21:13:24
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-20 21:13:24
 * @Description: 搜索系统课班级名
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="teamName"
      filterable
      remote
      :reserve-keyword="true"
      size="mini"
      clearable
      :placeholder="teamnameType === '0' ? '体验课班级' : '系统课班级'"
      :remote-method="getTeam"
      :loading="loading"
      @change="onChange"
      @focus="onFocus"
    >
      <el-option
        v-for="item in teamList"
        :key="item.id"
        :label="item.team_name"
        :value="item.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { courseLevelReplace } from '@/utils/supList.js'
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    // 需要查询的类型
    teamnameType: {
      type: String,
      default: '1', // 0：体验课。 >0系统课
    },
  },

  data() {
    return {
      loading: false,
      teamName: '',
      teamList: [],
      list:[],
      courseLevelReplace,
    }
  },
  created() {
    this.getTeam()
  },
  watch: {
    teamName(newValue, oldValue) {
      if (newValue || newValue == '') {
        this.getTeam(newValue)
      }
    },
  },
  methods: {
    getTeam(query) {
      // if (query !== '') {
      this.loading = true
      let q = {}
      if (query) {
        Object.assign(q, {
          teamName: query,
        })
      }
      this.$http.Team.getSearchClassName(q)
        .then((res) => {
          this.teamList = res.data.StudentTrialTeamStatisticsPage.content || []
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      // }
    },
    // 获取选中的
    onChange(data) {
      let list = this.teamList.filter((item, index) => {
        if (item.id == data) {
          return this.teamList
        }
      })
      this.$emit('result', data ? list : '')
    },
    // 清空
    onClear(val) {
      this.getTeam('')
    },
    onFocus() {
      if(!this.teamName) {
        this.getTeam()
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.search-item {
  &.small {
    width: 140px !important;
  }
}
</style>
<style scoped>
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  right: 5px;
}
</style>
