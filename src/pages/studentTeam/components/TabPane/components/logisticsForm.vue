<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-01 13:24:40
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-01 15:49:55
 -->
<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="收货人姓名" prop="receiptName">
      <el-input v-model="ruleForm.receiptName"></el-input>
    </el-form-item>
    <el-form-item label="收货人电话" prop="receiptTel">
      <el-input v-model="ruleForm.receiptTel"></el-input>
    </el-form-item>
    <!-- <span class="areaLists-css">收货人地址</span> -->
    <el-form-item label="收货人地址">
      <el-cascader
        placeholder="省/市/区"
        :options="areaLists"
        size="medium"
        filterable
        @change="handleChange"
      >
      </el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" prop="addressDetail">
      <el-input v-model="ruleForm.addressDetail"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        size="small"
        style="width: 100px;"
        type="primary"
        @click="submitForm('ruleForm')"
        >保存</el-button
      >
      <el-button
        size="small"
        style="width: 100px;"
        @click="resetForm('ruleForm')"
        >取消</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import areaLists from '@/utils/area.json'
import { isToss } from '@/utils/index'
export default {
  name: 'logisticsForm',
  props: ['formData'],
  data() {
    return {
      areaLists: areaLists,
      province: null,
      city: null,
      area: null,
      areaCode: null,
      ruleForm: {
        receiptName: '',
        receiptTel: '',
        addressDetail: ''
      },
      rules: {
        receiptName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        receiptTel: [
          {
            required: true,
            maxlength: 11,
            message: '请填写电话',
            trigger: 'blur'
          }
        ],
        addressDetail: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      operatorId: ''
    }
  },
  methods: {
    // 级联城市级联
    handleChange(data) {
      const provinces = this.areaLists.filter(
        (item) => +item.value === +data[0]
      )
      const citys = provinces[0].children.filter(
        (item) => +item.value === +data[1]
      )
      const areas = citys[0].children.filter((item) => +item.value === +data[2])
      this.province = provinces[0].label
      this.city = citys[0].label
      this.area = areas[0].label
      this.areaCode = data[2]
    },
    submitForm(formName) {
      const teacher = isToss()
      if (teacher) {
        this.operatorId = teacher
      } else {
        const staff = JSON.parse(localStorage.getItem('staff'))
        this.operatorId = staff.id
      }
      console.log(this.formData)
      const params = {
        operatorId: this.operatorId,
        orderId: this.formData.orderid,
        addressId: '',
        expressId: this.formData.id,
        userId: this.formData.userid,
        receiptName: this.ruleForm.receiptName,
        receiptTel: this.ruleForm.receiptTel,
        province: this.province,
        city: this.city,
        area: this.area,
        addressDetail: this.ruleForm.addressDetail,
        areaCode: this.areaCode,
        expressNo: '',
        expressCompany: '',
        expressCompanyNu: ''
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.Express.editAddressAndExpressForOrder(params).then(
            (res) => {
              this.$message({
                message: '地址添加成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$emit('addExpress', 1)
              }, 1000)
            }
          )
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('addExpress', 2)
    }
  }
}
</script>
<style lang="scss" scoped>
.areaLists-css {
  position: relative;
  top: 30px;
  left: 18px;
  font-size: 14px;
  font-weight: 600;
}
</style>
<style lang="scss">
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  content: '';
}
</style>
