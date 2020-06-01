<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-05-16 17:43:36
 * @LastEditors: Lukun
 * @LastEditTime: 2020-06-01 17:01:18
-->
<template>
  <div class="container">
    <div>
      <el-select
        v-model="value"
        @change="selectTeam"
        @clear="clearNextData"
        placeholder="请选择课程系统"
        clearable
        class="courseTeam"
        size="mini"
      >
        <el-option
          v-for="item in courseOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div>
      <el-select
        class="item-style"
        v-model="stage"
        multiple
        filterable
        remote
        :reserve-keyword="true"
        size="mini"
        clearable
        @clear="clearSelect"
        :disabled="chooseTeam"
        placeholder="请选择期数"
        :remote-method="handleDebounce"
        :loading="loading"
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
  </div>
</template>

<script>
import { debounce } from 'lodash'
import axios from '@/api/axiosConfig'

export default {
  props: {
    // 老师ID,通过老师获取对应的排期
    teacherId: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      courseOptions: [
        {
          value: 'TESTCOURSE',
          label: '体验课'
        },
        {
          value: 'SYSTEMCOURSE',
          label: '系统课'
        }
      ],
      course: {
        '0': 'TESTCOURSE',
        '1': 'SYSTEMCOURSE'
      },
      loading: false,
      stage: '',
      dataList: [],
      period: [], // 期数
      value: '',
      chooseTeam: true,
      type: '', // 1-系统课，0-体验课
      addList: []
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.getData, 500)
    }
  },
  created() {
    this.getData()
  },
  watch: {
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
      Object.assign(query, teamType)
      const q = JSON.stringify(query)
      axios
        .post('/graphql/v1/toss', {
          query: `{
            StudentTeamList(query: ${JSON.stringify(q)}, size: 500){
              term
            }
          }`
        })
        .then((res) => {
          const period = (res.data && res.data.StudentTeamList) || []
          this.period = period.map((item) => item.term)
          this.getData()
        })
    }
  },
  methods: {
    clearNextData() {
      this.type = ''
      this.value = ''
      this.stage = ''
      this.chooseTeam = true
      this.onChange('')
    },
    selectTeam(val) {
      if (val) {
        switch (val) {
          case 'TESTCOURSE':
            this.type = '0'
            this.getData()

            break
          case 'SYSTEMCOURSE':
            this.type = '1'
            this.getData()

            break
          default:
            break
        }
        this.chooseTeam = false
      } else {
        this.type = ''
      }
    },
    clearSelect() {
      this.value = ''
      this.chooseTeam = true
    },
    getData(queryString = '') {
      this.loading = true
      const queryParams = {
        bool: {
          must: [{ wildcard: { 'period_name.keyword': `*${queryString}*` } }]
        }
      }
      if (this.type) {
        queryParams.bool.must.push({ term: { type: `${this.type}` } })
      }
      if (this.period.length > 0) {
        queryParams.bool.must.push({ terms: { period: this.period } })
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
                }`
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
      this.$emit(
        'result',
        data.length > 0
          ? {
              teamSchedule: {
                managementType: this.course[this.type],
                period: data.join()
              }
            }
          : ''
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin-left: 20px;
  height: 30px !important;

  .courseTeam {
    width: 135px !important;
  }
}
</style>
