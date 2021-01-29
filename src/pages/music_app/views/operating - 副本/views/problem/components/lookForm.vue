<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-07-01 15:10:26
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-07-29 16:37:39
-->
<template>
  <div class="look-form-box">
    <div style="font-size:20px;font-weight:600;margin-bottom:30px;">
      体验课调查问卷
    </div>
    <div class="look-form">
      <el-form label-width="50px">
        <div v-for="(item, index) in lookValueList" :key="index">
          <el-form-item>
            <span>{{ index + 1 }}. {{ item.title }}</span>
            <span
              style="margin-left:10px;"
              v-if="item.questionType == 'CHECKBOX'"
              >(多选)</span
            >
            <span
              style="margin-left:10px;"
              v-if="
                item.isMusts &&
                  ['SUBJECTIVE', 'SUBJECTIVE_DESC'].includes(item.questionType)
              "
              >(必填)</span
            >
            <div v-if="item.questionType == 'RADIO'">
              <el-radio-group v-model="radio[index]">
                <el-radio
                  disabled
                  v-for="(ele, index1) in item.questionOptionList"
                  :key="index1"
                  :label="ele.optionNo"
                >
                  {{ ele.optionContent }}
                </el-radio>
              </el-radio-group>
            </div>
            <div v-if="item.questionType == 'CHECKBOX'">
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  disabled
                  v-for="(eles, index2) in item.questionOptionList"
                  :label="eles.optionNo"
                  :key="index2"
                >
                  {{ eles.optionContent }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="item.questionType == 'SUBJECTIVE'">
              <el-input
                disabled
                v-model="input[index]"
                placeholder="填空题 用户输入框"
                style="width:400px;"
              ></el-input>
            </div>
            <div v-if="item.questionType == 'SUBJECTIVE_DESC'">
              <el-input
                disabled
                type="textarea"
                placeholder="简答题 用户输入框"
                v-model="input[index]"
                style="width:400px;"
              ></el-input>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div style="padding-top:20px;">
      <el-button style="height:40px;" type="primary" @click="onClose">
        关 闭</el-button
      >
    </div>
  </div>
</template>

<script>
// import { deepClone } from '@/utils/index'
// import _ from 'lodash'
export default {
  props: {
    lookFormValue: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      radio: {},
      checkList: [],
      checkedCities: {},
      input: {},
      lookValueList: [],
      questionOptionList: []
    }
  },
  mounted() {
    this.onLookValue()
  },

  methods: {
    onClose() {
      this.$emit('onClose')
    },
    onLookValue() {
      const _data = this.lookFormValue.summaryList
      // _data.forEach((res) => {
      // if (res.questionType === 'RADIO') {
      //   for (let i = 0; i < res.questionOptionList.length; i++) {
      //     this.$set(this.obj, `radio_${i}`, res.questionOptionList)
      //   }
      // } else if (res.questionType === 'CHECKBOX') {
      //   for (let i = 0; i < res.questionOptionList.length; i++) {
      //     this.$set(this.obj, `checkedCities_${i}`, res.questionOptionList)
      //   }
      // } else {
      // this.$set(this.obj, `input_${i}`, res.questionOptionList)
      // }
      // if (res.questionOptionList) {
      //   res.questionOptionList.forEach((ele) => {
      //     this.questionOptionList = deepClone(ele)
      //   })
      // this.$set(this.obj, `sellDate_${i}`, this.calcSellYear(startDate, i))
      // this.questionOptionList = _.cloneDeep(res.questionOptionList)
      // res.questionOptionList = _.cloneDeep(res.questionOptionList)
      // }
      // })
      _data.forEach((res) => {})
      this.lookValueList = _data
    }
  }
}
</script>

<style lang="scss" scoped>
.look-form-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  .look-form {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 500px;
    overflow: auto;
  }
}
</style>
