<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-29 18:47:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-13 16:36:43
 -->
<template>
  <div class="container">
    <el-select
      v-model="supDataInner"
      class="item-style"
      clearable
      size="mini"
      placeholder="选择难度"
      @change="supChange"
    >
      <el-option
        v-for="item in supList"
        :key="item.id"
        :label="item.text"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
// import axios from '@/api/axiosConfig'
import { SUP_LEVEL_LIST_UPPER, SUP_LEVEL_LIST_LOWER } from '@/utils/supList'

export default {
  props: {
    supData: {
      type: String,
      default: ''
    },
    isTrial: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // supList: null,
      supDataInner: ''
    }
  },
  computed: {
    supList() {
      console.log(this.isTrial)
      return this.isTrial ? SUP_LEVEL_LIST_UPPER : SUP_LEVEL_LIST_LOWER

    }
  },
  created() {
    // this.getSup()
    // this.supList = SUP_LEVEL_LIST_UPPER
  },
  mounted() {
    this.$root.$on('qingkong', () => {
      this.supDataInner = ''
    })
  },
  methods: {
    // async getSup() {
    //   axios
    //     .post('/graphql/filter', {
    //       query: `{
    //         courseSupList{
    //             id
    //             name
    //           }
    //         }
    //       `
    //     })
    //     .then((res) => {
    //       const supList = res.data.courseSupList

    //       this.supList = supList.filter((item) => {
    //         return +item.id < 4 && +item.id > 0
    //       })
    //     })
    // },
    supChange(data) {
      console.log(data, 'data')
      this.$emit('result', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 138px !important;
}
</style>
