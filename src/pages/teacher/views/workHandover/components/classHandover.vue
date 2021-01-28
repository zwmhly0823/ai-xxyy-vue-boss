<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-20 10:12:30
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-21 15:59:06
 -->
<template>
  <div class="class">
    <Handover
      :index="index"
      :clearSelectData="clearSelectData"
      ref="handover"
    />
    <div class="class-button">
      <el-button type="primary" @click="handlHandover">开始交接</el-button>
    </div>
    <el-dialog title="交接确认" :visible.sync="dialogVisible" width="20%">
      <span>正在对{{ handoverTeacherName }}交接，交接后无法恢复</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureHandover">确 定</el-button>
      </span>
    </el-dialog>
    <div class="table-container" v-if="showTable">
      <h2>交接明细</h2>
      <el-table :data="tableList" style="width: 100%">
        <el-table-column
          prop="teamName"
          label="班级名称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="sendWeixinNo"
          label="交出方微信号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="sendRealName"
          label="交出方老师"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="sendDepartmentName"
          label="交出方所在部门"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="receiveWeixinNo"
          label="接收方微信号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="receiveRealName"
          label="接收方老师"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="receiveDepartmentName"
          label="接收方所在部门"
        ></el-table-column>
      </el-table>
      <m-pagination
        :current-page="query.pageNumber"
        :page-size="query.pageSize"
        :total="+totalElements"
        :showPager="true"
        @current-change="pageChange_handler"
        open="calc(100vw - 95px - 100px)"
        close="calc(100vw - 23px - 50px)"
      />
    </div>
  </div>
</template>

<script>
import { formatTeamNameSup } from '@/utils/supList'
export default {
  props: {
    tabIndex: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      index: this.tabIndex,
      dialogVisible: false,
      handoverTeacherName: '',
      form: {},
      studentSteams: [],
      teacherWechatId: [],
      tableList: [],
      showTable: false,
      query: {
        pageSize: 15,
        pageNumber: 1
      },
      totalElements: 0,
      clearSelectData: false
    }
  },
  methods: {
    handlHandover() {
      const children = this.$refs.handover
      const isNullStr = Object.values(children.form).some((item, index) => {
        return item === ''
      })
      if (children.receiveTeacher.length === 0 || isNullStr) {
        this.$message({
          message: '请先填写交接信息再提交！',
          type: 'warning'
        })
        return
      }
      this.studentSteams = children.receiveTeacher.map((item, index) => {
        return item.id
      })
      this.teacherWechatId = children.receiveTeacher.map((item, index) => {
        return item.teacherWechatId
      })
      this.form = Object.assign({}, children.form)
      this.handoverTeacherName = children.handoverTeacherName
      this.dialogVisible = true
    },
    async sureHandover() {
      const { form, studentSteams, teacherWechatId } = this
      try {
        const res = await this.$http.WorkerHandover.postHandoverSteam(
          studentSteams.join(','),
          form.handoverTeacherId,
          teacherWechatId.join(','),
          form.receiveTeacherId,
          form.receiveWxId
        )
        if (res.code === 0) {
          this.dialogVisible = false
          this.clearSelectData = true
          this.$message.success('班级交接成功～')
          await this.getList()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getList() {
      const { form, query } = this
      try {
        const res = await this.$http.WorkerHandover.fishHandvorGetTable(
          form.handoverTeacherId,
          query.pageSize,
          query.pageNumber
        )
        this.showTable = true
        this.tableList =
          res.content &&
          res.content.map((item) => {
            item.teamName = formatTeamNameSup(item.teamName) || '-'
            return item
          })
        this.totalElements = res.totalElements
        this.clearSelectData = false
      } catch (error) {
        console.log(error)
      }
    },
    async pageChange_handler(page) {
      this.query.pageNumber = page
      await this.getList()
    }
  },
  components: {
    Handover: () => import('./handover'),
    MPagination: () => import('@/components/MPagination/index.vue')
  }
}
</script>

<style lang="scss" scoped>
.class {
  &-button {
    text-align: center;
  }
  /deep/ .dialog-footer {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: 0 auto;
  }
  .table-container {
    margin: 60px 0 50px 60px;
    h2 {
      margin: 40px 0 0 0;
    }
  }
}
</style>
