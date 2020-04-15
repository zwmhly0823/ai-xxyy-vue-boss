<template>
  <div>
    <el-button
      icon="el-icon-edit"
      size="mini"
      type="primary"
      plain
      @click="handelAddExpress"
      >新增微信</el-button
    >
    <el-dialog
      :destroy-on-close="true"
      title="新增微信"
      :visible.sync="showExpress"
      width="30%"
    >
      <!-- <logistics-form @addExpress="addExpress" :formData="formData" /> -->
      <addWeChat />
    </el-dialog>
  </div>
</template>

<script>
import addWeChat from './components/addWeChat'
export default {
  components: {
    addWeChat
  },
  data() {
    return {
      showExpress: false
    }
  },
  methods: {
    handelAddExpress() {
      this.showExpress = true
    }
  }
}
</script>

<style scoped></style>
