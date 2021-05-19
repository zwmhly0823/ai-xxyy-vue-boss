<!--
 * @Author: liuzhiyuan
 * @LastEditors: liuzhiyuan
-->
<template>
  <div style="padding: 10px">
    <el-form
      :model="contractFrom"
      ref="contractFrom"
      label-width="130px"
      size="mini"
      class="contract-from"
      :rules="rules"
      :disabled="flag == 1 ? true : false"
    >
      <div class="tip">
        {{ flag == 1 ? '合同详情' : flag == 2 ? '编辑合同' : '新建合同' }}
      </div>
      <el-form-item prop="contractName" label="合同名称" style="width: 320px">
        <el-input
          :disabled="isDisabled"
          v-model="contractFrom.contractName"
          placeholder="请输入合同名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="collaboratorName"
        label="合作方简称"
        style="width: 320px"
      >
        <el-input
          v-model="contractFrom.collaboratorName"
          placeholder="请输入合作方简称"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="contractBody"
        label="对方合同主体全称"
        style="width: 320px"
      >
        <el-input
          :disabled="isDisabled"
          v-model="contractFrom.contractBody"
          placeholder="请输入对方合同主体全称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="linkName" label="签约方联系人" style="width: 320px">
        <el-input
          v-model="contractFrom.linkName"
          placeholder="请输入签约方联系人"
        ></el-input>
      </el-form-item>
      <el-form-item prop="linkPhone" label="联系人电话" style="width: 320px">
        <el-input
          v-model="contractFrom.linkPhone"
          placeholder="请输入联系人电话"
        ></el-input>
      </el-form-item>
      <el-form-item prop="time" label="合同有效期">
        <el-date-picker
          v-model="contractFrom.time"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="签订日期"
          end-placeholder="终止日期"
        >
          <!-- :picker-options="pickerOptions" -->
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="contractType" label="合同类型" style="width: 320px">
        <el-select
          class="item-style"
          :disabled="isDisabled"
          v-model="contractFrom.contractType"
          filterable
          :reserve-keyword="true"
          size="mini"
          clearable
          placeholder="选择合同类型"
        >
          <el-option
            v-for="item in contractTypeList"
            :key="item.id"
            :label="item.describe"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可售套餐" required style="width: 740px">
        <div v-if="contractPriceDetailList.length === 0">
          <el-tag
            style="border: 1px dashed #409eff; cursor: pointer"
            effect="plain"
            @click="dialogVisible = true"
            >选择套餐</el-tag
          >
        </div>
        <div v-else>
          <el-table :data="contractPriceDetailList" style="width: 100%">
            <el-table-column prop="packageName" label="套餐名称" width="130">
            </el-table-column>
            <el-table-column label="课时数" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.classHour + '周' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="合同结算课单价（元）" width="140">
              <template slot-scope="scope">
                <span>{{ scope.row.contractPrice + '元' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="实际结算课单价（元）" width="140">
              <template slot-scope="scope">
                <span>{{ scope.row.settlePrice + '元' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单入库价格（元）" width="130">
              <template slot-scope="scope">
                <span>{{
                  scope.row.orderPrice === '0'
                    ? '0元'
                    : '套餐价格' + scope.row.orderPrice + '元'
                }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            size="small"
            class="checkGoods"
            :disabled="isDisabled"
            @click="dialogVisible = true"
            >更换商品</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="合同附件" prop="attsUrl">
        <el-upload
          style="width: 270px"
          ref="upload"
          action=""
          accept=".docx, .doc, .pdf"
          class="manageclass-upload"
          :headers="headers"
          :http-request="upload"
          :on-change="handleChange"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
            :disabled="uploading"
            >选取文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            :disabled="uploading"
            >上传到服务器</el-button
          >
          <div slot="tip" class="el-upload__tip">请上传合同pdf、word附件</div>
        </el-upload>
        <div v-if="(flag == 1 || flag == 2) && contractFrom.fileAddress">
          <span class="editStyle" @click="onUpload">下载附件</span>
        </div>
      </el-form-item>
    </el-form>

    <div class="bottom_choose">
      <el-button size="mini" @click="cannelOpt">取消</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="saveContract('contractFrom')"
        v-if="flag != 1"
        >确认</el-button
      >
    </div>
    <!-- 弹框 套餐 -->
    <el-dialog title="选择售卖套餐" :visible.sync="dialogVisible">
      <el-table
        ref="listDom"
        :data="set_mealList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45"> </el-table-column>
        <el-table-column prop="packageName" label="套餐名称"> </el-table-column>
        <el-table-column label="课时数" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.classHour + '周' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合同结算课单价（元）">
          <template slot="header">
            <div>
              <span>合同结算课单价（元）</span>
              <el-tooltip placement="top">
                <div slot="content">每单结算给乙方的推广服务费；</div>
                <i class="el-icon-question" style="font-size: 17px"></i>
              </el-tooltip>
            </div>
          </template>
          <template slot-scope="scope">
            <el-input-number
              style="width: 100px"
              size="small"
              :disabled="scope.row.isDisabled"
              :controls="false"
              :min="0"
              :max="9999.99"
              :precision="2"
              v-model.number="scope.row.contractPrice"
              clearable
              placeholder="价格（元）"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="实际结算课单价（元）">
          <template slot="header">
            <div>
              <span>实际结算课单价（元）</span>
              <el-tooltip placement="top">
                <div slot="content">
                  每单公司实际可结算的课单价费用。<br />“实际结算课单价=推广套餐金额➖推广服务费”；<br />（例：推广49元体验课，每单结算30元作为乙方推广服务费，<br />那么实际结算金额=19元“实际结算课单价=推广套餐金额-<br />推广服务费”；）
                </div>
                <i class="el-icon-question" style="font-size: 17px"></i>
              </el-tooltip>
            </div>
          </template>
          <template slot-scope="scope">
            <el-input-number
              style="width: 100px"
              size="small"
              :disabled="scope.row.isDisabled"
              :controls="false"
              :min="0"
              :max="9999.99"
              :precision="2"
              v-model.number="scope.row.settlePrice"
              clearable
              placeholder="价格（元）"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="订单入库价格（元）">
          <template slot="header">
            <div>
              <span>订单入库价格（元）</span>
              <el-tooltip placement="top">
                <div slot="content">
                  订单入库金额只能是0或套餐价格，<br />以实际结算课单价为准；
                </div>
                <i class="el-icon-question" style="font-size: 17px"></i>
              </el-tooltip>
            </div>
          </template>
          <template slot-scope="scope">
            <el-radio-group :disabled="scope.row.isDisabled" v-model="scope.row.price">
              <el-radio :label="0">0元</el-radio>
              <el-radio :label="scope.row.radioSel">{{'套餐价格' + scope.row.radioSel + '元'}}</el-radio>
            </el-radio-group>
            <!-- <span>{{
              scope.row.orderPrice === '0'
                ? '0元'
                : '套餐价格' + scope.row.price + '元'
            }}</span> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="btn-group">
        <el-button size="mini" @click="dialogHide">取消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="submitSet_meal"
          v-show="flag !== '1'"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import uploadFile from '@/utils/upload' // 上传公共方法
import { getAppSubject } from '@/utils/index'
export default {
  name: 'contractManageAdd',
  data() {
    return {
      contractTypeList: [], // 合同类型
      multipleSelection: [], // 弹框选择数据
      dialogVisible: false, // 弹框显示
      isDisabled: false, // 编辑显示为true
      flag: '',
      fileList: [],
      headers: { 'Content-Type': 'multipart/form-data' },
      uploading: false,
      id: '', // 合同ID
      contractFrom: {
        subject: getAppSubject(),
        createUser: JSON.parse(localStorage.getItem('staff')).realName,
        contractName: '', // 合同名称
        contractBody: '', // 对方合同主体全称
        collaboratorName: '', // 合作方简称
        linkName: '', // 签约方联系人
        linkPhone: '', // 联系人电话
        startTime: '',
        endTime: '',
        contractType: '', // 合同分类
        time: [],
        fileAddress: '',
        fileName: '',
      },
      contractPriceDetailList: [], // 结算价
      // 套餐价格，，，对应packageName,packageId,classHour,price
      // 前端写死套餐，变更需要同时更改 ../components/contractDrawer.vue 中set_mealList
      set_mealList: [
        {
          packageName: '29元单周体验课',
          // 双周体验课
          packageId: '502',
          classHour: '1',
          contractPrice: undefined,
          settlePrice: undefined,
          orderPrice: '',
          isDisabled: true,
          price: '29',
          radioSel:'29'
        },
        {
          packageName: '29元双周体验课',
          packageId: '503',
          classHour: '2',
          contractPrice: undefined,
          settlePrice: undefined,
          orderPrice: '',
          isDisabled: true,
          price: '29',
          radioSel: '29',
        },
        {
          packageName: '9.9元双周体验课',
          packageId: '505',
          classHour: '2',
          contractPrice: undefined,
          settlePrice: undefined,
          orderPrice: '',
          isDisabled: true,
          price: '9.9',
          radioSel: '9.9',

        },
        {
          packageName: '19元单周体验课',
          packageId: '506',
          classHour: '1',
          contractPrice: undefined,
          settlePrice: undefined,
          orderPrice: '',
          isDisabled: true,
          price: '19',
          radioSel: '19',

        },
        {
          packageName: '9.9元单周体验课',
          packageId: '507',
          classHour: '1',
          contractPrice: undefined,
          settlePrice: undefined,
          orderPrice: '',
          isDisabled: true,
          price: '9.9',
          radioSel: '9.9',

        },
      ],
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
      //   }
      // },
      rules: {
        contractName: [
          { required: true, message: '请输入合同名称', trigger: 'blur' },
          { max: 30, message: '合同名称最多30个字符', trigger: 'blur' },
        ],
        collaboratorName: [
          { required: false, message: '请输入合作方简称', trigger: 'blur' },
          { max: 30, message: '合作方简称最多30个字符', trigger: 'blur' },
        ],
        contractBody: [
          {
            required: true,
            message: '请输入对方合同主体全称',
            trigger: 'blur',
          },
          { max: 30, message: '对方合同主体全称最多30个字符', trigger: 'blur' },
        ],
        linkName: [
          { max: 20, message: '签约方联系人最多30个字符', trigger: 'change' },
        ],
        linkPhone: [
          { max: 30, message: '手机号码最多30个字符', trigger: 'blur' },
        ],
        time: [
          { required: false, message: '请选择合同有效期', trigger: 'blur' },
        ],
        contractType: [
          { required: true, message: '请选择合同类型', trigger: 'change' },
        ],
      },
    }
  },
  components: {},
  watch: {
    'contractFrom.contractType': {
      handler: function (val) {
        // if (val === 'EXCHANGE') {
        //   this.set_mealList.push({
        //     packageName: '中国传统文化艺术体验课',
        //     packageId: '54',
        //     classHour: '2',
        //     contractPrice: undefined,
        //     settlePrice: undefined,
        //     orderPrice: '',
        //     isDisabled: true,
        //     price: '68',
        //   })
        // } else {
        // 删除列表中的数据
        // this.set_mealList.forEach((item, i) => {
        //   if (item.packageId === '54') {
        //     this.set_mealList.splice(i, 1)
        //   }
        // })
        // 删除列表中选中的数据
        // this.contractPriceDetailList.forEach((item, i) => {
        //   if (item.packageId === '54') {
        //     this.set_mealList.splice(i, 1)
        //   }
        // })
        // }
      },
    },
    set_mealList: {
      handler: function (val) {
        val.forEach((item, i) => {
          // 赋值订单入库价格 单选框
          if (item.settlePrice === 0) {
            item.orderPrice = '0'
          } else if (item.settlePrice > 0) {
            // item.settlePrice =
            //   +item.settlePrice.toString().match(/^\d*(\.?\d{0,2})/g)[0] || null
            item.orderPrice = item.price
          }
        })
      },
      deep: true,
    },
    multipleSelection: {
      // 选择复选框，取消disabled
      handler: function (val) {
        const arr = this.set_mealList
        const newArr = val.map((item, i) => item.packageId)
        arr.forEach((item) => {
          if (newArr.includes(item.packageId)) {
            item.isDisabled = false
          } else {
            item.isDisabled = true
          }
        })
      },
    },
  },
  created() {
    this.id = this.$route.query.id
    if (this.id) {
      this.getContractById()
    }

    // flag = 2 编辑  1详情 0新建
    this.flag = this.$route.query.flag
    // eslint-disable-next-line
    if (this.flag == 2) {
      this.isDisabled = true
    }
    // 获取列表
    this.getList()
  },
  mounted() {},
  computed: {},
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    submitUpload(file, filelist) {
      this.$refs.upload.submit()
    },
    // 套餐弹框取消
    dialogHide() {
      this.dialogVisible = false
    },
    // 套餐弹框确定
    submitSet_meal() {
      const checkArr = this.multipleSelection
      if (checkArr.length < 1) {
        this.$message.warning('请选择售卖套餐')
        return false
      } else {
        for (let i = 0; i < checkArr.length; i++) {
          if (!checkArr[i].contractPrice && checkArr[i].contractPrice !== 0) {
            this.$message.warning(
              `请输入${checkArr[i].packageName}合同结算课单价（元）`
            )
            return false
          }
          if (!checkArr[i].settlePrice && checkArr[i].settlePrice !== 0) {
            this.$message.warning(
              `请输入${checkArr[i].packageName}实际结算课单价（元）`
            )
            return false
          }
        }
      }
      this.contractPriceDetailList = this.multipleSelection
      this.dialogVisible = false
    },
    // 选择表格
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 下载
    onUpload() {
      const url = this.contractFrom.fileAddress
      var downloadElement = document.createElement('a')
      downloadElement.href = url
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
    },
    // 上传附件
    upload(file) {
      this.uploading = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      uploadFile(file, false, 5, 'xiaoxiongmeishuContract/', false)
        .then((res) => {
          console.log('res----', res)
          const url = res.fileUrl // 文件remote地址
          this.contractFrom.fileAddress = url
          this.contractFrom.fileName = res.file.file.name // 文件名称
        })
        .finally(() => {
          loading.close()
          this.uploading = false
        })
    },
    // 保存
    saveContract(contractFrom) {
      // 编辑
      if (this.flag === '2') {
        this.modifyContract()
        return
      }
      this.$refs[contractFrom].validate((valid) => {
        if (valid) {
          if (
            this.contractPriceDetailList &&
            this.contractPriceDetailList.length === 0
          ) {
            this.$message.error('可售套餐不能为空！')
            return false
          }
          // 日期赋值
          if (this.contractFrom.time && this.contractFrom.time.length > 0) {
            this.contractFrom.startTime = this.contractFrom.time[0]
            this.contractFrom.endTime = this.contractFrom.time[1]
          }
          const obj = {
            contract: this.contractFrom,
            contractPriceDetailList: this.contractPriceDetailList,
          }
          this.$http.Express.saveAndUpdatecontract(obj).then((res) => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              this.$router.push({
                path: '/contractManage',
              })
            } else {
              this.$message.error('创建失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    cannelOpt() {
      this.$router.push({ path: '/contractManage' })
    },
    // 编辑合同
    modifyContract() {
      // 日期赋值
      if (this.contractFrom.time && this.contractFrom.time.length > 0) {
        this.contractFrom.startTime = this.contractFrom.time[0] + ''
        this.contractFrom.endTime = this.contractFrom.time[1] + ''
      }
      const obj = { ...this.contractFrom, id: this.id }
      this.$http.Express.getmodifyContractById(obj).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功')
          this.$router.push({
            path: '/contractManage',
          })
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    // 合同详情
    getContractById() {
      this.$http.Express.getContractById(this.id).then((res) => {
        if (res.code === 0) {
          Object.keys(this.contractFrom).forEach((item) => {
            this.contractFrom[item] = res.payload.contract[item]
          })
          // 可售套餐数据
          this.contractPriceDetailList = res.payload?.contractPriceDetailList
          // 日期赋值
          if (+this.contractFrom.startTime || +this.contractFrom.endTime) {
            this.contractFrom.time = []
            this.contractFrom.time[0] = this.contractFrom.startTime
            this.contractFrom.time[1] = this.contractFrom.endTime
          }

          // 文件地址
          if (res.payload.contract.fileAddress)
            this.fileList.push({
              url: res.payload.contract.fileAddress,
              name: res.payload.contract.fileName,
            })
        }
      })
    },
    getList() {
      // 获取渠道类型
      this.$http.Express.getContractInfo().then((res) => {
        if (res.code === 0 && res.payload?.contractTypeList) {
          this.contractTypeList = res.payload?.contractTypeList
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.contract-from {
  padding: 30px;
  background-color: #fff;

  .tip {
    margin-bottom: 20px;
  }

  .form_fileAddress {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 178px;
    overflow: hidden;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar_uploader_icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .tip {
    font-size: 12px;
    color: #606266;
    margin-top: 7px;
  }
  .del {
    position: absolute;
    right: -60px;
    top: 118px;
  }
  .add {
    width: 100%;
    color: deepskyblue;
  }
}

.bottom_choose {
  background-color: #fff;
  margin: -20px 0;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
}
.btn-group {
  text-align: center;
  margin: 10px 0;
}
/deep/ .el-table__header-wrapper .el-checkbox {
  display: none;
}
.checkGoods {
  position: absolute;
  right: -90px;
  top: 11px;
}
.editStyle {
  color: #2a75ed;
  cursor: pointer;
  line-height: 28px;
  font-size: 14px;
  font-weight: 500;
}
/** 去除input输入框样式 */
/deep/ input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
