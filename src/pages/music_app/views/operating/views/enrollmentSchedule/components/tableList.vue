<template>
  <div class="table-list">
    <ele-table
      :tableHeight="autoHeight"
      :dataList="tableData"
      :loading="loading"
      :size="size"
      :page="page"
      :total="total"
      @pageChange="pageChange"
      class="mytable"
    >
      <el-table-column prop="id" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column
        prop="channelName"
        label="渠道名称"
        align="center"
      ></el-table-column>
      <el-table-column prop="channelId" label="渠道ID" align="center">
      </el-table-column>
      <el-table-column label="定向体验课期" align="center" prop="periodName">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="options-sty">
            <span style="margin-right:15px" @click="handleSubmit(scope.row)"
              >编辑</span
            >
            <span @click="switchStatus(scope.row)">{{
              scope.row.status == 0 ? '停用' : '开启'
            }}</span>
          </div>
        </template>
      </el-table-column>
    </ele-table>
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
export default {
  name: 'tableList',

  components: { EleTable },

  props: {
    autoHeight: {
      type: [String, Number],
      default: 'auto'
    },
    tableData: {
      type: Array,
      value: []
    },
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 20
    },
    page: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {}
  },

  methods: {
    // 状态切换
    switchStatus(data) {
      this.$emit('changeSwitch', data)
    },

    // 分页切换
    pageChange(val) {
      this.$emit('pageChange', val)
    },

    // 编辑
    handleSubmit(data) {
      this.$emit('handleSubmit', data)
    }
  }
}
</script>

<style scoped lang="scss">
.table-list {
  /deep/ table {
    width: 100% !important;
    .options-sty {
      color: #2b75ed;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
