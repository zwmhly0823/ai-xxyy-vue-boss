<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-31 12:13:35
 -->
<template>
  <div>
    <el-dropdown trigger="click">
      <span class="el-dropdown-link"> 筛选<i class="el-icon--right"></i> </span>
      <el-dropdown-menu class="check-menu" slot="dropdown">
        <h2>学员筛选</h2>
        <h3>状态</h3>
        <el-checkbox-group
          class="check-states-box"
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            class="check-states"
            v-for="state in states"
            :label="state"
            :key="state"
            >{{ state }}</el-checkbox
          >
        </el-checkbox-group>
        <h3>加好友</h3>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="friend in friends"
            :label="friend"
            :key="friend"
            >{{ friend }}</el-checkbox
          >
        </el-checkbox-group>
        <h3>进微信群</h3>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox v-for="group in groups" :label="group" :key="group">{{
            group
          }}</el-checkbox>
        </el-checkbox-group>
        <div class="check-button">
          <el-button size="small">清空</el-button>
          <el-button size="medium" type="primary">过滤</el-button>
          <el-button @click="cancel" size="medium" type="primary"
            >取消</el-button
          >
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  name: 'MCheckBox',
  props: {},
  components: {},
  data() {
    return {
      visible: false,
      checkedCities: [],
      states: [
        '已注册',
        '已体验课',
        '已半年课',
        '半年课完课',
        '已年课',
        '年课完课',
        '年课续费'
      ],
      friends: ['已加好友', '未加好友'],
      groups: ['已进微信群', '未进微信群']
    }
  },
  mounted() {},
  watch: {},
  created() {},
  methods: {
    handleCheckedCitiesChange(value) {
      console.log(value)
    },
    // 点击取消
    cancel() {
      this.checkedCities = []
    }
  }
}
</script>
<style lang="scss" scoped>
.check-states-box {
  .check-states {
    &:nth-child(2) {
      margin-left: 14px;
    }
    &:nth-child(6) {
      margin-left: 14px;
    }
  }
}
.check-menu {
  width: 260px;
  padding: 10px;
}
.check-button {
  margin-top: 20px;
}
</style>
