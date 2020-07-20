<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-01 13:24:40
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-20 17:16:05
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
        :props="{ expandTrigger: 'hover' }"
        @active-item-change="handleItemChange"
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
import { isToss, deepClone } from '@/utils/index'
export default {
  name: 'logisticsForm',
  props: ['formData'],
  data() {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入收货姓名'))
      } else {
        const reg = /[^\s]/
        if (!reg.test(value)) {
          callback(new Error('收货人姓名，开头不能有空格'))
        }
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        const reg = /^1[3456789]\d{9}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确手机号'))
        }
        callback()
      }
    }
    return {
      areaLists: areaLists,
      province: null,
      city: null,
      area: null,
      areaCode: null,
      street: null,
      levelFourList: [],
      ruleForm: {
        receiptName: '',
        receiptTel: '',
        addressDetail: ''
      },
      rules: {
        receiptName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        receiptTel: [
          {
            maxlength: 11,
            validator: validatePass,
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
    handleItemChange(data) {
      const addressList = deepClone(this.areaLists)
      addressList.forEach((res) => {
        if (res.value === data[0]) {
          res.children.forEach((ele) => {
            if (ele.value === data[1]) {
              ele.children.forEach((val) => {
                val.children = [{ label: '暂不选择', value: '' }]
                if (val.value === data[2]) {
                  this.$http.Express.getCenterAddressTownList(val.value).then(
                    (vlaue) => {
                      const _data = vlaue.payload
                      _data.forEach((codeVal) => {
                        const add = {
                          label: codeVal.townName,
                          value: codeVal.townCode
                        }
                        val.children.push(add)
                      })
                      this.levelFourList = _data
                    }
                  )
                }
              })
            }
          })
        }
      })
      this.areaLists = addressList
    },
    // 级联城市级联
    handleChange(data) {
      const provinces = this.areaLists.filter(
        (item) => +item.value === +data[0]
      )
      const citys = provinces[0].children.filter(
        (item) => +item.value === +data[1]
      )
      const areas = citys[0].children.filter((item) => +item.value === +data[2])
      const streets = this.levelFourList.filter(
        (item) => +item.townCode === +data[3]
      )
      this.province = provinces[0].label
      this.city = citys[0].label
      this.area = areas[0].label
      this.areaCode = data[2]
      this.street = streets[0].townName
    },
    submitForm(formName) {
      const teacher = isToss()
      if (teacher) {
        this.operatorId = teacher
      } else {
        const staff = JSON.parse(localStorage.getItem('staff'))
        this.operatorId = staff.id
      }
      const params = {
        operatorId: this.operatorId,
        // orderId: this.formData.orderid,
        addressId: '',
        userId: this.formData.id,
        expressId: '',
        // userId: this.formData.userid,
        receiptName: this.ruleForm.receiptName,
        receiptTel: this.ruleForm.receiptTel,
        province: this.province,
        city: this.city,
        area: this.area,
        street: this.street,
        addressDetail: this.ruleForm.addressDetail
        // areaCode: this.areaCode,
        // expressNo: '',
        // expressCompany: '',
        // expressCompanyNu: ''
      }
      console.log(params)
      if (!this.province) {
        this.$message({
          message: '请选择收货人地址'
        })
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.User.updateExpressAddressNew(params)
            .then((res) => {
              if (res.data) {
                return
              }
              if (res.status) {
                this.$message({
                  message: '地址添加成功',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$emit('addExpress', 1)
                }, 1000)
              }
            })
            .catch((err) => {
              console.log('err111', err)
            })
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
