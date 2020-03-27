<template>
  <div class="container">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      :height="680"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleSelectionChangeEnter"
      @cell-mouse-leave="handleSelectionChangeLeave"
    >
      <el-table-column type="selection" width="35"> </el-table-column>
      <el-table-column width="25">
        <div :class="[false, 'trans']">
          <i class="el-icon-more-outline"></i>
        </div>
      </el-table-column>
      <el-table-column label="用户及日期">
        <template slot-scope="scope">
          <!-- <i class="el-icon-more-outline"></i> -->
          <div class="user">
            <div>{{ scope.row.phone }}</div>
            <div>{{ scope.row.date }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="商品信息">
        <template slot-scope="scope">
          <div class="product">
            <span>{{ scope.row.gift }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收货信息" width="240">
        <template slot-scope="scope">
          <div class="take">
            <div>
              <span>{{ scope.row.name }}</span>
              <span>{{ scope.row.phone }}</span>
            </div>
            <div>
              <span>{{ scope.row.province }}</span>
              <span>{{ scope.row.city }}</span>
              <span>{{ scope.row.area }}</span>
            </div>
            <div>
              <span>{{ scope.row.address }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="express">
            <div class="wait">{{ scope.row.wait }}</div>
            <el-button class="trail" type="text" @click="Express">{{
              scope.row.trail
            }}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流创建·揽收·签收" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="sign">
            <div>{{ scope.row.date }}</div>
            <div>{{ scope.row.date }}</div>
            <div>{{ scope.row.date }}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出层 -->
    <el-dialog :visible.sync="timeline" width="30%" v-model="expressDetail">
      <div class="line">
        <div class="logistics">
          <span>物流公司：</span><span>中通物流</span>
        </div>
        <span>快递单号：</span>
        <span>2435345465756768788798</span>
      </div>
      <div class="waitFor" v-show="waitFor">快递待揽收</div>
      <!-- 时间线 -->
      <el-timeline v-show="timeLine">
        <!-- <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
        > -->
        <el-timeline-item
          v-for="(item, index) in expressDetail.data"
          :key="index"
        >
          <div class="statebox">
            <div class="state">{{ item.status }}</div>
            <div class="time">{{ item.time }}</div>
          </div>
        </el-timeline-item>
        <!-- </el-timeline-item> -->
      </el-timeline>
      <!-- 步骤条 -->
      <!-- <div style="height: 300px;" v-show="step">
        <el-steps direction="vertical" :active="1">
          <el-step title="已签收"></el-step>
          <el-step title="运输中"></el-step>
          <el-step
            title="等待揽收"
            description="这是一段很长很长很长的描述性文字"
          >
          </el-step>
        </el-steps>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 时间线
      timeLine: true,
      // 等待揽收
      waitFor: false,
      // 物流详情
      expressDetail: {
        ctime: '',
        utime: '',
        expressNo: '',
        data: []
      },
      tableData: [
        {
          phone: '15656565656',
          date: '2016-05-03 11:28:58',
          name: '王小虎',
          province: '北京市',
          city: '北京市',
          address: '上海市普陀区金沙江路 1518 弄',
          gift: '小熊美术素材包',
          wait: '待发货',
          trail: '追踪',
          area: '朝阳区'
        },
        {
          phone: '15656565656',
          date: '2016-05-03 11:28:58',
          name: '王小虎',
          province: '北京市',
          city: '北京市',
          address: '上海市普陀区金沙江路 1518 弄',
          gift: '小熊美术素材包',
          wait: '待发货',
          trail: '追踪',
          area: '朝阳区'
        },
        {
          phone: '15656565656',
          date: '2016-05-03 11:28:58',
          name: '王小虎',
          province: '北京市',
          city: '北京市',
          address: '上海市普陀区金沙江路 1518 弄',
          gift: '小熊美术素材包',
          wait: '待发货',
          trail: '追踪',
          area: '朝阳区'
        },
        {
          phone: '15656565656',
          date: '2016-05-03 11:28:58',
          name: '王小虎',
          province: '北京市',
          city: '北京市',
          address: '上海市普陀区金沙江路 1518 弄',
          gift: '小熊美术素材包',
          wait: '待发货',
          trail: '追踪',
          area: '朝阳区'
        },
        {
          phone: '15656565656',
          date: '2016-05-03 11:28:58',
          name: '王小虎',
          province: '北京市',
          city: '北京市',
          address: '上海市普陀区金沙江路 1518 弄',
          gift: '小熊美术素材包',
          wait: '待发货',
          trail: '追踪',
          area: '朝阳区'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      multipleSelection: [],
      enter: false,
      cout: 0,
      // 弹出层
      timeline: false,
      // 时间线样式
      activities: [
        {
          size: 'large',
          type: 'primary',
          color: '#0bbd87'
        },
        {
          size: 'large',
          type: 'primary',
          color: '#0bbd87'
        },
        {
          size: 'large',
          type: 'primary',
          color: '#0bbd87'
        }
      ]
    }
  },
  watch: {},
  methods: {
    // 弹出框
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChangeEnter() {
      this.cout++
      console.log('鼠标进入', this.cout)
      this.enter = true
    },
    handleSelectionChangeLeave() {
      console.log('鼠标离开', this.cout)
      this.cout++

      this.enter = false
    },
    // 物流列表信息
    Express() {
      this.timeline = true
      this.$http.Express.ExpressList({ expressNo: 293103003754 })
        .catch((err) => console.log(err))
        .then((res) => {
          if (res && res.payload) {
            this.timeLine = true
            res.payload.forEach((item) => {
              this.expressDetail.expressNo = item.expressNo
              this.expressDetail.ctime = item.ctime
              this.expressDetail.utime = item.utime
              this.expressDetail.data = item.data
            })
            console.log('expressDatail >>>>>>>>>>>', this.expressDetail)
          } else {
            this.waitFor = true
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 10px;
  background-color: #fff;
  font-size: 12px;

  .trans {
    transform: rotate(-90deg);
    margin-bottom: -8px;
  }
  .express {
    .wait {
      color: rgb(127, 255, 136);
    }
    .trail {
      color: rgb(0, 51, 255);
      cursor: pointer;
    }
  }
  .line {
    width: 100%;
    height: 48px;
    border-bottom: 1px solid gainsboro;
    margin-top: -40px;
    margin-bottom: 22px;
    .logistics {
      margin-bottom: 6px;
    }
  }
  .waitFor {
    font-size: 16px;
    color: rgb(190, 190, 190);
    text-align: center;
  }
  .statebox {
    margin-bottom: 20px;
  }
}
</style>
