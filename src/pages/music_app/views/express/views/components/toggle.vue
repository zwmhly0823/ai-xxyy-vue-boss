<template>
  <div class="container">
    <div class="status" :key="index" v-for="(item, index) in toggleList">
      <span
        :class="{ 'pitch-up': index == activeIndex }"
        @click="getToggleClick(index)"
      >
        {{ item.label }}
        <span class="count">{{ item.count }}</span>
      </span>
    </div>
  </div>
</template>
<script>
/* eslint-disable camelcase */
import { isToss, injectSubject } from '@/utils/index'
import { expressToggleList } from '@/utils/expressItemConfig'
import eventBus from './bug'
export default {
  props: {
    seachTotal: {
      type: Number,
      default: 0,
    },
    hideToggleBtn: {
      type: Array,
      default: () => {
        return []
      },
    },
    tab: {
      type: String,
      default: '',
    },
    source_type: {
      type: String,
      default: '',
    },
    regtype: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeIndex: 0,
      toggleList: JSON.parse(JSON.stringify(expressToggleList)),
    }
  },
  methods: {
    getLogisticsStatistics() {
      let q
      if (this.teacherId || this.teacherId === 0) {
        q = `{"teacher_id": [${this.teacherId}],"regtype":[${this.regtype}],"source_type":[${this.source_type}]}`
      } else if (this.tab === '0' || this.tab === '4') {
        q = `{"regtype":[${this.regtype}],"source_type":[${
          this.source_type
        }],"packages_id":[${
          this.tab === '0'
            ? [500, 503, 505, 508]
            : this.tab === '4'
            ? [502, 506, 507]
            : null
        }]}`
      } else {
        q = `{"regtype":[${this.regtype}],"source_type":[${this.source_type}]}`
      }
      const query = JSON.stringify(injectSubject(q))
      this.$http.Express.getLogisticsStatistics({
        query: `{
          logisticsStatisticsNew(query:${query}) {
            no_address
            wait_send
            has_send
            has_signed
            signed_failed
            has_return
            confirm_wait_send
            invalid
            difficult
            pause
          }
        }`,
      }).then((res) => {
        const x = res.data.logisticsStatisticsNew
        this.toggleList.map((item) => {
          if (item.id === '0') {
            item.count = Number(x?.no_address) || '0'
          }
          if (item.id === '1') {
            item.count = Number(x?.wait_send) || '0'
          }
          if (item.id === '2') {
            item.count = Number(x?.has_send) || '0'
          }
          if (item.id === '4,5,8') {
            item.count =
              Number(x?.difficult) +
                Number(x?.has_return) +
                Number(x?.signed_failed) || '0'
          }
          if (item.id === '7') {
            item.count = Number(x?.invalid) || '0'
          }
          if (item.id === '9') {
            item.count = Number(x?.pause) || '0'
          }
        })
        this.toggleList = [...this.toggleList]
      })
    },
    getLogisticsStatisticsDsh(params) {
      let q
      if (this.teacherId || this.teacherId === 0) {
        q = `{"teacher_id": [${this.teacherId}],"regtype":[${this.regtype}],"source_type":[${this.source_type}],"center_express_id":{"lte":0},"subject":3}`
      } else if (this.tab === '0' || this.tab === '4') {
        q = `{"regtype":[${this.regtype}],"source_type":[${
          this.source_type
        }],"packages_id":[${
          this.tab === '0'
            ? [500, 503, 505, 508]
            : this.tab === '4'
            ? [502, 506, 507]
            : null
        }],"center_express_id":{"lte":0}}`
      } else {
        q = `{"regtype":[${this.regtype}],"source_type":[${this.source_type}],"center_express_id":{"lte":0},"subject":3}`
      }
      Object.assign(q, params)
      const query = JSON.stringify(q)
      this.$http.Express.getLogisticsStatistics({
        query: `{
          logisticsStatisticsNew(query:${query}) {
            no_address
            wait_send
            has_send
            has_signed
            signed_failed
            has_return
            confirm_wait_send
            invalid
            difficult
          }
        }`,
      }).then((res) => {
        const x = res.data.logisticsStatisticsNew
        this.toggleList.map((item) => {
          if (item.label === '待审核') {
            item.count = Number(x?.confirm_wait_send) || '0'
          }
        })
        this.toggleList = [...this.toggleList]
      })
    },
    getLogisticsStatisticsDsh1(params) {
      let q
      if (this.teacherId || this.teacherId === 0) {
        q = `{"teacher_id": [${this.teacherId}],"regtype":[${this.regtype}],"source_type":[${this.source_type}],"center_express_id":{"gt":0},"subject":3}`
      } else if (this.tab === '0' || this.tab === '4') {
        q = `{"regtype":[${this.regtype}],"source_type":[${
          this.source_type
        }],"packages_id":[${
          this.tab === '0'
            ? [500, 503, 505, 508]
            : this.tab === '4'
            ? [502, 506, 507]
            : null
        }],"center_express_id":{"gt":0}}`
      } else {
        q = `{"regtype":[${this.regtype}],"source_type":[${this.source_type}],"center_express_id":{"gt":0},"subject":3}`
      }
      Object.assign(q, params)
      const query = JSON.stringify(q)
      this.$http.Express.getLogisticsStatistics({
        query: `{
          logisticsStatisticsNew(query:${query}) {
            no_address
            wait_send
            has_send
            has_signed
            signed_failed
            has_return
            confirm_wait_send
            invalid
            difficult
          }
        }`,
      }).then((res) => {
        const x = res.data.logisticsStatisticsNew
        this.toggleList.map((item) => {
          if (item.label === '下单失败') {
            item.count = Number(x?.confirm_wait_send) || '0'
          }
        })
        this.toggleList = [...this.toggleList]
      })
    },
    getToggleClick(index) {
      this.activeIndex = index
    },
    hideSomeBtn() {
      for (let i = 0; i < this.toggleList.length; i++) {
        if (this.hideToggleBtn.includes(this.toggleList[i].id)) {
          this.toggleList.splice(i, 1)
          i--
        }
      }
    },
    getTeacherId() {
      const teacherId = isToss()
      if (teacherId) {
        this.teacherId = teacherId
      }
    },
    emitStatus() {
      this.$emit('result', this.toggleList[this.activeIndex])
    },
    initToggleList() {
      this.toggleList = JSON.parse(JSON.stringify(expressToggleList))
    },
  },
  mounted() {
    this.hideSomeBtn()
    this.getTeacherId()
    this.getLogisticsStatistics()
    this.getLogisticsStatisticsDsh()
    this.getLogisticsStatisticsDsh1()
  },
  watch: {
    tab(val) {
      this.getLogisticsStatistics()
      this.getLogisticsStatisticsDsh()
      this.getLogisticsStatisticsDsh1()
      this.initToggleList()
      this.hideSomeBtn()
      this.activeIndex = 0
    },
    activeIndex() {
      this.emitStatus()
    },
    seachTotal(newVal) {
      if (this.activeIndex != 5) {
        if ((newVal && this.activeIndex != 0) || newVal == 0) {
          this.toggleList[this.activeIndex].count =
            newVal > 0 && newVal < 1 ? 0 : newVal
          this.$set(
            this.toggleList,
            this.activeIndex,
            this.toggleList[this.activeIndex]
          )
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  .status {
    margin-right: 20px;
    font-weight: 400;
    padding: 5px;
    cursor: pointer;
    span {
      display: inline-block;
      padding-top: 5px;
      position: relative;
      .count {
        position: absolute;
        top: -12px;
        right: -15px;
        font-size: 12px;
        color: #999;
      }
    }
    .pitch-up {
      color: #2a75ed;
      position: relative;
      &::after {
        content: '';
        background: #2a75ed;
        height: 2px;
        bottom: -20px;
        width: 100%;
        display: inline-block;
      }
    }
  }
}
</style>
