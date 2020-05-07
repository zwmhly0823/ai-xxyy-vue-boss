<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-05-07 10:48:30
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-07 15:12:00
 -->
<template>
  <div class="drawer-box">
    <h3>添加渠道</h3>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="一级渠道" prop="channelOne">
        <el-select
          @change="onChannelOne"
          v-model="ruleForm.channelOne"
          placeholder="请选择"
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
          @visible-change="onChannelTwo"
          placeholder="请选择"
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
        <el-select
          v-model="ruleForm.channelThree"
          :disabled="channelThreeDisabled"
          @visible-change="onChannelThree"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in channelThreeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道接连">
        <el-link type="primary">{{ link }}</el-link>
      </el-form-item>

      <el-form-item label="渠道备注" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      link: 'https://www.baidu.com',
      channelTwoDisabled: false,
      channelThreeDisabled: false,
      channelOneList: [],
      channelTwoList: [],
      channelThreeList: [],
      ruleForm: {
        channelOne: '',
        channelTwo: '',
        channelThree: '',
        desc: ''
      },
      rules: {
        channelOne: [
          { required: true, message: '请选择一级渠道', trigger: 'change' }
        ],
        channelTwo: [
          { required: true, message: '请选择二级渠道', trigger: 'change' }
        ],
        channelThree: [
          { required: true, message: '请选择三级渠道', trigger: 'change' }
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getChannelOne()
  },
  methods: {
    onChannelThree() {
      this.$http.Operating.getChannelAndClass(this.ruleForm.channelTwo).then(
        (res) => {
          const data = res.payload.channelList
          data.forEach((res) => {
            res.label = res.channelInnerName
            res.value = +res.id
          })
          this.channelThreeList = data
        }
      )
    },
    onChannelTwo() {
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
    onChannelOne() {
      console.log(this.ruleForm.channelOne, 'this.ruleForm.channelOne')
    },
    //   提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-box {
  padding-left: 20px;
  //   .drawer-box-text {
  //     margin-left: 20px;
  //     font-family: 'number_font';
  //     font-size: 14px;
  //     color: #949494;
  //   }
  p {
    padding-top: 30px;
    padding-left: 30px;
  }
  a {
    margin-left: 10px;
    color: #409eff;
  }
}
</style>
