<!--
 * @Descripttion: 新增或编辑水军微信
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-27 13:48:33
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-02-07 22:06:46
-->
<template>
  <el-dialog
    width="40%"
    :title="title"
    :visible="visible"
    :close-on-click-modal="false"
    :key="key"
    @close="onClose"
  >
    <el-form :model="form" size="mini" style="width: 300px;">
      <el-form-item label="微信号" required :label-width="formLabelWidth">
        <el-input
          v-model.trim="form.weixinNo"
          placeholder="请输入微信号"
          autocomplete="off"
          @input="checkChinese"
          :disabled="id ? true : false"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属部门" required :label-width="formLabelWidth">
        <department
          placeholder="请选择部门，必填"
          :only-dept="1"
          :multiple="false"
          :value="params.departmentId || null"
          name="departmentId"
          class="my-item"
          :key="dkey"
          @result="getSearchData('departmentId', arguments)"
        />
      </el-form-item>
      <el-form-item label="保管人" :label-width="formLabelWidth">
        <group-sell
          name="teacherId"
          tip="请搜索保管人，非必填"
          class="my-item"
          :value="params.teacherId || null"
          :teacherscope="id && params.teacherId ? [params.teacherId] : null"
          :key="tkey"
          @result="getSearchData('teacherId', arguments)"
        />
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input
          v-model="form.remark"
          placeholder="请输入备注信息，非必填"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="启用状态" required :label-width="formLabelWidth">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSave"
        size="mini"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
export default {
  components: {
    Department,
    GroupSell
  },
  props: {
    current: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      visible: false,
      title: '新增水军微信',
      formLabelWidth: '80px',
      params: {},
      form: {
        weixinNo: '',
        remark: '',
        status: 0
      },
      key: null,
      id: null,
      tkey: null,
      dkey: null
    }
  },
  watch: {
    current(data) {
      this.dkey = Date.now()
      this.tkey = Date.now() + 1
      if (data) {
        const { weixinNo, departmentId, remark, teacherId, status, id } = data
        Object.assign(this.form, { weixinNo, remark, status })
        Object.assign(this.params, {
          teacherId: teacherId !== '0' ? teacherId : '',
          departmentId
        })
        this.id = id
      } else {
        this.form = { weixinNo: '', remark: '', status: 0 }
        this.params = {}
        this.id = ''
      }
      console.log(this.params)
    }
  },
  methods: {
    getSearchData(key, res) {
      const data = res && res[0]
      if (data) {
        this.$set(this.params, key, data[key])
      } else {
        this.$delete(this.params, key)
      }
    },

    handleSave() {
      if (!this.form.weixinNo) {
        this.$message.error('请输入微信号')
        return
      }
      const { departmentId } = this.params
      if (!departmentId || departmentId.length === 0) {
        this.$message.error('请选择部门')
        return
      }
      const params = {
        ...this.form,
        ...this.params,
        departmentId: Array.isArray(departmentId)
          ? departmentId.join(',')
          : departmentId
      }
      // 保管人不填写时，传空
      if (!this.params.teacherId) {
        Object.assign(params, {
          teacherId: '0'
        })
      }
      // 编辑
      if (this.current && this.id) {
        Object.assign(params, { id: this.id })
      }
      this.loading = true
      this.$http.Teacher.saveWaterArmy(params)
        .then((res) => {
          console.log(res, 'save')
          if (res.code !== 0) {
            return
          }
          this.$message.success(this.id ? '编辑成功' : '添加成功')
          setTimeout(() => {
            this.onClose()
            this.$emit('success')
          }, 1000)
        })
        .finally(() => {
          this.loading = false
        })
    },

    onClose() {
      this.visible = false
      this.id = ''
      this.$delete(this.params, 'teacherId')
      this.$delete(this.params, 'departmentId')
      this.form = { weixinNo: '', remark: '', status: 0 }
      this.key = Date.now()
      this.$emit('close')
    },

    checkChinese() {
      // 禁止输入中文
      const test = /[\u4e00-\u9fa5]/gi
      this.form.weixinNo = this.form.weixinNo.replace(test, '')
    }
  }
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
