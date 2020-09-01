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
      <el-form-item>
        <!-- 微信模块相关从@components/MSearch/searchItems/wxInput.vue粘贴来 -->
        <el-autocomplete
          v-model="searchParams.wechat"
          size="mini"
          clearable
          filterable
          reserve-keyword
          :fetch-suggestions="weixinSearch"
          placeholder="微信号搜索"
          @select="onWxSerch"
          @clear="clearWxSerch"
          ref="wxnum"
        >
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
          <template slot-scope="{ item }">
            <div style="display:flex">
              <div class="name">{{ item.wechat_no || '-' }}</div>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          v-model="searchParams.teamName"
          size="mini"
          clearable
          filterable
          :fetch-suggestions="teamIdSearch"
          placeholder="交出班级名称查询"
          @select="onTeamId"
          @clear="clearTeamId"
        >
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
          <template slot-scope="{ item }">
            <div style="display:flex">
              <div class="name">{{ item.team_name || '-' }}</div>
            </div>
          </template>
        </el-autocomplete>
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
      wechatOptions: [],
      searchParams: {
        wechat: '',
        teamName: ''
      },
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
    },
    onWxSerch(data) {
      this.searchParams.wechat = data.wechat_no
      this.$emit('searchFun', 'weixinSendId', data.id)
    },
    clearWxSerch() {
      this.searchParams.wechat = ''
      this.$emit('searchFun', 'weixinSendId', '')
    },
    // 输入微信号
    async weixinSearch(queryString, cb) {
      // const reg = /^\w+$/
      // if (!+this.onlyWeixin) {
      //   if (!reg.test(queryString)) {
      //     this.searchParams.wechat = ''
      //     return
      //   }
      // }
      // 输入内容查找到的关联信息（下拉框）
      const list = await this.weixinCreateFilter(queryString)
      // console.log('*****list******', list)
      // cb 展示列表数据
      cb(list)
    },
    // 调用微信号搜索接口
    weixinCreateFilter(queryString) {
      // 输入内容匹配到的关联信息（下拉框）
      return this.$http.Weixin.getWeChatTeacherListEx(
        'wechat_no.keyword',
        queryString
      ).then((res) => {
        // console.log('微信搜索调用接口', res)
        return res.data.WeChatTeacherListEx || []
      })
    },
    async teamIdSearch(queryString, cb) {
      const list = await this.StudentTeamList(queryString)
      cb(list)
    },
    StudentTeamList(teamName) {
      return this.$http.Teacher.StudentTeamList(teamName).then((res) => {
        return res?.data?.StudentTeamList || []
      })
    },
    onTeamId(data) {
      this.searchParams.teamName = data.team_name
      this.$emit('searchFun', 'teamId', data.id)
    },
    clearTeamId() {
      this.searchParams.teamName = ''
      this.$emit('searchFun', 'teamId', '')
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
