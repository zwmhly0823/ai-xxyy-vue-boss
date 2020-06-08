<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-06 14:18:35
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-08 16:32:57
-->
<template>
  <article>
    <div><behaviorSearch @fourpoints="fourpoints" /></div>
    <div class="bottom-table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="用户信息" width="280">
          <template slot-scope="scope">
            <div class="info-box">
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
              </div>
              <div class="user-info-text-box">
                <span>{{ scope.row.username || '-' }} -</span>
                <span> {{ scope.row.mobile || '-' }}</span>
                <br />
                <span> {{ scope.row.birthday || '-' }} · </span>
                <span>
                  {{ scope.row.base_painting_text || '-' }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="微信信息">
          <template slot-scope="scope">
            <div class="weixin-box">
              <img class="weixin-img" :src="scope.row.head" alt="" />
              <span class="weixin-text">{{ scope.row.weixin_nick_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户行为" width="200">
          <template slot-scope="scope">
            <div class="behavior-box" v-if="+scope.row.action_type === 1">
              <span>{{ scope.row.action_type_text }}</span>
              <span class="behavior-text">{{ scope.row.device_model }}</span>
              <br />
              <span>{{ scope.row.action_time }}</span>
            </div>
            <div class="behavior-box" v-if="+scope.row.action_type === 2">
              <span>{{ scope.row.action_type_text }}</span>
              <br />
              <span>{{ scope.row.action_time }}</span>
            </div>
            <div
              class="behavior-box"
              v-if="
                +scope.row.action_type === 3 ||
                  +scope.row.action_type === 4 ||
                  +scope.row.action_type === 5 ||
                  +scope.row.action_type === 6
              "
            >
              <span>{{ scope.row.action_type_text }}</span>
              <span>《{{ scope.row.course_title }}》</span>
              <br />
              <span>{{ scope.row.action_time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否转化">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.user.status }}</span>
              <br />
              <span v-if="scope.row.user.status == '已转化'">{{
                scope.row.order.buytime
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="归属地">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.mobile_province || '-' }} · </span>
              <span>{{ scope.row.mobile_city || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="班级名称">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.team_name || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="销售名称">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.teacher_name || '-' }}</span>
              <br />
              <span>{{ scope.row.teacher_department_name }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+currentPage"
        :total="+totalElements"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>
  </article>
</template>

<script>
import behaviorSearch from '../behavior/components/behaviorSearch'
import MPagination from '@/components/MPagination/index.vue'
import { GetAgeByBrithday, timestamp } from '@/utils/index'
export default {
  components: {
    behaviorSearch,
    MPagination
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      totalElements: ''
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
      const params = {
        currentPage: this.currentPage
      }
      this.$http.Statistics.UserBehaviorLogPage(params).then((res) => {
        this.currentPage = res.data.UserBehaviorLogPage.number
        this.totalElements = res.data.UserBehaviorLogPage.totalElements
        const _data = res.data.UserBehaviorLogPage.content
        _data.forEach((item) => {
          item.birthday = GetAgeByBrithday(item.birthday)

          item.order.buytime = item.order.buytime
            ? timestamp(item.order.buytime, 2)
            : '-'

          item.action_time = item.action_time
            ? timestamp(item.action_time, 2)
            : '-'
          if (+item.user.status > 2) {
            item.user.status = '已转化'
          } else {
            item.user.status = '未转化'
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
  margin-bottom: 65px;
  .info-box {
    display: flex;
    flex-wrap: nowrap;
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
    }
    .user-info-text-box {
      margin-left: 20px;
    }
  }
  .weixin-box {
    position: relative;
    .weixin-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .weixin-text {
      position: absolute;
      top: 15px;
      left: 70px;
    }
  }
  .behavior-box {
    .behavior-text {
      margin-left: 10px;
    }
  }
}
</style>
