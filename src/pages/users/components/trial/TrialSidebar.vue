<!--
 * @Descripttion: 体验课左侧快捷切换
 * @version: 2.1.0
 * @Author: YangJiyong
 * @Date: 2020-06-28 11:20:19
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-28 23:09:58
-->
<template>
  <div class="trial-list-sidebar">
    <el-tree
      :data="treeDataList"
      :props="defaultProps"
      current-node-key="user-0"
      node-key="id"
      default-expand-all
      highlight-current
      @node-click="handleNodeClick"
    ></el-tree>

    <!-- button -->
    <div class="toggle-btn" @click="handleToggle">
      <!-- open -->
      <i class="el-icon-arrow-left" v-if="isSidebarOpen"></i>
      <!-- close -->
      <i class="el-icon-arrow-right" v-else></i>
    </div>

    <!-- 新增自定义人群组 -->
    <handle-drawer
      :drawer="showDrawer"
      :active-type="currentGroupType"
      :key="now"
      :current-group="currentNode"
      :search-params="advanceSearchParams"
      @close="handleCloseDrawer"
      @advanced-search="handleAdvancedSearch"
      ref="drawer"
    />
  </div>
</template>

<script>
import { deepClone } from '@/utils/index'
import {
  todayTimestamp,
  tomorrowTimestamp,
  withinAnHour,
  getDaysTimestamp
} from '../../utils'
// import ShowFollowInfo from './ShowFollowInfo.vue'
import HandleDrawer from './HandleDrawer.vue'
export default {
  components: {
    // ShowFollowInfo,
    HandleDrawer
  },
  props: {
    todayTotal: {
      type: [String, Number],
      default: 0
    },
    tomorrowTotal: {
      type: [String, Number],
      default: 0
    },
    // 高级搜索时显示 drawer
    searchDrawer: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    treeDataList() {
      const track = {
        label: '待跟进学员',
        children: [
          {
            id: 'track-today',
            label: `今日待跟进(${this.todayTotal})`
          },
          {
            id: 'track-tomorrow',
            label: `明日待跟进(${this.tomorrowTotal})`
          }
        ]
      }
      return [...this.treeList, track]
    }
  },
  data() {
    return {
      timer: null,
      now: null,
      isSidebarOpen: true,
      showMore: false,
      showMenu: false,
      currentNodeId: '',
      currentNode: {},
      hoverNode: {},
      currentExpression: {},
      showFollowDialog: false,
      groupFollow: '', // 当前群组跟进策略
      showDrawer: false, // 显示增加或编辑群组抽屉
      currentGroupType: '', // 操作的群组类型
      moreList: [],
      advanceSearchParams: {},
      sidebarParams: {},
      treeList: [
        {
          label: '学员',
          children: [
            {
              id: 'user-0',
              label: '全部学员'
            },
            {
              id: 'user-1',
              label: '未转化学员'
            },
            {
              id: 'user-2',
              label: '已转化学员'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  methods: {
    handleNodeClick(data) {
      console.log(data)
      const { id = '' } = data
      if (!id) return
      /**
       * case 0:
          case 1:
          case 2:
            item.user_status_name = '未转化'
            break
          case 3:
          case 4:
            item.user_status_name = '已购月课'
            break
          case 5:
          case 6:
          case 7:
            item.user_status_name = '已购年课'
            break
          case 8:
            item.user_status_name = '注销失效'
            break
          case 9:
          case 10:
            item.user_status_name = '已购季度课'
            break
          case 11:
          case 12:
            item.user_status_name = '已购半年课'
            break
       */
      console.log(id)
      const today = todayTimestamp()
      const tomorrow = tomorrowTimestamp()

      let param = {}
      switch (id) {
        // 全部学员
        case 'user-0':
          // param = { user_status: { gte: 0 } }
          param = {}
          break
        // 未转化学员
        case 'user-1':
          param = { user_status: { lte: 2 } }
          break
        // 已转化学员
        case 'user-2':
          param = { user_status: { gte: 3 } }
          break
        // track-today
        case 'track-today':
          param = { today, is_track: 1 }
          break
        // track-tomorrow
        case 'track-tomorrow':
          param = { today: tomorrow, is_track: 1 }
          break
        // 全部学员
        default:
          param = { user_status: { gte: 0 } }
          break
      }

      console.log(param)

      this.$emit('filter', param)
    },

    // toggle
    handleToggle() {
      this.isSidebarOpen = !this.isSidebarOpen
      this.$emit('toggle', this.isSidebarOpen)
    },

    // TODO：优化
    handleCloseDrawer(status) {
      this.showDrawer = false
      this.timer = setTimeout(() => {
        this.currentGroupType = ''
        if (status) {
          this.currentNode.expression = status
          // this.getAllFollowGroup()
          // this.getAllFollowGroup('DEPARTMENT')
        }
        clearTimeout(this.timer)
      }, 500)
    },

    // 高级搜索
    handleAdvancedSearch(res) {
      console.log(res, '高级搜索条件')
      if (!res) return
      const expressionObj = deepClone(res || {})
      this.advanceSearchParams = expressionObj
      const param = this.formatGroupExpression(expressionObj)
      console.log(param)
      // 高级筛选与当前群组条件合并
      const ex = deepClone(this.sidebarParams)
      const currentParam = Object.assign(ex, param)
      this.$emit('filter', currentParam)
    },

    // 选中具体的自定义人群组后，格式化条件对象
    formatGroupExpression(expression = {}) {
      const group = deepClone(expression)
      console.log(group, 'expression')
      const params = {}
      /**
       * TODO:
       * 1. 活跃行为的时间转化格式
       * 2. 购系统课格式转化
       * 3. 城市
       * 4. 盒子物流状态
       */
      const {
        user_status: userStatus,
        last_complete_time: lastCompleteTime,
        last_join_time: lastJoinTime,
        last_login_time: lastLoginTime,
        express_status: expressStatus,
        city
      } = group
      // 系统课转化 userStatus是数组 ['0','2','3']的组合
      if (userStatus) {
        const arr = []
        // 未转化
        if (userStatus.includes('0')) {
          // group.user_status = { lte: 2 }
          arr.push(...[0, 1, 2])
        }
        // 已购半年课
        if (userStatus.includes('2')) {
          // group.user_status = { gte: 11, lte: 12 }
          arr.push(...[11, 12])
        }
        // 已购年课
        if (userStatus.includes('3')) {
          // group.user_status = { gte: 5, lte: 7 }
          arr.push(...[5, 6, 7])
        }
        group.user_status = arr
      }

      // 活跃行为的时间转化格式
      if (lastCompleteTime) {
        const complete = this.formatDate('last_complete_time', lastCompleteTime)
        Object.assign(group, complete)
      }
      if (lastJoinTime) {
        const join = this.formatDate('last_join_time', lastJoinTime)
        Object.assign(group, join)
      }
      if (lastLoginTime) {
        const login = this.formatDate('last_login_time', lastLoginTime)
        Object.assign(group, login)
      }

      // 城市 - mobile_province
      if (city) {
        const provinceArr = []
        const cityArr = []
        const mobileProvince = JSON.parse(city)
        const { level, data } = mobileProvince
        data.forEach((item) => {
          if (level > 0) {
            if (!provinceArr.includes(item[0])) provinceArr.push(item[0])
          }
          if (level > 1) {
            if (!cityArr.includes(item[1])) cityArr.push(item[1])
          }
        })
        group['mobile_province.keyword'] = provinceArr
        group['mobile_city.keyword'] = cityArr
        delete group.city
      }

      /**
       * 盒子物流 无地址：[0], 未送达：[1,2,4,5,6,7,8,9], 已送达 [3]
       * 
       * 0: '无地址',
          6: '待审核',
          1: '待发货',
          2: '已发货',
          3: '已完成',
          9: ' 退款，暂停发货',
          '4,5,7,8': '异常物流'
       */
      if (expressStatus && expressStatus.length > 0) {
        const express = expressStatus.map((item) => item.split(','))
        const arr = []
        for (const item of express) {
          arr.push(...item)
        }
        group.express_status = arr
      }

      Object.assign(params, group)

      return params
    },

    // 活跃行为的时间转化格式 type: hour-1小时内, today-当天, day-近两天, custom-自定义
    formatDate(key, type) {
      if (!key || !type) return {}
      if (type === 'hour') {
        return withinAnHour(key)
      }

      if (type === 'today') {
        const today = todayTimestamp()
        const tomorrow = tomorrowTimestamp()
        return { [`${key}`]: { gte: today, lt: tomorrow } }
      }

      if (type === 'day') {
        const yestoday = getDaysTimestamp(-1)
        const today = getDaysTimestamp(1)
        console.log(yestoday)

        return { [`${key}`]: { gte: yestoday, lt: today } }
      }

      if (type && Object.prototype.toString.call(type) === '[object Object]') {
        return { [`${key}`]: type }
      }
    },

    resetDrawer() {
      this.now = Date.now()
      this.advanceSearchParams = null
    }
  }
}
</script>

<style lang="scss" scoped>
.trial-list-sidebar {
  position: relative;
  width: 130px;
  margin-right: 10px;
  padding-top: 10px;
  background-color: #fff;
  .toggle-btn {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: rgba(221, 221, 221, 0.7);
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      background-color: rgba(221, 221, 221, 1);
    }
  }

  ::v-deep {
    .el-tree > .el-tree-node > .el-tree-node__content .el-tree-node__label {
      font-weight: 700;
    }
    .el-tree-node__label {
      font-size: 12px;
    }
  }
}
</style>
