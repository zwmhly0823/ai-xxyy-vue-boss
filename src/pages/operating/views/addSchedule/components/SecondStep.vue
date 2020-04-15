<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-15 21:44:10
 -->
<template>
  <div class="second-step">
    <div class="step-container step-two-container">
      <div class="transfer-container">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="transferVal"
          filterable
          :left-default-checked="[2, 3]"
          :right-default-checked="[1]"
          :render-content="renderFunc"
          :titles="['Source', 'Target']"
          :button-texts="['到左边', '到右边']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          @change="handleChange"
          :data="data"
        >
        </el-transfer>
      </div>
      <!-- 取消、下一步 -->
      <div class="operate-btn">
        <el-button size="small" type="warning" plain>取消</el-button>
        <el-button size="small" type="primary" @click="nextStep"
          >下一步</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['stepStatus'],
  data() {
    const generateData = (_) => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      transferVal: [],
      data: generateData(),
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        )
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    handleChange(val) {
      console.log('transferVal', val)
    },
    nextStep() {
      this.$emit('listenStepStatus')
    }
  }
}
</script>
<style lang="scss" scoped>
.step-two-container {
  margin: 60px 0;
  .transfer-container {
    text-align: center;
  }
  .operate-btn {
    display: flex;
    justify-content: center;
    margin: 40px 0 10px 0;
  }
}
</style>
