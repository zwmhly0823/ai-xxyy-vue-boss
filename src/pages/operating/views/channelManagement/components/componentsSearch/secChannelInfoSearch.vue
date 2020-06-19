<template>
  <div class="search-item small threeSelect">
    <el-cascader
      placeholder="请选择渠道分类"
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
      style="margin-left:20px;"
      v-model="channelLevel"
      @change="onChangeChannelLevel"
      size="mini"
      placeholder="请选择"
      clearable
      multiple
    >
      <el-option label="S" :value="2">S</el-option>
      <el-option label="A" :value="1">A</el-option>
      <el-option label="B" :value="0">B</el-option>
    </el-select>
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
      channels: '',
      channelLevel: '', // 渠道等级
      isMultiple: false,
      loading: false,
      stage: '',
      channelName: [],
      channelLeves: [],
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
      this.stage = ''
      this.channelName = []
      this.channels = ''
    }
  },
  async created() {
    await this.getChannelLeves()
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
    async getChannelLeves() {
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
          this.channelLeves = res.data.channelAllList
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
      console.error('data', data)
      this.$emit('channelSearchValue', data.length > 0 ? data : '')
    },
    onChangeChannelLevel(data) {
      this.$emit('channelLevelValue', data.length > 0 ? data : '')
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
