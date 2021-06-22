<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-01 13:24:40
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-05-29 23:12:33
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
    <el-form-item label="收货人电话" prop="receiptTel" required>
      <el-input
        type="number"
        maxlength="11"
        min="1"
        oninput="if(value.length>11)value=value.slice(0,11)"
        v-model="ruleForm.receiptTel"
      ></el-input>
    </el-form-item>
    <!-- <span class="areaLists-css">收货人地址</span> -->
    <el-form-item label="收货人地址" prop="area">
      <el-cascader
        class="cascader-list"
        placeholder="省/市/区"
        :options="areaLists2"
        v-model="ruleForm.area"
        size="medium"
        filterable
        @change="handleChange"
        @active-item-change="handleItemChange"
      >
      </el-cascader>
    </el-form-item>
    <el-form-item
      label="详细地址"
      prop="addressDetail"
      :class="$style.addressDetail"
    >
      <el-input
        type="textarea"
        resize="none"
        v-model="ruleForm.addressDetail"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        size="small"
        style="width: 100px"
        type="primary"
        @click="submitForm('ruleForm')"
        >保存</el-button
      >
      <el-button
        size="small"
        style="width: 100px"
        @click="resetForm('ruleForm')"
        >取消</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'logisticsForm',
  props: ['userId'],
  data() {
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
      areaLists2: [],
      chooseAddress: [],
      levelFourList: [],
      province: null,
      city: null,
      area: null,
      street: null,
      areaCode: null,
      ruleForm: {
        receiptName: '',
        receiptTel: '',
        addressDetail: '',
      },
      rules: {
        receiptName: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' },
        ],
        receiptTel: [
          {
            maxlength: 11,
            validator: validatePass,
            trigger: 'blur',
          },
        ],
        area: [{ required: true, message: '请选择具体市区', trigger: 'blur' }],
        addressDetail: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      operatorId: '',
    }
  },
  created() {
    this.getAreaLists()
  },
  methods: {
    // 获取地址选项-2
    handleItemChange(data) {
      const addressList = this.areaLists2
      addressList.forEach((res) => {
        if (data[0] === res.id) {
          res.children.forEach((ele) => {
            if (data[1] === +ele.cityCode + 999) {
              ele.children.forEach((val) => {
                if (data[2] === val.countyCode) {
                  this.$http.Express.getCenterAddressTownList(data[2]).then(
                    (data) => {
                      const _data = data.payload
                      _data.forEach((codeVal) => {
                        const add = {
                          label: codeVal.townName,
                          value: codeVal.townCode,
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
    },
    // 获取地址选项
    async getAreaLists() {
      this.$http.Express.getCenterAddressList().then((res) => {
        const _data = res.payload.data
        _data.forEach((ele) => {
          ele.label = ele.provinceName
          ele.value = ele.id
          ele.children = ele.citys
          ele.children.forEach((val) => {
            val.label = val.cityName
            val.value = +val.cityCode + 999
            val.children = val.countys
            val.children.forEach((_value) => {
              _value.label = _value.countyName
              _value.value = _value.countyCode
              _value.children = [{ label: '暂不选择', value: '' }]
            })
          })
        })
        this.areaLists2 = _data
      })
    },
    // 级联城市级联
    handleChange(data) {
      const provinces = this.areaLists2.filter(
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
      this.street = data[3] ? streets[0].townName : ''
    },
    submitForm(formName) {
      const params = {
        userId: this.userId,
        receiptName: this.ruleForm.receiptName,
        receiptTel: this.ruleForm.receiptTel,
        province: this.province,
        city: this.city,
        area: this.area,
        street: this.street,
        addressDetail: this.ruleForm.addressDetail,
        areaCode: this.areaCode,
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('addExpress', params)
          setTimeout(() => {
            this.$message({
              message: '地址修改成功',
              type: 'success',
            })
          }, 1000)
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs.ruleForm.resetFields()
      this.$emit('cancel', '')
      this.chooseAddress = []
      this.province = []
      this.city = []
      this.area = []
      this.areaCode = []
    },
  },
}
</script>
<style lang="scss" scoped>
.demo-ruleForm {
  padding: 30px;
}
</style>
<style lang="scss">
.el-cascader-panel {
  height: 300px;
}
</style>
<style lang="scss" module>
.addressDetail {
  input {
    height: 60px;
    text-align: left;
  }
}
</style>
