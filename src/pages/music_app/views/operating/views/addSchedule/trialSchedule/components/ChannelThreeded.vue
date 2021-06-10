<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-26 20:35:35
-->
<template>
  <div class="channel-threeded">
    <el-dialog
      title="渠道线索定向分配设置"
      :visible.sync="centerDialog"
      width="1000px"
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
            <div class="channel-box">
              <div class="label">指定渠道{{ index + 1 }}</div>
              <channel-cascader
                @onSelectedChannel="onSelectChannel($event, item)"
              ></channel-cascader>
            </div>
            <div class="group-box">
              <div
                v-for="(group, g_index) in item.group"
                :key="g_index"
                class="circle-group"
              >
                <div class="group-operate-btn">
                  <i
                    v-if="
                      item.group.length && g_index === item.group.length - 1
                    "
                    class="tip-btn el-icon-circle-plus-outline"
                    @click="addGroup(item)"
                  ></i>
                  <i
                    class="tip-btn el-icon-remove-outline"
                    v-if="item.group.length > 1"
                    @click="removeGroup(item, g_index)"
                  ></i>
                </div>
                <!-- 选择老师 -->
                <el-select
                  v-model="group.teacherId"
                  filterable
                  remote
                  collapse-tags
                  size="mini"
                  placeholder="社群销售"
                  :loading="loading"
                  @change="onChangeTeacher($event, index, group)"
                >
                  <el-option
                    v-for="item in directTeacher"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>

                <!-- 微信 -->
                <el-select
                  v-model="group.wxId"
                  filterable
                  remote
                  collapse-tags
                  size="mini"
                  placeholder="微信号"
                  :loading="loading"
                  @change="onChange"
                >
                  <el-option
                    v-for="wx in group.wxList"
                    :key="wx.weixinId"
                    :label="wx.weixinNo"
                    :value="wx.weixinId"
                  >
                  </el-option>
                </el-select>
                <!-- 难度 -->
                <el-select
                  v-model="group.difficuteId"
                  filterable
                  remote
                  collapse-tags
                  size="mini"
                  placeholder="难度"
                  :loading="loading"
                  @change="onChange"
                >
                  <el-option
                    v-for="diff in group.difficuteList"
                    :key="diff"
                    :label="diff"
                    :value="diff"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
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
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import ChannelCascader from '@/pages/music_app/views/operating/components/ChannelCascader'
import { mapGetters } from 'vuex'
import { Sup_scheduleSubmit } from '@/utils/supList'

export default {
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false,
    },
    editChannelThreeded: {
      type: Object,
      default: () => null,
    },
    category: {
      type: [Number, String],
      default: '',
    },
  },
  data() {
    return {
      period: '',
      courseType: '0',
      currentIndex: 0,
      directTeacherData: [],
      directTeacher: [],
      teacherKeyVal: {},
      showDept: true,
      loading: false,
      // form: {}
      formList: [],
      // teacherList: [],
      groupItem: {
        teacherId: '',
        wxList: [],
        wxId: '',
        difficuteList: [],
        difficuteId: '',
      },
      formItem: {
        channel: [],
        group: [],
      },
      channelLeves: [],
      channels_1: [],
      channelList: [],
      channelClassList: null, // 分类条件
      teacherscope: null, // 当前选择的体验课老师范围（销售组查询）
      dialogVisible: false,
      showDatas: null, // 三级列表展示数据
      directConfigList: [],
    }
  },
  components: {
    // ChannelThreelist,
    ChannelCascader,
  },
  computed: {
    ...mapGetters(['schedulePeriod']),
    centerDialog() {
      return this.centerDialogVisible
    },
  },
  async created() {
    const { courseType = '0' } = this.$route.params
    this.period = this.schedulePeriod
    this.courseType = courseType

    await this.getDirectTeacherList() // 获取定向分配老师下拉菜单
    this.teacherIdKeyVal()

    this.initForm()
  },
  mounted() {},
  methods: {
    onSelectChannel(channelRes, formItem) {
      const { channel } = channelRes
      // 只去最后一个
      let reg = /id/g
      let arr = []
      for (let i = 0; i < channel.length; i++) {
        let itemArr = channel[i]
        for (let j = 0; j < itemArr.length; j++) {
          let str = itemArr[j]
          if (reg.test(str)) {
            
            arr.push(str.replace('id', ''))
          }
        }
      }
      formItem.channel = arr
    },
    initForm() {
      const groupItem = cloneDeep(this.groupItem)
      const formItem = {
        channel: [],
        group: [groupItem],
      }
      this.formList.push(formItem)
    },
    // 向当前渠道中添加组group
    addGroup(formItem) {
      const groupItem = cloneDeep(this.groupItem)
      formItem.group.push(groupItem)
    },
    // 删除当前group下的某一条
    removeGroup(formItem, index) {
      formItem.group.splice(index, 1)
    },
    dialogClose() {
      this.formList = []
      this.$emit('dialogOperate', { close: true })
    },
    dialogOperate(type) {
      const callback = () => {
        this.formList = []
        this.$emit('dialogOperate', { close: true, submitSucc: true })
      }
      if (type === 'cancel') {
        this.dialogClose()
      } else if (!this.validateForm()) {
        this.$message.warning('请先分配完整渠道线索~')
      } else {
        this.submitForm(callback)
      }
    },
    packageFormData() {
      const directConfigList = []

      this.formList.forEach((form) => {
        const { channel = [], group = [] } = form
        channel.forEach((channelId) => {
          group.forEach((g) => {
            const { difficuteId, teacherId, wxId } = g
            directConfigList.push({
              channelId,
              courseDifficulty: difficuteId,
              period: this.period,
              teacherId,
              weixinId: wxId,
              courseType: Sup_scheduleSubmit[this.courseType],
              courseCategory: +this.courseType === 6 ? this.category : '',
            })
          })
        })
      })
      const params = {
        courseType: Sup_scheduleSubmit[this.courseType],
        directConfigList,
      }

      return params
    },
    validateForm() {
      for (const item of this.formList) {
        const { channel = [], group = [] } = item
        if (!channel.length || !group.length) return false

        group.forEach((groupItem) => {
          const { teacherId = '', wxId = '', difficuteId = '' } = groupItem
          if (!teacherId || !wxId || !difficuteId) return false
        })
      }
      return true
    },
    /**  保存定向分配渠道 */
    async submitForm(cb) {
      const loadingInstance = this.$loading({
        target: 'body',
        lock: true,
        text: '正在设置...',
      })
      try {
        const params = this.packageFormData()
        const res = await this.$http.Operating.saveDirectChannel(params)
        if (res.code === 0 && cb) cb()
      } catch (err) {
        this.$message.error('保存失败~')
      } finally {
        // 以服务的方式调用的 Loading 需要异步关闭
        this.$nextTick(() => loadingInstance.close())
      }
    },
    // 添加一个渠道池
    addFormItem() {
      this.initForm()
    },
    delFormItem(index) {
      this.formList.splice(index, 1)
    },
    onChangeTeacher(tId, index, groupItem) {
      const { weixinInfoModels, difficulties } = this.teacherKeyVal[tId]

      groupItem.wxList = weixinInfoModels
      groupItem.difficuteList = difficulties

      const [firstWx = {}] = weixinInfoModels
      const [firstDiff = {}] = difficulties

      groupItem.wxId = firstWx.weixinId || ''
      groupItem.difficuteId = firstDiff || ''
    },
    onChange(item) {
    },
    teacherIdKeyVal(obj = {}) {
      this.directTeacherData.forEach((item) => {
        const {
          teacher: { id },
        } = item
        obj[id] = item
      })
      this.teacherKeyVal = obj
    },
    // 获取定向分配老师下拉菜单
    async getDirectTeacherList() {
      const { getDirectTeacherList } = this.$http.Operating
      const courseType = Sup_scheduleSubmit[this.courseType]
      try {
        const params = {
          period: this.period,
          courseType,
        }
        const { payload } = await getDirectTeacherList(params)

        this.directTeacherData = payload

        this.directTeacher = payload.map((item) => item.teacher)
      } catch (error) {
      }
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-center {
  .channel-list {
    .channel-item {
      display: flex;
      align-items: center;
      align-items: flex-start;
      .tip-icon {
        border-radius: 50%;
        border: 1px solid #aaa;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .channel-box {
        display: flex;
        align-items: center;
        > /deep/ .channel-cascader {
          margin: 0 10px;
        }
      }
      .add-btn {
        font-size: 25px;
        color: #409eff;
        cursor: pointer;
      }
    }
    .group-box {
      .circle-group {
        display: flex;
        align-items: center;
        .group-operate-btn {
          display: flex;
          align-items: center;
          margin: 0 10px 0 0;
          font-size: 24px;
          color: #999;
          width: 50px;
        }
      }
      .el-select {
        margin: 0 5px 5px 0;
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
