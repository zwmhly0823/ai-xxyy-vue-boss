<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-12 17:22:53
 -->
<template>
  <div class="second-step">
    <div class="step-container step-two-container">
      <div class="btn-area">
        <el-button
          type="primary"
          size="small"
          class="btn-directed"
          @click="exportExcel"
        >
          导入数据
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col :span="4" :offset="3">
          <org-dept @changeOrgDept="changeOrgDept"></org-dept>
        </el-col>
        <el-col :span="16">
          <div class="transfer-container">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="transferVal"
              filterable
              :right-default-checked="rightDefaultChecked"
              :props="{
                key: 'id',
                label: 'realname'
              }"
              :render-content="renderFunc"
              :titles="['待选择', '已选择']"
              :button-texts="['到左边', '到右边']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              @change="handleChange"
              :data="transferData"
            >
            </el-transfer>
          </div>
        </el-col>
      </el-row>

      <!-- 取消、下一步 -->
      <div class="operate-btn">
        <el-button size="small" type="primary" @click="stepOperate(0)"
          >上一步</el-button
        >
        <el-button size="small" type="primary" @click="stepOperate(1)"
          >下一步</el-button
        >
      </div>
    </div>
    <!-- 导入数据模态框 -->
    <el-dialog
      title="导入数据"
      :visible.sync="dialogVisible"
      :before-close="handleCloseUpdata"
      width="30%"
    >
      <el-upload
        ref="upload"
        action=""
        accept=".xls, .xlsx"
        :headers="headers"
        :auto-upload="false"
        :limit="1"
        :http-request="uploadFile"
      >
        <el-button
          slot="trigger"
          size="small"
          type="primary"
          :disabled="uploading"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
          :disabled="uploading"
          >上传到服务器</el-button
        >
        <!-- :loading="uploading" -->
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import OrgDept from './OrgDept'
export default {
  props: ['stepStatus'],
  data() {
    return {
      dialogVisible: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      uploading: false,
      params: {
        period: '',
        courseType: '0'
      },
      rightDefaultChecked: [],
      transferData: [],
      transferVal: [],
      teachers: [],
      // 当前页数
      currentPage: 1,
      renderFunc(h, option) {
        return (
          <span>
            {option.id} - {option.realname}
          </span>
        )
      }
    }
  },
  components: {
    OrgDept
  },
  watch: {},
  async created() {
    const { period = 0, courseType = '0' } = this.$route.params
    Object.assign(this.params, { period, courseType })

    await this.getTeacherByDept()
    if (+period) {
      const teachers = await this.getTeacherIdArray()
      teachers.forEach((item) => {
        this.transferVal.push(item.teacherId)
        this.rightDefaultChecked.push(item.teacherId)
      })
    }
  },
  methods: {
    // 编辑页获取所 选择的 teacher：
    async getHasSelectTeacher() {
      try {
        const teacherList = await this.$http.Operating.getHasSelectTeacher(
          this.params
        )
        const { payload = [] } = teacherList
        return Promise.resolve(payload)
      } catch (err) {
        this.$message({
          message: '获取数据出错',
          type: 'warning'
        })
        return Promise.reject(err)
      }
    },
    // 获取部门tree信息
    department(dept = {}) {
      // 根据部门ID获取老师ID
      let { id, pid, children, query = {} } = dept

      if (+id) {
        query = {
          department: {
            id: `${id}`,
            pid: `${pid}`,
            children: `${JSON.stringify(children)}`
          }
        }
      }

      this.departmentQuery = query
      this.getTeacherByDept(1, JSON.stringify(query))
    },
    // 获取老师数据
    async getTeacherIdArray() {
      // 编辑页面
      if (this.params.period) {
        const teachers = await this.getHasSelectTeacher()
        return teachers
      }
    },
    async getTeacherByDept(page = this.currentPage) {
      if (this.departmentQuery) {
        this.query = Object.assign({}, this.departmentQuery || {})
      }
      const query = this.query ? JSON.stringify(this.query) : ''
      // tab数据
      const res = await this.$http.Teacher.getTeacherRealnameAndId(
        page,
        JSON.stringify(query),
        3000
      )
      if (res && res.data) {
        const { content = [], number } = res.data.TeacherManagePage || {}

        this.transferData = content
        this.currentPage = +number
      }
    },
    /** 导入数据 */
    exportExcel() {
      this.dialogVisible = true
    },
    /** 导入数据 关闭事件 */
    handleCloseUpdata() {
      this.dialogVisible = false
      this.$refs.upload.clearFiles()
    },
    /** 导入数据上传 */
    uploadFile(params) {
      const { courseType = 1 } = this.$route.params
      const formdata = new FormData()
      const { file } = params
      formdata.append('file', file)

      this.uploading = true
      Object.assign(formdata, { courseType })

      this.$http.DownloadExcel.updateScheduleExcel(formdata)
        .then((res) => {
          if (res && Object.prototype.toString.call(res) === '[object Blob]') {
            this.$refs.upload.clearFiles()
            this.dialogVisible = false
            this.downloadFn(res, file.name, () => {
              this.$emit('setExcelStatus', 'complete')
            })
          } else {
            this.$message.error('上传失败，请检测文件！')
          }
        })
        .finally(() => {
          this.uploading = false
        })
    },
    // 下载文件
    downloadFn(data, fileName = '下载', cb) {
      if (!data) return
      const blob = new Blob([data])
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)

      cb && cb()
    },
    submitUpload(file, filelist) {
      this.$refs.upload.submit()
    },
    changeOrgDept(data) {
      this.department(data)
    },
    handleChange(val) {},
    stepOperate(type) {
      if (!type) {
        this.$emit('listenStepStatus', type)
      } else if (!this.transferVal.length) {
        this.$message({
          message: '请先选择老师哟！',
          type: 'warning'
        })
      } else {
        this.$store.commit('setScheduleTeacher', this.transferVal)
        this.$emit('listenStepStatus', this.transferVal)
      }
    }
  }
}
</script>
<style>
.el-transfer-panel__filter {
  text-align: center;
  margin: 15px;
  box-sizing: border-box;
  display: block;
  width: auto;
}
.el-transfer-panel__body {
  height: 300px;
}
.el-transfer-panel__list.is-filterable {
  height: 270px;
}
</style>
<style lang="scss" scoped>
.step-two-container {
  // margin: 60px 0;
  .transfer-container {
    text-align: center;
  }
  .btn-area {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
    max-width: 1250px;
    margin: 0 auto;
  }
  .operate-btn {
    display: flex;
    justify-content: center;
    margin: 40px 0 10px 0;
  }
}
</style>
