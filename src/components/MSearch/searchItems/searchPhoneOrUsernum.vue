<!--
 * @Descripttion: 搜索用户手机号(mobile)或者用户编号 (user_num)
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-22 12:08:17
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-09-11 13:48:56
-->
<template>
  <div class="search-mobile d-flex align-center">
    <el-select
      size="mini"
      class="search-type"
      @change="handleChange"
      v-model="searchType"
      v-if="isHidden"
    >
      <el-option
        v-for="item in searchTypeList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <div class="search-item">
      <el-select
        class="item-style"
        :class="{ single: !isHidden }"
        :style="customStyle"
        v-model="value"
        filterable
        remote
        :reserve-keyword="true"
        size="mini"
        clearable
        :placeholder="placeholderText"
        :remote-method="handleDebounce"
        :loading="loading"
        @change="onChange"
      >
        <el-option
          v-for="item in dataList"
          :key="item.id"
          :label="`${
            item[name[searchType] === 'id' ? 'mobile' : name[searchType]]
          }`"
          :value="`${needUid ? item.u_id || item.id : item[name[searchType]]}`"
        ></el-option>
      </el-select>
      <i class="el-icon-search"></i>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import axios from '@/api/axiosConfig'
import { injectSubject } from '@/utils/index'
export default {
  props: {
    needUid: {
      type: String,
      default: 'id',
    },
    customStyle: {
      type: Object,
      default: null,
    },
    name: {
      type: Array,
      default: () => ['mobile', 'user_num_text'],
    },
    // 1-系统课，0-体验课 2-全部
    type: {
      type: String,
      default: '0',
    },
    placeholder: {
      type: Array,
      default: () => ['输入学员手机号', '输入学员ID'],
    },
    // 默认搜索u_user表。特殊情况传入对应graphql表, 如体验课学员列表：‘StudentTrialStatisticsList’
    tablename: {
      type: String,
      default: 'UserListEx',
    },
    // 运营管理--小熊币发送页面,只有用户ID搜索 1
    defaultType: {
      type: String,
      default: '0',
    },
    // 运营管理--小熊币发送页面,隐藏掉下拉选择
    isHidden: {
      type: Boolean,
      default: true,
    },
    // 是否增加扩展配置，抛出id使用
    extension: {
      type: Boolean,
      default: false,
    },
    userStatusKey: {
      type: String,
      default: 'user_status',
    },
    userNumKey: {
      type: String,
      default: 'user_num_text',
    },
  },
  data() {
    return {
      loading: false,
      value: '',
      searchType: 0,
      searchTypeList: [
        {
          value: 0,
          label: '学员手机号',
        },
        {
          value: 1,
          label: '学员ID',
        },
      ],
      dataList: [],
      uid: '',
    }
  },
  computed: {
    placeholderText() {
      return this.placeholder[this.searchType]
    },
    nameKey() {
      return this.needUid || this.name[this.searchType]
    },
    handleDebounce() {
      return debounce(this.getData, 500)
    },
  },
  created() {
    // this.getData()
  },
  methods: {
    handleChange() {
      this.value = ''
      this.uid = ''
      this.$emit('result', '')
    },
    getData(value = '') {
      if (!value) return
      const val = value.replace(/\s*/g, '')
      this.loading = true
      let range = {}
      // 系统课
      if (this.type === '1') {
        range = {
          [`${this.userStatusKey}`]: { gte: 2 },
        }
      }
      // 体验课
      if (this.type === '0') {
        range = { [`${this.userStatusKey}`]: ['1', '2'] }
      }
      // 全部
      // if (this.type === '2') {
      //   range = {
      //     [`${this.userStatusKey}`]: { gte: 0 }
      //   }
      // }
      const query = { ...range }
      //   const query = {}
      if (this.searchType === 0) {
        Object.assign(query, {
          'mobile.like': { 'mobile.keyword': `*${val}*` },
        })
      } else {
        Object.assign(query, {
          [`${this.userNumKey}.like`]: {
            [`${this.userNumKey}.keyword`]: `*${val}*`,
          },
        })
      }
      const q = JSON.stringify(query)

      const sort = `{"id":"desc"}`
      // 搜索全部学员时，传 u_id
      const exParams = this.tablename === 'UserExtendsList' ? 'u_id' : ''
      axios
        .post('/graphql/v1/toss', {
          query: `{
                  ${this.tablename}(query: ${JSON.stringify(
            injectSubject(q)
          )}, sort: ${JSON.stringify(sort)}){
                    id
                    user_num_text
                    mobile
                    ${exParams}
                  }
                }`,
        })
        .then((res) => {
          this.loading = false
          this.dataList = res.data[`${this.tablename}`]
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取选中的
    onChange(data) {
      const _list = [...this.dataList]
      for (const item of _list) {
        if (item.u_id === data || item.id === data || item.user_num_text === data) {
          this.uid = item.u_id
        }
      }
      !this.extension
        ? this.$emit('result', data ? { [this.nameKey]: data } : '')
        : this.$emit('result', data ? { uid: this.uid } : '')
    },
  },
}
</script>
<style lang="scss" scoped>
.search-type {
  width: 110px;
  ::v-deep {
    .el-input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: transparent;
    }
  }
}
.search-item {
  position: relative;
  .item-style {
    width: 140px;
    ::v-deep {
      .el-input__inner {
        padding-left: 25px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    &.single {
      ::v-deep {
        .el-input__inner {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
      }
    }
  }
  i {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
}
</style>
