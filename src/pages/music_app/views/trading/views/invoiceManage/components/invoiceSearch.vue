<template>
  <el-form :inline="true" size="mini" class="table-searcher-container">
    <el-form-item label="订单搜索:">
      <div class="row_colum">
        <invoiceSearch
          class="allmini"
          @result="getOrderSearch"
          @clear="clearNum()"
        />
      </div>
    </el-form-item>
    <el-form-item label="发票类型:">
      <div class="row_colum">
        <simple-select
          name="invoice_type"
          :data-list="invoiceTypeList"
          :multiple="false"
          placeholder="全部"
          @result="getSearchData('invoice_type', arguments)"
        ></simple-select>
      </div>
    </el-form-item>
    <el-form-item label="订单类型:">
      <div class="row_colum">
        <simple-select
          name="content_type"
          :data-list="orderTypeList"
          :multiple="false"
          placeholder="全部"
          @result="getSearchData('content_type', arguments)"
        ></simple-select>
      </div>
    </el-form-item>
    <el-form-item label="开票状态:">
      <div class="row_colum">
        <simple-select
          name="invoice_status"
          :data-list="invoiceStatusList"
          :multiple="false"
          placeholder="全部"
          @result="getSearchData('invoice_status', arguments)"
        ></simple-select>
      </div>
    </el-form-item>
    <el-form-item label="时间:">
      <div class="row_colum">
        <select-date
          :name="timeData"
          @result="getSearchData(selectTime || oldTime, arguments)"
          @timeCallBack="getTimeCallBack"
        />
      </div>
    </el-form-item>
  </el-form>
</template>
<script>
import invoiceSearch from '@/components/MSearch/searchItems/invoiceSearch.vue' // add

import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect'
import SelectDate from '@/components/MSearch/searchItems/selectDate.vue'
export default {
  props: {},
  data() {
    return {
      promotionsName: '',
      searchQuery: {},
      selectTime: null,
      oldTime: '',
      timeData: [
        { text: '开票申请时间', value: 'ctime' },
        { text: '开票完成时间', value: 'complete_time' }
      ],
      invoiceStatusList: [
        {
          id: 0,
          text: '待开票'
        },
        {
          id: 1,
          text: '开票中'
        },
        {
          id: 2,
          text: '已开票'
        },
        {
          id: 3,
          text: '开票失败'
        },
        {
          id: 4,
          text: '作废'
        }
      ],
      invoiceTypeList: [
        {
          id: 0,
          text: '无'
        },
        {
          id: 1,
          text: '普通发票'
        },
        {
          id: 2,
          text: '专票'
        }
      ],
      orderTypeList: [
        {
          id: [0, 1],
          text: '课程订单'
        },
        {
          id: [2],
          text: '器材订单'
        },
        {
          id: [0, 1, 2],
          text: '全部'
        }
      ]
    }
  },
  components: {
    invoiceSearch,
    SimpleSelect,
    SelectDate
  },
  created() {},
  methods: {
    // 切换手机/订单清空筛选项
    clearNum() {
      this.getOrderSearch({ uid: '' })
      this.getOrderSearch({ oid: '' })
    },
    // 订单号、手机号、交易流水号
    getOrderSearch(res) {
      const key = Object.keys(res || {})[0]
      const val = res[key] ? [res] : []
      this.getSearchData(key, val)
      // this.getSearchData([key], val)
    },
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      const search = res && res[0]
      if (search) {
        if (key === 'ctime') {
          this.$delete(this.searchQuery, 'complete_time')
        } else if (key === 'complete_time') {
          this.$delete(this.searchQuery, 'ctime')
        }
        this.searchQuery = {
          ...this.searchQuery,
          ...search
        }
      } else {
        delete this.searchQuery.id
        this.$delete(this.searchQuery, key)
      }
      // 删除返回值为空数组的情况
      if (search && search[key].length === 0) {
        this.$delete(this.searchQuery, key)
      }
      this.$emit('search', this.searchQuery)
    },
    // 获取下拉时间选择select
    getTimeCallBack(data) {
      if (data) {
        this.selectTime = data
      } else {
        this.oldTime = data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-searcher-container {
  // display: flex;
  // align-items: center;
  .comp-cell {
    margin-right: 20px;
  }
}
</style>
