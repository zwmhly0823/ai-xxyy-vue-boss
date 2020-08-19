<template>
  <el-form :inline="true" size="mini" class="table-searcher-container">
    <el-form-item label="订单搜索:">
      <div class="row_colum">
        <orderSearch
          class="allmini"
          @result="getOrderSearch"
          @clear="clearNum()"
        />
      </div>
    </el-form-item>
    <!-- <el-form-item label="订单搜索:">
      <div class="concat">
      <el-input
          v-model="promotionsName"
          size="mini"
          placeholder="活动名称"
          clearable
          @input="setPromotionsName"
          @change="setPromotionsName"
        ></el-input>
      </div>
    </el-form-item> -->
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
import orderSearch from '@/components/MSearch/searchItems/orderSearch.vue' // add
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
      ]
    }
  },
  components: {
    orderSearch,
    SimpleSelect,
    SelectDate
  },
  created() {},
  methods: {
    // 切换手机/订单清空筛选项
    clearNum() {
      this.getOrderSearch({ uid: '' })
      this.getOrderSearch({ out_trade_no: '' })
      // this.setSeachParmas(val, [key])
    },
    // 订单号、手机号
    getOrderSearch(res) {
      console.log('手机号', res)
      const key = Object.keys(res || {})[0]
      const val = res[key] ? res : ''
      console.log(key, val)
      this.getSearchData([key], val)
    },
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      console.log(key, res, 'resssssss')
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
        this.$delete(this.searchQuery, key)
      }
      // 删除返回值为空数组的情况
      if (search && search[key].length === 0) {
        this.$delete(this.searchQuery, key)
      }
      console.log(search, 'getSearchData')
      console.log(this.searchQuery, 'this.searchQuery')
      this.$emit('search', this.searchQuery)
    },
    // 获取下拉时间选择select
    getTimeCallBack(data) {
      console.log(data, 'data==')
      if (data) {
        this.selectTime = data
      } else {
        this.oldTime = data
      }
    }
  }
}
</script>

<style lang="scss">
.table-searcher-container {
  display: flex;
  align-items: center;
  .comp-cell {
    margin-right: 20px;
  }
}
</style>
