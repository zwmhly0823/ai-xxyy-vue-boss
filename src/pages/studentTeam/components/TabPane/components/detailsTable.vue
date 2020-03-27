<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-27 19:47:45
 -->
<template>
  <div class="table-box">
    <!-- 加好友进群 -->
    <div class="group-box" v-if="this.tables.tabs == 0">
      <el-table
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
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
      />
    </div>
    <!-- 物流 -->
    <div class="logistics-box" v-if="this.tables.tabs == 1">
      <el-table
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column key="1" label="用户和购买时间">
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
                v-if="scope.row.head != ''"
                class="logistics-wx-img borders"
                :src="scope.row.head"
                alt=""
              />
              <span v-else class="logistics-wx-imgs borders"> - </span>
              <span class="logistics-nickname">{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="3" width="280" label="收货人及地址">
          <template slot-scope="scope">
            <div>
              <span class="logistics-address-name">{{
                scope.row.product_name
              }}</span>
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
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
      />
    </div>
    <!-- 打开APP 原 登陆 -->
    <div class="login-box" v-if="this.tables.tabs == 2">
      <el-table
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column label="用户和购买时间">
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
              <img
                v-if="scope.row.head != ''"
                class="login-wx-img borders"
                :src="scope.row.head"
                alt=""
              />
              <span v-else class="login-wx-imgs borders"> - </span>
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
        <el-table-column label="打开次数">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.login_time }}</span>
              <br />
              <span>{{ scope.row.first_login_time }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
      />
    </div>
    <!-- 参课和完课 -->
    <div class="participateIn-box" v-if="this.tables.tabs == 3">
      <el-table
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.mobile }}</span>
              <br />
              <span>{{ scope.row.buy_time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户微信">
          <template slot-scope="scope">
            <div class="participateIn-wx-box">
              <img
                v-if="scope.row.head != ''"
                class="participateIn-wx-img borders"
                :src="scope.row.head"
                alt=""
              />
              <span v-else class="participateIn-wx-imgs borders"> - </span>
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
              <span>{{ scope.row.course_current_num }}</span>
              <br />
              <span>{{ scope.row.course_title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="参课">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.join_course_state }}</span>
              <br />
              <span>{{ scope.row.join_course_time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="完课">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.complete_course_state }}</span>
              <br />
              <span>{{ scope.row.complete_course_time }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
      />
    </div>
    <!-- 作品及点评 -->
    <div class="works-box" v-if="this.tables.tabs == 4">
      <el-table
        :data="tables.tableData"
        tooltip-effect="dark"
        :header-cell-style="headerCss"
        :row-class-name="tableRowClassName"
        :cell-style="cellStyle"
        @row-click="onClick"
      >
        <el-table-column label="用户和购买时间">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.mobile }}</span>
              <br />
              <span>{{ scope.row.buytime }}</span>
              <br />
              <span>{{ scope.row.status }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户微信">
          <template slot-scope="scope">
            <div class="works-wx-box">
              <img
                v-if="scope.row.head != ''"
                class="works-wx-img borders"
                :src="scope.row.head"
                alt=""
              />
              <span v-else class="works-wx-imgs borders"> - </span>
              <span class="works-nickname">{{ scope.row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.course_current_num }}</span>
              <br />
              <span>{{ scope.row.classTitle }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="作品">
          <template slot-scope="scope">
            <div class="works-task-box">
              <img
                v-if="scope.row.task_image"
                class="works-task-img borders"
                :src="scope.row.task_image"
                alt=""
              />
              <span v-else>-</span>
              <span class="works-ctime">{{ scope.row.works_ctime }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="点评">
          <template slot-scope="scope">
            <div>
              <div
                v-for="(item, index) in scope.row.listenInfoArr"
                :key="index"
                @click="aplayAudio(item, index, 'audioRef' + index)"
                class="audio-box"
              >
                <span class="audio-triangle"></span>
                <img
                  v-if="audioIndex === index && studentId == scope.row.id"
                  class="audio-imgs"
                  src="@/assets/images/sound-active.gif"
                  alt=""
                />
                <img
                  v-else
                  class="audio-img"
                  src="@/assets/images/playing-icon.png"
                  alt=""
                />
                <audio :ref="'audioRef' + index" :src="item.task_sound"></audio>
              </div>
              <!-- <span>{{ scope.row }}</span> -->
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
      <!-- 分页 -->
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+tables.currentPage"
        :total="+tables.totalElements"
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
      />
    </div>
  </div>
</template>
<script>
import MPagination from '@/components/MPagination/index.vue'
export default {
  name: 'detailsTable',
  // props: ['tables', 'classId'],
  props: {
    classId: {
      type: Object,
      default: null
    },
    tables: {
      type: Object,
      default: null
    },
    audioTabs: {
      type: String,
      default: ''
    }
  },
  components: {
    MPagination
  },
  data() {
    return {
      audioIndex: null,
      tableindex: null,
      studentId: null,
      added_group: null,
      added_wechat: null
    }
  },
  mounted() {
    // console.log(this.audioTabs, ' audioTabs ')
  },
  watch: {
    classId(value) {
      this.audioIndex = null
    },
    audioTabs(value) {
      this.audioIndex = null
    }
  },
  created() {},
  methods: {
    // 语音播放
    aplayAudio(item, index, itemss) {
      if (this.audioIndex !== index) {
        const audios = this.$refs
        const audiosList = Object.values(audios)
        audiosList.forEach((item, index) => {
          item[0].load()
        })
      }
      const audio = this.$refs[itemss][0]
      if (audio.paused) {
        this.audioIndex = index
        audio.play() // audio.play();// 播放
      } else {
        // audio.pause() // 暂停
        audio.load() // 取消播放并回到0秒
        this.audioIndex = null
      }
    },
    // 获取表格 下标
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 获取表格 下标
    onClick(row, column, event) {
      this.added_group = row.added_group
      this.added_wechat = row.added_wechat
      this.studentId = row.id
      this.tableindex = row.index
      // console.log(row, column, event, index)
    },
    // 向父组建传值 已加好友
    commandFriend(command) {
      const val = {
        type: 'wechat',
        studentId: this.studentId,
        addedGroup: this.added_group,
        addedWechat: command,
        index: this.tableindex
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
        index: this.tableindex
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
      .logistics-wx-imgs {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: none;
      }
      .logistics-username {
        position: absolute;
        top: 0;
        left: 55px;
      }
      .logistics-nickname {
        position: absolute;
        top: 0px;
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
      .login-wx-imgs {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: none;
      }
      .login-nickname {
        position: absolute;
        top: 0px;
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
      .participateIn-wx-imgs {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: none;
      }
      .participateIn-nickname {
        position: absolute;
        top: 0px;
        left: 55px;
      }
    }
  }
  .works-box {
    .works-wx-box {
      position: relative;
      .works-wx-img {
        display: inline-block;
        width: 50px;
        height: 50px;
      }
      .works-wx-imgs {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: none;
      }
      .works-nickname {
        position: absolute;
        top: 0px;
        left: 55px;
      }
    }
    .works-task-box {
      position: relative;
      .works-task-img {
        display: inline-block;
        width: 80px;
        height: 80px;
      }
      .works-ctime {
        position: absolute;
        left: 3px;
        bottom: 0;
      }
    }
    .audio-box {
      position: relative;
      left: 20px;
      width: 100px;
      height: 30px;
      border-radius: 5px;
      border: #ccc 1px solid;
      margin-top: 10px;
      background: #bbe166;
      .audio-triangle {
        position: absolute;
        top: 10px;
        left: -6px;
        width: 10px;
        height: 10px;
        background: #bbe166;
        transform: rotate(45deg);
        border-left: #ccc 1px solid;
        border-bottom: #ccc 1px solid;
      }
      .audio-img {
        display: inline-block;
        position: absolute;
        top: 6px;
        left: 5px;
        width: 13px;
        height: 18px;
      }
      .audio-imgs {
        display: inline-block;
        position: absolute;
        top: 6px;
        left: 5px;
        width: 13px;
        height: 18px;
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
