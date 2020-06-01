<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-25 15:49:08
 -->
<template>
  <div class="search-item small">
    <el-form @submit.native.prevent>
      <el-select
        v-model="teacherId"
        :multiple="isMultiple"
        filterable
        remote
        :reserve-keyword="true"
        size="mini"
        clearable
        :placeholder="tip"
        :remote-method="getTeacher"
        :loading="loading"
        @change="onChange"
      >
        <el-option
          v-for="item in teacherList"
          :key="item.id"
          :label="item.realname"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'pay_teacher_id'
    },
    tip: {
      type: String,
      default: '社群销售'
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    teacherscope: {
      type: Array,
      default: () => {
        return null
      }
    }
  },
  components: {},
  data() {
    return {
      loading: false,
      input: '',
      teacherId: '',
      teacherList: []
    }
  },
  created() {
    this.getTeacher()
  },
  watch: {
    teacherscope(val, old) {
      this.teacherId = ''
      this.getTeacher()
    },
    teacherId(val, old) {
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    }
  },
  methods: {
    selectFocus(e) {
      this.getTeacher()
    },
    getTeacher(query = '') {
      const { getDepartmentTeacherEx } = this.$http.Department
      this.loading = true
      const q = {
        bool: {
          must: query
            ? [{ wildcard: { 'realname.keyword': `*${query}*` } }]
            : []
        }
      }
      this.teacherscope &&
        // this.teacherscope.length &&
        q.bool.must.push({ terms: { id: this.teacherscope } })
      getDepartmentTeacherEx(JSON.stringify(q))
        .then((res) => {
          this.teacherList = res.data.TeacherListEx || []
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onChange(item) {
      this.$emit(
        'result',
        item ? { [this.name]: item, teacherList: this.teacherList } : ''
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 140px !important;
  }
}
</style>
<style lang="scss">
.ppName {
  width: 140px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .el-scrollbar {
    width: 100%;
  }
}
</style>
