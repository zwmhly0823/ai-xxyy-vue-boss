<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-22 14:01:40
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-25 18:18:06
 -->
<template>
  <div class="container">
    <div class="container-left module">
      <h2>交出方</h2>
      <div class="module-search" v-show="classListIsNull">
        <Department
          name="pay_teacher_id"
          placeholder="全部部门"
          :multiple="multiple"
          @result="handoverSelectDepartment"
        />
        <GroupSell
          tip="请选择老师"
          :teacherscope="handoverTeacherScope"
          @result="handoverSelectTeacher"
          name="pay_teacher_id"
          class="margin_l10"
        />
        <div class="module-search-tip">请先选择部门和老师哦～</div>
      </div>
      <div class="to-choose-container" v-show="!classListIsNull">
        <h3>{{ handoverTeacherName }}</h3>
        <div class="class-in" v-show="!isWechartHandover">
          微信号{{ computObjKey(wechatObj) }}个
        </div>
        <div class="class-in" v-show="!isWechartHandover">
          带班数{{ classLength.flat().length }}个
        </div>
        <div class="class-in" v-show="isWechartHandover">
          带班数{{ classList.length }}个
        </div>
        <el-button type="text" @click="handoverToChoose">重新选择</el-button>
      </div>
    </div>
    <svg class="iconjiantou-you" aria-hidden="true">
      <use xlink:href="#iconjiantou-you"></use>
    </svg>
    <div class="container-middle module">
      <h2>{{ isWechartHandover ? '班级' : '微信号' }}</h2>
      <div class="module-table" v-if="isWechartHandover">
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
            目标交接班级数{{ classList.length }}个；实际接收班级数{{
              receiveTeacher.length
            }}个
          </div>
        </div>
      </div>
      <div class="module-table" v-else>
        <el-table
          :data="classList"
          @selection-change="handleSelectionChange"
          :show-header="false"
          height="338"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column prop="weixinNo"> </el-table-column>
        </el-table>
        <div class="handover-inform">
          <div class="handover-inform-text" v-if="receiveTeacher.length">
            目标交接班级数{{ computObjKey(wechatObj) }}个，包含班级数{{
              classLength.flat().length
            }}个；实际交接微信数{{ astualWechart.length }}个，接收班级数{{
              tableList.length
            }}个
          </div>
        </div>
      </div>
    </div>
    <svg class="iconjiantou-you" aria-hidden="true">
      <use xlink:href="#iconjiantou-you"></use>
    </svg>
    <div class="container-right module">
      <h2>接收方</h2>
      <div v-show="isShowWX">
        <div class="module-search">
          <Department
            name="pay_teacher_id"
            placeholder="全部部门"
            :multiple="multiple"
            @result="receiveSelectDepartment"
          />
          <GroupSell
            tip="请选择老师"
            :teacherscope="receiveTeacherScope"
            @result="receiveSelectTeacher"
            name="pay_teacher_id"
            class="margin_l10"
          />
        </div>
        <div class="module-search-wechart">
          <el-select
            v-model="form.receiveWxId"
            size="small"
            filterable
            clearable
            placeholder="选择微信号"
            @change="handleWX"
          >
            <el-option
              v-for="(item, index) in receiveWechartList"
              :key="index"
              :label="item.weixinNo"
              :value="item.weixinId"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="to-choose-container" v-show="!isShowWX">
        <h3>{{ receiveTeacherName }}</h3>
        <div class="class-in">
          接收微信号：{{
            isWechartHandover ? receiveWXNo : `${receiveTeacher.length}个`
          }}
        </div>
        <div class="class-in">接收班级数{{ actualClass.length }}个</div>
        <el-button type="text" @click="receiveToChoose">重新选择</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
export default {
  props: {
    index: {
      type: String,
      default: '0'
    },
    tableList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tabIndex: this.index,
      handoverTeacherScope: null,
      receiveTeacherScope: null,
      multiple: false,
      handoverMiddleWareArr: [],
      receiveMiddleWareArr: [],
      handoverTeacherName: '',
      classList: [],
      classListIsNull: true,
      receiveTeacher: [],
      isWechartHandover: false,
      receiveWechartList: [],
      isShowWX: true,
      receiveTeacherName: '',
      receiveWXNo: '',
      form: {
        handoverTeacherId: '',
        receiveWxId: '',
        receiveTeacherId: ''
      },
      wechatObj: {},
      classLength: [],
      actualClass: [],
      detailList: [],
      astualWechart: []
    }
  },
  watch: {
    tabIndex: {
      handler(val) {
        this.isWechartHandover = val === '0'
      },
      immediate: true
    },
    classList: {
      handler(val) {
        this.classListIsNull = val.length === 0
      },
      immediate: true
    },
    tableList: {
      handler(val) {
        if (val.length !== 0) {
          for (const item of val) {
            if (
              item.sendWeixinNo !== '' &&
              this.astualWechart.indexOf(item.sendWeixinNo) === -1
            ) {
              this.astualWechart.push(item.sendWeixinNo)
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handoverSelectDepartment(res) {
      const { handoverMiddleWareArr } = this
      handoverMiddleWareArr.push(res)
      this.handoverTeacherScope = handoverMiddleWareArr || null
    },
    receiveSelectDepartment(res) {
      const { receiveMiddleWareArr } = this
      receiveMiddleWareArr.push(res)
      this.receiveTeacherScope = receiveMiddleWareArr || null
    },
    handoverSelectTeacher(res) {
      this.form.handoverTeacherId = res.pay_teacher_id || null
      if (res && res.teacherList) {
        for (const item of res.teacherList) {
          if (item.id === res.pay_teacher_id) {
            this.handoverTeacherName = item.realname
          }
        }
      } else {
        this.handoverTeacherName = ''
      }
      this.initClassInform(res.pay_teacher_id, 'handover')
      this.getWechat(res.pay_teacher_id)
    },
    receiveSelectTeacher(res) {
      this.form.receiveTeacherId = res.pay_teacher_id || null
      this.initClassInform(res.pay_teacher_id, 'receive')
    },
    async initClassInform(teacherId, type) {
      if (teacherId === undefined) {
        return
      }
      try {
        const res = await this.$http.WorkerHandover.getHandoverSteam(teacherId)
        if (res && res.code === 0) {
          if (type === 'handover') this.classList = res.payload
          if (type === 'receive') this.receiveWechartList = res.payload
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleSelectionChange(val) {
      const arr = []
      this.receiveTeacher = val
      if (Object.keys(this.wechatObj).length !== 0) {
        for (const item of val) {
          if (this.wechatObj[item.weixinNo].length !== 0) {
            arr.push(this.wechatObj[item.weixinNo])
          }
        }
        this.actualClass = arr.flat()
      }
    },
    handoverToChoose() {
      this.classList.splice(0, this.classList.length)
      this.handoverMiddleWareArr.splice(0, this.handoverMiddleWareArr.length)
    },
    handleWX(val) {
      const { receiveWechartList } = this
      this.form.receiveWxId = val
      this.isShowWX = false
      if (receiveWechartList) {
        for (const item of receiveWechartList) {
          if (item.weixinId === val) {
            this.receiveTeacherName = item.realName
            this.receiveWXNo = item.weixinNo
          }
        }
      } else {
        this.receiveTeacherName = ''
      }
    },
    receiveToChoose() {
      this.isShowWX = true
      this.form.receiveWxId = ''
      this.receiveWechartList.splice(0, this.receiveWechartList.length)
    },
    async getWechat(teacherId) {
      const { wechatObj, classLength } = this
      if (teacherId === undefined) {
        return
      }
      try {
        const res = await this.$http.WorkerHandover.getHandoverWechat(teacherId)
        if (res.code === 0) {
          for (const item of res.payload) {
            wechatObj[item.weixinNo] = item.steamModelList
            classLength.push(item.steamModelList)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    computObjKey(obj) {
      return Object.keys(obj).length
    }
  },
  components: {
    Department,
    GroupSell
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
      width: 80%;
      margin: 0 auto;
    }
    .handover-inform {
      width: 100%;
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: -60px;
      left: 0;
      &-text {
        font-size: 16px;
      }
    }
  }
  .iconjiantou-you {
    width: 120px;
    height: 120px;
    fill: rgb(0, 123, 199);
  }
}
</style>
