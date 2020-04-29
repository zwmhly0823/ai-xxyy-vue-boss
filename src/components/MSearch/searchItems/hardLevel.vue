<!--
 * @Descripttion: 难度级别 S1-S5
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: liukun
 * @LastEditTime: 2020-04-28 13:48:02
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="supData"
      class="item-style"
      clearable
      v-if="supName"
      size="mini"
      multiple
      :placeholder="placeholder"
      @change="supChange"
    >
      <el-option
        v-for="item in supList"
        :key="item.id"
        :label="item.name"
        :value="addSupS ? item.name : item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import axios from '@/api/axios'
import { mapState } from 'vuex'

export default {
  props: {
    placeholder: {
      type: String,
      default: '难度'
    },
    supName: {
      type: String,
      default: 'sup'
    },
    addSupS: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stageList: [],
      scheduleList: [],
      supList: [],
      levelList: [],
      stageData: null,
      schedule: null,
      supData: null,
      levelData: null
    }
  },
  computed: {
    ...mapState({
      disableClick: (state) => {
        return state.leftbar.disableClick
      },
      typeStage: (state) => {
        return state.leftbar.typeStage
      }
    })
  },
  watch: {
    addSupS(val) {
      console.log(val)
    }
  },
  async created() {
    await this.getSup()
  },
  methods: {
    // 难度
    async getSup() {
      axios
        .post('/graphql/filter', {
          query: `{
            courseSupList{
                id
                name
              }
            }
          `
        })
        .then((res) => {
          this.supList = res.data.courseSupList
          this.supList.splice(
            res.data.courseSupList.filter((item) => +item.id === 0),
            1
          )
        })
    },

    supChange(data) {
      console.log(data, 'ddddaaaa')

      this.$emit(
        'supCallBack',
        data.length > 0 ? { [this.supName]: this.supData } : ''
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 100%;
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
<style lang="scss">
.el-select__tags {
  flex-wrap: nowrap !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
