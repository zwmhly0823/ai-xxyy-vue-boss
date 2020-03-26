<template>
  <div class="container">
    <el-tree
      class="left-container-tree"
      :data="[...whack]"
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
import axios from '@/api/axios'
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
        },
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
    getExpressList() {
      axios
        .post('/graphql/logisticsStatistics', {
          query: `{
          logisticsStatistics(query:"") {
            no_address
            wait_send
            has_send
            has_signed
            signed_failed
            has_return
            confirm_wait_send
            invalid
          }
        }`
        })
        .then((res) => {
          console.log(res, 'resList', res.data.logisticsStatistics)
          const x = res.data.logisticsStatistics
          const arr = [x.no_address, x.wait_send, x.has_send, x.has_signed]

          // arr = res.data.logisticsStatistics.no_address

          console.log(arr)
        })
    },
    nodeClick(data) {
      // this.$emit('change', data)
      console.log(data, 'changedata')
    }
  },
  created() {
    this.getExpressList()
  }
}
</script>

<style lang="scss" scoped>
.container {
  font-size: 14px;
  height: 100%;
  background-color: #fff;
}
</style>
