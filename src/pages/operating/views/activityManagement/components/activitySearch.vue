<template>
  <div class="table-searcher-container">
    <div class="comp-cell">
      <el-select
        v-model="templateId"
        class="item-style margin_l10"
        filterable
        remote
        :reserve-keyword="true"
        size="mini"
        clearable
        @change="getTemplateId"
        placeholder="模板名称"
      >
        <el-option
          v-for="item in templateList"
          :key="item.id"
          :label="item.templateName"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
    <div class="comp-cell">
      <search-stage
        class="search-group-item"
        name="term0"
        placeholder="体验课排期"
        type="0"
        :myStyle="{ width: '100px' }"
        @result="getSearchData('term0', arguments)"
      />
    </div>
    <div class="comp-cell">
      <search-stage
        class="search-group-item"
        name="term1"
        placeholder="系统课排期"
        type="1"
        :myStyle="{ width: '100px' }"
        @result="getSearchData('term1', arguments)"
      />
    </div>
  </div>
</template>
<script>
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
      templateId: '',
      templateList: [],
      searchQuery: {}
    }
  },
  components: {
    SearchStage
  },
  created() {
    this.getTempList(this.teacherId, this.type).then((res) => {
      if (res.code === 0) {
        this.templateList = res.payload
        console.log('getTempList')
        console.log(res)
      }
    })
  },
  methods: {
    /**
     * search item 回调。 key,自定义参数，res，组件返回的值 res[0]
     */
    getSearchData(key, res) {
      const search = res && res[0]
      console.log(search, '=========================', key)
      if (search) {
        this.searchQuery = {
          ...this.searchQuery,
          ...search
        }
      } else {
        // delete this.searchQuery[key]
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
    // 获取模版列表
    async getTempList(uid, type) {
      try {
        const Info = await this.$http.Community.getTempList({
          uid: 11,
          type: 1
        })
        return Info
      } catch (err) {
        console.log(err)
      }
    },
    // 模板名称
    getTemplateId(res) {
      this.searchQuery = {
        ...this.searchQuery,
        aaaa: res
      }
      console.log(this.searchQuery, 'this.searchQuery-----')
    }
    // getTemplateId: debounce(function(event) {
    //   this.sourchParams.templateId = event
    //   this.sourchParams.pageNo = 1
    //   this.$emit('getlistJobTaskPage', this.sourchParams)
    // }, 500)
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
