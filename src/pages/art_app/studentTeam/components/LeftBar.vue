<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-05-09 15:14:36
 -->
<template>
  <div class="left-container">
    <el-input
      v-model="input"
      placeholder="搜索班级名称"
      prefix-icon="el-icon-search"
      size="small"
      v-if="false"
    >
    </el-input>

    <el-popover
      placement="bottom-start"
      trigger="click"
      width="280"
      v-model="popStatus"
    >
      <div class="filter-items">
        <div class="title">过滤</div>
        <div class="search">
          <m-search
            class="search-box"
            @search="handleSearch"
            stage="term"
            sup="sup.keyword"
            last_team_id="id"
            phone="id"
            onlyPhone="1"
            :addSupS="true"
            phoneTip="手机号/微信昵称"
            ref="search"
          ></m-search>
        </div>
        <div class="btn-box">
          <el-button class="item-btn" type="" @click="closeHandler"
            >取消</el-button
          >
          <el-button class="item-btn" type="primary" @click="filterHandler"
            >过滤</el-button
          >
        </div>
      </div>

      <div class="filter-class" slot="reference">
        <svg
          t="1586249118309"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2121"
        >
          <path
            d="M929.684 802.883H691.057c-8.508 0-18.253 9.731-18.253 18.253v14.934c0 8.508 9.731 18.253 18.253 18.253h238.627c8.508 0 18.253-9.731 18.253-18.253v-14.934c0-8.522-9.731-18.253-18.253-18.253z m0-149.091H691.057c-8.508 0-18.253 9.689-18.253 18.225v14.92c0 8.508 9.731 18.225 18.253 18.225h238.627c8.508 0 18.253-9.703 18.253-18.225v-14.92c0-8.536-9.731-18.225-18.253-18.225z m0-149.147H691.057c-8.508 0-18.253 9.717-18.253 18.239v14.92c0 8.522 9.731 18.253 18.253 18.253h238.627c8.508 0 18.253-9.717 18.253-18.253v-14.92c0-8.522-9.731-18.239-18.253-18.239z"
            p-id="2122"
            fill="#666"
          ></path>
          <path
            d="M841.991 173.431c3.966-3.305 4.795-10.448 2.63-21.248l-0.914-2.039c-8.817-12.67-15.666-18.309-22.134-18.309l-724.444 0.155c-5.667 1.266-15.37 11.208-17.367 17.325l-1.631 3.459c-4.106 6.159-1.702 19.167 3.628 27.872l255.558 281.855v313.903c0 6.286 4.205 16.2 13.106 18.45l208.589 96.441 1.617 0.45c1.99 0.266 4.292 0.418 6.628 0.418 2.633 0 5.22-0.193 7.749-0.565l2.821-1.414c10.477-6.961 13.486-11.475 13.486-20.194l-1.125-411.342 251.803-285.216z m-73.055 9.816L554.638 426.374h-2.363l-1.392 0.97c-2.63 1.814-5.625 2.728-8.916 2.728H376.479L154.306 183.247h614.63zM542.98 481.47l-0.225 354.094L388.7 761.441v-279.97h154.28z"
            p-id="2123"
            fill="#666"
          ></path>
        </svg>
        <span class="text">过滤</span>
      </div>
    </el-popover>

    <el-tree
      class="left-container-tree"
      :data="[...showExperienceData, ...showSystemData]"
      :props="defaultProps"
      default-expand-all
      node-key="customId"
      :current-node-key="30"
      highlight-current
      style="color:#2F2E31"
      @node-click="nodeClick"
    ></el-tree>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MSearch from '@/components/MSearch/index.vue'

export default {
  props: {
    experienceData: {
      type: Object,
      default: () => ({})
    },
    systemData: {
      type: Object,
      default: () => ({})
    }
  },
  components: { MSearch },
  data() {
    return {
      input: '',
      popStatus: false, // 过滤条件
      filterItem: null,
      defaultProps: {
        children: 'children',
        label: 'showName'
      }, // 定义节点名称
      experiencelist: [
        {
          showName: '体验课班级',
          value: '',
          children: [
            {
              showName: '全部（0）',
              value: '_all'
            },
            {
              showName: '待开课（0）',
              value: '0'
            },
            {
              showName: '今日开课（0）',
              value: '3'
            },
            {
              showName: '上课中（0）',
              value: '1'
            },
            {
              showName: '已结课（0）',
              value: '2'
            }
          ]
        }
      ],
      systemlist: [
        {
          showName: '系统课班级（0）',
          value: '',
          children: [
            {
              showName: '全部（0）',
              value: '_all'
            },
            {
              showName: '待开课（0）',
              value: '0'
            },
            {
              showName: '今日开课（0）',
              value: '3'
            },
            {
              showName: '上课中（0）',
              value: '1'
            },
            {
              showName: '已结课（0）',
              value: '2'
            }
          ]
        }
      ]
    }
  },
  computed: {
    /**
     * 体验课状态展示数据
     */
    showExperienceData() {
      const datas = this.experiencelist[0].children.map((values, index) => {
        values.types = 0
        values.code = values.value
        values.customId = +`${index}0`
        this.experienceData.teamStatusCount &&
          this.experienceData.teamStatusCount.filter((v) => {
            if (v.code === values.value) {
              values.showName = `${values.showName.split('（')[0]}（${
                v.value ? v.value : 0
              }）`
            }
          })
        return values
      })
      const showExperience = [
        {
          showName: '体验课班级',
          value: '',
          children: datas
        }
      ]
      return showExperience
    },
    /**
     * 系统课状态展示数据
     */
    showSystemData() {
      const datas = this.systemlist[0].children.map((values, index) => {
        values.types = 1
        values.code = values.value
        values.customId = +`${index}1`
        this.systemData.teamStatusCount &&
          this.systemData.teamStatusCount.filter((v) => {
            if (v.code === values.value) {
              values.showName = `${values.showName.split('（')[0]}（${
                v.value ? v.value : 0
              }）`
            }
          })
        return values
      })
      const showStstem = [
        {
          showName: '系统课班级',
          value: '',
          children: datas
        }
      ]
      return showStstem
    }
  },
  methods: {
    ...mapActions('team', ['setUser']),
    nodeClick(data) {
      console.log(data, 'dadadada')

      this.$emit('change', data)
    },
    handleSearch(res) {
      console.log(res, '搜索返回值')

      this.filterItem = res
    },
    filterHandler() {
      this.popStatus = false
      // 获取输入的学员手机号
      const phone = this.$refs.search.$refs.searchUserByPhone.input
      let tid = ''
      if (phone && this.filterItem && this.filterItem.length > 0) {
        this.filterItem.forEach((item) => {
          if (item.term && item.term.id) tid = item.term.id
        })
        const user = { tid, phone }
        this.setUser(user)
      } else {
        this.setUser({
          tid: '',
          phone: ''
        })
      }
      this.$emit('filter', this.filterItem)
    },
    closeHandler() {
      this.popStatus = false
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.left-container {
  padding: 10px 0px;
  .filter-class {
    width: 65px;
    margin: 5px 0px 5px 10px;
    padding: 5px;
    font-size: 12px;
    display: flex;
    align-items: center;
    background: #f8f8f8;
    border-radius: 5px;
    .icon {
      width: 18px;
      margin-right: 5px;
    }
    .text {
      color: #666;
    }
  }
}
</style>
<style lang="scss">
.filter-items {
  display: flex;
  flex-direction: column;
  .title {
    font-size: 16px;
    margin-left: 10px;
  }
  .search {
    width: 200px;
    .el-select {
      margin-left: 0px !important;
    }
  }
  .btn-box {
    align-self: flex-end;
    display: flex;
    justify-content: flex-end;
    width: 150px;
    .item-btn {
      padding: 5px 10px !important;
    }
  }
}

.left-container-tree {
  .is-current {
    > .el-tree-node__content {
      background: #ebebeb !important;
    }
  }
}
</style>
