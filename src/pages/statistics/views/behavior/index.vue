<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-06 14:18:35
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-13 22:11:00
-->
<template>
  <div class="app-main height">
    <div>
      <behaviorSearch
        @onBehavior="onBehavior"
        @onInputValue="onInputValue"
        @fourpoints="fourpoints"
        @onConversionValue="onConversionValue"
        @onCurriculumValue="onCurriculumValue"
        @onStageValue="onStageValue"
      />
    </div>
    <div class="bottom-table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="用户信息" width="280">
          <template slot-scope="scope">
            <div @click="userHandle(scope.row)" class="info-box">
              <div class="user-info-box">
                <img
                  v-if="scope.row.head"
                  class="user-info-img"
                  :src="`${scope.row.head}`"
                />
                <img
                  v-else
                  class="user-info-img"
                  src="https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png"
                />
                <img
                  class="user-info-img-sex"
                  v-if="+scope.row.sex === 1"
                  src="../../../../assets/images/man-icon.png"
                />
                <img
                  class="user-info-img-sex"
                  v-else-if="+scope.row.sex === 2"
                  src="../../../../assets/images/woman-icon.png"
                />
              </div>
              <div class="user-info-text-box">
                <span>{{ scope.row.username || '-' }} -</span>
                <span> {{ scope.row.mobile || '-' }}</span>
                <br />
                <span> {{ scope.row.birthday || '-' }} · </span>
                <span>
                  {{ scope.row.base_painting_text || '-' }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="微信信息">
          <template slot-scope="scope">
            <div class="weixin-box">
              <img class="weixin-img" :src="scope.row.weixin_avatar" alt="" />
              <span class="weixin-text">{{ scope.row.weixin_nick_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户行为" width="200">
          <template slot-scope="scope">
            <div class="behavior-box" v-if="+scope.row.action_type === 1">
              <span>{{ scope.row.action_type_text }} </span>
              <span class="behavior-text">{{ scope.row.device_model }}</span>
              <br />
              <span>{{ scope.row.action_time }}</span>
            </div>
            <div class="behavior-box" v-if="+scope.row.action_type === 2">
              <span>{{ scope.row.action_type_text }}</span>
              <br />
              <span>{{ scope.row.action_time }}</span>
            </div>
            <div
              class="behavior-box"
              v-if="
                +scope.row.action_type === 3 ||
                  +scope.row.action_type === 4 ||
                  +scope.row.action_type === 5 ||
                  +scope.row.action_type === 6
              "
            >
              <span>{{ scope.row.action_type_text }}</span>
              <span>《{{ scope.row.course_title }}》</span>
              <br />
              <span>{{ scope.row.action_time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否转化">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.status }}</span>
              <br />
              <span v-if="scope.row.status == '已转化'">{{
                scope.row.order.buytime
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="归属地">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.mobile_province || '-' }} · </span>
              <span>{{ scope.row.mobile_city || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="班级名称">
          <template slot-scope="scope">
            <div v-if="scope.row.team_name_type">
              <span
                @click="openTeam(scope.row)"
                style="color: #409eff;cursor: pointer;"
                >{{ scope.row.team_name }}</span
              >
            </div>
            <div v-else>
              <span>-</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="销售名称">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.teacher_name || '-' }}</span>
              <br />
              <span>{{ scope.row.teacher_department_name }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        style="bottom:0;"
        @current-change="handleCurrentChange"
        :current-page="+currentPage"
        :total="+totalElements"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>
  </div>
</template>

<script>
import behaviorSearch from '../behavior/components/behaviorSearch'
import MPagination from '@/components/MPagination/index.vue'
import { openBrowserTab, GetAgeByBrithday, timestamp } from '@/utils/index'

export default {
  components: {
    behaviorSearch,
    MPagination
  },
  data() {
    return {
      tableData: [],
      currentPage: '1',
      totalElements: '',
      valueInput: '',
      valueBehavior: [],
      valueConversion: '',
      valueCurriculum: '',
      valueStage: '',
      valueFourpoints: '',
      paramsValues: ''
    }
  },
  mounted() {
    this.getUserBehaviorLogPage()
    // this.$root.$on('fourpoint', function(data) {
    //   console.log(data, 'mounted')
    // })
  },
  methods: {
    // 跳转到班级
    openTeam(row) {
      const teamname = row.team.team_name
      const teamtype = row.team.team_type
      const teamid = row.team_id
      teamid &&
        openBrowserTab(
          `/student-team/#/teamDetail/${teamid}/${teamtype}`,
          `${teamname}`
        )
    },
    // 跳转详情页
    userHandle(user) {
      // console.log(user, '点击用户信息')
      const userId = user.user.id
      // 新标签打开详情页
      userId && openBrowserTab(`/users/#/details/${userId}`)
    },
    getUserBehaviorLogPage() {
      const paramsValue = []
      // 用户搜索
      if (this.valueInput) {
        paramsValue.push(
          `"mobile.like": {"mobile.keyword":"*${this.valueInput}*"}`
        )
      }
      // 用户行为
      if (this.valueBehavior.length !== 0) {
        paramsValue.push(`"action_type":${JSON.stringify(this.valueBehavior)}`)
      }
      // 是否转化
      if (this.valueConversion) {
        paramsValue.push(`"status":${this.valueConversion}`)
      }
      // 选择体验课系统课
      if (this.valueCurriculum) {
        paramsValue.push(
          `"order_regtype":${JSON.stringify(this.valueCurriculum)}`
        )
      }
      // 选择期数
      if (this.valueStage) {
        paramsValue.push(`"stage":${JSON.stringify(this.valueStage)}`)
      }
      // 行为时间
      if (this.valueFourpoints) {
        paramsValue.push(`"action_time":${this.valueFourpoints}`)
      }
      this.paramsValues = paramsValue && `{${paramsValue.join(',')}}`

      const currentPage = this.currentPage
      this.$http.Statistics.UserBehaviorLogPage(
        this.paramsValues,
        currentPage
      ).then((res) => {
        this.currentPage = res.data.UserBehaviorLogPage.number
        this.totalElements = res.data.UserBehaviorLogPage.totalElements
        const _data = res.data.UserBehaviorLogPage.content
        _data.forEach((item) => {
          if (item.birthday !== '0') {
            item.birthday = GetAgeByBrithday(+item.birthday)
          } else {
            item.birthday = '-'
          }

          if (item.weixin_nick_name) {
            if (item.weixinUser) {
              item.weixin_nick_name = item.weixinUser.nickname
              item.weixin_avatar = item.weixinUser.avatar
            } else {
              item.weixin_nick_name = '-'
              item.weixin_avatar =
                'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png'
            }
          }
          // if (item.action_type === 1) {
          //   item.action_type_text = '打开APP'
          // } else if (item.action_type === 2) {
          //   item.action_type_text = '已支付'
          // } else if (item.action_type === 3) {
          //   item.action_type_text = '参课'
          // } else if (item.action_type === 4) {
          //   item.action_type_text = '完课'
          // } else if (item.action_type === 5) {
          //   item.action_type_text = '听点评'
          // } else if (item.action_type === 6) {
          //   item.action_type_text = '上传作品'
          // }

          if (!item.team_name) {
            if (item.teacher) {
              item.teacher_name = item.teacher.realname
              if (item.teacher.departmentInfo) {
                item.teacher_department_name = item.teacher.departmentInfo.name
              } else {
                item.teacher_department_name = '-'
              }
            } else {
              item.teacher_name = '-'
            }
          }

          if (!item.team_name) {
            if (item.team) {
              item.team_name = item.team.team_name
              item.team_name_type = 1
            } else {
              item.team_name_type = 0
              item.team_name = '-'
            }
          }

          if (item.order) {
            item.order.buytime = timestamp(item.order.buytime, 2)
          } else {
            item.order = {
              buytime: '-'
            }
          }

          item.action_time = item.action_time
            ? timestamp(item.action_time, 2)
            : '-'
          if (+item.status > 2) {
            item.status = '已转化'
          } else {
            item.status = '未转化'
          }
        })
        setTimeout(() => {
          this.tableData = _data
        }, 300)
      })
    },
    // 手机号搜索
    onInputValue(data) {
      if (data) {
        this.valueInput = data
      } else {
        this.valueInput = ''
      }
      this.currentPage = '1'
      this.getUserBehaviorLogPage()
    },
    // 用户行为下拉框
    onBehavior(data) {
      if (data) {
        this.valueBehavior = data
      } else {
        this.valueBehavior = ''
      }
      this.currentPage = '1'
      this.getUserBehaviorLogPage()
    },
    // 是否转换 下拉框
    onConversionValue(data) {
      if (data === 1) {
        this.valueConversion = `{"lt":2}`
      } else if (data === 2) {
        this.valueConversion = `{"gt":2}`
      } else {
        this.valueConversion = ''
      }
      this.currentPage = '1'
      this.getUserBehaviorLogPage()
    },
    // 选择体验课 系统课
    onCurriculumValue(data) {
      if (data === '1') {
        this.valueCurriculum = ['1']
      } else if (data === '2') {
        this.valueCurriculum = ['2', '3']
      } else {
        this.valueCurriculum = ''
      }
      this.currentPage = '1'
      this.getUserBehaviorLogPage()
    },
    // 选择期数
    onStageValue(data) {
      if (data) {
        for (const key in data) {
          this.valueStage = data[key]
        }
      } else {
        this.valueStage = ''
      }
      this.currentPage = '1'
      this.getUserBehaviorLogPage()
    },
    // 下单时间
    fourpoints(data) {
      if (data) {
        this.valueFourpoints = `{"gt":${data.ctime.gte},"lt":${data.ctime.lte}}`
      } else {
        this.valueFourpoints = ''
      }
      this.currentPage = '1'
      this.getUserBehaviorLogPage()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserBehaviorLogPage()
    }
  }
}
</script>
<style lang="scss" scoped>
.app-main {
  padding: 10px;
  overflow: auto;
  .bottom-table {
    padding-bottom: 40px;
    .info-box {
      display: flex;
      flex-wrap: nowrap;
      .user-info-box {
        position: relative;
        .user-info-img {
          height: 50px;
          width: 50px;
          border: 1px solid #f0f0f0;
          border-radius: 50%;
        }
        .user-info-img-sex {
          position: absolute;
          left: 40px;
          bottom: 0px;
          width: 20px;
          height: 20px;
        }
      }
      .user-info-text-box {
        cursor: pointer;
        margin-left: 20px;
        span {
          color: #409eff;
        }
      }
    }
    .weixin-box {
      position: relative;
      .weixin-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .weixin-text {
        position: absolute;
        top: 15px;
        left: 70px;
      }
    }
    .behavior-box {
      .behavior-text {
        margin-left: 10px;
      }
    }
  }
}
</style>
