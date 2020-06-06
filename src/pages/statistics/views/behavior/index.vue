<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-06 14:18:35
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-06 18:31:48
-->
<template>
  <article>
    <div><behaviorSearch @fourpoints="fourpoints" /></div>
    <div class="bottom-table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="用户信息">
          <template slot-scope="scope">
            <div class="user-info-box">
              <img
                class="user-info-img"
                :src="`${scope.row.head}?x-oss-process=image/resize,l_100`"
              />
              <img
                class="user-info-img-sex"
                v-if="+scope.row.sex === 1"
                src="../../../../assets/images/man-icon.png"
              />
              <img
                class="user-info-img-sex"
                v-else-if="+scope.row.sex === 2"
                src="../../../../assets/images/woman-icon.png"
              />
              <span class="user-info-text"
                >{{ scope.row.username || '-' }} -</span
              >
              <span class="user-info-text1">
                {{ scope.row.mobile || '-' }}</span
              >
              <span class="user-info-text2">
                {{ scope.row.birthday || '-' }} ·
              </span>
              <span class="user-info-text2">
                {{ scope.row.base_painting }} ·
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="微信信息"> </el-table-column>
        <el-table-column label="用户行为"> </el-table-column>
        <el-table-column label="是否转化"> </el-table-column>
        <el-table-column label="归属地"> </el-table-column>
        <el-table-column label="班级名称"> </el-table-column>
        <el-table-column label="销售名称"> </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+1"
        :total="+10"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>
  </article>
</template>

<script>
import behaviorSearch from '../behavior/components/behaviorSearch'
import MPagination from '@/components/MPagination/index.vue'
import { GetAgeByBrithday } from '@/utils/index'
export default {
  components: {
    behaviorSearch,
    MPagination
  },
  data() {
    return {
      tableData: [
        {
          name: '1212'
        }
      ]
    }
  },
  mounted() {
    this.getUserBehaviorLogPage()
    this.$root.$on('fourpoint', function(data) {
      console.log(data)
    })
  },
  methods: {
    getUserBehaviorLogPage() {
      this.$http.Statistics.UserBehaviorLogPage().then((res) => {
        const _data = res.data.UserBehaviorLogPage.content
        // 0 默认 1 男 2 女 3 保密
        // 0 默认  1 无基础  2 一年以下 3 一年以上
        _data.forEach((item) => {
          item.birthday = GetAgeByBrithday(item.birthday)
          if (+item.base_painting === 1) {
            item.base_painting = '无基础'
          } else if (+item.base_painting === 2) {
            item.base_painting = '一年以下'
          } else if (+item.base_painting === 3) {
            item.base_painting = '一年以上'
          } else {
            item.base_painting = '-'
          }
        })
        this.tableData = _data
      })
    },
    // 下单时间
    fourpoints(data) {
      console.log(data)
    },
    handleCurrentChange(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom-table {
  .user-info-box {
    position: relative;
    .user-info-img {
      height: 50px;
      width: 50px;
      border: 1px solid #f0f0f0;
      border-radius: 50%;
    }
    .user-info-img-sex {
      position: absolute;
      left: 40px;
      bottom: 0px;
      width: 20px;
      height: 20px;
    }
    .user-info-text {
      position: absolute;
      left: 70px;
      top: 0;
    }
    .user-info-text1 {
      position: absolute;
      left: 120px;
      top: 0;
    }
    .user-info-text2 {
      position: absolute;
      left: 70px;
      top: 30px;
    }
  }
}
</style>
