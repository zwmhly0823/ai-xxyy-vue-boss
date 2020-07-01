<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-07-01 15:10:26
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-01 16:33:09
-->
<template>
  <div class="look-form-box">
    <div style="font-size:20px;font-weight:600;">体验课调查问卷</div>
    <el-form label-width="50px">
      <div v-for="(item, index) in lookValueList" :key="index">
        {{ item }}
        <el-form-item>
          <span>{{ index + 1 }}. {{ item.title }}</span>
          <div v-if="item.questionType == 'RADIO'">
            <el-radio-group v-model="radio">
              <el-radio
                v-for="(ele, index1) in questionOptionList"
                :key="index1"
                :label="ele.optionNo"
              >
                {{ ele.optionContent }}
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index'
export default {
  props: {
    lookFormValue: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      lookValueList: [],
      questionOptionList: [],
      radio: ''
    }
  },
  created() {
    this.onLookValue()
  },
  methods: {
    onLookValue() {
      const _data = this.lookFormValue.summaryList
      _data.forEach((res) => {
        if (res.questionOptionList) {
          this.questionOptionList = deepClone(res.questionOptionList)
        }
      })
      this.lookValueList = _data
      console.log(this.questionOptionList)
    }
  }
}
</script>

<style lang="scss" scoped>
.look-form-box {
  display: flex;
  justify-content: center;
}
</style>
