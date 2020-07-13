<template>
  <div class="table-searcher-container">
    <div class="comp-cell">
      <el-input
        class="item-style"
        placeholder="任务名称"
        clearable
        size="mini"
        :width="150"
        v-model="jobTaskName"
        @input="getJobTaskName"
      >
      </el-input>
    </div>
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
      <el-input
        class="item-style"
        placeholder="创建人"
        clearable
        v-model="username"
        size="mini"
        @input="getCname"
      >
      </el-input>
    </div>
    <div class="comp-cell">
      <el-date-picker
        size="mini"
        v-model="selectTime"
        @change="getSelectTime"
        type="daterange"
        range-separator="至"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
    </div>
  </div>
</template>
<script>
import { isToss } from '@/utils/index'
import { debounce } from 'lodash'
export default {
  props: {
    sourchParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      jobTaskName: '',
      username: '',
      selectTime: [],
      templateId: '',
      templateList: [],
      teacherId: '',
      type: ''
    }
  },
  components: {},
  created() {
    const teacher = isToss()
    if (teacher) {
      const tossteacher = JSON.parse(localStorage.getItem('teacher'))
      this.teacherId = tossteacher.id || ''
      this.type = 1
    } else {
      const staff = JSON.parse(localStorage.getItem('staff'))
      this.teacherId = staff.id || ''
      this.type = 2
    }
    this.getTempList(this.teacherId, this.type).then((res) => {
      if (res.code === 0) {
        this.templateList = res.payload
        console.log('getTempList')
        console.log(res)
      }
    })
  },
  methods: {
    // 获取模版列表
    async getTempList(uid, type) {
      try {
        const Info = await this.$http.Community.getTempList({
          uid,
          type
        })
        return Info
      } catch (err) {
        console.log(err)
      }
    },
    // 任务名称
    getJobTaskName: debounce(function(event) {
      this.sourchParams.jobTaskName = event
      this.sourchParams.pageNo = 1
      this.$emit('getlistJobTaskPage', this.sourchParams)
    }, 500),
    // 模板名称
    getTemplateId: debounce(function(event) {
      this.sourchParams.templateId = event
      this.sourchParams.pageNo = 1
      this.$emit('getlistJobTaskPage', this.sourchParams)
    }, 500),
    // 创建人
    getCname: debounce(function(event) {
      this.sourchParams.username = event
      this.sourchParams.pageNo = 1
      this.$emit('getlistJobTaskPage', this.sourchParams)
    }, 500),
    // 时间
    getSelectTime: debounce(function(event) {
      if (event) {
        this.sourchParams.startTime = event[0]
        this.sourchParams.endTime = event[1]
      } else {
        this.sourchParams.startTime = ''
        this.sourchParams.endTime = ''
      }
      this.sourchParams.pageNo = 1
      this.$emit('getlistJobTaskPage', this.sourchParams)
    }, 500)
    // manageChange(res, key) {
    //   this.emitInfo[key] = res
    //   console.log(this.emitInfo)
    //   this.$emit('searchChange', this.emitInfo)
    // }
  }
}
</script>

<style lang="scss">
.table-searcher-container {
  // height: 50px;
  // margin-bottom: 10px;
  display: flex;
  align-items: center;
  .comp-cell {
    margin-right: 20px;
  }
}
</style>
