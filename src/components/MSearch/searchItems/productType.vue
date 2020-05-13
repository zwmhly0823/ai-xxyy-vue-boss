<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-13 17:46:53
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-13 17:46:53
 * @Description: 商品类型筛选 regtype, 4-宝石兑换（推荐有礼），5-积分兑换（小熊商城），6-赠送（邀请有奖）
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="result"
      size="mini"
      clearable
      :multiple="isMultipe"
      placeholder="订单类型"
      @change="onChange"
      class="item-style"
    >
      <el-option
        v-for="item in typeList"
        :key="item.id"
        :value="item.id"
        :label="item.text"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isMultipe: true,
      result: null,
      typeList: [
        {
          id: '5',
          text: '小熊商城'
        },
        {
          id: '4',
          text: '推荐有礼'
        },
        {
          id: '6',
          text: '邀请有奖'
        }
      ]
    }
  },
  methods: {
    onChange(item) {
      this.$emit('result', item ? { [this.name]: item } : '')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-item {
  &.small {
    .item-style {
      width: 120px !important;
      margin-right: 10px;
    }
    .item-style:last-child {
      margin-right: 0px;
    }
  }
}
</style>
