<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-20 19:38:35
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-20 19:38:35
 * @Description: 社群销售 组织机构， 根据选择的机构ID，返回对应的老师ID
 -->
<template>
  <div class="search-item small threeSelect" :style="myStyle">
    <el-cascader
      size="mini"
      class="item-style"
      :placeholder="placeholder"
      :options="departmentList"
      :disabled="isDisabled"
      v-model="departData"
      :props="{
        multiple,
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly,
      }"
      :show-all-levels="false"
      clearable
      @change="onSelect"
      :clearCheckedNodes="clearCheckedNodes"
      ref="dept"
    ></el-cascader>
  </div>
</template>

<script>
import { sortByKey } from '@/utils/boss'

export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '销售部',
    },
    // 有时只需获取 deptid，无须获取teacherids
    onlyDept: {
      type: Number,
      default: 0,
    },
    departmentId: {
      type: String,
      default: '0',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    // 单行模式下，选择任意一级选项
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    // 是否是兼职老师
    isParttimeTeacher: {
      type: Boolean,
      default: false,
    },
    myStyle: {
      type: Object,
      default: () => {},
    },
    departStatus: {
      type: Boolean,
      default: false,
    },
    groupStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      departmentList: [],
      departData: [],
    }
  },
  created() {
    this.getDepartment()
  },
  watch: {
    departStatus(newValue) {
      if (newValue) {
        this.departData = []
      }
    },
    groupStatus(newValue) {
      if (newValue) {
        this.departData = []
      }
    },
  },
  methods: {
    getDepartment() {
      this.$http.Department.getDepartmentList(this.departmentId).then((res) => {
        const arr = res.payload || []
        const department = sortByKey(arr, 'id')
        department.sort(this.handle('sort'))
        this.recursive(department)
        if (this.isParttimeTeacher) {
          this.departmentList = department.filter((item) => {
            return item.name === '美术兼职老师'
          })
        } else {
          this.departmentList = department
        }
      })
    },
    async onSelect(data) {
      // TODO: 根据选择的销售组，获取销售ID
      // const ids = { department_id: data || [] }
      // 返回选择的节点本身及其包含的了节点
      const allNodes = this.$refs.dept.getCheckedNodes()
      const allNodesId = allNodes.map((item) => item.value)
      const ids = { department_id: allNodesId || [] }
      window.localStorage.setItem('department', JSON.stringify(ids))
      if (this.onlyDept === 1) {
        this.$emit('result', { [this.name]: allNodesId })
        // this.$emit('result', { [this.name]: data })
      } else {
        const teacher = await this.$http.Department.getDepartmentTeacher(
          JSON.stringify(ids),
          300,
          this.isParttimeTeacher
        )
        // 这里赋值的时候要注意
        const teacherIds = teacher.data.TeacherList.map((item) => item.id)
        this.$emit(
          'result',
          data === null || data.length > 0 ? { [this.name]: teacherIds } : '',
          { [this.name]: allNodesId }
        )
      }
    },
    clearCheckedNodes() {
      console.log(123123)
    },
    handle(property) {
      return function (a, b) {
        const val1 = a[property]
        const val2 = b[property]
        return val2 - val1
      }
    },
    recursive(value) {
      value.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.children.sort(this.handle('sort'))
          this.recursive(item.children)
        }
      })
    },
  },
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
  .el-icon-close {
    display: none;
  }
}
.search-item {
  .item-style {
    width: 140px;
  }
}
.el-cascader-panel {
  max-height: 300px !important;
}
</style>
