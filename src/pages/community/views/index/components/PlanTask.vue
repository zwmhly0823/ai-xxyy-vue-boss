<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 17:10:10
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-29 18:18:31
-->
<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 17:02:32
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-29 17:08:56
-->
<template>
  <div class="plan-task-container">
    <div class="operete-row">
      <div class="search-container">
        <div class="search-item small">
          <el-select
            class="item-style"
            v-model="taskname"
            filterable
            remote
            :reserve-keyword="true"
            size="mini"
            clearable
            placeholder="任务名称"
            :remote-method="handleDebounce"
            @change="selectChange"
          >
            <el-option
              v-for="item in taskList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            class="item-style margin_l10"
            v-model="templatename"
            filterable
            remote
            :reserve-keyword="true"
            size="mini"
            clearable
            placeholder="模板名称"
            :remote-method="handleDebounce"
            @change="selectChange"
          >
            <el-option
              v-for="item in templateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            class="item-style margin_l10"
            v-model="creater"
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
              v-for="item in createrList"
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
          >新建SOP任务</el-button
        >
      </div>
    </div>
    <section>
      <ele-table
        :tableSize="'small'"
        :dataList="tableData"
        :size="tableParams.size"
        :page="tableParams.page"
        :total="totalElements"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column label="序号" prop="a" align="center"></el-table-column>
        <el-table-column
          label="计划名称"
          prop="b"
          align="center"
        ></el-table-column>
        <el-table-column
          label="调用模版"
          prop="c"
          align="center"
        ></el-table-column>
        <el-table-column
          label="发送微信号"
          prop="d"
          align="center"
        ></el-table-column>
        <el-table-column
          label="接受群数量"
          prop="e"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建人"
          prop="f"
          align="center"
        ></el-table-column>
        <el-table-column label="职级" prop="g" align="center"></el-table-column>
        <el-table-column
          label="创建时间"
          prop="h"
          align="center"
        ></el-table-column>
        <el-table-column label="任务进度" prop="i" align="center">
          <el-progress
            :text-inside="true"
            :show-text="false"
            :stroke-width="15"
            :percentage="70"
          ></el-progress>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="editStyle">
              <span @click="taskDetails(scope.row, '1')">详情</span>
              <span @click="tableRowOperate(scope.row, '2')">修改</span>
              <el-popconfirm
                confirmButtonText="YES"
                cancelButtonText="算了"
                icon="el-icon-info"
                iconColor="red"
                title="你确定要删除该项内容吗？"
                @onConfirm="confirmDelRow"
              >
                <span @click="tableRowOperate(scope.row, '3')" slot="reference"
                  >取消</span
                >
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </ele-table>
    </section>
    <el-drawer title="任务详情" :visible.sync="taskDetails_drawer">
      <section style="padding:0 10px;">
        <el-steps direction="vertical" :active="1">
          <el-step>
            <template class="steptop" slot="title"
              ><span class="steptop_active">第一天</span> <span>已完成</span>
            </template>
            <template slot="description">
              <div class="step-row">
                <p>将于2020.06.20 00:00:00开始发送</p>
                <ul>
                  <li>
                    <p>2020.06.20 10:00:00</p>
                    <div>
                      <span class="ordernumber">1</span>
                      <span style=" width: calc(100% - 50px);"
                        >你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好</span
                      >
                    </div>
                  </li>
                  <li>
                    <p>2020.06.20 10:00:00</p>
                    <div>
                      <span class="ordernumber">2</span>
                      <span style=" width: calc(100% - 50px);"
                        >你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好</span
                      >
                    </div>
                  </li>
                  <li>
                    <p>2020.06.20 10:00:00</p>
                    <div>
                      <span class="ordernumber">3</span>
                      <span style=" width: calc(100% - 50px);"
                        ><img
                          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                          alt=""
                      /></span>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </el-step>
          <el-step>
            <template class="steptop" slot="title"
              ><span class="steptop_active">第二天</span> <span>进行中</span>
            </template>
            <template slot="description">
              <div class="step-row">
                <p>将于2020.06.20 00:00:00开始发送</p>
                <ul>
                  <li>
                    <p>2020.06.20 10:00:00</p>
                    <div>
                      <span class="ordernumber">1</span>
                      <span style=" width: calc(100% - 50px);"
                        >你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好</span
                      >
                    </div>
                  </li>
                  <li>
                    <p>2020.06.20 10:00:00</p>
                    <div>
                      <span class="ordernumber">2</span>
                      <span style=" width: calc(100% - 50px);"
                        >你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好</span
                      >
                    </div>
                  </li>
                  <li>
                    <p>2020.06.20 10:00:00</p>
                    <div>
                      <span class="ordernumber">3</span>
                      <span style=" width: calc(100% - 50px);"
                        ><img
                          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                          alt=""
                      /></span>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </el-step>
          <el-step>
            <template class="steptop" slot="title"
              ><span class="steptop_active">第三天</span> <span>未完成</span>
            </template>
            <template slot="description">
              <div class="step-row">
                <p>将于2020.06.20 00:00:00开始发送</p>
                <ul>
                  <li>
                    <p>2020.06.20 10:00:00</p>
                    <div>
                      <span class="ordernumber">1</span>
                      <span style=" width: calc(100% - 50px);"
                        >你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好</span
                      >
                    </div>
                  </li>
                  <li>
                    <p>2020.06.20 10:00:00</p>
                    <div>
                      <span class="ordernumber">2</span>
                      <span style=" width: calc(100% - 50px);"
                        >你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好</span
                      >
                    </div>
                  </li>
                  <li>
                    <p>2020.06.20 10:00:00</p>
                    <div>
                      <span class="ordernumber">3</span>
                      <span style=" width: calc(100% - 50px);"
                        ><img
                          src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                          alt=""
                      /></span>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </el-step>
        </el-steps>
      </section>
    </el-drawer>
  </div>
</template>
<script>
import { debounce } from 'lodash'
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      taskname: '',
      templatename: '',
      creater: '',
      taskList: [],
      templateList: [],
      createrList: [],
      tableData: [
        {
          a: 1,
          b: '完课提醒全部销售',
          c: '完课提醒',
          d: 'xiaoxong01',
          e: 20,
          f: '申生男',
          g: '经理',
          h: '2020-06-13 00:00:00',
          i: 70
        }
      ],
      taskDetails_drawer: false,
      tableParams: {
        size: 20,
        page: 1
      },
      totalElements: 0
    }
  },
  mounted() {
    this.getTaskList()
    this.getTemplateList()
    this.getCreaterList()
  },
  components: {
    EleTable
  },
  computed: {
    handleDebounce() {
      return debounce(this.getTaskList, 500)
    }
  },
  methods: {
    selectChange() {
      console.log(this.taskname, 'this.taskname')
    },
    // 获取任务名称
    getTaskList(res) {
      console.log(this.taskList, res, 'vla')
      setTimeout(() => {
        this.taskList = [
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
    // 获取模板名称
    getTemplateList(res) {
      console.log(this.templateList, res, 'templateList')
      setTimeout(() => {
        this.templateList = [
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
    // 获取创建人
    getCreaterList(res) {
      console.log(this.createrList, res, 'createrList')
      setTimeout(() => {
        this.createrList = [
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
    /** 详情 */
    taskDetails(row, type) {
      this.taskDetails_drawer = true
      console.log(row, type)
    },
    pageChange_handler(res) {},
    tableRowOperate(row, type) {
      console.log(row, type)
    },
    /** 表格删除某一行确认按钮 */
    confirmDelRow() {
      console.log('删除了')
    },
    /** 新建sop按钮 */
    new_sop_handle() {
      this.$router.push({
        path: '/newPlantask'
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.steptop {
  color: #000 !important;
}
.steptop_active {
  display: inline-block;
  background: #99ccff;
  padding: 0px 10px;
  border-radius: 20px;
  color: #000000;
}
.steptop_unactive {
  display: inline-block;
  background: #e4e4e4;
  padding: 0px 10px;
  border-radius: 20px;
  color: #000000;
}
.step-row ul,
li {
  list-style: none;
}
.step-row li p {
  margin: 0 !important;
}
.step-row li {
  margin: 10px 0;
}
.step-row li img {
  width: 100px;
}
.step-row li div {
  display: flex;
  justify-content: stretch;
  align-items: center;
  background: #e7e7e7;
  border-radius: 5px;
}
.el-drawer__body {
  height: 100%;
  overflow: scroll;
}
.ordernumber {
  width: 50px !important;
  display: inline-block;
  text-align: center;
  margin: 0 !important;
  background: #cccccc;
  border-radius: 30px;
}
.margin_l10 {
  margin-left: 10px;
}
</style>
