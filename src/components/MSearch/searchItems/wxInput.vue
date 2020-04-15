<template>
  <div class="search-item small">
    <!-- 微信号、手机号 -->
    <el-select
      v-model="channelData"
      size="mini"
      clearable
      filterable
      reserve-keyword
      placeholder="微信搜索"
      @change="onChange"
    >
      <el-option
        v-for="item in weixinNumber"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <!-- 输入框 -->
    <el-input
      :placeholder="`请输入${weixinNumber[selectedInput].name}`"
      size="mini"
      clearable
    >
    </el-input>
    <!-- 使用状态 -->
    <el-select
      v-model="channelData"
      size="mini"
      clearable
      filterable
      reserve-keyword
      placeholder="使用状态"
      @change="onChange"
    >
      <el-option
        v-for="item in status"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <!-- 是否关联老师 -->
    <el-select
      v-model="channelData"
      size="mini"
      clearable
      filterable
      reserve-keyword
      placeholder="是否已关联老师"
      @change="onChange"
    >
      <el-option
        v-for="item in concatTeacher"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <el-button
      type="primary"
      @click="showNewWeChat = true"
      size="mini"
      style="height:30xp;"
      >主要按钮</el-button
    >
    <el-dialog
      :destroy-on-close="true"
      title="新增微信"
      :visible.sync="showNewWeChat"
      width="30%"
    >
      <addWeChat @addWeChat="addWeChat" />
    </el-dialog>
  </div>
</template>

<script>
import addWeChat from '@/pages/teacher/views/weixinManagement/components/addWeChat'
export default {
  components: {
    addWeChat
  },
  props: {
    name: {
      type: String,
      default: 'wx'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showNewWeChat: false,
      weixinNumber: [
        { name: '微信号', id: '0' },
        {
          name: '老师手机号',
          id: '1'
        }
      ],
      status: [
        { name: '启用', id: '0' },
        {
          name: '未启用',
          id: '1'
        }
      ],
      concatTeacher: [
        { name: '微信号', id: '0' },
        {
          name: '老师手机号',
          id: '1'
        },
        {
          name: '老师手机号',
          id: '1'
        }
      ],
      channelData: null,
      selectedInput: 0
    }
  },
  methods: {
    onChange(data) {
      this.selectedInput = data
      this.$emit('result', data ? { [this.name]: this.channelData } : '')
    },
    // 新增微信关闭弹框
    addWeChat(data) {
      if (data === 1) {
        this.showNewWeChat = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 100%;
    display: flex;
    /deep/ .item-style {
      width: 140px !important;
      margin-left: 20px !important;
    }
    /deep/.el-input__inner {
      width: 140px !important;
      margin-left: 20px;
    }
  }
}
</style>
