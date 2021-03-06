<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-12-09 15:49:39
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-12-20 10:59:24
-->
<template>
  <div class="drawer">
    <div class="drawer-con">
      <div class="con-tit">
        <span class="tit-f">家长投诉</span>
        <el-tag type="danger" style="margin: 0 10px">{{
          status[drawerData.cpStatus]
        }}</el-tag>
        <!-- <el-button
          type="danger"
          disabled
          plain
          size="mini"
          style="margin: 0 10px"
          ></el-button
        > -->
        <span class="tit-s">投诉时间: {{ deadLine(drawerData.ctime) }}</span>
      </div>
      <p class="time-line">
        <span>剩余处理时效：</span>
        <!-- <span class="time-dead">{{ `${TimeDeadLine(drawerData.ctime)}` }}</span> -->
        <span class="time-dead">{{ deadLine(auth_time, 1) }}</span>
      </p>
      <p>
        <span>学生ID：</span>
        <span>{{ drawerData.userId }}</span>
      </p>
      <p>
        <span>投诉单号：</span>
        <span>{{ drawerData.complaintNo }}</span>
      </p>
      <p>
        <span>当前处理负责人：</span>
        <span>{{ drawerData.currentStaffName }}</span>
      </p>
      <div class="complain-list">
        <span>投诉内容：</span>
        <div class="list-com">{{ drawerData.cpComment }}</div>
        <div class="img-list" v-if="imgUrlArray && imgUrlArray.length >= 1">
          <div
            class="demo-image__preview"
            v-for="item in imgUrlArray"
            :key="item"
          >
            <!-- <div class="demo-image__preview"> -->
            <el-image
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="[item]"
            >
            </el-image>
          </div>
        </div>

        <div>
          <p class="list-til">
            <span>解决记录: </span>
            <el-tag type="success"
              >投诉专员 {{ drawerData.currentStaffName }}</el-tag
            >
            <!-- <span class="til-name"
              ></span
            > -->
          </p>
          <div class="list-main">
            <div
              class="list-item"
              v-for="item in drawerData.recordList"
              :key="item.id"
            >
              <p>
                <span style="color:rgb(23, 144, 255);"
                  >{{ handler[+item.handleRole] }} - {{ item.staffName }}
                </span>
                <span>{{ handleType[+item.handleOperateType] }} </span>
                <span>{{ deadLine(item.ctime) }}</span>
              </p>
              <p class="list-comment">
                {{ item.handleComent }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="drawer-form"
      v-if="drawerData.cpStatus && drawerData.cpStatus !== 7"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="处理信息:">
          <el-input
            style="width:95%"
            type="textarea"
            v-model="form.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-radio-group v-model="form.status">
            <el-radio label="2">处理中</el-radio>
            <el-radio label="3">处理完成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="沟通渠道">
          <el-radio-group v-model="form.type">
            <el-radio label="TEL">坐席</el-radio>
            <el-radio label="MOBILE">手机</el-radio>
            <el-radio label="WX">微信</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="btn-con">
        <el-button class="btn-sub" type="primary" @click="onSubmit"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { MillisecondToDate } from '@/utils/index'
export default {
  props: {
    drawerData: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  data() {
    return {
      status: { 1: '待处理', 2: '处理中', 3: '待回访', 7: '已解决' },
      handleType: [
        '',
        '介入',
        '处理',
        '关闭',
        '无效',
        '修改操作人',
        '设为待处理',
        '回访登记',
        '修改优先级',
        '转教务'
      ],
      handler: [
        '',
        '普通用户',
        '投诉专员',
        '投诉组长',
        '投诉主管',
        '投诉经理',
        '投诉总监',
        '技术人员',
        '客服人员'
      ],
      form: {
        desc: '',
        status: '2',
        type: 'TEL'
      },
      auth_time: 0,
      timer: null,
      imgUrlArray: []
    }
  },

  computed: {
    // imgUrlArray: () => {
    //   if (!this.drawerData || !this.drawerData.fileUrl) return
    //   return this.drawerData.fileUrl.split(',')
    // }
  },
  watch: {},
  methods: {
    onSubmit() {
      const { desc, status, type } = this.form
      const { realName, mobile, id } = JSON.parse(
        localStorage.getItem('staff')
      )
      const parmes = {
        cpStatus: status,
        complaintNo: this.drawerData.complaintNo || '',
        currentStaffId: id || '',
        currentStaffName: realName || '',
        currentStaffMobile: mobile || '',
        uid: this.drawerData.userId || '',
        contactType: type,
        handleComment: desc,
        // subject:""
        systemType: 'TOSS'
      }
      // const data = {
      //   desc
      // }
      return this.$http.Complaint.goComplaintDeal(parmes)
        .then((res) => {
          if (res && res.code === 0) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.$emit('closeDra')
          } else {
          }
        })
        .catch(() => {
          // loading.close()
        })
    },
    // 倒计时
    TimeDeadLine(val) {
      this.auth_time = this.auth_time - 1000
    },
    //
    getTime(val) {
      return val
    },
    // 时间转换
    deadLine(val, key) {
      if (key) {
        return MillisecondToDate(val)
      } else {
        return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  created() {},
  mounted() {
    //  const that = this
    this.auth_time =
      24 * 60 * 60 * 1000 -
      (dayjs().valueOf() - dayjs(this.drawerData.ctime).valueOf())
    this.timer = setInterval(() => {
      this.TimeDeadLine()
    }, 1000)
    this.imgUrlArray =
      (this.drawerData.fileUrl && this.drawerData.fileUrl.split(',')) || []
    console.log(this.imgUrlArray, this.imgUrlArray.length)
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss" scoped>
.drawer {
  margin-left: 10px;
  height: 100vh;
  overflow: auto;
}
.drawer-con {
  .con-tit {
    height: 50px;
    width: 100%;
    background: #fdf8f8;
    padding: 10px 0 0 20px;
    margin-bottom: 10px;
    .tit-btn {
      width: 30px;
      height: 18px;
      margin: 0 50px 0 10px;
    }
    .tit-f {
      font-weight: bold;
    }
    .tit-s {
      //  display: inline-block;
      float: right;
      margin-right: 5px;
      line-height: 31px;
      font-weight: bold;
    }
  }
  p {
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .time-line {
    font-size: 14px;
    font-weight: bold;
    .time-dead {
      color: red;
    }
  }
  .complain-list {
    margin-left: 10px;
    .list-com {
      margin: 10px 0 10px 60px;
      font-size: 12px;
    }
    .list-til {
      font-size: 12px;
      .til-name {
        display: inline-block;
        text-align: center;
        width: 120px;
        height: 20px;
        line-height: 20px;
        background: #ebf3ea;
        color: green;
      }
    }
    .list-main {
      max-height: 300px;
      overflow-y: auto;
      overflow-x: hidden;
      .list-item {
        .list-comment {
          width: 95%;
          min-height: 50px;
          background: #fdf8f8;
          padding: 10px;
        }
      }
    }
  }
}
.drawer-form {
  margin-top: 10px;
}
.btn-con {
  width: 100%;
  text-align: center;
}
.img-list {
  display: flex;
}
.demo-image__preview {
  margin-right: 10px;
}
</style>
