<!--
 * @Descripttion:双周体验课定向期
 * @version:
 * @Author: Zhoufei
 * @Date: 2020-04-23 10:45:00
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-28 15:46:45
 -->

<template>
  <div class="biweekly-exp-class">
    <table-search @change="changeSearch" :showDatas="showDatas">
      <div slot="addChannel">
        <el-button type="primary" size="mini" @click="handlePeriod(false)"
          >新增渠道</el-button
        >
        <el-button
          type="primary"
          size="mini"
          class="btn-directed"
          @click="exportExcel('artBiweekly')"
        >
          批量配置/修改/停用
        </el-button>
      </div>
    </table-search>
    <table-list
      :tableData="tableData"
      :loading="flags.loading"
      :page="tabQuery.page"
      :total="total"
      @changeSwitch="switchStatusTrialOperPeroid"
      @pageChange="pageChange"
      @handleSubmit="handlePeriod"
    />
    <PeriodDialog
      :toBody="true"
      :visible="channelModal"
      :visibleInner="channelInnerModal"
      :showDatas="showDatas"
      :failChannelData="failChannelData"
      :period-info="curPeriodInfo"
      @handleDialog="handlePost"
      @handleInnerDialog="closeInnerDialog"
      :courseType="courseType"
    />
    <upload-excel
      v-if="showUploadExcel"
      :showUploadExcel.sync="showUploadExcel"
      :uploadCategory="uploadCategory"
    ></upload-excel>
  </div>
</template>

<script>
import channelOPeriodMixins from '../mixins/channelOPeriodMixins'
export default {
  name: 'channelOrientationPeriod',
  mixins: [channelOPeriodMixins]
}
</script>

<style scoped lang="scss"></style>
