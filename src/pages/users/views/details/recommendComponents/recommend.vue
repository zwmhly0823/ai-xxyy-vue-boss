<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-22 10:31:00
 * @LastEditors: liukun
 * @LastEditTime: 2020-09-15 23:02:21
-->
<template>
  <el-dialog title="推荐信息" :visible.sync="recommendInfo" width="40%">
    <div class="recommend-dialog">
      <el-row type="flex" justify="start" align="middle" class="marginb10">
        <el-col :span="5">推荐人:</el-col>
        <el-col :span="18" :offset="1"
          ><el-link
            :href="`/users/#/details/${recommendHuman.id}`"
            target="_blank"
            type="primary"
          >
            {{
              (recommendHuman.username || '-') +
                '-' +
                (recommendHuman.user_num || '-')
            }}</el-link
          ></el-col
        >
      </el-row>
      <el-row type="flex" justify="start" align="middle" class="marginb10">
        <el-col :span="5">推荐了:</el-col>
        <el-col
          :span="18"
          :offset="1"
          class="recommendDone"
          v-if="recommendList.length"
        >
          <span v-for="(item, index) of recommendList" :key="index"
            ><el-link
              :href="`/users/#/details/${item.id}`"
              target="_blank"
              type="primary"
            >
              {{
                (item.username || '-') + '-' + (item.user_num || '-')
              }}</el-link
            ></span
          >
        </el-col>
        <el-col :span="18" :offset="1" class="recommendDone" v-else> - </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'recommend',
  props: {
    // 他的上线
    recommendHuman: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      recommendInfo: false,
      recommendList: []
    }
  },
  methods: {
    async getRecommendList() {
      // 他的下线
      const {
        data: { UserExtendsList }
      } = await this.$http.User.getRecommendList({
        send_id: this.$route.params.id,
        subject: this.$store.state.subjects.subjectCode
      }).catch((err) => {
        console.error(err)
        this.$message.error('该学员推荐下线获取失败')
      })
      if (UserExtendsList.length) {
        this.recommendList = UserExtendsList
      }
      // else {
      //   this.$message.warning('加油,该学员没有下线')
      // }
    }
  },
  mounted() {
    this.getRecommendList()
  }
}
</script>

<style lang="scss" scoped>
.recommend-dialog {
  font-size: 14px;
}
.marginb10 {
  margin-bottom: 10px;
  font-size: 14px;
}
.marginb10:nth-last-of-type(1) {
  margin-bottom: 0px;
}
.marginb10 .el-col-5 {
  text-align: right;
}
.recommendDone {
  max-height: 80px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: space-between;
  span {
    padding-right: 20px;
  }
}
</style>
