<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-09 19:05:09
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-09 19:05:09
 * @Description: 体验课类型选择 关联表：tg_student_trial_course, team_category: 0-双周  3-单周.
 * 更正：通过o_order表的 packages_id 区分体验课单双周类型。 11- 单周；5，6双周   1-9.9元课程
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="type"
      size="mini"
      clearable
      :placeholder="placeholder"
      @change="onChange"
      @clear="onClear"
      class="item-style"
    >
      <el-option
        v-for="(item, index) in typeList"
        :key="index"
        :value="item.id"
        :label="item.text || item.name"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    typeB: {
      type: Number,
      default: 0,
    },
    addSupS: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '体验课类型',
    },
  },
  data() {
    return {
      type: null,
      typeList: [
        {
          id: [500, 503, 505, 508],
          text: '双周体验课',
        },
        {
          id: [502, 506, 507],
          text: '单周体验课',
        },
      ],
    }
  },
  watch: {},
  methods: {
    onChange(item) {
      this.$emit('result', item ? { [this.name]: item } : '')
    },
    onClear() {
       this.$emit('result',{ [this.name]:[500, 503, 505, 508,502, 506, 507] })
    }
  },
}
</script>

<style lang="scss" scoped>
.search-item {
  &.small {
    .item-style {
      width: 140px !important;
      margin-right: 10px;
    }
    .item-style:last-child {
      margin-right: 0px;
    }
  }
}
</style>