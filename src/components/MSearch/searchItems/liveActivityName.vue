<template>
  <div class="search-item small">
    <el-select
      v-model="type"
      size="mini"
      clearable
      filterable
      :placeholder="placeholder"
      @change="onChange"
      :filter-method="filterMethod"
      class="item-style"
    >
      <el-option
        v-for="item in typeList"
        :key="item.id"
        :value="item.liveName"
        :label="item.liveStatusName"
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
    placeholder: {
      type: String,
      default: '体验课类型',
    },
  },
  data() {
    return {
      type: null,
      words:"",
      typeList: [],
    }
  },
  mounted() {
    this.getList()
  },
  watch:{
    words(newValue,oldValue) {
      if(newValue || newValue == '') {
        this.getList()
      }
    }
  },
  methods: {
   async getList() {
      let obj = {
        keyword:this.words,
      }
      let result = await this.$http.liveBroadcast.liveAssociationActivityName(obj)
      this.typeList = result.payload
      console.log(this.typeList, 'this.typeList')
    },
    filterMethod(words) {
      this.words = words
    },
    onChange(type) {
      this.$emit('result', { [this.name]: type })
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