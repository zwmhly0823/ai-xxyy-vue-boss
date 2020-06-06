import ProductType from '@/components/MSearch/searchItems/productType.vue';
<!--
 * @Descripttion:
 * @version:
 * @Author: songyanan
 * @Date: 2020-06-05 10:13:40
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-06 17:59:48
 -->
<template>
  <div>
    <el-dialog
      :title="currentItem.lable"
      :visible.sync="dialogVisible"
      width="25%"
    >
      <el-form label-width="20%">
        <el-form-item v-if="currentItem.type === 'sameLevel'" label="名称">
          <el-input v-model="sameLevel.name" />
        </el-form-item>
        <el-form-item v-if="currentItem.type === 'sameLevel'" label="排序">
          <el-input v-model="sameLevel.sort" />
        </el-form-item>
        <el-form-item v-if="currentItem.type === 'childLevel'" label="归属上级">
          <el-input :disabled="true" v-model="editCurrentData.name" />
        </el-form-item>
        <el-form-item v-if="currentItem.type === 'childLevel'" label="子级名称">
          <el-input v-model="childLevel.name" />
        </el-form-item>
        <el-form-item v-if="currentItem.type === 'childLevel'" label="排序">
          <el-input v-model="childLevel.sort" />
        </el-form-item>
        <el-form-item v-if="currentItem.type === 'edit'" label="名称">
          <el-input v-model="edit.name" />
        </el-form-item>
        <el-form-item v-if="currentItem.type === 'edit'" label="排序">
          <el-input type="number" v-model="edit.sort" />
        </el-form-item>
        <el-form-item v-if="currentItem.type === 'delete'">
          <i class="el-icon-warning"></i
          ><span class="delete-tip">{{
            `是否确认要删除"${editCurrentData.name}"`
          }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialog('cacle')">取 消</el-button>
        <el-button type="primary" @click="handleDialog('submit')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    editCurrentData: {
      type: Object,
      default: () => ({})
    },
    currentItem: {
      type: Object,
      default: () => ({})
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sameLevel: {
        name: '',
        sort: ''
      },
      childLevel: {
        name: '',
        sort: ''
      },
      edit: this.editCurrentData
    }
  },
  methods: {
    handleDialog(type) {
      this.$emit('handleDialog', type)
    }
  }
}
</script>

<style lang="scss">
.el-icon-warning {
  font-size: 18px;
  color: rgb(219, 163, 88);
}
.delete-tip {
  font-size: 18px;
  color: rgb(176, 176, 176);
  margin: 0 0 0 20px;
}
</style>
