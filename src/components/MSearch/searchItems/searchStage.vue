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
      default: '1',
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
    // 老师ID,通过老师获取对应的排期
    teacherId: {
      type: Array,
      default: () => [],
    },
    myStyle: {
      type: Object,
      default: () => {},
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    record: {
      type: Array,
      default: () => [],
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
    if (!this.isDisabled) {
      this.getData()
    }
  },
  mounted() {
    console.log(this.type, 'this.type')
  },
  watch: {
    category(val, oldValue) {
      if (val) {
        this.getData()
      }
    },
    exType(val) {
      if (this.category.length > 0) {
        this.params = this.type
      } else {
        this.params = this.type
      }
      console.log(this.params, 'this.params')
      this.params = this.exType == 2 ? 0 : 2
      this.getData()
    },
    record(val) {
      this.stage = val
    },
    isDisabled(val) {
      if (val) {
        this.$emit('result', '')
        this.stage = ''
      }
      console.log(val, '123123')
    },
    teacherId(val) {
      this.stage = ''
      this.$emit('result', '')
      if (!this.teacherId || this.teacherId.length === 0) {
        this.period = []
        this.getData()
        return
      }
      // 体验课
      const query = { teacher_id: this.teacherId }
      const teamType =
        this.type === '0' ? { team_type: 0 } : { team_type: { gt: 0 } }
      Object.assign(
        query,
        teamType,
        {
          subject: this.$store.getters.subjects.subjectCode,
        },
        { type: `${this.category.length == 0 ? this.params : this.category}` }
      )

      const q = JSON.stringify(query)
      axios
        .post('/graphql/v1/toss', {
          query: `{
            StudentTeamList(query: ${JSON.stringify(q)}, size: 500){
              term
            }
          }`,
        })
        .then((res) => {
          const period = (res.data && res.data.StudentTeamList) || []
          this.period = period.map((item) => item.term)
          this.getData()
        })
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
            type: `${this.category.length == 0 ? this.params : this.category}`,
          },
        })
      }
      if (this.record.length > 0) {
        console.log(this.period)
        this.period.push(...this.record)
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
