<template>
  <div class="table-searcher-container">
    <div class="comp-cell">
      <el-input
        v-model="promotionsName"
        size="mini"
        placeholder="活动名称"
        clearable
        @input="setPromotionsName"
        @change="setPromotionsName"
      ></el-input>
    </div>
    <div class="comp-cell">
      <search-stage
        class="search-group-item"
        name="trialTerms"
        placeholder="体验课排期"
        type="0"
        :myStyle="{ width: '140px' }"
        @result="getSearchData('trialTerms', arguments)"
      />
    </div>
    <div class="comp-cell">
      <search-stage
        class="search-group-item"
        name="systemTerms"
        placeholder="系统课排期"
        type="1"
        :myStyle="{ width: '140px' }"
        @result="getSearchData('systemTerms', arguments)"
      />
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
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
      searchQuery: {}
    }
  },
  components: {
    SearchStage
  },
  created() {},
  methods: {
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      const search = res && res[0]

      if (search) {
        if (key === 'trialTerms' || key === 'systemTerms') {
          search[key] = search[key] && search[key].join(',')
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
    // 活动名称
    setPromotionsName: debounce(function(event) {
      console.log(event)
      this.searchQuery = {
        ...this.searchQuery,
        promotionsName: event
      }
      console.log(this.searchQuery)
      this.$emit('search', this.searchQuery)
    }, 500)
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
