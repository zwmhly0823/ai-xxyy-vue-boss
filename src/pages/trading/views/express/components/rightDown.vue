<template>
  <div class="container">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="用户及日期" width="120">
        <template slot-scope="scope">
          <div class="user">
            <span>{{ scope.row.phone }}</span>
            <span>{{ scope.row.date }}</span>
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
      <el-table-column label="收货信息" show-overflow-tooltip>
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
            <span>{{ scope.row.wait }}</span>
            <span>{{ scope.row.trail }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流创建·揽收·签收" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="sign">
            <span>{{ scope.row.date }}</span>
            <span>{{ scope.row.date }}</span>
            <span>{{ scope.row.date }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
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
      multipleSelection: []
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 10px;
  background-color: #fff;
  .wait {
    color: rgb(50, 241, 98);
  }
  .trail {
    color: aqua;
  }
}
</style>
