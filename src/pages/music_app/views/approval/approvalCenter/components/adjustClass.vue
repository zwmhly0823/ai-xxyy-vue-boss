<template>
  <div class="adjustModule" v-loading="adjustLoading">
    <div class="title">
      <i class="el-icon-arrow-left back-icon" @click="back"></i>
      <span class="title-text">{{ showData.title }}</span>
    </div>
    <el-form
      ref="adjustForm"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      class="adjust-form"
    >
      <el-form-item
        v-for="(item, key) in showData.content"
        :key="key"
        :label="item.labelText"
        :prop="item.model"
      >
        <!-- 带有下拉搜索的输入框 -->
        <template v-if="item.type === 'input' && item.autocomplete">
          <search-phone
            class="search-phone-class"
            ref="searchPhone"
            v-model="formData[item.model]"
            @result="getSearchPhoneData"
            :name="item.model"
            @inputChange="resetPartOfFormData"
          />
        </template>
        <!-- select -->
        <template
          v-if="
            item.type === 'select' && (selectClass === '0' || item.labelText)
          "
        >
          <el-select
            v-model="formData[item.model]"
            :placeholder="item.placeholder || ''"
            :style="{ width: item.width || '300px' }"
            @change="selectChange($event, item)"
            :loading="item.loading"
            value-key="index"
          >
            <el-option
              v-for="option in item.options"
              :key="option.index"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled"
            ></el-option>
          </el-select>
        </template>
        <!-- radio -->
        <template v-if="item.type === 'radio'">
          <el-radio v-model="selectClass" label="0">指定班级</el-radio>
          <el-radio v-model="selectClass" label="1">系统分配</el-radio>
        </template>
        <!-- 不能输入的input -->
        <template v-if="item.type === 'input' && item.disabled">
          <el-input
            v-model="formData[item.model]"
            :disabled="true"
            :style="{ width: item.width || '300px' }"
          ></el-input>
          <i class="el-icon-loading input-loading" v-show="item.loading"></i>
          <span
            class="supp-text"
            v-if="item.supplementaryInstruction && showSupplementaryInstruction"
            >用户剩余上课周期{{ surplusTime }}</span
          >
        </template>
        <!-- textarea -->
        <template v-if="item.type === 'textarea'">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            :placeholder="item.placeholder"
            v-model="formData[item.model]"
            maxlength="200"
            :style="{ width: item.width || '300px' }"
            show-word-limit
          >
          </el-input>
        </template>
      </el-form-item>
      <el-form-item label="附件" prop="attsUrl">
        <el-upload
          action=""
          list-type="picture-card"
          multiple
          :limit="3"
          :file-list="fileListC"
          :on-exceed="onExceed"
          :http-request="uploadAll"
          :on-preview="onPreview"
          :on-change="onChange"
          :before-remove="beforeRemove"
        >
          <div slot="tip" class="el-upload__tip">提示信息内容告知</div>
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('adjustForm')">
          提交
        </el-button>
        <el-button @click="resetForm('adjustForm')"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <!-- 上传文件的预览弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'
import UploadFile from '@/utils/uploadFiles' // 上传公共方法(单文件上传)
import {
  SUP_LEVEL_ALL,
  SUP_LEVEL_LIST_LOWER,
  SUP_LEVEL_LIST_UPPER,
  courseLevelReplace,
} from '@/utils/supList'

export default {
  name: 'AdjustClass',
  components: {
    SearchPhone,
  },
  // 学员详情跳转来审批query lk
  async mounted() {
    if (this.$route.query && this.$route.query.cellphone) {
      // 显示手机号
      this.$refs.searchPhone[0].input = this.$route.query.cellphone
      // 手机号查uid
      const {
        data: { blurrySearch },
      } = await this.$http.RefundApproval.getUid_lk({
        mobile: this.$route.query.cellphone,
      }).catch((err) => {
        this.$message.error('跳转来的手机号获取uid失败')
      })
      if (blurrySearch && blurrySearch[0] && blurrySearch[0].id) {
        this.formData.userId = blurrySearch[0].id // 保存uid
        this.renderOrderList() // uid获取订单list
      } else {
        this.$message.warning('跳转来的手机号没有uid')
      }
    }
  },
  data() {
    return {
      selectClass: '',
      fileListC: [],
      dialogImageUrl: '', // 上传文件的预览url
      dialogVisible: false, // 上传文件的预览弹窗显隐开关
      // 调期调级调课：1/2/3
      adjustType: this.$route.query.adjustType - 0,
      // 最终显示的模版数据
      showData: {},
      // 数据校验
      formRules: {
        userId: [
          {
            validator: (rule, value, callback) => {
              this.validatePhone(rule, value, callback)
            },
            trigger: ['blur', 'change'],
          },
        ],
        orderId: [
          { required: true, message: '请选择关联订单', trigger: 'change' },
        ],
        currentStartClassDate: [
          { required: true, message: '请选择当前开课日期', trigger: 'change' },
        ],
        targetStage: [
          { required: true, message: '请选择当前开课日期', trigger: 'change' },
        ],
        currentPeriod: [
          { required: true, message: '请选择已上课周期', trigger: 'change' },
        ],
        targetSup: [
          { required: true, message: '请选择申请调级级别', trigger: 'change' },
        ],
        currentClassName: [
          { required: true, message: '请选择当前班级', trigger: 'change' },
        ],
        attsUrl: [
          { required: true, message: '请选择上传的附件', trigger: 'change' },
        ],
        // targetClassName: [
        //   { required: true, message: '请选择班级', trigger: 'change' },
        // ],
        adjustReason: [{ required: true, message: '', trigger: 'change' }],
      },
      // 公共的formData部分
      formData: {
        userId: '', // 用户id
        orderId: '', // 订单id
        adjustReason: '', // 理由
        targetClassName: '', // 选择班级名称
        targetClassId: '', // 选择班级id
        attsUrl: '',
      },
      // 调期报错
      adjustDateError: false,
      // 调级-已上课周期的补充说明的显示控制
      showSupplementaryInstruction: false,
      // 调级-已上课周期的补充说明的数据
      surplusTime: '',
      // 调级-当前级别
      currentLevel: '',
      // 最终提交的数据
      submitData: {},
      // 方法集
      functionsList: {
        dateStartClassDate: 'getCurrentClassDate',
        dateAdjustClassDateSecond: 'getAdjustStartClassDateList',
        dateAdjustClassDateFrist: 'getDonePeriodicClass',
        dateChooseClass: 'getChooseClassList',
        levelDonePeriodicClass: 'getDonePeriodicClass',
        classCurrentClass: 'getDonePeriodicClass',
        classChooseClass: 'getChooseClassList',
        classChooseSystem: 'getChooseSystemList',
      },
      adjustLoading: false,
      // 调期的模版数据
      adjustDateDefault: {},
      // 调级的模版数据
      adjustLevelDefault: {},
      // 调班的模版数据
      adjustClassDefault: {},
      // 新增接口数据
      newData: {},
      teacherId: null,
    }
  },
  created() {
    // 调期的模版数据
    this.adjustDateDefault = {
      title: '新建调期申请',
      content: [
        {
          labelText: '选择用户:',
          type: 'input',
          autocomplete: true,
          model: 'userId',
        },
        {
          labelText: '关联订单:',
          type: 'select',
          width: '450px',
          placeholder: '请选择订单',
          model: 'orderId',
          loading: false,
          options: [
            {
              value: '0',
              label: '请先选择用户',
              disabled: true,
            },
          ],
        },
        {
          labelText: '当前开课日期:',
          type: 'input',
          disabled: true,
          model: 'currentStartClassDate',
          loading: false,
        },
        {
          labelText: '调整开课日期:',
          type: 'select',
          model: 'targetStage',
          loading: false,
          options: [
            {
              value: '0',
              label: '请先选择关联订单',
              disabled: true,
            },
          ],
        },
        {
          labelText: '选择班级:',
          type: 'radio',
          disabled: true,
          model: 'selectClass',
          loading: false,
        },
        {
          labelText: '',
          type: 'select',
          model: 'targetClassName',
          loading: false,
          options: [
            {
              value: '0',
              label: '请先选择关联订单',
              disabled: true,
            },
          ],
        },
        {
          labelText: '调期理由:',
          type: 'textarea',
          width: '450px',
          placeholder: '请输入内容',
          model: 'adjustReason',
        },
      ],
    }
    // 调级的模版数据
    this.adjustLevelDefault = {
      title: '新建调级申请',
      content: [
        {
          labelText: '选择用户:',
          type: 'input',
          autocomplete: true,
          placeholder: '手机号搜索',
          model: 'userId',
        },
        {
          labelText: '关联订单:',
          type: 'select',
          width: '450px',
          placeholder: '请选择订单',
          model: 'orderId',
          loading: false,
          options: [
            {
              value: '0',
              label: '请先选择用户',
              disabled: true,
            },
          ],
        },
        {
          labelText: '已上课周期:',
          type: 'input',
          supplementaryInstruction: true,
          disabled: true,
          loading: false,
          model: 'currentPeriod',
        },
        {
          labelText: '申请调级级别:',
          type: 'select',
          model: 'targetSup',
          options: [
            {
              value: '0',
              label: '请先选择关联订单',
              disabled: true,
            },
          ],
        },
        {
          labelText: '选择班级:',
          type: 'select',
          model: 'targetClassName',
          loading: false,
          options: [
            {
              value: '0',
              label: '请先选择关联订单',
              disabled: true,
            },
          ],
        },
        {
          labelText: '调级理由:',
          type: 'textarea',
          width: '450px',
          placeholder: '请输入内容',
          model: 'adjustReason',
        },
      ],
    }
    // 调班的模版数据
    this.adjustClassDefault = {
      title: '新建调班申请',
      content: [
        {
          labelText: '选择用户:',
          type: 'input',
          autocomplete: true,
          placeholder: '手机号搜索',
          model: 'userId',
        },
        {
          labelText: '关联订单:',
          type: 'select',
          width: '450px',
          placeholder: '请选择订单',
          model: 'orderId',
          loading: false,
          options: [
            {
              value: '0',
              label: '请先选择用户',
              disabled: true,
            },
          ],
        },
        {
          labelText: '当前班级:',
          type: 'input',
          disabled: true,
          model: 'currentClassName',
          loading: false,
        },
        {
          labelText: '选择班级:',
          type: 'radio',
          disabled: true,
          model: 'selectClass',
          loading: false,
        },
        {
          labelText: '',
          type: 'select',
          model: 'targetClassName',
          loading: false,
          options: [
            {
              value: '0',
              label: '请先选择关联订单',
              disabled: true,
            },
          ],
        },
        {
          labelText: '调班理由:',
          type: 'textarea',
          width: '450px',
          placeholder: '请输入内容',
          model: 'adjustReason',
        },
      ],
    }
    switch (this.adjustType) {
      // 调期
      case 1:
        // 显示的数据
        this.showData = _.cloneDeep(this.adjustDateDefault)
        // form的数据
        this.formData = Object.assign({}, this.formData, {
          currentStartClassDate: '', // 当前开课日期
          targetStage: '', // 调整开课日期
        })
        // rule
        this.formRules.adjustReason[0].message = '请输入调期理由'
        break
      // 调级
      case 2:
        this.showData = _.cloneDeep(this.adjustLevelDefault)
        this.formData = Object.assign({}, this.formData, {
          currentPeriod: '',
          targetSup: '',
        })
        // rule
        this.formRules.adjustReason[0].message = '请输入调级理由'
        break
      // 调课
      case 3:
        this.showData = _.cloneDeep(this.adjustClassDefault)
        this.formData = Object.assign({}, this.formData, {
          currentClassName: '',
        })
        // rule
        this.formRules.adjustReason[0].message = '请输入调班理由'
        break
    }
  },
  watch: {
    'newData.teamId': {
      immediate: true,
      deep: true,
      async handler(newValue) {
        if (newValue) {
          this.initData({ id: newValue })
        }
      },
    },
    selectClass(newValue) {
      if (!this.formData.orderId) {
        this.$message.error('请优先选择订单')
        return false
      }
      if (newValue === '0') {
        this.commonSelectHandleFunction(
          'classChooseClass',
          {
            stage:
              (this.formData.targetStage &&
                this.formData.targetStage.targetTerm) ||
              this.newData.tempSatge,
            sup: this.formData.orderId.tempSup,
          },
          '选择班级列表'
        )
      } else if (newValue === '1') {
        this.commonSelectHandleFunction(
          'classChooseSystem',
          {
            term:
              (this.formData.targetStage &&
                this.formData.targetStage.targetTerm) ||
              this.newData.tempSatge,
            sup: this.formData.orderId.tempSup,
            teamId: this.formData.orderId.teamId,
            saleDepartmentId: this.newData.saleDepartmentId,
            saleDepartmentPid: this.newData.saleDepartmentPid,
            userId: this.formData.userId,
          },
          '选择班级列表'
        )
      }
    },
  },
  methods: {
    singglefileListPromise() {
      const promiseAll = this.fileListC.map((item) =>
        new UploadFile(item.raw).init()
      )
      return promiseAll
    },
    uploadAll() {
      // 文件上传巴拉巴拉
      Promise.all(this.singglefileListPromise())
        .then((res) => {
          // 静态方法all 整体都是resolve返回时
          // this.fileListC = res
          this.formData.attsUrl = res.map((item) => item.fileUrl).join()
        })
        .catch((err) => {})
    },
    // 超过个数限制
    onExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择3个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    // 点击预览文件
    onPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 移除列表文件之前
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 文件变化都捕获
    onChange(file, fileList) {
      this.fileListC = fileList
    },
    // 根据班级ID获取班级详情
    async initData(params) {
      let result = await this.$http.TeamV2.getTeamApproval(params).then(
        (res) => {
          if (res.data.StudentTeam) {
            this.teacherId = res.data.StudentTeam.teacher_id
            this.initDepartment({ id: this.teacherId })
          }
        }
      )
    },
    initDepartment(params) {
      let result = this.$http.TeamV2.getTeacherApproval(params).then((res) => {
        if (res.data.Teacher) {
          this.newData.saleDepartmentId = res.data.Teacher.departmentInfo.id
          this.newData.saleDepartmentPid = res.data.Teacher.departmentInfo.pid
        }
      })
    },
    // 后退
    back() {
      this.$router.push('/approval')
    },
    // searchPhone的返回值
    getSearchPhoneData(data) {
      // console.log('data')

      this.formData.userId = data.userId
      this.formData.userId && this.renderOrderList()
    },
    // 下拉手机号的校验
    validatePhone(rule, value, callback) {
      var phoneNum = this.$refs.searchPhone[0].input
      if (!phoneNum) {
        this.formData.userId = ''
        return callback(new Error('手机号不能为空'))
      }
      if (!/^1[3456789]\d{9}$/.test(phoneNum)) {
        this.formData.userId = ''
        return callback(new Error('请输入正确的手机号'))
      }
      // 手机号输入正确后需要获取到userId，获取userId的是个异步方法getSearchPhoneData(data)，需要从公共组件传值，没法儿用promise，
      // 一时没想到啥好办法- -
      const validateInterval = setInterval(() => {
        if (this.formData.userId) {
          callback()
          clearInterval(validateInterval)
        } else {
          callback(new Error('请选择手机号'))
        }
      }, 200)
    },
    // 获取订单列表数据
    getOrderList() {
      return this.$http.Order.getOrdersByUid(this.formData.userId)
        .then((res) => {
          if (res.payload && res.payload.content.length) {
            return res.payload.content
          } else {
            this.$message({
              message: '该手机号未查询到订单',
              type: 'warning',
            })
            return 'error'
          }
        })
        .catch(() => {
          this.$message({
            message: '获取订单列表请求出错请稍后再试～',
            type: 'warning',
          })
          return 'error'
        })
    },
    // 渲染订单列表数据
    async renderOrderList() {
      const sLen = this.showData.content.length
      let sIndex = 0
      for (let i = 0; i < sLen; i++) {
        if (this.showData.content[i].model === 'orderId') {
          this.showData.content[i].loading = true
          sIndex = i
          break
        }
      }
      const orderData = await this.getOrderList()
      this.showData.content[sIndex].loading = false
      // console.log(orderData)
      if (orderData === 'error') {
        return
      }
      this.showData.content.forEach((item) => {
        if (item.model === 'orderId') {
          item.options = []
          item.stage = []
          item.sup = []
          var check = false
          // 不能直接用foreach的index
          let index = 0
          orderData.forEach((orderItem) => {
            // 只要系统课的
            if (
              (orderItem.regtype === 'RENEW' &&
                orderItem.status === 'COMPLETED') ||
              (orderItem.regtype === 'FIRST_ORDER' &&
                orderItem.status === 'COMPLETED')
            ) {
              item.options.push({
                // 依照补发货取的字段
                label: orderItem.outTradeNo + orderItem.packagesName,
                value: {
                  courseCategory: orderItem.courseCategory,
                  orderId: orderItem.id,
                  outTradeNo: orderItem.outTradeNo,
                  index: index++,
                  tempSatge: orderItem.stage,
                  tempSup: orderItem.sup,
                  orderNo: orderItem.id,
                  teamId: orderItem.lastTeamId,
                },
              })
              item.stage.push(orderItem.stage)
              item.sup.push(orderItem.sup)
              // 有系统课订单则置为true
              check = true
            }
          })
          if (!check) {
            item.options = []
            item.options.push({
              label: '该用户下没有系统订单',
              value: 0,
              disabled: true,
            })
            this.$message({
              message: '该用户下没有系统订单',
              type: 'warning',
            })
          }
        }
      })
    },
    // select change
    // 处理所有需要选择后再走的逻辑
    selectChange(event, data) {
      if (data.labelText != '调整开课日期:') {
        this.newData = data.options[0].value
      }
      if (data.labelText == '关联订单:' || data.labelText == '调整开课日期:') {
        this.formData.targetClassName = ''
        this.formData.targetClassId = ''
      }
      // 选择班级这儿逻辑稍微复杂一些，调班时用户选完订单后即可渲染班级列表，调级时选完订单后还得选申请调级级别，同理调期时还得选了调整开课日期
      this.handleStageAndSupChooseClass(event, data)

      // 如果当前选择的是关联订单，那么就要根据订单获取后续数据
      if (data.model !== 'orderId') {
        return
      }
      // 调期
      if (this.adjustType === 1) {
        // 调期-开课日期
        this.commonSelectHandleFunction(
          'dateStartClassDate',
          { orderNo: event.orderId },
          '当前开课日期'
        )
        // 调期-调整日期
        this.commonSelectHandleFunction(
          'dateAdjustClassDateFrist',
          { orderNo: event.orderId },
          '调整开课日期'
        )
        // 修改调期-选择班级的默认提示
        this.showData.content.forEach((item) => {
          if (item.model === 'targetClassName') {
            item.options[0].label = '请先选择调整开课日期'
          }
        })
      }
      // 调级
      if (this.adjustType === 2) {
        // 调级-已上课周期
        this.commonSelectHandleFunction(
          'levelDonePeriodicClass',
          { orderNo: event.orderId },
          '已上课周期'
        )
        // 修改调级-选择班级的默认提示
        this.showData.content.forEach((item) => {
          if (item.model === 'targetClassName') {
            item.options[0].label = '请先选择申请调级级别'
          }
        })
      }
      // 调班
      if (this.adjustType === 3) {
        // 调班-当前班级
        this.commonSelectHandleFunction(
          'classCurrentClass',
          { orderNo: event.orderId },
          '当前班级'
        )
      }
    },
    handleStageAndSupChooseClass(event, data) {
      // 调期
      if (this.adjustType === 1 && data.model === 'targetStage') {
        this.commonSelectHandleFunction(
          'dateChooseClass',
          {
            stage: this.formData.targetStage.targetTerm,
            sup: this.formData.orderId.tempSup,
          },
          '选择班级列表'
        )
      }
      // 调级
      if (this.adjustType === 2 && data.model === 'targetSup') {
        this.commonSelectHandleFunction(
          'dateChooseClass',
          {
            stage: this.formData.orderId.tempSatge,
            sup: this.formData.targetSup,
          },
          '选择班级列表'
        )
      }
    },
    // 公共方法的具体请求方法
    commonGetDateFunction(name, query, msg) {
      // 获取请求的方法名
      const funcName = this.functionsList[name]
      return this.$http.Approval[funcName](query)
        .then((res) => {
          // 这儿返回的payload有时候是数组有时候是对象
          if (res.payload) {
            // 这儿返回的payload有时候是数组有时候是对象
            if (typeof res.payload === 'object') {
              return res.payload
            } else {
              this.$message({
                message: `获取${msg}失败`,
                type: 'warning',
              })
              return 'error'
            }
          } else {
            this.$message({
              message: `获取${msg}失败`,
              type: 'warning',
            })
            return 'error'
          }
        })
        .catch(() => {
          this.$message({
            message: `获取${msg}请求出错请稍后再试～`,
            type: 'warning',
          })
          return 'error'
        })
    },
    // 根据订单获取后续数据的公共方法
    // name -> 用于对应起来的自定义的key
    // query -> 需要的参数
    // msg -> 报错信息
    // data,event -> 也是后面需要的参数
    async commonSelectHandleFunction(name, query, msg) {
      // 选完订单后的loading
      this.showSelectLoading(name)
      const resData = await this.commonGetDateFunction(name, query, msg)

      this.hideSelectLoading(name)
      // console.log(resData)
      if (resData === 'error') {
        return
      }
      switch (name) {
        case 'dateStartClassDate':
          this.handleStartDate(resData)
          break
        case 'dateAdjustClassDateFrist':
          this.handleAdjustDate(resData)
          break
        case 'dateAdjustClassDateSecond':
          this.handleAdjustDateSecond(resData)
          break
        case 'dateChooseClass':
        case 'classChooseClass':
          this.handleChooseClass(resData)
          break
        case 'levelDonePeriodicClass':
          this.handleDoneClass(resData)
          // 调级-申请调级级别
          this.handleAskforLevel()
          break
        case 'classCurrentClass':
          this.handleCurrentClass(resData)
          break
        case 'classChooseSystem':
          this.handleChooseSystem(resData)
          break
      }
    },
    showSelectLoading(name) {
      switch (name) {
        case 'dateStartClassDate':
          this.showLoadingFun('currentStartClassDate')
          break
        case 'dateAdjustClassDateFrist':
          this.showLoadingFun('targetStage')
          break
        case 'dateChooseClass':
          this.showLoadingFun('targetClassName')
          break
        case 'levelDonePeriodicClass':
          this.showLoadingFun('currentPeriod')
          break
        case 'classCurrentClass':
          this.showLoadingFun('currentClassName')
          break
      }
    },
    hideSelectLoading(name) {
      switch (name) {
        case 'dateStartClassDate':
          this.hideLoadingFun('currentStartClassDate')
          break
        case 'dateAdjustClassDateSecond':
          this.hideLoadingFun('targetStage')
          break
        case 'dateChooseClass':
          this.hideLoadingFun('targetClassName')
          break
        case 'levelDonePeriodicClass':
          this.hideLoadingFun('currentPeriod')
          break
        case 'classCurrentClass':
          this.hideLoadingFun('currentClassName')
          break
      }
    },
    showLoadingFun(key) {
      const selectModel = ['targetStage', 'targetClassName']
      this.showData.content.forEach((item) => {
        if (item.model === key) {
          item.loading = true
          if (selectModel.includes(key)) {
            item.options = [
              {
                value: '0',
                label: '加载中..',
                disabled: true,
              },
            ]
          }
        }
      })
    },
    hideLoadingFun(key) {
      this.showData.content.forEach((item) => {
        if (item.model === key) {
          item.loading = false
        }
      })
    },
    // 当前开课日期
    handleStartDate(resData) {
      // console.log(resData)
      // 当前开课日期大于当前系统时间才可提交
      var courseDay = resData.courseDay - 0
      if (courseDay < new Date().getTime()) {
        this.$message.error('用户订单不符合调期条件')
        this.adjustDateError = true
      }
      var timestamp = new Date(courseDay)
      this.formData.currentStartClassDate = `${timestamp.getFullYear()}-${
        timestamp.getMonth() + 1
      }-${timestamp.getDate()}`
    },
    // 调整开课日期
    handleAdjustDate(resData) {
      // console.log(resData)
      this.formData.orderId.tempSup = resData.currentSuper
      // 后期修改调整开课日期分两个接口，接下来走第二个
      this.commonSelectHandleFunction(
        'dateAdjustClassDateSecond',
        { stage: resData.term },
        '调整开课日期'
      )
    },
    handleAdjustDateSecond(resData) {
      // console.log(resData)
      // 先清空
      this.formData.targetStage = ''
      this.showData.content.forEach((item) => {
        if (item.model === 'targetStage') {
          item.options = []
          resData.forEach((adjustItem, adjustKey) => {
            item.options.push({
              label: adjustItem.periodName,
              value: {
                targetStage: adjustItem.periodName,
                targetTerm: adjustItem.period,
                index: adjustKey,
              },
            })
          })
        }
      })
    },
    // 选择班级
    handleChooseClass(resData) {
      this.formData.targetClassName = ''
      this.showData.content.forEach((item) => {
        if (item.model === 'targetClassName') {
          item.options = []
          resData.forEach((chooseItem, chooseKey) => {
            // 其实只有调班需要做这个判断，但其他的类型没有currentClassId所以无所谓这么判断不会出问题
            if (chooseItem.id !== this.formData.currentClassId) {
              const teamName = courseLevelReplace(chooseItem.teamName)
              item.options.push({
                label: `${teamName}-${chooseItem.teacherRealName}`,
                value: {
                  targetClassName: `${teamName}-${chooseItem.teacherRealName}`,
                  targetClassId: chooseItem.id,
                  index: chooseKey,
                },
              })
            }
          })
          if (!item.options.length) {
            item.options.push({
              label: '暂时没有可以调整的班级',
              value: 0,
              disabled: true,
            })
          }
        }
      })
    },
    // 系统分配
    handleChooseSystem(resData) {
      this.formData.targetClassName = ''
      this.formData.targetClassId = ''
      if (resData) {
        this.formData.targetClassId = resData.id
        this.formData.targetClassName =
          resData.teamName + '-' + resData.teacherRealName
      }
    },
    // 已上课周期
    handleDoneClass(resData) {
      // 记录后面选择班级需要的stage
      this.formData.orderId.tempSatge = resData.term
      // this.formData.currentPeriod = `${resData.currentSuper}${resData.currentLevel}${resData.currentUnit}`

      this.formData.currentPeriod = `${SUP_LEVEL_ALL[resData.currentSuper]}${
        resData.currentLevel
      }${resData.currentUnit}`
      // 记录当前级别
      this.currentLevel = resData.currentSuper
      if (resData.remainingWeek <= 0) {
        return
      }
      this.showSupplementaryInstruction = true
      // 处理具体显示几个几周
      this.surplusTime = ''
      const surplusMonths = Math.floor(resData.remainingWeek / 4)
      const surplusWeeks = resData.remainingWeek % 4
      if (surplusMonths !== 0) {
        this.surplusTime += `${surplusMonths}个月`
      }
      if (surplusWeeks !== 0) {
        this.surplusTime += `${surplusWeeks}周`
      }
    },
    // 申请调级级别
    handleAskforLevel() {
      // 先清空
      this.formData.targetSup = ''
      // const levelList = ['S1', 'S2', 'S3', 'S4', 'S5']
      // levelList.splice(levelList.indexOf(this.currentLevel), 1)
      // this.showData.content.forEach((item) => {
      //   if (item.model === 'targetSup') {
      //     item.options = []
      //     levelList.forEach((lItem) => {
      //       item.options.push({
      //         label: lItem,
      //         value: lItem
      //       })
      //     })
      //   }
      // })
      const levelList =
        this.formData.courseCategory == 0
          ? SUP_LEVEL_LIST_UPPER
          : SUP_LEVEL_LIST_LOWER
      this.showData.content.forEach((item) => {
        if (item.model === 'targetSup') {
          item.options = []
          levelList.forEach((lItem) => {
            item.options.push({
              label: lItem.text,
              value: lItem.id,
            })
          })
        }
      })
    },
    // 调班-当前班级
    handleCurrentClass(resData) {
      this.formData.currentClassId = resData.id
      const teamName = courseLevelReplace(resData.teamName)
      this.formData.currentClassName = `${teamName}-${resData.teacherRealName}`
    },
    // 提交
    async submitForm(formName) {
      if (this.adjustDateError) {
        this.$message.error('用户订单不符合调期条件')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.formData.adjustReason.trim()) {
            this.$message.error('申请理由不能为只输入空格～')
            return
          }
          const subData = this.prepareData(formName)
          // 是我自己加的，传给后端之前删掉
          delete subData.index
          delete subData.tempSatge
          delete subData.tempSup
          // console.log(subData)
          this.handleSubmitNext(subData)
        } else {
          return false
        }
      })
    },
    // 提交前的data处理
    prepareData(formName) {
      // userinfo的取值照搬补发货的
      const userinfo = JSON.parse(localStorage.getItem('staff'))
      // 补全缺少的值
      this.submitData = Object.assign({}, this.formData, {
        applyDepartment: userinfo.department, // 申请人部门
        applyId: userinfo.id, // 申请人id
        applyName: userinfo.realName || userinfo.name, // 申请人姓名
        adjustReason: this.formData.adjustReason.trim(),
        flowType:
          this.adjustType === 1
            ? 'ADJUSTMENT_STAGE'
            : this.adjustType === 2
            ? 'ADJUSTMENT_SUP'
            : 'ADJUSTMENT_CLASS', // 类型
        userTel: this.$refs.searchPhone[0].input, // 用户电话
        assignType: this.selectClass,
      })
      // 有些form的属性是对象，摊平
      this.curryFromData()
      return this.submitData
    },
    // 把子对象拍平
    curryFromData() {
      Object.keys(this.submitData).forEach((item) => {
        if (
          Object.prototype.toString.call(this.submitData[item]) ===
          '[object Object]'
        ) {
          const oItem = this.submitData[item]
          Object.keys(oItem).forEach((childItem) => {
            this.submitData[childItem] = oItem[childItem]
          })
        }
      })
    },
    // 提交成功后跳转路由
    async handleSubmitNext(subData) {
      this.adjustLoading = true
      const result = await this.submitFun(subData)
      this.adjustLoading = false
      if (result === 'success') {
        this.$router.push({
          path: '/approval',
          params: { activeApprove: 'second' },
        })
      }
    },
    // 提交数据的具体接口方法
    submitFun(subData) {
      return this.$http.Approval.adjustApply(subData)
        .then((res) => {
          // console.log(res)
          if (res.code === 0 && res.status === 'OK') {
            return 'success'
          } else {
            return 'error'
          }
        })
        .catch(() => {
          this.$message({
            message: '提交请求出错请稍后再试～',
            type: 'warning',
          })
          return 'error'
        })
    },
    // 重置部分数据
    resetPartOfFormData() {
      Object.keys(this.formData).forEach((item) => {
        this.formData[item] =
          item === 'userId' || item === 'adjustReason'
            ? this.formData[item]
            : ''
      })
      // 隐藏提示
      this.showSupplementaryInstruction = false
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      // 手动清空手机号
      this.$refs.searchPhone[0].input = ''
      // 隐藏提示
      this.showSupplementaryInstruction = false
      // 清空所有下拉项
      this.showData = {}
      switch (this.adjustType) {
        // 调期
        case 1:
          // 显示的数据
          this.showData = _.cloneDeep(this.adjustDateDefault)
          break
        // 调级
        case 2:
          this.showData = _.cloneDeep(this.adjustLevelDefault)
          break
        // 调课
        case 3:
          this.showData = _.cloneDeep(this.adjustClassDefault)
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.adjustModule {
  background-color: #fff;
  margin: 10px;
  height: calc(100vh - 70px);
  overflow-y: auto;
  .title {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f0f1f2;
    i.back-icon {
      display: inline-block;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      border: 1px solid #ddd;
      margin: 0 20px;
      text-align: center;
      line-height: 19px;
      color: #ddd;
      vertical-align: middle;
      cursor: pointer;
    }
    .title-text {
      margin-left: 10px;
    }
  }
  .adjust-form {
    padding: 0 50px;
    margin-top: 30px;
    /deep/ .el-form-item__content {
      margin-left: 200px !important;
    }
    .search-phone-class {
      width: 200px;
      /deep/ .el-input--mini {
        .el-input__inner {
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .supp-text {
      margin-left: 15px;
      color: red;
      font-size: 12px;
    }
    .input-loading {
      margin-left: 10px;
      font-size: 18px;
      color: #aaa;
    }
  }
}
</style>
