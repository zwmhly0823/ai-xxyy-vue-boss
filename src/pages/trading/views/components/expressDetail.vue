<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-15 15:18:49
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-02 17:44:50
 -->
<template>
  <div class="container express-detail">
    <el-drawer
      class="drawer-detail "
      :visible.sync="drawer"
      :direction="direction"
      :modal="modal"
      :with-header="false"
      size="40%"
    >
      <div class="what">
        <div class="left-click" v-if="leftRow.length > 1">
          <div
            @click="getexpressInformation(item, i)"
            :class="[{ active: isActive == i }, 'inactive']"
            :key="i"
            v-for="(item, i) in leftRow"
          >
            {{ item.product_name }}
          </div>
        </div>
        <div class="line" v-if="leftRow.length > 1"></div>
        <div class="right-detail">
          <div class="img" @click="handleClose">
            <i class="el-icon-close"></i>
          </div>

          <div class="line-time">
            <div class="logistics">
              <span>商品信息：{{ this.expressInformation.product_name }}</span>
              <span>
                物流公司：{{ this.expressInformation.express_company }}
              </span>
              <span>快递单号：{{ this.expressInformation.express_nu }}</span>
              <!-- 仅从物流页面进入详情是显示修改按钮 -->
              <el-button
                v-if="transferExpress"
                class="edit-btn"
                size="mini"
                type="info"
                plain
                @click="isShowEditStatus = true"
              >
                修改
              </el-button>
              <!-- 仅从物流页面进入详情时 且 物流状态为待发货时(express_status为'1')的情况显示回填单号按钮 -->
              <el-button
                v-if="transferExpress && transferExpress.express_status == '1'"
                class="edit-no-btn"
                size="mini"
                type="info"
                plain
                @click="isShowEditNo = true"
              >
                回填单号
              </el-button>
            </div>
          </div>
          <div class="horizontal-line"></div>
          <div class="waitFor" v-if="waitFor">快递待揽收</div>
          <el-timeline v-if="!isShowNew" class="right-timeline">
            <el-timeline-item
              v-for="(value, index) in activities"
              :key="index"
              :color="color"
            >
              <div class="statebox">
                <div class="statebox" v-for="(item, key) in value" :key="key">
                  <div class="state" v-if="key === 0">
                    {{ item.status || '揽收' }}
                  </div>
                  <div class="content">
                    {{ item.context || item.opeRemark }}
                  </div>
                  <div class="time">{{ item.time || item.opeTime }}</div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
          <el-timeline v-if="isShowNew" class="right-timeline">
            <el-timeline-item
              v-for="(items, index) in expressDetailsInfo"
              :key="index"
              :color="color"
            >
              <div class="status">
                {{ items.centerStatus }}
              </div>
              <div class="statebox">
                <div
                  class="statebox"
                  v-for="(item, key) in items.data"
                  :key="key"
                >
                  <div class="content">
                    {{ item.context }}
                  </div>
                  <div class="time">{{ item.time }}</div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>
    <!-- 修改物流状态弹窗 -->
    <el-dialog
      title="修改物流状态"
      :visible.sync="isShowEditStatus"
      @close="editClose"
      width="500px"
    >
      <div class="express-info">
        <span>商品信息：{{ this.expressInformation.product_name }}</span>
        <span>物流公司：{{ this.expressInformation.express_company }}</span>
        <span>快递单号：{{ this.expressInformation.express_nu }}</span>
      </div>
      <el-form
        ref="form"
        class="edit-area"
        :model="editInfo"
        label-width="85px"
      >
        <el-form-item>
          <span slot="label" class="must">更改为:</span>
          <el-radio-group
            v-model="editInfo.editExpressStatus"
            size="small"
            @change="changeStatus"
          >
            <el-radio label="DELIVER_WAIT_CONFIRM">下单失败</el-radio>
            <el-radio label="DELIVER_SING">已签收</el-radio>
            <!-- <el-radio label="INVALID">设为无效</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="must">修改原因:</span>
          <el-select v-model="editInfo.editReason" placeholder="请选择活动区域">
            <el-option
              v-for="(item, index) in editReasons"
              :key="index"
              :value="item"
            >
              {{ item }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" v-if="editInfo.editReason == '其它原因'">
          <el-input type="textarea" v-model="editInfo.otherDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit">
          确 定
        </el-button>
        <el-button @click="isShowEditStatus = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 获取物流单号弹窗 -->
    <el-dialog
      title="回填单号"
      :visible.sync="isShowEditNo"
      @close="editExpressNoClose"
      width="550px"
    >
      <div class="express-info">
        <span>商品信息：{{ this.expressInformation.product_name }}</span>
        <span>物流公司：{{ this.expressInformation.express_company }}</span>
        <span>快递单号：{{ this.expressInformation.express_nu }}</span>
      </div>
      <el-form
        ref="expressNoForm"
        class="edit-area demo-ruleForm"
        :model="expressNoInfo"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="快递公司：" prop="expressCompanyNu">
          <el-select
            v-model="expressNoInfo.expressCompanyNu"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in expressCompanyList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="18">
            <el-form-item
              style="width:293px"
              label="快递单号："
              prop="expressNu"
            >
              <el-input v-model="expressNoInfo.expressNu" placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="0">
              <el-button type="info" size="mini" @click="autoGetExpressNo">
                自动获取
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editExpressNo">
          确 定
        </el-button>
        <el-button @click="isShowEditNo = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api/axiosConfig'
// 物流状态修改原因下拉列表数据
const orderFailed = [
  '用户地址异常需重新修改',
  '显示签收实际未签收',
  '用户拒收',
  '派送不成功站点退回',
  '其它原因'
]
const signedIn = ['用户已签收或站点代收', '已转发其他快递', '其它原因']
const setInvalid = ['用户因退费拦截', '其它原因']
export default {
  // 传递来源 如 订单使用  物流使用
  // 需要传递的信息  物流单号 物流商品名称
  props: ['transferExpress', 'order_id'],
  data() {
    return {
      editInfo: {
        editExpressStatus: '',
        editReason: '',
        otherDesc: ''
      },
      expressNoInfo: {
        expressId: '', // 物流id
        expressNu: '', // 物流单号
        expressCompany: '', // 物流公司名称
        expressCompanyNu: '' // 物流公司编号
      },
      editResult: false, // 修改结果
      editReasons: [], // 原因列表
      expressCompanyList: [
        { label: '中通快递', value: 'zhongtong' },
        { label: '京东物流', value: 'jd' },
        { label: '圆通快递', value: 'yuantong' },
        { label: '申通快递', value: 'shentong' },
        { label: '百世快递', value: 'huitongkuaidi' },
        { label: '邮政快递包裹', value: 'youzhengguonei' },
        { label: 'EMS', value: 'ems' },
        { label: '邮政标准快递', value: 'youzhengbk' },
        { label: '顺丰速运', value: 'shunfeng' }
      ],
      rules: {
        expressCompanyNu: [
          { required: true, message: '请选择快递公司', trigger: 'change' }
        ],
        expressNu: [
          { required: true, message: '请输入快递单号', trigger: 'blur' }
        ]
      },
      isShowEditStatus: false, // 是否展示修改状态
      isShowEditNo: false, // 是否展示回填物流单号弹窗
      drawer: false,
      color: '#0bbd87',
      modal: false,
      direction: 'rtl',
      timeLine: false,
      waitFor: false,
      orderInformation: [],
      expressInformation: [],
      activities: [],
      expressDetailsInfo: [], // 从物流中台获取的物流信息
      isActive: 0,
      leftRow: [],
      orderId: '',
      expressNu: '', // 物流单号
      isShowNew: true // 是否展示新物流中台获取的物流数据
    }
  },
  watch: {
    transferExpress(val) {
      this.waitFor = false
      this.activities = []
      this.expressDetailsInfo = []
      this.expressInformation = val
      this.expressNu = this.expressInformation.express_nu
      // const timeNodes = new Date('2020-07-01').getTime()
      // 2020-07-01之后且center_express_id 不等于0  取中台数据
      // if (+val.center_ctime > timeNodes && val.center_express_id !== '0') {
      //   this.getExpressDetails(this.expressNu)
      // } else {
      //   this.expressList(this.expressNu, val.express_status)
      // }

      // 2020-10-02 强哥说 根据delivery_type这个字段区分，0是取快递100的详情，1是取中台的详情
      if (+val.delivery_type === 1) {
        this.getExpressDetails(this.expressNu)
      } else {
        this.expressList(this.expressNu, val.express_status)
      }
    },
    order_id(val) {
      this.waitFor = false
      this.activities = []
      this.orderId = val
      this.getexpressMess(this.orderId)
    }
  },
  methods: {
    // 自动获取物流单号
    autoGetExpressNo() {
      const expressId = this.expressInformation.id
      this.$http.Express.getExpressNuByCenter(expressId)
        .catch((err) => console.log(err))
        .then((res) => {
          // 将获取来的物流信息回显到弹窗 ，如果返回为空则弹窗获取失败
          if (res.payload && Object.keys(res.payload).length !== 0) {
            this.expressNoInfo = res.payload
            const company = this.expressCompanyList.find(
              (item) => item.value === res.payload.expressCompanyNu
            )
            if (company === undefined) {
              this.expressCompanyList.push({
                label: res.payload.expressCompany,
                value: res.payload.expressCompanyNu
              })
            }
          } else {
            this.$message.error('获取失败')
          }
        })
    },
    // 修改物流单号
    editExpressNo() {
      this.$refs.expressNoForm.validate((valid) => {
        if (valid) {
          this.expressNoInfo.expressId = this.expressInformation.id
          this.expressNoInfo.expressCompany = this.expressCompanyList.find(
            (item) => item.value === this.expressNoInfo.expressCompanyNu
          ).label
          this.$http.Express.createExpressNu(this.expressNoInfo)
            .catch((err) => console.log(err))
            .then((res) => {
              if (res.payload) {
                this.$message.success('物流信息更新成功')
                this.isShowEditNo = false
                this.drawer = false
                window.setTimeout(() => {
                  this.$emit('refresh')
                }, 700)
              } else {
                this.$message.error('物流信息更新失败')
              }
            })
        }
      })
    },
    // 关闭回填物流单号弹窗时处理函数
    editExpressNoClose() {
      this.expressNoInfo.expressCompanyNu = ''
      this.expressNoInfo.expressNu = ''
      this.$refs.expressNoForm.resetFields()
    },
    // 物流修改弹窗关闭时处理函数
    editClose() {
      // 关闭时初始化修改数据
      this.editInfo.editExpressStatus = ''
      this.editInfo.editReason = ''
      this.editInfo.otherDesc = ''
      if (!this.editResult) {
        this.$message.error('当前状态未发生变更')
      } else {
        this.editResult = false
      }
    },
    // 修改物流状态
    edit() {
      if (this.editInfo.editExpressStatus === '') {
        this.$message.error('请选择物流状态')
        return
      }
      if (this.editInfo.editReason === '') {
        this.$message.error('请选择修改原因')
        return
      }
      if (
        this.editInfo.editReason === '其它原因' &&
        this.editInfo.otherDesc === ''
      ) {
        this.$message.error('请填写修改原因')
        return
      }
      const expressRemark =
        this.editInfo.editReason === '其它原因'
          ? this.editInfo.otherDesc
          : this.editInfo.editReason
      const operatorId = JSON.parse(localStorage.getItem('staff')).id
      const params = {
        expressId: this.transferExpress.id,
        expressStatus: this.editInfo.editExpressStatus,
        expressRemark,
        operatorId
      }
      this.$http.Express.updateExpressStatus(params).then((res) => {
        if (res.payload) {
          this.editResult = true
          this.isShowEditStatus = false
          this.$message.success('状态修改成功')
        } else {
          this.editResult = false
          this.$message.error('状态修改失败')
          this.isShowEditStatus = false
        }
      })
    },
    // 点击状态单选按钮时修改修改原因列表
    changeStatus(val) {
      this.editInfo.editReason = ''
      this.editInfo.otherDesc = ''
      switch (val) {
        case 'DELIVER_WAIT_CONFIRM': {
          this.editReasons = orderFailed
          break
        }
        case 'DELIVER_SING': {
          this.editReasons = signedIn
          break
        }
        case 'INVALID': {
          this.editReasons = setInvalid
          break
        }
      }
    },
    // 获取物流id 商品信息
    getexpressInformation(item, i) {
      this.isActive = i
      this.expressInformation = item
      // 2020-07-01之后且center_express_id 不等于0 取中台数据
      // const timeNodes = new Date('2020-07-01').getTime()
      // if (+item.center_ctime > timeNodes && item.center_express_id !== '0') {
      //   this.getExpressDetails(item.express_nu)
      // } else {
      //   this.expressList(item.express_nu, item.express_status)
      // }

      // 2020-10-02 强哥说 根据delivery_type这个字段区分，0是取快递100的详情，1是取中台的详情
      if (+item.delivery_type === 1) {
        this.getExpressDetails(item.express_nu)
      } else {
        this.expressList(item.express_nu, item.express_status)
      }
    },
    handleClose() {
      this.drawer = false
    },
    // 获取订单页面物流信息
    getexpressMess(id) {
      // 这里需要传递用户Id来获取
      const queryParams = JSON.stringify(`
      {"bool":{"must":[{"term":{"order_id":${id}}}]}}
      `)
      return axios
        .post('/graphql/v1/toss', {
          query: `{
                  ExpressList(query: ${queryParams}) {
                     id
                      product_name
                      express_company
                      express_nu
                      express_status
                      center_ctime
                      center_express_id
                  }
                }`
        })
        .then((res) => {
          this.leftRow = res.data.ExpressList
          this.getexpressInformation(this.leftRow[0], 0)
        })
    },
    // 获取物流中台物流详情
    getExpressDetails(expressNo) {
      this.$http.Express.getExpressDetails({ expressNo })
        .catch((err) => console.log(err))
        .then((res) => {
          this.isShowNew = true
          if (res.payload && res.payload[0].data.length > 0) {
            this.waitFor = false
            this.expressDetailsInfo = res.payload[0].data
          } else {
            this.expressDetailsInfo = []
            this.waitFor = true
          }
        })
    },
    // 物流列表信息
    expressList(id, expressStatus) {
      this.isShowNew = false
      const lastData = {}
      // 如果是京东物流 且物流状态 expressStatus 为2 请求京东物流接口
      if (id.toString().indexOf('JD') > -1 && expressStatus === '2') {
        this.$http.Express.getExpressDetailJDForAPP(id).then((jdRes) => {
          const tempData =
            (jdRes && jdRes.payload && jdRes.payload[0].data) || []
          if (tempData.length > 0) {
            this.waitFor = false
            tempData.forEach((item, index) => {
              item.status = item.opeTitle
              lastData[index] = []
              lastData[index].push(item)
            })
            this.activities = lastData
          } else {
            this.activities = []
            this.waitFor = true
          }
        })
        return
      }
      this.$http.Express.ExpressList({
        expressNo: id
      })
        .catch((err) => console.log(err))
        .then((res) => {
          const isNull =
            (res.payload &&
              res.payload[0].data.filter((item) => {
                return Object.keys(item).length > 0
              })) ||
            []
          if (res && isNull.length > 0) {
            this.waitFor = false
            res.payload[0].data.forEach((item) => {
              if (item.status === '揽收') {
                lastData.begin = lastData.begin == null ? [] : lastData.begin
                lastData.begin.push(item)
              } else if (
                item.status === '在途' ||
                item.status === '派件' ||
                item.status === '疑难'
              ) {
                lastData.onway = lastData.onway == null ? [] : lastData.onway
                lastData.onway.push(item)
              } else {
                lastData.receive =
                  lastData.receive == null ? [] : lastData.receive
                lastData.receive.push(item)
              }
              this.activities = lastData
            })
          } else {
            this.activities = []
            this.waitFor = true
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  .drawer-detail {
    margin: 50px 10px 10px 10px;
  }
  .what {
    padding: 20px;
    display: flex;
    flex-direction: row;
    .left-click {
      width: 21%;
      display: flex;
      height: 550px;
      flex-direction: column;
      overflow-y: auto;
      .inactive {
        text-align: center;
        padding: 4px;
        background-color: #f2f2f2;
        margin-bottom: 2px;
        cursor: pointer;
      }
      .active {
        color: white;
        text-align: center;
        padding: 4px;
        background-color: #2a75ed;
        margin-bottom: 2px;
      }
    }
    .line {
      margin-left: 10px;
      border-right: 2px solid #f2f2f2;
    }
    .right-detail {
      margin-left: 10px;
      width: 100%;
      height: 700px;
      overflow-y: auto;
      .img {
        position: absolute;
        right: 10px;
        top: 10px;
      }
      .line-time {
        .logistics {
          position: relative;
          display: flex;
          flex-direction: column;
          font-size: 16px;
          span:nth-child(2) {
            margin: 3px 0 3px 0;
          }
          .edit-btn {
            position: absolute;
            right: 0;
            bottom: 0;
          }
          .edit-no-btn {
            position: absolute;
            right: 70px;
            bottom: 0;
          }
        }
      }
      .horizontal-line {
        margin: 15px 0px;
        border-bottom: 1.2px solid #ddd;
      }
      .waitFor {
        text-align: center;
        color: #ccc;
        font-size: 20px;
      }
      .right-timeline {
        .status {
          font-size: 20px;
        }
        .statebox {
          .state {
            font-size: 20px;
          }
          .content {
            margin: 8px;
            color: #666;
            font-size: 14px;
          }
          .time {
            color: #999;
            font-size: 12px;
          }
          margin-bottom: 10px;
        }
        margin-bottom: 20px;
      }
    }
  }
  .express-info {
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    background-color: #f2f2f2;
    padding: 15px;
    display: flex;
    flex-direction: column;
  }
  .edit-area {
    margin-top: 20px;
    span.must::before {
      content: '* ';
      color: red;
    }
  }
}
</style>
<style lang="scss">
.express-detail {
  .el-dialog__body {
    padding-top: 15px;
  }
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: '*';
  }
}
</style>
