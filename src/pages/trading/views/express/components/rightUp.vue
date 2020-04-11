<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-27 19:04:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-04-03 11:53:48
 -->
<template>
  <div class="container">
    <div class="search-up">
      <m-search
        @search="handleSearch"
        class="clearBorder"
        phone="user_id"
        stage="term"
        sup="sup"
        level="level"
        topicType="regtype"
        :timeData="[
          { text: '购买时间', value: 'ctime' },
          { text: '揽收时间', value: 'delivery_collect_time' },
          { text: '签收时间', value: 'signing_time' }
        ]"
      />
    </div>
    <!-- v-if="!teacherId" TOSS -->
    <div class="search-export" v-if="!teacherId">
      <!-- <div class="search-export"> -->
      <div>
        <el-button size="small" type="primary" @click="showExportDialog"
          >导出物流信息</el-button
        >
      </div>
      <div>
        <el-button size="small" type="primary" @click="dialogVisible = true">
          导入物流信息
        </el-button>
      </div>
    </div>

    <el-dialog title="导出物流消息" :visible.sync="dickUp" width="30%">
      <span>你确定导出这选中的数据嘛</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dickUp = false">取 消</el-button>
        <el-button type="primary" @click="exportExpress">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入物流信息"
      :visible.sync="dialogVisible"
      :before-close="handleCloseUpdata"
      width="30%"
    >
      <!-- action="/api/o/v1/express/importExpressList" -->

      <el-upload
        ref="upload"
        action=""
        accept=".xls, .xlsx"
        :data="{ teacherId }"
        :on-remove="handleRemove"
        :headers="headers"
        :auto-upload="false"
        :limit="1"
        :http-request="uploadFile"
        :on-progress="uploadProgress"
      >
        <el-button slot="trigger" size="small" type="primary"
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

    <!-- 上传文件报错提示 -->
    <el-dialog
      title="文件上传问题"
      :visible.sync="errorDialog.length > 0"
      width="500"
      :before-close="handleClose"
    >
      <p v-for="(item, index) in errorDialog" :key="index">
        {{ item.message }}
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorDialog = []">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { isToss, deepClone } from '@/utils/index'
import MSearch from '@/components/MSearch/index.vue'
import axios from 'axios'
export default {
  props: ['dataExp'],
  components: {
    MSearch
  },
  data() {
    return {
      errorDialog: [],
      teacherId: '',
      operatorId: '',
      searchIn: [],
      open: false,
      dialogVisible: false,
      dickUp: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      expressStatus: '',
      uploading: false,
      close: false,
      expressId: ''
    }
  },
  watch: {
    dataExp(val) {
      if (val.id) {
        this.expressStatus = val.id
      }
    }
  },
  created() {
    this.teacherId = isToss()
    this.operatorId =
      this.teacherId || JSON.parse(localStorage.getItem('staff')).id
    this.expressStatus = '0,1,2,3,6'
  },
  methods: {
    // 上传进度
    uploadProgress(event, file, fileList) {
      console.log(
        event,
        file,
        fileList,
        'event, file, fileList--------------------'
      )
    },
    // 上传物流关闭符号
    handleCloseUpdata() {
      this.dialogVisible = false
      this.$refs.upload.clearFiles()
      console.log(this.errorDialog, '----------------------')
    },
    // 导出物流关闭符号
    handleClose() {
      this.errorDialog = false
      this.$refs.upload.clearFiles()
    },
    uploadFile(params) {
      const formdata = new FormData()
      const file = params.file
      formdata.append('file', file)
      this.uploading = true
      axios
        .post(
          `/api/o/v1/express/importExpressListNew?operatorId=${this.operatorId}`,
          formdata
        )
        .then((res) => {
          this.$refs.upload.clearFiles()
          this.uploading = false
          if (res.code === 0 && res.payload.length < 1 && res.payload) {
            this.$message({
              showClose: true,
              message: '恭喜你，文件上传成功',
              type: 'success'
            })
          }
          this.dialogVisible = false
          this.errorDialog = !res.errors ? res.payload : []
        })
        .finally(() => {
          this.uploading = false
        })
      setTimeout(() => {
        this.uploading = false
      }, 2000)
    },

    handleRemove(file) {
      console.log(axios, '手动移除上传文件', file)
    },
    handlePreview(file) {
      console.log('手动移除传文件', file)
    },
    submitUpload(file, filelist) {
      this.$refs.upload.submit()
    },

    showExportDialog() {
      this.expressId = sessionStorage.getItem('uid') || []

      // 如果物流状态选择全部，不能导出
      console.log(
        this.expressStatus === '0,1,2,3,6',
        this.searchIn,
        this.expressId
      )
      if (
        this.expressStatus === '0,1,2,3,6' &&
        !this.searchIn.length &&
        !this.expressId.length
      ) {
        this.$message.error('不能导出全部物流，请选择状态或筛选')
        return
      }

      this.dickUp = true
    },
    /**
     * 导出物流信息
     */
    exportExpress(val) {
      var query
      const tableName = 'o_express'
      if (sessionStorage.getItem('uid')) {
        var uid = sessionStorage.getItem('uid').split(',')
        query = { bool: { must: [{ terms: { id: uid } }] } } // 自行通过前端选择的条件进行动态组装
        sessionStorage.removeItem('uid')
      } else {
        const term = this.searchIn.map((item, index) => {
          if (item.range && item.range.ctime) {
            item.range.create_order_time = item.range.ctime
            delete item.range.ctime
          }
          if (item.terms && item.terms.sup) {
            item.terms['sup.keyword'] = item.terms.sup
            delete item.terms.sup
          }
          if (item.terms && item.terms.level) {
            item.terms['level.keyword'] = item.terms.level
            delete item.terms.level
          }

          if (item.term && item.term.regtype) {
            item.terms = { regtype: item.term.regtype.split(',') }
            delete item.term
          }

          return item
        })
        // console.length(term, 'term')
        query = {
          bool: {
            must: term,
            filter: {
              bool: {
                should: [
                  { terms: { express_status: this.expressStatus.split(',') } }
                ]
              }
            }
          }
        } // 自行通过前端选择的条件进行动态组装
      }

      const sort = { ctime: 'desc' }
      const name = '物流数据'
      const headers = {
        id: '物流信息ID',
        user_id: '用户ID',
        out_trade_no: '订单号',
        regtype: '商品类型',
        term: '期数',
        sup: '课程难度',
        level: '课程级别',
        product_name: '物流商品名称',
        receipt_name: '收货人姓名',
        receipt_tel: '收货人手机号',
        province: '省',
        city: '市',
        area: '区',
        address_detail: '详细地址',
        express_nu: '快递单号',
        express_company: '物流公司',
        express_company_nu: '物流公司编号'
      }

      const params = {
        tableName,
        name,
        headers,
        query,
        sort
      }
      // axios
      //   .post(`/data/search/m1/v1/search/common/export`, params)
      axios({
        method: 'POST',
        url: '/data/search/m1/v1/search/common/export',
        responseType: 'blob',
        params
      }).then((res) => {
        this.downloadFn(res, '物流下载')
      })
    },
    dosomething() {},
    handleSearch(search) {
      this.searchIn = deepClone(search)
      this.searchIn.forEach((item) => {
        if (item.terms && item.terms.sup) {
          const sup = item.terms.sup.map((s) => {
            const str = s.toString().includes('S') ? s : `S${s}`
            return str
          })
          item.terms.sup = sup
          item.terms['sup.keyword'] = JSON.stringify(sup)
        }
        // debugger
        if (item.term && item.term.regtype) {
          if (Number(item.term.regtype) === 1) {
            item.term.regtype = '5'
          } else if (Number(item.term.regtype) === 2) {
            item.term.regtype = '4'
          } else if (Number(item.term.regtype) === 4) {
            item.term.regtype = '1'
          } else if (Number(item.term.regtype) === 5) {
            item.term.regtype = '2,3'
          }
        }
        // debugger
        return item
      })
      this.$emit('search', this.searchIn)
    },
    // 下载文件
    downloadFn(data, name = '下载') {
      if (!data) return
      console.log(data, 'data')
      const blob = new Blob([data])
      const fileUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = fileUrl
      // eslint-disable-next-line no-restricted-globals
      link.setAttribute('download', `${name}.xls`)

      document.body.appendChild(link)
      link.click()
      this.dickUp = false
      this.dosomething()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100px;
  background-color: #fff;
  padding: 5px;
  .search {
    display: flex;
    align-content: center;
    &-up {
      width: 100%;
    }
    &-export {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-content: center;
      & div {
        margin-right: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
.container {
  .clearBorder {
    border: none;
  }
}
</style>
