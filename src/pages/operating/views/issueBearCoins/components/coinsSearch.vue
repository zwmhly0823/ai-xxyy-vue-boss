<template>
  <div class="search-container">
    <el-card border="false" shadow="never">
      <el-row type="flex">
        <el-col :span="22">
          <el-form :inline="true">
            <el-form-item label="用户手机号:">
              <search-phone-or-usernum
                defaultType="0"
                :isHidden="false"
                :name="['mobile']"
                type="3"
                tablename="UserSubjectStatisticsList"
                @result="getSearchUid('user', arguments)"
              />
            </el-form-item>
            <el-form-item label="补发类型:">
              <simple-select
                name="send_coins"
                placeholder="全部类型"
                :multiple="false"
                :my-style="{ width: '120px' }"
                :data-list="coinsStatus"
                @result="getSearchData('send_coins', arguments)"
                class="search-group-item"
              />
            </el-form-item>
            <el-form-item label="发放时间:">
              <DatePicker
                :class="[$style.fourPoint, 'allmini']"
                @result="getDate"
                name="ctime"
              >
              </DatePicker>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 目前只有 18618194642 （463055260383186944）有导入权限 -->
        <el-col :span="2" v-if="isAuth">
          <el-button size="mini" type="primary" @click="dialogVisible = true">
            导入模板
          </el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="导入模板"
      :visible.sync="dialogVisible"
      :before-close="handleCloseUpdata"
      width="30%"
    >
      <el-upload
        ref="upload"
        action=""
        accept=".csv"
        :headers="headers"
        :auto-upload="false"
        :limit="1"
        :http-request="uploadFile"
        :on-progress="uploadProgress"
        :on-exceed="handleExceed"
        :on-change="handleChange"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
          :disabled="uploading || fileList.length === 0"
          >上传到服务器</el-button
        >
        <!-- :loading="uploading" -->
        <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import DatePicker from '@/components/MSearch/searchItems/datePicker.vue'
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
import enums from './coinsData'
export default {
  components: {
    SimpleSelect,
    DatePicker,
    SearchPhoneOrUsernum
  },
  data() {
    return {
      ...enums,
      searchQuery: {},
      dialogVisible: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      uploading: false,
      fileList: [],
      staff: {}
    }
  },
  computed: {
    isAuth() {
      return JSON.parse(localStorage.getItem('staff')).mobile === '18618194642'
    }
  },
  methods: {
    // 用户ID接收值
    getSearchUid(key, res) {
      const search = res && res[0]
      const mobile = { mobile: search.mobile }
      this.$emit('searchUid', mobile)
    },
    // 补发类型接收值
    getSearchData(key, res) {
      const search = res && res[0]
      const searchQuery = {}
      if (search) {
        searchQuery.transType = search[key]
      }
      this.$emit('search', searchQuery)
    },
    // 日期接收值
    getDate(res) {
      if (res) {
        delete res.quick
      }
      this.$emit('ctime', res)
    },
    uploadProgress() {},
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        '当前限制只能选择1个文件,可删除当前已选择文件重新选择'
      )
    },
    // 上传模板
    uploadFile(params) {
      const formdata = new FormData()
      const file = params.file
      formdata.append('file', file)
      this.uploading = true
      Object.assign(formdata, {})

      this.$http.Operating.exportUpload(formdata)
        .then((res) => {
          this.$refs.upload.clearFiles()
          this.uploading = false
          if (res.code === 0) {
            this.$message({
              showClose: true,
              message: '恭喜你，模板导入成功',
              type: 'success'
            })
            this.$emit('exportFile', true)
          }
          this.dialogVisible = false
        })
        .finally(() => {
          this.uploading = false
        })
      setTimeout(() => {
        this.uploading = false
      }, 2000)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 导入模板弹窗关闭
    handleCloseUpdata() {
      this.dialogVisible = false
      this.$refs.upload.clearFiles()
    }
  }
}
</script>
<style lang="scss" module>
.cur {
  background-color: #ecf5ff;
}
.fourPoint {
  display: flex;
}
:global {
  /* 定义多个全局样式 */
  .allmini {
    display: flex;
    align-items: center;
    height: 40px;
  }
}
</style>
<style lang="scss" scoped>
.export-btn {
  text-align: right;
}
.search-container {
  ::v-deep {
    .el-card {
      border-radius: 0;
      border: 0;
      border-bottom: 10px solid #f0f1f2;
      &__body {
        padding-bottom: 0;
      }
      .el-button {
        position: relative;
        top: 5px;
      }
    }
    .el-form-item {
      margin-right: 20px;
    }
  }
}
</style>
