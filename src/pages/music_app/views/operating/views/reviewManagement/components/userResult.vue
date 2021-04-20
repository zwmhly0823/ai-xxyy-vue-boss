<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-06-10 14:38:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-17 18:36:48
-->
<template>
  <section class="bianju10">
    <div class="seartch_item">
      <div class="title">
        <i class="el-icon-setting"></i>
        <span>查询条件</span>
      </div>
      <div class="seartch_item_z">
        <el-form>
          <el-form-item
            label="用户手机号:"
            label-position="right"
            label-width="150px"
          >
            <el-input
              clearable
              placeholder="请键入用户手机号进行查询"
              v-model="cellphone"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="result_item">
      <div class="title">
        <i class="el-icon-s-data"></i>
        <span>查询结果</span>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="日志时间" align="center" width="150">
          <template slot-scope="scope">
            {{ timestamp(scope.row.ctime, 2) }}
          </template>
        </el-table-column>

        <el-table-column label="登陆时间" align="center" width="150">
          <template slot-scope="scope">
            {{ timestamp(scope.row.login_time, 2) }}
          </template>
        </el-table-column>
        <el-table-column prop="ogin_source" label="登陆来源" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.ogin_source ? scope.row.ogin_source : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="ostype" label="系统类型" align="center">
        </el-table-column>
        <el-table-column
          prop="device_id"
          label="设备唯一识别码"
          width="130"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="device_model" label="设备型号" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.device_model ? scope.row.device_model : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="device_type" label="设备类型" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.device_type ? scope.row.device_type : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_agent"
          label="设备名称/系统版本号/设备型号"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.user_agent ? scope.row.user_agent : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="appname" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.appname ? scope.row.appname : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="app 版本号"
          prop="appversion"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.appversion ? scope.row.appversion : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="创建的build号"
          prop="buildcode"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.buildcode ? scope.row.buildcode : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="系统版本号"
          prop="system_version"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <p>
              {{ scope.row.system_version ? scope.row.system_version : '-' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="渠道" prop="channel" align="center" width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.channel ? scope.row.channel : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="应用市场"
          prop="market"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.market ? scope.row.market : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="运营商"
          prop="carrier"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.carrier ? scope.row.carrier : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="分辨率" prop="ratio" align="center" width="120">
          <template slot-scope="scope">
            <p>{{ scope.row.radio ? scope.row.radio : '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.team"
              @click="handleClick(scope.row.headers)"
              type="text"
              size="small"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :total="totalElements"
        @current-change="handleSizeChange"
        show-pager
        open="calc(100vw - 170px - 25px)"
        close="calc(100vw - 50px - 25px)"
      ></m-pagination>

      <el-dialog
        title="headers参数"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span style="white-space: pre-line">{{ HeadersValue }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import { timestamp } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
export default {
  components: {
    MPagination,
  },
  data() {
    return {
      timestamp,
      cellphone: '',
      dialogVisible: false,
      tableData: [],
      HeadersValue: '',
      userId: '',
      // 当前页数
      currentPage: 0,
      // 总页数
      totalPages: 0,
      totalElements: 0, // 总条数
    }
  },
  watch: {
    cellphone: {
      immediate: true,
      deep: true,
      async handler(newValue) {
        if (!newValue) {
          this.tableData = []
        }
        if (newValue.length === 11 && Number.isInteger(Number(newValue))) {
          const { data } = await this.$http.User.searchUserByPhone(
            newValue
          ).catch((err) => {
            console.info(err)
            this.$message({
              message: '接口报错',
              type: 'error',
            })
            this.tableData = []
          })
          if (data) {
            this.userId = data.UserExtendsList[0].u_id
            let queryObj = {}
            queryObj.uid = this.userId

            queryObj.device_id = { gt: 1 }
            this.UserLoginDataPage(queryObj, 1)
          } else {
            this.$message({
              message: '数据获取失败',
              type: 'warning',
            })
            this.tableData = []
          }
        }
      },
    },
  },
  created() {
    // this.$http.Operating.getVerification('13512345678')
  },
  methods: {
    UserLoginDataPage(queryObj = {}, page = 1) {
      this.$http.Order.UserLoginDataPage(
        `${JSON.stringify(queryObj)}`,
        page
      ).then((res) => {
        this.tableData = res.data.UserLoginDataPage.content
        this.totalElements = Number(res.data.UserLoginDataPage.totalElements)
        this.currentPage = Number(res.data.UserLoginDataPage.number)
      })
    },
    // 点击分页
    handleSizeChange(val) {
      let queryObj = {};
      queryObj.uid = this.userId;
      queryObj.device_id = { gt: 1 };
      this.currentPage = val
      this.UserLoginDataPage(queryObj, val)
    },
    handleClose(done) {
      done()
    },
    handleClick(row) {
      let reg = /,/g
      // this.HeadersValue = JSON.stringify(JSON.parse(row), null, 2)
      this.HeadersValue = row.replace(reg, ',\n')
      //将字符串转换成json对象
      this.dialogVisible = true
    },
  },
}
</script>

<style lang="scss" scoped>
.bianju10 {
  padding: 10px;
}
.seartch_item {
  background-color: #fff;
  margin-bottom: 10px;
}
.seartch_item_z {
  height: 80px;
  display: flex;
  align-items: center;
}
.el-input {
  width: 400px;
}
.result_item {
  background-color: #fff;
}
.title {
  padding-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  font-size: 18px;
  i {
    color: grey;
  }
  span {
    margin-left: 10px;
  }
}
</style>
