<template>
  <div class="notice-list-component">
    <template v-if="showEmpty">
      <div class="empty-content">
        {{ emptyText }}
      </div>
    </template>
    <template v-else>
      <div class="filter-top-buttons">
        <el-button
          v-for="(bItem, bKey) in filterButtons"
          :key="bKey"
          :type="bItem.name === activeButton ? 'primary' : ''"
          size="small"
          class="button-item"
          @click="clickFilterButton(bItem)"
        >
          {{ bItem.name }}
        </el-button>
      </div>
      <el-collapse v-model="activeName" accordion class="list-collapse">
        <el-collapse-item
          v-for="(cItem, cKey) in listData"
          :key="cKey"
          :name="cKey"
          class="list-collapse-item"
        >
          <template slot="title">
            <span>{{ cItem.title }}</span>
            <span class="item-time">{{ cItem.notifyTimeFormatted }}</span>
          </template>
          <div>{{ cItem.content }}</div>
          <el-button
            type="text"
            class="details-button"
            @click="clickDetail(cItem.typeId, cItem.jumpLink)"
            >查看详情</el-button
          >
        </el-collapse-item>
      </el-collapse>
      <m-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :total="totalElements"
        @current-change="handleSizeChange"
        show-pager
      ></m-pagination>
    </template>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import MPagination from '@/components/MPagination/index'
import { noticeLinkTo } from '../utils/functions'
export default {
  name: 'noticeList',
  props: {
    type: String
  },
  components: {
    MPagination
  },
  data() {
    return {
      showEmpty: true,
      emptyText: '加载中请稍后',
      buttonsBusiness: [
        {
          name: '全部',
          value: 0
        },
        {
          name: '课前提醒',
          value: 3
        },
        {
          name: '订单提醒',
          value: 4
        }
        // {
        //   name: '审批提醒',
        //   value: 5
        // },
        // {
        //   name: '营销提醒',
        //   value: 6
        // }
      ],
      actionBusiness: [
        {
          name: '全部'
        },
        {
          name: '运维提醒'
        }
      ],
      filterButtons: [],
      activeButton: '',
      activeName: '1',
      noticeData: {},
      listData: [],
      typeId: null,
      currentPage: 1,
      totalPages: 1,
      totalElements: 1,
      noticeLoading: false
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem('staff'))
    this.filterButtons =
      this.type === 'buss'
        ? this.buttonsBusiness
        : this.type === 'action'
        ? this.actionBusiness
        : []
    this.getListData()
  },
  methods: {
    getTypeId() {
      // 类型对应id
      // 1 重点业务
      // 2 产品动态
      // 3 课前提醒
      // 4 订单提醒
      // 5 审批提醒
      // 6 营销提醒
      let typeId
      if (this.type === 'buss') {
        typeId = 1
      } else if (this.type === 'action') {
        typeId = 2
      }
      return typeId
    },
    getListData() {
      this.noticeLoading = true
      const query = {
        pageNumber: this.currentPage,
        pageSize: 20,
        staffId: this.userinfo.id,
        typeId: this.typeId || this.getTypeId() // 可以传空
      }
      this.$http.NoticeCenter.getAllNotifyByStaffId(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            res.payload.content.forEach((lItem) => {
              lItem.notifyTimeFormatted = formatData(lItem.notifyTime, 's')
            })
            this.noticeData = res
            this.listData = res.payload.content
            this.totalPages = +res.payload.totalPages
            this.totalElements = +res.payload.totalElements
            if (this.listData.length) {
              this.showEmpty = false
            } else {
              this.emptyText = '暂无数据'
            }
          } else {
            this.emptyText = '暂无数据'
            this.$message.error('获取消息列表失败')
          }
          this.noticeLoading = false
        })
        .catch(() => {
          this.noticeLoading = false
          this.emptyText = '暂无数据'
          this.$message.error('获取消息列表失败')
        })
    },
    handleSizeChange(val) {
      this.currentPage = val
      this.getListData()
    },
    clickFilterButton(item) {
      this.activeButton = item.name
      if (item.value === 0) {
        this.typeId = this.getTypeId()
      } else {
        this.typeId = item.value
      }
      this.getListData()
    },
    clickDetail(type, val) {
      noticeLinkTo(type, val)
    }
  }
}
</script>

<style lang="scss" scoped>
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.notice-list-component {
  .empty-content {
    text-align: center;
    color: #b2b2b2;
    height: calc(100vh - 140px);
    line-height: calc(100vh - 140px);
  }
  .filter-top-buttons {
    .button-item {
      margin: 10px;
    }
  }
  .list-collapse {
    .list-collapse-item {
      padding: 0 10px;
      .item-time {
        position: absolute;
        right: 50px;
        color: #b2b2b2;
      }
      .details-button {
        padding-bottom: 0;
      }
    }
  }
}
</style>
