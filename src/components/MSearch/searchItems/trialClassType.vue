<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-09 19:05:09
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-09 19:05:09
 * @Description: 体验课类型选择 关联表：tg_student_trial_course, team_category: 0-双周  3-单周.
 * 更正：通过o_order表的 packages_id 区分体验课单双周类型。 11- 单周；5，6双周   1-9.9元课程
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="type"
      size="mini"
      clearable
      :placeholder="placeholder"
      @change="onChange"
      class="item-style"
    >
      <el-option
        v-for="(item, index) in typeList"
        :key="index"
        :value="item.id"
        :label="item.text"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    typeB: {
      type: Number,
      default: 0,
    },
    addSupS: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '体验课类型',
    },
    // 排期班级类型
    classType: {
      type: String,
      default: '0',
    },
    // 体验课类型 2是双周 1是单周
    exType: {
      type: Number,
      default: null,
    },
    // 套餐类型类型
    classArr: {
      type: Array,
      default: () => [],
    },
    isOrder: {
      type: Boolean,
      default: false,
    },
    isExpress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      type: null,
      typeList: [],
      typeList1: [
        {
          id: ['0', '6'],
          text: '全部',
        },
        {
          id: ['6'],
          text: '单周体验课',
        },
        {
          id: ['0'],
          text: '双周体验课',
        },
      ],
      typeList2: [
        {
          id: ['0', '3', '503', '505'],
          text: '全部',
        },
        {
          id: ['3'],
          text: '单周体验课',
        },
        {
          id: ['0', '503', '505'],
          text: '双周体验课',
        },
      ],
      // 物流
      typeList3: [
        {
          id: ['500', '502', '503', '505','508'],
          text: '全部',
        },
        {
          id: ['502'],
          text: '29元单周体验课',
        },
        {
          id: ['505'],
          text: '9.9元双周体验课',
        },
        {
          id: ['508'],
          text: '22元双周体验课',
        },
        {
          id: ['503'],
          text: '29元双周体验课',
        },
        {
          id: ['500'],
          text: '49元双周体验课',
        },
      ],
      // 体验课学员
      typeList4: [
        {
          id: ['0', '3', '503', '505'],
          text: '全部',
        },
        {
          id: ['3'],
          text: '单周体验课',
        },
        {
          id: ['0', '503', '505'],
          text: '双周体验课',
        },
      ],
      typeList5: [
        {
          id: ['0', '2'],
          text: '全部',
        },
        {
          id: ['2'],
          text: '单周体验课',
        },
        {
          id: ['0'],
          text: '双周体验课',
        },
      ],
      // 火山直播的体验课类型
      typeList6: [
        {
          id: ['0', '3'],
          text: '全部',
        },
        {
          id: ['3'],
          text: '单周体验课',
        },
        {
          id: ['0'],
          text: '双周体验课',
        },
      ],
    }
  },
  watch: {
    classType(val) {
      this.getClassType(JSON.stringify({ type: val }))
    },
    classArr(val) {
      this.type = null
      if (val.length == 0) {
        this.getClassType()
        return
      }
      this.typeList = val
    },
    // exType(val) {
    //   this.getClassType(JSON.stringify({ type: val }))
    // }
  },
  mounted() {
    if (this.name == 'category' && this.typeB != 1) {
      this.typeList = this.typeList2
    } else if (this.name == 'packages_type') {
      this.typeList = this.typeList1
    } else if (this.name == 'packages_id') {
      if (this.exType && !this.isOrder) {
        let type = this.exType == 2 ? 0 : 2
        this.initData(JSON.stringify({ type }))
      } else {
        this.initData()
      }
    } else if (this.name == 'team_category') {
      this.getClassType(JSON.stringify({ type: this.classType }))
    } else if (this.name == 'type') {
      this.typeList = this.typeList5
    } else if (this.name == 'category' && this.typeB == 1) {
      this.typeList = this.typeList6
    } else if (this.name == 'class_list') {
      this.getClassType()
    } else if (this.isExpress) {
      let type = this.exType == 2 ? 0 : 2
      this.initData(JSON.stringify({ type }))
    }
  },
  created() {
    // if (!this.exType && !this.isExpress) {
    //   setTimeout(() => {
    //     this.getClassType()
    //   })
    // }
  },
  methods: {
    onChange(item) {
      if (!item && item !== 0 && !this.classArr) {
        this.getClassType()
      }
      if (this.name == 'team_category') {
        this.$emit(
          'result',
          'team_category',
          item !== undefined ? [{ [this.name]: item }] : ''
        )
      } else {
        this.$emit('result', item !== undefined ? { [this.name]: item } : '')
      }
    },
    getClassType(type = '') {
      this.type = null
      this.$http.Order.getClassName('trialCourseCategoryList', type).then(
        ({ data }) =>
          (this.typeList = data.trialCourseCategoryList.map((item) => {
            item.text = item.name
            delete item.name
            return item
          }))
      )
    },
    initData(type = '') {
      let result = this.$http.Order.getClassName(
        'trialExpressPackageList',
        type
      ).then((res) => {
        if (res.data.trialExpressPackageList) {
          this.typeList = res.data.trialExpressPackageList.map((item) => {
            item.text = item.name
            delete item.name
            return item
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-item {
  &.small {
    .item-style {
      width: 140px !important;
      margin-right: 10px;
    }
    .item-style:last-child {
      margin-right: 0px;
    }
  }
}
</style>
