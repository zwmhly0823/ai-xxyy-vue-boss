<!--
 * @Descripttion: 自定义table header多级排序。 TODO:公共组件
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-29 13:24:48
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-29 19:28:30
-->
<template>
  <el-dropdown
    class="classes-dropdown"
    size="small"
    trigger="click"
    placement="bottom-start"
    @command="handleDropdown"
  >
    <div class="sort-operate-box">
      <span>{{ label }}</span>
      <div class="sort-icon-arrow">
        <i
          class="el-icon-caret-top top-color"
          :class="{
            active:
              sortKeys[sortActive] !== 'asc' &&
              Object.keys(sortKeys).includes(sortActive)
          }"
        ></i>
        <i
          class="el-icon-caret-bottom bottom"
          :class="{
            active:
              sortKeys[sortActive] === 'asc' &&
              Object.keys(sortKeys).includes(sortActive)
          }"
        ></i>
      </div>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :command="key"
        v-for="(item, key) in sortMaps"
        :key="key"
      >
        <div class="sort-operate-box">
          <span>{{ item.text }}</span>
          <div class="sort-icon-arrow">
            <i
              class="el-icon-caret-top top-color"
              :class="{
                active: sortKeys[`${key}`] != 'asc' && sortActive == key
              }"
            ></i>
            <i
              class="el-icon-caret-bottom bottom"
              :class="{
                active: sortKeys[`${key}`] == 'asc' && sortActive == key
              }"
            ></i>
          </div>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    sortChange: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      // sortKeys: {
      //   // 参课节数
      //   join_course_count: 'desc',
      //   // 参课最近操作时间
      //   last_join_time: 'desc',
      //   // 完课节数
      //   complete_course_count: 'desc',
      //   // 完课最近操作时间
      //   last_complete_time: 'desc',
      //   task_count: 'desc',
      //   listen_comment_count: 'desc',
      //   questionnaire_count: 'desc'
      //   // 预测转化
      //   // 'bi_label.keyword': 'desc'
      // },
      label: '学习概况',
      sortActive: '',
      sortMaps: {
        open_app_count: {
          sort: 'desc',
          text: '打开APP'
        },
        join_course_count: {
          sort: 'desc',
          text: '参课'
        },
        complete_course_count: {
          sort: 'desc',
          text: '完课'
        },
        task_count: {
          sort: 'desc',
          text: '作品'
        },
        comment_count: {
          sort: 'desc',
          text: '点评'
        },
        listen_comment_count: {
          sort: 'desc',
          text: '听点评'
        }
      },
      sortKeys: {}
    }
  },
  computed: {
    sortObj() {
      const obj = {}
      const { sortMaps } = this
      for (const key in sortMaps) {
        if (Object.keys(sortMaps).includes(key)) {
          const item = sortMaps[key]
          Object.assign(obj, { [`${key}`]: item.sort || 'desc' })
        }
      }
      return obj
    }
  },
  mounted() {
    this.sortKeys = this.sortObj
  },
  methods: {
    // 参课的下拉排序
    handleDropdown(command) {
      console.log(command)
      this.sortRules(command)
    },
    // 改变排序规则
    sortRules(sortKey) {
      if (this.sortActive) {
        this.sortKeys[this.sortActive] =
          this.sortKeys[this.sortActive] === 'asc' ? 'desc' : 'asc'
      }
      this.sortActive = sortKey
      const res = {
        [`${this.sortActive}`]: this.sortKeys[this.sortActive]
      }
      this.$root.$emit('handle-sort', res)
      this.sortChange && this.sortChange(res)
      console.log(this.sortActive, this.sortKeys[this.sortActive])
    }
  }
}
</script>

<style lang="scss" scoped>
.sort-operate-box {
  position: relative;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  .sort-icon-arrow {
    display: inline-block;
    position: relative;
    top: -2px;
    .top {
      position: absolute;
      bottom: 0;
    }
    .active {
      color: #2a75ed;
    }
    .top-color {
      position: absolute;
      bottom: 0;
    }
    .bottom {
      position: absolute;
      top: -6px;
    }
    .bottom-color {
      position: absolute;
      top: -6px;
    }
  }
}
</style>
