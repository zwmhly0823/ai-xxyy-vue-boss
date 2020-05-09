<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-14 15:15:31
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-07 18:17:36
 -->
<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      label-position="top"
    >
      <div style="margin-bottom:20px;">
        <span style="color:red;font-weight: 800;">*</span>
        <span style="font-size:14px;"> 微信号</span>
      </div>
      <el-form-item prop="wechatNo">
        <el-input style="width:230px;" v-model="ruleForm.wechatNo"></el-input>
      </el-form-item>
      <el-form-item label="微信头像" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="upload"
        >
          <img
            v-if="ruleForm.imageUrl"
            :src="ruleForm.imageUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="微信二维码" prop="QEcodeUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadCode"
        >
          <img
            v-if="ruleForm.QEcodeUrl"
            :src="ruleForm.QEcodeUrl"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- 关联老师 title -->
      <div style="margin-bottom:25px">
        <!-- <span style="color:red;margin-right:4px;">*</span> -->
        <span style="font-weight:700">关联老师</span>
      </div>
      <div class="associatedTeacherCss">
        <el-form-item prop="associatedTeacher">
          <el-cascader
            style="width:300px;"
            @change="handleChange"
            v-model="ruleForm.associatedTeacher"
            placeholder="全部部门"
            :options="associatedTeacher"
            :props="optionProps"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item style="margin-left:20px;" prop="teacherId">
          <el-select
            v-model="ruleForm.teacherId"
            filterable
            remote
            reserve-keyword
            placeholder="请选择老师"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in regionOptionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="启用状态" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="0">启用</el-radio>
          <el-radio label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="sub-box">
          <el-button
            class="submit-css"
            type="primary"
            @click="submitForm('ruleForm')"
            >添加</el-button
          >
          <el-button class="reset-css" @click="resetForm('ruleForm')"
            >取消</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import { sortByKey } from '@/utils/boss'
import uploadFile from '@/utils/upload'
export default {
  data() {
    var wechatNoId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('微信号不能为空'))
      } else {
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/im
        var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
        var regWn = /^[\u4e00-\u9fa5]+$/
        if (regEn.test(value) || regCn.test(value) || regWn.test(value)) {
          return callback(new Error('微信号不能包含文字、特殊字符'))
        } else {
          callback()
        }
      }
    }
    return {
      regionOptionsList: [],
      loading: false,
      // 关联老师选择部门
      associatedTeacher: [],
      optionProps: {
        value: 'id',
        label: 'name'
      },
      ruleForm: {
        wechatNo: '',
        associatedTeacher: '',
        resource: '0',
        imageUrl: '',
        QEcodeUrl: '',
        teacherId: ''
      },
      TeacherListvalue: '',
      rules: {
        wechatNo: [{ validator: wechatNoId, trigger: 'blur' }],
        // imageUrl: [
        //   { required: true, message: '请上传微信头像', trigger: 'blur' }
        // ],
        QEcodeUrl: [
          { required: true, message: '请上传微信二维码', trigger: 'blur' }
        ],
        associatedTeacher: [
          { required: false, message: '请选择部门', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择启用状态', trigger: 'change' }
        ],
        teacherId: [
          { required: false, message: '请选择启用状态', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.onCreatedSelect()
  },
  methods: {
    onCreatedSelect() {
      // 关联老师选择部门
      this.$http.Teacher.getDepartmentTree().then((res) => {
        this.associatedTeacher = res.payload
      })
    },
    // 部门联机选择
    handleChange(value) {
      console.log(value)
      console.log(Object.values(value))
      switch (value && value.length) {
        case 1:
          this.ruleForm.associatedTeacher = value[0]
          break
        case 2:
          this.ruleForm.associatedTeacher = value[1]
          break
        case 3:
          this.ruleForm.associatedTeacher = value[2]
          break
        default:
          break
      }
      this.ruleForm.teacherId = ''
      this.regionOptionsList = []
      this.remoteMethod()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          if (this.ruleForm.associatedTeacher) {
            this.TeacherListvalue = {
              department_id: `${this.ruleForm.associatedTeacher}`
            }
          }
          this.$http.Teacher.TeacherList(this.TeacherListvalue, query).then(
            (res) => {
              const data = res.data.TeacherListEx
              const _data = []
              data.forEach((res) => {
                _data.push({
                  value: res.id,
                  label: res.realname
                })
              })
              this.regionOptionsList = _data.filter((item) => {
                return query
                  ? item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                  : item
              })
            }
          )
        }, 200)
      } else {
        this.regionOptionsList = []
      }
    },
    // 提交
    submitForm(formName) {
      console.log(this.ruleForm.associatedTeacher, 'ruleForm.associatedTeacher')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            teacherId: this.ruleForm.teacherId ? this.ruleForm.teacherId : '',
            weixinId: this.weixinId ? this.weixinId : '',
            weixinNo: this.ruleForm.wechatNo,
            weixinHeadUrl: this.ruleForm.imageUrl,
            weixinQrCode: this.ruleForm.QEcodeUrl,
            isEffective: +this.ruleForm.resource
          }
          console.log(params, 'fasdsafs')
          this.$http.Teacher.relation(params).then((res) => {
            console.log(res, 'res')
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$emit('addWeChat', 1)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.associatedTeacher = ''
      this.TeacherListvalue = ''
      this.regionOptionsList = []
      this.$emit('addWeChat', 2)
    },
    // 头像上传
    upload(file) {
      uploadFile(file).then((res) => {
        this.ruleForm.imageUrl = res
      })
    },
    // 二维码上传
    uploadCode(file) {
      uploadFile(file).then((res) => {
        this.ruleForm.QEcodeUrl = res
      })
    },
    // // 头像上传格式校验
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
.associatedTeacherCss {
  display: flex;
}
.sub-box {
  display: flex;
  justify-content: center;
  .submit-css {
    width: 120px;
  }
  .reset-css {
    width: 120px;
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
</style>
