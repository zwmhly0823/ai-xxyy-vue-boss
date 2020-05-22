<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-07 19:09:58
 -->
<template>
  <div class="search-item small threeSelect">
    <el-cascader
      placeholder="请选择渠道"
      size="mini"
      v-model="channelName"
      @change="onSelect"
      :options="showDatas"
      :props="{
        multiple: true,
        value: 'id',
        label: 'channel_outer_name',
        emitPath: false,
        checkStrictly: false
      }"
      :show-all-levels="true"
      clearable
      filterable
    ></el-cascader>
    <el-select
      v-show="scheduling"
      style="margin-left:20px;"
      v-model="stage"
      :multiple="isMultiple"
      filterable
      remote
      :reserve-keyword="true"
      size="mini"
      clearable
      :placeholder="type === '1' ? '系统课排期' : '体验课排期'"
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
    <el-date-picker
      v-show="channelDate"
      class="small"
      style="margin-left:20px;"
      size="mini"
      v-model="timeData"
      :default-time="['00:00:00', '23:59:59']"
      value-format="timestamp"
      type="datetimerange"
      prefix-icon="none"
      :picker-options="pickerOptions"
      range-separator="至"
      :start-placeholder="`${datePlaceholder}start`"
      :end-placeholder="`${datePlaceholder}end`"
      align="right"
      @change="changeHandler"
    >
    </el-date-picker>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import axios from '@/api/axiosConfig'
export default {
  props: {
    tabIndex: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'channelid'
    },
    // 1-系统课，0-体验课
    type: {
      type: String,
      default: '0'
    },
    datePlaceholder: {
      type: String,
      default: '下单时间'
    },
    scheduling: {
      type: Boolean,
      default: true
    },
    channelDate: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date().getTime()
              const start = new Date(new Date().toLocaleDateString()).getTime()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end =
                new Date(new Date().toLocaleDateString()).getTime() - 1
              const start =
                new Date(new Date().toLocaleDateString()).getTime() -
                24 * 60 * 60 * 1000
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick(picker) {
              var date = new Date()
              const end = new Date().getTime()
              const start =
                new Date(new Date().toLocaleDateString()).getTime() -
                (date.getDay() - 1) * 86400000
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const date = new Date()
              date.setDate(1)
              const end = new Date().getTime()
              const start = new Date(
                new Date(date).toLocaleDateString()
              ).getTime()
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate: (res) => {
          return false
        }
      },
      timeData: [],
      isMultiple: false,
      loading: false,
      stage: '',
      channelName: [],
      dataList: [],
      channelList: [],
      channelData: null,
      channelClassData: [],
      channelClassList: null, // 分类条件
      showDatas: null // 三级列表展示数据
    }
  },
  watch: {
    tabIndex(value) {
      console.log(value, 'watch')
      this.timeData = ''
      this.stage = ''
      this.channelName = []
    }
  },
  async created() {
    await this.getChannel()
    await this.getChannelClassList()
    this.formatData(this.channelList, this.channelClassList)
  },
  computed: {
    handleDebounce() {
      return debounce(this.getData, 500)
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取渠道来源 filter: 过滤关键词  eg：filter:"抖音"
    async getChannel() {
      await axios
        .post('/graphql/channel', {
          query: `{
            channelAllList(size: 500) {
                id
                channel_class_id
                channel_outer_name
              }
            }
          `
        })
        .then((res) => {
          this.channelList = res.data.channelAllList
        })
    },
    // 获取渠道来源分类 filter: 过滤关键词  eg：filter:"抖音"
    async getChannelClassList() {
      await axios
        .post('/graphql/v1/toss', {
          query: `{
              ChannelClassList(size: 500){
                id
                channel_class_parent_id
                channel_class_name
              }
            }
          `
        })
        .then((res) => {
          this.channelClassList = res.data.ChannelClassList
        })
    },
    formatData(classdata, classifiData) {
      // 第一级目录
      const arrList = []
      classifiData.forEach((item) => {
        item.channel_outer_name = item.channel_class_name
      })
      const firstNode =
        classifiData &&
        classifiData.filter((item) => {
          if (+item.channel_class_parent_id !== 0) {
            arrList.push(item)
          }
          return +item.channel_class_parent_id === 0
        })

      firstNode.forEach((item) => (item.children = []))
      arrList.forEach((item, index) => {
        firstNode.forEach((val, idx) => {
          if (+item.channel_class_parent_id === +val.id) {
            val.children.push(item)
          }
        })
      })
      firstNode.forEach(
        (item) =>
          item.children && item.children.forEach((vals) => (vals.children = []))
      )

      classdata.forEach((content, num) => {
        arrList.forEach((datas, nums) => {
          if (+content.channel_class_id === +datas.id) {
            datas.children.push(content)
          }
        })
      })

      const result = firstNode.map((item) => {
        if (item.children && item.children.length === 0) {
          item.children = null
        }
        if (item.children) {
          item.children.forEach((sub) => {
            if (sub.children && sub.children.length === 0) sub.children = null
          })
        }
        return item
      })

      this.showDatas = result
    },
    onSelect(data) {
      console.log(data)
      this.$emit('channelSearchValue', data.length > 0 ? data : '')
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
    // 获取选中的体验课排期
    onChange(data) {
      this.$emit('schedulingSearch', data.length > 0 ? data : '')
    },
    // 获取时间选中的值
    changeHandler(data) {
      if (data) {
        const gte = this.timeData[0]
        const lte = this.timeData[1]
        const octime = { gte, lte }
        this.$emit('dateSearch', octime)
        return
      }
      this.$emit('dateSearch', '')
    }
  }
}
</script>
<style lang="scss">
.threeSelect {
  .el-cascader__tags {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .el-cascader--mini {
    height: 28px;
    .el-input--mini {
      height: inherit;
      .el-input__inner {
        height: 28px !important;
      }
    }
  }
}

.el-cascader-panel {
  max-height: 300px !important;
}
</style>
