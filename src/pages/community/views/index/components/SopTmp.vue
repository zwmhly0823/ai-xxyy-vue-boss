<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 17:02:32
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-21 17:11:15
-->
<template>
  <div class="soptmp-container">
    <div class="operete-row">
      <div class="search-container">
        <!-- 组件① -->
        <div class="search-item small" v-if="userInfo.type == '2'">
          <!-- <div class="search-item small"> -->
          <group-sell
            @result="selectAuthor"
            :name="'username'"
            :tip="'创建人'"
          />
        </div>
      </div>
      <div class="add-btn" v-if="userInfo.type == '1'">
        <!-- <div class="add-btn"> -->
        <el-button type="primary" size="mini" @click="new_sop_handle"
          >新建SOP模板</el-button
        >
      </div>
    </div>
    <section ref="tableContainer">
      <ele-table
        :tableHeight="tableHeight"
        :tableSize="'small'"
        :dataList="tableData"
        :loading="flags.loading"
        :size="tableParams.size"
        :page="tableParams.page"
        :total="totalElements"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column label="序号" prop="" align="center">
          <template slot-scope="scope"
            ><span>{{ scope.$index + 1 }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="模板名称"
          prop="templateName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="调用次数"
          prop="useNum"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建人"
          prop="username"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职级"
          prop="rankname"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="ctime"
          align="center"
        ></el-table-column>
        <el-table-column
          label="模板状态"
          prop="cstate"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="editStyle">
              <span
                @click="tableRowOperate(scope.row, '1')"
                :class="{ 'btn-disabled': scope.row.state }"
                >调用</span
              >
              <span
                @click="tableRowOperate(scope.row, '2')"
                :class="{ 'btn-disabled': +scope.row.useNum }"
                >编辑</span
              >
              <el-popconfirm
                confirmButtonText="YES"
                cancelButtonText="算了"
                icon="el-icon-info"
                iconColor="red"
                title="你确定要删除该项内容吗？"
                @onConfirm="confirmDelRow"
              >
                <span @click="tableRowOperate(scope.row, '3')" slot="reference"
                  >删除</span
                >
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </ele-table>
    </section>
  </div>
</template>
<script>
import { debounce } from 'lodash'
import GroupSell from './groupSell'
import EleTable from '@/components/Table/EleTable'
import { isToss, formatData } from '@/utils/index.js'
export default {
  data() {
    return {
      tableHeight: 'auto',
      tableData: [],
      tableParams: {
        size: 20,
        page: 1
      },
      totalElements: 0,
      authorList: [],
      selectVal: '',
      userInfo: {
        username: '',
        type: '1' // 1:toss2:boss
      },
      currentRow: {},
      flags: {
        loading: false
      }
    }
  },
  components: {
    EleTable,
    GroupSell
  },
  computed: {
    handleDebounce() {
      return debounce(this.getAuthorList, 500)
    }
  },
  created() {
    this.init()
  },
  activated() {
    this.init()
  },
  mounted() {},
  methods: {
    /** activated在同组件下切换不执行？ */
    init() {
      const teacherId = isToss()
      let itemType = 'teacher'
      if (!teacherId) {
        itemType = 'staff'
        this.userInfo.type = '2'
      }
      const userInfo = localStorage.getItem(itemType)

      this.userInfo.uid = JSON.parse(userInfo).id
      this.getTemplateList()
      this.$nextTick(() => {
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
      })
    },
    /** 创建人选择时 */
    selectAuthor(author) {
      Object.assign(this.userInfo, author)
      this.getTemplateList()
    },
    /** 获取创建人列表 */
    getAuthorList(res) {
      console.log(this.selectVal, res, 'vla')
      setTimeout(() => {
        this.authorList = [
          {
            value: '选项1',
            label: '黄金糕'
          },
          {
            value: '选项2',
            label: '双皮奶'
          },
          {
            value: '选项3',
            label: '蚵仔煎'
          },
          {
            value: '选项4',
            label: '龙须面'
          },
          {
            value: '选项5',
            label: '北京烤鸭'
          }
        ]
      }, 300)
    },
    /** table底部翻页按钮 */
    pageChange_handler(res) {},
    selectChange() {
      console.log(this.selectVal, 'this.selectVal')
    },
    tableRowOperate(row, type) {
      if (type === '1') {
        !row.state &&
          this.$router.push({
            path: `/newPlantask/-1/${row.id}`
          })
      } else if (type === '2') {
        !row.useNum &&
          this.$router.push({
            path: `/newSoptmp/${row.id}`
          })
      } else {
        this.currentRow = row
      }
    },
    /** 顶部tabs切换事件 */
    top_tabs_click(index, tab) {
      this.headerTabIndex = index
    },
    /** 表格删除某一行确认按钮 */
    confirmDelRow() {
      // console.log('删除了') delTemplate
      const id = this.currentRow.id
      id && this.delTemplate(id)
    },
    /** 删除一模板 */
    async delTemplate(templateId) {
      try {
        const tmpList = await this.$http.Community.delTemplate({
          templateId
        }).catch()
        tmpList && tmpList.code === 0 && this.getTemplateList()
      } catch (err) {
        console.log(err)
      }
    },
    /** 获取sop列表 */
    async getTemplateList() {
      this.flags.loading = true
      try {
        const tmpList = await this.$http.Community.getTemplateList(
          this.userInfo
        ).catch()
        const { payload = [] } = tmpList || {}
        payload.forEach((item) => {
          item.ctime = item.ctime ? formatData(item.ctime) : ''
          item.cstate = item.state ? '禁用' : '启用'
        })
        this.tableData = payload
      } catch (err) {
        console.log(err)
      } finally {
        this.flags.loading = false
      }
    },
    /** 新建sop按钮 */
    new_sop_handle() {
      const id = '-1'
      this.$router.push({
        path: `/newSoptmp/${id}`
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.operete-row {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  .search-container {
    .search-item {
      position: relative;
      /deep/ input {
        padding-left: 25px;
      }
    }
    b {
      position: absolute;
      left: 10px;
      top: 7px;
      color: #999;
    }
  }
  .add-btn {
  }
}
section {
  .mytable {
    .editStyle {
      display: flex;
      justify-content: space-around;
      span {
        color: #2a75ed;
        cursor: pointer;
        &.btn-disabled {
          color: #ccc;
          cursor: no-drop;
        }
      }
    }
  }
}
</style>
