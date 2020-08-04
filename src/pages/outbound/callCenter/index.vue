<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-31 17:53:04
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-08-04 19:13:47
-->
<template>
  <div class="container">
    <div>
      <el-form :inline="true" class="demo-form-flex">
        <el-form-item>
          <el-input
            size="mini"
            v-model="cno"
            placeholder="坐席工号查询"
            suffix-icon="el-icon-search"
            @change="getSearchData()"
            clearable
          ></el-input>
        </el-form-item>
        <group-sell
          style="width:150px;padding-top: 6px;margin-right: 20px;"
          @result="getSearchData('groupSell', arguments)"
          :name="'groupSell'"
          tip="绑定坐席名称查询"
        />
        <el-form-item label="">
          <search-phone
            @result="getSearchData('phone', arguments)"
            tip="绑定电话查询"
            ref="searchUserByPhone"
            teamId=""
          />
          <!-- <div class="search-group">
            <search-phone-and-username
              type="1"
              :custom-style="{ width: '150px' }"
              placeholder="绑定电话查询"
              :teacher-id="teacherIds"
              @result="getSearchData('studentid', arguments)"
              class="phone-name"
              suffix-icon="el-icon-search"
            />
          </div> -->
        </el-form-item>
        <department
          style="width:130px;padding-top: 6px;margin-right: 20px;"
          @result="getSearchData('department', arguments)"
          :name="'department'"
          :onlyDept="1"
        />
        <el-form-item>
          <el-select
            size="mini"
            v-model="status"
            placeholder="使用状态"
            @change="getSearchData('status', arguments)"
          >
            <el-option label="使用中" value="1"></el-option>
            <el-option label="空闲中" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="outboundList" border style="width: 100%">
      <el-table-column fixed prop="cno" label="坐席工号" width="150">
      </el-table-column>
      <el-table-column prop="agent_name" label="坐席名称" width="120">
      </el-table-column>

      <el-table-column prop="teacherInfo.realname" label="绑定坐席" width="120">
      </el-table-column>
      <el-table-column
        prop="teacherInfo.department_name"
        label="绑定坐席所属部门"
        width="300"
      >
      </el-table-column>
      <el-table-column prop="tel_type" label="电话类型" width="120">
        <template slot-scope="scope">
          <span>{{
            +scope.row.tel_type === 0
              ? '--'
              : +scope.row.tel_type === 1
              ? '手机号'
              : '分机号'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="绑定电话" width="120">
      </el-table-column>
      <el-table-column prop="use_status" label="状态" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.use_status ? '使用中' : '空闲' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bind_time" label="绑定时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ `${formatDate(scope.row.bind_time)}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <span @click="goBind(scope.row)">{{
            scope.row.use_status ? '--' : '绑定'
          }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pag-con">
      <m-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :pageSize="20"
        :total="totalElements"
        @current-change="handleSizeChange"
        show-pager
        open="calc(100vw - 170px - 25px)"
        close="calc(100vw - 50px - 25px)"
      ></m-pagination>
    </div>
    <el-dialog
      title="绑定坐席"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="绑定坐席人员">
            <el-input
              disabled
              v-model="user_name"
              placeholder="请输入绑定坐席员工"
            ></el-input>
          </el-form-item>
          <p>
            <el-form-item label="绑定电话类型">
              <el-radio-group v-model="user_radio" disabled>
                <el-radio label="手机号"></el-radio>
                <el-radio label="IP电话"></el-radio>
              </el-radio-group>
            </el-form-item>
          </p>
          <el-form-item label="绑定电话号码">
            <el-input
              disabled
              v-model="user_phone"
              placeholder="请输入绑定电话号码，仅限输入数字"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postBind()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone.vue'
import { formatData, isToss } from '@/utils/index'

export default {
  data() {
    return {
      user: '',
      cno: '',
      status: '', // 使用状态
      currentPage: 1,
      totalPages: 0,
      totalElements: 1,
      centerDialogVisible: false,
      radio: '1',
      outboundList: [],
      // agent: null,
      // department: '',
      teacherIds: [],
      user_name: '',
      user_radio: '',
      user_phone: ''
    }
  },
  components: { MPagination, Department, GroupSell, SearchPhone },
  created() {
    this.teacherId = isToss()
  },
  mounted() {
    this.getPhoneList()
  },
  methods: {
    // 学员记录详情基本信息
    getPhoneList() {
      const parmes = {
        teacher_id: this.agent,
        id: this.phone
      }
      if (this.status) {
        parmes.use_status = this.status
      }
      if (this.cno) {
        parmes.cno = this.cno
      }
      if (this.department && this.department.length > 0) {
        parmes.department_id = this.department
      }
      return this.$http.Outbound.getOutboundListPage(parmes, this.currentPage)
        .then((res) => {
          if (res && res.data && res.data.TeacherOutboundPage) {
            this.outboundList = res.data.TeacherOutboundPage.content
            this.totalElements = +res.data.TeacherOutboundPage.totalElements
            this.totalPages = +res.data.TeacherOutboundPage.totalPages
            console.log(111, this.lessonType)
          }
        })
        .catch(() => {
          // loading.close()
        })
    },
    // 切换老师
    selectSellTeacher(teachers) {
      const { groupSell = '' } = teachers || {}
      this.manageChange(groupSell, 'teacherId')
    },
    // 绑定解绑
    goBind(val) {
      console.log(val.use_status)
      if (+val.use_status === 1) {
        return false
      }
      this.user_name = val.agent_name
      this.user_radio = val.tel_type === '1' ? '手机号' : 'IP电话'
      this.user_phone = val.tel
      this.listData = val
      this.centerDialogVisible = true
    },
    // 绑定
    postBind() {
      const { id, tel } = this.listData
      const telTypeName = this.listData.tel_type === 1 ? 'MOBILE' : 'IP_PHONE'
      const parmes = {
        teacherId: this.listData.teacher_id,
        id,
        tel,
        telType: telTypeName
      }
      return this.$http.Outbound.bindTel(parmes, this.currentPage)
        .then((res) => {})
        .catch(() => {
          // loading.close()
        })
    },
    // 分页
    handleSizeChange(val) {
      this.currentPage = val
      this.getPhoneList()
    },
    //
    getDepartment() {},
    // 改变状态
    getSearchData(key, val) {
      console.log(key, val)
      if (key === 'department') {
        this.department = val[0].department
      }
      if (key === 'groupSell') {
        this.agent = val[0].groupSell
      }
      if (key === 'phone') {
        this.phone = val[0]['']
      }

      this.getPhoneList()
    },
    //
    formatDate(date) {
      return formatData(date, 's')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 10px;
  padding: 20px;
  width: calc(100vw)-50px;
  background: white;
  overflow: hidden;
  .demo-form-inline {
    margin: 0 auto;
    text-align: center;
  }
  .demo-form-flex {
    display: flex;
  }
}
.el-input__inner {
  width: 150px !important;
}
</style>
