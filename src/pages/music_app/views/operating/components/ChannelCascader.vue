<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-25 14:35:19
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-12 17:49:05
 -->
<template>
  <div class="channel-cascader">
    <div class="comp-cell">
      <el-cascader
        :placeholder="channelPlaceHolder"
        size="mini"
        v-model="channelName"
        @change="onSelectChannel"
        :options="showChannelDatas"
        :props="{
          multiple: true,
          value: 'id',
          label: 'channel_outer_name',
          emitPath: true,
          checkStrictly: false
        }"
        :show-all-levels="true"
        clearable
        filterable
        collapse-tags
      ></el-cascader>
      <!-- <el-cascader
        :placeholder="channelPlaceHolder"
        size="mini"
        v-model="channelName"
        @change="onSelectChannel"
        :options="showChannelDatas"
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
        collapse-tags
      ></el-cascader> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 渠道组件“placeholder”
    channelPlaceHolder: {
      type: String,
      default: '请选择渠道分类'
    },
    // 当前组件index
    currentIndex: {
      type: Number,
      default: 0
    },
    levelGrade: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      channelList: [],
      channelName: [],
      showChannelDatas: null, // 渠道三级列表展示数据
      channelClassList: null // 分类条件
    }
  },
  computed: {},
  components: {},
  async created() {
    if (this.levelGrade === 3) await this.getChannel()

    this.getChannelClassList()
  },
  methods: {
    // 获取渠道来源 filter: 过滤关键词  eg：filter:"抖音"
    async getChannel() {
      const { data } = await this.$http.Operating.getChannel({
        subject: this.$store.getters.subjects.subjectCode
      })
      this.channelList = data?.ChannelAllList || []
    },
    // 获取渠道来源分类 filter: 过滤关键词  eg：filter:"抖音"
    async getChannelClassList() {
      const res = await this.$http.Operating.getChannelClassList()
      this.channelClassList = res?.data?.ChannelClassList || []

      this.formatData(this.channelList, this.channelClassList)
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
            content.id = 'id'+content.id;
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
      this.showChannelDatas = result
    },
    onSelectChannel(channelArr) {
      this.$emit('onSelectedChannel', { channel: channelArr })
    }
  }
}
</script>

<style lang="scss" scoped>
.channel-cascader {
  // height: 50px;
  // margin-bottom: 10px;
  display: flex;
  align-items: center;
  .comp-cell {
    // margin-right: 20px;
  }
}
</style>
<style lang="scss">
.channel-cascader {
  .el-cascader__tags {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: flex;
    align-items: center;
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
.mw-140 {
  max-width: 140px !important;
}
</style>
