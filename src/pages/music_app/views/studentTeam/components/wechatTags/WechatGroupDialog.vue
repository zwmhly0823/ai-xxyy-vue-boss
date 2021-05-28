<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="60%"
    class="wechat-tag-component"
    @closed="closed"
    v-loading="false"
  >
    <div slot="title">
      <span style="font-size: 18px;color: #303133;line-height: 24px;">
        微信标签管理
      </span>
      <span style="font-size: 12px; font-weight: 500;color: #999;">
        只能使用智群在线的工作微信号打微信标签
      </span>
    </div>
    <div class="container">
      <div class="left-side">
        <h4>
          已选好友{{ leftData.selectNums }}人，绑定微信
          <span class="red-color">{{ leftData.bingWxNums }}</span>
          人
        </h4>
        <el-table
          :data="leftData.leftTableData"
          highlight-current-row
          border
          style="width: 201px"
        >
          <el-table-column prop="wechatNo" label="我的工作微信号" width="120">
          </el-table-column>
          <el-table-column
            prop="friendNum"
            label="匹配好友"
            width="80"
          ></el-table-column>
          <!-- <el-table-column prop="line" label="智群在线">
            <template slot-scope="scope" width="60">
              <span
                :class="[
                  {
                    'green-color': scope.row.line === 0,
                    'blue-color': scope.row.line === 2
                  }
                ]"
              >
                {{ scope.row.lineText }}
              </span>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="right-side">
        <div class="line-status">
          <el-tabs v-model="curWxNumber" @tab-click="changeCurWxNumber">
            <el-tab-pane
              v-for="(item, key) in leftData.leftTableData"
              :key="key"
              :name="item.wechatNo"
              :disabled="item.line !== 1"
            >
              <div slot="label">
                <span :class="[{ 'blue-color': item.line === 1 }]">
                  微信：{{ item.wechatNo }}
                </span>
                <span
                  :class="[
                    {
                      'green-color': item.line === 1,
                      'blue-color': item.line === 2
                    }
                  ]"
                >
                  ({{ item.lineText }})
                </span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-show="onlineItem">
          <el-button
            type="primary"
            class="add-new-button"
            v-show="!addNewStatus"
            size="mini"
            @click="addNewStatus = true"
          >
            新增
          </el-button>
          <div v-show="addNewStatus" class="add-new-box">
            <el-input
              v-model="addNewVal"
              placeholder="请输入内容"
              size="mini"
              maxlength="15"
              show-word-limit
            ></el-input>
            <i class="el-icon-check" @click="createTagConfirm"></i>
            <i class="el-icon-circle-close" @click="addNewStatus = false"></i>
          </div>
          <el-button
            type="primary"
            v-show="!tagEditStatus"
            size="mini"
            @click="tagEditStatus = true"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            v-show="tagEditStatus"
            size="mini"
            @click="tagEditStatus = false"
          >
            编辑结束
          </el-button>
        </div>
        <div class="p-tag-box">
          <div
            class="p-tag-item"
            v-for="(item, index) in rightTagList"
            :key="index"
          >
            <div v-show="item.editing" class="add-new-box">
              <el-input
                v-model="editVal"
                placeholder="请输入内容"
                size="mini"
                maxlength="15"
                show-word-limit
              ></el-input>
              <i class="el-icon-check" @click="editTagConfirm(item)"></i>
              <i class="el-icon-circle-close" @click="editTagCancel(item)"></i>
            </div>
            <span
              v-show="!item.editing"
              class="text"
              :class="[{ 'text-active': item.active }]"
              @click="clickTag(item)"
            >
              {{ item.wxLabelName }}
            </span>
            <i
              v-show="tagEditStatus && !item.editing"
              class="el-icon-edit"
              :class="[{ 'grey-color': hasTagEditStatus }]"
              @click="editTag(item)"
            ></i>
            <i
              v-show="tagEditStatus && !item.editing"
              class="el-icon-delete"
              :class="[{ 'grey-color': hasTagEditStatus }]"
              @click="deleteTag(item, index)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="submit" size="small">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
// import tagsItem from './TagsItem.vue'
export default {
  name: 'tagDetail',
  components: {
    // tagsItem
  },
  data() {
    return {
      dialogVisible: false,
      loading: true,
      userinfo: {},
      selectUsers: [],
      leftData: {
        selectNums: 0,
        bingWxNums: 0,
        leftTableData: []
      },
      addNewStatus: false,
      addNewVal: '',
      tagEditStatus: false,
      rightTagList: [],
      editVal: '',
      hasTagEditStatus: false,
      onlineItem: null,
      // 默认不能有选中项，因为可能没有一个微信在线
      curWxNumber: '1001'
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem('teacher'))
  },
  methods: {
    open(selectUsers) {
      this.selectUsers = selectUsers
      this.dialogVisible = true
      this.initTagLeft()
    },
    closed() {
      // 关闭编辑状态
      this.tagEditStatus = false
      // 关闭新增状态
      this.addNewStatus = false
      this.addNewVal = ''
      // 外面的列表同步数据需要时间
      setTimeout(() => {
        this.$emit('wxLabel')
      }, 1000)
    },
    async initTagLeft() {
      this.leftData.selectNums = this.selectUsers.length
      const data = await this.getTagLeft()
      if (!data) {
        return
      }
      data.list.forEach((item) => {
        switch (item.line) {
          case 0:
            item.lineText = '离线'
            break
          case 1:
            item.lineText = '在线'
            // 默认第一个选中的
            !this.onlineItem && (this.onlineItem = item)
            this.curWxNumber === '1001' && (this.curWxNumber = item.wechatNo)
            break
          case 2:
            item.lineText = '未知'
            break
        }
      })
      this.leftData = {
        bingWxNums: data.friendTotal,
        leftTableData: data.list
      }
      if (!this.onlineItem) {
        this.$message({
          type: 'warning',
          message: '暂无微信在线老师'
        })
        return
      }
      this.initTagRight()
    },
    getTagLeft() {
      const uids = this.selectUsers.map((item) => {
        return item.id
      })
      const params = {
        teacherId: this.userinfo.id,
        userId: uids,
        pageNo: 1,
        pageSize: uids.length
      }
      this.loading = true
      return this.$http.MusicApp.Zhiqun.getStaffFrindList(params)
        .then((res) => {
          if (res.code === 0) {
            return res.payload
          }
          return false
        })
        .catch(() => {
          return false
        })
        .finally(() => {
          this.loading = false
        })
    },
    async initTagRight() {
      const data = await this.getTagRight()
      if (!data) {
        return
      }
      this.rightTagList = data
    },
    getTagRight() {
      const params = {
        staffWxid: this.onlineItem.wechatId
      }
      this.loading = true
      return this.$http.MusicApp.Zhiqun.getWxLabels(params)
        .then((res) => {
          if (res.code === 0) {
            return res.payload
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
        .finally(() => {
          this.loading = false
        })
    },
    async createTagConfirm() {
      if (!this.addNewVal) {
        this.$message({
          message: '标签名不能为空',
          type: 'warning'
        })
        return
      }
      for (let i = 0, len = this.rightTagList.length; i < len; i++) {
        if (this.rightTagList[i].wxLabelName === this.addNewVal) {
          this.$message({
            message: '标签名在该组已存在，请重新编辑',
            type: 'warning'
          })
          return
        }
      }
      this.loading = true
      const res = await this.createTagPost()
      this.loading = false
      if (!res) {
        return
      }
      this.$message({
        type: 'success',
        message: '新增成功'
      })
      this.addNewVal = ''
      this.addNewStatus = false
      this.initTagRight()
    },
    createTagPost() {
      const params = {
        staffWxid: this.onlineItem.wechatId,
        status: 0,
        wxLabelName: this.addNewVal,
        wxLabelType: 0
      }
      return this.$http.MusicApp.Zhiqun.createWxLabel(params)
        .then((res) => {
          if (res.code === 0) {
            return true
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    },
    clickTag(item) {
      this.$set(item, 'active', !item.active)
    },
    editTag(item) {
      this.editVal = item.wxLabelName
      this.$set(item, 'editing', true)
    },
    async editTagConfirm(item) {
      if (!this.editVal) {
        this.$message({
          message: '标签名不能为空',
          type: 'warning'
        })
        return
      }
      for (let i = 0, len = this.rightTagList.length; i < len; i++) {
        if (this.rightTagList[i].wxLabelName === this.editVal) {
          this.$message({
            message: '标签名在该组已存在，请重新编辑',
            type: 'warning'
          })
          return
        }
      }
      this.loading = true
      const uids = this.selectUsers.map((item) => {
        return item.id
      })
      const params = {
        staffWxid: this.onlineItem.wechatId,
        uid: [uids],
        oldWxLabelName: item.wxLabelName,
        newWxLabelName: [this.editVal]
      }
      this.loading = true
      const res = await this.updateLabelPost(params)
      this.loading = false
      if (!res) {
        return
      }
      this.$message({
        type: 'success',
        message: '修改成功'
      })
      this.initTagRight()
    },
    updateLabelPost(params) {
      return this.$http.MusicApp.Zhiqun.updateWxLabel(params)
        .then((res) => {
          if (res.code === 0) {
            return true
          }
        })
        .catch(() => {
          return false
        })
    },
    editTagCancel(item) {
      this.editVal = ''
      this.$set(item, 'editing', false)
    },
    deleteTag(item, index) {
      this.$confirm('确认删除标签？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // console.log(item)
        const uids = this.selectUsers.map((item) => {
          return item.id
        })
        const params = {
          type: 3,
          staffWxid: this.onlineItem.wechatId,
          teacherId: this.userinfo.id,
          uwxid: [item.id],
          uid: uids,
          newWxLabelName: [item.wxLabelName]
        }
        this.loading = true
        const res = await this.setLabelPost(params)
        this.loading = false
        if (!res) {
          return
        }
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.rightTagList.splice(index, 1)
      })
    },
    async submit() {
      if (!this.onlineItem) {
        this.dialogVisible = false
        return
      }
      const uids = this.selectUsers.map((item) => {
        return item.id
      })
      const newWxLabelName1 = this.rightTagList
        .filter((item) => {
          return !item.active && item.status === 1
        })
        .map((item) => {
          return item.wxLabelName
        })
      const uwxidArr1 = this.rightTagList
        .filter((item) => {
          return !item.active && item.status === 1
        })
        .map((item) => {
          return item.id
        })
      const newWxLabelName2 = this.rightTagList
        .filter((item) => {
          return item.active && item.status === 0
        })
        .map((item) => {
          return item.wxLabelName
        })
      const uwxidArr2 = this.rightTagList
        .filter((item) => {
          return item.active && item.status === 0
        })
        .map((item) => {
          return item.id
        })
      // 先走取消选中的接口，再走保存的
      const params1 = {
        type: 2,
        staffWxid: this.onlineItem.wechatId,
        teacherId: this.userinfo.id,
        uid: uids,
        uwxid: uwxidArr1,
        newWxLabelName: newWxLabelName1
      }
      const params2 = {
        // 1是新增 2是取消选中 3是删除
        type: 1,
        staffWxid: this.onlineItem.wechatId,
        teacherId: this.userinfo.id,
        uid: uids,
        uwxid: uwxidArr2,
        newWxLabelName: newWxLabelName2
      }
      this.loading = true
      let res1 = null
      if (!newWxLabelName1.length) {
        res1 = true
      } else {
        res1 = await this.setLabelPost(params1)
      }
      let res2 = null
      if (!newWxLabelName2.length) {
        res2 = true
      } else {
        res2 = await this.setLabelPost(params2)
      }
      this.loading = false
      if (!res1 || !res2) {
        return
      }
      this.dialogVisible = false
    },
    setLabelPost(params) {
      return this.$http.MusicApp.Zhiqun.setWxLabel(params)
        .then((res) => {
          if (res.code === 0) {
            return true
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    },
    changeCurWxNumber() {
      if (this.onlineItem.wechatNo === this.curWxNumber) {
        return
      }
      const len = this.leftData.leftTableData.length
      for (let i = 0; i < len; i++) {
        if (this.leftData.leftTableData[i].wechatNo === this.curWxNumber) {
          this.onlineItem = this.leftData.leftTableData[i]
          break
        }
      }
      this.initTagRight()
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat-tag-component {
  .red-color {
    color: #f56c6c;
  }
  .green-color {
    color: #7dc74d;
  }
  .blue-color {
    color: #799eeb;
  }
  .grey-color {
    color: #ccc;
    cursor: default !important;
  }
  /deep/ {
    .el-dialog__header {
      border-bottom: 1px solid #e4e7ed;
    }
    .el-dialog__body {
      padding: 0 20px;
    }
    .el-divider--horizontal {
      margin: 0;
    }
  }
  .container {
    display: flex;
    .left-side {
      width: 225px;
      border-right: 1px solid #e4e7ed;
      font-size: 12px;
      height: 450px;
      overflow: auto;
      h4 {
        font-size: 13px;
      }
      .title {
        color: #969495;
        margin: 10px 0;
      }
      .v-line {
        display: inline-block;
        width: 3px;
        height: 12px;
        background-color: #606266;
        vertical-align: top;
        margin-right: 3px;
      }
      .name {
        color: #606266;
        margin: 10px 0 5px;
      }
    }
    .right-side {
      position: relative;
      flex: 1;
      padding: 0 10px;
      .go-edit-class {
        position: absolute;
        right: 14px;
        top: 12px;
        font-size: 13px;
        color: #2a75ed;
        cursor: pointer;
        z-index: 1;
      }
      .tag-group {
        font-size: 12px;
        margin: 0px 10px 0px;
        .title {
          margin-bottom: 10px;
          .v-line {
            display: inline-block;
            width: 3px;
            height: 12px;
            background-color: #606266;
            vertical-align: top;
            margin-right: 3px;
          }
        }
      }
      .add-new-button {
        margin: 0 10px 9px 0;
      }
      .add-new-box {
        display: inline-block;
        margin-bottom: 10px;
        /deep/ .el-input {
          width: 150px;
          margin-right: 10px;
          .el-input__suffix {
            top: 10px;
          }
        }
        i {
          margin-right: 10px;
          font-size: 15px;
          cursor: pointer;
          color: #2a75ed;
        }
      }
      .p-tag-box {
        max-height: 350px;
        margin-top: 15px;
        overflow: auto;
        .p-tag-item {
          display: inline-block;
          font-size: 12px;
          margin-right: 20px;
          margin-bottom: 10px;
          .text {
            display: inline-block;
            padding: 3px 3px;
            border: 1px solid transparent;
            border-color: #e0e4ec;
            border-radius: 3px;
            background-color: #f9fafd;
            color: #8c8c8c;
            cursor: pointer;
          }
          .text-active {
            border: 1px solid #f9d7d7;
            color: #f56c6c;
            background-color: #fdfbfb;
          }
          i {
            font-size: 14px;
            margin: 0 5px;
            cursor: pointer;
          }
        }
      }
      .line-status {
        .status-item {
          display: inline-block;
          margin: 10px 0;
          font-weight: 500;
        }
      }
      /deep/ {
        .el-tabs__item {
          font-size: 13px;
        }
        .el-tabs__content {
          max-height: 400px;
          overflow-y: auto;
        }
      }
    }
  }
}
</style>
