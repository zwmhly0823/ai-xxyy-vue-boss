<template>
  <div class="newteache-style">
    <div class="newteacher-title">
      <P v-if="newTitle === ''">新增辅导老师</P>
      <P v-if="newTitle === '1'">编辑辅导老师</P>
      <P v-if="newTitle === '2'">查看辅导老师</P>
    </div>
    <el-form
      :model="ruleForm"
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
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadFile"
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
        <el-input v-model.number="ruleForm.phone" :maxlength="11"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="pass" style="width:60%;">
        <el-input
          type="password"
          v-model.trim="ruleForm.pass"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <!-- 真实姓名 -->
      <el-form-item label="真实姓名" prop="name" style="width:60%;">
        <el-input v-model.trim="ruleForm.name"></el-input>
      </el-form-item>
      <!-- 对外昵称 -->
      <el-form-item label="对外昵称" prop="nickname" style="width:60%;">
        <el-input v-model.trim="ruleForm.nickname"></el-input>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio
            v-for="(item, index) in gender"
            :key="index"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <!-- 所属部门 -->
      <el-form-item label="所属部门" prop="region">
        <el-cascader
          :placeholder="ruleForm.region.name"
          v-model="ruleForm.region"
          :options="suDepartments"
          @change="handleChange"
          :props="optionProps"
          style="width:57.5%"
          v-if="departmentHidden"
        >
          <!-- <template slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
          </template> -->
        </el-cascader>
      </el-form-item>
      <!-- 职务 -->
      <el-form-item label="职务" prop="positionVal">
        <el-select
          v-model="ruleForm.positionVal"
          multiple
          placeholder="请选择职务"
        >
          <el-option
            v-for="item in position"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 职级 -->
      <el-form-item label="职级" prop="rank">
        <el-select v-model="ruleForm.rank" placeholder="请选择职级">
          <el-option
            v-for="item in rankList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 带班级别 -->
      <el-form-item label="带班级别" prop="shiftLevel">
        <el-select v-model="ruleForm.shiftLevel" placeholder="请选择带班级别">
          <el-option
            v-for="(item, index) in shiftList"
            :key="index"
            :label="item.name"
            :value="item.id"
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
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <!-- 离职时间 -->
      <el-form-item
        label="离职时间"
        required
        v-if="ruleForm.workingState === 'LEAVE'"
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
            :label="item.value"
            >{{ item.label }}</el-radio
          >
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
      <el-button
        type="primary"
        :disabled="newTitle === 2"
        @click="submitHandle('ruleForm')"
        >提交</el-button
      >
      <el-button @click="resetForm('ruleForm')">取消</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Contants from '@/utils/contants'
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
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (!/^[0-9a-zA-Z_./?'";:,=+-_)()*&^%$#@!`~|]*$/.test(value)) {
          callback(new Error('请输入英文,数字,符号'))
        } else {
          callback()
        }
      }
    }
    const organizationValidate = (rule, value, callback) => {
      console.log(value, '000')
      if (!value.length) {
        callback(new Error('请选择所属部门'))
      }
      callback()
    }
    return {
      headers: { 'Content-Type': 'multipart/form-data' },
      dataOss: {},
      // title
      newTitle: '',
      // 头像地址
      httpPath: '',
      // 表单禁用
      formDisabled: false,
      // 离职时间禁止选择
      pickerOptions: '',
      // 离职时间禁用
      timedDisabled: 1,
      // 性别
      gender: [
        { label: '男', value: 0 },
        { label: '女', value: 1 }
      ],
      // 所属部门
      departmentHidden: true,
      suDepartments: [],
      optionProps: {
        value: 'id',
        label: 'name'
      },
      // 职务
      position: [],
      // 职级
      rankList: [],
      // 带班级别
      shiftList: [],
      // 账号设置
      accountList: [
        { label: '允许', value: 'YES' },
        { label: '禁止', value: 'NO' }
      ],
      // 在职状态
      onJob: [
        { label: '在职', value: 'TENURE' },
        { label: '离职', value: 'LEAVE' }
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
        pass: '',
        // 头像
        imageUrl: '',
        // 真实姓名
        name: '',
        // 对外昵称
        nickname: '',
        // 性别
        resource: '',
        // 所属部门
        region: [],
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
        accountSettings: 'YES',
        // 在职状态
        workingState: 'TENURE',
        // 分配微信号
        weChat: []
      },

      // 表单验证
      rules: {
        // 手机号
        phone: [{ required: true, validator: checkAge, trigger: 'blur' }],
        // 密码
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { max: 20, message: '请控制在20个字符以内', trigger: 'blur' }
        ],
        // 头像
        // headPortrait: [
        //   { required: true, message: '请上传头像', trigger: 'blur' }
        // ],
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
          {
            type: 'array',
            required: true,
            validator: organizationValidate,
            trigger: 'change'
          }
        ],
        // 职务
        positionVal: [
          { required: true, message: '请选择职务', trigger: 'change' }
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
      console.log(val, 'val')
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
  created() {
    const query = this.$route.query
    // query.index ''/新建老师  1/编辑老师 2/查看老师
    if (query && query.index) this.newTitle = query.index
    if (query.index === '2') this.formDisabled = true
    // 接口调用
    this.createdUrl()
  },
  methods: {
    createdUrl() {
      // 职务接口
      this.$http.Teacher.getTeacherDutyList().then((res) => {
        this.position = res.data.TeacherDutyList
      })
      // 部门接口
      this.$http.Teacher.getdepartmentList().then((res) => {
        const departmentData = res.data.TeacherDepartmentPage.content
        const departmentWith = []
        departmentData.forEach((val) => {
          if (val.pid === 0) {
            val.children = []
            departmentWith.push(val)
            // departmentWith.push(Object.assign(val, { children: [] }))
          }
        })
        departmentData.forEach((val) => {
          departmentWith.forEach((data) => {
            if (val.pid === data.id) {
              data.children.push(val)
            }
          })
        })
        this.suDepartments = departmentWith
        console.log(this.suDepartments, '000')
      })
      // 职级
      this.$http.Teacher.TeacherRankList().then((res) => {
        this.rankList = res.data.TeacherRankList
      })
      // 级别
      this.$http.Teacher.courseSupList().then((res) => {
        res.data.courseSupList.forEach((val) => {
          if (val.id !== 0) {
            this.shiftList.push(val)
          }
        })
      })
      if (this.$route.query && this.$route.query.teacherId) {
        // 教师详情
        this.$http.Teacher.getTeacherDetail(this.$route.query.teacherId).then(
          (res) => {
            this.ruleForm.imageUrl = res.payload.teacher.headImage
            this.ruleForm.phone = res.payload.teacher.phone
            this.ruleForm.name = res.payload.teacher.realName
            this.ruleForm.nickname = res.payload.teacher.nickname
            this.ruleForm.resource = res.payload.teacher.sex
            this.ruleForm.region = res.payload.department
            this.ruleForm.positionVal = res.payload.duty
            this.ruleForm.rank = res.payload.rank
            this.ruleForm.inductionDate = new Date(res.payload.teacher.joinDate)
            this.ruleForm.departureDate = new Date(
              res.payload.teacher.leaveDate
            )
            this.ruleForm.groupData = new Date(res.payload.teacher.leaveTrain)
            this.ruleForm.accountSettings = res.payload.teacher.isLogin
            console.log(res.payload, '教师详情')
          }
        )
      }
    },
    // 选择入职时间后禁止离职时间
    DepartureDisabled() {
      const _this = this
      return {
        disabledDate(time) {
          return time.getTime() < _this.ruleForm.inductionDate.getTime()
        }
      }
    },
    // 提交按钮
    submitHandle(formName) {
      const positionValId = []
      this.ruleForm.positionVal.forEach((val) => {
        positionValId.push({ id: val })
      })
      const params = {
        teacher: {
          id: this.$route.query.teacherId,
          headImage: this.ruleForm.imageUrl,
          phone: this.ruleForm.phone,
          password: this.ruleForm.pass,
          realName: this.ruleForm.name,
          nickname: this.ruleForm.nickname,
          sex: this.ruleForm.resource,
          joinDate: this.ruleForm.inductionDate,
          leaveDate: this.ruleForm.departureDate,
          leaveTrain: this.ruleForm.groupData,
          status: this.ruleForm.workingState,
          isLogin: this.ruleForm.accountSettings
        },
        department: { id: this.ruleForm.region.pop() },
        duty: positionValId,
        rank: { id: this.ruleForm.rank }
      }

      console.log(params, 'params')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.$route.query.teacherId) {
            this.$http.Teacher.createTeacher(params).then((res) => {
              if (res.code === 4) {
                this.departmentHidden = false
                setTimeout(() => {
                  this.ruleForm.region = []
                  this.departmentHidden = true
                  console.log(this.departmentHidden, 'this.departmentHidden')
                }, 100)
                this.$message.error(res.erorrs)
              } else {
                this.cansubmit = true
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push({ path: '/teacherManagement' })
                }, 500)
              }
            })
          }
        } else {
          this.departmentHidden = false
          setTimeout(() => {
            this.ruleForm.region = []
            this.departmentHidden = true
          }, 100)
        }
      })
    },
    // 取消按钮
    resetForm(formName) {
      this.$router.push({ path: '/teacherManagement' })
      this.$refs[formName].resetFields()
    },
    // 部门联机选择
    handleChange(value) {
      console.log(value)
    },
    // 头像上传
    async uploadFile(file) {
      const getOssToken = await this.getOssToken()
      if (getOssToken) {
        var getSuffix = function(fileName) {
          var pos = fileName.lastIndexOf('.')
          var suffix = ''
          if (pos !== -1) {
            suffix = fileName.substring(pos)
          }
          return suffix
        }

        const requestHost = `https://${getOssToken.bucketName}.${getOssToken.endpoint}`
        const filename = new Date().getTime() + getSuffix(file.file.name)
        const dirPath = 'h5/headPic/'
        const formData = new FormData()
        formData.append('key', dirPath + filename) // 存储在oss的文件路径
        formData.append('OSSAccessKeyId', getOssToken.accessKeyId) // accessKeyId
        formData.append('policy', getOssToken.policy) // policy
        formData.append('Signature', getOssToken.singed) // 签名
        formData.append('success_action_status', 200) // 成功后返回的操作码
        formData.append('name', filename)
        formData.append('file', file.file, filename)
        const fileUrl = `${Contants.OSS_IMG_BASE_URL}/${dirPath}${filename}`

        axios
          .post(requestHost, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then((res) => {
            console.log('axios-res', res, fileUrl)
          })
          .catch((err) => {
            console.log('axios-err', err)
          })
      }
    },
    // 头像上传签名
    getOssToken() {
      return new Promise((resolve, reject) => {
        this.$http.Teacher.getPubWriteSinged()
          .catch((err) => reject(err))
          .then((res) => {
            if (res.payload) {
              resolve(res.payload)
            }
          })
      })
    },
    // 头像上传格式校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpg'
      const isJPEG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG && !isJPEG) {
        this.$message.error('上传头像图片只能是 png/jpg 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isJPEG) && isLt2M
    },
    // 头像上传成功回调
    handleAvatarSuccess(res, file) {
      this.ruleForm.imageUrl = URL.createObjectURL(file.raw)
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
