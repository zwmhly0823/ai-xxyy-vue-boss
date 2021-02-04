<<<<<<< HEAD
<template>
  <div class="search-box">
    <div class="search-item">
      <span class="search-text">辅导老师</span>
      <department
        name="assistant_teacher_id_dpt"
        placeholder="区部"
        style="margin-right: 10px;"
        @result="getSearchData('assistant_teacher_id_dpt', arguments)"
      />
      <group-sell
        name="assistant_teacher_id"
        tip="老师姓名"
        is-multiple
        :teacherscope="assistantTeacherScope"
        :key="akey"
        @result="getSearchData('assistant_teacher_id', arguments)"
      />
    </div>
    <div class="search-item">
      <span class="search-text">兼职老师</span>
      <department
        name="parttime_teacher_id_dpt"
        placeholder="区部"
        style="margin-right: 10px;"
        @result="getSearchData('parttime_teacher_id_dpt', arguments)"
      />
      <group-sell
        name="parttime_teacher_id"
        tip="老师姓名"
        is-multiple
        :teacherscope="parttimeTeacherScope"
        :key="pkey"
        @result="getSearchData('parttime_teacher_id', arguments)"
      />
    </div>
    <div class="search-item">
      <span class="search-text">期/班级</span>
      <search-stage
        class="search-group-item"
        name="term"
        placeholder="请选择期"
        type="1"
        :myStyle="{ width: '100px' }"
        @result="getSearchData('term', arguments)"
      />
      <search-team-name
        teamnameType="1"
        @result="getSearchData('team_id', arguments)"
        name="team_id"
        :term="termScope"
        :key="tkey"
        class="margin_l10"
      />
    </div>
    <div class="search-item">
      <span class="search-text">学员查询</span>
      <search-phone
        @result="getSearchPhoneData"
        name="student_id"
        tip="学员手机号"
      />
    </div>
  </div>
</template>

<script>
import Department from '@/components/MSearch/searchItems/department.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'
export default {
  name: 'haveRiviewSearch',
  components: {
    Department,
    GroupSell,
    SearchStage,
    SearchTeamName,
    SearchPhone
  },
  data() {
    return {
      searchParams: {},
      assistantTeacherScope: null,
      parttimeTeacherScope: null,
      termScope: null,
      tkey: 0,
      pkey: 0,
      akey: 0
    }
  },
  methods: {
    getSearchData(key, res) {
      const data = (res && res[0]) || {}
      const val = data[key]

      if (!val || val.length === 0) {
        this.$delete(
          this.searchParams,
          key.includes('_dpt') ? key.replace('_dpt', '') : key
        )
        this.$emit('result', this.searchParams)
        if (key === 'parttime_teacher_id_dpt') {
          this.pkey = Date.now()
          this.parttimeTeacherScope = null
        }
        if (key === 'assistant_teacher_id_dpt') {
          this.akey = Date.now()
          this.assistantTeacherScope = null
        }
        if (key === 'term') {
          this.tkey = Date.now
          this.termScope = null
        }
        return
      }
      if (key === 'parttime_teacher_id_dpt') {
        this.pkey = Date.now()
        this.parttimeTeacherScope = val
        Object.assign(this.searchParams, { parttime_teacher_id: val })
      }
      if (key === 'assistant_teacher_id_dpt') {
        this.akey = Date.now()
        this.assistantTeacherScope = val
        Object.assign(this.searchParams, { assistant_teacher_id: val })
      }
      if (key === 'term') {
        this.tkey = Date.now()
        this.termScope = val
      }
      if (!key.includes('_dpt')) {
        Object.assign(this.searchParams, data)
      }
      this.$emit('result', this.searchParams)
    },
    getSearchPhoneData(val) {
      val
        ? Object.assign(this.searchParams, val)
        : this.$delete(this.searchParams, 'student_id')
      this.$emit('result', this.searchParams)
    }
    // resetPartOfFormData(val) {
    //   console.log(val, 'student')
    // }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  .search-item {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
    .search-text {
      font-size: 12px;
      margin-right: 10px;
    }
  }
  /deep/ .el-icon-circle-close {
    color: #c0c4cc;
  }
}
</style>
=======
<template>
  <div class="search-box">
    <div class="search-item">
      <span class="search-text">辅导老师</span>
      <department
        name="assistant_teacher_id_dpt"
        placeholder="区部"
        style="margin-right: 10px;"
        @result="getSearchData('assistant_teacher_id_dpt', arguments)"
      />
      <group-sell
        name="assistant_teacher_id"
        tip="老师姓名"
        is-multiple
        :teacherscope="assistantTeacherScope"
        :key="akey"
        @result="getSearchData('assistant_teacher_id', arguments)"
      />
    </div>
    <div class="search-item">
      <span class="search-text">兼职老师</span>
      <department
        name="parttime_teacher_id_dpt"
        placeholder="区部"
        style="margin-right: 10px;"
        @result="getSearchData('parttime_teacher_id_dpt', arguments)"
      />
      <group-sell
        name="parttime_teacher_id"
        tip="老师姓名"
        is-multiple
        :teacherscope="parttimeTeacherScope"
        :key="pkey"
        @result="getSearchData('parttime_teacher_id', arguments)"
      />
    </div>
    <div class="search-item">
      <span class="search-text">期/班级</span>
      <search-stage
        class="search-group-item"
        name="term"
        placeholder="请选择期"
        type="1"
        :myStyle="{ width: '100px' }"
        @result="getSearchData('term', arguments)"
      />
      <search-team-name
        teamnameType="1"
        @result="getSearchData('team_id', arguments)"
        name="team_id"
        :term="termScope"
        :key="tkey"
        class="margin_l10"
      />
    </div>
    <div class="search-item">
      <span class="search-text">学员查询</span>
      <search-phone
        @result="getSearchPhoneData"
        name="student_id"
        tip="学员手机号"
      />
    </div>
  </div>
</template>

<script>
import Department from '@/components/MSearch/searchItems/department.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'
export default {
  name: 'haveRiviewSearch',
  components: {
    Department,
    GroupSell,
    SearchStage,
    SearchTeamName,
    SearchPhone
  },
  data() {
    return {
      searchParams: {},
      assistantTeacherScope: null,
      parttimeTeacherScope: null,
      termScope: null,
      tkey: 0,
      pkey: 0,
      akey: 0
    }
  },
  methods: {
    getSearchData(key, res) {
      const data = (res && res[0]) || {}
      const val = data[key]

      if (!val || val.length === 0) {
        this.$delete(
          this.searchParams,
          key.includes('_dpt') ? key.replace('_dpt', '') : key
        )
        this.$emit('result', this.searchParams)
        if (key === 'parttime_teacher_id_dpt') {
          this.pkey = Date.now()
          this.parttimeTeacherScope = null
        }
        if (key === 'assistant_teacher_id_dpt') {
          this.akey = Date.now()
          this.assistantTeacherScope = null
        }
        if (key === 'term') {
          this.tkey = Date.now
          this.termScope = null
        }
        return
      }
      if (key === 'parttime_teacher_id_dpt') {
        this.pkey = Date.now()
        this.parttimeTeacherScope = val
        Object.assign(this.searchParams, { parttime_teacher_id: val })
      }
      if (key === 'assistant_teacher_id_dpt') {
        this.akey = Date.now()
        this.assistantTeacherScope = val
        Object.assign(this.searchParams, { assistant_teacher_id: val })
      }
      if (key === 'term') {
        this.tkey = Date.now()
        this.termScope = val
      }
      if (!key.includes('_dpt')) {
        Object.assign(this.searchParams, data)
      }
      this.$emit('result', this.searchParams)
    },
    getSearchPhoneData(val) {
      val
        ? Object.assign(this.searchParams, val)
        : this.$delete(this.searchParams, 'student_id')
      this.$emit('result', this.searchParams)
    }
    // resetPartOfFormData(val) {
    //   console.log(val, 'student')
    // }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  .search-item {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 10px;
    .search-text {
      font-size: 12px;
      margin-right: 10px;
    }
  }
  /deep/ .el-icon-circle-close {
    color: #c0c4cc;
  }
}
</style>
>>>>>>> feature/ossPlugin-20210204
