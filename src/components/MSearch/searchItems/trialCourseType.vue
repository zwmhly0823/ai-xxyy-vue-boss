<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-09 19:05:09
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-09 19:05:09
 * @Description: 体验课类型选择 关联表：tg_student_trial_course, team_category: 0-双周  3-单周. 
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="type"
      size="mini"
      clearable
      :placeholder="placeholder"
      @change="onChange"
      class="item-style"
    >
      <el-option
        v-for="item in typeList"
        :key="item.id"
        :value="item.id"
        :label="item.text"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '系统课类型'
    }
  },
  data() {
    return {
      type: null,
      typeList: [
        {
          id: '0',
          text: '双周'
        },
        {
          id: '3',
          text: '单周'
        }
      ]
    }
  },
  methods: {
    onChange(type) {
      console.log(type)
      let item = []
      if (type) {
        const query = JSON.stringify({ team_category: type })
        this.$http.Team.getTrialCourseList(query).then((res) => {
          const data =
            (res && res.data && res.data.StudentTrialCourseList) || []
          item = data.map((c) => c.order_no)
          console.log(item)
        })
      }
      this.$emit('result', item.length > 0 ? { [this.name]: item } : '')
    }
  }
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
