<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-27 19:04:54
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-30 21:33:36
 -->
<template>
  <div class="container">
    <div class="search-up">
      <m-search
        @search="handleSearch"
        phone="user_id"
        stage="term"
        sup="sup"
        level="level"
        :timeData="[
          { text: '购买时间', value: 'ctime' },
          { text: '揽收时间', value: 'delivery_collect_time' },
          { text: '签收时间', value: 'signing_time' }
        ]"
      />
    </div>
    <div class="search-export">
      <div>
        <el-button size="small" type="primary" @click="dickUp = true"
          >导出物流信息</el-button
        >
      </div>
      <!-- <div>
        <el-button size="small" type="primary" @click="dialogVisible = true">
          导入物流信息
        </el-button>
      </div> -->
    </div>

    <el-dialog
      title="导出物流消息"
      :visible.sync="dickUp"
      width="30%"
      :before-close="handleClose"
    >
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
      width="30%"
      :before-close="handleCloseExport"
    >
      <!-- action="/api/o/v1/express/importExpressList" -->

      <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        accept=".xls"
        :data="{ teacherId }"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :headers="headers"
        :auto-upload="false"
        :http-request="uploadFile"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </el-dialog>
    <el-dialog
      title="文件上传问题"
      :visible.sync="errorDialog.length > 0"
      width="500"
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
import { isToss } from '@/utils/index'
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
      searchIn: [],
      open: false,
      dialogVisible: false,
      dickUp: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      expressStatus: ''
    }
  },
  watch: {
    dataExp(val) {
      if (val.id) {
        this.expressStatus = val.id
        console.log(this.expressStatus, ' this.expressStatus')
      }
      console.log(val, 'el-col-xl-push-10')
    }
  },
  created() {
    this.teacherId = isToss()
    this.expressStatus = '0,1,2,3,6'
  },
  // mounted() {
  //   // console.log('token', this.token)
  //   // setTimeout(() => {
  //   //   this.$store.commit('SET_TOKEN', 222)
  //   //   console.log('token', this.token)
  //   // }, 1000)
  // },
  // computed: {
  //   ...mapGetters(['token'])
  // },
  methods: {
    uploadFile(params) {
      console.log(params)
      const formdata = new FormData()
      const file = params.file
      formdata.append('file', file)

      axios
        .post(
          `/api/o/v1/express/importExpressList?operatorId=${this.teacherId}`,
          formdata
        )
        .then((res) => {
          console.log(res.payload)

          this.$message({
            showClose: true,
            message: '恭喜你，文件上传成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.errorDialog = res.payload
        })
        .catch((error) => {
          // 前端的token留在点击退出按钮那里删除，这里就只是提示过期
          if (error.message !== '') {
            this.$message.warning('此表你已经上传过了')
          }
        })
    },
    // importESKSKS(file) {
    //   axios({
    //     method: 'POST',
    //     url: '/api/o/v1/express/importExpressList',
    //     file
    //   }).then((res) => console.log(res))
    // },
    handleRemove(file) {
      console.log(axios, '手动移除上传文件', file)
      // axios.post(`/api/o/v1/express/importExpressList?${val}&${val})
    },
    handlePreview(file) {
      console.log('手动移除传文件', file)
    },
    submitUpload(file, filelist) {
      this.$refs.upload.submit()
      // console.log(file, filelist, `/api/o/v1/express/importExpressList?`)
      // axios
      //   .post(`/api/o/v1/express/importExpressList?${1}&${file}`)
      //   .then((res) => {
      //     console.log(res, 'zheshishenme')
      //   })29510

      console.log('提交上传文件')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    handleCloseExport(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    handleChange() {},

    importExpress() {},
    exportExpress(val) {
      var query
      const tableName = 'o_express'
      if (sessionStorage.getItem('uid')) {
        var uid = sessionStorage.getItem('uid').split(',')
        query = { bool: { must: [{ terms: { user_id: uid } }] } } // 自行通过前端选择的条件进行动态组装
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

          return item
        })
        term.push({ term: { last_teacher_id: this.teacherId } })
        console.log(term, this.searchIn, 'thsi.searchIN')
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
        packagestype: '课程类型',
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
        console.log(res)
        this.downloadFn(res, '物流下载')
      })
    },
    handleSearch(search) {
      // 期数 加 S
      const tempTem = []
      const mySearch = search.map((item) => {
        if (item.terms && item.terms.sup) {
          const sup = item.terms.sup.map((s) => {
            let str = ''
            const idx = tempTem.join().indexOf(s)
            if (idx === -1) {
              str = `S${s}`
              tempTem.push(s)
            } else {
              tempTem.splice(0, idx)
            }
            console.log(str)

            return str
          })
          item.terms.sup = sup
          item.terms['sup.keyword'] = JSON.stringify(sup)
        }
        return item
      })

      console.log('mySearch---------', mySearch)
      this.searchIn = mySearch
      this.$emit('search', search)
    },
    importRelAddress() {
      console.log('1111')
    },
    // 下载文件
    downloadFn(data, name = '下载') {
      if (!data) return
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
