<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-22 14:01:40
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-26 18:15:23
 -->
<template>
  <div class="container">
    <div class="container-left module">
      <h2>交出方</h2>
      <div class="module-search" v-show="flag">
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
      <div class="to-choose-container" v-show="!flag">
        <h3>{{ handoverTeacherName }}</h3>
        <div class="class-in" v-show="!isClassHandover">
          微信号<span class="prominent">{{ computObjKey(wechatObj) }}</span
          >个
        </div>
        <div class="class-in" v-show="!isClassHandover">
          带班数<span class="prominent">{{ classLength.length }}</span
          >个
        </div>
        <div class="class-in" v-show="isClassHandover">
          带班数<span class="prominent">{{ classList.length }}</span
          >个
        </div>
        <el-button type="text" @click="handoverToChoose">重新选择</el-button>
      </div>
    </div>
    <svg class="iconjiantou-you" aria-hidden="true">
      <use xlink:href="#iconjiantou-you"></use>
    </svg>
    <div class="container-middle module">
      <h2>{{ isClassHandover ? '班级' : '微信号' }}</h2>
      <div class="module-table" v-if="isClassHandover">
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
      </div>
      <div class="module-table" v-else>
        <el-table
          :data="wecharList"
          @selection-change="handleSelectionChange"
          :show-header="false"
          height="338"
        >
          <el-table-column type="selection"> </el-table-column>
          <el-table-column prop="weixinNo"> </el-table-column>
        </el-table>
        <div class="handover-inform">
          <div class="handover-inform-text" v-if="classLength.length">
            目标交接微信数
            <span class="prominent">{{ computObjKey(wechatObj) }}</span>
            个，包含班级数
            <span class="prominent">{{ classLength.length }}</span>
            个<br />实际交接微信数
            <span class="prominent">{{ receiveTeacher.length }}</span>
            个，包含班级数
            <span class="prominent">{{ actualClass.length }}</span>
            个
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
        <div class="module-search-wechart" v-if="isClassHandover">
          <el-select
            v-model="form.receiveWxId"
            size="small"
            filterable
            clearable
            placeholder="选择微信号"
            @change="handleWX"
          >
            <el-option
              v-for="(item, index) in wecharNumList"
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
          接收微信号:<span class="prominent">{{
            isClassHandover ? receiveWXNo : receiveTeacher.length
          }}</span>
          {{ isClassHandover ? '' : '个' }}
        </div>
        <div class="class-in">
          接收班级数<span class="prominent">{{
            isClassHandover ? receiveTeacher.length : actualClass.length
          }}</span
          >个
        </div>
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
    },
    clearSelectData: {
      type: Boolean,
      default: false
    },
    clearData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabIndex: this.index,
      handoverTeacherScope: null,
      receiveTeacherScope: null,
      multiple: false,
      handoverTeacherName: '',
      classList: [],
      flag: true,
      receiveTeacher: [],
      isClassHandover: false,
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
      wecharList: [],
      wecharNumList: []
    }
  },
  watch: {
    tabIndex: {
      handler(val) {
        this.isClassHandover = val === '0'
      },
      immediate: true
    },
    clearSelectData: {
      handler(val) {
        const ids = this.receiveTeacher.map((item, index) => {
          return item.id
        })
        if (val) {
          for (const index in this.classList) {
            for (const id of ids) {
              if (this.classList[index]) {
                if (id === this.classList[index].id) {
                  this.classList.splice(index, this.receiveTeacher.length)
                  this.receiveTeacher.splice(0, this.receiveTeacher.length - 1)
                }
              }
            }
          }
        }
      },
      immediate: true
    },
    clearData: {
      handler(val) {
        const wecharList = this.wecharList
        const weixinIds = this.receiveTeacher.map((item, index) => {
          return item.weixinNo
        })
        if (val) {
          for (const index in wecharList) {
            for (const idx in weixinIds) {
              if (wecharList[index]) {
                if (weixinIds[idx] === wecharList[index].weixinNo) {
                  this.classLength.splice(
                    0,
                    wecharList[index].steamModelList.length
                  )
                  this.receiveTeacher.splice(0, this.receiveTeacher.length - 1)
                  this.actualClass.splice(
                    0,
                    wecharList[index].steamModelList.length
                  )
                  delete this.wechatObj[wecharList[index].weixinNo]
                  wecharList.splice(index, 1)
                }
              }
            }
          }
        }
      },
      immediate: true
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
      if (this.isClassHandover) {
        this.initClassInform(this.form.handoverTeacherId)
      } else {
        this.wechatObj = {}
        this.getWechat(this.form.handoverTeacherId)
      }
    },
    // 接收方选择部门
    receiveSelectDepartment(res) {
      this.receiveTeacherScope =
        res.pay_teacher_id.length !== 0 ? res.pay_teacher_id : null
    },
    // 接收方选择老师
    receiveSelectTeacher(res) {
      this.form.receiveTeacherId = res.pay_teacher_id || null
      if (res && res.teacherList.length !== 0) {
        for (const item of res.teacherList) {
          if (item.id === res.pay_teacher_id) {
            this.receiveTeacherName = item.realname
          }
        }
      }
      this.form.receiveWxId = ''
      if (this.isClassHandover) {
        this.getWeixinByTeacherId(res.pay_teacher_id)
      } else {
        this.isShowWX = false
      }
    },
    // 加载班级list
    async initClassInform(teacherId, type) {
      if (teacherId === undefined || teacherId === null) {
        return
      }
      try {
        const res = await this.$http.WorkerHandover.getHandoverSteam(teacherId)
        if (res && res.code === 0) {
          if (res.payload.length === 0) {
            this.$message({
              message: '此老师没有班级～',
              type: 'warning'
            })
            return
          }
          this.classList = res.payload
          this.flag = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 班级列表勾选
    handleSelectionChange(val) {
      const arr = []
      this.receiveTeacher = val
      if (Object.keys(this.wechatObj).length !== 0) {
        for (const item of val) {
          arr.push(this.wechatObj[item.weixinNo])
        }
        this.actualClass = arr.flat()
      }
    },
    // 交出方重新选择
    handoverToChoose() {
      this.flag = true
    },
    // 微信号选择
    handleWX(val) {
      const { wecharNumList } = this
      this.form.receiveWxId = val
      this.isShowWX = false
      if (wecharNumList) {
        for (const item of wecharNumList) {
          if (item.weixinId === val) {
            this.receiveWXNo = item.weixinNo
          }
        }
      }
    },
    // 接收方重新选择
    receiveToChoose() {
      this.isShowWX = true
    },
    // 获取微信列表
    async getWechat(teacherId) {
      const { wechatObj, classLength } = this
      classLength.length = 0
      if (teacherId === undefined || teacherId === null) {
        return
      }
      try {
        const res = await this.$http.WorkerHandover.getHandoverWechat(teacherId)
        if (res.payload.length === 0) {
          this.$message.warning('老师名下没有微信号~')
          return
        }
        if (res.code === 0 && res.payload.length !== 0) {
          for (const item of res.payload) {
            wechatObj[item.weixinNo] = item.steamModelList
            if (item.steamModelList.length !== 0) {
              for (const _item of item.steamModelList) {
                classLength.push(_item)
              }
            }
          }
          this.flag = false
          this.wecharList = res.payload
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取微信号列表
    async getWeixinByTeacherId(teacherId) {
      if (teacherId === undefined || teacherId === null) {
        return
      }
      try {
        const res = await this.$http.WorkerHandover.getWeixinByTeacherId(
          teacherId
        )
        if (res.code === 0) {
          if (res.payload.length === 0) {
            this.$message.warning('老师没有微信号~')
            return
          }
          this.wecharNumList = res.payload
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 计算obj是否为空
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
        font-size: 16px;
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
