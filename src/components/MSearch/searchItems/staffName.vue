<!--
 * @Author: songyanan
 * @Date: 2020-06-17 15:23:05
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-17 16:03:00
 -->
<template>
  <div class="search-item small">
    <el-form @submit.native.prevent>
      <el-autocomplete
        size="mini"
        name="vals"
        clearable
        class="inline-input"
        v-model="input"
        :fetch-suggestions="querySearch"
        :placeholder="tip"
        :trigger-on-focus="false"
        @select="inputHandler"
        ref="elautocomplete"
      >
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
        <template slot-scope="{ item }">
          <div style="display:flex">
            <div class="name">{{ item.real_name || '-' }}</div>
          </div>
        </template>
      </el-autocomplete>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'real_name'
    },
    tip: {
      type: String,
      default: '姓名查询'
    }
  },
  data() {
    return {
      input: '',
      selectData: [],
      select: '1'
    }
  },
  computed: {},
  watch: {
    input(val, old) {
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    }
  },
  methods: {
    async querySearch(queryString, cb) {
      console.log('queryString', queryString)
      const list = await this.createFilter(queryString)
      cb(list)
      this.$refs.elautocomplete.handleFocus()
    },
    async createFilter(queryString) {
      const selectData = await this.$http.Staff.StaffListEx(
        'real_name.keyword',
        queryString
      )
      this.selectData = selectData.data.StaffListEx || []
      return this.selectData
    },
    inputHandler(data) {
      this.input = data.real_name
      this.$emit(
        'result',
        data.real_name ? { [this.name]: data.real_name } : ''
      )
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss">
.ppName {
  width: 220px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .el-scrollbar {
    width: 100%;
  }
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-form-item__content .el-input-group {
  vertical-align: middle !important;
}
</style>
