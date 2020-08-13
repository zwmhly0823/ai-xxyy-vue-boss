<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-05-16 17:43:36
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-13 19:13:50
-->
<template>
  <div class="container">
    <div class="course-item">
      <el-select
        v-model="value"
        @change="selectTeam"
        @clear="clearNextData"
        placeholder="请选择课程类型"
        clearable
        class="courseTeam"
        size="mini"
      >
        <el-option
          v-for="item of courseOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="!item.show"
        >
        </el-option>
      </el-select>
    </div>
    <div class="course-item">
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
const positionId = Number(JSON.parse(localStorage.getItem('staff')).positionId)
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
          label: '体验课',
          show: positionId === 0 || positionId === 1 || positionId === 2
        },
        {
          value: 'SYSTEMCOURSE',
          label: '系统课',
          show:
            positionId === 0 ||
            positionId === 1 ||
            positionId === 3 ||
            positionId === 4
        }
      ],
      loading: false,
      stage: '',
      dataList: [],
      period: [], // 期数
      value: '',
      chooseTeam: true,
      type: '', // 1-系统课，0-体验课
      addList: {}
    }
  },
  mounted() {
    console.info('子组件mounted:显示赋值')
    // 初始显示_赋值
    if (positionId === 2) {
      // 纯体验课
      this.value = 'TESTCOURSE'
      this.chooseTeam = false
    } else if (positionId === 3 || positionId === 4) {
      // 纯系统课
      this.chooseTeam = false
      this.value = 'SYSTEMCOURSE'
    } else {
      // 全类 0,1
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.getData, 500)
    }
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
      this.$emit('result', '')
    },
    selectTeam(val) {
      console.info('子组件课程类型手动变化后,告知父组件-mounted赋值触发么??')
      if (val) {
        switch (val) {
          case 'TESTCOURSE':
            this.type = '0'
            this.addList.period = ''
            this.stage = ''
            this.getData()
            this.addList.managementType = 'TESTCOURSE'
            this.$emit('result', this.addList)
            break
          case 'SYSTEMCOURSE':
            this.type = '1'
            this.addList.period = ''
            this.stage = ''
            this.getData()
            this.addList.managementType = 'SYSTEMCOURSE'
            this.$emit('result', this.addList)
            break
          default:
            break
        }
        this.chooseTeam = false
      } else {
        this.type = ''
        this.$emit('result', '')
      }
    },
    clearSelect() {
      this.value = ''
      this.chooseTeam = true
      this.$emit('result', '')
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
      this.addList.period = data.join()
      this.$emit('result', this.addList)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin-left: 20px;
  height: 30px !important;
  .course-item {
    display: inline-block;
    margin-right: 10px;
    .courseTeam {
      width: 135px !important;
    }
  }
}
</style>
