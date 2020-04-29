<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-23 15:06:25
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-26 14:56:42
 -->
<template>
  <div>
    <el-cascader
      clearable
      size="small"
      style="width:280px;"
      @change="handleChange"
      v-model="strAssociatedTeacher"
      placeholder="销售部门"
      :options="associatedTeacher"
      :props="optionProps"
      filterable
    ></el-cascader>
    <el-select
      size="small"
      style="width:150px;margin:15px;"
      @change="saleChange"
      v-model="saleId"
      filterable
      remote
      reserve-keyword
      placeholder="社群销售"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="item in soleList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>

    <el-select
      size="small"
      style="width:150px;"
      v-model="value"
      placeholder="难度级别"
      @change="changeSup"
    >
      <el-option
        v-for="item in sup"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      saleId: '',
      soleList: [],
      loading: false,
      optionProps: {
        value: 'id',
        label: 'name'
      },
      associatedTeacher: [],
      strAssociatedTeacher: '',
      TeacherListvalue: '',
      restaurants: [],
      state2: '',
      timeout: null,
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      sup: [
        {
          value: 'S1',
          label: 'S1'
        },
        {
          value: 'S2',
          label: 'S2'
        },
        {
          value: 'S3',
          label: 'S3'
        },
        {
          value: 'S4',
          label: 'S4'
        },
        {
          value: 'S5',
          label: 'S5'
        }
      ],
      value: ''
    }
  },
  mounted() {
    this.onCreatedSelect()
  },
  methods: {
    async getSup() {
      // axios
      //   .post('/graphql/filter', {
      //     query: `{
      //       courseSupList{
      //           id
      //           name
      //         }
      //       }
      //     `
      //   })
      //   .then((res) => {
      //     this.supList = res.data.courseSupList
      //     this.supList.splice(
      //       res.data.courseSupList.filter((item) => +item.id === 0),
      //       1
      //     )
      //   })
    },
    onCreatedSelect() {
      // 关联老师选择部门
      this.$http.Teacher.getDepartmentTree().then((res) => {
        this.associatedTeacher = res.payload
      })
    },
    // 难度级别
    changeSup(value) {
      this.$emit('searchSup', value)
    },
    // 社群销售
    saleChange(value) {
      this.$emit('searchSale', value)
    },
    handleChange(value) {
      switch (value && value.length) {
        case 1:
          this.strAssociatedTeacher = value[0]
          break
        case 2:
          this.strAssociatedTeacher = value[1]
          break
        case 3:
          this.strAssociatedTeacher = value[2]
          break
        default:
          break
      }
      this.$emit('searchDepartment', this.strAssociatedTeacher)
      this.saleId = ''
      this.soleList = []
      this.remoteMethod()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          if (this.strAssociatedTeacher) {
            this.TeacherListvalue = `{"department_id": ${this.strAssociatedTeacher}}`
          }
          this.$http.Teacher.TeacherList(this.TeacherListvalue).then((res) => {
            const data = res.data.TeacherList
            const _data = []
            data.forEach((res) => {
              _data.push({
                value: res.id,
                label: res.realname
              })
            })
            this.soleList = _data.filter((item) => {
              return query
                ? item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                : item
            })
          })
        }, 200)
      } else {
        this.soleList = []
      }
    }
  }
}
</script>

<style></style>
