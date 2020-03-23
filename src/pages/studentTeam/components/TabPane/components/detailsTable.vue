<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-23 21:34:56
 -->
<template>
  <div class="table-box">
    <!-- 加好友进群 -->
    <div class="group-box" v-if="this.tables.tabs == 0">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <!-- 基本信息 -->
        <el-table-column width="280" label="基本信息">
          <template slot-scope="scope">
            <div class="scope-info-box">
              <img
                class="scope-info-img borders"
                :src="scope.row.head"
                alt=""
              />
              <div class="info-telephone">{{ scope.row.mobile }}</div>
              <!-- <span class="info-sex" v-if="scope.row.sex == 0">- ·</span>
              <span class="info-sex" v-else-if="scope.row.sex == 1">男 ·</span>
              <span class="info-sex" v-else>女 ·</span> -->
              <span class="info-sex">{{ scope.row.sex }}</span>
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
                  class="el-icon-caret-bottom el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">
                  <img
                    style="width: 18px;"
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
            <div>{{ scope.row.added_wechat_time }}</div>
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
                  class="el-icon-caret-bottom el-icon--right"
                ></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">
                  <img
                    style="width: 18px;"
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
            <div>{{ scope.row.added_group_time }}</div>
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
            <div>{{ scope.row.follow_time }}</div>
            <span style="display: none;"> {{ scope.row }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
      />
    </div>
    <!-- 物流 -->
    <div class="logistics-box" v-if="this.tables.tabs == 1">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column key="1" width="150" label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.mobile }}</span>
              <br />
              <span>{{ scope.row.ctime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="2" label="用户微信">
          <template slot-scope="scope">
            <div class="logistics-wx-box">
              <img
                class="logistics-wx-img borders"
                :src="scope.row.head"
                alt=""
              />
              <span class="logistics-username">{{ scope.row.username }}</span>
              <span class="logistics-nickname">{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="3" width="280" label="收货人及地址">
          <template slot-scope="scope">
            <div>
              <span class="logistics-address-name"
                >「 {{ scope.row.product_name }}」</span
              >
              <br />
              <span>{{ scope.row.receipt_name }}</span>
              <span>{{ scope.row.receipt_tel }}</span>
              <br />
              <span>{{ scope.row.province }}</span>
              <span>{{ scope.row.city }}</span>
              <span>{{ scope.row.area }}</span>
              <br />
              <span>{{ scope.row.address_detail }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="4" label="发货">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.express_status }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
      />
    </div>
    <!-- 打开APP 原 登陆 -->
    <div class="login-box" v-if="this.tables.tabs == 2">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column width="150" label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.mobile }}</span>
              <br />
              <span>{{ scope.row.express_ctime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户微信">
          <template slot-scope="scope">
            <div class="login-wx-box">
              <img class="login-wx-img borders" :src="scope.row.head" alt="" />
              <span class="login-username">{{ scope.row.username }}</span>
              <span class="login-nickname">{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.status }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最近登录次数">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.login_time }}</span>
              <br />
              <span>{{ scope.row.ctime }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
      />
    </div>
    <!-- 参课和完课 -->
    <div class="participateIn-box" v-if="this.tables.tabs == 3">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column width="150" label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.mobile }}</span>
              <br />
              <span>{{ scope.row.buytime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="200" label="用户微信">
          <template slot-scope="scope">
            <div class="participateIn-wx-box">
              <img
                class="participateIn-wx-img borders"
                :src="scope.row.head"
                alt=""
              />
              <span class="participateIn-username">{{
                scope.row.username
              }}</span>
              <span class="participateIn-nickname">{{
                scope.row.nickname
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.status }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.current_lesson }}</span>
              <br />
              <span>{{ scope.row.classTitle }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参课">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.add_class_status }}</span>
              <br />
              <span>{{ scope.row.add_class_ctime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="完课">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.add_class_status }}</span>
              <br />
              <span>{{ scope.row.add_class_utime }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
      />
    </div>
    <!-- 作品及点评 -->
    <div class="works-box" v-if="this.tables.tabs == 4">
      <el-table
        ref="multipleTable"
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column width="150" label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.mobile }}</span>
              <br />
              <span>{{ scope.row.buytime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="200" label="用户微信">
          <template slot-scope="scope">
            <div class="works-wx-box">
              <img class="works-wx-img borders" :src="scope.row.head" alt="" />
              <span class="works-username">{{ scope.row.username }}</span>
              <span class="works-nickname">{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.current_lesson }}</span>
              <br />
              <span>{{ scope.row.classTitle }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="作品">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="点评">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row }}</span>
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
import MPagination from '@/components/MPagination/index.vue'
export default {
  name: 'detailsTable',
  props: ['tables'],
  components: {
    MPagination
  },
  data() {
    return {
      index: null,
      studentId: null,
      added_group: null,
      added_wechat: null
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
      // console.log(row, column, event)
      this.added_group = row.added_group
      this.added_wechat = row.added_wechat
      this.studentId = row.id
      this.index = row.index
      // console.log(row, column, event, index)
    },
    // 向父组建传值 已加好友
    commandFriend(command) {
      console.log(command, 'command')
      const val = {
        type: 'wechat',
        studentId: this.studentId,
        addedGroup: this.added_group,
        addedWechat: command,
        index: this.index
      }
      this.$emit('commandFriend', val)
    },
    // 向父组建传值 已进群
    onGroup(command) {
      const val = {
        type: 'group',
        studentId: this.studentId,
        addedWechat: this.added_wechat,
        addedGroup: command,
        index: this.index
      }
      this.$emit('onGroup', val)
    },
    // 单元格回调样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'padding-left:15px;padding-top:20px;padding-bottom:15px;'
      }
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'padding-left:15px;font-size:12px;color:#666;font-weight:normal;'
      }
      return 'font-size:12px;color:#666;font-weight:normal;'
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('onCurrentPage', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-box {
  margin-top: 16px;
  .group-box {
    .scope-info-box {
      position: relative;
      .scope-info-img {
        display: inline-block;
        height: 50px;
        width: 50px;
      }
      .info-telephone {
        position: absolute;
        left: 70px;
        top: 0;
      }
      .info-sex {
        margin-left: 20px;
      }
      .info-age {
        margin-left: 5px;
      }
      .info-basics {
        margin-left: 10px;
      }
    }
    .group-img {
      width: 18px;
      margin-left: 10px;
    }
    .icon-warps {
      position: relative;
      top: -3px;
      margin-left: 2px;
      font-size: 12px;
    }
  }
  .logistics-box {
    .logistics-wx-box {
      position: relative;
      .logistics-wx-img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      .logistics-username {
        position: absolute;
        top: 0;
        left: 55px;
      }
      .logistics-nickname {
        position: absolute;
        top: 25px;
        left: 55px;
      }
    }
    .logistics-address-name {
      margin-left: -8px;
    }
  }
  .login-box {
    .login-wx-box {
      position: relative;
      .login-wx-img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      .login-username {
        position: absolute;
        top: 0;
        left: 55px;
      }
      .login-nickname {
        position: absolute;
        top: 25px;
        left: 55px;
      }
    }
  }
  .participateIn-box {
    .participateIn-wx-box {
      position: relative;
      .participateIn-wx-img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      .participateIn-username {
        position: absolute;
        top: 0;
        left: 55px;
      }
      .participateIn-nickname {
        position: absolute;
        top: 25px;
        left: 55px;
      }
    }
  }
  .works-box {
    .works-wx-box {
      position: relative;
      .works-wx-img {
        width: 50px;
      }
      .works-username {
        position: absolute;
        top: 0;
        left: 55px;
      }
      .works-nickname {
        position: absolute;
        top: 25px;
        left: 55px;
      }
    }
  }
  .borders {
    border: 1px solid #f2f2f2;
  }
  .page {
    padding-top: 5px;
    float: right;
    margin-right: 20px;
  }
}
</style>
