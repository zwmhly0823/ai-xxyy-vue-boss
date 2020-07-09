<!--
 * @Descripttion: BOSS小熊
 * @version: 1.0.0
 * @Author: Shasen
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: shasen
 * @LastEditTime: 2020-07-06 10:58:08
-->
<template>
  <div class="choose-group">
    <el-form ref="sopFrom" size="mini" class="sop-form">
      <el-form-item label="群名称">
        <el-input
          placeholder="请输入内容"
          v-model="name"
          clearable
          :width="150"
          @input="handleDebounce"
          @change="changeGroup()"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div class="tablecon">
      <el-table
        :tableSize="'small'"
        :data="tableData"
        ref="myseleTable"
        tableHeight="350"
        fit
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          label="群名称"
          prop="cluster_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="群人数"
          prop="membersNum"
          align="center"
        ></el-table-column>
        <el-table-column
          label="带班销售"
          prop="owner_nick_name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="微信群工作微信号"
          prop="owner_wechat_id"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
    <div class="bottom_choose" v-show="tableData.length > 0">
      <el-button size="mini" @click="closeChooseGroup">取消</el-button>
      <el-button size="mini" type="primary" @click="chooseGroup"
        >确认</el-button
      >
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'
export default {
  props: {
    taskstatus: {
      type: String,
      default: ''
    },
    wechatNo: {
      type: String,
      default: ''
    },
    parent_tableData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      name: '',
      tableData: [],
      chooseGroupList: []
    }
  },
  components: {
    // EleTable
  },
  async created() {
    const tabs = await this.getWeChatCluster(this.name).catch()
    const { code, payload = [] } = tabs
    if (tabs && code === 0) {
      this.tableData = payload
      this.$nextTick(() => {
        this.tableData.forEach((v, i) => {
          this.parent_tableData.forEach((_v, _i) => {
            if (v.cluster_id === _v.cluster_id) {
              this.$refs.myseleTable.toggleRowSelection(v)
            }
          })
        })
      })
    }
  },
  mounted() {},
  computed: {},
  methods: {
    handleDebounce: debounce(function(event) {
      this.getWeChatCluster(this.name).then((res) => {
        if (res.code === 0) {
          this.tableData = res.payload
        }
      })
    }, 500),
    // 获取群信息
    async getWeChatCluster(name = '') {
      try {
        const Info = await this.$http.Community.getWeChatCluster({
          wechatNo: this.wechatNo,
          taskstatus: this.taskstatus,
          name
        })
        return Info
      } catch (err) {
        console.log(err)
      }
    },
    // 搜索群名称
    changeGroup() {
      this.handleDebounce()
    },
    // 选择
    handleSelectionChange(val) {
      this.chooseGroupList = val
    },
    chooseGroup() {
      this.$emit('choose-group', this.chooseGroupList)
    },
    // 关闭
    closeChooseGroup() {
      this.name = ''
      this.$emit('close-choosegroup')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.choose-group {
  background: #ffffff;
}
.tablecon {
  width: 100%;
  overflow: auto;
  max-height: 400px;
}
.header {
  .sop-form {
    font-size: 12px;
  }
}
.bottom_choose {
  display: flex;
  padding-top: 10px;
  justify-content: center;
}
.el-input {
  width: 150px;
}
</style>
