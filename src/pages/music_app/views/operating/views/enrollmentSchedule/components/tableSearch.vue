<template>
  <div class="table-search">
    <el-cascader
      placeholder="选择渠道"
      size="mini"
      v-model="form.channelName"
      @change="(data) => changeEmit(data, 'channelIds')"
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
    <el-input
      size="mini"
      v-model="form.input"
      @input="(data) => changeEmit(data, 'channelId')"
      placeholder="请输入渠道ID"
      clearable
      class="input-custom"
    ></el-input>
    <search-stageEC
      class="input-custom"
      @result="(data) => changeEmit(data, 'periods')"
      :type="calcType"
      name="periods"
      placeholder="体验课排期"
    />
    <slot name="addChannel"></slot>
  </div>
</template>

<script>
import SearchStageEC from '@/components/MSearch/searchItems/searchStageEC'

export default {
  name: 'tableSearch',

  props: {
    showDatas: {
      type: Array,
      value: []
    }
  },

  components: {
    SearchStageEC
  },

  data() {
    return {
      form: {
        channelName: '', // 渠道name
        input: '' // 搜索渠道id
      },
      courseType: 0 // 课程类型
    }
  },

  created() {
    const { courseType } = this.$route.params
    this.courseType = String(courseType)
  },

  methods: {
    // 筛选项changeEmit
    changeEmit(data, key) {
      this.$emit('change', { data, key })
    }
  },

  computed: {
    calcType() {
      // 查询排期 0是双周  2是单周
      return this.courseType==='1'?'0':'2'
    }
  }
}
</script>

<style scoped lang="scss">
.table-search {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .input-custom {
    width: 160px;
    margin-left: 20px;
  }
  /deep/ .custom-h {
    .el-input {
      height: 28px;
      input {
        height: 28px !important;
      }
    }
    .el-cascader__tags {
      flex-wrap: nowrap !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      .el-tag {
        margin: 4px 0 0px 6px;
      }
    }
  }
}
</style>
