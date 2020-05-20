<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-20 10:12:30
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-20 15:34:20
 -->
<template>
  <div class="wechar">
    <el-form class="conditions-form">
      <el-form-item label="选择交出方">
        <div class="sear-container">
          <dropdown-search @searchChange="searchChange"></dropdown-search>
        </div>
      </el-form-item>
    </el-form>
    <div class="wechar-tip" v-show="showTip">
      请先选择“交出方部门“和“交出方老师”后进行交接操作
    </div>
    <div class="wechar-button-container">
      <el-button @click="cacleHandover">取消</el-button>
      <el-button type="primary" @click="handlHandover">确认交接</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTip: true
    }
  },
  methods: {
    searchChange(res) {
      console.log('res', res)
    },
    cacleHandover() {
      console.log('取消交接')
    },
    handlHandover() {
      console.log('确认交接！')
    }
  },
  components: {
    DropdownSearch: () => import('./dropdownSearch')
  }
}
</script>

<style lang="scss" scoped>
.wechar {
  .conditions-form {
    margin: 0 0 0 40px;
    &-department {
      margin: 0 30px 0 0;
    }
  }
  &-tip {
    width: 100%;
    text-align: center;
    margin: 100px 0;
  }
  &-button-container {
    width: 350px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    /deep/ .el-button {
      width: 98px;
      height: 30px;
      line-height: 0;
    }
  }
}
</style>
