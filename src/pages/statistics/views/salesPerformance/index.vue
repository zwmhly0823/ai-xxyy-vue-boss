<!--
 * @Descripttion: 销售过程转化分析
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-04-02 15:35:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-14 18:33:46
 -->
<template>
  <el-row type="flex" class="app-main height schedule-container">
    <el-col class="schedule-container-right">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <!-- 期状态 -->
          <div class="top-tabs">
            <div
              v-for="(statusInfo, index) in topStatus"
              :key="index"
              :class="{ active: index == btnIndex }"
              @click="top_tabs_click(index, statusInfo)"
            >
              {{ statusInfo.label }}
            </div>
          </div>
          <!-- 期标签页 -->
          <div class="tabs-operate">
            <div
              v-for="(tab, index) in priodTabs"
              :key="index"
              :class="{ active: index == tabIndex }"
              @click="priod_tabs_click(tab, index)"
            >
              <span
                >{{ tab.period_name
                }}<span v-if="btnIndex == 1 && hasLoadPeriod"
                  >({{ periodStatus[tab.status] || '' }})</span
                ></span
              >
            </div>
            <!-- 大于5个 TODO: -->
            <el-dropdown
              @command="handleCommand"
              class="activeCommand"
              :class="{ active: '6' == tabIndex }"
              v-if="priodTabsEnd.length"
            >
              <span class="el-dropdown-link">
                {{ selectName }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(tab, index) in priodTabsEnd"
                  :key="index"
                  :command="tab"
                  ><span
                    >{{ tab.period_name
                    }}<span v-if="btnIndex == 1"
                      >({{ periodStatus[tab.status] || '' }})</span
                    ></span
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 搜索 -->
          <div class="sear-container">
            <!-- TODO: -->
            <statictics-search
              @searchChange="searchChange"
              v-if="showSearch"
            ></statictics-search>
          </div>
          <!-- 数据统计 -->
          <p class="descripte" v-if="statisticsInfo">
            开课日期：
            <span class="label-val">
              {{ statisticsInfo.start_date || '-' }}
            </span>
            结课日期：
            <span class="label-val">
              {{ statisticsInfo.end_date || '-' }}
            </span>
            开课天数：
            <span class="label-val">
              {{ statisticsInfo.course_days || '-' }}天
            </span>
            <!-- 转化统计 -->
            <template v-if="activeName == 'conversion'">
              <span>总订单数：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.order_number || '-' }}
              </span>
              <span>总转化率：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.conversion_rate_total || '-' }}
              </span>
              <span>总金额：</span>
              <span class="for-light">
                {{ statisticsInfo.amount_total || '-' }}
              </span>
            </template>
            <!-- 参课统计数据统计 -->
            <template v-else-if="activeName == 'attendClass'">
              <span>本期总{{ despMap[activeName] }}人数：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.join_nums || '-' }}
              </span>
              <span>本期总{{ despMap[activeName] }}率：</span>
              <span class="label-val for-light">{{
                statisticsInfo.join_rate || '-'
              }}</span>
              <span>本日总{{ despMap[activeName] }}人数：</span>
              <span class="label-val for-light">{{
                statisticsInfo.now_join_nums || '-'
              }}</span>
              <span>本日总{{ despMap[activeName] }}率：</span>
              <span class="label-val for-light">{{
                statisticsInfo.now_join_rate || '-'
              }}</span>
            </template>
            <!-- 完课统计数据统计 -->
            <template v-else-if="activeName == 'finishClass'">
              <span>本期总{{ despMap[activeName] }}人数：</span>
              <span class="label-val for-light"
                >{{ statisticsInfo.complete_nums || '-' }}
              </span>
              <span>本期总{{ despMap[activeName] }}率：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.complete_rate || '-' }}
              </span>
              <span>本日总{{ despMap[activeName] }}人数：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.now_complete_nums || '-' }}
              </span>
              <span>本日总{{ despMap[activeName] }}率：</span>
              <span class="label-val for-light">
                {{ statisticsInfo.now_complete_rate || '-' }}
              </span>
            </template>
            <!-- 上传作品统计 -->
            <template v-else-if="activeName == 'uploadWorks'">
              <span>总上传作品：</span>
              <span class="label-val for-light">{{
                titleUpload.course_task_count
              }}</span>
              <span>总上传率：</span>
              <span class="label-val for-light">{{
                titleUpload.total_upload_rate
              }}</span>
              <span>人均作品：</span>
              <span class="label-val for-light">{{
                titleUpload.student_count
              }}</span>
            </template>
            <!-- 老师点评统计 -->
            <template v-else-if="activeName == 'teacherComments'">
              <span>总点评率：</span>
              <span class="label-val for-light">{{
                titlereviewStatistical.reviewProbability
              }}</span>
              <span>总点评收听率：</span>
              <span class="label-val for-light">{{
                titlereviewStatistical.listenTo
              }}</span>
            </template>
          </p>
          <!-- 表头 -->
          <div style="padding: 0 15px;">
            <el-tabs
              v-model="activeName"
              @tab-click="statisticsTypehandleClick"
            >
              <el-tab-pane label="转化统计" name="conversion"> </el-tab-pane>
              <!-- TODO: -->
              <el-tab-pane label="参课统计" name="attendClass"> </el-tab-pane>
              <el-tab-pane label="完课统计" name="finishClass"> </el-tab-pane>
              <el-tab-pane label="上传作品统计" name="uploadWorks">
              </el-tab-pane>
              <!-- <el-tab-pane label="老师点评统计" name="teacherComments">
              </el-tab-pane> -->
            </el-tabs>
          </div>
          <div class="tableInner" ref="tableInner"></div>
          <!-- 完课统计列表 -->
          <div
            class="orderStyle"
            v-if="tableDataAttend.length && activeName === 'finishClass'"
          >
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'mini'"
              :dataList="tableDataAttend"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column
                fixed
                label="难度级别"
                prop="sup"
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="120"
                align="center"
                prop="department_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="80"
                align="center"
                prop="teacher_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="85"
                prop="student_nums"
                align="center"
              ></el-table-column>
              <el-table-column align="center" label="总计" width="160" fixed>
                <el-table-column
                  fixed
                  label="总完课人数"
                  prop="total_complete_nums"
                  align="center"
                ></el-table-column>
                <el-table-column
                  fixed
                  label="总完课率"
                  prop="total_complete_rate"
                  align="center"
                ></el-table-column>
              </el-table-column>
              <!-- child-table-start -->
              <el-table-column
                align="center"
                v-for="(a, i) in tableDataChildAttend"
                :label="a.current_lesson"
                :key="i"
              >
                <el-table-column fixed label="当日完课人数" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                    >
                      {{ scope.row.completeArr[i].complete_nums }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="当日完课率" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                      >{{ scope.row.completeArr[i].complete_rate }}</span
                    >
                  </template>
                </el-table-column>
              </el-table-column>
            </ele-table>
          </div>
          <!-- 转换统计tab -->
          <div
            class="orderStyle"
            v-if="tableData.length && activeName == 'conversion'"
          >
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'mini'"
              :dataList="tableData"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column
                fixed
                label="难度级别"
                prop="sup"
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="120"
                align="center"
                prop="department"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="80"
                align="center"
                prop="teacher"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="85"
                prop="student_total"
                align="center"
              ></el-table-column>
              <el-table-column align="center" label="总计" fixed width="240">
                <el-table-column
                  label="订单数"
                  prop="order_total"
                  align="center"
                  fixed
                ></el-table-column>
                <el-table-column
                  label="转化率"
                  prop="conversion_total"
                  align="center"
                  fixed
                ></el-table-column>
                <el-table-column
                  label="总金额"
                  prop="amount_total"
                  align="center"
                  fixed
                ></el-table-column>
              </el-table-column>
              <!-- child-table-start -->
              <el-table-column
                align="center"
                v-for="(a, i) in tableDataChild"
                :label="a.weekday"
                :key="i"
              >
                <el-table-column fixed label="订单数" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.conversion_rate_daily).length &&
                          scope.row.conversion_rate_daily[i] &&
                          !scope.row.conversion_rate_daily[i].is_null
                      "
                    >
                      {{ scope.row.conversion_rate_daily[i].order_number }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="转化率" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.conversion_rate_daily).length &&
                          scope.row.conversion_rate_daily[i] &&
                          !scope.row.conversion_rate_daily[i].is_null
                      "
                    >
                      {{ scope.row.conversion_rate_daily[i].conversion }}
                    </span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="总金额" align="center"
                  ><template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.conversion_rate_daily).length &&
                          scope.row.conversion_rate_daily[i] &&
                          !scope.row.conversion_rate_daily[i].is_null
                      "
                    >
                      {{ scope.row.conversion_rate_daily[i].amount }}
                    </span>
                    <span v-else>--</span>
                  </template></el-table-column
                >
              </el-table-column>
            </ele-table>
          </div>
          <!-- 参课统计 table -->
          <div
            class="orderStyle"
            v-if="tableDataAttend.length && activeName == 'attendClass'"
          >
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'mini'"
              :dataList="tableDataAttend"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column
                fixed
                label="难度级别"
                prop="sup"
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="120"
                align="center"
                prop="department_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="80"
                align="center"
                prop="teacher_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="85"
                prop="student_nums"
                align="center"
              ></el-table-column>
              <el-table-column align="center" label="总计" width="160" fixed>
                <el-table-column
                  fixed
                  label="总参课人数"
                  prop="total_join_nums"
                  align="center"
                ></el-table-column>
                <el-table-column
                  fixed
                  label="总参课率"
                  prop="total_join_rate"
                  align="center"
                ></el-table-column>
              </el-table-column>
              <el-table-column
                align="center"
                v-for="(a, i) in tableDataChildAttend"
                :label="a.current_lesson"
                :key="i"
              >
                <el-table-column fixed label="当日参课人数" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                    >
                      {{ scope.row.completeArr[i].join_nums }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="当日参课率" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                    >
                      {{ scope.row.completeArr[i].join_rate }}
                    </span>
                  </template>
                </el-table-column>
              </el-table-column>
            </ele-table>
          </div>
          <!-- 上传作品统计 -->
          <div
            class="orderStyle"
            v-if="tableDataAttend.length && activeName === 'uploadWorks'"
          >
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'mini'"
              :dataList="tableDataAttend"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column
                fixed
                label="难度级别"
                prop="sup"
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="120"
                align="center"
                prop="department_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="80"
                align="center"
                prop="realname"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="85"
                prop="trial_course_count"
                align="center"
              ></el-table-column>
              <el-table-column align="center" label="总计">
                <el-table-column
                  fixed
                  label="总上传率"
                  prop="totalUpload"
                  align="center"
                ></el-table-column>
                <el-table-column
                  fixed
                  label="作品总数"
                  prop="totalNumbe"
                  align="center"
                ></el-table-column>
                <el-table-column
                  fixed
                  label="人均作品数"
                  prop="averageWorks"
                  align="center"
                ></el-table-column>
              </el-table-column>
              <!-- child-table-start -->
              <el-table-column
                align="center"
                v-for="(a, i) in tableDataChildAttend"
                :label="a.current_lesson"
                :key="i"
              >
                <el-table-column fixed label="上传人数" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                    >
                      {{
                        scope.row.completeArr[i].task_student_count
                          ? scope.row.completeArr[i].task_student_count
                          : '-'
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="上传率" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                      >{{ scope.row.completeArr[i].uploadRate }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column fixed label="作品总数" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i]
                      "
                      >{{
                        scope.row.completeArr[i].course_task_count
                          ? scope.row.completeArr[i].course_task_count
                          : '-'
                      }}</span
                    >
                    <span v-else>0</span>
                  </template>
                </el-table-column>
              </el-table-column>
            </ele-table>
          </div>
          <!-- 老师点评 -->
          <div
            class="orderStyle"
            v-if="tableDataAttend.length && activeName === 'teacherComments'"
          >
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'mini'"
              :dataList="tableDataAttend"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column
                fixed
                label="难度级别"
                prop="sup"
                width="70"
                align="center"
              ></el-table-column>
              <el-table-column
                fixed
                label="销售组"
                width="120"
                align="center"
                prop="department_name"
              ></el-table-column>
              <el-table-column
                fixed
                label="社群销售"
                width="80"
                align="center"
                prop="realname"
              ></el-table-column>
              <el-table-column
                fixed
                label="体验课学生"
                width="85"
                prop="trial_course_count"
                align="center"
              ></el-table-column>
              <!-- child-table-start -->
              <el-table-column
                align="center"
                v-for="(a, i) in tableDataChildAttend"
                :label="a.current_lesson"
                :key="i"
              >
                <el-table-column fixed label="点评数" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                    >
                      {{
                        scope.row.completeArr[i].comment_count
                          ? scope.row.completeArr[i].comment_count
                          : '-'
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column fixed label="点评率" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i] &&
                          !scope.row.completeArr[i].is_null
                      "
                      >{{ scope.row.completeArr[i].commentRate }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column fixed label="点评收听率" align="center">
                  <template slot-scope="scope">
                    <span
                      v-if="
                        Object.keys(scope.row.completeArr).length &&
                          scope.row.completeArr[i]
                      "
                      >{{ scope.row.completeArr[i].listenReview }}</span
                    >
                    <span v-else>0</span>
                  </template>
                </el-table-column>
              </el-table-column>
            </ele-table>
          </div>
          <div
            v-if="tableDataAttend.length === 0 && tableData.length === 0"
            class="no-data"
          >
            暂无数据
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import _ from 'lodash'
import staticticsSearch from '../../components/staticticsSearch'
import EleTable from '@/components/Table/EleTable'
import { formatData } from '@/utils'
export default {
  props: {
    department: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    staticticsSearch,
    EleTable
  },
  data() {
    return {
      despMap: {
        conversion: '转化',
        attendClass: '参课',
        finishClass: '完课'
      },
      // 是否已加载完期数列表
      hasLoadPeriod: false,
      // tabs标签默认状态
      selectName: '更多',
      // 统计表title
      activeName: 'conversion',
      tabIndex: 0,
      periodStatus: {
        '0': '待开始',
        '1': '招生中',
        '2': '待开课',
        '3': '上课中',
        '4': '已结课'
      },
      // 状态index
      btnIndex: 0,
      topStatus: [
        {
          status: 'on_going',
          label: '进行中'
        },
        {
          status: 'not_start',
          label: '待开课'
        },
        {
          status: 'over',
          label: '已结课'
        }
      ],
      supStatus: {
        1: 'S1',
        2: 'S2',
        3: 'S3',
        4: 'S4',
        5: 'S5'
      },
      priodTabs: [],
      // 期标签页面更多下拉
      priodTabsEnd: [],
      flags: {
        loading: false
      },
      tabQuery: {
        size: 20,
        page: 1
      },
      // 总页数
      totalElements: 0,
      // 表格数据
      statisticsInfo: {},
      // 转化统计数据列表
      tableData: [],
      // 参课,完课数据列表
      tableDataAttend: [],
      // 转化统计，统计数据
      tableDataChild: [],
      tableDataChildAttend: [],
      // 点击选中开课日期，结课日期
      dataStatisticsBtn: {},
      // titele上传统计
      titleUpload: {
        // 上传作品总数
        course_task_count: 0,
        // 学生总数
        student_count: 0,
        // 上传学生总数
        task_student_count: 0,
        // 总上传率
        total_upload_rate: 0
      },
      // title点评统计
      titlereviewStatistical: {
        reviewProbability: '-',
        listenTo: '-'
      },
      // 放课天数数组
      schoolDays: [],
      searchEmit: {},
      showSearch: true,
      tableHeight: 'auto'
    }
  },
  computed: {},
  watch: {},
  created() {
    this.$nextTick(() => {
      const tableHeight =
        document.body.clientHeight - this.$refs.tableInner.offsetTop - 112
      this.tableHeight = tableHeight + ''
    })
    this.init()
  },
  methods: {
    async init(status = 'on_going') {
      const params = { status }
      const proidList = await this.getPriodByStatus(params)
      if (proidList.length) {
        this.priodTabs = proidList.slice(0, 5)
        this.priodTabsEnd = proidList.slice(5)

        const { period = '' } = proidList[0]
        this.tabQuery.period = period
        await this.getChangecListByProid()
      }
    },
    /**
     * @description: 通过状态获取'期数' ‘进行中’、‘已结课’，‘招生中’
     * @param:{ status: 'on_going/over/not_start'}
     */
    async getPriodByStatus(params) {
      try {
        const {
          data: { ManagementStatusList: proidList }
        } = await this.$http.Statistics.getPriodByStatus(params)
        return proidList
      } catch (err) {
        console.log(err)
      } finally {
        // 此处是为了防止->切换顶部状态后 期数显示抖动
        this.hasLoadPeriod = true
      }
    },
    initSearchData(res, isFromEmit = false) {
      // 如果是子组件emit而来的数据，则不需要清空
      if (!isFromEmit) {
        this.showSearch = false
        this.$nextTick(() => {
          this.showSearch = true
        })
      }

      this.searchEmit = _.cloneDeep(res)

      const { department = [], groupSell = '', sup = [] } = this.searchEmit
      Object.assign(this.tabQuery, {
        teacher: groupSell,
        page: 1,
        department: department.join(),
        sup: sup.join()
      })
    },
    // 组件emit
    searchChange(res) {
      this.initSearchData(res, true)

      this.getChangecListByProid()
    },
    // table列表
    async getChangecListByProid() {
      const loadingInstance = this.$loading({
        target: 'section',
        lock: true,
        text: '玩命加载中...',
        fullscreen: true
      })
      try {
        if (this.activeName === 'finishClass') {
          // 完课统计
          const { period, teacher, department, sup } = this.tabQuery
          const {
            data: { getCompeteCourseList }
          } = await this.$http.Statistics.getCompeteCourseList({
            ...this.tabQuery,
            term: period,
            teacher_ids: teacher,
            department_ids: department,
            sups: sup
          })
          // 表格上的统计信息
          this.statisticsInfo = getCompeteCourseList || {}
          // 格式化时间
          this.statisticsInfo.start_date = this.statisticsInfo.start_date
            ? formatData(this.statisticsInfo.start_date)
            : ''
          this.statisticsInfo.end_date = this.statisticsInfo.end_date
            ? formatData(this.statisticsInfo.end_date)
            : ''
          // 总数、分页用
          this.totalElements = +getCompeteCourseList.totalElements || 0
          this.formatTableData(getCompeteCourseList.completeCourse || [])
        } else if (this.activeName === 'attendClass') {
          // 参课统计tab
          const { period, teacher, department, sup } = this.tabQuery
          const {
            data: { getCompeteCourseList }
          } = await this.$http.Statistics.getAttendClasscListByProid({
            ...this.tabQuery,
            term: period,
            teacher_ids: teacher,
            department_ids: department,
            sups: sup
          })

          // 表格上的统计信息
          this.statisticsInfo = getCompeteCourseList || {}
          // 格式化时间
          this.statisticsInfo.start_date = this.statisticsInfo.start_date
            ? formatData(this.statisticsInfo.start_date)
            : ''
          this.statisticsInfo.end_date = this.statisticsInfo.end_date
            ? formatData(this.statisticsInfo.end_date)
            : ''
          // 总数、分页用
          this.totalElements = +getCompeteCourseList.totalElements || 0
          this.formatTableData(getCompeteCourseList.completeCourse || [])
        } else if (this.activeName === 'conversion') {
          // 转化统计
          let {
            data: { ConversionRateStatistics }
          } = await this.$http.Statistics.getChangecListByProid(this.tabQuery)
          !ConversionRateStatistics && (ConversionRateStatistics = {})
          // 总数、分页用
          this.totalElements = ConversionRateStatistics.total_elements || 0

          // 表格上的统计信息
          this.statisticsInfo = ConversionRateStatistics
          this.pakageListDate(ConversionRateStatistics)
        } else if (this.activeName === 'uploadWorks') {
          // 上传作品统计
          const { period, teacher, department, sup } = this.tabQuery
          const {
            data: {
              BaseSaleStatisticsPage: { content, totalElements }
            }
          } = await this.$http.Statistics.getBaseSaleStatisticsPage({
            ...this.tabQuery,
            term: period,
            teacherIds: teacher,
            departmentId: department,
            sups: sup
          })

          // 格式化时间
          // 开课日期
          this.statisticsInfo.start_date =
            this.dataStatisticsBtn && this.dataStatisticsBtn.course_day
              ? formatData(this.dataStatisticsBtn.course_day)
              : formatData(this.priodTabs[0].course_day)
          // 结课日期
          this.statisticsInfo.end_date =
            this.dataStatisticsBtn && this.dataStatisticsBtn.end_course_day
              ? formatData(this.dataStatisticsBtn.end_course_day)
              : formatData(this.priodTabs[0].end_course_day)
          // 开课天数
          if (this.dataStatisticsBtn && this.dataStatisticsBtn.course_day) {
            if (+this.dataStatisticsBtn.course_day > new Date().getTime()) {
              this.statisticsInfo.course_days = '0'
            } else if (
              +this.dataStatisticsBtn.course_day < new Date().getTime() &&
              new Date().getTime() < +this.dataStatisticsBtn.end_course_day
            ) {
              this.statisticsInfo.course_days = Math.ceil(
                (new Date() - this.dataStatisticsBtn.course_day) /
                  1000 /
                  60 /
                  60 /
                  24
              )
            } else if (
              new Date().getTime() > +this.dataStatisticsBtn.end_course_day
            ) {
              this.statisticsInfo.course_days =
                Math.ceil(
                  (+this.dataStatisticsBtn.end_course_day -
                    +this.dataStatisticsBtn.course_day) /
                    1000 /
                    60 /
                    60 /
                    24
                ) + 1
            }
          } else {
            if (+this.priodTabs[0].course_day > new Date().getTime()) {
              this.statisticsInfo.course_days = '0'
            } else if (
              +this.priodTabs[0].course_day < new Date().getTime() &&
              new Date().getTime() < +this.priodTabs[0].end_course_day
            ) {
              this.statisticsInfo.course_days = Math.ceil(
                (new Date().getTime() - this.priodTabs[0].course_day) /
                  1000 /
                  60 /
                  60 /
                  24
              )
            } else if (
              new Date().getTime() > +this.priodTabs[0].end_course_day
            ) {
              this.statisticsInfo.course_days =
                Math.ceil(
                  (+this.priodTabs[0].end_course_day -
                    +this.priodTabs[0].course_day) /
                    1000 /
                    60 /
                    60 /
                    24
                ) + 1
            }
          }
          // 总数、分页用
          this.totalElements = +totalElements || 0
          // title统计
          this.titleStatistical()
          this.uploadStatistical(content || [])
        } else if (this.activeName === 'teacherComments') {
          // 上传作品统计
          const { period, teacher, department, sup } = this.tabQuery
          const {
            data: {
              BaseSaleStatisticsPage: { content, totalElements }
            }
          } = await this.$http.Statistics.getBaseSaleStatisticsPage({
            ...this.tabQuery,
            term: period,
            teacherIds: teacher,
            departmentId: department,
            sups: sup
          })
          // 格式化时间
          // 开课日期
          this.statisticsInfo.start_date =
            this.dataStatisticsBtn && this.dataStatisticsBtn.course_day
              ? formatData(this.dataStatisticsBtn.course_day)
              : formatData(this.priodTabs[0].course_day)
          // 结课日期
          this.statisticsInfo.end_date =
            this.dataStatisticsBtn && this.dataStatisticsBtn.end_course_day
              ? formatData(this.dataStatisticsBtn.end_course_day)
              : formatData(this.priodTabs[0].end_course_day)
          // 开课天数
          // 判断是否切换课程期数，如果切换则用传的值，否则用第一个值
          // 开课天数
          if (this.dataStatisticsBtn && this.dataStatisticsBtn.course_day) {
            if (+this.dataStatisticsBtn.course_day > new Date().getTime()) {
              this.statisticsInfo.course_days = '0'
            } else if (
              +this.dataStatisticsBtn.course_day < new Date().getTime() &&
              new Date().getTime() < +this.dataStatisticsBtn.end_course_day
            ) {
              this.statisticsInfo.course_days = Math.ceil(
                (new Date() - this.dataStatisticsBtn.course_day) /
                  1000 /
                  60 /
                  60 /
                  24
              )
            } else if (
              new Date().getTime() > +this.dataStatisticsBtn.end_course_day
            ) {
              this.statisticsInfo.course_days =
                Math.ceil(
                  (+this.dataStatisticsBtn.end_course_day -
                    +this.dataStatisticsBtn.course_day) /
                    1000 /
                    60 /
                    60 /
                    24
                ) + 1
            }
          } else {
            if (+this.priodTabs[0].course_day > new Date().getTime()) {
              this.statisticsInfo.course_days = '0'
            } else if (
              +this.priodTabs[0].course_day < new Date().getTime() &&
              new Date().getTime() < +this.priodTabs[0].end_course_day
            ) {
              this.statisticsInfo.course_days = Math.ceil(
                (new Date().getTime() - this.priodTabs[0].course_day) /
                  1000 /
                  60 /
                  60 /
                  24
              )
            } else if (
              new Date().getTime() > +this.priodTabs[0].end_course_day
            ) {
              this.statisticsInfo.course_days =
                Math.ceil(
                  (+this.priodTabs[0].end_course_day -
                    +this.priodTabs[0].course_day) /
                    1000 /
                    60 /
                    60 /
                    24
                ) + 1
            }
          }
          // 总数、分页用
          this.totalElements = +totalElements || 0
          this.getTeacherComments(content || [])
          // title统计
          this.titleReview()
        }
        loadingInstance.close()
      } catch (err) {
        console.log(err)
        loadingInstance.close()
      }
    },
    // 上传作品统计和老师点评统计
    titleStatistical() {
      const { period, teacher, department, sup } = this.tabQuery
      this.$http.Statistics.getCourseTaskStatistics({
        ...this.tabQuery,
        term: period,
        teacher_ids: teacher,
        department_ids: department,
        sups: sup
      }).then((res) => {
        this.titleUpload.course_task_count =
          res.data.courseTaskStatistics.course_task_count
        // 人均作品
        this.titleUpload.student_count =
          res.data.courseTaskStatistics.course_task_count &&
          res.data.courseTaskStatistics.student_count
            ? (
                res.data.courseTaskStatistics.course_task_count /
                res.data.courseTaskStatistics.student_count
              ).toFixed(2)
            : 0
        this.titleUpload.task_student_count =
          res.data.courseTaskStatistics.task_student_count

        // 总上传率=所有上传人数相加/（所有体验课学员相加*放课期数）
        this.titleUpload.total_upload_rate =
          this.titleUpload.task_student_count &&
          res.data.courseTaskStatistics.student_count &&
          this.schoolDays.length > 0
            ? (
                (
                  this.titleUpload.task_student_count /
                  (res.data.courseTaskStatistics.student_count *
                    this.schoolDays[this.schoolDays.length - 1])
                ).toFixed(2) * 100
              ).toFixed(0) + '%'
            : 0
      })
    },
    // 上传作品统计
    uploadStatistical(list) {
      // 总上传率 = （第1天作品总数人数+第2天作品总数人数+第n天作品总数人数）/（体验课学生*已放课总节数）
      // 已放课总节数 = 上传人数字段&&上传作品数不为空，个数相加
      // 上传率 = 上传人数/体验课学生
      // 初始化
      this.tableDataChildAttend = []
      this.schoolDays = []
      list.forEach((item, index) => {
        // 作品总数
        const totalNumbe = {
          totalNumbe: item.studentCourseTaskStatisticsList[0].course_task_count,
          task_student_count:
            item.studentCourseTaskStatisticsList[0].task_student_count
        }
        // 人均作品总数
        let averageWorks = {}
        if (totalNumbe.totalNumbe !== 0 && item.trial_course_count !== 0) {
          averageWorks = {
            averageWorks: (
              totalNumbe.totalNumbe / item.trial_course_count
            ).toFixed(2)
          }
        } else {
          averageWorks = { averageWorks: '-' }
        }

        item.completeArr = item.studentCourseTaskStatisticsList || []
        item.completeArr = item.completeArr.splice(1)
        const childLength = item.completeArr.length
        if (this.tableDataChildAttend.length <= childLength) {
          this.tableDataChildAttend = item.completeArr
        }

        let count = 0
        const trialCourseCount = item.trial_course_count
        this.tableDataChildAttend.forEach((res) => {
          // 已放课节数
          if (res.task_student_count && res.course_task_count) {
            count = ++count
          }
          // 单个上传率转换成百分比
          const trialcoursecountCalculate =
            res.task_student_count && trialCourseCount
              ? (
                  (res.task_student_count / trialCourseCount).toFixed(2) * 100
                ).toFixed(0) + '%'
              : '-'
          const uploadRate = {
            uploadRate: trialcoursecountCalculate
          }
          Object.assign(res, uploadRate)
        })
        // 放课天数数组
        this.schoolDays.push(count)
        // 总上传率
        const toCalculate =
          totalNumbe.task_student_count / (item.trial_course_count * count)
        const treatmenTpercentage = toCalculate
          ? (toCalculate.toFixed(2) * 100).toFixed(0) + '%'
          : '-'
        const totalUpload = {
          totalUpload: treatmenTpercentage
        }
        Object.assign(item, totalNumbe, averageWorks, totalUpload)
      })
      // 放课天数排序
      this.schoolDays = this.schoolDays.sort()
      this.tableDataAttend = list
    },
    // 老师点评
    getTeacherComments(list) {
      this.tableDataChildAttend = []
      this.schoolDays = []
      list.forEach((item, index) => {
        item.completeArr = item.taskCommentStatisticsList || []
        const childLength = item.completeArr.length
        if (this.tableDataChildAttend.length <= childLength) {
          this.tableDataChildAttend = item.completeArr
        }
        let commentRate = {}
        let listenReview = {}
        this.tableDataChildAttend.forEach((data) => {
          // 点评数/当前销售在当期所带学员共上传作品数=点评率
          const calculateCommentRate =
            data.comment_count && data.task_count
              ? (
                  (data.comment_count / data.task_count).toFixed(2) * 100
                ).toFixed(0) + '%'
              : '-'
          commentRate = { commentRate: calculateCommentRate }
          // 点评收听率：听点评数/发布点评数=点评收听率
          const calculateListenReview =
            data.comment_listened_count && data.comment_count
              ? (
                  (data.comment_listened_count / data.comment_count).toFixed(
                    2
                  ) * 100
                ).toFixed(0) + '%'
              : '-'
          listenReview = { listenReview: calculateListenReview }
          Object.assign(data, commentRate, listenReview)
        })
      })
      this.tableDataAttend = list
    },
    // 老师点评title统计
    titleReview() {
      const { period, teacher, department, sup } = this.tabQuery
      this.$http.Statistics.getTaskCommentStatistics({
        ...this.tabQuery,
        term: period,
        teacher_ids: teacher,
        department_ids: department,
        sups: sup
      }).then((res) => {
        const _data = res.data.taskCommentStatistics
        // 总点评率=点评总数/作品总数
        this.titlereviewStatistical.reviewProbability =
          _data.comment_count && _data.task_count
            ? (
                (_data.comment_count / _data.task_count).toFixed(2) * 100
              ).toFixed(0) + '%'
            : '-'
        // 总点评收听率 = 总点评被收听数/总点评数
        this.titlereviewStatistical.listenTo =
          _data.listen_count && _data.comment_count
            ? (
                (_data.listen_count / _data.comment_count).toFixed(2) * 100
              ).toFixed(0) + '%'
            : '-'
      })
    },
    // 包装 接口返回的数据
    pakageListDate(tabList) {
      // 初始化
      this.tableDataChild = []
      // 格式化时间
      tabList.start_date = tabList.start_date
        ? formatData(tabList.start_date)
        : ''
      tabList.end_date = tabList.end_date ? formatData(tabList.end_date) : ''

      const teacherConversion = tabList.teacher_conversion_rates || []

      // 大表格 遍历，选择一个‘conversion_rate_daily’最大的值，作为表头
      // let _length = 0
      teacherConversion.forEach((item, index) => {
        const conversionRateArr = item.conversion_rate_daily || []
        const childLength = conversionRateArr.length

        if (this.tableDataChild.length <= childLength) {
          this.tableDataChild = conversionRateArr
        }
      })
      this.tableData = teacherConversion
    },
    //  参课统计 数据格式化
    formatTableData(list) {
      // 初始化
      this.tableDataChildAttend = []
      list.forEach((item, index) => {
        item.completeArr = item.completeArr || []
        const completeArr = item.completeArr
        const childLength = completeArr.length
        if (this.tableDataChildAttend.length <= childLength) {
          this.tableDataChildAttend = completeArr
        }
      })

      this.tableDataAttend = list
    },
    // 点击tabs页签（转化统计、参课统计、完课统计 按钮）
    statisticsTypehandleClick(tab) {
      this.tableDataAttend = []
      this.tableData = []
      this.tabQuery.page = 1
      this.getChangecListByProid()
    },
    // 更多 下拉框
    handleCommand(command) {
      this.initSearchData({})

      const { period = '' } = command
      this.tabIndex = 6

      this.selectName = command.period_name
      Object.assign(this.tabQuery, {
        page: 1,
        period
      })
      this.getChangecListByProid()
    },
    top_tabs_click(index, statusInfo) {
      this.hasLoadPeriod = false
      this.initSearchData({})

      this.tabIndex = 0
      this.btnIndex = index
      const { status } = statusInfo

      this.tabQuery.status = status
      this.init(status)
    },
    priod_tabs_click(row, index) {
      this.dataStatisticsBtn = row
      this.initSearchData({})

      this.tabIndex = index
      this.tabQuery.page = 1
      this.tabQuery.period = row.period

      this.getChangecListByProid()
      this.selectName = '更多'
    },
    // 新增、编辑
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getChangecListByProid()
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule-container {
  &-left {
    padding-left: 0px;
    width: 220px;
    min-width: 220px;
    border-right: 1px solid #e3e3e3;
  }
  &-right {
    overflow-x: hidden;
    flex: 1;
    margin: 0 10px 10px 10px;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.right {
      padding: 0;
    }
  }
  .top-tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: #f0f1f2;
    > div {
      margin-right: 20px;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      transition: 0.1s;
      font-weight: 500;
      padding: 9px 15px;
      border-radius: 20px;
      font-size: 12px;
      &.active {
        background: #409eff;
        color: #fff;
      }
    }
  }
  .tabs-operate {
    background: #f5f7fa;
    display: flex;
    height: 40px;
    > div {
      height: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &.active {
        background: #fff;
        span {
          color: #409eff;
        }
      }
    }
  }
  .descripte {
    padding-left: 15px;
    min-height: 20px;
    margin: 0;
    color: #333;
    min-width: 1024px;
    .label-val {
      margin-right: 20px;
    }
    .for-light {
      color: #409eff;
    }
  }
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    height: 80px;
    color: #409eff;
    font-size: 15px;
  }
  .sear-container {
    height: 40px;
    display: flex;
    margin-left: 15px;
    align-items: center;
    .el-card {
      border: 0;
    }
  }
  .editStyle {
    color: #0401ff;
    cursor: pointer;
  }
  .activeCommand.active {
    background: #fff;
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
    }
  }
  .el-dropdown-link.active {
    cursor: pointer;
    color: #409eff;
  }
}
</style>
<style lang="scss">
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
