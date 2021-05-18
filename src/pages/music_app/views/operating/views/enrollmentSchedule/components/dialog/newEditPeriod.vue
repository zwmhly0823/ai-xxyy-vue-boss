<template>
  <el-dialog
    width="50%"
    :title="isNew ? '新增渠道' : '编辑渠道'"
    :visible.sync="visible"
    :append-to-body="toBody"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-dialog
      width="30%"
      title="新增/编辑失败渠道"
      :visible.sync="visibleInnerCalc"
      append-to-body
    >
      <p v-for="(item, idx) in failChannelData" :key="idx">{{ item }}</p>
    </el-dialog>
    <div class="package-list">
      <div>
        <span>指定渠道：</span>
        <el-cascader
          v-show="visible && !Object.keys(periodInfo).length"
          placeholder="选择渠道"
          size="mini"
          v-model="form.channelIds"
          collapse-tags
          :options="showDatas"
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
          class="custom-h"
        ></el-cascader>
        <span v-show="visible && Object.keys(periodInfo).length">{{
          periodInfo.channelName
        }}</span>
      </div>
      <i class="line"></i>
      <search-stage
        class="input-custom"
        :type="calcType"
        :recordPeriod="form.period"
        :status="[0, 1, 2]"
        :isMultiple="false"
        name="period"
        @result="changePeriod"
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogSubmit(false)">取 消</el-button>
      <el-button type="primary" size="small" @click="dialogSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import SearchStage from '@/components/MSearch/searchItems/searchStage'

export default {
  name: 'newEditPeriod',

  components: { SearchStage },

  props: {
    toBody: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    // 内层dialog
    visibleInner: {
      type: Boolean,
      default: false
    },
    courseType: {
      type: [Number, String],
      value: 0
    },
    showDatas: {
      type: Array,
      value: []
    },
    // 失败渠道数据
    failChannelData: {
      type: Array,
      value: []
    },
    periodInfo: {
      // 编辑当前的info
      type: Object,
      value: {}
    }
  },

  data() {
    return {
      form: {
        channelIds: [], // 渠道name
        period: '' // 期
      }
    }
  },

  computed: {
    // 新建、编辑 渠道定向期
    isNew() {
      if (this.periodInfo && Object.keys(this.periodInfo).length) {
        return false
      }
      return true
    },

    calcType() {
      // 28元体验课（单周体验课） tab标签默认为6  但是查询期 单周体验课需要的是5
      return String(this.courseType) === '6' ? '5' : String(this.courseType)
    },

    visibleInnerCalc: {
      get() {
        return this.visibleInner
      },
      set() {
        this.$emit('handleInnerDialog')
      }
    }
  },

  watch: {
    visible(newVal) {
      if (!newVal) {
        this.form.channelIds = []
        this.form.period = ''
      }
      if (newVal && this.periodInfo && Object.keys(this.periodInfo).length) {
        this.receiveVal(this.periodInfo)
      }
    }
  },

  methods: {
    // 选择期
    changePeriod(data) {
      this.form.period = data.period || ''
    },

    // 接收父级 传递的回显属性
    receiveVal(data) {
      this.form.period = String(data.period)
      this.showDatas.forEach((item) => {
        item.children &&
          item.children.forEach((itemChild) => {
            itemChild.children &&
              itemChild.children.forEach((val) => {
                if (val.id === data.channelId) {
                  this.form.channelIds = [[item.id, itemChild.id, val.id]]
                }
              })
          })
      })
    },

    // emit 分发
    dialogSubmit(val = true) {
      const { channelIds = [], period = '' } = this.form
      const filterThree = channelIds.filter((item) => item.length === 3)

      if (val && !channelIds.length) {
        this.$message.warning('请选择渠道')
        return
      }
      if (val && !filterThree.length) {
        this.$message.warning('必须选择包含三级的渠道哦~')
        return
      }
      if (val && !period) {
        this.$message.warning('请选择体验课排期')
        return
      }
      this.$emit('handleDialog', val ? { channelIds: filterThree, period } : {})
    }
  }
}
</script>

<style scoped lang="scss">
.package-list {
  display: flex;
  align-items: center;
  padding-left: 35px;
  .line {
    display: inline-block;
    margin: 0 10px;
    width: 100px;
    height: 3px;
    border-radius: 3px;
    background-color: #b4b4b4;
    position: relative;
    &:after {
      content: '';
      display: inline-block;
      position: absolute;
      border: 5px solid #b4b4b4;
      right: 0;
      border-left-color: transparent;
      border-bottom-color: transparent;
      transform: rotate(45deg);
      top: -3px;
    }
  }
  /deep/ .el-input {
    height: 28px;
    input {
      height: 28px !important;
    }
  }
  /deep/ .el-cascader__tags {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    .el-tag {
      margin: 4px 0 0px 6px;
    }
  }
}
</style>
