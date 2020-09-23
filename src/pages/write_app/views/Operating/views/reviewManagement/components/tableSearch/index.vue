<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-25 14:35:19
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-23 16:02:08
 -->
<template>
  <div class="table-searcher-container">
    <div class="comp-cell">
      <department
        style="width:130px;"
        @result="getDepartment"
        :name="'teacher_id'"
        :placeholder="'区部'"
      />
    </div>
    <div class="comp-cell">
      <group-sell
        style="width:130px;"
        @result="selectSellTeacher"
        :name="'teacher_id'"
        :teacherscope="teacherScope"
        :tip="'老师'"
      />
    </div>
    <!-- 点评状态 -->
    <div class="comp-cell">
      <el-select
        class="item-style"
        size="mini"
        v-model="formInfo.is_comment"
        clearable
        placeholder="点评状态"
        @change="commentStatusChange"
      >
        <el-option
          v-for="item in commentStatus"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <div class="comp-cell">
      <el-select
        class="item-style"
        size="mini"
        v-model="formInfo.course_type"
        clearable
        placeholder="课程类型"
        @change="courseTypeChange"
      >
        <el-option
          v-for="item in categoryTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="comp-cell" style="margin-right: 10px;">
      <m-search
        class="search-box"
        @search="handleSearch"
        phone="student_id"
        onlyPhone="1"
        phoneTip="用户手机号"
      />
    </div>
    <div class="comp-cell">
      <el-date-picker
        size="small"
        v-model="ctime"
        type="datetimerange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="接收开始日期"
        end-placeholder="接收结束日期"
        :default-time="['00:00:00', '23:59:59']"
        @change="sellCycleTimeChange"
      >
      </el-date-picker>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
// import SearchTeamName from '@/components/MSearch/searchItems/searchTeamName'
import MSearch from '@/components/MSearch/index.vue'
import Department from '@/components/MSearch/searchItems/department'
import GroupSell from '@/components/MSearch/searchItems/groupSell'
// import StageSupLevels from '@/components/MSearch/searchItems/stageSupLevels.vue'
export default {
  // props: {
  //   regType: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  data() {
    return {
      teamName: '',
      sup: 'sup',
      coursePlaceholder: {
        0: '体验课排期',
        1: '系统课排期'
      },
      commentStatus: [
        {
          label: '待点评',
          value: '0'
        },
        {
          label: '已点评',
          value: '1'
        }
      ],
      categoryTypeList: [
        {
          label: '体验课',
          value: '1'
        },
        {
          label: '系统课',
          value: '2'
        }
      ],
      formInfo: {
        is_comment: '',
        course_type: '',
        student_id: '',
        teacher_id: '',
        ctime: {}
      },
      ctime: [],
      emitInfo: {},
      // 通过区部获取到的老师数组
      teacherScope: null
    }
  },
  components: {
    Department,
    GroupSell,
    MSearch
  },
  methods: {
    // 用户手机号
    handleSearch(res) {
      const [term = {}] = res || []
      // eslint-disable-next-line camelcase
      const { term: { student_id = '' } = {} } = term
      this.manageChange(student_id, 'student_id')
    },
    sellCycleTimeChange(timeArr = []) {
      if (!timeArr || timeArr.length === 0) {
        this.formInfo.ctime = {}
      } else {
        const [startTime = '', endTime = ''] = timeArr
        this.formInfo.ctime = {
          gte: startTime + '',
          lte: endTime + ''
        }
      }
      this.manageChange(this.formInfo.ctime, 'ctime')
    },
    // 老师
    selectSellTeacher(res) {
      console.log(res)
      this.manageChange(res.teacher_id, 'teacher_id')
    },
    // 销售组
    getDepartment(res) {
      console.log(res, 'getDepartment')
      this.teacherScope =
        (res && (res.teacher_id.length > 0 ? res.teacher_id : null)) || null
      this.manageChange(res.teacher_id || [], 'teacher_id')
    },
    // 点评状态
    commentStatusChange(res) {
      this.manageChange(this.formInfo.is_comment, 'is_comment')
    },
    // 课程类型
    courseTypeChange(res) {
      console.log(res, 'res')
      this.manageChange(this.formInfo.course_type, 'course_type')
    },
    manageChange(res, key) {
      console.log(res, key)
      if (!res || Object.keys(res).length === 0) {
        delete this.emitInfo[key]
      } else {
        this.emitInfo[key] = res
      }
      this.$emit('change', this.emitInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-card.search-style.search-box.is-never-shadow {
  border: none;
  margin: 0;
}
.scroll-search-container {
  overflow-y: hidden;
}
.table-searcher-container {
  display: flex;
  align-items: center;
  // min-width: 1200px;
  flex-wrap: wrap;
  // justify-content: space-around;
  // height: 50px;
  .comp-cell {
    margin: 5px 30px 5px 0;
    display: flex;
    align-items: center;
    .search-item.small {
      width: auto !important;
    }
    .base-input {
      width: 130px;
    }
    .item-style {
      width: 140px;
    }
    ::v-deep {
      .el-card__body {
        padding: 0;
      }
      .el-range-editor--small.el-input__inner {
        height: 28px;
      }
    }
  }
}
</style>
