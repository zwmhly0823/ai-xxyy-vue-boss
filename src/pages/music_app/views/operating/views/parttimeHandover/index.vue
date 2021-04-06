<template>
  <!-- 页面样式按照班级交接和微信交接来 -->
  <div class="part-teacher-c" v-loading="loading">
    <div class="container">
      <!-- 交出方 -->
      <div class="container-left module">
        <h2>交出方</h2>
        <div class="module-search" v-show="showHandler">
          <Department
            name="pay_teacher_id"
            placeholder="兼职部门"
            :multiple="false"
            isParttimeTeacher
            @result="handoverSelectDepartment"
          />
          <GroupSell
            tip="请选择老师"
            :teacherscope="handoverTeacherScope"
            return-list
            @result="handoverSelectTeacher"
            name="pay_teacher_id"
            class="margin_l10"
          />
          <div class="module-search-tip">请先选择部门和老师哦～</div>
        </div>
        <div class="to-choose-container" v-show="!showHandler">
          <h3>{{ showTeacherName }}</h3>
          <p class="class-in">{{ showTeamName }}</p>
          <p class="class-in">【id】 {{ showTeacherID }}</p>
          <el-button type="text" @click="handoverToChoose">重新选择</el-button>
        </div>
      </div>
      <svg class="iconjiantou-you" aria-hidden="true">
        <use xlink:href="#iconjiantou-you"></use>
      </svg>

      <!-- 选择学员 -->
      <div class="container-middle module">
        <h2>选择班级</h2>
        <template v-if="showHandler">
          <div class="empty-mask">
            <p>暂无数据</p>
          </div>
        </template>
        <template v-else>
        <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="checkAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group v-model="checkList" @change="checkedChange">
            <el-checkbox
              class="checkbox-item"
              v-for="(item, key) in stuList"
              :key="key"
              :label="item"
            >
              <!-- <span class="checkbox-text">{{ item.username }}</span>
              <span class="checkbox-text">{{ item.mobile }}</span> -->
              <span class="checkbox-text">{{ item.teamInfo.team_name }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </template>
      </div>
      <svg class="iconjiantou-you" aria-hidden="true">
        <use xlink:href="#iconjiantou-you"></use>
      </svg>

      <!-- 接收方 -->
      <div class="container-right module">
        <h2>接收方</h2>

        <!-- receiveType -->
        <div class="receive-type">
          <p>
            <el-radio v-model="receiveType" label="1">交还班主任点评</el-radio>
          </p>
          <p>
            <el-radio v-model="receiveType" label="2">移交兼职老师</el-radio>
          </p>
        </div>
        <div v-if="receiveType === '2'">
          <div class="module-search" v-show="showReceive">
            <Department
              name="pay_teacher_id"
              placeholder="兼职部门"
              :multiple="false"
              isParttimeTeacher
              @result="receiveSelectDepartment"
            />
            <GroupSell
              tip="请选择老师"
              :teacherscope="receiveTeacherScope"
              return-list
              @result="receiveSelectTeacher"
              name="pay_teacher_id"
              class="margin_l10"
            />
            <div class="module-search-tip">请先选择部门和老师哦～</div>
          </div>

          <div class="to-choose-container" v-show="!showReceive">
            <h3>{{ receiveTeacherName }}</h3>
            <p class="class-in">{{ receiveTeamName }}</p>
            <p class="class-in">{{ receiveTeacherID }}</p>
            <el-button type="text" @click="receiveToChoose">重新选择</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-text" v-show="!showHandler">
      目标交接班级数
      <span class="prominent"> {{ listData.length }}</span>
      个， 实际接收班级数
      <span class="prominent">{{ checkList.length }} </span>
      个
    </div>
    <!-- <div class="class-button" v-show="!showReceive"> -->
    <div
      class="class-button"
      v-show="receiveType === '1' || (receiveType === '2' && !showReceive)"
    >
      <el-button type="primary" @click="dispatchStart">开始交接</el-button>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { formatTeamNameSup } from '@/utils/supList'
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
// import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername.vue'
export default {
  name: 'partTeacher',
  components: {
    Department,
    GroupSell
    // SearchPhoneAndUsername
  },
  data() {
    return {
      loading: false,
      showHandler: true,
      handoverTeacherScope: null,
      showTeacherName: '',
      showTeamName: '',
      showTeacherID: '',
      showReceive: true,
      receiveTeacherScope: null,
      receiveTeacherName: '',
      receiveTeamName: '',
      receiveTeacherID:null,
      termValue: '',
      termOptions: [],
      stuList: '',
      listData: '',
      checkList: [],
      isIndeterminate: false,
      checkAll: false,
      phoneOptions: [],
      phoneValue: '',
      receiveType: ''
    }
  },
  watch: {
    receiveType(val, oldVal) {
      if (val !== oldVal && val) {
        this.receiveToChoose()
      }
    }
  },
  methods: {
    // 交出方选择部门
    handoverSelectDepartment(res) {
      console.log(res)
      this.handoverTeacherScope =
        res.pay_teacher_id.length !== 0 ? res.pay_teacher_id : null
    },
    // 交出方选择老师
    async handoverSelectTeacher(res) {
      if (!res) {
        return
      }
      if (res.teacherList) {
        for (const item of res.teacherList) {
          if (item.id === res.pay_teacher_id) {
            this.showTeacherName = item.realname
            this.showTeacherID = item.id
            this.showTeamName = item?.departmentInfo?.name
          }
        }
      }
      this.showHandler = false
      // 根据老师id获取班级列表
      const listRes = await this.$http.Teacher.StudentTaskDispatchConfigList("1450442949990420566")
      let list = [];
      list = listRes.data.StudentTaskDispatchConfigList
      if (!list) {
        return
      }
      if (!list?.length) {
        return
      }
     this.stuList = list.map((item) => {
        item.teamInfo.team_name = formatTeamNameSup(item.teamInfo.team_name)
        return item
      })
      console.log(this.stuList,"this.stuList");
      // copy一份listRes
      this.listData = cloneDeep(list)
      this.termOptions = []
      const termMap = new Map()
      const phoneMap = new Map()
      list.forEach((item) => {
        // 期数列表
        if (!termMap.get(item.period)) {
          termMap.set(item.period, item.periodName)
          this.termOptions.push({
            label: item.periodName,
            value: item.period
          })
        }
        // 手机号及uid
        if (!phoneMap.get(item.phone)) {
          phoneMap.set(item.userId, item.mobile)
          this.phoneOptions.push({
            label: item.mobile,
            value: item.userId
          })
        }
      })
      // 期数排序
      this.termBubbleSort()
    },
    getDispatchStudentList(teacherId) {
      return this.$http.WorkerHandover.getDispatchStudentList(teacherId)
        .then((res) => {
          return res.payload
        })
        .catch(() => {
          return false
        })
    },
    termBubbleSort() {
      let flag = true
      const len = this.termOptions.length
      for (let i = 0; i < len - 1 && flag; i++) {
        flag = false
        for (let j = len - 1; j > i; j--) {
          if (this.termOptions[j].value < this.termOptions[j - 1].value) {
            ;[this.termOptions[j], this.termOptions[j - 1]] = [
              this.termOptions[j - 1],
              this.termOptions[j]
            ]
            flag = true
          }
        }
      }
    },
    // 交出方重新选择
    handoverToChoose() {
      this.showHandler = true
      this.clearData()
    },
    // 接收方选择部门
    receiveSelectDepartment(res) {
      this.receiveTeacherScope =
        res.pay_teacher_id.length !== 0 ? res.pay_teacher_id : null
    },
    // 接收方选择老师
    receiveSelectTeacher(res) {
      if (!res) {
        return
      }
      if (res?.teacherList?.length !== 0) {
        for (const item of res.teacherList) {
          if (item.id === res.pay_teacher_id) {
            this.receiveTeacherName = item.realname
            this.receiveTeamName = item?.departmentInfo?.name
            this.receiveTeacherID = item.id
          }
        }
      }
      this.showReceive = false
    },
    // selectchange
    termSelectChange(termId) {
      // 先把选中清空
      this.isIndeterminate = false
      this.checkAll = false
      this.checkList = []
      if (!termId) {
        // 清空
        this.stuList = this.listData
      } else {
        this.stuList = this.listData.filter((item) => {
          return item.period === termId
        })
      }
    },
    // 学员手机号
    phoneSelectChange(userId) {
      // 先把选中清空
      this.isIndeterminate = false
      this.checkAll = false
      this.checkList = []
      if (!userId) {
        // 清空
        this.stuList = this.listData
      } else {
        this.stuList = this.listData.filter((item) => {
          return item.userId === userId
        })
      }
    },
    // 接收方重新选择
    receiveToChoose() {
      this.showReceive = true
    },
    // 全选
    checkAllChange(val) {
      this.isIndeterminate = false
      this.checkList = val ? this.stuList : []
    },
    checkedChange(val) {
      this.checkList = val
      this.checkAll = val.length === this.stuList.length
      this.isIndeterminate = val.length > 0 && val.length < this.stuList.length
    },
    // 开始交接
    async dispatchStart() {
      if (!this.checkList.length) {
        this.$message.error('交接数量不能为0')
        return
      }
      // 移交兼职老师
      if (this.receiveType === '2') {
        if (!this.receiveTeacherID || !this.showTeacherID) {
          this.$message.error('接收老师和交出老师都不能为空')
          return
        }
        if (this.receiveTeacherID === this.showTeacherID) {
          this.$message.error('接收老师和交出老师不能是同一人')
          return
        }
      }
      this.loading = true
      const resData = await this.dispatchAjax()
      this.loading = false
      if (resData.errors || resData.error) {
        this.$message.error(resData.errors || resData.error)
        return
      }
      if (!resData || resData?.status !== 'OK') {
        return
      }
      this.$message({
        type: 'success',
        message: '交接成功'
      })
      setTimeout(() => {
        location.reload()
      }, 1000)
    },
    dispatchAjax() {
      let userStr = ''
      this.checkList.forEach((item) => {
        userStr += `&userIdList=${item.team_id}`
      })
      const query = {
        teacherId: this.showTeacherID,
        newTeacherId:'',
        userIdList: userStr
      }
      /**
       * 移交班主任点评，不需要传 newTeacherId; 移交兼职老师时需要传 newTeacherId
       */
      debugger
      if (this.receiveType === '2') {
        Object.assign(query, {
          newTeacherId: this.receiveTeacherID?this.receiveTeacherID:''
        })
      }


      return this.$http.WorkerHandover.dispatchAjax(query)
        .then((res) => {
          return res
        })
        .catch(() => {
          return false
        })
    },
    clearData() {
      this.isIndeterminate = false
      this.checkAll = false
      this.receiveType = ''
      this.checkList = []
      this.stuList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.part-teacher-c {
  padding-top: 20px;
  padding-bottom: 50px;
  background-color: #fff;
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin: 0px auto 80px;
    .module {
      width: 300px;
      height: 400px;
      border: 1px solid rgb(203, 203, 203);
      position: relative;
      h2 {
        text-align: center;
        height: 60px;
        line-height: 60px;
        margin: 0;
        font-size: 18px;
        background: rgb(243, 246, 249);
        border-bottom: 2px solid rgb(203, 203, 203);
      }
      &-search {
        display: flex;
        justify-content: space-around;
        margin: 20px auto;
        // overflow: hidden;
        &-tip {
          text-align: center;
          margin: 100px auto;
          color: red;
          position: absolute;
        }
        &-wechart {
          width: 100%;
          /deep/ .el-select {
            width: 98%;
            margin: 0 1%;
            input {
              height: 28px;
            }
          }
        }
      }
      .to-choose-container {
        text-align: center;
        margin: 60px 0 auto;
        h3 {
          font-size: 25px;
          margin: 0 0 30px 0;
        }
        .class-in {
          font-size: 16px;
          margin: 0 0 30px 0;
        }
      }
      &-table {
        width: 98%;
        margin: 0 0 0 2%;
      }
      .handover-inform {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: -60px;
        left: 0;
        &-text {
          font-size: 15px;
          line-height: 24px;
        }
      }
      .empty-mask {
        width: 100%;
        height: calc(100% - 60px);
        display: flex;
        justify-content: center;
        align-items: center;
        p {
          color: #909399;
          font-size: 12px;
        }
      }
      /deep/ {
        .el-checkbox {
          margin-top: 10px;
          margin-left: 2%;
          .el-checkbox__label {
            color: #000;
          }
        }
        .el-checkbox-group {
          max-width: 100%;
          overflow: auto;
        }
      }
      .checkbox-item {
        display: block;
        margin-bottom: 5px;
        .checkbox-text {
          font-weight: normal;
          margin-right: 10px;
          color: #000;
        }
      }
      .term-select-class {
        margin: 2%;
        width: 96%;
      }
    }
    .iconjiantou-you {
      width: 60px;
      height: 60px;
      fill: rgb(0, 123, 199);
    }
    .prominent {
      color: red;
    }
    .container-middle {
      display: flex;
      flex-direction: column;
    }
  }
  .bottom-text {
    text-align: center;
    font-size: 15px;
    line-height: 24px;
    .prominent {
      color: red;
    }
  }
  .class-button {
    text-align: center;
    margin-top: 50px;
  }
  .receive-type {
    margin: 20px 10px;
    p {
      margin: 10px 0 0;
    }
  }
}
</style>
