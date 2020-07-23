<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-23 17:34:12
 -->
<template>
  <div class="search-item ">
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-select
          v-model="teacherId"
          :multiple="isMultiple"
          filterable
          remote
          :reserve-keyword="true"
          size="mini"
          clearable
          placeholder="交出方姓名查询"
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
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="teacherIds"
          :multiple="isMultiple"
          filterable
          remote
          :reserve-keyword="true"
          size="mini"
          clearable
          placeholder="接收方姓名查询"
          :remote-method="getTeacher"
          :loading="loading"
          @change="onChanges"
        >
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.realname"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          size="mini"
          @change="onChangeType"
          v-model="value"
          placeholder="交接类型"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
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
    isMultiple: {
      type: Boolean,
      default: false
    },
    teacherscope: {
      type: Array,
      default: () => {
        return null
      }
    },
    // 是否需要返回 teacherList 列表
    returnList: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      loading: false,
      input: '',
      teacherId: '',
      teacherIds: '',
      teacherList: [],
      options: [
        {
          value: '0',
          label: '微信交接'
        },
        {
          value: '1',
          label: '班级交接'
        }
      ],
      value: ''
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
      this.$emit('onHandover', item || '')
    },
    onChanges(item) {
      this.$emit('onReceive', item || '')
    },
    onChangeType(item) {
      this.$emit('onType', item || '')
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
