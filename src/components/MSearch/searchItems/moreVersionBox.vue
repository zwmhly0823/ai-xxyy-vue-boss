<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: Lukun
 * @LastEditTime: 2020-06-03 16:44:02
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="versionId"
      size="mini"
      clearable
      :disabled="disableClick"
      placeholder="随材版本"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="(item, i) in productVersion"
        :key="i"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productVersion: [],
      versionId: null
    }
  },
  watch: {
    versionId(val) {
      console.log(val, 'verSionId')
    }
  },
  computed: {
    ...mapState({
      disableClick: (state) => {
        return state.leftbar.disableClick
      }
    })
  },
  created() {
    this.getProductVersion()
    this.$root.$on('lk', (r) => {
      this.versionId = '' // 补发货清空数据
    })
  },
  methods: {
    compare(property) {
      return function(a, b) {
        const value1 = a[property].replace(/[^0-9]/gi, '')
        const value2 = b[property].replace(/[^0-9]/gi, '')
        if (value1 < value2) {
          return -1
        }
      }
    },
    // 获取多版本盒子
    getProductVersion() {
      this.$http.Product.getCourseVersion({ type: 'courseVersion' }).then(
        (res) => {
          if (res && res.payload) {
            this.productVersion = res.payload.sort(this.compare('code'))
            console.log(this.productVersion, 'this.productVersion')
          }
        }
      )
    },
    onChange(data) {
      console.log(data, '------------data')
      this.$emit('result', data ? { [this.name]: data } : '')
    },
    onClear() {
      this.$emit('result', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 108px !important;
  }
}
</style>
