<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: shasen
 * @Date: 2021-01-12 11:40:19
 * @LastEditors: shasen
 * @LastEditTime: 2021-01-12 11:40:19
-->
<template>
  <div class="behavior-locus">
    <!-- 搜索 -->
    <header class="header-statistics">
      <el-form :inline="true">
        <el-form-item label="行为类型:" class="formItem">
          <el-radio-group
            v-model="action_type"
            size="mini"
            @change="handleActionType"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="(item, index) in userBehaviorList"
              :key="index"
              :label="item.id"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行为时间:" class="formItem">
          <date-down-quick-select
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            name="action_time"
            :slect-show="false"
            :quick-btn="['day', 'yesterday', 'week', 'month']"
            :key="0"
            @result="getBehaviorTime('action_time', arguments)"
          >
          </date-down-quick-select>
        </el-form-item>
      </el-form>
    </header>

    <!-- table -->
    <section
      ref="tableRef"
      class="table-container"
      v-loading="flags.tLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="玩命加载中"
    >
      <ele-table
        :tableHeight="tableHeight"
        :tableSize="'small'"
        :dataList="tableData"
        :size="tabQuery.size"
        :page="tabQuery.page"
        :total="totalElements"
        :showAllTotalNum="true"
        :headerRowClasFn="headerRowClasFn"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column label="行为类型" min-width="120" align="center">
          <template slot-scope="scope">
            {{ scope.row.action_type_text ? scope.row.action_type_text : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="行为内容" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.action_type_text }}&nbsp;</span>&nbsp;
            <span v-if="scope.row.course_title"
              >《{{ scope.row.course_title }}》&nbsp;</span
            >&nbsp;
            <span>
              {{ scope.row.device_model ? scope.row.device_model : '-' }}</span
            >
          </template></el-table-column
        >
        <el-table-column label="行为时间" min-width="120" align="center">
          <template slot-scope="scope">
            {{
              scope.row.action_time && scope.row.action_time !== '0'
                ? formatDate(scope.row.action_time)
                : '-'
            }}
          </template></el-table-column
        >
      </ele-table>
    </section>
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
import { formatData } from '@/utils/index'
import DateDownQuickSelect from '@/components/MSearch/searchItems/dateDownQuickSelect.vue'
export default {
  name: 'behaviorLocus',
  props: {},
  components: {
    EleTable,
    DateDownQuickSelect
  },
  data() {
    return {
      studentId: '',
      totalElements: 0,
      tabQuery: {
        size: 20,
        page: 1
      },
      flags: {
        tLoading: false,
        studyWeeklyFlag: false
      },
      tableData: [],
      totalConut: {},
      tableHeight: 'auto',
      userBehaviorList: [],
      action_type: '',
      search_params: {}
    }
  },
  computed: {},
  created() {
    this.getActionTypeList()
    this.studentId = this.$route.params.id
    Object.assign(this.search_params, { uid: this.studentId })
    console.log(this.search_params, '------')
  },
  mounted() {
    this.initPage()
  },
  watch: {},
  methods: {
    // init列表
    initPage() {
      this.flags.tLoading = true
      this.$http.Statistics.UserBehaviorLogPage(
        this.search_params,
        this.tabQuery.page
      )
        .then((res) => {
          console.log(res, 'res')
          const payload = res && res.data && res.data.UserBehaviorLogPage
          if (payload) {
            this.totalElements = +payload.totalElements
            this.tableData = payload.content
          }
          this.flags.tLoading = false
        })
        .catch(() => {
          this.flags.tLoading = false
        })
    },
    // 行为类型
    handleActionType(value) {
      console.log(value)
      if (value) {
        const arr = value.toString().split('')
        Object.assign(this.search_params, { action_type: arr })
      } else {
        delete this.search_params.action_type
      }
      this.tabQuery.page = 1
      this.initPage()
    },
    // 行为时间
    getBehaviorTime(key, res) {
      console.log(key, res)
      if (res[0].action_time) {
        Object.assign(this.search_params, { action_time: res[0].action_time })
      } else {
        delete this.search_params.action_time
      }
      this.tabQuery.page = 1
      this.initPage()
    },
    // 获取行为轨迹
    getActionTypeList() {
      this.$http.Statistics.actionTypeList().then((res) => {
        const _data = res.data.actionTypeList
        _data.forEach((item) => {
          item.label = item.name
          item.value = item.id.toString()
        })
        this.userBehaviorList = _data
      })
    },
    // 换页
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.initPage()
    },
    // 时间转化
    formatDate(date, flag = 's') {
      return formatData(date, flag)
    },
    formatData2(date) {
      return formatData(date)
    },
    // 自定义thead样式
    headerRowClasFn() {
      return 'header-row-class'
    }
  }
}
</script>

<style lang="scss" scoped>
.behavior-locus {
  padding: 10px;
  .header-statistics {
    display: flex;
    align-items: center;
    padding: 7px 0;
    & > .item {
      margin-right: 30px;
      color: #444;
    }
  }

  .table-container {
    margin-top: 10px;
  }
  .mytable {
    /deep/ .header-row-class th {
      background: #f5f7fa;
      height: 50px;
      text-align: center;
    }
    /deep/ tr {
      background-color: #ffffff;
      height: 60px !important;
    }
    .timeout {
      color: #e4393c;
    }
    .scope-row {
      text-align: left;
      .orange-btn {
        display: inline-flex;
        background: #d8ba1c;
        color: #fff;
        line-height: 16px;
        padding: 0 3px;
        border-radius: 2px;
      }
      .add {
        background: mediumseagreen;
        color: #fff;
        padding: 0px 8px;
        line-height: 16px;
        border-radius: 1px;
        margin-left: 10px;
      }
      .look {
        cursor: pointer;
        color: #2a75ed;
        margin-left: 7px;
      }
    }
  }
}
</style>
