<!--
 * @Descripttion: 体验课左侧快捷切换
 * @version: 2.1.0
 * @Author: YangJiyong
 * @Date: 2020-06-28 11:20:19
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-01 20:34:45
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
  </div>
</template>

<script>
import { todayTimestamp, tomorrowTimestamp } from '../../utils'
export default {
  props: {
    todayTotal: {
      type: [String, Number],
      default: 0
    },
    tomorrowTotal: {
      type: [String, Number],
      default: 0
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
      isSidebarOpen: true,
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
