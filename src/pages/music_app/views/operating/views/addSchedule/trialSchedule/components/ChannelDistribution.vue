<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-26 21:13:31
 -->
<template>
  <div class="channel-distribution">
    <div class="header-tip">
      <h4>
        <span>{{ courseTypeObj[$route.params.courseType] }}</span>
        <span>排期-渠道线索定向分配配置</span>
      </h4>
      <div class="btn-group">
        <div class="btn">
          <el-button
            type="primary"
            size="mini"
            class="btn-directed"
            @click="exportExcel('importChannel')"
          >
            批量渠道配置
          </el-button>
        </div>
        <div class="btn">
          <el-button
            type="primary"
            size="mini"
            class="btn-directed"
            @click="centerDialogVisible = true"
          >
            定向渠道配置
          </el-button>
        </div>
      </div>
    </div>
    <section class="channel-container">
      <div class="search-line">
        <table-search
          v-if="showSearch"
          @change="searchChange"
          :showChannel="true"
          :showDept="false"
          :category="category"
        ></table-search>
      </div>
      <!-- <div class="statistics">定向渠道总数{{ 10 }}人，接生销售{{ 20 }}人.</div> -->
      <div class="table-content" ref="autoHeight">
        <ele-table
          :tableHeight="tableHeight"
          :dataList="tableData"
          :loading="loading"
          :size="params.size"
          :page="params.page"
          :total="totalPages"
          @pageChange="pageChange_handler"
          class="mytable"
        >
          <el-table-column prop="period" label="序号" width="50" align="center">
            <template slot-scope="scope"
              ><span>{{ scope.$index + calcIndex + 1 }} </span></template
            >
          </el-table-column>
          <el-table-column prop="channelId" label="渠道ID" align="center">
          </el-table-column>
          <el-table-column prop="channelName" label="渠道名称" align="center">
          </el-table-column>
          <el-table-column prop="channelLevel" label="渠道等级" align="center">
          </el-table-column>
          <el-table-column prop="departmentName" label="部组" align="center">
          </el-table-column>
          <el-table-column prop="teacherName" label="社群销售" align="center">
          </el-table-column>
          <el-table-column prop="weixinNo" label="接生微信号" align="center">
          </el-table-column>
          <el-table-column label="其它渠道接生" align="center">
            <template slot-scope="scope">
              <div class="form-scope">
                <el-switch
                  v-model="scope.row.otherStatus"
                  active-color="#13ce66"
                  :active-value="1"
                  :inactive-value="0"
                  @change="updateStatus($event, scope.row, 'otherStatus')"
                >
                </el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="定向渠道接生" align="center">
            <template slot-scope="scope">
              <div class="form-scope">
                <el-switch
                  v-model="scope.row.selfStatus"
                  active-color="#13ce66"
                  :active-value="1"
                  :inactive-value="0"
                  @change="updateStatus($event, scope.row, 'selfStatus')"
                >
                </el-switch>
              </div>
            </template>
          </el-table-column>
        </ele-table>
      </div>
    </section>

    <!-- 渠道线索定向分配模态框 -->
    <channel-threeded
      :centerDialogVisible="centerDialogVisible"
      @dialogOperate="dialogOperate"
      :editChannelThreeded="editChannelThreeded"
      :category="category"
      v-if="centerDialogVisible"
    ></channel-threeded>

    <upload-excel
      v-if="showUploadExcel"
      :showUploadExcel.sync="showUploadExcel"
      :uploadCategory="uploadCategory"
      :category="category"
    ></upload-excel>

    <!-- 取消、上一步 -->
    <div class="operate-btn">
      <el-button size="small" type="warning" @click="backList">取 消</el-button>
      <el-button size="small" type="primary" @click="preStep">上一步</el-button>
    </div>
  </div>
</template>
<script>
// import OrgDept from '../../components/OrgDept'
import { calcBrowerClienHeight } from '@/utils/index'
import { Sup_scheduleSubmit } from '@/utils/supList'
import { courseTypeObj } from '@/pages/music_app/views/operating/courseType'
import TableSearch from '@/pages/music_app/views/operating/components/tableSearch/index'
import EleTable from '@/components/Table/EleTable'
import ChannelThreeded from './ChannelThreeded'
import UploadExcel from '@/pages/music_app/views/operating/components/uploadExcel' // 上传excel文件
import { mapGetters } from 'vuex'

export default {
  props: {
    category: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      tableHeight: 'auto',
      courseTypeObj,
      tableData: [],
      loading: false,
      params: {
        pageSize: 20,
        pageNum: 1,
        channelIds: [],
        teacherIds: ''
      },
      // 总页数
      totalPages: 1,
      editChannelThreeded: null,
      centerDialogVisible: false, // TODO:
      // 导入渠道excel
      uploadCategory: '',
      showUploadExcel: false,
      showSearch: true
    }
  },
  components: {
    TableSearch,
    EleTable,
    ChannelThreeded,
    UploadExcel
  },
  watch: {},
  computed: {
    ...mapGetters(['schedulePeriod']),
    calcIndex() {
      const { pageSize, pageNum } = this.params
      return pageSize * pageNum
    }
  },
  async created() {
    const { courseType = '0' } = this.$route.params

    Object.assign(this.params, {
      period: this.schedulePeriod,
      courseType:Sup_scheduleSubmit[courseType]
    })

    this.getDirecteChannelList()

    this.tableHeight = await calcBrowerClienHeight(this, 'autoHeight', 135)
  },
  methods: {
    downLoadDemo() {},
    backList() {
      this.$store.commit('setSchedulePeriod', '')
      this.$router.push({ path: '/operatingSchedule' })
    },
    // 修改渠道状态
    async updateStatus(status, row, type) {
      const { id } = row
      const {
        updateDirectStatus: direct,
        updateOthertStatus: other
      } = this.$http.Operating

      const reqAPI = type === 'otherStatus' ? other : direct
      const params = { id, status: status === 0 ? 'CLOSE' : 'OPEN' }
      try {
        const updateRes = await reqAPI(params)
        if (updateRes.code !== 0) row[type] = Math.pow(0, status)
      } catch (error) {
      }
    },
    async getDirecteChannelList() {
      const { getDirecteChannelList } = this.$http.Operating
      this.loading = true
      try {
        const { payload } = await getDirecteChannelList(this.params)
        const { content = [], totalElements = 0 } = payload

        this.totalPages = Number(totalElements)
        this.tableData = content
      } catch (error) {
      } finally {
        this.loading = false
      }
    },
    searchChange(res) {
      const { groupSell: teacherIds, channel: channelIds } = res

      Object.assign(this.params, {
        teacherIds,
        channelIds,
        pageNum: 1
      })

      this.getDirecteChannelList()
    },
    /** 系统课导入数据 */
    exportExcel(type) {
      this.uploadCategory = type
      this.showUploadExcel = true
    },
    dialogOperate(args) {
      const { close = true, submitSucc = false } = args
      this.centerDialogVisible = !close
      
      if (submitSucc) {
        this.getDirecteChannelList()
        // 刷新定向渠道列表
        this.showSearch = false
        this.$nextTick(() => {
          this.showSearch = true
        })
      }
    },
    pageChange_handler(pageNum) {
      this.params.pageNum = pageNum
      this.getDirecteChannelList()
    },
    preStep() {
      this.$emit('listenStepStatus')
    }
  }
}
</script>
<style lang="scss" scoped>
.channel-distribution {
  .header-tip {
    height: 50px;
    display: flex;
    justify-content: space-between;
    .btn-group {
      display: flex;
      align-items: center;
      .btn {
        margin-right: 20px;
      }
    }
  }
  .channel-container {
    // border: 1px solid #bbb;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 10px;
    .search-line {
    }
    .statistics {
      margin: 10px 0;
    }
    .table-content {
      .mytable {
      }
    }
  }
  .operate-btn {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
}
</style>
