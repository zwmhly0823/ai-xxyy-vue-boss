<template>
  <div class="channelAdd-box">
    <div class="channelAdd-top">
      <div class="channelAdd-top-search">
        <channel-search
          class="channelAdd-search"
          :tabIndex="tabIndex"
          @channelSearchValue="channelSearchValue"
          @channelInputValue="channelInputValue"
        ></channel-search>
      </div>
    </div>
    <div class="channelAdd-table">
      <el-table
        :header-cell-style="headerCss"
        :data="tableData"
        :cell-style="cellStyle"
        style="width: 100%"
      >
        <el-table-column width="20px">
          <template slot-scope="scope">
            <el-Popover popper-class="batch-btn" trigger="hover">
              <div size="mini" type="text" @click="batchBtn(scope.row)">
                <span style="cursor:pointer">编辑</span>
              </div>
              <div
                @mouseenter="handleEdit(scope.$index, scope.row)"
                slot="reference"
              >
                <img src="@/assets/images/point.png" />
              </div>
            </el-Popover>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="id" label="渠道id" align="center">
        </el-table-column>
        <el-table-column label="渠道分类" width="180" align="center">
          <template slot-scope="scope">
            <div class="logistics-wx-box">
              <span>{{ scope.row.p_channel_class_name }}</span>
              <span style="margin-left:20px">{{
                scope.row.channel_class_name
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="channel_inner_name"
          label="渠道名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="status" label="渠道状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">启用</span>
            <span v-else>停用</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道备注" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.remarks">{{ scope.row.remarks }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ctime"
          label="创建时间"
          width="160"
          align="center"
        >
        </el-table-column>
      </el-table>
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+currentPage"
        :total="+totalElements"
        open="calc(100vw - 95px - 100px)"
        close="calc(100vw - 23px - 50px)"
      />
    </div>
    <el-drawer
      class="drawer-detail"
      :show-close="showClose"
      :visible.sync="addDrawer"
      :modal="false"
      size="30%"
    >
      <add-cahnnel
        @addChannelShowBtn="addChannelShowBtn"
        @addChannelShow="addChannelShow"
      />
    </el-drawer>
    <el-drawer
      class="drawer-detail"
      :show-close="showClose"
      :visible.sync="modifyDrawer"
      :modal="false"
      size="30%"
    >
      <modify-cahnnel
        v-if="modifyDrawer"
        :modifyRow="modifyRow"
        @modifyChannelShowBtn="modifyChannelShowBtn"
        @modifyChannelShow="modifyChannelShow"
      />
    </el-drawer>
  </div>
</template>

<script>
import channelSearch from '../components/componentsSearch/channelInforSearch'
import addCahnnel from '../components/components/addCahnnel'
import modifyCahnnel from '../components/components/modifyCahnnel'
import MPagination from '@/components/MPagination/index.vue'
import { timestamp } from '../../../../../utils/index'
import {
  downloadByBlob,
  downImgAll
} from '../components/components/downloadQRcode'
export default {
  props: {
    tabIndex: {
      type: String,
      default: ''
    }
  },
  components: {
    channelSearch,
    MPagination,
    addCahnnel,
    modifyCahnnel
  },
  data() {
    return {
      downLoad: false,
      channelDate: false,
      scheduling: false,
      showClose: false,
      addDrawer: false,
      modifyDrawer: false,
      currentPage: '1',
      totalElements: '',
      tableData: [],
      queryList: [],
      channelName: [],
      modifyRow: '',
      imgList: [
        {
          channelId: '21',
          img: 'https://s1.meixiu.mobi/h5/headPic/1587896513277.jpg'
        },
        {
          channelId: '26',
          img:
            'http://s1.meixiu.mobi/iOSImage/4e41b93c7f7ec80dc943d12aa94fa528.jpg'
        },
        {
          channelId: '31',
          img:
            'http://s1.meixiu.mobi/iOSImage/bbd1b2f1ad446840aa09663b533ff0a6.jpg'
        },
        {
          channelId: '32',
          img:
            'http://s1.meixiu.mobi/android-images/2020-04-30/7ff9aa1f04644a829313ccdbbdfd0774.jpeg'
        },
        {
          channelId: '11',
          img:
            'http://s1.meixiu.mobi/iOSImage/7e360fb83ca6be1b09bff5f37a7d328c.jpg'
        },
        {
          channelId: '22',
          img:
            'http://s1.meixiu.mobi/iOSImage/72d1f779396b80cc7ee00c3b4346ed93.jpg'
        },
        {
          channelId: '33',
          img:
            'http://s1.meixiu.mobi/iOSImage/30b80ff5402873d95b5c75123d931829.jpg'
        },
        {
          channelId: '44',
          img:
            'http://s1.meixiu.mobi/android-images/2020-05-03/4b01192047ef43a9b4377d1a43c85fa8.jpeg'
        }
      ],
      tableInfoObj: {}
    }
  },
  watch: {
    tabIndex(value) {
      if (value === '2') {
        this.queryList = `""`
        this.currentPage = 1
        this.getChannelOne()
      }
    }
  },
  created() {
    console.log('secchannelInfomation 被创建')
    // this.getChannelOne()
  },
  methods: {
    // 获取渠道id
    getChannelOne() {
      const arrOne = []
      this.$http.Operating.getChannelAndClass(17).then((res) => {
        const data = res.payload.channelList
        data.forEach((item) => {
          arrOne.push(item.id)
        })

        this.$http.Operating.getChannelAndClass(36).then((res) => {
          const arrTwo = []
          const data = res.payload.channelList
          data.forEach((item) => {
            arrTwo.push(item.id)
          })
          this.getChannelDetailStatisticsPage()
          this.channelName = arrOne.concat(arrTwo)
        })
      })
    },
    // 列表请求
    getChannelDetailStatisticsPage() {
      if (this.queryList.length === 0) {
        this.queryList = `""`
      }
      this.$http.Operating.ChannelDetailStatisticsPage(
        this.queryList,
        this.currentPage
      ).then((res) => {
        console.log('sec res: ', res)
        this.currentPage = res.data.ChannelDetailStatisticsPage.number
        this.totalElements = res.data.ChannelDetailStatisticsPage.totalElements
        const _data = res.data.ChannelDetailStatisticsPage.content
        _data.forEach((data) => {
          // `http://${row.short_er_code}`
          if (data.short_er_code) {
            data.short_er_code = `http://${data.short_er_code}`
          }

          // if (data.status === 0) {
          //   data.status = '停用'
          // } else {
          //   data.status = '启用'
          // }
          if (+data.ctime) {
            data.ctime = timestamp(data.ctime, 2)
          } else {
            data.ctime = '-'
          }
          const majorIndex = this.channelName.findIndex((id) => id === data.id)
          data.isExtension = majorIndex === -1 ? 0 : 1
        })
        this.tableData = _data
      })
    },
    // 渠道下拉框
    channelSearchValue(data) {
      console.log(data)
      this.currentPage = 1
      if (data) {
        const channelClassId = []
        const channelId = []
        data.forEach((res) => {
          if (res[1]) {
            channelClassId.push(res[1])
          }
          if (res[2]) {
            channelId.push(res[2])
          }
        })
        const channelClassid = {
          channel_class_id: Array.from(new Set(channelClassId)),
          id: channelId
        }
        // const id = {  }
        this.queryList = `${JSON.stringify(JSON.stringify(channelClassid))}`
        console.log(
          this.queryList,
          'this.queryListthis.queryListthis.queryList'
        )
      } else {
        this.queryList = `""`
      }
      this.getChannelDetailStatisticsPage()
    },
    // 模糊搜索
    channelInputValue(data) {
      this.currentPage = 1
      if (data) {
        this.queryList = `"{\\"id\\":[\\"${data}\\"]}"`
      } else {
        this.queryList = `""`
      }
      this.getChannelDetailStatisticsPage()
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getChannelDetailStatisticsPage()
    },
    handleEdit(index, row) {
      // 鼠标移入三个点上面触发的事件
      // 当没有点击复选框 直接点击加好友
      console.log(index, row, '点击查看详情11')
    },
    // 点击添加渠道
    onAddChannel() {
      this.addDrawer = true
    },
    // 添加渠道点击提交刷新页面
    addChannelShowBtn(data) {
      this.getChannelDetailStatisticsPage()
    },
    // 关闭添加渠道页面
    addChannelShow(data) {
      this.addDrawer = data
    },
    // 点击编辑
    batchBtn(row) {
      this.modifyDrawer = true
      this.modifyRow = row
    },
    modifyChannelShowBtn(data) {
      this.getChannelDetailStatisticsPage()
    },
    // 关闭编辑页面
    modifyChannelShow(data) {
      this.modifyDrawer = data
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;background:#f0f1f2;'
    },
    // 单元格回调样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'max-height:50px;'
    },
    // 下载单张二维码
    onUpload(row) {
      console.log(row, 'xiazai')
      const url = row.short_er_code
      console.log(url)

      setTimeout(() => {
        downloadByBlob(
          url,
          `${row.p_channel_class_name}-${row.channel_class_name}-${row.channel_inner_name}-${row.id}`
        )
      }, 300)
    },
    // 批量下载二维码
    onBulkDownload() {
      // const loadingInstance = this.$loading({
      //   target: '.app-main',
      //   lock: true,
      //   text: '批量下载中...',
      //   fullscreen: true
      // })
      this.downLoad = true
      const imgAll = this.tableData
      // const imgAll = this.imgList
      const imgUrlList = []
      const imgListName = {}
      imgAll.forEach((res) => {
        // res.short_er_code && (imgUrlList[res.id] = res.short_er_code)
        // res.short_er_code &&
        //   (imgListName[
        //     res.id
        //   ] = `${res.p_channel_class_name}-${res.channel_class_name}-${res.channel_inner_name}-${res.id}`)
        if (res.short_er_code) {
          imgUrlList.push({ id: res.id, shortCode: res.short_er_code })
          imgListName[
            res.id
          ] = `${res.p_channel_class_name}-${res.channel_class_name}-${res.channel_inner_name}-${res.id}`
        }
      })
      if (imgUrlList.length === 0) {
        this.downLoad = false
        return
      }
      // imgAll.forEach((res) => {
      //   imgUrlList.push(res.img)
      //   imgListName.push(`渠道${res.channelId}`)
      // })

      downImgAll(imgListName, imgUrlList)
        .then((res) => {
          // loadingInstance.close()
          console.log(res)
          this.downLoad = false
        })
        .catch((err) => {
          // loadingInstance.close()
          this.downLoad = false
          console.log(err)
        })
    },
    // 点击查看链接
    onLink(row) {
      window.open(row.channel_link)
    },
    // 点击推广人统计查看
    onExtension(row) {
      console.log(row, '推广人链接')
      this.$http.Operating.getEncode(row.id).then((res) => {
        // window.location.href = res
        window.open(res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.channelAdd-box {
  background: #f0f1f2;
  padding: 10px 10px 10px 10px;
  height: calc(100vh - 140px);
  padding-bottom: 30px;
  overflow: scroll;
  .channelAdd-top {
    .channelAdd-top-search {
      background: #fff;
      padding: 15px;
      .channelAdd-search {
        display: inline;
      }
      .add-btn {
        margin-left: 20px;
        width: 100px;
      }
      .bulkDownload {
        width: 100px;
        float: right;
      }
    }
  }
  .channelAdd-table {
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    background: #fff;
  }
  .drawer-detail {
    margin: 50px 10px 10px 10px;
  }
}
</style>
