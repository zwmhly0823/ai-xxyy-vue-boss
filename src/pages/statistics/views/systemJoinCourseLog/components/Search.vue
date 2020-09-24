<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-09-24 17:20:53
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-24 17:58:19
-->
<template>
  <div class="search d-flex">
    <div class="search-item">
      <simple-select
        placeholder="是否参课"
        name="is_join_course"
        :data-list="selectList"
        :multiple="false"
      />
    </div>
    <div class="search-item">
      <simple-select
        placeholder="是否完课"
        name="is_complete_course"
        :data-list="selectList"
        :multiple="false"
      />
    </div>
  </div>
</template>

<script>
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect.vue'
export default {
  components: {
    SimpleSelect
  },
  data() {
    return {
      mobile: '',
      selectList: [
        {
          id: '1',
          text: '是'
        },
        {
          id: '0',
          text: '否'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding: 15px;
  &-item {
    margin-right: 10px;
  }
}
</style>
