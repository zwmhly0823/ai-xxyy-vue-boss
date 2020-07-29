<!--
 * @Descripttion: BOSS小熊
 * @version: 1.0.0
 * @Author: Shasen
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: shasen
 * @LastEditTime: 2020-07-06 10:58:08
-->
<template>
  <div class="choose-group">
    <el-form ref="sopFrom" size="mini" class="sop-form">
      <el-form-item label="群名称">
        <el-input
          placeholder="请输入内容"
          v-model="name"
          clearable
          :width="150"
          @input="handleDebounce"
          @change="changeGroup()"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div class="tablecon">
      <el-table
        :tableSize="'small'"
        :data="tableData"
        ref="myseleTable"
        tableHeight="350"
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          label="商品名称"
          prop="product_name"
          align="center"
        ></el-table-column>
        <el-table-column label="商品类型" prop="product_type" align="center">
          <template slot-scope="scope">
            {{ scope.row.product_type === 1 ? '实物商品' : '虚拟商品' }}
          </template>
        </el-table-column>
        <el-table-column label="赠品价格" prop="product_price" align="center">
          <template slot-scope="scope">
            ¥{{ scope.row.product_price }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom_choose" v-show="tableData.length > 0">
      <el-button size="mini" @click="saveAndConadd">保存并继续添加</el-button>
      <el-button size="mini" @click="closeChooseGroup">取消</el-button>
      <el-button size="mini" type="primary" @click="chooseGroup"
        >确认</el-button
      >
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'
export default {
  props: {
    taskstatus: {
      type: String,
      default: ''
    },
    wechatNo: {
      type: String,
      default: ''
    },
    parent_tableData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      name: '',
      tableData: [],
      chooseProductList: []
    }
  },
  components: {
    // EleTable
  },
  async created() {
    setTimeout(() => {
      this.tableData = [
        {
          product_name: '花架',
          product_type: 1,
          product_price: 100
        },
        {
          product_name: '24色马克笔',
          product_type: 1,
          product_price: 100
        },
        {
          product_name: '涂色卡',
          product_type: 1,
          product_price: 100
        },
        {
          product_name: '安徒生大赛',
          product_type: 2,
          product_price: 100
        }
      ]
    }, 100)
    // const tabs = await this.getWeChatCluster(this.name).catch()
    // // const { code, payload = [] } = tabs
    // const { code } = tabs
    // if (tabs && code === 0) {
    //   this.tableData = [
    //     {
    //       product_name: '花架',
    //       product_type: 1,
    //       product_price: 100
    //     },
    //     {
    //       product_name: '24色马克笔',
    //       product_type: 1,
    //       product_price: 100
    //     },
    //     {
    //       product_name: '涂色卡',
    //       product_type: 1,
    //       product_price: 100
    //     },
    //     {
    //       product_name: '安徒生大赛',
    //       product_type: 2,
    //       product_price: 100
    //     }
    //   ]
    // }
  },
  mounted() {},
  computed: {},
  methods: {
    handleDebounce: debounce(function(event) {
      // this.getWeChatCluster(this.name).then((res) => {
      //   if (res.code === 0) {
      //     this.tableData = res.payload || []
      //   }
      // })
    }, 500),
    // 获取群信息
    async getWeChatCluster(name = '') {
      try {
        const Info = await this.$http.Community.getWeChatCluster({
          wechatNo: this.wechatNo,
          teacherId: this.taskstatus,
          name
        })
        return Info
      } catch (err) {
        console.log(err)
      }
    },
    // 搜索群名称
    changeGroup() {
      this.handleDebounce()
    },
    // 选择
    handleSelectionChange(val) {
      console.log(val, '11111')
      this.chooseProductList = val
    },
    // 保存并继续添加
    saveAndConadd() {
      const { chooseProductList } = this
      if (chooseProductList.length) {
        let price = 0
        chooseProductList.forEach((item) => {
          price = price + item.product_price
          // const obj = {
          //   productname: item.product_name,
          //   producttype: item.product_type,
          //   prod
          // }
        })
        console.log(chooseProductList)
      } else {
        console.log('选啊 ')
      }
    },
    // 保存
    chooseGroup() {
      this.$emit('choose-group', this.chooseProductList)
    },
    // 关闭
    closeChooseGroup() {
      this.name = ''
      this.$emit('close-choosegroup')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.choose-group {
  background: #ffffff;
}
.tablecon {
  width: 100%;
  overflow: auto;
  max-height: 400px;
}
.header {
  .sop-form {
    font-size: 12px;
  }
}
.bottom_choose {
  display: flex;
  padding-top: 10px;
  justify-content: center;
}
.el-input {
  width: 150px;
}
</style>
