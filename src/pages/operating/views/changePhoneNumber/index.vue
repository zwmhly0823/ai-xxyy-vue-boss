<!--
 * @Descripttion: 用户手机号替换
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-25 16:48:38
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-25 18:20:16
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container">
      <!-- <el-scrollbar wrap-class="user-wrapper" id="users-scroll"> -->
      <div class="app-main-container-scrollbar change-phone">
        <el-card shadow="never">
          <el-form
            :inline="true"
            size="mini"
            :model="phoneForm"
            :rules="rules"
            ref="phoneForm"
          >
            <el-form-item label="原手机号" prop="oldPhone" required>
              <el-input
                v-model="phoneForm.oldPhone"
                placeholder="请输入学员手机号"
                maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item label="新手机号" prop="newPhone" required>
              <el-input
                v-model="phoneForm.newPhone"
                placeholder="请输入新手机号"
                maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('phoneForm')"
                >替换</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>

        <div class="record-list">
          <h3>替换记录</h3>
          <!-- dom -->
          <div class="tableInner" ref="tableInner"></div>
          <el-table
            :data="recordList"
            :height="tableHeight"
            style="width: 100%"
          >
            <el-table-column prop="date" label="用户ID"> </el-table-column>
            <el-table-column prop="name" label="原手机号"> </el-table-column>
            <el-table-column prop="name" label="新手机号"> </el-table-column>
            <el-table-column prop="name" label="修改人"> </el-table-column>
            <el-table-column prop="address" label="修改时间"> </el-table-column>
          </el-table>
        </div>
        <m-pagination
          @current-change="handleCurrentChange"
          :current-page="+currentPage"
          :total="+totalElements"
          open="calc(100vw - 170px - 25px)"
          close="calc(100vw - 50px - 25px)"
        />
      </div>
      <!-- </el-scrollbar> -->
    </div>
  </el-row>
</template>

<script>
import { openBrowserTab } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
const valid = {
  isPhoneNum(str) {
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(str)
  },
  isUserName(str) {
    return /^[0-9A-Za-z]{2,18}$/.test(str)
  }
}
export default {
  components: {
    MPagination
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      console.log(rule)
      const type = rule.field === 'oldPhone' ? '原手机号' : '新手机号'
      if (!value) {
        return callback(new Error(`请输入${type}`))
      } else if (!valid.isPhoneNum(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      currentPage: 1,
      totalElements: 0,
      tableHeight: 0,
      phoneForm: {
        oldPhone: '',
        newPhone: ''
      },
      rules: {
        oldPhone: [
          { required: true, validator: checkPhone, trigger: 'change' }
        ],
        newPhone: [{ required: true, validator: checkPhone, trigger: 'change' }]
      },
      recordList: []
    }
  },
  created() {
    this.$nextTick(() => {
      const tableHeight =
        document.body.clientHeight - this.$refs.tableInner.offsetTop - 110
      this.tableHeight = tableHeight + ''
    })
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid)

        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 跳转用户详情
    userHandle(row) {
      if (!row || !row.id) {
        this.$message.error('缺少用户信息')
        return
      }
      const { id } = row
      // 新标签打开详情页
      id && openBrowserTab(`/users/#/details/${id}`)
    },

    handleCurrentChange(page) {
      console.log(page)
    }
  }
}
</script>

<style lang="scss" scoped>
.change-phone {
  ::v-deep {
    .el-card {
      border-radius: 0;
      border: 0;
      border-bottom: 10px solid #f0f1f2;
      &__body {
        padding-bottom: 0;
      }
    }
  }

  .record-list {
    h3 {
      margin-left: 20px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
