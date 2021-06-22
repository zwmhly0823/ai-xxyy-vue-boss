<!--
 * @Descripttion: 新增或编辑app 升级管理
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-27 13:48:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-25 19:51:56
-->
<template>
  <el-dialog
    width="40%"
    :title="title"
    :visible="visible"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <el-form :model="form" size="mini" style="width: 300px">
      <el-form-item label="应用名称" required :label-width="formLabelWidth">
        <el-input
          v-model.trim="form.applyName"
          placeholder="请输入应用名称"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="应用标识" required :label-width="formLabelWidth">
        <el-input
          v-model.trim="form.applyCode"
          placeholder="请输入应用标识"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="升级版本号" required :label-width="formLabelWidth">
        <el-input
          v-model.trim="form.version"
          placeholder="请输入升级版本号"
          autocomplete="off"
          @input="checkChinese"
        ></el-input>
      </el-form-item>
      <el-form-item label="版本标识" required :label-width="formLabelWidth">
        <el-input
          type="number"
          min="0"
          v-model.trim="form.versionCode"
          placeholder="请输入版本标识"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="app_id" required :label-width="formLabelWidth">
        <el-input
          min="0"
          v-model.trim="form.app_id"
          placeholder="请输入app_id，必填"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道" required :label-width="formLabelWidth">
        <el-input
          min="0"
          v-model.trim="form.channel"
          placeholder="请输入渠道，必填"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="升级类型" required :label-width="formLabelWidth">
        <el-select v-model="form.type" placeholder="请输入升级类型">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统类型" required :label-width="formLabelWidth">
        <el-select v-model="form.ostype" placeholder="请输入系统类型">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" required :label-width="formLabelWidth">
        <el-select v-model="form.upgradeStatus" placeholder="请输入状态">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="升级标题" :label-width="formLabelWidth">
        <el-input
          v-model.trim="form.title"
          placeholder="请输入升级标题，非必填"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="按钮文案" :label-width="formLabelWidth">
        <el-input
          v-model.trim="form.buttonContent"
          placeholder="请输入按钮文案，非必填"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="升级文案" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          :rows="2"
          v-model="form.content"
          autocomplete="off"
          placeholder="请输入升级文案，非必填"
        ></el-input>
      </el-form-item>
      <el-form-item label="下载链接" :label-width="formLabelWidth">
        <el-input
          v-model.trim="form.downloadUrl"
          placeholder="请输入下载链接，非必填"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="灰度数量" :label-width="formLabelWidth">
        <el-input
          type="number"
          min="0"
          v-model.trim="form.grayReleaseCount"
          placeholder="请输入灰度数量，非必填"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input
          v-model="form.remarks"
          placeholder="请输入备注信息，非必填"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">取 消</el-button>
      <el-button type="primary" @click="handleSave" size="mini"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    current: {
      type: Object,
      default: null,
    },
  },
  watch: {
    current() {
      if (this.current) {
        this.form = this.current
        this.form.type = String(this.form.type)
        this.title = '编辑数据'
      }
    },
  },
  data() {
    return {
      loading: false,
      visible: false,
      options1: [
        {
          value: '0',
          label: '非强制升级',
        },
        {
          value: '1',
          label: '强制升级',
        },
      ],
      options2: [
        {
          value: 'ANDROID',
          label: 'ANDROID',
        },
        {
          value: 'IOS',
          label: 'IOS',
        },
      ],
      options3: [
        {
          value: 'ACTIVE',
          label: 'ACTIVE',
        },
        {
          value: 'NOACTIVE',
          label: 'NOACTIVE',
        },
      ],
      title: '新增数据',
      formLabelWidth: '90px',
      form: {
        applyName: '',
        applyCode: 'MUSIC_APP',
        version: '',
        versionCode: '',
        title: '',
        channel: '',
        app_id: '',
        buttonContent: '',
        content: '',
        downloadUrl: '',
        grayReleaseCount: '',
        ostype: '',
        type: '',
        upgradeStatus: '',
        remarks: '',
      },
    }
  },
  methods: {
    handleSave() {
      if (!this.form.applyName) {
        this.$message.error('请输入应用名称')
        return
      }
      if (!this.form.applyCode) {
        this.$message.error('请输入应用标识')
        return
      }
      if (!this.form.version) {
        this.$message.error('请输入升级版本号')
        return
      }
      if (!this.form.versionCode) {
        this.$message.error('请输入版本标识')
        return
      }
      if (!this.form.app_id) {
        this.$message.error('请输入app_id')
        return
      }
      if (!this.form.channel) {
        this.$message.error('请输入渠道')
        return
      }
      if (!this.form.type && this.form.type != 0) {
        this.$message.error('请选择升级类型')
        return
      }
      if (!this.form.ostype) {
        this.$message.error('请选择系统类型')
        return
      }
      if (!this.form.upgradeStatus) {
        this.$message.error('请选择输入状态')
        return
      }
      this.loading = true
      // 新增
      this.form.type = Number(this.form.type)
      if (!this.current) {
        this.$http.Teacher.createUpgradeConfigList(this.form)
          .then((res) => {
            if (res.code !== 0) {
              return
            }
            ;(this.loading = false),
              (this.visible = false),
              this.$message.success('添加成功')
            setTimeout(() => {
              this.onClose()
              this.$emit('success')
            }, 1000)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$http.Teacher.updataUpgradeConfigList(this.form)
          .then((res) => {
            if (res.code !== 0) {
              return
            }
            ;(this.loading = false),
              (this.visible = false),
              this.$message.success('编辑成功')
            setTimeout(() => {
              this.onClose()
              this.$emit('success')
            }, 1000)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },

    onClose() {
      this.visible = false
      this.form = this.$options.data().form
      this.$emit('close')
    },

    checkChinese() {
      // 禁止输入中文
      const test = /[\u4e00-\u9fa5]/gi
      this.form.version = this.form.version.replace(test, '')
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
.my-item {
  &.search-item.small {
    max-width: 220px !important;
  }
  ::v-deep {
    .item-style {
      width: 220px;
    }
  }
}
</style>
