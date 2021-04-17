<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-06-10 14:38:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-17 16:15:43
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
        <el-table-column label="日志时间" align="center">
          <template slot-scope="scope">
            {{ timestamp(scope.row.ctime, 2) }}
          </template>
        </el-table-column>

        <el-table-column label="登陆时间" align="center">
          <template slot-scope="scope">
            {{ timestamp(scope.row.login_time, 2) }}
          </template>
        </el-table-column>
        <el-table-column prop="ogin_source " label="登陆来源" align="center">
        </el-table-column>

        <el-table-column prop="ostype" label="系统类型" align="center">
        </el-table-column>
        <el-table-column prop="ogin_source" label="登陆来源" align="center">
        </el-table-column>
        <el-table-column prop="old_token" label="旧token" align="center">
        </el-table-column>
        <el-table-column prop="new_token" label="新token" align="center">
        </el-table-column>
        <el-table-column prop="device_id" label="设备唯一识别码" width="130" align="center">
        </el-table-column>
        <el-table-column prop="device_model" label="设备型号" align="center">
        </el-table-column>
        <el-table-column prop="device_type" label="设备类型" align="center">
        </el-table-column>
        <el-table-column
          prop="user_agent"
          label="设备名称/系统版本号/设备型号"
          width="200"
          align="center"
        >
        </el-table-column>
        <el-table-column label="项目名称" prop="appname" align="center">
        </el-table-column>
        <el-table-column
          label="app 版本号"
          prop="appversion"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="创建的build号"
          prop="buildcode"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="系统版本号"
          prop="system_version"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column label="渠道" prop="channel" align="center" width="120">
        </el-table-column>
        <el-table-column
          label="应用市场"
          prop="  market"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="运营商"
          prop="carrier"
          align="center"
          width="120"
        >
        </el-table-column>
          <el-table-column
          label="分辨率"
          prop="ratio"
          align="center"
          width="120"
        >
        </el-table-column>
           <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.team"
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import { timestamp } from '@/utils/index'
export default {
  data() {
    return {
      timestamp,
      cellphone: '',
      tableData: [],
      userId: '',
      // 当前页数
      currentPage: 1,
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
            this.userId = data.UserExtendsList[0].id
            let queryObj = {}
            queryObj.uid = this.userId

            console.log(queryObj, 'queryObj')
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
      })
    },
  },
  handleClick(row) {
    
  }
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
