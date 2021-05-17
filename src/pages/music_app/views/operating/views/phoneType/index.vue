<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhaowenyu
 * @Date: 2020-06-24 17:01:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-12
-->
<template>
  <div class="app_phoneType">
    <div class="btnBox">
      <el-button
        size="mini"
        type="primary"
        style="margin-right: 10px"
        @click="showDialog"
      >
        添加机型
      </el-button>
    </div>
    <el-table :data="dataList">
      <el-table-column label="序号">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="机型型号">
        <template slot-scope="scope">
          {{ scope.row }}
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      width="500px"
      :title="title"
      :visible.sync="open"
      :before-close="cancel"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="机型型号" prop="phoneModel">
          <el-input size='mini' :maxlength="32" v-model="form.phoneModel"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialogBtnBox">
        <el-button
          size="mini"
          type="primary"
          style="float:right;"
          @click="addPhoneType"
        >
          确定添加
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      open: false,
      dataList: [],
      loading: false,
      title: '',
      form: {},
      rules: {
        phoneModel: [
          { required: true, message: '机型型号不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCurrentChange() {},
    getList() {
      this.loading = true
      this.$http.Operating.getPhoneTypeList().then((res) => {
        this.dataList = res.payload
        this.loading = false
      })
    },
    showDialog() {
      this.open = true
      this.title = '新增机型'
    },
    addPhoneType() {
      this.$http.Operating.addPhoneType(this.form).then((res) => {
        let code = res.code
        if (code == 0) {
          this.$message.success('机型添加成功')
        }
        this.open = false;
        this.getList()
      })
    },
    cancel() {
      this.form = {
        phoneModule: '',
      }
      this.open = false
    },
  },
}
</script>

<style lang="scss" scoped>
.app_phoneType {
  width: 100%;
  min-height: 80vh;
  box-sizing: border-box;
  padding: 20px;
  background: #fff;
  .btnBox {
    padding-bottom: 20px;
    border-bottom: 1px solid rgba($color: #999, $alpha: 0.8);
  }
}
.dialogBtnBox{
    padding:20px 0;
}
</style>
