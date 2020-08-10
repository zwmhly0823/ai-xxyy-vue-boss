import ProductType from '@/components/MSearch/searchItems/productType.vue';
<!--
 * @Descripttion:
 * @version:
 * @Author: songyanan
 * @Date: 2020-06-05 10:13:40
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-10 17:52:40
 -->
<template>
  <div>
    <el-dialog
      :title="currentItem.lable"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form label-width="100px " style="margin:0">
        <el-form-item v-if="currentItem.type === 'sameLevel'" label="名称">
          <el-input v-model="sameLevel.name" maxlength="10" />
        </el-form-item>
        <!-- <el-form-item v-if="currentItem.type === 'sameLevel'" label="排序">
          <el-input
            type="number"
            v-model="sameLevel.sort"
            maxlength="5"
            onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            oninput="if(value.length>5)value=value.slice(0,5)"
          />
        </el-form-item> -->
        <el-form-item v-if="currentItem.type === 'childLevel'" label="归属上级">
          <el-select
            v-model="departfather"
            placeholder="请选择"
            @change="changeDap"
            style="width:300px"
          >
            <el-option
              v-for="item in departmentFlatList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentItem.type === 'childLevel'" label="子级名称">
          <el-input
            style="width:300px"
            v-model="childLevel.name"
            maxlength="10"
          />
        </el-form-item>
        <!-- <el-form-item v-if="currentItem.type === 'childLevel'" label="排序">
          <el-input
            type="number"
            v-model="childLevel.sort"
            maxlength="5"
            onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            oninput="if(value.length>5)value=value.slice(0,5)"
          />
        </el-form-item> -->
        <el-form-item v-if="currentItem.type === 'edit'" label="归属上级">
          <el-select v-model="depart" placeholder="请选择" style="width:300px">
            <el-option
              v-for="item in departmentFlatList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="currentItem.type === 'edit'" label="名称">
          <el-input style="width:300px" v-model="edit.name" maxlength="10" />
        </el-form-item>
        <!-- <el-form-item v-if="currentItem.type === 'edit'" label="排序">
          <el-input
            type="number"
            v-model="edit.sort"
            maxlength="5"
            onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            oninput="if(value.length>5)value=value.slice(0,5)"
          />
        </el-form-item> -->
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
    // departmentFlatList: {
    //   type: Array,
    //   default: () => []
    // },
    currentItem: {
      type: Object,
      default: () => ({})
    },
    dialogVisible: {
      type: Boolean,
      default: () => false
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
      departmentFlatList: null,
      departfather: this.editCurrentData.id || 0,
      // departfather: 12,
      depart: +this.editCurrentData.pid,
      edit: this.editCurrentData,
      Visible: this.dialogVisible
    }
  },
  computed: {},
  created() {
    this.getdepartmentList()
    console.log(typeof this.editCurrentData.id)
    // this.departfather = this.editCurrentData.name
  },
  methods: {
    changeDap() {
      //  console.log(this.departfather)
    },
    getdepartmentList() {
      this.$http.Teacher.getdepartmentAllList().then((res) => {
        this.departmentFlatList = [
          ...res.data.TeacherDepartmentList,
          { name: '小熊项目', id: 0 }
        ]
        // console.log('部门数据s', this.departmentFlatList)
        // console.log('部门id', this.departfather)
      })
    },
    handleDialog(type) {
      this.$emit('handleDialog', type)
    }
    // treeTurnArr() {
    //   const departfathelist = []
    //   this.departmentFlatList.map((item) => {
    //     if (item.children) {
    //     }
    //     departfathelist.push()
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-warning {
  font-size: 18px;
  color: rgb(219, 163, 88);
}
.delete-tip {
  font-size: 18px;
  color: rgb(176, 176, 176);
  margin: 0 0 0 20px;
}
/deep/ .el-form {
  width: 100%;
  margin: 0 0 0 -30px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
/deep/ .el-input__inner {
  line-height: 20px;
  -moz-appearance: textfield;
}
/deep/ .el-input__inner::-webkit-outer-spin-button,
/deep/ .el-input__inner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
/deep/ .el-form-item__label {
  color: darkgray;
}
</style>
