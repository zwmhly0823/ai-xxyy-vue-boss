<template>
  <section class="details-body">
    <el-scrollbar>
      <!-- 头部 -->
      <el-row type="flex" justify="start" align="middle" class="header">
        <el-col>
          <div class="upset_24col">
            <!-- 男：1 女：2 -->
            <div class="img-box">
              <img
                class="head-portrait"
                :src="stuInfor_add.head || defaultHead"
              />
              <i
                v-if="stuInfor_add.sex === '2'"
                class="female el-icon-female "
              />
              <i
                v-else-if="stuInfor_add.sex === '1'"
                class="male el-icon-male"
              />
              <i v-else class="el-icon-toilet-paper" />
            </div>
            <div>
              {{ stuInfor_add.username || '-' }}
              ·
              {{ stuInfor_add.user_num || '-' }}
            </div>
            <!-- 只有'1'是关注了-->
            <div>
              <svg
                v-if="
                  stuInfor_add.weixinUser &&
                    stuInfor_add.weixinUser.follow === '1'
                "
                class="lk-icon-green"
                aria-hidden="true"
              >
                <use xlink:href="#icongongzhonghao"></use>
              </svg>
              <svg v-else class="lk-icon" aria-hidden="true">
                <use xlink:href="#icongongzhonghao"></use>
              </svg>
            </div>
            <div>
              <span class="tccc">区域:</span>
              {{ stuInfor.mobile_province || '-' }}
              · {{ stuInfor.mobile_city || '-' }}
            </div>
            <div>
              <span class="tccc">年龄:</span>
              {{ stuInfor.age }}
            </div>
            <div>
              <span class="tccc">生日:</span>
              {{ stuInfor_add.birthday }}
            </div>
            <div>
              <i
                style="cursor:pointer"
                class="el-icon-location-outline colorposition el-elment-lk"
                @click="$refs.showAddress.showAddress = true"
              />
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="upset_24col flex-end">
            <el-dropdown
              v-if="changeSubject === 0"
              type="primary"
              split-button
              size="mini"
              @click="
                $message({
                  message: '右边选择审批类型',
                  type: 'warning'
                })
              "
              @command="queryJump"
            >
              发起审批
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) of [
                    '退款',
                    '补发货',
                    '调班',
                    '调级',
                    '调期'
                  ]"
                  :key="index"
                  :command="item"
                  >{{ item }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
      <!-- 大肚腩 -->
      <el-row type="flex" justify="start" align="middle" class="belly">
        <el-col :span="17" class="dular">
          <!-- 用户资料 -->
          <div class="padding-top20">
            <section class="setou123">
              <strong></strong>
              <span>用户资料</span>
            </section>
            <section style="margin-top:15px">
              <div class="gengbo">
                <span>基本信息</span>
                <el-divider></el-divider>
              </div>
              <el-row
                type="flex"
                justify="space-around"
                align="middle"
                style="margin-top:15px"
              >
                <el-col :span="7">
                  <span>手机号码:</span> {{ stuInfor_add.mobile || '-' }}
                </el-col>
                <el-col :span="7">
                  <span>推荐信息:</span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="$refs.recommend.recommendInfo = true"
                  >
                    详情
                  </el-button></el-col
                >
                <el-col :span="7">
                  <span>注册时间:</span>
                  {{ stuInfor_add.join_date }}
                </el-col>
              </el-row>
              <el-row type="flex" justify="space-around" align="middle">
                <el-col :span="7">
                  <span>注册渠道:</span>
                  {{
                    stuInfor_add.channelInfo &&
                      (stuInfor_add.channelInfo.channel_inner_name || '-')
                  }}</el-col
                >
                <el-col :span="7">
                  <span>学习科目:</span>
                  <el-tag
                    style="margin-right:5px"
                    type="danger"
                    size="mini"
                    v-for="(item, index) in studyCount"
                    :key="index"
                    >{{ item }}</el-tag
                  ></el-col
                >

                <el-col :span="7">
                  <span>最近活跃:</span>
                  {{
                    stuInfor_add.lastLoginData &&
                      (stuInfor_add.lastLoginData.device_model || '-')
                  }}
                  {{
                    stuInfor_add.lastLoginData &&
                      (stuInfor_add.lastLoginData.login_time
                        ? new Date(
                            Number(stuInfor_add.lastLoginData.login_time)
                          ).toLocaleDateString()
                        : '-')
                  }}
                </el-col>
              </el-row>
            </section>
            <section style="margin-top:20px">
              <div class="gengbo">
                <span>用户微信</span>
                <el-divider></el-divider>
              </div>
              <!-- 双编剧塌陷现场-BFC -->
              <el-row
                style="margin-top:15px"
                type="flex"
                justify="space-around"
                align="middle"
              >
                <el-col :span="7" style="vertical-align:middle">
                  <span>微信昵称:</span>
                  <img
                    style="vertical-align:middle"
                    class="head-portrait_small"
                    :src="
                      (stuInfor.jluserInfo && stuInfor.jluserInfo.avatar) ||
                        defaultHead
                    "
                  />
                  {{
                    stuInfor.jluserInfo
                      ? stuInfor.jluserInfo.nick_name || '-'
                      : '-'
                  }}
                </el-col>
                <el-col :span="7">
                  <span>微信号:</span>
                  {{
                    stuInfor.jluserInfo
                      ? stuInfor.jluserInfo.wechat_no || '-'
                      : '-'
                  }}
                </el-col>
                <el-col :span="7">
                  <span>微信备注:</span>
                  {{
                    stuInfor.jluserInfo
                      ? stuInfor.jluserInfo.remark || '-'
                      : '-'
                  }}
                </el-col>
              </el-row>
            </section>
          </div>
          <!-- 用户标签 -->
          <div class="padding-top20">
            <section class="setou123">
              <strong></strong>
              <span>用户标签</span>
              <span style="color:#ccc;font-size:14px">(包含微信标签)</span>
            </section>
            <section v-if="!babels_lk.length && !aikelabel.length">
              <el-row type="flex" justify="space-around" align="middle">
                <el-col :span="7" style="color:#ccc">
                  暂无标签
                </el-col>
                <el-col :span="7"></el-col>
                <el-col :span="7"></el-col>
              </el-row>
            </section>
            <section style="padding-left:15px" v-else>
              <el-tag
                style="margin-right:10px"
                type="sucess"
                size="mini"
                v-for="item of aikelabel"
                :key="item"
                >{{ item }}</el-tag
              >
              <span v-if="babels_lk && babels_lk.length && babels_lk[0].name">
                <el-tag
                  style="margin-right:10px"
                  type="warning"
                  size="small"
                  v-for="item of babels_lk"
                  :key="item.id"
                  >{{ item.name }}</el-tag
                >
              </span>
            </section>
          </div>
        </el-col>
        <el-col :span="7" class="dular">
          <!-- 跟进记录 -->
          <trackFlow />
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <div class="tab-sty">
        <el-tabs type="border-card" v-model="tabData">
          <el-tab-pane label="详细信息" name="detailsInfo">
            <detailsInfo />
          </el-tab-pane>
          <el-tab-pane label="学习记录" name="learningRecord">
            <studyRecord />
          </el-tab-pane>
          <el-tab-pane label="作品集" name="collectionOf">
            <portfolio />
          </el-tab-pane>
          <el-tab-pane label="订单·物流记录" name="orderLogistics">
            <logistics />
          </el-tab-pane>
          <el-tab-pane label="用户资产" name="userAsset">
            <capital />
          </el-tab-pane>
          <el-tab-pane label="通知事件记录" name="notifyRecord">
            <ivr />
          </el-tab-pane>
          <el-tab-pane label="转介绍" name="changeRecommend">
            <changeRecommend />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-scrollbar>
    <!-- 修改地址 -->
    <el-dialog
      width="500px"
      title="修改收货信息"
      :visible.sync="dialogTableVisible"
    >
      <modifyAddress
        :modifyFormData="stuInfor"
        @modifyAddressExpress="modifyAddressExpress"
      />
    </el-dialog>
    <!-- 地址弹窗 -->
    <showAddress
      :addressData="(stuInfor.address && stuInfor.address[0]) || {}"
      ref="showAddress"
      @changeAddress="dialogTableVisible = true"
    />
    <!-- 推荐弹窗 -->
    <recommend
      ref="recommend"
      :recommendHuman="
        stuInfor_add.sender
          ? stuInfor_add.sender
          : { username: '', user_num: '', u_id: '' }
      "
    />
  </section>
</template>

<script>
import { formatDate } from '@/utils/mini_tool_lk'
import detailsInfo from './detailsInfo/index.vue'
import studyRecord from './studyRecord/index.vue'
import logistics from './orderLogistics/index.vue'
import capital from './userCapital/index.vue'
import portfolio from './portfolio/index.vue'
import ivr from './ivrComponents/ivrCon.vue'
import changeRecommend from './changeRecommend/index.vue'
import recommend from './recommendComponents/recommend.vue'
import showAddress from './addressComponents/showAddress.vue'
import trackFlow from './trackFlow/index'
import { GetAgeByBrithday, formatData } from '@/utils/index'
import modifyAddress from './addressComponents/modifyAddress.vue'

export default {
  provide() {
    return { faInstance: this }
  },
  components: {
    // tabs 葫芦7兄弟
    detailsInfo,
    studyRecord,
    portfolio,
    logistics,
    capital,
    ivr,
    changeRecommend,

    // details自用的
    trackFlow,
    recommend,
    showAddress,
    modifyAddress
  },
  data() {
    return {
      changeSubject: this.$store.state.subjects.subjectCode,
      // <修改地址>组件弹窗显示隐藏
      dialogTableVisible: false,
      // 该学员id
      studentId: this.$route.params.id,
      // 推荐人id
      sendId: '0',
      // 学员基本信息(公用_老)
      stuInfor: {
        address: [{}],
        jluserInfo: {},
        teams: [],
        bought_subject: [] // 学习科目
      },
      // 学员基本信息(分类补充)
      stuInfor_add: {
        sender: { username: '' }
      },
      // 学员标签(非艾克的全部4项)
      babels_lk: [],
      // paneltab name
      tabData: 'detailsInfo',
      defaultHead: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png'
    }
  },
  computed: {
    studyCount() {
      return this.stuInfor.bought_subject.map((item) => {
        switch (item) {
          case 'ART_APP':
            item = '小熊美术'
            break
          case 'WRITE_APP':
            item = '美术宝写字'
            break
          case 'COLLEGE_APP':
            item = 'AI学院'
            break
          default:
            item = '未知学科'
            break
        }
        return item
      })
    },
    aikelabel() {
      return (
        (this.stuInfor &&
          this.stuInfor.jluserInfo &&
          this.stuInfor.jluserInfo.labels &&
          JSON.parse(this.stuInfor.jluserInfo.labels)) ||
        []
      )
    }
  },
  created() {
    this.reqUser() // 学员信息接口
    this.reqUser_add() // 学员信息接口-分类补充
    this.getlabelWithoutAike() // 获取艾克之外的标签
  },
  methods: {
    // 获取艾克之外的标签
    async getlabelWithoutAike() {
      const { code, payload } = await this.$http.User.listLabelsForUser(
        this.studentId
      ).catch((err) => {
        this.$message.error('标签获取失败')
        console.error(err)
      })
      if (!code && payload && payload.length) {
        this.babels_lk = payload
      }
    },
    // 数据接口_学员信息
    reqUser() {
      this.$http.User.getUser(this.studentId).then((res) => {
        // ①学员基本资料_赋值
        this.stuInfor = res.data.User || {}
        // ②-1课程名称格式化 0:体验课   >0:系统课
        if (this.stuInfor.teams && this.stuInfor.teams.length > 0) {
          this.stuInfor.teams.forEach((item) => {
            if (item.team_type === '0') {
              item.team_type_formatting = '体验课'
            } else {
              item.team_type_formatting = '系统课'
            }
          })
        }
        // ②-2给各个组件传基础数据
        this.$root.$emit(
          'study',
          this.stuInfor.teams,
          this.stuInfor.zero_teamid_write_trials
        ) // 学习记录+0元体验课
        this.$root.$emit(
          'portfolio',
          this.stuInfor.teams,
          this.stuInfor.zero_teamid_write_trials
        ) // 作品集+0元体验课
      })
    },
    // 数据接口_学员信息分类补充
    reqUser_add() {
      console.count('nihao')
      this.$http.User.getUser_add({
        u_id: this.studentId,
        subject: this.changeSubject
      }).then((res) => {
        // ①学员基本资料_分类补充_赋值
        this.stuInfor_add = res.data.UserExtends
          ? this.modifyData(res.data.UserExtends)
          : {}
        // ②设置 title
        document.title.startsWith('学员中心') &&
          (document.title = `${this.stuInfor_add.username +
            '·' +
            this.stuInfor_add.user_num}-小熊美术BOSS`)
        document.title.indexOf('写字') !== -1 &&
          (document.title = `${this.stuInfor_add.username +
            '·' +
            this.stuInfor_add.user_num}-美术宝写字BOSS`)
      })
    },

    // 工具函数_时间格式化
    modifyData(data) {
      // 年龄格式化
      data.age = data.birthday !== '0' ? GetAgeByBrithday(data.birthday) : '-'
      // 生日格式化
      data.birthday = data.birthday ? formatData(data.birthday * 1000) : '-'
      // 注册时间格式化
      data.join_date = data.join_date ? formatDate(+data.join_date) : '-'
      return data
    },

    // 审批5项跳转
    queryJump(commandlk) {
      this.$message(commandlk + '去')
      const cellphone = this.stuInfor_add.mobile
      const obj = {
        退款: `/approval/#/moneyBack?cellphone=${cellphone}`,
        补发货: `/approval/#/repair?cellphone=${cellphone}`,
        调班: `/approval/#/approvalCenter/adjust?adjustType=3&cellphone=${cellphone}`,
        调级: `/approval/#/approvalCenter/adjust?adjustType=2&cellphone=${cellphone}`,
        调期: `/approval/#/approvalCenter/adjust?adjustType=1&cellphone=${cellphone}`
      }
      location.href = obj[commandlk]
    },
    // 修改地址子组件传来的数据
    modifyAddressExpress() {
      this.dialogTableVisible = false
      this.reqUser()
      this.reqUser_add()
    }
  }
}
</script>
<style lang="scss" scoped>
.details-body {
  width: 100%;
  height: calc(100vh - 90px);
  margin: 10px 10px 0px;
  font-size: 12px;
  overflow: auto;
}
//head
.header {
  background-color: #fff;
  height: 50px;
  padding-right: 10px;
}

.img-box {
  height: 40px;
  width: 40px;
  position: relative;
  .head-portrait {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
  i {
    position: absolute;
    bottom: 0px;
    right: 0px;
    display: block;
    width: 15px;
    height: 15px;
    line-height: 15px;
    border-radius: 100%;
    overflow: hidden;
    color: #fff;
    text-align: center;
  }
  .male {
    background-color: #369bff;
  }
  .female {
    background-color: #f23589;
  }
}
.lk-icon {
  width: 20px;
  height: 20px;
  overflow: hidden;
  color: #bfbfbf;
  fill: currentColor;
}
.lk-icon-green {
  width: 20px;
  height: 20px;
  overflow: hidden;
  color: #42b983;
  fill: currentColor;
}
.upset_24col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  &.flex-end {
    padding-right: 10px;
    justify-content: flex-end;
  }
  > div {
    margin: 0 10px;
  }
}
.upset_24col_space_between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-elment-lk {
  vertical-align: middle;
  font-size: 20px;
  color: #ccc;
}

// belly
.belly {
  margin: 10px 0;
}

.dular {
  // overflow: auto;
  height: 420px;
  background-color: #fff;
  // padding: 10px;
  ::v-deep {
    .el-row {
      line-height: 24px;
    }
    .el-col {
      > span:first-child {
        display: inline-block;
        width: 65px;
        color: #aeaeae;
      }
    }
  }
}
.dular:nth-last-of-type(1) {
  margin-left: 10px;
}
.padding-top20 {
  padding-top: 20px;
}
.padding-top20:nth-of-type(1) {
  padding-top: 10px;
}
.setou123 {
  padding: 10px 15px;
  span {
    vertical-align: middle;
    font-size: 14px;
  }
  strong {
    vertical-align: middle;
    background-color: #49a3ff;
    display: inline-block;
    margin-right: 5px;
    width: 2px;
    height: 14px;
    // transform: rotate(90deg);
  }
}
.el-divider {
  margin: 8px 0px;
}
/deep/ .el-divider__text {
  color: #30313359;
}

.head-portrait_small {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.colorposition {
  color: #49a3ff;
}
.textonline {
  color: #2a75ed;
  text-decoration: underline;
}
.tccc {
  color: #ccc;
}
.gengbo {
  padding: 0px 16px;
  font-size: 14px;
  color: #ccc;
}
</style>

<style lang="scss" scoped>
// 老物件
/deep/.el-tabs__content {
  padding: 8px;
}

// 课程tab+统计
.course-sty {
  background-color: #fff;
  .statistical {
    div {
      float: left;
      span {
        color: #aeaeae;
      }
    }
  }
  .class-statistical {
    margin: 0 15px 0 0;
    float: left;
    margin: 0 0 0 25px;
    .tatistical-span {
      color: #5ea0f5;
    }
  }
}
</style>
