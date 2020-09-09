<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-24 18:18:59
-->
<template>
  <div class="channel-threeded">
    <el-dialog
      title="渠道线索定向分配设置"
      :visible.sync="centerDialog"
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
            <div class="label">指定渠道{{ index + 1 }}</div>
            <el-select
              style="margin-left:20px;"
              v-model="formList[index].channel"
              :multiple="false"
              filterable
              remote
              :reserve-keyword="true"
              size="mini"
              clearable
              placeholder="选择渠道"
              :disabled="formList[index].isEdit"
            >
              <el-option
                v-for="item in channelLeves"
                :key="item.id"
                :label="item.channel_outer_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <div class="tip-icon">→</div>
            <!-- <div class="for-teacher"> -->
            <department
              name="pay_teacher_id"
              placeholder="全部销售组"
              :arrIndex="index"
              v-if="showDept"
              @result="getDepartment"
            />
            <el-select
              v-model="formList[index].teacherId"
              :multiple="true"
              filterable
              remote
              :reserve-keyword="true"
              size="mini"
              clearable
              placeholder="社群销售"
              :loading="loading"
              @change="onChange"
            >
              <el-option
                v-for="item in formList[index].teacherList"
                :key="item.id"
                :label="item.realname"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <!-- <group-sell
              :teacherscope="teacherscope"
              is-multiple
              tip="全部社群销售"
              @result="selectPayTeacher"
              name="pay_teacher_id"
              class="margin_l10"
            /> -->
            <i
              class="el-icon-circle-plus add-btn"
              @click="addFormItem"
              v-if="formList.length && index === formList.length - 1"
            ></i>
            <!-- </div> -->
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOperate('cancel')" size="mini"
          >取 消</el-button
        >
        <el-button @click="dialogOperate('submit')" type="primary" size="mini"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import Department from './department'
import axios from '@/api/axiosConfig'
export default {
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
    },
    editChannelThreeded: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      showDept: true,
      loading: false,
      teacherList: [],
      formList: [],
      formItem: {
        channel: '',
        teacherscope: null,
        teacherId: [],
        teacherList: []
      },
      channelLeves: [],
      channels_1: [],
      channelList: [],
      channelClassList: null, // 分类条件
      teacherscope: null, // 当前选择的体验课老师范围（销售组查询）
      dialogVisible: false,
      showDatas: null // 三级列表展示数据
    }
  },
  components: {
    // ChannelThreelist,
    Department
  },
  computed: {
    centerDialog() {
      return this.centerDialogVisible
    }
  },
  async created() {
    console.log('editChannelThreeded', this.editChannelThreeded)
    await this.getChannelLeves()
    if (this.editChannelThreeded === null) {
      this.initForm()
    } else {
      const { channelId } = this.editChannelThreeded
      this.formList = [
        {
          ...this.formItem,
          channel: channelId,
          isEdit: true
        }
      ]
    }
    this.getTeacher()
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
      this.formList[index].teacherId = []

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
      const callback = () => {
        this.clearFormData()
        this.$emit('dialogOperate', { close: true, submitSucc: true })
      }
      if (type === 'cancel') {
        this.dialogClose()
      } else if (type === 'submit' && this.validateForm()) {
        this.submitForm(callback)
      }
    },
    packageFormData() {
      const { courseType = '0', period = '', formArr = [] } = this.$route.params

      this.formList.forEach((item) => {
        const { channel = '', teacherId = [] } = item
        teacherId.forEach((id) => {
          formArr.push({
            period,
            channelId: channel,
            teacherId: id,
            courseCategory: courseType !== '0' ? '2' : '0'
          })
        })
      })
      return formArr
    },
    validateForm() {
      for (const item of this.formList) {
        if (!item.channel || !item.teacherId.length) {
          this.$message.warning('请先分配好渠道线索~')
          return false
        }
      }
      return true
    },
    /** 教师渠道绑定-保存 */
    async submitForm(cb) {
      const loadingInstance = this.$loading({
        target: 'body',
        lock: true,
        text: '正在设置...'
      })
      try {
        const params = this.packageFormData()
        const res = await this.$http.Operating.saveOrUpdate(params)
        if (res.code === 0 && cb) cb()
      } catch (err) {
        this.$message.error('配置出错')
      } finally {
        // 以服务的方式调用的 Loading 需要异步关闭
        this.$nextTick(() => loadingInstance.close())
      }
    },
    /** 教师渠道绑定-查找记录 */
    async getRecord(cb) {
      try {
        const { period = '' } = this.$route.params
        const res = await this.$http.Operating.getRecord({ period })
        console.log(res, 'getRecord-res')
        if (res.code === 0 && cb) cb()
      } catch (err) {
        this.$message.error('配置出错')
      }
    },
    // 添加一个渠道池
    addFormItem() {
      this.formList.push(cloneDeep(this.formItem))
      this.getTeacher(this.formList.length - 1)
    },
    // 获取渠道来源 filter: 过滤关键词  eg：filter:"抖音"
    async getChannelLeves() {
      const subject = { subject: this.$store.getters.subjects.subjectCode }
      await axios
        .post('/graphql/v1/toss', {
          query: `{
            ChannelAllList(query:${JSON.stringify(JSON.stringify(subject))}) {
                id
                channel_class_id
                channel_outer_name
              }
            }
          `
        })
        .then((res) => {
          this.channelLeves = res.data.ChannelAllList
        })
    },
    getTeacher(index = 0, query = '') {
      const { getDepartmentTeacherEx } = this.$http.Department
      const { teacherscope = null } = this.formList[index]
      console.log(this.formList, teacherscope)
      if (teacherscope && teacherscope.length) {
        this.loading = true
        const q = {
          bool: {
            must: query
              ? [{ wildcard: { 'realname.keyword': `*${query}*` } }]
              : []
          }
        }
        q.bool.must.push({ terms: { id: teacherscope } })
        getDepartmentTeacherEx(JSON.stringify(q))
          .then((res) => {
            this.formList[index].teacherList = res.data.TeacherListEx || []
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 社群销售
    getTeacher_1(index = 0, query = '') {
      const { getDepartmentTeacherEx } = this.$http.Department
      const { teacherscope } = this.formList[index]
      this.loading = true
      const q = {
        bool: {
          must: query
            ? [{ wildcard: { 'realname.keyword': `*${query}*` } }]
            : []
        }
      }
      teacherscope && q.bool.must.push({ terms: { id: teacherscope } })
      getDepartmentTeacherEx(JSON.stringify(q))
        .then((res) => {
          this.formList[index].teacherList = res.data.TeacherListEx || []
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onChange(item) {
      console.log(item, 'teacherid-item')
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
