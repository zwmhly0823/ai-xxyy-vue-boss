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
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="value"
        filterable
        :titles="['Source', 'Target']"
        :button-texts="['到左边', '到右边']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        @change="handleChange"
        @right-check-change="chooseChange"
        :data="productList"
      >
        <span slot-scope="{ option }"
          >{{ option.name }}-{{
            option.type === 'ACTUAL_GOODS' ? '实物' : '虚拟'
          }}-¥{{ option.price }}</span
        >
        <el-button
          class="transfer-footer"
          slot="right-footer"
          size="small"
          @click="combinationPro"
          >组合商品</el-button
        >
        <el-button
          class="transfer-footer"
          slot="right-footer"
          size="small"
          @click="closeChoosePro"
          >取消</el-button
        >
      </el-transfer>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    productList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      value: [],
      rigthValueChoose: []
    }
  },
  components: {
    // EleTable
  },
  async created() {},
  mounted() {},
  computed: {},
  methods: {
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    chooseChange(value, direction, movedKeys) {
      this.rigthValueChoose = value
      console.log(value, direction, movedKeys, '----')
    },
    // 组合商品
    combinationPro() {
      console.log(this.rigthValueChoose, '组合商品')
      if (this.rigthValueChoose.length > 0) {
        this.$emit('combinationPro', this.rigthValueChoose)
      } else {
        console.log('选择得')
      }
    },
    // 关闭
    closeChoosePro() {
      this.name = ''
      this.$emit('close-choosegroup')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.el-transfer-panel {
  width: 300px;
}
.choose-group {
  height: 400px;
  background: #ffffff;
  text-align: center;
}
.el-form,
.el-transfer {
  height: 100%;
}
.el-transfer-panel {
  height: 500px;
}
.el-transfer-panel__list.is-filterable {
  height: 300px;
  padding-bottom: 50px;
}
</style>
