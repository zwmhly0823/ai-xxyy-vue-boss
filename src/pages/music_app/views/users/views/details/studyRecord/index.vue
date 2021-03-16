<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-24 17:40:09
-->
<template>
  <div class="judge-comps">
    <div class="tabs">
      <el-radio-group v-if="!isFrom1v1" v-model="subjectCode" size="mini">
        <!-- <el-radio-button :label="0">美术</el-radio-button>
        <el-radio-button :label="1">写字</el-radio-button> -->
        <el-radio-button :label="3">音乐</el-radio-button>
      </el-radio-group>
    </div>
    <component
      :is="curentComp"
      :subjectCode="subjectCode"
      v-bind="$attrs"
    ></component>
  </div>
</template>

<script>
import Art from './art'
import Write from './write'

export default {
  name: 'studyRecordIndex',

  watch: {},
  components: {
    Art,
    Write
  },
  created() {},
  data() {
    return {
      subjectCode: this.$store.state.subjects.subjectCode
    }
  },
  computed: {
    curentComp() {
      return this.subjectCode === 0 ? 'art' : 'write'
    },
    // 1v1跳过来的
    isFrom1v1() {
      const { from } = this.$route.query
      return from === '1v1'
    }
  }
}
</script>

<style lang="scss" scoped>
.judge-comps {
  .tabs {
    padding: 5px 10px 0 10px;
    position: absolute;
    right: 0;
    top: 7px;
    z-index: 1000;
  }
}
</style>
