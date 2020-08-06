<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-06 23:22:54
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
              @change="changeChannelId('hhh')"
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
              :remote-method="getTeacher"
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
// import GroupSell from '@/components/MSearch/searchItems/groupSell'
import Department from './department'
import axios from '@/api/axiosConfig'
export default {
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
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
    // GroupSell,
    Department
  },
  computed: {
    centerDialog() {
      return this.centerDialogVisible
    }
  },
  async created() {
    await this.getChannelLeves()
    this.initFrom()
    this.getTeacher()
  },
  mounted() {},
  methods: {
    initFrom() {
      this.formList.push(cloneDeep(this.formItem))
    },
    onSelect(data) {
      console.log(data)
      //   this.$emit('channelSearchValue', data.length > 0 ? data : '')
    },
    dialogClose() {
      console.log('on close is invoked')
      this.$emit('dialogOperate', { close: true })
    },
    getDepartment(res) {
      console.log('idnex', res)
      const { data, index } = res
      this.formList[index].teacherscope = data.pay_teacher_id || null
      this.formList[index].teacherId = []
      this.getTeacher(index)
      //   this.teacherscope = res.pay_teacher_id || null
      //   this.setSeachParmas(res, ['pay_teacher_id'], 'terms')
    },
    // 选择社群销售
    // selectPayTeacher(res) {
    //   if (!res.pay_teacher_id || res.pay_teacher_id.length === 0) {
    //     this.teacherscope_trial = null
    //     if (this.teacherscope && this.teacherscope.length > 0) {
    //       res = {
    //         pay_teacher_id: this.teacherscope
    //       }
    //     } else {
    //       res = ''
    //     }
    //   } else {
    //     this.teacherscope_trial = res.pay_teacher_id
    //   }
    //   //   this.setSeachParmas(res, ['pay_teacher_id'], 'terms')
    // },
    cleanDept() {
      this.showDept = false
      this.$nextTick(() => {
        this.showDept = true
      })
    },
    dialogOperate(type) {
      console.log(this.formList)
      if (type === 'cancel') {
        this.cleanDept()
        this.formList = [cloneDeep(this.formItem)]
        // this.$emit('dialogOperate', { close: true })
      }
    },
    packageFormData() {
      // const { }
    },
    submitForm() {
      // const
    },
    changeChannelId(res, b, c) {
      console.log('渠道res', res, b, c)
    },
    // 添加一个渠道池
    addFormItem() {
      this.formList.push(cloneDeep(this.formItem))
      this.getTeacher(this.formList.length - 1)
    },
    // 获取渠道来源 filter: 过滤关键词  eg：filter:"抖音"
    async getChannelLeves() {
      await axios
        .post('/graphql/v1/toss', {
          query: `{
            ChannelAllList {
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
    // 社群销售
    getTeacher(index = 0, query = '') {
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
      //   const obj = {
      //     [this.name]: item
      //   }
      //   if (this.returnList) {
      //     Object.assign(obj, {
      //       teacherList: this.teacherList
      //     })
      //   }
      //   this.$emit('result', item ? obj : '')
    }
  },
  watch: {
    // teacherscope(val, old) {
    //   this.teacherId = ''
    //   this.getTeacher()
    // }
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
