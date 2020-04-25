<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-25 19:14:17
 -->
<template>
  <div class="channel-box">
    <div class="channel-box-top">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="渠道查询" name="channelQuery">
          <!-- <channel-search /> -->
          <m-search @search="handleSearch" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="channel-box-medium">
      <div>
        数据汇总
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>累计成单金额</p>
            <span>989897</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <p>累计转化率</p>
            <span>9%</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content1 bg-purple1">
            <div class="grid-content1-box1">
              <div>
                <p class="grid-content1-text1">192</p>
                <span>添加微信</span>
              </div>
              <div>
                <p class="grid-content1-text1">192</p>
                <span>未支付</span>
              </div>
              <div>
                <p class="grid-content1-text1">192</p>
                <span>参课数</span>
              </div>
              <div>
                <p class="grid-content1-text1">192</p>
                <span>完课数</span>
              </div>
            </div>
            <div class="grid-content1-box2">
              <div style="margin-left:5px;">
                <p class="grid-content1-text2">192</p>
                <span>成单数</span>
              </div>
              <div style="margin-left:10px;">
                <p class="grid-content1-text2">192</p>
                <span>线索数</span>
              </div>
              <div>
                <p class="grid-content1-text2">192</p>
                <span>参课率</span>
              </div>
              <div>
                <p class="grid-content1-text2">192</p>
                <span>完课率</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="channel-box-bottom">
      <template>
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="date" label="日期" width="180">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
        <m-pagination
          @current-change="handleCurrentChange"
          :current-page="1"
          :total="50"
          open="calc(100vw - 95px - 100px)"
          close="calc(100vw - 23px - 50px)"
        />
      </template>
    </div>
  </div>
</template>

<script>
// import channelSearch from './components/channelSearch'
import MPagination from '@/components/MPagination/index.vue'
import MSearch from '@/components/MSearch/index.vue'
export default {
  components: {
    // channelSearch,
    MPagination,
    MSearch
  },
  data() {
    return {
      activeName: 'channelQuery',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  methods: {
    // 搜索传的值
    handleSearch(res) {
      console.log(res)
    },
    // tabs 事件
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('onCurrentPage', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.channel-box {
  display: flex;
  flex-direction: column;
  // background: rgb(240, 241, 242);
  height: calc(100vh - 50px);
  overflow: scroll;
  .channel-box-top {
    margin: 10px;
  }
  .channel-box-medium {
    background: #fff;
    margin: 10px;
    padding: 20px 20px;
    .bg-purple {
      margin-top: 10px;
      background: rgb(240, 241, 242);
    }
    .grid-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 150px;
      border-radius: 4px;
    }
    .bg-purple1 {
      margin-top: 10px;
      background: rgb(240, 241, 242);
    }
    .grid-content1 {
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 150px;
      border-radius: 4px;
      .grid-content1-box1 {
        display: flex;
        justify-content: space-around;
        .grid-content1-text1 {
          display: flex;
          justify-content: center;
        }
      }
      .grid-content1-box2 {
        display: flex;
        justify-content: space-around;
        .grid-content1-text2 {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  .channel-box-bottom {
    display: flex;
    flex: 1;
    background: #fff;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 45px;
  }
}
</style>
