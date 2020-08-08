<!--
 * @Descripttion: 选择商品套餐列表
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-07 16:59:43
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-07 21:08:59
-->
<template>
  <el-dialog
    width="50%"
    title="添加商品套餐"
    :visible.sync="visible"
    :append-to-body="toBody"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="package-list">
      <div
        class="package-list-item d-flex align-center"
        v-for="item in dataList"
        :key="item.id"
      >
        <el-radio v-model="checkedId" :label="item.id">
          <p>{{ item.name }}（课时{{ item.course_week }}周）</p>
          <p class="red">{{ item.price }}元</p>
        </el-radio>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel" size="small">取 消</el-button>
      <el-button type="primary" @click="handleOk" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 更换商品里的回显选中ID
    currentId: {
      type: String,
      default: ''
    },
    toBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 指定的套餐ID; 前期只有体验课 [5, 3, 10, 18]
      exIds: [5],
      dataList: [],
      checkedId: this.currentId || '' // 选中的套餐ID
    }
  },
  mounted() {
    this.checkedId = this.currentId
    this.getPackageList()
  },
  methods: {
    handleOk() {
      if (!this.checkedId) {
        this.$message.error('请选择商品套餐！')
        return
      }
      this.result()
    },
    handleCancel() {
      if (!this.currentId) this.checkedId = ''
      this.result()
    },
    result() {
      let res = {}
      if (this.checkedId) {
        const list = this.dataList.filter((item) => item.id === this.checkedId)
        res = list[0]
      }
      this.$emit('result', res)
    },

    // 获取商品套餐 - 体验课、系统课、半年系统课
    getPackageList() {
      const params = {
        id: this.exIds
      }
      this.$http.Marketing.getPackageList(params).then((res) => {
        const list = res?.data?.PackagesList || []
        this.dataList = list.map((item) => {
          item.price = item.price > 0 ? (+item.price).toFixed(2) : item.price
          return item
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.package-list {
  min-height: 320px;
  &-item {
    margin: 20px 20px 0;
    padding-bottom: 20px;
    border-bottom: 1px solid #e3e3e3;
    // &:last-child {
    //   border-bottom: none;
    // }
    ::v-deep {
      .el-radio {
        display: flex;
        align-items: center;
        &.is-checked {
          p {
            color: #606266;
          }
        }
      }
    }
    p {
      line-height: 20px;
      &.red {
        color: #f56c6c !important;
        font-size: 12px;
      }
    }
  }
}
.dialog-footer {
  padding-bottom: 100px;
  text-align: center;
}
</style>
