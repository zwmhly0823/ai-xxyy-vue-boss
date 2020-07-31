<!--
 * @Descripttion: BOSS小熊
 * @version: 1.0.0
 * @Author: Shasen
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: Shasen
 * @LastEditTime: 2020-07-21 14:42:57
-->
<template>
  <el-row type="flex" class="activity-manage app-main">
    <el-col class="activity-manage-container">
      <el-card class="header">
        <div class="tip" v-if="promotionsId">修改活动</div>
        <div class="tip" v-else>新建活动</div>
        <el-form
          :model="activityFrom"
          ref="activityFrom"
          label-width="100px"
          size="mini"
          class="activity-from"
          :rules="rules"
          :disabled="$route.params.type == 1 ? true : false"
        >
          <el-form-item
            prop="promotionsName"
            label="活动名称"
            style="width:320px;"
          >
            <el-input
              v-model="activityFrom.promotionsName"
              placeholder="请输入活动名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="promotionsType"
            label="活动类型"
            style="width:320px;"
          >
            <el-select
              class="item-style"
              v-model="activityFrom.promotionsType"
              remote
              filterable
              :reserve-keyword="true"
              size="mini"
              clearable
              placeholder="选择模板"
            >
              <el-option
                v-for="item in promotionsType || []"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间" prop="promotionsDate">
            <el-date-picker
              v-model="activityFrom.promotionsDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              :picker-options="expireTimeOption"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="活动范围" prop="trialTerms">
            <el-row style="display:flex;margin-bottom: 10px;">
              <el-checkbox
                label="体验课"
                name="type"
                v-model="isTrial"
                style="margin-right:20px;"
              ></el-checkbox>
              <search-stage
                :record="activityFrom.trialTerms"
                :isDisabled="!isTrial"
                class="search-group-item"
                name="term0"
                placeholder="体验课排期"
                type="0"
                @result="getSchedul('term0', arguments, 0)"
              />
            </el-row>
          </el-form-item>
          <el-form-item label="" prop="systemTerms">
            <el-row style="display:flex">
              <el-checkbox
                label="系统课"
                name="type"
                v-model="isSystem"
                style="margin-right:20px;"
              ></el-checkbox>
              <search-stage
                :record="activityFrom.systemTerms"
                :isDisabled="!isSystem"
                class="search-group-item"
                name="term1"
                placeholder="系统课排期"
                type="1"
                @result="getSchedul('term1', arguments, 1)"
              />
            </el-row>
          </el-form-item>
          <el-form-item label="赠品设置" prop="giftOptionCheck">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="chooseProduct('activityFrom')"
              >选择商品</el-button
            >
            <div
              ref="tableContainer"
              class="tableContainer_"
              v-show="tableData.length"
            >
              <ele-table
                :tableSize="'small'"
                :dataList="tableData"
                :tableHeight="tableHeight"
              >
                <el-table-column
                  label="赠品名称"
                  prop="giftsName"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="赠品类型"
                  prop="giftsType"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="赠品价格"
                  prop="giftsPrice"
                  align="center"
                >
                  <template slot-scope="scope">
                    ¥{{ scope.row.giftsPrice }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="物流单数量"
                  prop="expressCount"
                  align="center"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <div class="editStyle">
                      <el-popconfirm
                        confirmButtonText="YES"
                        cancelButtonText="算了"
                        icon="el-icon-info"
                        iconColor="red"
                        title="你确定要删除该项内容吗？"
                        @onConfirm="confirmDelRow(scope.row, scope.$index)"
                      >
                        <span slot="reference">删除</span>
                      </el-popconfirm>
                    </div>
                  </template>
                </el-table-column>
              </ele-table>
            </div>
          </el-form-item>
          <el-form-item label="活动说明">
            <el-input
              type="textarea"
              style="width:400px"
              v-model="activityFrom.desc"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div class="bottom_choose">
          <el-button size="mini" @click="cannelOpt">取消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="saveActivity('activityFrom')"
            >确认</el-button
          >
        </div>
      </el-card>
      <el-dialog
        title="赠品设置"
        :visible.sync="dialogGroupVisible"
        width="70%"
        destroy-on-close
      >
        <ChooseProduct
          :productList="productList"
          @combinationPro="combinationPro"
          @close-choosegroup="parent_close"
        >
        </ChooseProduct>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import EleTable from '@/components/Table/EleTable'
import ChooseProduct from './components/chooseProduct'
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
export default {
  data() {
    var expvalidator = (rule, value, callback) => {
      console.log(rule, value, '----------')
      if (value.length > 0 || this.activityFrom.systemTerms.length > 0) {
        callback() // 自定义校验-以获取到保存到商品信息
      } else {
        callback(new Error('请完成商品信息的选择'))
      }
    }
    var sysvalidator = (rule, value, callback) => {
      console.log(rule, value, '----------')
      if (value.length > 0 || this.activityFrom.trialTerms.length > 0) {
        callback() // 自定义校验-以获取到保存到商品信息
      } else {
        callback(new Error('请完成商品信息的选择'))
      }
    }
    var giftOptionvalidator = (rule, value, callback) => {
      console.log(rule, value, '----------')
      if (this.tableData.length > 0) {
        callback() // 自定义校验-以获取到保存到商品信息
      } else {
        callback(new Error('请完成商品信息的选择'))
      }
    }
    return {
      isTrial: false, // 体验课checkbox
      isSystem: false, // 系统课checkbox
      promotionsId: '',
      tableHeight: 'auto',
      dialogGroupVisible: false,
      promotionsType: [
        {
          value: 'GIFT',
          label: '关单赠品'
        }
      ], // 活动类型列表
      tableData: [],
      activityFrom: {
        promotionsName: '', // 活动名称
        promotionsType: 'GIFT', // 活动类型 默认关单赠品
        promotionsDate: [], // 活动时间
        trialTerms: [], // 体验课
        systemTerms: [], // 系统课
        desc: '' // 活动说明
      },
      productList: [],
      rules: {
        promotionsName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        promotionsType: [
          { required: true, message: '请选择计划模板', trigger: 'change' }
        ],
        promotionsDate: [
          {
            required: true,
            message: '请选择时间范围',
            trigger: 'change'
          }
        ],
        trialTerms: [
          { required: true, validator: expvalidator, trigger: 'blur' }
        ],
        systemTerms: [
          { required: true, validator: sysvalidator, trigger: 'blur' }
        ],
        giftOptionCheck: [
          { required: true, validator: giftOptionvalidator, trigger: 'blur' }
        ]
      },
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now() - 24 * 60 * 60 * 1000
        }
      }
    }
  },
  components: {
    EleTable,
    SearchStage,
    ChooseProduct
  },
  watch: {
    isTrial(val, old) {
      if (!val) {
        console.log('11111')
        this.activityFrom.trialTerms = []
      }
      console.log(val, old)
    },
    isSystem(val, old) {
      if (!val) {
        console.log('11111')
        this.activityFrom.systemTerms = []
      }
      console.log(val, old)
    }
  },
  created() {
    // 获取商品
    this.getProductByTypes().then((res) => {
      if (res.code === 0 || res) {
        res.payload.forEach((item) => {
          item.key = item.id
          item.label = item.name
        })
        this.productList = res.payload
        console.log(res, '=------=')
      }
    })
    // 新增与编辑逻辑
    if (this.$route.params.promotionsId === '-1') {
      this.promotionsId = ''
    } else {
      this.promotionsId = this.$route.params.promotionsId
      this.getPromotionsById(this.promotionsId).then((res) => {
        this.activityFrom.promotionsName = res.payload.promotionsName
        this.activityFrom.promotionsType = res.payload.promotionsType
        const promotionsDate = []
        promotionsDate.push(res.payload.startDate)
        promotionsDate.push(res.payload.endDate)
        this.activityFrom.promotionsDate = promotionsDate
        this.isTrial = res.payload.isTrial
        const trialTerms = res.payload.trialTerms.split(',')
        console.log(trialTerms)
        this.activityFrom.trialTerms = trialTerms
        this.isSystem = res.payload.isSystem
        this.activityFrom.systemTerms = res.payload.systemTerms.split(',')
        this.activityFrom.desc = res.payload.desc
        this.tableData = res.payload.gifts
        console.log(res, this.activityFrom, '====')
      })
      console.log(this.promotionsId)
    }
    this.calcTableHeight()
  },
  mounted() {},
  computed: {},
  methods: {
    // 获取活动范围 体验课系统课拍戏
    getSchedul(key, res, type) {
      console.log(res, 'ressssssss')
      if (type === 0) {
        this.activityFrom.trialTerms = res[0].term0 || []
        console.log(this.activityFrom.trialTerms, '-=-=')
      } else {
        this.activityFrom.systemTerms = res[0].term1 || []
      }
      console.log(key, res[0], type, '11212121212121')
    },
    // 获取详情内容
    async getPromotionsById(promotionsId) {
      try {
        const tmpInfo = await this.$http.Operating.getPromotionsById({
          promotionsId
        })
        return tmpInfo
      } catch (err) {
        console.log(err)
      }
    },
    // 组合商品
    combinationPro(data) {
      const obj = {
        giftsName: '',
        giftsType: '',
        giftsPrice: 0,
        expressCount: 0,
        products: []
      }
      const product = {
        id: ''
      }
      // let giftsType
      for (let i = 0; i < this.productList.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (data[j] === this.productList[i].key) {
            obj.giftsName = obj.giftsName + '+' + this.productList[i].name
            obj.giftsType = obj.giftsType + '+' + this.productList[i].type
            obj.giftsPrice =
              Number(obj.giftsPrice) + Number(this.productList[i].price)
            if (this.productList[i].type === 'ACTUAL_GOODS') {
              obj.expressCount += 1
            }
            product.id = this.productList[i].id
            obj.products.push(product)
          }
        }
      }
      console.log(obj.giftsName, 'giftsName')
      console.log(obj.giftsType, 'giftsType')
      console.log(obj.giftsPrice, 'giftsPrice')
      console.log(obj.expressCount, 'giftsPrice')

      obj.giftsName = obj.giftsName.substring(1)
      obj.giftsType = obj.giftsType.substring(1)
      if (
        obj.giftsType.includes('ACTUAL_GOODS') &&
        obj.giftsType.includes('VIRTUAL_GOODS')
      ) {
        obj.giftsType = '实物+虚拟'
      } else if (obj.giftsType.includes('ACTUAL_GOODS')) {
        obj.giftsType = '实物'
      } else if (obj.giftsType.includes('VIRTUAL_GOODS')) {
        obj.giftsType = '虚拟'
      }
      console.log(obj, 'obj')
      this.tableData.push(obj)
    },
    // 获取商品
    async getProductByTypes() {
      try {
        const Info = await this.$http.Approval.getProductByTypes({})
        return Info
      } catch (err) {
        console.log(err)
      }
    },
    // 选择商品
    chooseProduct(activityFrom) {
      this.dialogGroupVisible = true
    },

    // 关闭
    parent_close() {
      this.dialogGroupVisible = false
    },
    // 保存
    saveActivity(activityFrom) {
      this.$refs[activityFrom].validate((valid) => {
        if (valid) {
          const obj = {
            id: '-1',
            promotionsName: this.activityFrom.promotionsName,
            promotionsType: this.activityFrom.promotionsType,
            startDate: this.activityFrom.promotionsDate[0],
            endDate: this.activityFrom.promotionsDate[1],
            desc: this.activityFrom.desc,
            isTrial: this.isTrial,
            isSystem: this.isSystem,
            trialTerms: this.activityFrom.trialTerms.join(','),
            systemTerms: this.activityFrom.systemTerms.join(','),
            gifts: this.tableData
          }
          if (this.promotionsId) {
            obj.id = this.promotionsId
          }
          this.saveAndUpdatePromotions(obj).then((res) => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              console.log(res)
              this.$router.push({
                path: '/activityManagement/'
              })
            }
            console.log(res)
          })
          console.log(obj)
          console.log('valid====', valid)
          console.log(this.activityFrom)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    cannelOpt() {
      this.$router.push({ path: '/activityManagement' })
    },
    // 保存或者更新活动
    async saveAndUpdatePromotions(data) {
      try {
        const tmpInfo = await this.$http.Operating.saveAndUpdatePromotions(data)
        return tmpInfo
      } catch (err) {
        console.log(err)
      }
    },
    /** 表格删除某一行确认按钮 */
    confirmDelRow(row, _index) {
      console.log('删除了', row, _index)
      this.tableData.forEach((item, index) => {
        if (index === _index) {
          this.tableData.splice(index, 1)
        }
      })
    },
    // 计算表格高度
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 120
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.activity-manage-container {
  padding: 10px;
}
.activity-manage {
  background: #ffffff;
}
.header {
  height: 100%;
  .tip {
    margin-bottom: 20px;
  }
  .activity-from {
    font-size: 12px;
  }
}
.editStyle {
  display: flex;
  justify-content: space-around;
  span {
    color: #2a75ed;
    cursor: pointer;
  }
}
.bottom_choose {
  display: flex;
  justify-content: center;
}
.el-form-item__label {
  width: 110px !important;
}
.el-form-item__content {
  margin-left: 110px !important;
}
</style>
