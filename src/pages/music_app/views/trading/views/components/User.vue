<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-07-08 13:40:39
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-08 15:11:44
-->
<!-- 用户信息 -->
<template>
  <section>
    <p v-if="!user">-</p>
    <div v-else class="primary-text">
      <p @click="openUserDetail(user.id, user)">
        {{ user.username || '-' }}
        {{
          user.birthday
            ? user.birthday !== '0'
              ? getAgeByBrithday(user.birthday)
              : ''
            : ''
        }}
      </p>
      <p>
        <span @click="openUserDetail(user.id, user)">
          {{user && user.mobile || '-' }}
        </span>
        <i
          style="margin-left: 10px"
          class="el-icon-view mg-l-5"
          @click="getNumber(user.id)"
        ></i>
      </p>
    </div>
  </section>
</template>
<script>
import { GetAgeByBrithday, openBrowserTab } from '@/utils/index'
export default {
  props: {
    courseType: {
      type: String,
      default: '',
    },
    user: {
      type: Object,
      default: () => ({}),
    },
    singleData: {
      type: Object,
      default: () => ({}),
    },
    flag: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.operatorId = JSON.parse(localStorage.getItem('staff')).id
  },
  data() {
    return {
      operatorId: '',
    }
  },
  methods: {
    //获取学生号码
    getNumber(uid) {
      this.$http.User.getUserPhoneNumber({
        uid: uid,
        teacherId: this.operatorId,
      }).then((res) => {
        if (res.code == 0) {
          this.user.mobile = res.payload.mobile
        } else {
          this.$message.error('网络异常，请稍后再试！')
        }
      })
    },
    getAgeByBrithday(birthday) {
      return '- ' + GetAgeByBrithday(birthday)
    },
    // 打开用户详情
    openUserDetail(uid, row) {
      if (this.flag) {
        return false
      }
      let str = this.courseType == 'system' ? 'details' : 'teamTrialDetail'

      if (Object.keys(this.singleData).length) {
        uid &&
          openBrowserTab(
            `/music_app/#/details/${uid}?isrefund=${this.singleData.isrefund}`
          )
      } else {
        uid && openBrowserTab(`/music_app/#/details/${uid}`)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
