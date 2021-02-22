<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-12-09 15:49:39
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-12-18 18:05:43
-->
<template>
  <div class="search-item small">
    <el-form :inline="true" class="demo-form-flex">
      <el-form-item label="学员搜索:">
        <search-phone-and-username
          name="studentid"
          type="2"
          :tablename="
            lessonType === 1
              ? 'StudentTrialStatisticsList'
              : 'StudentSystemStatisticsListEx'
          "
          :custom-style="{ width: '160px' }"
          placeholder="手机号或昵称"
          :teacher-id="[teacherIds]"
          @result="getSearchUser('studentid', arguments)"
        />
        <!-- <el-input
          size="mini"
          v-model="form.stu"
          placeholder="学员搜索"
          suffix-icon="el-icon-search"
          @change="getSearchData()"
          clearable
        ></el-input> -->
      </el-form-item>
      <el-form-item label="投诉单号:">
        <el-input
          size="mini"
          v-model="form.complaintNo"
          placeholder="投诉单号"
          suffix-icon="el-icon-search"
          @change="getSearchData('num')"
          clearable
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="投诉类型:">
        <el-select
          size="mini"
          v-model="form.cpStatusSub"
          placeholder="投诉类型"
          @change="getSearchData('status')"
          clearable
        >
          <el-option
            v-for="item in issusType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="投诉问题:">
        <el-select
          size="mini"
          multiple="multiple"
          v-model="form.problemPid"
          placeholder="投诉问题"
          @change="getSearchData('quest')"
          clearable
        >
          <el-option
            v-for="item in issusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :inline="true" class="demo-form-flex">
      <el-form-item label="辅导老师">
        <div style="display:flex">
          <department
            style="width:130px;margin-right:20px;"
            @result="getDepartment_s"
            :name="'department'"
            :onlyDept="1"
            tip="辅导老师"
          />
          <group-sell
            :teacherscope="teacherscope_s"
            :isMultiple="true"
            @result="selectLastTeacher"
            :name="+teacher.dutyId === 1 ? 'pay_teacher_id' : 'last_teacher_id'"
            class="margin_l10"
            tip="辅导老师"
          />
        </div>
      </el-form-item>
      <el-form-item label="社群销售">
        <div style="display:flex">
          <department
            name="pay_teacher_id"
            placeholder="全部销售组"
            @result="getDepartment"
            style="margin-right:10px;"
          />
          <group-sell
            :teacherscope="teacherscope"
            :isMultiple="true"
            tip="全部社群销售"
            @result="selectPayTeacher"
            name="pay_teacher_id"
            class="margin_l10"
          />
        </div>
      </el-form-item>
      <!-- <systemCourseType
        style="width:140px"
        teamType="1"
        @result="getSystemCourseType"
        name="packages_type"
      /> -->
      <!-- 体验课老师 -> pay_teacher_id; 系统课老师 -> last_teacher_id -->
      <el-form-item label="当前处理负责人">
        <el-input
          size="mini"
          v-model="form.currentStaffName"
          placeholder="当前处理负责人"
          suffix-icon="el-icon-search"
          @change="getSearchData('handler')"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { isToss } from '@/utils/index'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
import Department from '@/components/MSearch/searchItems/department'

// import systemCourseType from '@/components/MSearch/searchItems/systemCourseType.vue'
export default {
  props: {
    dataType: {
      type: String,
      default: ''
    },
    teacherIds: {
      type: Array,
      default: () => []
    }
  },
  components: {
    SearchPhoneAndUsername,
    GroupSell,
    Department
    // systemCourseType
  },
  data() {
    return {
      issusList: [
        { label: '销售相关', value: 103101 },
        { label: '教辅相关', value: 103102 },
        { label: '课程相关', value: 103103 },
        { label: '退费问题', value: 103104 },
        { label: '转介绍相关', value: 103105 },
        { label: '活动相关', value: 103106 },
        { label: '产品技术相关', value: 103107 },
        { label: '小熊商城', value: 103108 },
        { label: '小熊魔盒', value: 103109 },
        { label: '其他', value: 103110 }
      ],
      issusType: [
        { label: '首次处理', value: 21 },
        { label: '退回处理', value: 11 }
      ],
      form: {
        userId: '',
        complaintNo: '',
        // status: '',
        problemPid: '',
        // cpStatusSub: '',
        currentStaffName: '',
        // teacher_id: ''
        userRemarkEightExt: [], // 社群销售 体验
        userRemarkNineExt: [] // 辅导老师  正式
      },
      teacherscope: [],
      teacherscope_s: [],
      teacher: {},
      lessonType: ''
    }
  },
  computed: {},
  watch: {
    // form: {
    //   deep: true,
    //   handler(val, oldval) {
    //     console.log('test', val, oldval)
    //     if (!this.form.userRemarkEightExt) {
    //       this.form.userRemarkEightExt = []
    //     }
    //     if (!this.form.userRemarkNineExt) {
    //       this.form.userRemarkNineExt = []
    //     }
    //     this.$emit('searchTable', this.form)
    //   }
    // }
  },
  methods: {
    //
    // getAllTeacherByRoleIds() {
    //   const teacherid = isToss()
    //   this.$http.Permission.getAllTeacherByRole({
    //     teacherId: teacherid
    //   }).then((res) => {
    //     this.teacherIds = res
    //     if (this.lessonType === 1) {
    //       this.form.userRemarkEightExt = this.teacherIds
    //     } else if (this.lessonType === 2) {
    //       this.form.userRemarkNineExt = this.teacherIds
    //     }
    //   })
    // },
    //
    getDepartment_s(res) {
      this.teacherscope_s = res.pay_teacher_id || null
    },
    getDepartment(res) {
      this.teacherscope = res.pay_teacher_id || null
      console.log(res.department)
      // this.setSeachParmas(res, ['pay_teacher_id'], 'terms')
    },
    getSearchData(key, value) {
      console.log(this.form)
      this.$emit('searchTable', this.form)
    },
    // 学员搜索
    getSearchUser(key, value) {
      console.log(key, value)
      this.form.userId = value[0].studentid
      this.$emit('searchTable', this.form)
    },
    // 辅导老师
    selectLastTeacher(value) {
      if (!value) return
      this.form.userRemarkNineExt = value.last_teacher_id
      this.$emit('searchTable', this.form)
    },
    // 社群销售
    selectPayTeacher(value) {
      if (!value) return
      this.form.userRemarkEightExt = value.pay_teacher_id
      this.$emit('searchTable', this.form)
    }
  },
  created() {
    // this.lessonType = +JSON.parse(localStorage.getItem('teacher')).dutyId
    // this.getAllTeacherByRoleIds()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
/deep/ .el-icon-search {
  top: 14px !important;
}
</style>
