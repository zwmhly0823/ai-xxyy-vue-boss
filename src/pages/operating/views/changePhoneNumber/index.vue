<!--
 * @Descripttion: 用户手机号替换
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-25 16:48:38
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-10-27 16:00:52
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container">
      <h3>替换操作</h3>
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
            <el-form-item label="原手机号" prop="oldMobile">
              <el-input
                v-model="phoneForm.oldMobile"
                placeholder="请输入学员手机号"
                maxlength="11"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="新手机号" prop="newMobile">
              <el-input
                v-model="phoneForm.newMobile"
                placeholder="请输入新手机号"
                maxlength="11"
                clearable
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
          <el-form :inline="true" class="demo-form-flex">
            <el-form-item label="原手机号">
              <search-phone
                :dataType="false"
                @result="getSearchData('oldPhone', arguments)"
                tip="原手机号查询"
                ref="searchUserByPhone"
                teamId=""
              />
            </el-form-item>

            <el-form-item label="新手机号">
              <search-phone
                @result="getSearchData('newPhone', arguments)"
                :dataType="true"
                tip="新手机号查询"
                ref="searchUserByPhone"
                teamId=""
              />
            </el-form-item>
          </el-form>
          <!-- dom -->
          <div class="tableInner" ref="tableInner"></div>

          <el-table
            :data="recordList"
            :height="tableHeight"
            style="width: 100%"
          >
            <el-table-column label="用户ID">
              <template slot-scope="scope">
                <p @click="userHandle(scope.row.user)" class="primary-text">
                  {{ scope.row.user && scope.row.user.user_num }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="old_mobile" label="原手机号">
            </el-table-column>
            <el-table-column prop="new_mobile" label="新手机号">
            </el-table-column>
            <el-table-column prop="name" label="修改人">
              <template slot-scope="scope">
                {{ (scope.row.staff && scope.row.staff.real_name) || '-' }}
              </template>
            </el-table-column>
            <el-table-column prop="utime_text" label="修改时间">
            </el-table-column>
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
import { openBrowserTab, formatData } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
import SearchPhone from './components/searchPhone'
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
    MPagination,
    SearchPhone
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      console.log(rule)
      const type = rule.field === 'oldMobile' ? '原手机号' : '新手机号'
      if (!value) {
        return callback(new Error(`请输入${type}`))
      } else if (!valid.isPhoneNum(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      new_mobile: '',
      old_mobile: '',
      currentPage: 1,
      totalElements: 0,
      tableHeight: 0,
      phoneForm: {
        oldMobile: '',
        newMobile: ''
      },
      rules: {
        oldMobile: [
          { required: true, validator: checkPhone, trigger: 'change' }
        ],
        newMobile: [
          { required: true, validator: checkPhone, trigger: 'change' }
        ]
      },
      recordList: [],
      staff: {}
    }
  },
  created() {
    this.$nextTick(() => {
      const tableHeight =
        document.body.clientHeight - this.$refs.tableInner.offsetTop - 110
      this.tableHeight = tableHeight + ''
    })
    const staff = JSON.parse(localStorage.getItem('staff') || '{}')
    this.staff = staff

    this.getLogData()
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { newMobile, oldMobile } = this.phoneForm
          const params = {
            newMobile,
            oldMobile,
            staffId: this.staff.id
          }
          this.$http.Operating.replaceMobile(params).then((res) => {
            console.log(res)
            if (res && +res.code === 0) {
              this.$message.success('替换成功！')
              this.currentPage = 1
              this.resetForm(formName)
              setTimeout(() => {
                this.getLogData()
              }, 1500)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
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
      this.currentPage = page
      this.getLogData()
    },

    getLogData(val = {}) {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      // const query = {}

      const query = val
      if (this.old_mobile) {
        val.old_mobile = this.old_mobile
      }
      if (this.new_mobile) {
        val.new_mobile = this.new_mobile
      }
      const params = JSON.stringify(JSON.stringify(query))
      this.$http.Operating.getUserReplaceMobileLog(params, this.currentPage)
        .then((res) => {
          const data = res.data && res.data.UserReplaceMobileLogPage
          if (data) {
            const { totalElements, content = [] } = data
            this.totalElements = totalElements
            this.recordList = content.map((item) => {
              item.utime_text = formatData(item.utime, 's')
              return item
            })
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    getSearchData(key, val) {
      if (key === 'oldPhone') {
        this.old_mobile = val[0]
      } else {
        this.new_mobile = val[0]
      }
      this.getLogData()
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
}
.demo-form-flex {
  margin-left: 20px;
}
h3 {
  margin-left: 20px;
  font-size: 14px;
  color: #666;
}
</style>
