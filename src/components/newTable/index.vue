<!--
 * @Author: zhaowenming
 * @Date: 2021-4-23 14:47:02
 * @LastEditors: zhaowenming
 * @LastEditTime: 2021-4-24 15:23:02
 * @Description: 封装el-table
 -->

<template>
  <div class="base-table-container">
    <el-row>
      <el-col :span="24">
        <slot name="button-slot"></slot>
        <el-table
          v-loading="loading"
          :data="list"
          size="small"
          ref="baseTable"
          @selection-change="handleSelectionChange"
          @sort-change="sortChange"
          :max-height="tableHeight"
          v-bind="$attrs"
        >
          <template v-for="(column, index) in columns">
            <slot name="front-slot"></slot>
            <!-- 序号 -->
            <el-table-column
              :key="index"
              v-if="column.type === 'selection'"
              label="全选"
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <!-- 复选框 -->
            <el-table-column
              :key="index"
              v-else-if="column.type === 'index'"
              type="index"
              :index="continuousIndex"
              width="60"
              label="序号"
              align="center"
            ></el-table-column>
            <!-- 具体内容 -->
            <el-table-column
              :key="index"
              v-else
              :align="column.align ? column.align : 'center'"
              :fixed="column.fixed"
              :label="column.title"
              :prop="column.key"
              :width="column.width"
              :sortable="column.sort ? 'sortable' : false"
              :show-overflow-tooltip="column.showOverflowTooltip"
            >
              <template slot-scope="scope">
                <!-- 仅仅显示文字 -->
                <label v-if="!column.hidden">
                  <!-- 如果hidden为true的时候 那么当前格可以不显示，可以选择显示自定义的slot-->
                  <!-- 操作按钮 -->
                  <label v-if="column.type === 'operate'">
                    <el-button
                      v-for="(operate, index) in column.operates"
                      :key="index"
                      :disabled="
                        operate.escape !== undefined
                          ? operate.escape(scope.row).disabled
                          : scope.row.payStatus == 0 &&
                            operate.emitKey != 'detailsClick'
                          ? true
                          : false
                      "
                      @click="handleClick(operate, scope.row)"
                      type="text"
                      size="small"
                      >{{
                        operate.escape !== undefined && operate.type != 0
                          ? operate.escape(scope.row)
                          : operate.name
                      }}</el-button
                    >
                  </label>
                  <!-- 文字内容 可转码 -->
                  <span v-else-if="column.type === 'link'">
                    <span
                      style="color: #409eff; cursor: pointer"
                      @click="handleClick(column, scope.row)"
                      >{{
                        column.escape !== undefined
                          ? column.escape(scope.row)
                          : scope.row[column.key]
                      }}</span
                    >
                  </span>
                  <!--img-->
                  <label v-else-if="column.type === 'img'">
                    <img
                      :src="
                        scope.row[column.key]
                          ? scope.row[column.key]
                          : '/static/avatar.png'
                      "
                      style="width: 100%"
                    />
                  </label>
                  <!--多个字段显示-->
                  <label v-else-if="column.type === 'moreKey'">
                    <extend-user-info
                      :user="scope.row.userInfo"
                      :sys-label="scope.row.sys_label"
                      :is-head="true"
                    />
                  </label>
                  <label v-else-if="column.type === 'classKey'">
                    <span
                      v-if="
                        scope.row.trailTeams &&
                        scope.row.trailTeams.length === 0
                      "
                    ></span>
                    <div>
                      <div
                        v-for="(item, index) in scope.row.trailTeams"
                        :key="index"
                      >
                        <div>
                          <span>{{
                            (item.teacher_info && item.teacher_info.realname) ||
                            '--'
                          }}</span>
                          <span class="primary-text" @click="openTeam(item)">{{
                            `(${item.team_name})`
                          }}</span>
                        </div>
                        <div>
                          {{
                            `${
                              (item.teacher_info &&
                                item.teacher_info.departmentInfo &&
                                item.teacher_info.departmentInfo.name) ||
                              '--'
                            }`
                          }}
                        </div>
                      </div>
                    </div>
                  </label>
                  <!-- 字段为数组的情况 -->
                  <span v-else>
                    <el-tooltip
                      v-if="isShow(scope.row, column)"
                      class="awidth"
                      :style="{ width: column.width }"
                      effect="dark"
                      :content="
                        column.escape !== undefined
                          ? column.escape(scope.row)
                          : scope.row[column.key].toString()
                      "
                      placement="top"
                      :enterable="false"
                    >
                      <span>{{
                        column.escape !== undefined
                          ? column.escape(scope.row)
                          : scope.row[column.key]
                      }}</span>
                    </el-tooltip>
                  </span>
                </label>
                <!-- 使用slot的情况下 -->
                <label
                  v-if="column.slot"
                  class="awidth"
                  :style="{ width: column.width }"
                >
                  <!-- 具名slot -->
                  <slot
                    v-if="column.slot"
                    :name="column.slot"
                    :scope="scope"
                  ></slot>
                </label>
              </template>
            </el-table-column>
          </template>
          <!--默认的slot -->
          <slot></slot>
        </el-table>
        <m-pagination
          :current-page="pageNum"
          :page-count="pageSize"
          :total="total"
          @current-change="handleSizeChange"
          show-pager
          open="calc(100vw - 170px - 25px)"
          close="calc(100vw - 50px - 25px)"
        ></m-pagination>
      </el-col>
    </el-row>
  </div>
</template>


<script>
/**
 * @author zhaowenming
 * @todo 项目中基本使用表格
 * @property
 * list => 表格数据
 * columns: [ ==> 配置表格头
 *  key: => 渲染字段名称
 *  title: => 表头名称
 *  operates： => 操作数组 [
 *      name: 名称
 *      emitKey: 要emit出去的事件
 *  ]
 */

import MPagination from '@/components/MPagination/index.vue'
import { openBrowserTab, formatData } from '@/utils/index'
import ExtendUserInfo from '@/components/BaseUserInfo/Extend.vue'
export default {
  name: 'base-table',
  components: { MPagination, ExtendUserInfo },
  props: {
    // 核心数据
    list: {
      type: Array,
      default: () => [],
    },
    // columns
    columns: {
      type: Array,
      required: true,
      default: () => [],
    },

    showExportBtn: {
      type: Boolean,
      default: false,
    },
    paginationShow: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageNum: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    tableHeight: {
      type: Number,
      default: 580,
    },
  },
  data() {
    return {
      direction: '',
      sortName: '',
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.pageNum
      },
      set(val) {
        this.$emit('update:pageNum', val)
      },
    },
    pageSizes: {
      get() {
        return this.pageSize
      },
      set(val) {
        this.$emit('update:pageSize', val)
      },
    },
  },
  methods: {
    // 让index序号连续
    continuousIndex(index) {
      return index + (this.currentPage - 1) * this.pageSizes + 1
    },
    formatDate(date, flag = 's') {
      return formatData(date, flag)
    },
    // 点击班级名称，打开班级详情
    openTeam(row) {
      if (!row.id) return
      const teamId = row.id
      const teamType = row.team_type || '0'
      const typeUrl = teamType == 2 ? 'teamDetail' : 'teamTrialDetail'
      teamId && openBrowserTab(`/music_app/#/${typeUrl}/${teamId}/${teamType}`)
    },
    // 点击分页
    handleSizeChange(val) {
      console.log(val)
    },
    // 页码变化触发获取数据
    getList(obj) {
      this.$emit('getList', obj)
    },
    // 处理点击事件
    handleClick(action, data) {
      // emit事件
      this.$emit(`${action.emitKey}`, data)
    },
    // 选中变化
    handleSelectionChange(val) {
      this.$emit('changeSelect', val)
    },
    //排序
    sortChange(data) {
      console.log(data, '排序数据')
      let direction = 'DESC'
      if (data.order == 'ascending') {
        direction = 'ASC'
      }
      if (direction == this.direction && this.sortName == data.prop) {
        let obj = {
          sort: '',
          direction: '',
        }
        this.direction = ''
        this.$refs.baseTable.clearSort()
        this.$emit('sortChange', obj)
      } else {
        let obj = {
          sort: data.prop,
          direction: direction,
        }
        this.direction = direction
        this.$emit('sortChange', obj)
      }
      this.sortName = data.prop
    },
    clearSort() {
      this.direction = ''
      this.sortName = ''
      this.$refs.baseTable.clearSort()
    },
    isShow(key, value) {
      // return true;
      let data = value.escape !== undefined ? value.escape(key) : key[value.key]
      if (typeof data == 'number') {
        return true
      } else {
        return data
      }
    },
  },
}
</script>

<style scoped lang="scss">
.base-table-container {
  background: #fff;
  .table-title {
    display: flex;
    align-items: center;
    background: #d3dce6;
    height: 36px;
    padding-left: 20px;
    font-size: 14px;
    span {
      margin-left: 20px;
      font-size: 12px;
      color: #666;
    }
  }
  .awidth {
    width: 100%;
    height: 20px;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    left: -5px;
    right: -10px;
  }
}
.base-table-container.hidden {
  display: none;
}

.btn {
  margin: 0 0 20px 100%;
  transform: translateX(-100%);
}
</style>