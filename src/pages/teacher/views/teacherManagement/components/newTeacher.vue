<template>
  <div class="newteache-style">
    <div class="newteacher-title">
      <P>新增辅导老师</P>
      <!-- <P>编辑辅导老师</P> -->
      <!-- <P>查看辅导老师</P> -->
    </div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      :disabled="formDisabled"
    >
      <!-- 头像 -->
      <el-form-item label="头像" prop="headPortrait">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="ruleForm.imageUrl"
            :src="ruleForm.imageUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone" style="width:60%;">
        <el-input v-model.number="ruleForm.phone"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <!-- <el-form-item label="密码" prop="pass" style="width:60%;">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item> -->
      <!-- 真实姓名 -->
      <el-form-item label="真实姓名" prop="name" style="width:60%;">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <!-- 对外昵称 -->
      <el-form-item label="对外昵称" prop="nickname" style="width:60%;">
        <el-input v-model="ruleForm.nickname"></el-input>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio
            v-for="(item, index) in gender"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 所属部门 -->
      <el-form-item label="所属部门" prop="region">
        <el-cascader
          v-model="ruleForm.region"
          :options="suDepartments"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
          style="width:57.5%"
        ></el-cascader>
      </el-form-item>
      <!-- 职务 -->
      <el-form-item label="职务" prop="postVerification">
        <el-select
          v-model="ruleForm.positionVal"
          multiple
          placeholder="请选择职务"
        >
          <el-option
            v-for="item in position"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 职级 -->
      <el-form-item label="职级" prop="rank">
        <el-select v-model="ruleForm.rank" placeholder="请选择所属部门">
          <el-option
            v-for="(item, index) in rankList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 带班级别 -->
      <el-form-item label="带班级别" prop="shiftLevel">
        <el-select v-model="ruleForm.shiftLevel" placeholder="请选择带班级别">
          <el-option
            v-for="(item, index) in shiftList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 入职时间 -->
      <el-form-item label="入职时间" required>
        <el-form-item prop="inductionDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.inductionDate"
            style="width: 57.5%;"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <!-- 下组时间 -->
      <el-form-item label="下组时间">
        <el-form-item prop="groupData">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.groupData"
            :picker-options="pickerOptions"
            style="width: 57.5%;"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>

      <!-- 在职状态 -->
      <el-form-item label="在职状态" prop="workingState">
        <el-radio-group v-model="ruleForm.workingState">
          <el-radio
            v-for="(item, index) in onJob"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 离职时间 -->
      <el-form-item
        label="离职时间"
        required
        v-show="ruleForm.workingState === '离职'"
      >
        <el-form-item prop="departureDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.departureDate"
            :picker-options="pickerOptions"
            style="width: 57.5%;"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <!-- 账号设置 -->
      <el-form-item label="账号设置" prop="accountSettings">
        <el-radio-group v-model="ruleForm.accountSettings">
          <el-radio
            v-for="(item, index) in accountList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 分配微信号 -->
      <el-form-item label="分配微信号">
        <el-select
          v-model="ruleForm.weChat"
          multiple
          filterable
          placeholder="请选择微信号"
        >
          <el-option
            v-for="item in WeChat"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="text-align: center; padding:10px 0">
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    // 手机号正则
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (!/^1[3456789]\d{9}$/.test(value)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        }
      }, 500)
    }
    // 密码
    // const validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入密码'))
    //   } else {
    //     if (this.ruleForm.checkPass !== '') {
    //       this.$refs.ruleForm.validateField('checkPass')
    //     }
    //     callback()
    //   }
    // }

    return {
      // 表单禁用
      formDisabled: false,
      // 离职时间禁止选择
      pickerOptions: '',
      // 离职时间禁用
      timedDisabled: 1,
      // 性别
      gender: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ],
      // 所属部门
      suDepartments: [
        {
          label: '小熊销售1部',
          value: 1,
          children: [{ label: '小熊销售1部', value: 1 }]
        },
        {
          label: '小熊销售2部',
          value: 2,
          children: [{ label: '小熊销售1部', value: 2 }]
        }
      ],
      // 职务
      position: [
        {
          value: '1',
          label: '系统课老师'
        },
        {
          value: '2',
          label: '体验课老师'
        }
      ],
      // 职级
      rankList: [
        { label: '主管', value: 1 },
        { label: '组长', value: 2 }
      ],
      // 带班级别
      shiftList: [
        { label: 's1', value: 1 },
        { label: 's2', value: 2 }
      ],
      // 账号设置
      accountList: [
        { label: '允许', value: 1 },
        { label: '禁止', value: 2 }
      ],
      // 在职状态
      onJob: [
        { label: '在职', value: 1 },
        { label: '离职', value: 2 }
      ],
      // 微信
      WeChat: [
        { label: '123', value: 1 },
        { label: '456', value: 2 }
      ],
      // 表单value
      ruleForm: {
        // 手机号
        phone: '',
        // 密码
        // pass: '',
        // 头像
        imageUrl: '',
        // 真实姓名
        name: '',
        // 对外昵称
        nickname: '',
        // 性别
        resource: '',
        // 所属部门
        region: '',
        // 职务
        positionVal: [],
        // 职级
        rank: '',
        // 带班级别
        shiftLevel: '',
        // 入职时间
        inductionDate: '',
        // 下组时间
        groupData: '',
        // 离职时间
        departureDate: '',
        // 账号设置
        accountSettings: '允许',
        // 在职状态
        workingState: '在职',
        // 分配微信号
        weChat: []
      },

      // 表单验证
      rules: {
        // 手机号
        phone: [{ required: true, validator: checkAge, trigger: 'blur' }],
        // 密码
        // pass: [{ required: true, validator: validatePass, trigger: 'blur' }],
        // 头像
        headPortrait: [
          { required: true, message: '请上传头像', trigger: 'blur' }
        ],
        // 真实姓名
        name: [
          { required: true, message: '请填写真实姓名', trigger: 'blur' },
          { max: 20, message: '请控制在20个字符以内', trigger: 'blur' }
        ],
        // 对外昵称
        nickname: [
          { required: true, message: '请填写对外昵称', trigger: 'blur' },
          { max: 20, message: '请控制在20个字符以内', trigger: 'blur' }
        ],
        // 性别
        resource: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        // 所属部门
        region: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ],
        // 职务
        postVerification: [
          { required: true, message: '请选择职务', trigger: 'blur' }
        ],
        // 职级
        rank: [{ required: true, message: '请选择职级', trigger: 'change' }],
        // 带班级别
        shiftLevel: [
          { required: true, message: '请选择带班级别', trigger: 'change' }
        ],
        // 入职时间
        inductionDate: [
          {
            type: 'date',
            required: true,
            message: '请选择入职时间',
            trigger: 'change'
          }
        ],
        // 离职时间
        departureDate: [
          {
            type: 'date',
            required: true,
            message: '请选择离职时间',
            trigger: 'change'
          }
        ],
        // 禁用状态下离职时间
        departureDatedisable: [
          {
            type: 'date',
            required: true
          }
        ],
        // 账号设置
        accountSettings: [
          { required: true, message: '请选择账号设置', trigger: 'change' }
        ],
        // 在职状态
        workingState: [
          { required: true, message: '请选择在职状态', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    // 监听入职时间,清空离职时间
    'ruleForm.inductionDate'(val) {
      // 离职时间
      if (
        this.ruleForm.departureDate !== '' &&
        val.getTime() > this.ruleForm.departureDate.getTime()
      ) {
        this.ruleForm.departureDate = ''
      } else {
        this.pickerOptions = this.DepartureDisabled()
      }
      //  下组时间
      if (
        this.ruleForm.groupData !== '' &&
        val.getTime() > this.ruleForm.groupData.getTime()
      ) {
        this.ruleForm.groupData = ''
      } else {
        this.pickerOptions = this.DepartureDisabled()
      }
    }
  },
  methods: {
    // 选择入职时间后禁止离职时间
    DepartureDisabled() {
      const _this = this
      return {
        disabledDate(time) {
          return time.getTime() < _this.ruleForm.inductionDate.getTime()
        }
      }
    },

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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 头像
    handleAvatarSuccess(res, file) {
      this.ruleForm.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      console.log(file, 'file')
      const isJPG = file.type === 'image/jpg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 png/jpg 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    // 部门联机选择
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>
<style lang="scss" scoped>
.newteache-style {
  background: #fff;
  margin: 10px 10px 10px 10px;
  .newteacher-title {
    // 标题样式
    p {
      margin: 0 0 20px 0;
      line-height: 20px;
      width: 100%;
      padding: 10px 0 0 20px;
      font-size: 16px;
      color: #1f2f3d;
      font-weight: 400;
    }
  }
}
</style>
<style lang="scss">
// 上传头像
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
// 下拉框
.el-select {
  width: 57.5%;
}
</style>
