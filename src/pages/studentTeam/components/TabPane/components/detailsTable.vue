<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-20 21:59:08
 -->
<template>
  <div>
    <!-- 加好友进群 -->
    <div v-if="this.tables.tabs == 0">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        @row-click="onClick"
      >
        <!-- 基本信息 -->
        <el-table-column width="260" label="基本信息">
          <template slot-scope="scope">
            <div class="scope-info-box">
              <img class="scope-info-img" :src="scope.row.head" alt="" />
              <!-- <img
                v-if="scope.row.sex == 1"
                class="scope-info-sex"
                src="@/assets/images/man-icon.png"
                alt=""
              /><img
                v-else
                class="scope-info-sex"
                src="@/assets/images/woman-icon.png"
                alt=""
              /> -->
              <div class="info-telephone">{{ scope.row.mobile }}</div>
              <span class="info-sex" v-if="scope.row.sex == 1">男 ·</span>
              <span class="info-sex" v-else>女 ·</span>
              <span class="info-age">{{ scope.row.birthday }}</span>
              <span class="info-basics">{{ scope.row.base_painting }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 组建遍历表头 -->
        <el-table-column
          v-for="(item, index) in tables.tableLabel"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        >
        </el-table-column>
        <!-- 已加好友 -->
        <el-table-column label="已加好友">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.friend }}</span> -->
            <img
              class="group-img"
              v-if="scope.row.added_wechat == 0"
              src="@/assets/images/error.png"
              alt=""
            />
            <img
              class="group-img"
              v-else
              src="@/assets/images/success.png"
              alt=""
            />
            <el-dropdown @command="commandFriend" trigger="click">
              <span class="el-dropdown-link icon-warps">
                <i
                  v-show="scope.row.added_wechat == 0 ? true : false"
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">
                  <img
                    class="group-imgs"
                    src="@/assets/images/success.png"
                    alt=""
                  />
                </el-dropdown-item>
                <!-- <el-dropdown-item
                style="font-size:20px"
                command="0"
                icon="el-icon-error"
              ></el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <div>{{ scope.row.date }}</div>
            <span style="display: none;"> {{ scope.row.group }}</span>
          </template>
        </el-table-column>
        <!-- 已进群 -->
        <el-table-column label="已进群">
          <template slot-scope="scope">
            <img
              class="group-img"
              v-if="scope.row.added_group == 0"
              src="@/assets/images/error.png"
              alt=""
            />
            <img
              class="group-img"
              v-else
              src="@/assets/images/success.png"
              alt=""
            />
            <el-dropdown @command="onGroup" trigger="click">
              <span class="el-dropdown-link icon-warps">
                <i
                  v-show="scope.row.added_group == 0 ? true : false"
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">
                  <img
                    class="group-imgs"
                    src="@/assets/images/success.png"
                    alt=""
                  />
                </el-dropdown-item>
                <!-- <el-dropdown-item
                style="font-size:20px"
                command="0"
                icon="el-icon-error"
              ></el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <div>{{ scope.row.date }}</div>
            <span style="display: none;"> {{ scope.row.group }}</span>
          </template>
        </el-table-column>
        <!-- 关注公众号 -->
        <el-table-column label="关注公众号">
          <template slot-scope="scope">
            <img
              class="group-img"
              v-if="scope.row.follow == 0"
              src="@/assets/images/error.png"
              alt=""
            />
            <img
              class="group-img"
              v-else
              src="@/assets/images/success.png"
              alt=""
            />
            <div>{{ scope.row.date }}</div>
            <span style="display: none;"> {{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="table-flex">
        <!-- <span class="table-text"
          >当前结果：共计<span class="table-flex-text">{{
            tables.student
          }}</span
          >个学员，<span class="table-flex-text">{{ tables.friend }}</span
          >已加好友，<span class="table-flex-text">{{ tables.group }}</span>
          已进微信群</span
        > -->
        <!-- <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          :total="tables.tableData.length"
        >
        </el-pagination> -->
      </div>
    </div>
    <!-- 物流 -->
    <div v-if="this.tables.tabs == 1">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        @row-click="onClick"
      >
        <el-table-column width="150" label="用户和购买时间">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <span class="logistics-age">{{ scope.row.mobile }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户微信">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <div class="logistics-telephone">{{ scope.row.mobile }}</div>
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货人及地址">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发货">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 组建遍历表头 -->
        <!-- <el-table-column
          v-for="(item, index) in tables.tableLabel"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        ></el-table-column> -->
      </el-table>
    </div>
    <!-- 登录 -->
    <div v-if="this.tables.tabs == 2">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        @row-click="onClick"
      >
        <el-table-column width="150" label="用户和购买时间">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户微信">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <div class="logistics-telephone">{{ scope.row.mobile }}</div>
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最近登录次数">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 组建遍历表头 -->
        <!-- <el-table-column
          v-for="(item, index) in tables.tableLabel"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        ></el-table-column> -->
      </el-table>
    </div>
    <!-- 参课和完课 -->
    <div v-if="this.tables.tabs == 3">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        @row-click="onClick"
      >
        <el-table-column width="150" label="用户和购买时间">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户微信">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <div class="logistics-telephone">{{ scope.row.mobile }}</div>
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参课">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="完课">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 组建遍历表头 -->
        <!-- <el-table-column
          v-for="(item, index) in tables.tableLabel"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        ></el-table-column> -->
      </el-table>
    </div>
    <!-- 作品及点评 -->
    <div v-if="this.tables.tabs == 4">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        @row-click="onClick"
      >
        <el-table-column width="150" label="用户和购买时间">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="180" label="用户微信">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <div class="logistics-telephone">{{ scope.row.mobile }}</div>
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="作品">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="点评">
          <template slot-scope="scope">
            <div class="scope-logistics-box">
              <img class="scope-logistics-img" :src="scope.row.head" alt="" />
              <span class="logistics-age">{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 组建遍历表头 -->
        <!-- <el-table-column
          v-for="(item, index) in tables.tableLabel"
          :key="index"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        ></el-table-column> -->
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'detailsTable',
  props: ['tables'],
  data() {
    return {
      index: null,
      currentPage: 1
    }
  },
  mounted() {
    // console.log(this.tables)
  },
  created() {},
  methods: {
    // 获取表格 下标
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 获取表格 下标
    onClick(row, column, event) {
      this.index = row.index
      // console.log(row, column, event, index)
    },
    // 向父组建传值 已加好友
    commandFriend(command) {
      const val = {
        command: command,
        index: this.index
      }
      this.$emit('commandFriend', val)
    },
    // 向父组建传值 已进群
    onGroup(command) {
      const val = {
        command: command,
        index: this.index
      }
      this.$emit('onGroup', val)
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex, 'headerCss')
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.scope-info-box {
  position: relative;
  .scope-info-img {
    display: inline-block;
    height: 50px;
    width: 50px;
  }
  // .scope-info-sex {
  //   position: absolute;
  //   left: 40px;
  //   top: 40px;
  //   display: inline-block;
  //   height: 20px;
  //   width: 20px;
  // }
  .info-telephone {
    position: absolute;
    left: 70px;
    top: 0;
  }
  .info-sex {
    margin-left: 20px;
  }
  .info-age {
    margin-left: 10px;
  }
  .info-basics {
    margin-left: 10px;
  }
}
.group-img {
  width: 18px;
  margin-left: 10px;
}
.group-imgs {
  width: 18px;
}
.icon-warps {
  position: relative;
  top: -3px;
  margin-left: 2px;
  font-size: 12px;
}
.table-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  .table-text {
    padding-top: 5px;
    .table-flex-text {
      color: #1e90ff;
    }
  }
  .page {
    padding-top: 5px;
  }
}
</style>
