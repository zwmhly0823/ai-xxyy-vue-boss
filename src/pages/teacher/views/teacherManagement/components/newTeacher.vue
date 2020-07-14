<template>
  <div class="newteache-style">
    <div class="newteacher-title">
      <P v-if="newTitle === ''">新增销售</P>
      <P v-if="newTitle === '1'">编辑销售</P>
      <P v-if="newTitle === '2'">查看销售</P>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
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
      <!-- 账号 -->
      <el-form-item label="账号" prop="username" style="width:60%;">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="pass" style="width:60%;">
        <el-input
          v-if="ruleForm.pwd"
          @focus="onPassword"
          type="password"
          v-model.trim="ruleForm.pwd"
          autocomplete="off"
          show-password
          placeholder="请输入内容"
        ></el-input>
        <el-input v-else v-model.trim="ruleForm.pass"></el-input>
      </el-form-item>
      <!-- 真实姓名 -->
      <el-form-item label="真实姓名" prop="name" style="width:60%;">
        <el-input v-model.trim="ruleForm.name"></el-input>
      </el-form-item>
      <!-- 对外昵称 -->
      <el-form-item label="对外昵称" prop="nickname" style="width:60%;">
        <el-input v-model.trim="ruleForm.nickname"></el-input>
      </el-form-item>
      <!-- 钉钉工号 -->
      <el-form-item label="钉钉工号" prop="dingUserid" style="width:60%;">
        <el-input v-model.trim="ruleForm.dingUserid"></el-input>
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
          v-model="ruleForm.region"
          :options="suDepartments"
          @change="handleChange"
          :props="optionProps"
          style="width:57.5%"
        >
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
            v-for="(item, index) in position"
            :key="index"
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
      <!-- <el-form-item label="带班级别" prop="shiftLevel">
        <el-select v-model="ruleForm.shiftLevel" placeholder="请选择带班级别">
          <el-option
            v-for="(item, index) in shiftList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item> -->

      <!-- 管理部门 -->
      <el-form-item label="管理部门" prop="administration">
        <el-cascader
          v-model="ruleForm.administration"
          :options="suDepartments"
          @change="handleChangeAdministration"
          :props="optionPropsAdministration"
          style="width:57.5%"
          collapse-tags
        >
        </el-cascader>
      </el-form-item>
      <!-- 销售等级 -->
      <el-form-item label="销售等级" prop="level">
        <el-select
          v-model="ruleForm.level"
          clearable
          placeholder="请选择销售等级"
        >
          <el-option
            v-for="item in levels"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 销售等级 -->
      <el-form-item label="职场" prop="workplace">
        <el-select
          v-model="ruleForm.workplace"
          clearable
          placeholder="请选择职场"
        >
          <el-option
            v-for="item in workplaceList"
            :key="item.value"
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
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="ruleForm.inductionDate"
            style="width: 57.5%;"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <!-- 下组时间 -->
      <el-form-item label="下组时间">
        <el-form-item prop="groupDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.groupDate"
            value-format="yyyy-MM-dd HH:mm:ss"
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
            value-format="yyyy-MM-dd HH:mm:ss"
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
      <el-form-item label="分配微信号" v-if="false">
        <!-- <el-select
          v-model="ruleForm.weChat"
          multiple
          filterable
          placeholder="请选择微信号"
        >
          <el-option
            v-for="item in WeChat"
            :key="item.id"
            :label="item.wechat_no"
            :value="item.id"
          >
          </el-option>

        </el-select> -->
        <m-search
          @search="searchHandler"
          teacherwx="wechat_no"
          :WeChat="WeChat"
        >
        </m-search>
      </el-form-item>
    </el-form>
    <div style="text-align: center; padding:10px 0">
      <el-button type="primary" @click="submitHandle('ruleForm')"
        >提交</el-button
      >
      <el-button @click="resetForm('ruleForm')">取消</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
import Contants from '@/utils/contants'
// import { sortByKey } from '@/utils/boss'
import { formatData } from '@/utils/index'
import MSearch from '@/components/MSearch/index.vue'
export default {
  components: {
    MSearch
  },
  data() {
    // 手机号正则
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }, 100)
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
      if (!value.length) {
        callback(new Error('请选择所属部门'))
      }
      callback()
    }
    const userName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号'))
      } else {
        if (!/^[0-9a-zA-Z_./?'";:,=+-_)()*&^%$#@!`~|]*$/.test(value)) {
          callback(new Error('请输入英文,数字'))
        } else {
          callback()
        }
      }
    }
    return {
      headers: { 'Content-Type': 'multipart/form-data' },
      // title
      newTitle: '',
      // 头像地址
      httpPath: '',
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
      suDepartments: [],
      optionProps: {
        value: 'id',
        label: 'name',
        checkStrictly: true
      },
      optionPropsAdministration: {
        value: 'id',
        label: 'name',
        multiple: true
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
      WeChat: [],
      // 销售等级
      levels: [
        { label: '1级社群销售', value: 1 },
        { label: '2级社群销售', value: 2 },
        { label: '3级社群销售', value: 3 },
        { label: '新兵营', value: 0 }
      ],
      // 职场
      workplaceList: [
        {
          label: '北京场',
          value: '北京场'
        }
      ],
      // Level: [
      //   { label: '新兵培训', value: 0 },
      //   { label: '下组待接生', value: 1 },
      //   { label: '首次排班', value: 2 },
      //   { label: '已接生一次', value: 3 },
      //   { label: '1级', value: 4 },
      //   { label: '2级', value: 5 },
      //   { label: '3级', value: 6 },
      //   { label: '4级', value: 7 }
      // ],
      // 表单value
      ruleForm: {
        // 手机号
        phone: '',
        // 账号
        username: '',
        // 密码
        pass: '',
        pwd: '',
        // 头像
        imageUrl: '',
        // 真实姓名
        name: '',
        // 对外昵称
        nickname: '',
        // 钉钉工号
        dingUserid: '',
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
        groupDate: '',
        // 离职时间
        departureDate: '',
        // 账号设置
        accountSettings: 'YES',
        // 在职状态
        workingState: 'TENURE',
        // 分配微信号
        weChat: [],
        // 销售等级
        level: '',
        // 管理部门
        administration: [],
        administrations: [],
        note: [],
        // 职场
        workplace: ''
      },

      // 表单验证
      rules: {
        // 手机号
        phone: [{ required: true, validator: checkAge, trigger: 'blur' }],
        username: [{ required: true, validator: userName, trigger: 'blur' }],
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
        // 钉钉工号
        dingUserid: [
          { required: true, message: '请填写钉钉工号', trigger: 'blur' },
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
            required: true,
            message: '请选择入职时间',
            trigger: 'change'
          }
        ],
        // 离职时间
        departureDate: [
          {
            required: true,
            message: '请选择离职时间',
            trigger: 'change'
          }
        ],
        // 禁用状态下离职时间
        departureDatedisable: [
          {
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
        ],
        // 销售等级
        level: [{ required: true, message: '请选择销售等级', trigger: 'blur' }],
        // 在职状态
        workplace: [
          { required: true, message: '请选择职场', trigger: 'change' }
        ],
        // 管理部门
        administration: [
          { required: true, message: '请选择管理部门', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    // 监听入职时间,清空离职时间
    'ruleForm.inductionDate'(date) {
      const val = new Date(date)
      // 离职时间
      if (
        this.ruleForm.departureDate !== '' &&
        val.getTime() > new Date(this.ruleForm.departureDate).getTime()
      ) {
        this.ruleForm.departureDate = ''
      } else {
        this.pickerOptions = this.DepartureDisabled()
      }
      //  下组时间
      if (
        this.ruleForm.groupDate !== '' &&
        val.getTime() > new Date(this.ruleForm.groupDate).getTime()
      ) {
        this.ruleForm.groupDate = ''
      } else {
        this.pickerOptions = this.DepartureDisabled()
      }
    }
  },
  created() {
    const query = this.$route.query
    // query.index ''/新建老师  1/编辑老师 2/查看老师
    if (query && query.index) this.newTitle = query.index
    // 接口调用
    this.createdUrl()
  },

  methods: {
    onPassword() {
      this.ruleForm.pwd = ''
    },
    createdUrl() {
      // 职务接口
      this.$http.Teacher.getTeacherDutyList().then((res) => {
        this.position = res.data.TeacherDutyList
      })
      // 部门接口
      // this.$http.Teacher.getdepartmentList().then((res) => {
      //   const departmentData = res.data.TeacherDepartmentPage.content
      //   const departmentWith = []
      //   departmentData.forEach((val) => {
      //     if (val.pid === 0) {
      //       val.children = []
      //       departmentWith.push(val)
      //       // departmentWith.push(Object.assign(val, { children: [] }))
      //     }
      //   })
      //   departmentData.forEach((val) => {
      //     departmentWith.forEach((data) => {
      //       if (val.pid === data.id) {
      //         data.children.push(val)
      //       }
      //     })
      //   })
      //   this.suDepartments = sortByKey(departmentWith, 'id')
      // })
      this.$http.Teacher.getDepartmentTree().then((res) => {
        this.suDepartments = res.payload
      })
      // 职级
      this.$http.Teacher.TeacherRankList().then((res) => {
        const rank = res.data.TeacherRankList || []
        this.rankList = _.sortBy(rank, 'id')
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
            const { payload = {} } = res
            this.ruleForm.imageUrl = payload.teacher.headImage
            this.ruleForm.phone = payload.teacher.phone
            this.ruleForm.name = payload.teacher.realName
            this.ruleForm.nickname = payload.teacher.nickname
            this.ruleForm.dingUserid = payload.teacher.dingUserid
            this.ruleForm.resource = payload.teacher.sex

            this.ruleForm.pwd = 'msb123'
            // this.ruleForm.region = payload.department
            //   ? [payload.department.id]
            //   : []
            this.ruleForm.region = payload.department
              ? payload.department.id
              : []
            payload.duty.forEach((val) => {
              this.ruleForm.positionVal.push(val.id * 1)
            })
            this.ruleForm.rank = payload.rank ? payload.rank.id * 1 : ''
            // 0520: fixed-编辑时没有入职时间，不再默认显示当前时间。必填项  By: Yang
            this.ruleForm.inductionDate = payload.teacher.joinDate
              ? formatData(
                  new Date(payload.teacher.joinDate).getTime(),
                  'yyyy-MM-dd HH:mm:ss'
                )
              : ''
            this.ruleForm.departureDate = payload.teacher.leaveDate
              ? formatData(
                  new Date(payload.teacher.leaveDate).getTime(),
                  'yyyy-MM-dd HH:mm:ss'
                )
              : this.ruleForm.inductionDate
            this.ruleForm.groupDate = payload.teacher.leaveTrain
              ? formatData(
                  new Date(payload.teacher.leaveTrain).getTime(),
                  'yyyy-MM-dd HH:mm:ss'
                )
              : this.ruleForm.inductionDate
            this.ruleForm.accountSettings = payload.teacher.isLogin
            this.ruleForm.workingState = payload.teacher.status
            this.WeChat = payload.weixinList
            this.ruleForm.level = payload.teacher.level
            this.ruleForm.workplace = payload.teacher.workPlace
            this.ruleForm.username = payload.teacher.userName
            this.ruleForm.administrations = payload.teacher.dataAuth
            this.ruleForm.administration = JSON.parse(payload.teacher.note)
            this.ruleForm.note = payload.teacher.note
            // const list = [
            //   ['33', '34', '45'],
            //   ['33', '34', '53'],
            //   ['33', '34', '46']
            // ]
            // this.ruleForm.administration = payload.teacher.dataAuth
            // this.ruleForm.administration.push(payload.teacher.dataAuth)
            console.log(this.ruleForm.administration)
          }
        )
      }
    },

    // 选择入职时间后禁止离职时间
    DepartureDisabled() {
      const _this = this
      return {
        disabledDate(time) {
          return (
            new Date(time).getTime() <
            new Date(_this.ruleForm.inductionDate).getTime()
          )
        }
      }
    },
    // 提交按钮
    submitHandle(formName) {
      const positionValId = []
      this.ruleForm.positionVal.forEach((val) => {
        positionValId.push({ id: val })
      })
      let departureTime = ''
      if (this.ruleForm.workingState === 'LEAVE') {
        departureTime = this.ruleForm.departureDate
      }
      const params = {
        teacher: {
          id: this.$route.query.teacherId,
          headImage: this.ruleForm.imageUrl,
          phone: this.ruleForm.phone.toString(),
          password: this.ruleForm.pass,
          realName: this.ruleForm.name,
          nickname: this.ruleForm.nickname,
          dingUserid: this.ruleForm.dingUserid,
          sex: this.ruleForm.resource,
          joinDate: this.ruleForm.inductionDate,
          leaveDate: departureTime,
          leaveTrain: this.ruleForm.groupDate,
          status: this.ruleForm.workingState,
          isLogin: this.ruleForm.accountSettings,
          level: this.ruleForm.level,
          dataAuth: this.ruleForm.administrations,
          workPlace: this.ruleForm.workplace,
          userName: this.ruleForm.username,
          note: this.ruleForm.note
        },
        department: {
          id:
            typeof this.ruleForm.region === 'string'
              ? this.ruleForm.region
              : this.ruleForm.region[this.ruleForm.region.length - 1]
        },
        duty: positionValId,
        rank: { id: this.ruleForm.rank },
        weixinList: this.ruleForm.weChat
      }
      console.log(params)

      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 新建接口请求
          if (!this.$route.query.teacherId) {
            this.$http.Teacher.createTeacher(params).then((res) => {
              if (res.code === 0) {
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
          } else if (this.$route.query.teacherId) {
            // 编辑接口
            this.$http.Teacher.updateTeacher(params).then((res) => {
              if (res.code === 0) {
                this.cansubmit = true
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                setTimeout(() => {
                  this.$router.push({ path: '/teacherManagement' })
                }, 500)
              }
            })
          }
        }
      })
    },
    // 取消按钮
    resetForm(formName) {
      this.$router.push({ path: '/teacherManagement' })
      this.$refs[formName].resetFields()
    },
    // 微信搜索
    searchHandler(val) {
      console.log(val, '搜索')
      const WeChatsear = val[0].wildcard.wechat_no
      if (WeChatsear.length > 0) {
        this.ruleForm.weChat = []
        WeChatsear.forEach((val) => {
          this.ruleForm.weChat.push({ weixinId: val })
        })
      } else {
        this.ruleForm.weChat = []
      }
    },
    // 部门联机选择
    handleChange(value) {
      console.log(value)
    },
    // 管理部门选择
    handleChangeAdministration(data) {
      console.log(JSON.stringify(data))
      this.ruleForm.note = JSON.stringify(data)
      const _data = []
      data.forEach((res) => {
        res.forEach((ele) => {
          _data.push(ele)
        })
      })
      const _datas = Array.from(new Set(_data))
      this.ruleForm.administrations = _datas.join(',').toString()
      console.log(_datas.join(',').toString())
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
            this.ruleForm.imageUrl = fileUrl
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
    handleAvatarSuccess(res, file) {}
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
// 下拉框
.el-select {
  width: 57.5% !important;
}
.el-card {
  border: 0px;
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
  border-color: #2a75ed;
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
</style>
