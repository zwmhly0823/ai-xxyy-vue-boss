<<<<<<< HEAD
<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-01 11:56:39
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-01 17:25:00
-->
<template>
  <el-dialog title="编辑标签" :visible.sync="dialogFormVisible" width="400px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="标签名称" prop="name" label-width="100px">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="标签分类" prop="classiFication" label-width="100px">
        <el-input v-model="ruleForm.classiFication"></el-input>
      </el-form-item>
      <el-form-item label="标签属性" prop="attribute" label-width="100px">
        <el-input :disabled="disableds" v-model="ruleForm.attribute"></el-input>
      </el-form-item>
      <el-form-item label="标签排序" prop="sort" label-width="100px">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item label="标签定义" prop="definition" label-width="100px">
        <el-input v-model="ruleForm.definition"></el-input>
      </el-form-item>
      <el-form-item label="标签更改机制" prop="mechanism" label-width="120px">
        <el-input
          :disabled="disableds"
          type="textarea"
          v-model="ruleForm.mechanism"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="medium"
          style="width:100px;margin-left:80px;"
          @click="resetForm('ruleForm')"
          >取 消</el-button
        >
        <el-button
          type="primary"
          style="width:100px;"
          size="medium"
          @click="submitForm('ruleForm')"
          >保 存</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      disableds: true,
      dialogFormVisible: false,
      ruleForm: {
        name: '',
        classiFication: '',
        attribute: '',
        sort: '',
        definition: '',
        mechanism: ''
      },
      rules: {
        name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        classiFication: [
          { required: true, message: '请输入标签分类', trigger: 'blur' }
        ],
        attribute: [
          { required: true, message: '请输入标签属性', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入标签排序', trigger: 'blur' }],
        definition: [
          { required: true, message: '请输入标签定义', trigger: 'blur' }
        ],
        mechanism: [
          { required: true, message: '请输入标签更改机制', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.ruleForm.name,
            classiFication: this.ruleForm.classiFication,
            attribute: this.ruleForm.attribute,
            sort: this.ruleForm.sort,
            definition: this.ruleForm.definition,
            mechanism: this.ruleForm.mechanism
          }
          console.log('params', params)
          this.dialogFormVisible = false
          this.$emit('onRefresh', 1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    }
  }
}
</script>

<style></style>
=======
<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-01 11:56:39
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-01 17:25:00
-->
<template>
  <el-dialog title="编辑标签" :visible.sync="dialogFormVisible" width="400px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="标签名称" prop="name" label-width="100px">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="标签分类" prop="classiFication" label-width="100px">
        <el-input v-model="ruleForm.classiFication"></el-input>
      </el-form-item>
      <el-form-item label="标签属性" prop="attribute" label-width="100px">
        <el-input :disabled="disableds" v-model="ruleForm.attribute"></el-input>
      </el-form-item>
      <el-form-item label="标签排序" prop="sort" label-width="100px">
        <el-input v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item label="标签定义" prop="definition" label-width="100px">
        <el-input v-model="ruleForm.definition"></el-input>
      </el-form-item>
      <el-form-item label="标签更改机制" prop="mechanism" label-width="120px">
        <el-input
          :disabled="disableds"
          type="textarea"
          v-model="ruleForm.mechanism"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="medium"
          style="width:100px;margin-left:80px;"
          @click="resetForm('ruleForm')"
          >取 消</el-button
        >
        <el-button
          type="primary"
          style="width:100px;"
          size="medium"
          @click="submitForm('ruleForm')"
          >保 存</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      disableds: true,
      dialogFormVisible: false,
      ruleForm: {
        name: '',
        classiFication: '',
        attribute: '',
        sort: '',
        definition: '',
        mechanism: ''
      },
      rules: {
        name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        classiFication: [
          { required: true, message: '请输入标签分类', trigger: 'blur' }
        ],
        attribute: [
          { required: true, message: '请输入标签属性', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入标签排序', trigger: 'blur' }],
        definition: [
          { required: true, message: '请输入标签定义', trigger: 'blur' }
        ],
        mechanism: [
          { required: true, message: '请输入标签更改机制', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.ruleForm.name,
            classiFication: this.ruleForm.classiFication,
            attribute: this.ruleForm.attribute,
            sort: this.ruleForm.sort,
            definition: this.ruleForm.definition,
            mechanism: this.ruleForm.mechanism
          }
          console.log('params', params)
          this.dialogFormVisible = false
          this.$emit('onRefresh', 1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    }
  }
}
</script>

<style></style>
>>>>>>> feature/ossPlugin-20210204
