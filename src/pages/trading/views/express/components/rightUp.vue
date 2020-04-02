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
      <!-- <m-search
        @search="handleSearch"
        phone="umobile"
        :timeData="[
          { text: '购买时间', value: 'ctime' },
          { text: '揽收时间', value: 'delivery_collect_time' },
          { text: '签收时间', value: 'signing_time' }
        ]"
      /> -->
      <m-search
        @search="handleSearch"
        phone="user_id"
        stage="stage"
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
      <div @click="exportExpress">
        <el-button size="small" type="primary" @click="dickUp = true"
          >导出物流信息</el-button
        >
      </div>
      <div>
        <el-button size="small" type="primary" @click="dialogVisible = true">
          导入物流信息
        </el-button>
      </div>
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
        <el-button type="primary" @click="dickUp = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入物流信息"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleCloseExport"
    >
      <el-upload
        class="upload-demo"
        ref="upload"
        :data="custom"
        action="https://test.meixiu.mobi/api/o/v1/express/importExpressList"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :auto-upload="false"
        @http-request="importESKSKS"
        :headers="headers"
      >
        <div slot="tip" class="el-upload__tip">
          请选择Excel文件(后缀名为.xls)
        </div>
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
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { isToss } from '@/utils/index'
import MSearch from '@/components/MSearch/index.vue'
import axios from 'axios'
export default {
  components: {
    MSearch
  },
  data() {
    return {
      teacherId: '',
      searchIn: [],
      open: false,
      dialogVisible: false,
      dickUp: false,
      custom: {
        id: '99'
      },
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  },
  created() {
    this.teacherId = isToss()
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
    importESKSKS() {
      console.log(123)
    },
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
      //   })

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
        const term = this.searchIn
        query = { bool: { must: [{ term }] } } // 自行通过前端选择的条件进行动态组装
      }

      const sort = { ctime: 'desc' }
      const name = '物流数据'
      const headers = {
        id: '物流信息ID',
        user_id: '用户ID',
        out_trade_no: '订单号',
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
      console.log(search, '1111')
      this.$emit('search', search)
      const { range } = (search.this.searchIn = search)
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
