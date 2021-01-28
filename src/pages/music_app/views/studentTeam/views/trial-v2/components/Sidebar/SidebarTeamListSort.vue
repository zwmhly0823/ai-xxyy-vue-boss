<!--
 * @Descripttion: sidebar 班级列表排序选项
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-03 11:55:26
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-12 17:03:01
-->
<template>
  <div class="team-sort">
    班级排序：<el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ currentSortText }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown" class="team-sort-dropdown">
        <el-dropdown-item
          :class="{ active: item.value === currentSort }"
          :command="item.value"
          v-for="item in sortList"
          :key="item.value"
          >{{ item.text }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    // 状态 : 0-待上课，1-上课中，2-已完课
    status: {
      type: String,
      default: '0'
    }
  },
  computed: {
    sortList() {
      return this.sortData[this.status]
    },
    currentSortText() {
      const sort = this.sortList.filter(
        (item) => item.value === this.currentSort
      )
      return sort[0].text
    }
  },
  data() {
    return {
      // 当前选中项
      currentSort: 'ctime',
      sortData: {
        // 待上课
        '0': [
          {
            value: 'ctime',
            text: '按创建时间'
          },
          {
            value: 'enrolled',
            text: '按班级人数'
          },
          {
            value: 'added_wechat_rate',
            text: '按好友率'
          },
          {
            value: 'follow_rate',
            text: '按公众号率'
          },
          {
            value: 'open_app_rate',
            text: '按APP登录率'
          },
          {
            value: 'delivered_start_rate',
            text: '按盒子发货率'
          },
          {
            value: 'delivered_sign_rate',
            text: '按盒子签收率'
          },
          {
            value: 'order_conversion_rate',
            text: '按转化率'
          }
        ],
        // 上课中
        '1': [
          {
            value: 'ctime',
            text: '按创建时间'
          },
          {
            value: 'enrolled',
            text: '按班级人数'
          },
          {
            value: 'today_complete_course_rate',
            text: '今日完课率'
          },
          {
            value: 'today_join_course_rate',
            text: '今日参课率'
          },
          {
            value: 'today_open_app_rate',
            text: '今日登陆app'
          },
          {
            value: 'order_conversion_rate',
            text: '按转化率'
          }
        ],
        // 已完课
        '2': [
          {
            value: 'ctime',
            text: '按创建时间'
          },
          {
            value: 'enrolled',
            text: '按班级人数'
          },
          {
            value: 'order_conversion_rate',
            text: '按转化率'
          }
        ]
      }
    }
  },
  methods: {
    handleCommand(command) {
      // console.log(command)
      this.currentSort = command
      // 倒序 - 注意需要.keywrod的情况
      const sort = { [`${command}`]: 'desc' }
      this.$emit('sort', sort)
    }
  }
}
</script>

<style lang="scss" scoped>
.team-sort {
  margin-bottom: 10px;
  font-size: 12px;
  ::v-deep {
    .el-dropdown {
      font-size: inherit;
      color: #2a75ed;
      &-link {
        cursor: pointer;
      }
    }
  }
  &-dropdown {
    .active {
      color: #2a75ed;
    }
    ::v-deep {
      .el-dropdown-menu__item {
        font-size: 12px;
      }
    }
  }
}
</style>
