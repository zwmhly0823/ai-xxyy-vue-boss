<!--
 * @Descripttion: BOSS小熊
 * @version: 1.0.0
 * @Author: Shasen
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: Shasen
 * @LastEditTime: 2020-06-30 14:54:11
-->
<template>
  <el-row type="flex" class="new-plan app-main">
    <el-col class="new-plan-container">
      <el-card class="header">
        <div class="tip">新建SOP任务计划</div>
        <el-form
          :model="sopFrom"
          ref="sopFrom"
          label-width="100px"
          size="mini"
          class="sop-form"
        >
          <el-form-item
            prop="taskName"
            label="模板名称"
            style="width:320px;"
            :rules="[
              {
                required: true,
                message: '请输入邮箱地址',
                trigger: 'blur'
              },
              {
                type: 'taskName',
                message: '请输入正确的邮箱地址',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input
              v-model="sopFrom.taskName"
              placeholder="请输入任务名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="planTemplate"
            label="计划模板"
            style="width:320px;"
          >
            <el-select
              class="item-style"
              v-model="sopFrom.planTemplate"
              remote
              :reserve-keyword="true"
              size="mini"
              clearable
              placeholder="选择模板"
            >
              <el-option
                v-for="item in templateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务开始日期" prop="planStartDate">
            <el-date-picker
              v-model="sopFrom.planStartDate"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="模板状态" prop="wxNumber">
            <el-radio-group v-model="sopFrom.wxNumber">
              <el-radio :label="0">xiaoxiong01</el-radio>
              <el-radio :label="1">xiaoxiong01</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="chooseGroup"
            >选择群</el-button
          >
        </el-form>
      </el-card>
      <div ref="tableContainer">
        <ele-table
          :tableSize="'small'"
          :dataList="tableData"
          :tableHeight="tableHeight"
        >
          <el-table-column
            label="序号"
            prop="a"
            align="center"
          ></el-table-column>
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
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="editStyle">
                <el-popconfirm
                  confirmButtonText="YES"
                  cancelButtonText="算了"
                  icon="el-icon-info"
                  iconColor="red"
                  title="你确定要删除该项内容吗？"
                  @onConfirm="confirmDelRow"
                >
                  <span @click="deleteTablerow(scope.row, '1')" slot="reference"
                    >删除</span
                  >
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </ele-table>
      </div>
      <div class="bottom_choose">
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </div>
      <el-dialog title="选择群" :visible.sync="dialogGroupVisible" width="70%">
        <choose-group></choose-group>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import EleTable from '@/components/Table/EleTable'
import ChooseGroup from './components/chooseGroup'
export default {
  data() {
    return {
      tableHeight: 'auto',
      dialogGroupVisible: false,
      tableData: [
        {
          a: 1,
          b: '完课提醒全部销售',
          c: '完课提醒',
          d: 'xiaoxong01',
          e: '11'
        },
        {
          a: 1,
          b: '完课提醒全部销售',
          c: '完课提醒',
          d: 'xiaoxong01'
        }
      ],
      sopFrom: {
        taskName: '',
        planTemplate: '',
        planStartDate: '',
        wxNumber: ''
      },
      templateList: [
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
    }
  },
  components: {
    EleTable,
    ChooseGroup
  },
  mounted() {
    this.calcTableHeight()
  },
  computed: {},
  methods: {
    deleteTablerow(row, type) {
      console.log(row, type)
    },
    // 选择群
    chooseGroup() {
      this.dialogGroupVisible = true
    },
    /** 表格删除某一行确认按钮 */
    confirmDelRow() {
      console.log('删除了')
    },
    // 计算表格高度
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 120
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.new-plan {
  background: #ffffff;
}
.header {
  .tip {
    margin-bottom: 20px;
  }
  .sop-form {
    font-size: 12px;
  }
}
.editStyle {
  display: flex;
  justify-content: space-around;
  span {
    color: #2a75ed;
    cursor: pointer;
  }
}
.bottom_choose {
  display: flex;
  justify-content: center;
}
</style>
