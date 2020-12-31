<!--
 * @Descripttion: 班级学员列表 - 包括 0-课前准备, 1-上课情况
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-05 20:17:42
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-04 21:58:17
-->
<template>
  <div class="team-user-list">
    <div class="team-user-search">
      <el-form :inline="true" size="mini">
        <el-form-item label="学员搜索">
          <search-phone
            tip="手机号搜索"
            name="id"
            class="search-item"
            @result="getFilterResult"
          ></search-phone>
          <search-usernum
            class="search-item"
            @result="getFilterResult"
          ></search-usernum>
        </el-form-item>
        <el-form-item label="转化" v-if="+tab === 1">
          <simple-select
            name="user_status"
            placeholder="转化情况"
            :my-style="{ width: '100px' }"
            :multiple="false"
            :data-list="conversionStatus"
            @result="getSearchData('user_status', arguments)"
          />
        </el-form-item>
        <el-form-item label="手动标签:">
          <div class="search-group">
            <define-label-v2
              ref="defineLabelV2"
              placeholder="请选择"
              name="id"
              @result="getSearchData('id', arguments)"
            />
          </div>
        </el-form-item>
        <!-- <el-form-item label="人群组" v-if="+tab === 1">
          <simple-select
            name="expression"
            placeholder="筛选"
            :my-style="{ width: '100px' }"
            :multiple="false"
            :data-list="groupList"
            @result="getSearchData('expression', arguments)"
          />
        </el-form-item> -->
      </el-form>
      <!--- 占位div -->
      <div class="set-div" v-if="+tab === 1"></div>
      <div class="team-user-button" v-if="+tab === 1">
        <!-- 生成完课榜/生成作品展-->
        <class-details-buttons :team-id="teamId"></class-details-buttons>
      </div>
    </div>
    <div class="tableInner" ref="tableInner"></div>
    <trial-user-list
      v-if="propHeight > 0"
      :propHeight="propHeight"
      :key="now"
      :team-id-prop="teamId"
      :teamParams="teamParamsNext"
      :teamStatus="status"
      :teamTab="tab"
    />
  </div>
</template>

<script>
import SearchPhone from '@/components/MSearch/searchItems/searchPhone.vue'
import SearchUsernum from '@/components/MSearch/searchItems/searchUsernum.vue'
import TrialUserList from '@/pages/users/views/trial-v2/index.vue'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
import classDetailsButtons from '@/pages/studentTeam/components/TabPane/components/classDetailsButtons.vue'
import DefineLabelV2 from '@/components/MSearch/searchItems/defineLabelV2.vue'
export default {
  components: {
    TrialUserList,
    SearchPhone,
    SearchUsernum,
    SimpleSelect,
    classDetailsButtons,
    DefineLabelV2
  },
  props: {
    // 班级ID
    teamId: String,
    // 课程状态{0: 待开课 1: 开课中 2: 已结课}
    status: {
      type: String,
      default: '0'
    },
    // tab 0-课前准备, 1-上课情况, 2-本班订单
    tab: {
      type: String,
      default: '0'
    },
    teamParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      now: '',
      teamParamsNext: {},
      // conversion_type 0 未转化 1 月课 2半年课 3 年课
      conversionStatus: [
        {
          id: 2,
          text: '已购半年课'
        },
        {
          id: 3,
          text: '已购年课'
        },
        {
          id: 0,
          text: '未转化'
        }
      ],
      groupList: [],
      userinfo: {},
      propHeight: 0
    }
  },
  watch: {
    tab(val) {
      this.now = new Date().getTime()
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem('teacher'))
    this.teamParamsNext = JSON.parse(JSON.stringify(this.teamParams))
    // 获取筛选项列表
    // this.getGroup()
  },
  mounted() {
    // 获取高
    // console.log(this.$refs.tableInner.offsetTop)
    this.propHeight = this.$refs.tableInner.offsetTop + 25
  },
  methods: {
    // getGroup() {
    //   Promise.all([
    //     this.getAllFollowGroup('PERSONAL'),
    //     this.getAllFollowGroup('DEPARTMENT')
    //   ])
    //     .then((res) => {
    //       this.groupList = []
    //       res.forEach((item) => {
    //         item.forEach((child) => {
    //           this.groupList.push({ id: child.expression, text: child.name })
    //         })
    //       })
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },
    // getAllFollowGroup(type) {
    //   return new Promise((resolve, reject) => {
    //     return this.$http.User.getAllFollowGroup(this.userinfo.id, type)
    //       .then((res) => {
    //         if (res?.payload) {
    //           resolve(res.payload)
    //         } else {
    //           resolve([])
    //         }
    //       })
    //       .catch((error) => {
    //         reject(error)
    //       })
    //   })
    // },
    filterParamsChange(val) {
      // 切换上面的筛选项时清空下面的输入框筛选
      this.teamParamsNext = JSON.parse(JSON.stringify(val))
    },
    getFilterResult(res) {
      if (!res) {
        // 清空手机号时会返回''
        res = { id: '' }
      }
      this.teamParamsNext = Object.assign({}, this.teamParamsNext, res)
      Object.keys(this.teamParamsNext).forEach((item) => {
        if (!this.teamParamsNext[item]) {
          delete this.teamParamsNext[item]
        }
      })
    },
    getSearchData(key, res) {
      let search = res && res[0]
      if (search) {
        if (key === 'user_status') {
          // 未转化
          if (search.user_status === 0) {
            search.user_status = { lte: 2 }
          }
          // 已购半年课
          if (search.user_status === 2) {
            search.user_status = { gte: 11, lte: 12 }
          }
          // 已购年课
          if (search.user_status === 3) {
            search.user_status = { gte: 5, lte: 7 }
          }
        }
        if (key === 'expression') {
          search = JSON.parse(res[0].expression)
        }
        // 清空筛选（id
        if (!res[0][key]?.length && key === 'id') {
          delete search[key]
          delete this.teamParamsNext[key]
        }
      } else {
        // 清空转化的筛选时返回空字符串
        delete search.user_status
        delete this.teamParamsNext.user_status
      }
      this.teamParamsNext = Object.assign({}, this.teamParamsNext, search)
    }
  }
}
</script>

<style lang="scss" scoped>
.team-user-list {
  .team-user-search {
    position: relative;
    margin: 20px 20px 10px;
    vertical-align: middle;
    ::v-deep {
      .el-form-item__label {
        font-weight: normal;
        font-size: 12px;
      }
      .el-form-item--mini.el-form-item {
        margin-bottom: 0px;
      }
    }
    .search-item {
      display: inline-block;
      margin: 0 10px 10px 0;
    }
    .set-div {
      visibility: hidden;
      width: 214px;
      height: 28px;
      margin-left: 20px;
    }
    .team-user-button {
      position: absolute;
      right: 0px;
      bottom: 0px;
    }
  }
}
</style>
