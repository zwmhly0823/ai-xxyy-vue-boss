<template>
  <!-- 页面样式按照班级交接和微信交接来 -->
  <div class="container">
    <div class="container-left module">
      <h2>交出方</h2>
      <div class="module-search" v-show="showHandler">
        <Department
          name="pay_teacher_id"
          placeholder="全部部门"
          :multiple="false"
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
        <p>{{ handoverTeacherName }}</p>
        <el-button type="text" @click="handoverToChoose">重新选择</el-button>
      </div>
    </div>
    <svg class="iconjiantou-you" aria-hidden="true">
      <use xlink:href="#iconjiantou-you"></use>
    </svg>
    <div class="container-middle module">
      <h2>选择学员</h2>
      <!-- <div class="module-table">
        <el-table
          :data="classList"
          @selection-change="handleSelectionChange"
          :show-header="false"
          height="338"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column prop="teamName"> </el-table-column>
        </el-table>
        <div class="handover-inform">
          <div class="handover-inform-text" v-if="classList.length">
            目标交接班级数<span class="prominent">{{ classList.length }}</span
            >个;实际接收班级数<span class="prominent">{{
              receiveTeacher.length
            }}</span
            >个
          </div>
        </div>
      </div> -->
    </div>
    <svg class="iconjiantou-you" aria-hidden="true">
      <use xlink:href="#iconjiantou-you"></use>
    </svg>
    <div class="container-right module">
      <h2>接收方</h2>

      <div class="module-search" v-show="showReceive">
        <Department
          name="pay_teacher_id"
          placeholder="全部部门"
          :multiple="false"
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
        <el-button type="text" @click="receiveToChoose">重新选择</el-button>
      </div>
    </div>
  </div>
</template>

<script>
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
      showHandler: true,
      handoverTeacherScope: null,
      handoverTeacherName: '',
      showReceive: true,
      receiveTeacherScope: null,
      receiveTeacherName: ''
    }
  },
  methods: {
    // 交出方选择部门
    handoverSelectDepartment(res) {
      this.handoverTeacherScope =
        res.pay_teacher_id.length !== 0 ? res.pay_teacher_id : null
    },
    // 交出方选择老师
    handoverSelectTeacher(res) {
      if (res && res.teacherList) {
        for (const item of res.teacherList) {
          if (item.id === res.pay_teacher_id) {
            this.handoverTeacherName = item.realname
          }
        }
      }
      this.showHandler = false
    },
    // 交出方重新选择
    handoverToChoose() {
      this.showHandler = true
    },
    // 接收方选择部门
    receiveSelectDepartment(res) {
      this.receiveTeacherScope =
        res.pay_teacher_id.length !== 0 ? res.pay_teacher_id : null
    },
    // 接收方选择老师
    receiveSelectTeacher(res) {
      if (res && res.teacherList && res.teacherList.length !== 0) {
        for (const item of res.teacherList) {
          if (item.id === res.pay_teacher_id) {
            this.receiveTeacherName = item.realname
          }
        }
      }
      this.showReceive = false
    },
    // 交出方重新选择
    receiveToChoose() {
      this.showReceive = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin: 20px auto 80px;
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
        font-size: 44px;
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
  }
  .iconjiantou-you {
    width: 120px;
    height: 120px;
    fill: rgb(0, 123, 199);
  }
  .prominent {
    color: red;
  }
}
</style>
