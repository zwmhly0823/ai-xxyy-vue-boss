<<<<<<< HEAD
<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-28 17:11:05
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-03 16:02:25
-->
<template>
  <div class="new-form">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="问卷名称" prop="title">
        <el-input size="mini" v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="问卷说明" prop="desc">
        <el-input
          size="mini"
          type="textarea"
          v-model="ruleForm.desc"
        ></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
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
      <el-form-item>
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')"
          >立即创建</el-button
        >
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
    <div>
      <el-dialog :visible.sync="dialogFormVisible" width="750px" append-to-body>
        <experienceProblem
          ref="experienceProblem"
          @onCloseSaveQuestionnaire="onCloseSaveQuestionnaire"
          :ruleForm="ruleForm"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import uploadFile from '@/utils/upload'
import experienceProblem from './experienceProblem'
export default {
  components: {
    experienceProblem
  },
  data() {
    return {
      dialogFormVisible: false,
      ruleForm: {
        title: '',
        desc: '',
        imageUrl: '',
        questionState: 'DEFAULT'
      },
      rules: {
        title: [
          { required: true, message: '请输入问卷名称', trigger: 'blur' },
          { max: 10, message: '长度在10 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写问卷详情', trigger: 'blur' },
          { max: 48, message: '长度在48个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onCloseSaveQuestionnaire() {
      this.dialogFormVisible = false
      this.$emit('closeDialogVisible')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAvatarSuccess(res, file) {},
    // 上传图片
    upload(file) {
      uploadFile(file).then((res) => {
        this.ruleForm.imageUrl = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.new-form {
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
    border: 1px dashed #8c939d;
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
  .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
=======
<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-28 17:11:05
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-03 16:02:25
-->
<template>
  <div class="new-form">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="问卷名称" prop="title">
        <el-input size="mini" v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="问卷说明" prop="desc">
        <el-input
          size="mini"
          type="textarea"
          v-model="ruleForm.desc"
        ></el-input>
      </el-form-item>
      <el-form-item label="封面图" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
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
      <el-form-item>
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')"
          >立即创建</el-button
        >
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
    <div>
      <el-dialog :visible.sync="dialogFormVisible" width="750px" append-to-body>
        <experienceProblem
          ref="experienceProblem"
          @onCloseSaveQuestionnaire="onCloseSaveQuestionnaire"
          :ruleForm="ruleForm"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import uploadFile from '@/utils/upload'
import experienceProblem from './experienceProblem'
export default {
  components: {
    experienceProblem
  },
  data() {
    return {
      dialogFormVisible: false,
      ruleForm: {
        title: '',
        desc: '',
        imageUrl: '',
        questionState: 'DEFAULT'
      },
      rules: {
        title: [
          { required: true, message: '请输入问卷名称', trigger: 'blur' },
          { max: 10, message: '长度在10 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请填写问卷详情', trigger: 'blur' },
          { max: 48, message: '长度在48个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onCloseSaveQuestionnaire() {
      this.dialogFormVisible = false
      this.$emit('closeDialogVisible')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAvatarSuccess(res, file) {},
    // 上传图片
    upload(file) {
      uploadFile(file).then((res) => {
        this.ruleForm.imageUrl = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.new-form {
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
    border: 1px dashed #8c939d;
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
  .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
>>>>>>> feature/ossPlugin-20210204
