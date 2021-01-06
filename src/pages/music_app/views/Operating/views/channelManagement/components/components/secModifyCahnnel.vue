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
        <el-select v-model="ruleForm.channelOne" placeholder="请选择" clearable>
          <el-option
            v-for="(item, index) in channelOneList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width:293px" label="二级渠道" prop="channelTwo">
        <el-input
          v-model="ruleForm.channelTwo"
          placeholder="请输入二级渠道"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道等级" prop="channelLevel">
        <el-select v-model="ruleForm.channelLevel" placeholder="请选择">
          <el-option label="S" :value="2">S</el-option>
          <el-option label="A" :value="1">A</el-option>
          <el-option label="B" :value="0">B</el-option>
        </el-select>
        <span class="channel-level-desc">
          注：二级渠道等级保存后，其下所有三级渠道需同步该等级
        </span>
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
    return {
      channelId: '',
      channelOneList: [],
      props: {},
      ruleForm: {
        channelOne: '',
        channelTwo: '',
        channelLevel: ''
      },
      rules: {
        channelOne: [
          { required: true, message: '请选择一级渠道', trigger: 'change' }
        ],
        channelTwo: [
          { required: true, message: '请填写二级渠道', trigger: 'blur' }
        ],
        channelLevel: [
          { required: true, message: '请选择渠道等级', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getChannelOne()
    this.setModifyData()
  },
  methods: {
    // 回显修改数据
    setModifyData() {
      this.channelId = this.modifyRow.id
      this.ruleForm.channelOne = +this.modifyRow.channelClassParent.id
      this.ruleForm.channelLevel = this.modifyRow.channel_level
      this.ruleForm.channelTwo = this.modifyRow.channel_class_name
    },
    // 获取一级渠道列表
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
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            channelClassId: this.channelId,
            channelClassName: this.ruleForm.channelTwo,
            channelClassParentId: this.ruleForm.channelOne,
            channelLevel: this.getLevel(this.ruleForm.channelLevel)
          }
          this.$http.Operating.updateChannelClassV2(params).then((res) => {
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
    // 转换渠道级别为S、A、B
    getLevel(val) {
      var levelNames = { 0: 'B', 1: 'A', 2: 'S' }
      if (Object.prototype.hasOwnProperty.call(levelNames, val)) {
        return levelNames[val]
      }
      return ''
    },
    // 取消
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.channelTwo = ''
      this.ruleForm.channelLevel = ''
      this.$emit('modifyChannelShow', false)
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
  .channel-level-desc {
    display: block;
    font-size: 12px;
    line-height: 24px;
    color: red;
  }
}
</style>
