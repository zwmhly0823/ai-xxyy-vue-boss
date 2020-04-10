<template>
  <div class="container">
    <el-tree
      class="left-container-tree"
      :data="[...whack]"
      :props="defaultProps"
      default-expand-all
      :current-node-key="0"
      highlight-current
      style="color:#2F2E31"
      @node-click="nodeClick"
    ></el-tree>
    <div>123 {{ this.$store.state.whackId }}</div>
  </div>
</template>

<script>
import axios from '@/api/axios'
import { isToss } from '@/utils/index'
export default {
  data() {
    return {
      teacherId: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      whack: [
        {
          label: '物流状态',
          children: [
            {
              id: '_all',
              label: '全部（0）'
            },
            {
              id: 0,
              label: '无地址（0）'
            },
            {
              id: 6,
              label: '待审核（0）'
            },
            {
              id: 1,
              label: '待发货（0）'
            },
            {
              id: 2,
              label: '已发货（0）'
            },
            {
              id: 3,
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
              id: 7,
              label: '失效（0）'
            },
            {
              id: 5,
              label: '已退货（0）'
            },
            {
              id: 4,
              label: '签收失败（0）'
            }
          ]
        }
      ]
    }
  },
  methods: {
    getExpressList() {
      const q = `{"teacher_id": ${this.teacherId}}`
      const query = JSON.stringify(this.teacherId ? q : '')
      axios
        .post('/graphql/logisticsStatistics', {
          query: `{
          logisticsStatistics(query:${query}) {
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
          console.log(res, 'resList', res.data.logisticsStatistics, this.whack)
          const x = res.data.logisticsStatistics
          const logisticsStatus = [
            x.no_address,
            x.wait_send,
            x.has_send,
            x.has_signed,
            x.confirm_wait_send
          ]
          const logisticsError = [x.invalid, x.has_return, x.signed_failed]
          // arr = res.data.logisticsStatistics.no_address
          // const s = this.arrSum(logisticsStatus)
          // this.whack[0].children[1].label = logisticsStatus[0]
          // this.whack[0].children[2].label = logisticsStatus[1]
          // this.whack[0].children[3].label = logisticsStatus[2]
          // this.whack[0].children[4].label = logisticsStatus[3]
          // this.whack[0].children[5].label = logisticsStatus[4]
          this.whack[0].children = [
            {
              id: '0,1,2,3,6',
              label: `全部（${this.arrSum(logisticsStatus)}）`
            },
            {
              id: '0',
              label: `无地址（${Number(x.no_address)}）`
            },
            {
              id: '6',
              label: `待审核（${Number(x.confirm_wait_send)}）`
            },
            {
              id: '1',
              label: `待发货（${Number(x.wait_send)}）`
            },
            {
              id: '2',
              label: `已发货（${Number(x.has_send)}）`
            },
            {
              id: '3',
              label: `已完成（${Number(x.has_signed)}）`
            }
          ]
          this.whack[1].children = [
            {
              id: '7,5,4',
              label: `全部（${this.arrSum(logisticsError)}）`
            },
            {
              id: '7',
              label: `失效（${Number(x.invalid)}）`
            },
            {
              id: '5',
              label: `已退货（${Number(x.has_return)}）`
            },
            {
              id: '4',
              label: `签收失败（${Number(x.signed_failed)}）`
            }
          ]

          console.log(logisticsStatus, logisticsError)
        })
    },
    nodeClick(dataExpress) {
      this.$store.commit('getLeftBarId', dataExpress.id)
      this.$emit('change', dataExpress)
      console.log(dataExpress, 'changedata')
    },
    arrSum(arr) {
      let val = 0
      arr.forEach((arr) => {
        val += Number(arr)
      })
      return val
    }
  },
  created() {
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
    this.getExpressList()
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 15px;
  font-size: 14px;
  height: 100%;
  background-color: #fff;
}
</style>
