<template>
  <div class="container">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      height="680"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleSelectionChangeEnter"
      @cell-mouse-leave="handleSelectionChangeLeave"
    >
      <!-- <el-table-column type="selection" width="35"> </el-table-column>
      <el-table-column width="25">
        <div :class="[false, 'trans']">
          <i class="el-icon-more-outline"></i>
        </div>
      </el-table-column> -->
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
            <div class="trail">{{ scope.row.trail }}</div>
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
    <m-pagination
      show-pager
      open="calc(100vw - 170px - 30px)"
      close="calc(100vw - 50px - 30px)"
    ></m-pagination>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'

export default {
  components: {
    MPagination
  },
  data() {
    return {
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
      cout: 0
    }
  },

  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 10px;
  background-color: #fff;
  font-size: 12px;
  color: #666666;
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
    }
  }
}
</style>
