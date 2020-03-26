<template>
  <div class="container">
    <el-tree
      class="left-container-tree"
      :data="[...whack, ...errorState]"
      :props="defaultProps"
      default-expand-all
      node-key="customId"
      :current-node-key="0"
      highlight-current
      style="color:#2F2E31"
      @node-click="nodeClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      whack: [
        {
          label: '物流状态',
          children: [
            {
              label: '全部（0）'
            },
            {
              label: '无地址（0）'
            },
            {
              label: '待审核（0）'
            },
            {
              label: '待发货（0）'
            },
            {
              label: '已发货（0）'
            },
            {
              label: '已完成（0）'
            }
          ]
        }
      ],
      errorState: [
        {
          label: '异常状态',
          children: [
            {
              label: '全部（0）'
            },
            {
              label: '失效（0）'
            },
            {
              label: '已取消（0）'
            },
            {
              label: '已退货（0）'
            },
            {
              label: '签收失败（0）'
            }
          ]
        }
      ]
    }
  },
  methods: {
    nodeClick(data) {
      this.$emit('change', data)
      console.log(data, 'changedata')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: #fff;
}
</style>
