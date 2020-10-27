<!--
 * @Descripttion: 左侧班级项
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-31 21:58:19
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-12 16:13:33
-->
<template>
  <div
    class="team-item"
    :class="{ active: currentTeamId === team.id }"
    @click="handleSelectTeam(team)"
  >
    <div class="team-item-title d-flex align-center justify-between">
      <h4>{{ team.team_name }}</h4>
      <span>转化{{ team.order_conversion_rate || 0 }}%</span>
    </div>
    <!-- boday -->
    <div class="team-item-body">
      <div class="team-item-body-container d-flex wrap align-start">
        <!-- slot -->
        <slot name="body"></slot>
      </div>
      <!-- 老师名字+战队 -->
      <div class="team-item-body-info text-gray">
        {{ team.teacher_realname }}-{{ team.department_name }}
      </div>
    </div>
    <!-- footer -->
    <div class="team-item-footer text-gray">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 班级信息
    team: {
      type: Object,
      default: () => {}
    },
    // 当前选中班级ID
    currentTeamId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    // 选择班级
    handleSelectTeam(team) {
      this.$emit('current', team.id)
    }
  }
}
</script>

<style lang="scss" scoped>
$color-gray: #606266;
$color-ligght-gray: #b9b9b9;
$mainColor: rgb(42, 117, 237);
.team-item {
  margin-right: 10px;
  margin-bottom: 15px;
  font-size: 12px;
  color: $color-gray;
  border-radius: 4px;
  border: 1px solid #ddd;
  overflow: hidden;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  // 选中状态
  &.active {
    border-color: $mainColor;
    box-shadow: 2px 2px 6px rgba(42, 117, 237, 0.3);
    .team-item-title {
      background-color: $mainColor;
    }
  }
  &-title {
    padding: 5px 10px;
    background-color: $color-ligght-gray;
    color: #fff;
    h4 {
      font-size: 14px;
      margin: 0;
      font-weight: 500;
    }
  }
  &-body {
    padding: 20px 10px 10px;
    &-container {
      // 对 slot一级div做处理
      > * {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        width: 100%;
      }
    }
    &-data {
      min-width: 25%;
      margin-bottom: 10px;
      &.count-3 {
        width: 33.33%;
      }
      p,
      h6 {
        text-align: center;
      }
      p {
        transform: scale(0.8);
        margin-bottom: 2px !important;
      }
    }
    &-info {
      margin-top: 10px;
    }
  }
  &-footer {
    > * {
      margin: 0 10px;
      padding: 10px 0;
      border-top: 1px solid $color-ligght-gray;
    }
  }

  p,
  h4,
  h6 {
    margin: 0;
  }

  .text-gray {
    color: $color-ligght-gray;
  }
}
</style>
