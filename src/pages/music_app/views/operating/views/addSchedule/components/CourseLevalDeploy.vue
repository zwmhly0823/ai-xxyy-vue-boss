<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2021-05-07 16:55:02
-->
<template>
  <div class="channel-threeded">
    <el-dialog
      :title="`选择${activeTab.text}接班销售`"
      :visible.sync="showDialog"
      width="60%"
      top="20vh"
      :before-close="dialogClose"
      :close-on-click-modal="false"
      custom-class="dialog-custom"
    >
      <div class="dialog-center">
        <div class="channel-list">
          <div
            class="channel-item"
            v-for="(item, index) in formList"
            :key="index"
          >
            <department
              name="pay_teacher_id"
              placeholder="选择部门"
              :arrIndex="index"
              v-if="showDept"
              @result="getDepartment"
            />
            <div class="tip-icon">→</div>
            <el-select
              v-model="formList[index].teacherId"
              filterable
              remote
              :reserve-keyword="true"
              size="mini"
              clearable
              placeholder="社群销售"
              :loading="loading"
              @change="onChangeTeacher($event, index)"
            >
              <el-option
                v-for="item in formList[index].teacherList"
                :key="item.id"
                :label="item.realname"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <div class="tip-icon" style="marginRight:0;">→</div>
            <el-select
              style="margin-left:20px;"
              v-model="formList[index].wxNum"
              :reserve-keyword="true"
              size="mini"
              clearable
              placeholder="请选择微信号"
              :disabled="formList[index].isEdit"
            >
              <el-option
                v-for="item in wecharNumList"
                :key="item.id"
                :label="item.weixinNo"
                :value="item.weixinId"
              >
              </el-option>
            </el-select>
            <i
              class="el-icon-circle-plus add-btn"
              @click="addFormItem"
              v-if="formList.length && index === formList.length - 1"
            ></i>
            <i
              class="add-btn el-icon-remove"
              v-if="formList.length > 1"
              @click="delFormItem(index)"
            ></i>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOperate('cancel')" size="mini"
          >取 消</el-button
        >
        <el-button @click="dialogOperate('submit')" type="primary" size="mini"
          >保 存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { viliderPeriod } from '@/pages/music_app/views/operating/partTools'
import Department from './department'
import { mapGetters } from 'vuex'
import { Sup_scheduleSubmit } from '@/utils/supList'
export default {
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
    },
    editDeploy: {
      type: Object,
      default: () => null
    },
    activeTab: {
      type: Object,
      default: () => {}
    },
    category: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      courseType: '',
      period: '',
      currentTeacherWenum: '',
      showDept: true,
      loading: false,
      teacherList: [],
      formList: [],
      formItem: {
        wxNum: '',
        teacherscope: null,
        teacherId: [],
        teacherList: []
      },
      wecharNumList: [],
      channels_1: [],
      channelList: [],
      channelClassList: null, // 分类条件
      teacherscope: null, // 当前选择的体验课老师范围（销售组查询）
      dialogVisible: false,
      showDatas: null, // 三级列表展示数据
      divisonPeriod: 0
    }
  },
  components: {
    Department
  },
  computed: {
    ...mapGetters(['schedulePeriod']),
    showDialog() {
      return this.centerDialogVisible
    }
  },
  async created() {
    const { courseType = '0', period = '' } = this.$route.params
    this.courseType = courseType
    this.period = period

    if (this.editDeploy === null) {
      this.initForm()
    } else {
      const { wxNum } = this.editDeploy
      this.formList = [
        {
          ...this.formItem,
          wxNum: wxNum,
          isEdit: true
        }
      ]
    }
    this.getTeacher()
    // await this.getDividerPeriodByType()
  },
  mounted() {},
  methods: {
    initForm() {
      this.formList.push(cloneDeep(this.formItem))
    },
    dialogClose() {
      this.clearFormData()
      this.$emit('dialogOperate', { close: true })
    },
    getDepartment(res) {
      const { data, index } = res
      this.formList[index].teacherscope = data.pay_teacher_id || null
      this.formList[index].teacherId = ''

      this.getTeacher(index)
    },
    cleanDept() {
      this.showDept = false
      this.$nextTick(() => {
        this.showDept = true
      })
    },
    clearFormData() {
      this.cleanDept()
      this.formList = [cloneDeep(this.formItem)]
    },
    dialogOperate(type) {
      if (type === 'cancel') {
        this.dialogClose()
      } else if (type === 'submit' && this.validateForm()) {
        this.submitForm()
      }
    },
    packageFormData() {
      const wxList = this.formList.map((item) => item.wxNum)
      const emitData = {
        courseDifficulty:this.activeTab.id,
        courseType: Sup_scheduleSubmit[this.courseType],
        period: this.period,
        wxList
      }

      return emitData
    },
    validateForm() {
      const hash = {}
      for (const item of this.formList) {
        const { wxNum } = item
        if (!wxNum) {
          this.$message.warning('请配置完接班销售~')
          return false
        }
        if (hash[wxNum]) {
          this.$message.warning(`您有重复配置的微信号(${wxNum})`)
          return false
        }
        hash[wxNum] = true
      }
      return true
    },
    /** 社群销售teacherId-onchange */
    onChangeTeacher(teacherId, index) {
      this.formList[index].wxNum = ''
      this.getWeixinByTeacherId(teacherId)
    },
    /** 根据老师Id获取微信号列表 */
    async getWeixinByTeacherId(teacherId) {
      if (!teacherId) return
      const { getWeixinByTeacherId } = this.$http.WorkerHandover
      try {
        const { code, payload = [] } = await getWeixinByTeacherId(teacherId)
        if (code === 0) {
          if (!payload.length) this.$message.warning('该老师没有微信号~')
          this.wecharNumList = payload
        }
      } catch (error) {
      }
    },
    /** 保存 添加的接生销售 */
    async submitForm() {
      const loadingInstance = this.$loading({
        target: 'body',
        lock: true,
        text: '正在设置...'
      })
      try {
        const params = this.packageFormData()
        const {
          saveAddTeacherWxList
        } = this.$http.Operating
        var _reqApi = saveAddTeacherWxList

        const { code, payload = [] } = await _reqApi(params)
        // for(let i = 0 ; i < payload.length;i++){
        //   let obj = {enroll:[{
        //     courseCategory:''
        //   }]}
        //   Object.assign(payload[i],obj)
        // }
        if (code === 0) {
          this.clearFormData()
          this.$emit('dialogOperate', {
            close: true,
            submitSucc: true,
            payload
          })
        }
      } catch (err) {
        this.$message.error('配置出错')
      } finally {
        // 以服务的方式调用的 Loading 需要异步关闭
        this.$nextTick(() => loadingInstance.close())
      }
    },
    // 控制新老体验课期数
    async getDividerPeriodByType() {
      const params = {
        type: 'TESTCOURSE',
        category: ''
      }
      const { getDividerPeriod } = this.$http.Operating
      const { payload = {} } = await getDividerPeriod(params)
      this.divisonPeriod = payload.period
    },
    // 添加一个接班销售
    addFormItem() {
      this.formList.push(cloneDeep(this.formItem))
      this.getTeacher(this.formList.length - 1)
    },
    // 删除一个接班销售
    delFormItem(index) {
      this.formList.splice(index, 1)
    },
    //
    async saveAddTeacherWxList(params) {
      const { saveAddTeacherWxList } = this.$http.Operating
      await saveAddTeacherWxList(params).catch()
    },
    // 社群销售
    getTeacher(index = 0, query = '') {
      const { getDepartmentTeacherEx } = this.$http.Department
      const { teacherscope = null } = this.formList[index]

      this.loading = true
      const q = {
        bool: {
          must: query
            ? [{ wildcard: { 'realname.keyword': `*${query}*` } }]
            : []
        }
      }
      if (teacherscope && teacherscope.length) {
        q.bool.must.push({ terms: { id: teacherscope } })
      }
      getDepartmentTeacherEx(JSON.stringify(q), 10000)
        .then((res) => {
          this.formList[index].teacherList = res.data.TeacherListEx || []
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-center {
  .channel-list {
    .channel-item {
      display: flex;
      height: 40px;
      align-items: center;
      > div {
        margin-right: 15px;
      }
      .add-btn {
        font-size: 25px;
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.channel-threeded {
  .el-cascader__tags {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .el-cascader--mini {
    height: 28px;
    .el-input--mini {
      height: inherit;
      .el-input__inner {
        height: 28px !important;
      }
    }
  }
}

.el-cascader-panel {
  max-height: 300px !important;
}
</style>
