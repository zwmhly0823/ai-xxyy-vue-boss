<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-05-06 16:33:15
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-09 20:48:30
 -->
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
        <el-button
          class="add-btn"
          @click="onAddChannel"
          size="mini"
          type="primary"
          >添加渠道</el-button
        >
      </div>
    </div>
    <div class="channelAdd-table">
      <el-button
        class="bulkDownload"
        size="mini"
        type="primary"
        @click="onBulkDownload"
        :loading="downLoad"
        >批量下载</el-button
      >
      <el-table
        :header-cell-style="headerCss"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column width="20px">
          <template slot-scope="scope">
            <el-Popover popper-class="batch-btn" trigger="hover">
              <div size="mini" type="text" @click="batchBtn">
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
        <el-table-column prop="date" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="渠道id" width="180">
        </el-table-column>
        <el-table-column prop="address" label="渠道分类"> </el-table-column>
        <el-table-column prop="address" label="渠道名称"> </el-table-column>
        <el-table-column prop="address" label="渠道状态"> </el-table-column>
        <el-table-column prop="address" label="渠道备注"> </el-table-column>
        <el-table-column prop="address" label="创建时间"> </el-table-column>
        <el-table-column prop="address" width="300" align="center" label="其他">
          <template slot-scope="scope">
            <div class="logistics-wx-box">
              <!-- <el-button size="mini" type="text" @click="onUpload(scope.row)">
                {{ scope.row.name }}</el-button
              > -->
              <a
                style="color:#409EFF;font-size:12px;"
                href="https://www.baidu.com"
                target="_blank"
                >查看链接</a
              >
              <a
                style="color:#409EFF;font-size:12px;margin-left:10px;margin-right:10px;"
                size="mini"
                type="text"
                @click="onUpload(scope.row)"
              >
                下载二维码</a
              >
              <a
                style="color:#409EFF;font-size:12px;"
                @click="onExtension(scope.row)"
                target="_blank"
                >推广人统计查看</a
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="1"
        :total="10"
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
      <add-cahnnel @addChannelShow="addChannelShow" />
    </el-drawer>
    <el-drawer
      class="drawer-detail"
      :show-close="showClose"
      :visible.sync="modifyDrawer"
      :modal="false"
      size="30%"
    >
      <modify-cahnnel @modifyChannelShow="modifyChannelShow" />
    </el-drawer>
  </div>
</template>

<script>
import channelSearch from '../components/componentsSearch/channelInforSearch'
import addCahnnel from '../components/components/addCahnnel'
import modifyCahnnel from '../components/components/modifyCahnnel'
import MPagination from '@/components/MPagination/index.vue'
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
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区'
        }
      ],
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
      ]
    }
  },
  created() {},
  methods: {
    channelSearchValue(data) {
      console.log(data, 'datassss channel')
    },
    channelInputValue(data) {
      console.log(data, 'datassss input')
    },
    // 分页
    handleCurrentChange() {},
    handleEdit(index, row) {
      // 鼠标移入三个点上面触发的事件
      // 当没有点击复选框 直接点击加好友
      console.log(index, row, '点击查看详情11')
    },
    // 点击添加渠道
    onAddChannel() {
      this.addDrawer = true
    },
    // 关闭添加渠道页面
    addChannelShow(data) {
      this.addDrawer = data
    },
    // 点击编辑
    batchBtn() {
      this.modifyDrawer = true
    },
    // 关闭编辑页面
    modifyChannelShow(data) {
      this.modifyDrawer = data
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;background:#f0f1f2;'
    },
    // 下载单张二维码
    onUpload(row) {
      console.log(row, 'xiazai')
      const url = 'https://s1.meixiu.mobi/h5/headPic/1587896513277.jpg'
      setTimeout(() => {
        downloadByBlob(url, `渠道${row.date}`)
      }, 300)
    },
    // 批量下载二维码
    onBulkDownload() {
      // const loadingInstance = this.$loading({
      //   target: 'section',
      //   lock: true,
      //   text: '批量下载中...',
      //   fullscreen: true
      // })
      this.downLoad = true
      const imgAll = this.imgList
      const imgUrlList = []
      const imgListName = []
      imgAll.forEach((res) => {
        imgUrlList.push(res.img)
        imgListName.push(`渠道${res.channelId}`)
      })
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
      console.log('批量下载')
    },
    // 点击推广人统计查看
    onExtension(row) {
      console.log(row, '推广人链接')
      this.$http.Operating.getEncode(24).then((res) => {
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
  height: calc(100vh - 129px);
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
    }
  }
  .channelAdd-table {
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    background: #fff;
    .bulkDownload {
      margin-top: 10px;
      margin-bottom: 20px;
      width: 100px;
    }
  }
  .drawer-detail {
    margin: 50px 10px 10px 10px;
  }
}
</style>
