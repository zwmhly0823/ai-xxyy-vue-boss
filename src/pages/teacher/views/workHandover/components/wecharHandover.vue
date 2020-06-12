<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-20 10:13:39
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-26 14:44:05
 -->
<template>
  <div class="wechar">
    <Handover
      :index="index"
      :tableList="tableList"
      :clearData="clearData"
      ref="handover"
    />
    <div class="wechar-button">
      <el-button type="primary" @click="handlHandover">开始交接</el-button>
    </div>
    <el-dialog title="交接确认" :visible.sync="dialogVisible" width="20%">
      <span
        >正在对{{
          handoverTeacherName
        }}交接，交接微信号时，微信号下关联的班级也会同时交接。交接后无法恢复</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureHandover">确 定</el-button>
      </span>
    </el-dialog>
    <div class="table-container" v-if="showTable">
      <h2>交接明细</h2>
      <el-table :data="tableList" style="width: 100%">
        <el-table-column
          prop="sendWeixinNo"
          label="微信号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="sendRealName"
          label="交出方"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="sendDepartmentName"
          label="交出方所在部门"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="receiveRealName"
          label="接收方"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="receiveDepartmentName"
          label="接收方所在部门"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
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
      weixinIds: [],
      tableList: [],
      showTable: false,
      clearData: false
    }
  },
  methods: {
    handlHandover() {
      const children = this.$refs.handover
      delete children.form.receiveWxId
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
      this.weixinIds = children.receiveTeacher.map((item, index) => {
        return item.weixinId
      })
      this.form = Object.assign({}, children.form)
      this.handoverTeacherName = children.handoverTeacherName
      this.dialogVisible = true
    },
    async sureHandover() {
      const { form, weixinIds } = this
      try {
        const res = await this.$http.WorkerHandover.postHandoverWechat(
          form.handoverTeacherId,
          form.receiveTeacherId,
          weixinIds.join(',')
        )
        if (res.code === 0) {
          this.clearData = true
          this.dialogVisible = false
          this.showTable = true
          this.$message.success('微信交接成功～')
          this.tableList = res.payload
          setTimeout(() => {
            this.clearData = false
          }, 3000)
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    Handover: () => import('./handover')
  }
}
</script>

<style lang="scss" scoped>
.wechar {
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
    margin: 60px 0 0 60px;
    h2 {
      margin: 40px 0 0 0;
    }
  }
}
</style>
