<template>
  <div class="search-item small">
    <!-- 微信号 -->
    <el-autocomplete
      v-model="weixinNumberData"
      size="mini"
      clearable
      filterable
      reserve-keyword
      placeholder="微信号搜索"
      @change="onWxSerch"
    >
    </el-autocomplete>
    <!-- 手机号 -->
    <el-autocomplete
      v-model="weixinInp"
      size="mini"
      clearable
      filterable
      reserve-keyword
      placeholder="手机号搜索"
      @change="onPhoneSerch"
    >
    </el-autocomplete>
    <!-- 使用状态 -->
    <el-select
      v-model="statueData"
      size="mini"
      clearable
      filterable
      reserve-keyword
      placeholder="全部状态"
      @change="onWxStatus"
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
      v-model="concatTeacherData"
      size="mini"
      clearable
      filterable
      reserve-keyword
      placeholder="是否已关联老师"
      @change="onWxConcatTeacher"
    >
      <el-option
        v-for="item in concatTeacher"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    wxSerch: {
      type: String,
      default: ''
    },
    wxInput: {
      type: String,
      default: ''
    },
    wxStatus: {
      type: String,
      default: ''
    },
    wxConcatTeacher: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showNewWeChat: false,
      weixinInp: '',
      weixinNumber: [
        { name: '微信号', id: '0' },
        {
          name: '老师手机号',
          id: '1'
        }
      ],
      status: [
        {
          name: '全部',
          id: '0'
        },
        { name: '启用', id: '1' },
        {
          name: '停用',
          id: '2'
        }
      ],
      concatTeacher: [
        {
          name: '全部',
          id: '0'
        },
        {
          name: '是',
          id: '1'
        },
        {
          name: '否',
          id: '2'
        }
      ],
      weixinNumberData: null,
      statueData: null,
      concatTeacherData: null,
      selectedInput: 0
    }
  },
  methods: {
    onWxSerch(data) {
      this.selectedInput = data
      this.$emit(
        'getWxSerch',
        data ? { [this.wxSerch]: this.weixinNumberData } : ''
      )
    },
    onWxStatus(data) {
      this.$emit(
        'getWxStatus',
        data ? { [this.wxStatus]: this.statueData } : ''
      )
    },
    onWxConcatTeacher(data) {
      this.$emit(
        'getWxConcatTeacher',
        data ? { [this.wxConcatTeacher]: this.concatTeacherData } : ''
      )
    },
    onPhoneSerch(data) {
      this.$emit('getWxInput', data ? { [this.wxInput]: this.weixinInp } : '')
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
