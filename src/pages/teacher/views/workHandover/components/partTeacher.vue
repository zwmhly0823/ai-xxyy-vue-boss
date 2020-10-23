<template>
  <!-- 页面样式按照班级交接和微信交接来 -->
  <div class="part-teacher-c" v-loading="loading">
    <div class="container">
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
          <p class="class-in">{{ showTeacherID }}</p>
          <el-button type="text" @click="handoverToChoose">重新选择</el-button>
        </div>
      </div>
      <svg class="iconjiantou-you" aria-hidden="true">
        <use xlink:href="#iconjiantou-you"></use>
      </svg>
      <div class="container-middle module">
        <h2>选择学员</h2>
        <template v-if="showHandler">
          <div class="empty-mask">
            <p>暂无数据</p>
          </div>
        </template>
        <template v-else>
          <el-select
            class="term-select-class"
            v-model="termValue"
            placeholder="请选择"
            size="mini"
            clearable
            @change="termSelectChange"
          >
            <el-option
              v-for="item in termOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
              <span class="checkbox-text">{{ item.username }}</span>
              <span class="checkbox-text">{{ item.mobile }}</span>
              <span class="checkbox-text">{{ item.teamName }}</span>
            </el-checkbox>
          </el-checkbox-group>
          <!-- <div class="handover-inform">
            <div class="handover-inform-text">
              目标交接学员数
              <span class="prominent"> {{ listData.length }}</span>
              个， 实际接收学员数
              <span class="prominent">{{ checkList.length }} </span>
              个
            </div>
          </div> -->
        </template>
      </div>
      <svg class="iconjiantou-you" aria-hidden="true">
        <use xlink:href="#iconjiantou-you"></use>
      </svg>
      <div class="container-right module">
        <h2>接收方</h2>

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
    <div class="bottom-text" v-show="!showHandler">
      目标交接学员数
      <span class="prominent"> {{ listData.length }}</span>
      个， 实际接收学员数
      <span class="prominent">{{ checkList.length }} </span>
      个
    </div>
    <div class="class-button" v-show="!showReceive">
      <el-button type="primary" @click="dispatchStart">开始交接</el-button>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
export default {
  name: 'partTeacher',
  components: {
    Department,
    GroupSell
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
      receiveTeacherID: '',
      termValue: '',
      termOptions: [],
      stuList: '',
      listData: '',
      checkList: [],
      isIndeterminate: false,
      checkAll: false
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
      // 根据老师id获取学员列表
      const listRes = await this.getDispatchStudentList(res.pay_teacher_id)
      if (!listRes) {
        return
      }
      if (!listRes?.length) {
        return
      }
      this.stuList = listRes
      // copy一份listRes
      this.listData = cloneDeep(listRes)
      this.termOptions = []
      const termMap = new Map()
      listRes.forEach((item) => {
        // 期数列表
        if (!termMap.get(item.period)) {
          termMap.set(item.period, item.periodName)
          this.termOptions.push({
            label: item.periodName,
            value: item.period
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
      if (!this.receiveTeacherID || !this.showTeacherID) {
        this.$message.error('接收老师和交出老师都不能为空')
        return
      }
      if (this.receiveTeacherID === this.showTeacherID) {
        this.$message.error('接收老师和交出老师不能是同一人')
        return
      }
      if (!this.checkList.length) {
        this.$message.error('交接数量不能为0')
        return
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
        userStr += `&userIdList=${item.userId}`
      })
      const query = {
        teacherId: this.showTeacherID,
        newTeacherId: this.receiveTeacherID,
        userIdList: userStr
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
        overflow: hidden;
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
      width: 120px;
      height: 120px;
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
}
</style>
