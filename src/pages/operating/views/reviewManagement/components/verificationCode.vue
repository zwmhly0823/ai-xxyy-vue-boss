<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-06-10 14:38:58
 * @LastEditors: liukun
 * @LastEditTime: 2020-06-11 20:03:04
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
        <el-table-column prop="mobile" label="用户手机号" align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="短信内容"
          width="360"
          align="center"
        >
        </el-table-column>
        <el-table-column label="验证码" prop="code" align="center">
        </el-table-column>
        <el-table-column label="发送时间" align="center">
          <template slot-scope="scope">
            {{
              new Date(Number(scope.row.ctime))
                .toLocaleString()
                .replace(/[上下午]+/g, '')
            }}
          </template>
        </el-table-column>
        <el-table-column label="发送结果" align="center" width="120">
          <template slot-scope="scope">
            {{
              { FAILED: '发送失败', SUCCESS: '发送成功', VAILD: '验证通过' }[
                scope.row.status
              ]
            }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      cellphone: '',
      tableData: []
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
          const { code, payload } = await this.$http.Operating.getVerification(
            newValue
          ).catch((err) => {
            console.info(err)
            this.$message({
              message: '接口报错',
              type: 'error'
            })
            this.tableData = []
          })
          if (!code && payload.length !== 0) {
            this.tableData = payload
          } else {
            this.$message({
              message: '数据获取失败',
              type: 'warning'
            })
            this.tableData = []
          }
        }
      }
    }
  },
  created() {
    // this.$http.Operating.getVerification('13512345678')
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
