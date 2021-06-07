<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-05-07 10:48:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-10 16:23:13
 -->
<template>
  <div class="drawer-box">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="一级渠道" prop="channelOne">
        <el-select
          @change="onChannelOne"
          v-model="ruleForm.channelOne"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in channelOneList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级渠道" prop="channelTwo">
        <el-select
          v-model="ruleForm.channelTwo"
          :disabled="channelTwoDisabled"
          @visible-change="channelTwo"
          @change="onChannelTwo"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="(item, index) in channelTwoList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级渠道" prop="channelThree">
        <el-input
          :disabled="channelThreeDisabled"
          v-model="ruleForm.channelThree"
          placeholder="请输入三级渠道"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道排序" prop="sort">
        <el-input
          placeholder="请输入渠道排序"
          v-model="ruleForm.sort"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道等级" prop="channelLevel">
        <el-select
          v-model="ruleForm.channelLevel"
          placeholder="请选择"
          clearable
        >
          <el-option label="S" :value="2">S</el-option>
          <el-option label="A" :value="1">A</el-option>
          <el-option label="B" :value="0">B</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模版" prop="experience">
        <el-select v-model="ruleForm.experience" placeholder="请选择" clearable>
          <el-option
            v-for="item in channelList"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道备注" prop="desc">
        <el-input
          placeholder="请输入备注"
          type="textarea"
          v-model="ruleForm.desc"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否支持导入订单" prop="export" required>
        <el-radio-group v-model="ruleForm.export">
          <el-radio :label="0">支持</el-radio>
          <el-radio :label="1">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联合同" required v-if="ruleForm.export == 0">
        <div v-if="tableData.length === 0">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="dialogVisible = true"
            >选择合同</el-button
          >
        </div>
        <div v-else>
          <el-table :data="tableData" border style="width: 95%">
            <el-table-column prop="contract.id" label="合同id" width="60">
            </el-table-column>
            <el-table-column prop="contract.contractName" label="合同名称">
            </el-table-column>
            <el-table-column
              prop="contractPriceDetailList"
              label="实际结算课单价（元）"
              min-width="125"
            >
              <template slot-scope="scope">
                <p v-if="scope.row.contractPriceDetailList.length === 0">-</p>
                <p
                  v-else
                  v-for="(item, index) in scope.row.contractPriceDetailList"
                  :key="index"
                  :style="{
                    color: item.priceType == 'DISCOUNT' ? '#2E8B57' : '#606266',
                    padding: 0,
                  }"
                >
                  <!-- DISCOUNT 为绿色 -->
                  {{ item.packageName + ' ' + item.settlePrice }}
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="contractPriceDetailList"
              label="订单入库价格（元）"
              min-width="125"
            >
              <template slot-scope="scope">
                <p v-if="scope.row.contractPriceDetailList.length === 0">-</p>
                <p
                  v-else
                  v-for="(item, index) in scope.row.contractPriceDetailList"
                  :key="index"
                  :style="{
                    color: item.priceType == 'DISCOUNT' ? '#2E8B57' : '#606266',
                    padding: 0,
                  }"
                >
                  {{ item.packageName + ' ' + item.orderPrice }}
                </p>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="dialogVisible = true"
            >更换合同</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="渠道状态" prop="status">
        <el-switch
          v-model="ruleForm.status"
          active-text="启用"
          inactive-text="停用"
          active-value="1"
          inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item>
        <div style="margin-left: 50px">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      title="选择关联合同"
      append-to-body
      width="80%"
      :visible.sync="dialogVisible"
    >
      <contract-dialog
        ref="contractDialog"
        @close="visibleHide"
        @getData="getData"
      ></contract-dialog>
    </el-dialog>
  </div>
</template>

<script>
import contractDialog from './contractChannel'
import { channelList } from '@/utils/supList'
export default {
  components: { contractDialog },
  data() {
    var channelSort = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入渠道排序'))
      } else {
        const reg = /^\d+$|^\d+[.]?\d+$/
        if (!reg.test(value)) {
          callback(new Error('渠道排序只能输入数字'))
        }
        callback()
      }
    }
    return {
      tableData: [],
      dialogVisible: false,
      channelTwoDisabled: true,
      channelThreeDisabled: true,
      channelOneList: [],
      channelTwoList: [],
      ruleForm: {
        channelOne: '',
        channelTwo: '',
        channelThree: '',
        sort: '',
        desc: '',
        status: '1',
        export:1,
        experience: '',
        channelLevel: '',
        createUser: JSON.parse(localStorage.getItem('staff')).realName,
      },
      rules: {
        channelOne: [
          { required: true, message: '请选择一级渠道', trigger: 'change' },
        ],
        channelTwo: [
          { required: true, message: '请选择二级渠道', trigger: 'change' },
        ],
        channelLevel: [
          { required: true, message: '请选择渠道等级', trigger: 'change' },
        ],
        sort: [{ required: true, validator: channelSort, trigger: 'blur' }],
      },
      channelList: channelList,
    }
  },
  created() {
    this.getChannelOne()
  },
  methods: {
    visibleHide() {
      this.dialogVisible = false
    },
    getData(val) {
      if (val && val.length === 1) {
        this.tableData = val
        this.dialogVisible = false
      }
    },
    channelTwo() {
      this.$http.Operating.getChannelAndClass(this.ruleForm.channelOne).then(
        (res) => {
          const data = res.payload.channelClassList
          data.forEach((res) => {
            res.label = res.channelClassName
            res.value = +res.id
          })
          this.channelTwoList = data
        }
      )
    },
    getChannelOne() {
      this.$http.Operating.getChannelAndClass(0).then((res) => {
        const data = res.payload.channelClassList
        data.forEach((res) => {
          res.label = res.channelClassName
          res.value = +res.id
        })
        this.channelOneList = data
      })
    },
    onChannelOne(data) {
      if (data) {
        this.channelTwoDisabled = false
      } else {
        this.channelTwoDisabled = true
        this.channelThreeDisabled = true
        this.ruleForm.channelTwo = ''
        this.ruleForm.channelThree = ''
      }
    },
    onChannelTwo(data) {
      if (data) {
        this.channelThreeDisabled = false
      } else {
        this.channelThreeDisabled = true
        this.ruleForm.channelThree = ''
      }
    },
    //   提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const props = {
            channelClassId: this.ruleForm.channelTwo, // 二级渠道分类id
            channelOuterName: this.ruleForm.channelThree, // 渠道对外名称
            channelInnerName: this.ruleForm.channelThree, // 渠道对管理员名称默认两者一致
            channelSort: this.ruleForm.sort, // 渠道排序
            status: this.ruleForm.status, // 1开启0禁用
            remarks: this.ruleForm.desc,
            channelLink: this.ruleForm.experience,
            channelLevel: this.getLevel(this.ruleForm.channelLevel), // 渠道等级
            subject: 'MUSIC_APP',
            createUser: this.ruleForm.createUser,
            contractId:
              this.ruleForm.export !== '0'
                ? 0
                : this.tableData.map((item) => item.contract.id)[0],
            contractName:
              this.ruleForm.export !== '0'
                ? null
                : this.tableData.map((item) => item.contract.contractName)[0],
            contractBody:
              this.ruleForm.export !== '0'
                ? null
                : this.tableData.map((item) => item.contract.contractBody)[0]
          }
          this.$http.Operating.createChannel(props).then((res) => {
            if (res.code === 0) {
              this.$message.success('渠道添加成功')
              this.$refs[formName].resetFields()
              this.channelTwoDisabled = true
              this.channelThreeDisabled = true
              this.ruleForm.channelTwo = ''
              this.ruleForm.channelThree = ''
              this.ruleForm.channelLevel = ''
              this.$emit('addChannelShow', false)
              this.$emit('addChannelShowBtn', 1)
            }
          })
        } else {
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.channelTwoDisabled = true
      this.channelThreeDisabled = true
      this.ruleForm.channelTwo = ''
      this.ruleForm.channelThree = ''
      this.ruleForm.channelLevel = ''
      this.tableData = []
      this.$emit('addChannelShow', false)
    },
    // 转换渠道级别为S、A、B
    getLevel(val) {
      var levelNames = { 0: 'B', 1: 'A', 2: 'S' }
      if (Object.prototype.hasOwnProperty.call(levelNames, val)) {
        return levelNames[val]
      }
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
.drawer-box {
  padding-left: 20px;
  p {
    padding-top: 30px;
    padding-left: 30px;
  }
  a {
    margin-left: 10px;
    color: #2a75ed;
  }
  .cahnnel-change {
    position: absolute;
    right: 0;
    top: 45px;
  }
}
</style>
