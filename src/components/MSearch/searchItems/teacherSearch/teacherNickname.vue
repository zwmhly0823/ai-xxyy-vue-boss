<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-02 00:20:04
 -->
<template>
  <div class="search-item small">
    <el-form @submit.native.prevent>
      <el-autocomplete
        size="mini"
        name="vals"
        clearable
        class="inline-input"
        v-model="input"
        :fetch-suggestions="querySearch"
        :placeholder="tip"
        :trigger-on-focus="false"
        :popper-class="+onlyName ? 'ppName' : ''"
        @select="inputHandler"
        ref="elautocomplete"
      >
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
        <template slot-scope="{ item }">
          <div style="display:flex">
            <div class="name">{{ item.nickname || '-' }}</div>
            <!-- <div class="name" v-if="+onlyName">
              /{{ item.wechat_nikename || '-' }}
            </div> -->
          </div>
        </template>
      </el-autocomplete>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'nickname'
    },
    onlyName: {
      type: String,
      default: ''
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    // onlyValue: {
    //   type: Boolean,
    //   default: false
    // },
    // team_id
    // teamId: {
    //   type: String,
    //   default: ''
    // },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    tip: {
      type: String,
      default: '对外昵称查询'
    }
  },
  components: {},
  data() {
    return {
      input: '',
      selectData: [],
      select: '1'
    }
  },
  computed: {},
  watch: {
    input(val, old) {
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    }
  },
  methods: {
    async querySearch(queryString, cb) {
      // const reg = /^[0-9]*$/
      // if (!+this.onlyName) {
      //   if (!reg.test(queryString)) {
      //     this.input = ''
      //     return
      //   }
      // }
      const list = await this.createFilter(queryString)
      cb(list)
      this.$refs.elautocomplete.handleFocus()
    },
    createFilter(queryString) {
      return this.$http.Teacher.teacherListEx(
        'nickname.keyword',
        queryString
      ).then((res) => {
        this.selectData = res.data.TeacherListEx || []
        return this.selectData
      })
    },
    inputHandler(data) {
      this.input = data.nickname
      this.$emit('result', data.nickname ? { [this.name]: data.nickname } : '')
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
// .search-item {
//   &.small {
//     width: 135px !important;
//   }
// }
</style>
<style lang="scss">
.ppName {
  width: 220px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .el-scrollbar {
    width: 100%;
  }
}
// .el-select .el-input {
//   width: 90px;
// }
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-form-item__content .el-input-group {
  vertical-align: middle !important;
}
</style>
