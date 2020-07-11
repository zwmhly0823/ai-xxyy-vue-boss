<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-01 13:24:40
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-11 12:05:36
 -->
<template>
  <div>
    <div v-show="showChoiceModel">
      <h3 style="color:#606266;">选择物流地址</h3>
      <div class="choiceAddRess">
        <template v-if="addressList.length != 0">
          <el-radio-group v-model="addressVal">
            <el-radio
              @change="onAddressVal(item)"
              class="mt-20"
              v-for="item in addressList"
              :key="item.id"
              :label="item.id"
            >
              <span>{{ item.receiptName }}{{ item.receiptTel }}</span
              ><br />
              <span v-if="item.province == item.city"
                >{{ item.city }}{{ item.area }}</span
              >
              <span v-else
                >{{ item.province }}{{ item.city }}{{ item.area }}</span
              >
            </el-radio>
          </el-radio-group>
        </template>
        <template v-else>
          <div class="choiceAddRess" style="color: #8e8e8e;font-size:15px;">
            无可用地址
          </div>
        </template>
      </div>
    </div>
    <h3 style="color:#606266;" v-show="showChoiceModel">填写物流信息</h3>
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
          v-model="areaSlist"
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
  </div>
</template>
<script>
import areaLists from '@/utils/area.json'
import { isToss, deepClone } from '@/utils/index'
export default {
  name: 'logisticsForm',
  props: {
    modifyFormData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showChoiceModel: {
      type: Boolean,
      default: true
    }
  },
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
      areaSlist: [],
      areaLists: areaLists,
      province: null,
      city: null,
      area: null,
      areaCode: null,
      street: null,
      addressVal: '',
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
      operatorId: '',
      addressList: []
    }
  },
  // watch: {
  //   modifyFormData(old, val) {
  //     console.log(val, old)
  //   }
  // },
  created() {
    this.getAddressList()
    console.log(this.modifyFormData)
    this.createdEcho()
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
    createdEcho() {
      // this.addressVal = this.modifyFormData.id
      this.ruleForm.receiptName = this.modifyFormData.row.receipt_name
      this.ruleForm.receiptTel = this.modifyFormData.row.mobile

      const provinces = this.areaLists.filter(
        (item) => item.label === this.modifyFormData.row.province
      )
      const citys = provinces[0].children.filter(
        (item) => item.label === this.modifyFormData.row.city
      )
      const areas = citys[0].children.filter(
        (item) => item.label === this.modifyFormData.row.area
      )
      this.province = provinces[0].label
      this.city = citys[0].label
      this.area = areas[0].label
      this.areaSlist = [provinces[0].value, citys[0].value, areas[0].value]
      this.ruleForm.addressDetail = this.modifyFormData.row.address_detail
    },
    // 选择地址
    onAddressVal(data) {
      this.ruleForm.receiptName = data.receiptName
      this.ruleForm.receiptTel = data.receiptTel
      const provinces = this.areaLists.filter(
        (item) => item.label === data.province
      )
      const citys = provinces[0].children.filter(
        (item) => item.label === data.city
      )
      const areas = citys[0].children.filter((item) => item.label === data.area)
      this.areaSlist = [provinces[0].value, citys[0].value, areas[0].value]
      this.province = provinces[0].label
      this.city = citys[0].label
      this.area = areas[0].label
      this.ruleForm.addressDetail = data.addressDetail
    },
    getAddressList() {
      if (!this.modifyFormData.userid) return false
      this.$http.Express.getAddressList(this.modifyFormData.userid).then(
        (res) => {
          const _data = res.payload
          this.addressList = _data
          console.log(
            this.addressList,
            'this.addressListthis.addressListthis.addressList'
          )

          // _data.forEach((res) => {
          //   if (+this.modifyFormData.addressid === +res.id) {
          //     this.addressVal = res.id
          //     this.ruleForm.receiptName = res.receiptName
          //     this.ruleForm.receiptTel = res.receiptTel

          //     const provinces = this.areaLists.filter(
          //       (item) => item.label === res.province
          //     )
          //     const citys = provinces[0].children.filter(
          //       (item) => item.label === res.city
          //     )
          //     const areas = citys[0].children.filter(
          //       (item) => item.label === res.area
          //     )
          //     this.province = provinces[0].label
          //     this.city = citys[0].label
          //     this.area = areas[0].label
          //     this.areaSlist = [
          //       provinces[0].value,
          //       citys[0].value,
          //       areas[0].value
          //     ]
          //     this.ruleForm.addressDetail = res.addressDetail
          //   }
          // })
        }
      )
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
      this.province = provinces[0].label
      this.city = citys[0].label
      this.area = areas[0].label
      this.areaCode = data[2]
      this.street = data[3]
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
        addressId: this.modifyFormData.row.address_id,
        userId: this.modifyFormData.userid,
        expressId: this.modifyFormData.id,
        receiptName: this.ruleForm.receiptName,
        receiptTel: this.ruleForm.receiptTel,
        province: this.province,
        city: this.city,
        area: this.area,
        street: this.street,
        addressDetail: this.ruleForm.addressDetail
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.Express.updateExpressAddressNew(params)
            .then((res) => {
              if (res.data) {
                return
              }
              if (res.code === 0) {
                this.$message({
                  message: '地址修改成功',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$emit('modifyAddressExpress', 1)
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
      this.$emit('modifyAddressExpress', 2)
    }
  }
}
</script>
<style lang="scss" scoped>
.choiceAddRess {
  max-height: 150px;
  overflow-y: scroll;
  .mt-20 {
    margin-top: 20px;
    &:nth-child(1) {
      margin-top: 0px;
    }
  }
}
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
