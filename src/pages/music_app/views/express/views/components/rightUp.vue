<template>
  <div class="container">
    <div class="search-up">
      <m-search
        ref="msearch"
        @search="handleSearch"
        class="clearBorder"
        :addSupS="addSupS"
        :phone="showItem.phone"
        :schedule="showItem.schedule"
        :sup="showItem.sup"
        :expressNo="showItem.expressNo"
        :level="showItem.level"
        :groupSell="showItem.groupSell"
        :teamDetail="showItem.teamDetail"
        :moreVersion="showItem.moreVersion"
        :timeData="showItem.timeData"
        :selectAddress="showItem.selectAddress"
        :consigneePhone="showItem.consigneePhone"
        :replenishReason="showItem.replenishReason"
        :replenishMethod="showItem.replenishMethod"
        :supPlaceholder="showItem.supPlaceholder"
        :topicType="showItem.topicType"
        :productType="showItem.productType"
        :operatorId="showItem.operatorId"
        :sourceType="showItem.sourceType"
        :replenishProduct="showItem.replenishProduct"
        :replenishType="showItem.replenishType"
        :replenishProductType="showItem.replenishProductType"
        :teacherTip="showItem.teacherTip"
        :teamClass="teamClass"
        :productName="showItem.productName"
        :regType="showItem.regType"
        :channel="showItem.channel"
      />
    </div>
    <!-- v-if="!teacherId" TOSS -->
    <!-- <div class="search-export" v-if="!teacherId"> -->
    <!-- <div class="search-export">
      <div>
        <el-button size="small" type="primary" @click="dialogVisible = true">
          导入物流信息
        </el-button>
      </div>
      <div>
        <el-button size="small" type="primary" @click="showExportDialog"
          >导出物流信息</el-button
        >
      </div>
    </div> -->

    <el-dialog title="导出物流消息" :visible.sync="dickUp" width="30%">
      <span>确定导出选中的数据嘛</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dickUp = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="exportLoading"
          @click="exportExpress"
        >
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
// 存储 全部物流/补发货 两个tab的搜索项数据，用于切换时重新搜索
let switchTabSearchIn = {}
export default {
  props: {
    addSupS:{
      type:Boolean,
      default:false
    },
    tab: {
      type: String,
      default: '0'
    },
    status: {
      type: String,
      default: ''
    },
    regtype: {
      type: String,
      default: ''
    },
    hideSearchItem: {
      type: Object,
      default: () => {
        return {}
      }
    },
    source_type: {
      type: String,
      default: ''
    },
    hideCol: {
      type: Object,
      default: () => {
        return {}
      }
    },
    teamClass: {
      type: String,
      default: '' // 系统课是1  体验课是0
    }
  },
  computed: {
    showItem() {
      // 体验课物流增加 订单来源 筛选
      if (this.teamClass === '0') {
        Object.assign(this.defaultShowItem, { channel: 'pay_channel' })
      }
      return { ...this.defaultShowItem, ...this.hideSearchItem }
    },
    searchInData() {
      return this.$store.state.leftbar.searchInData
    }
  },
  components: {
    MSearch
  },
  mounted() {
    switchTabSearchIn = {}
  },
  data() {
    return {
      exportLoading: false,
      errorDialog: [],
      teacherId: '',
      operatorId: '',
      searchIn: [],
      open: false,
      dialogVisible: false,
      dickUp: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      expressStatus: '0,1,2,3,4,5,6,7,8,9',
      uploading: false,
      close: false,
      expressId: '',
      defaultShowItem: {
        class: 'clearBorder',
        phone: 'user_id',
        schedule: 'term',
        sup: 'sup',
        expressNo: 'express_nu',
        level: 'level',
        groupSell: 'last_teacher_id',
        teamDetail: 'last_team_id',
        moreVersion: 'product_version.keyword',
        consigneePhone: 'receipt_tel',
        // channel: 'pay_channel',
        timeData: [
          { text: '购买时间', value: 'ctime' },
          { text: '揽收时间', value: 'delivery_collect_time' },
          { text: '签收时间', value: 'signing_time' },
          { text: '审核时间', value: 'center_ctime' }
        ],
        selectAddress: 'province',
        replenishReason: 'replenish_reason',
        replenishMethod: 'replenish_type'
      }
    }
  },
  watch: {
    status(val) {
      this.expressStatus = val
    },
    source_type() {
      this.$emit(
        'result',
        switchTabSearchIn[`searchIn${this.regtype}${this.source_type}`] || []
      )
    }
  },
  created() {
    this.teacherId = isToss()
    this.operatorId =
      this.teacherId || JSON.parse(localStorage.getItem('staff')).id
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
      Object.assign(formdata, { operatorId: this.operatorId })

      this.$http.Express.expressUpload(formdata)
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
    submitUpload(file, filelist) {
      this.$refs.upload.submit()
    },
    showImportDialog() {
      this.dialogVisible = true
    },
    showExportDialog() {
      this.expressId = sessionStorage.getItem('uid') || []
      // 如果物流状态选择全部，不能导出
      // 状态标签选择全部时 ，搜索条件为空或者用户选择条目为空 则给出弹窗提示不能导出
      if (
        !this.searchIn.length &&
        !this.expressId.length &&
        this.expressStatus === '0,1,2,3,4,5,6,7,8,9'
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
      const arrFlag = []
      if (sessionStorage.getItem('uid')) {
        var uid = sessionStorage.getItem('uid').split(',')
        query = { bool: { must: [{ terms: { id: uid } }] } } // 自行通过前端选择的条件进行动态组装
        sessionStorage.removeItem('uid')
      } else {
        console.log(this.searchIn, 'this.searchIn-=')
        const term = this.searchIn.map((item, index) => {
          if (item.terms && item.terms.sup) {
            item.terms['sup.keyword'] = item.terms.sup
            delete item.terms.sup
          }
          if (item.terms && item.terms.level) {
            item.terms['level.keyword'] = item.terms.level
            delete item.terms.level
          }
          if (item && item.wildcard && item.wildcard.express_nu) {
            item.wildcard['express_nu.keyword'] = item.wildcard.express_nu
            delete item.wildcard.express_nu
          }
          // if (item.wildcard && item.wildcard.last_team_id) {
          //   item['term'].team_id = item.wildcard.last_team_id
          //   delete item.wildcard.last_team_id
          // }
          if (item.term) {
            if (item.term && item.term.consigneePhone) {
              delete item.term.consigneePhone
            }
            if (item.term && item.term.product_name) {
              arrFlag.push({
                wildcard: {
                  'product_name.keyword': `*${item.term.product_name}*`
                }
              })
              delete item.term.product_name
            }
            if (item.term && item.term.product_type) {
              arrFlag.push({
                term: {
                  'product_type.keyword': item.term.product_type
                }
              })
              delete item.term.product_type
            }

            if (item.term && item.term.productType) {
              arrFlag.push({
                term: {
                  product_type: item.term.productType
                }
              })
              delete item.term.productType
            }
            if (item.term && item.term.replenish_reason) {
              arrFlag.push({
                terms: {
                  replenish_reason: item.term.replenish_reason
                }
              })
              delete item.term.replenish_reason
            }
            if (item.term && item.term.replenish_type) {
              arrFlag.push({
                terms: {
                  replenish_type: item.term.replenish_type
                }
              })
              delete item.term.replenish_type
            }
            if (item.term && item.term.regType) {
              arrFlag.push({
                terms: {
                  regtype: item.term.regType.split(',')
                }
              })
              delete item.term.regType
            } else {
              arrFlag.push({
                terms: { regtype: this.regtype.split(',') }
              })
            }
            if (item.term && item.term.province) {
              if (item.term.province.provincesCode) {
                arrFlag.push({
                  term: { 'province.keyword': item.term.province.provincesCode }
                })
              }
              if (item.term.province.citysCode) {
                arrFlag.push({
                  term: { 'city.keyword': item.term.province.citysCode }
                })
              }
              if (item.term.province.areasCode) {
                arrFlag.push({
                  term: { 'area.keyword': item.term.province.areasCode }
                })
              }
              delete item.term.province
            }
            if (Object.keys(item.term).length === 0) delete item.term
            // console.log(Object.keys(item.term), 'Object.keys(item.term)')
          }
          console.log(item, 'item++++++')
          return item
        })
        console.log(arrFlag, 'arrFlag==')
        const myTerm = term.concat(arrFlag)

        // term数组有空对象的，删除掉
        const newTerm = myTerm.filter((item) => Object.keys(item).length > 0)

        const finaTerm = newTerm.concat([
          {
            terms: { source_type: this.source_type.split(',') }
          },
          {
            terms: { regtype: this.regtype.split(',') }
          },
          { terms: { express_status: this.expressStatus.split(',') } }
        ])
        let finalmust = []
        finalmust = finaTerm.filter((item) => {
          if (!item.range) {
            return Object.values(Object.values(item)[0])[0].length
          }
          return item
        })
        // finalmust = finaTerm
        query = {
          bool: {
            must: finalmust
            // filter: {
            //   bool: {
            //     should: [
            //       { terms: { express_status: this.expressStatus.split(',') } }
            //     ]
            //   }
            // }
          }
        } // 自行通过前端选择的条件进行动态组装
      }

      const sort = { ctime: 'desc' }
      const name = '物流数据'
      const headers = {
        id: '物流信息ID',
        user_id: '用户ID',
        out_trade_no: '订单号',
        product_type: '商品类型',
        term: '期名',
        sup: '课程难度',
        level: '课程级别',
        product_name: '物流商品名称',
        product_version: '随材版本',
        'operator_name|replenish_reason|express_remark': '补发原因',
        receipt_name: '收货人姓名',
        receipt_tel: '收货人手机号',
        province: '省',
        city: '市',
        area: '区',
        address_detail: '详细地址',
        express_nu: '快递单号',
        express_company: '物流公司',
        express_company_nu: '物流公司编号',
        center_express_id:'中台物流Id'
      }
      // 补发货列表新增补发原因表头
      if (this.tab === '1') {
        headers.replenish_reason = '补发原因'
      }

      const params = {
        tableName,
        name,
        headers,
        query,
        sort
      }
      this.exportLoading = true
      this.$http.DownloadExcel.exportExpress(params).then(
        (res) => {
          this.downloadFn(res, '物流下载')
          this.exportLoading = false
        },
        () => {
          this.exportLoading = false
        }
      )
    },
    dosomething() {},
    handleSearch(search) {
      console.log(search, 'search==')
      this.searchIn = deepClone(search)
      this.searchIn.forEach((item) => {
        if (item.terms && (item.terms.sup || item.terms.product_type)) {
          const keyword =
            item.terms.sup || item.terms.sup === 0 ? 'sup' : 'product_type'
          const sup = item.terms[keyword].map((s) => {
            const str = s.toString().includes('S') ? s : `S${s}`
            return str
          })
          item.terms[keyword] = sup
          item.terms[keyword + '.keyword'] = JSON.stringify(sup)
        }
        return item
      })

      this.$emit('result', this.searchIn)
      console.log(this.searchIn, 'this.searchIn===')
      switchTabSearchIn[
        `searchIn${this.regtype}${this.source_type}`
      ] = this.searchIn
    },
    // 下载文件
    downloadFn(data, name = '下载') {
      if (!data) return
      const blob = new Blob([data])
      const fileUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = fileUrl
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
  background-color: #fff;
  padding: 5px;
  .search {
    display: flex;
    &-up {
      width: 100%;
    }
  }
  .search-export {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    padding-right: 100px;
    & div {
      padding: 5px;
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
