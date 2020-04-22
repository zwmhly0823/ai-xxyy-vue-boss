<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-15 16:56:59
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-16 20:54:18
 -->
<template>
  <div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      class="demo-ruleForm"
      label-position="top"
    >
      <!-- 关联老师 title -->
      <div style="margin-bottom:25px">
        <!-- <span style="color:red;margin-right:4px;">*</span> -->
        <span style="font-weight:700">关联老师</span>
      </div>
      <div class="associatedTeacherCss">
        <el-form-item prop="associatedTeacher">
          <el-cascader
            style="width:270px;"
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
            clearable
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
      <el-form-item>
        <div class="sub-box">
          <el-button
            class="submit-css"
            type="primary"
            @click="submitForm('ruleForm')"
            >确定</el-button
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
export default {
  props: ['weixinId'],
  data() {
    return {
      loading: false,
      associatedTeacher: [],
      regionOptionsList: [],
      TeacherListvalue: '',
      optionProps: {
        value: 'id',
        label: 'name'
      },
      ruleForm: {
        teacherId: '',
        associatedTeacher: ''
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
            this.TeacherListvalue = `{"department_id": ${this.ruleForm.associatedTeacher}}`
          }
          this.$http.Teacher.TeacherList(this.TeacherListvalue).then((res) => {
            const data = res.data.TeacherList
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
          })
        }, 200)
      } else {
        this.regionOptionsList = []
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            teacherId: this.ruleForm.teacherId ? this.ruleForm.teacherId : '',
            weixinId: this.weixinId
          }
          console.log(params, 'fasdsafs')
          this.$http.Teacher.relation(params).then((res) => {
            console.log(res, 'res')
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$emit('relationTeacher', 1)
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
      this.$emit('relationTeacher', 2)
    }
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
