<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 17:02:32
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-03 15:50:37
-->
<template>
  <div class="soptmp-container">
    <div class="operete-row">
      <div class="search-container">
        <!-- 组件① -->
        <div class="search-item small">
          <el-select
            class="item-style"
            v-model="selectVal"
            filterable
            remote
            :reserve-keyword="true"
            size="mini"
            clearable
            placeholder="创建人"
            :remote-method="handleDebounce"
            @change="selectChange"
          >
            <el-option
              v-for="item in authorList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <b class="el-icon-search"></b>
        </div>
      </div>
      <div class="add-btn">
        <el-button type="primary" size="mini" @click="new_sop_handle"
          >新建SOP模板</el-button
        >
      </div>
    </div>
    <section>
      <ele-table
        :tableHeight="tableHeight"
        :tableSize="'small'"
        :dataList="tableData"
        :size="tableParams.size"
        :page="tableParams.page"
        :total="totalElements"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column label="序号" prop="" align="center"></el-table-column>
        <el-table-column
          label="模板名称"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="调用次数"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建人"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职级"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="模板状态"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="editStyle">
              <span @click="tableRowOperate(scope.row, '1')">调用</span>
              <span @click="tableRowOperate(scope.row, '2')">编辑</span>
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
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      tableHeight: 'auto',
      tableData: [{}],
      tableParams: {
        size: 20,
        page: 1
      },
      totalElements: 0,
      authorList: [],
      selectVal: ''
    }
  },
  components: {
    EleTable
  },
  computed: {
    handleDebounce() {
      return debounce(this.getAuthorList, 500)
    }
  },
  mounted() {
    this.getAuthorList()
  },
  methods: {
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
    tableRowOperate(row, type) {},
    /** 顶部tabs切换事件 */
    top_tabs_click(index, tab) {
      this.headerTabIndex = index
    },
    /** 表格删除某一行确认按钮 */
    confirmDelRow() {
      console.log('删除了')
    },
    /** 新建sop按钮 */
    new_sop_handle() {
      const id = '1'
      this.$router.push({
        path: `/newSoptmp/${id}`
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
      }
    }
  }
}
</style>
