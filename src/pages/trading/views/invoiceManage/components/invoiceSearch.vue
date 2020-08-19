<template>
  <el-form :inline="true" size="mini" class="table-searcher-container">
    <el-form-item label="订单搜索:">
      <orderSearch
        class="allmini"
        @result="getOrderSearch"
        @clear="clearNum()"
      />
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
          name="fplx"
          :data-list="fplxList"
          :multiple="false"
          placeholder="全部"
          @result="getSearchData('fplx', arguments)"
        ></simple-select>
      </div>
    </el-form-item>
    <el-form-item label="开票状态:">
      <div class="row_colum">
        <simple-select
          name="kpzt"
          :data-list="fplxList"
          :multiple="false"
          placeholder="全部"
          @result="getSearchData('kpzt', arguments)"
        ></simple-select>
      </div>
    </el-form-item>
    <el-form-item label="时间:">
      <div class="row_colum">
        <select-date
          :name="timeData"
          @result="getTimeData"
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
  props: {
    sourchParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      promotionsName: '',
      searchQuery: {},
      timeData: [
        { text: '购买时间', value: 'ctime' },
        { text: '揽收时间', value: 'delivery_collect_time' },
        { text: '签收时间', value: 'signing_time' }
      ],
      fplxList: [
        {
          id: '1',
          text: '类型1'
        },
        {
          id: '2',
          text: '类型2'
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
    // getSearchdata(data) {
    //   console.log(data.fplx, 'datadddd')
    // },
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      console.log(key, res, 'resssssss')
      const search = res && res[0]
      if (search) {
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
