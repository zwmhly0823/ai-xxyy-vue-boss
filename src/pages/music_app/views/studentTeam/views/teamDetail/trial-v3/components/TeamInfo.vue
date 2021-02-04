<template>
  <header class="team-info" :class="opened ? 'opened' : ''">
    <div class="team-info-bar d-flex justify-between align-center">
      <div class="d-flex align-center" v-if="teamInfo">
        <div class="team-info-bar_tag">班</div>
        <h3 @click="handleToggle">
          {{ teamInfo.team_name }}
          <i :class="`el-icon-caret-${opened ? 'top' : 'bottom'}`"></i>
        </h3>
        <p class="danger">{{ teamInfo.system_order_count || 0 }}笔首单</p>
        <p class="danger">{{ teamInfo.order_conversion_rate || 0 }}%转化率</p>
      </div>
      <el-button type="danger" size="mini" v-if="teamInfo">{{
        teamState[teamInfo.team_state]
      }}</el-button>
    </div>
    <!-- 详细信息 -->
    <div class="team-info-toggle" v-if="teamInfo">
      <ul class="d-flex">
        <li>
          <p><span>班级ID</span>{{ teamInfo.id }}</p>
          <p><span>班级人数</span>{{ teamInfo.student_count }}</p>
        </li>
        <li>
          <p><span>创建日期</span>{{ teamInfo.ctime_text }}</p>
          <p><span>接生微信</span>{{ teamInfo.teacher_wechat_no }}</p>
        </li>
        <li>
          <p><span>结课日期</span>{{ teamInfo.end_course_day_text }}</p>
          <p><span>开课日期</span>{{ teamInfo.course_day_text }}</p>
        </li>
        <li>
          <p><span>销售老师</span>{{ teamInfo.teacher_realname }}</p>
          <p><span>组织结构</span>{{ teamInfo.department_name }}</p>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import { formatData } from '@/utils'
import { TEAM_STATE } from '@/utils/enums'
export default {
  props: {
    team: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      opened: false,
      teamState: TEAM_STATE
    }
  },
  computed: {
    teamInfo() {
      // console.log(this.team, 'team.....')

      return {
        ...this.team,
        course_day_text: formatData(+this.team.course_day),
        end_course_day_text: formatData(+this.team.end_course_day),
        ctime_text: formatData(+this.team.ctime)
      }
    }
  },
  methods: {
    handleToggle() {
      this.opened = !this.opened
    }
  }
}
</script>

<style lang="scss" scoped>
$dangerColor: #f56c6c;
$mainColor: #2a75ed;
$grayColor: #f0f1f2;

.danger {
  color: $dangerColor;
}
// 班级信息
.team-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  &.opened {
    .team-info-toggle {
      transform: translateY(0);
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    }
  }
  &-bar {
    position: relative;
    padding: 5px 20px;
    background-color: #2c3f5d;
    color: #fff;
    z-index: 10;
    &_tag {
      padding: 3px 4px;
      background-color: #fff;
      border-radius: 4px;
      color: $mainColor;
      font-weight: 500;
    }
    h3 {
      margin: 0 0 0 10px;
      cursor: pointer;
    }
    p {
      margin: 0 10px;
    }
  }
  &-toggle {
    position: relative;
    padding-left: 20px;
    transition: transform 0.2s;
    transform: translateY(-100%);
    background-color: $grayColor;
    font-size: 12px;
    z-index: 9;
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      li {
        margin-right: 50px;
        font-weight: 500;
        span {
          display: inline-block;
          min-width: 65px;
          font-weight: normal;
          color: #666;
        }
        p {
          margin: 12px 0;
        }
      }
    }
  }
}
</style>
