<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-25 14:26:01
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-25 14:26:01
 * @Description: 系统课、体验课排期
 -->
<template>
  <div class="search-item small">
    <el-select
      class="item-style"
      v-model="stage"
      :multiple="isMultiple"
      filterable
      remote
      :reserve-keyword="true"
      size="mini"
      clearable
      :placeholder="placeholderText"
      :remote-method="handleDebounce"
      :loading="loading"
      :style="myStyle"
      :disabled="isDisabled"
      @change="onChange"
    >
      <el-option
        v-for="item in dataList"
        :key="item.id"
        :label="item.period_name"
        :value="item.period"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import axios from '@/api/axiosConfig'
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    category: {
      type: Array,
      default: () => [],
    },
    // 1-系统课，0-体验课
    type: {
      type: String,
      default: '0',
    },
    // 体验课类型 2是双周 1是单周
    exType: {
      type: Number,
      default: 1,
    },
    // 是否多选
    isMultiple: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    myStyle: {
      type: Object,
      default: () => {},
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    recordPeriod: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      stage: this.isMultiple ? this.record : '',
      dataList: [],
      period: [], // 期数
      params: 1, // 排期联动数据
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.getData, 500)
    },
    placeholderText() {
      if (this.placeholder) return this.placeholder
      return this.type === '1' ? '系统课排期' : '体验课排期'
    },
  },
  created() {
    this.getData()
  },
  mounted() {
    if (this.recordPeriod) {
      this.stage = this.recordPeriod.periodName
    }
  },
  watch: {
    category(val, oldValue) {
      if (val) {
        this.getData()
      }
    },
    isDisabled(val) {
      if (val) {
        this.$emit('result', '')
        this.stage = ''
      }
    },
  },
  methods: {
    getData(queryString = '') {
      this.loading = true
      const queryParams = {
        bool: {
          must: [
            { wildcard: { 'period_name.keyword': `*${queryString}*` } },
            { term: { subject: this.$store.getters.subjects.subjectCode } },
          ],
        },
      }
      if (this.type) {
        queryParams.bool.must.push({
          term: {
            type: this.type,
          },
        })
      }
      const q = JSON.stringify(queryParams)
      const sort = `{"id":"desc"}`
      axios
        .post('/graphql/v1/toss', {
          query: `{
                  ManagementListEx(query:${JSON.stringify(
                    q
                  )}, sort: ${JSON.stringify(sort)}){
                    id
                    period
                    period_name
                  }
                }`,
        })
        .then((res) => {
          this.loading = false

          this.dataList = res.data.ManagementListEx
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取选中的
    onChange(data) {
      console.log(data)
      this.$emit('result', data.length > 0 ? { [this.name]: data } : '')
    },
  },
}
</script>
<style lang="scss" scoped>
.search-item {
  .item-style {
    width: 140px;
  }
}
</style>
