<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-05-07 10:48:30
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-11 20:55:33
 -->
<template>
  <div class="drawer-box">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="渠道ID">
        {{ channelId }}
      </el-form-item>
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
        <el-select v-model="ruleForm.channelLevel" placeholder="请选择">
          <el-option label="S" :value="2">S</el-option>
          <el-option label="A" :value="1">A</el-option>
          <el-option label="B" :value="0">B</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道备注" prop="desc">
        <el-input
          placeholder="请输入备注"
          type="textarea"
          v-model="ruleForm.desc"
        ></el-input>
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
        <div style="margin-left:50px;">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: ['modifyRow'],
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
      channelId: '',
      channelTwoDisabled: true,
      channelThreeDisabled: true,
      channelOneList: [],
      channelTwoList: [],
      channelOneId: '',
      channelTwoId: '',
      props: {},
      ruleForm: {
        channelOne: '',
        channelTwo: '',
        channelThree: '',
        sort: '',
        desc: '',
        status: '1',
        channelLevel: ''
      },
      rules: {
        channelOne: [
          { required: true, message: '请选择一级渠道', trigger: 'change' }
        ],
        channelTwo: [
          { required: true, message: '请选择二级渠道', trigger: 'change' }
        ],
        channelLevel: [
          { required: true, message: '请选择渠道等级', trigger: 'change' }
        ],
        // channelThree: [
        //   { required: true, message: '请填写三级渠道', trigger: 'change' }
        // ],
        sort: [{ required: true, validator: channelSort, trigger: 'blur' }]
        // desc: [{ required: true, message: '请填写渠道备注', trigger: 'blur' }]
        // status: [{ required: true, message: '请选择渠道状态', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getChannelOne()
    this.getChannelDetailStatisticsPage()
  },
  methods: {
    getChannelDetailStatisticsPage() {
      const id = `id:${this.modifyRow.id}`
      this.$http.Operating.ChannelDetailStatisticsPage(JSON.stringify(id)).then(
        (res) => {
          const _data = res.data.ChannelDetailStatisticsPage.content
          _data.forEach((item) => {
            this.channelId = item.id
            this.ruleForm.channelOne = item.p_channel_class_name
            this.channelOneId = item.p_channel_class_id
            this.channelTwoId = item.channel_class_id
            if (item.channel_class_name) {
              this.channelTwoDisabled = false
              this.channelThreeDisabled = false
            }
            this.ruleForm.channelTwo = item.channel_class_name
            this.ruleForm.channelThree = item.channel_inner_name
            this.ruleForm.sort = item.channel_sort
            this.ruleForm.desc = item.remarks
            this.ruleForm.status = item.status.toString()
            this.ruleForm.channelLevel = item.channel_level
          })
        }
      )
    },
    channelTwo() {
      if (typeof this.ruleForm.channelOne === 'string') {
        this.$http.Operating.getChannelAndClass(this.channelOneId).then(
          (res) => {
            const data = res.payload.channelClassList
            data.forEach((res) => {
              res.label = res.channelClassName
              res.value = +res.id
            })
            this.channelTwoList = data
          }
        )
      } else {
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
      }
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
      console.log(this.ruleForm.channelOne, 'this.ruleForm.channelOne', data)
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
          if (typeof this.ruleForm.channelTwo === 'string') {
            this.props = {
              id: +this.channelId,
              channelClassId: +this.channelTwoId, // 二级渠道分类id
              channelOuterName: this.ruleForm.channelThree, // 渠道对外名称
              channelInnerName: this.ruleForm.channelThree, // 渠道对管理员名称默认两者一致
              channelSort: this.ruleForm.sort, // 渠道排序
              status: this.ruleForm.status, // 1开启0禁用
              remarks: this.ruleForm.desc,
              channelLevel: this.getLevel(this.ruleForm.channelLevel) // 渠道等级
            }
          } else {
            this.props = {
              id: +this.channelId,
              channelClassId: +this.ruleForm.channelTwo, // 二级渠道分类id
              channelOuterName: this.ruleForm.channelThree, // 渠道对外名称
              channelInnerName: this.ruleForm.channelThree, // 渠道对管理员名称默认两者一致
              channelSort: this.ruleForm.sort, // 渠道排序
              status: this.ruleForm.status, // 1开启0禁用
              remarks: this.ruleForm.desc,
              channelLevel: this.getLevel(this.ruleForm.channelLevel) // 渠道等级
            }
          }

          this.$http.Operating.updateChannel(this.props).then((res) => {
            console.log(res)
            if (res.code === 0) {
              this.$message.success('渠道修改成功')
              this.$refs[formName].resetFields()
              this.$emit('modifyChannelShow', false)
              this.$emit('modifyChannelShowBtn', 1)
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
      this.$emit('modifyChannelShow', false)
    },
    // 转换渠道级别为S、A、B
    getLevel(val) {
      var levelNames = { 0: 'B', 1: 'A', 2: 'S' }
      if (Object.prototype.hasOwnProperty.call(levelNames, val)) {
        return levelNames[val]
      }
      return ''
    }
  }
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
}
</style>
