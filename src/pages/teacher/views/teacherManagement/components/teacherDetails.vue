<template>
  <div>
    <el-drawer
      custom-class="details-style"
      :visible.sync="drawer"
      :with-header="false"
      :modal="false"
      size="60%"
    >
      <!-- 头部信息 -->
      <div class="top-content">
        <el-row>
          <el-col :span="20">
            <div class="title-information">
              <div class="head-Portrait">
                <img :src="headImage" />
              </div>
              <div class="information-right">
                <div class="name">{{ realName }}</div>
                <div class="gender">{{ sex === 0 ? '男' : '女' }}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" class="editor-btn" @click="editorBtn()"
              >编辑</el-button
            >
          </el-col>
          <el-col :span="1">
            <i class="el-icon-close" @click="shutDown"></i>
          </el-col>
        </el-row>
      </div>
      <!-- 详细信息 -->
      <div class="details-content">
        <el-row>
          <el-col :span="8">
            手机号:<span>{{ phone }}</span>
          </el-col>
          <el-col :span="8">
            对外昵称:<span>{{ nickname }}</span>
          </el-col>
          <el-col :span="8">
            入职时间:<span>{{ joinDate }} </span>
          </el-col>
          <el-col :span="8">
            所属部门:<span>
              {{ departmentData ? departmentData.pname : '-' }}/{{
                department.name || '-'
              }}
            </span>
          </el-col>
          <el-col :span="8">
            职务:<span>{{
              positionVal.length !== 0 ? positionVal[0].name : '-'
            }}</span>
          </el-col>
          <el-col :span="8">
            下组时间:<span>{{ leaveTrain }} </span></el-col
          >
          <el-col :span="8">
            职级:<span>{{ rank ? rank.name : '-' }} </span></el-col
          >
          <!-- <el-col :span="8">课程级别:{{ shiftLevel }}</el-col> -->
          <el-col :span="8">
            在职状态:<span>{{ status === 'TENURE' ? '在职' : '离职' }}</span>
          </el-col>
          <el-col :span="8" v-if="status === 'LEAVE'">
            离职时间:<span>{{ leaveDate }}</span>
          </el-col>
          <el-col :span="8">
            账号设置:<span>{{ isLogin === 'YES' ? '允许' : '禁止' }}</span>
          </el-col>
          <!-- <el-col :span="8">分配微信号:{{ weChat }}</el-col> -->
          <!-- <el-col :span="8">3</el-col> -->
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { formatData } from '@/utils/index'
export default {
  props: {
    teacherID: String,
    subDepartment: Object
  },
  data() {
    return {
      // 抽屉隐藏
      drawer: false,
      // 头像
      headImage: '',
      Image: require('../../../../../assets/images/bear.png'),
      // 真实姓名
      realName: '',
      // 性别
      sex: '',
      // 手机号
      phone: '',
      // 对外昵称
      nickname: '',
      // 入职时间
      joinDate: '',
      // 所属部门
      department: {},
      departmentData: {},
      // 职务
      positionVal: [],
      // 下组时间
      leaveTrain: '',
      // 职级
      rank: '',
      // 课程级别
      shiftLevel: '',
      // 在职状态
      status: '',
      // 离职时间
      leaveDate: '',
      // 账号设置
      isLogin: '',
      // 微信号
      weChat: ''
    }
  },
  watch: {
    teacherID(val) {
      if (val) {
        this.createdUrl(val)
      }
    },
    subDepartment(val) {
      this.departmentData = val
    }
  },
  methods: {
    createdUrl(val) {
      this.$http.Teacher.getTeacherDetail(val).then((res) => {
        const payload = res.payload
        this.headImage = payload.teacher.headImage
          ? payload.teacher.headImage
          : this.Image
        this.realName = payload.teacher.realName
        this.sex = payload.teacher.sex
        this.phone = payload.teacher.phone
        this.nickname = payload.teacher.nickname
        this.joinDate = payload.teacher.joinDate
          ? formatData(new Date(payload.teacher.joinDate).getTime(), 'd')
          : '-'
        this.department = payload.department ? payload.department : ''
        this.positionVal = payload.duty ? payload.duty : ''
        this.leaveTrain = payload.teacher.leaveTrain
          ? formatData(new Date(payload.teacher.leaveTrain).getTime(), 'd')
          : '-'
        this.rank = payload.rank
        this.status = payload.teacher.status
        this.leaveDate = payload.teacher.leaveDate
          ? formatData(new Date(payload.teacher.leaveDate).getTime(), 'd')
          : '-'
        this.isLogin = payload.teacher.isLogin
      })
    },
    // 关闭按钮
    shutDown() {
      this.drawer = false
    },
    // 编辑按钮
    editorBtn() {
      this.$router.push({
        path: '/newTeacher',
        query: { index: '1', teacherId: this.teacherID }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.details-style {
  position: absolute;
  margin: 60px 10px 0 0;
  height: calc(100vh - 60px - 10px) !important;
  box-shadow: 0 6px 30px 5px rgba(131, 68, 68, 0.12);
  // 头部样式
  .top-content {
    .el-row {
      margin: 20px 20px 0px 20px;
      height: 100px;
      border-bottom: 1px solid #ebeef5;
      // border: 1px solid red;
      .el-col {
        height: 100%;
        // border: 1px solid red;
      }
      .el-col-20 {
        display: flex;
        align-items: center;
        .title-information {
          width: 17%;
          height: 80%;
          // border: 1px solid red;
          .head-Portrait {
            height: 100%;
            width: 50%;
            border: 1px solid #ebeef5;
            float: left;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .information-right {
            width: 50%;
            height: 100%;
            float: left;
            // border: 1px solid red;
            div {
              height: 50%;
              text-align: center;
              padding: 9% 0 9% 0;
            }
          }
        }
      }
      // 编辑按钮
      .editor-btn {
        // border: 1px solid red;
        float: right;
      }
      // 关闭
      .el-icon-close {
        float: right;
        cursor: pointer;
      }
    }
  }
  // 详情样式
  .details-content {
    .el-row {
      height: 200px;
      margin: 20px 20px 0 20px;
      // border: 1px solid red;
      .el-col {
        // text-align: center;
        height: 25%;
        color: #606266;
        // border: 1px solid red;
        span {
          color: #409eff;
        }
      }
    }
  }
}
</style>
