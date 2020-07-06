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
          v-model="groupName"
          clearable
          :width="150"
          @change="changeGroup()"
        >
        </el-input>
        <!-- <el-select
          class="item-style"
          remote
          :reserve-keyword="true"
          size="mini"
          clearable
          placeholder="群名称"
          v-model="groupName"
        >
          <el-option
            v-for="item in groupList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select> -->
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
      <el-button>取消</el-button>
      <el-button type="primary" @click="chooseGroup">确认</el-button>
    </div>
  </div>
</template>
<script>
// import EleTable from '@/components/Table/EleTable'
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
      tableData: [],
      groupName: '',
      chooseGroupList: [],
      groupList: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ]
    }
  },
  components: {
    // EleTable
  },
  created() {
    let res = this.getWeChatCluster(this.wechatNo, this.taskstatus, name)
    res = {
      status: 'OK',
      code: 0,
      payload: [
        {
          cluster_id: 24593,
          cluster_name: '标签建群',
          wechat_record_id: 219,
          wx_cluster_id: '22047492070@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 5
        },
        {
          cluster_id: 24592,
          cluster_name: '班级建群',
          wechat_record_id: 219,
          wx_cluster_id: '23222382564@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 4
        },
        {
          cluster_id: 24591,
          cluster_name: '自动班级拉群',
          wechat_record_id: 219,
          wx_cluster_id: '22341691994@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 4
        },
        {
          cluster_id: 24589,
          cluster_name: '自动标签群1',
          wechat_record_id: 219,
          wx_cluster_id: '24735345931@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 6
        },
        {
          cluster_id: 24577,
          cluster_name: '自动加群',
          wechat_record_id: 219,
          wx_cluster_id: '24667948477@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 1
        },
        {
          cluster_id: 24574,
          cluster_name: '自动标签群1',
          wechat_record_id: 219,
          wx_cluster_id: '22107982163@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 6
        },
        {
          cluster_id: 24565,
          cluster_name: '自动标签群1',
          wechat_record_id: 219,
          wx_cluster_id: '23954373388@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 1
        },
        {
          cluster_id: 24544,
          cluster_name: '自动班级1',
          wechat_record_id: 219,
          wx_cluster_id: '22074092203@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 1
        },
        {
          cluster_id: 24050,
          cluster_name: '测试',
          wechat_record_id: 219,
          wx_cluster_id: '22327581909@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 4
        },
        {
          cluster_id: 24048,
          cluster_name: '测试',
          wechat_record_id: 219,
          wx_cluster_id: '23610891845@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 5
        },
        {
          cluster_id: 24047,
          cluster_name: '测试',
          wechat_record_id: 219,
          wx_cluster_id: '22401781852@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 5
        },
        {
          cluster_id: 24046,
          cluster_name: '测试',
          wechat_record_id: 219,
          wx_cluster_id: '24656548793@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 5
        },
        {
          cluster_id: 24045,
          cluster_name: '测试',
          wechat_record_id: 219,
          wx_cluster_id: '24265963281@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 5
        },
        {
          cluster_id: 23995,
          cluster_name: '测试群12324',
          wechat_record_id: 219,
          wx_cluster_id: '24621950164@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 4
        },
        {
          cluster_id: 22518,
          cluster_name: '爱蒙 逼',
          wechat_record_id: 219,
          wx_cluster_id: '23339577440@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 3
        },
        {
          cluster_id: 22517,
          cluster_name: '小熊美术xx期-S1/2/3-x班',
          wechat_record_id: 219,
          wx_cluster_id: '19367515048@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 3
        },
        {
          cluster_id: 22516,
          cluster_name: '测试',
          wechat_record_id: 219,
          wx_cluster_id: '22385886119@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 3
        },
        {
          cluster_id: 22515,
          cluster_name: '爱懵圈🙈、承让、于泽昌',
          wechat_record_id: 219,
          wx_cluster_id: '23442177362@chatroom',
          owner_wechat_id: 'wxid_m0y7hvhqsz7822',
          remark: '',
          owner_nick_name: '美术宝_测试',
          account_id: 1,
          membersNum: 3
        }
      ]
    }
    this.tableData = res.payload
    console.log(res)
  },
  mounted() {
    this.tableData.forEach((v, i) => {
      this.parent_tableData.forEach((_v, _i) => {
        if (v.cluster_id === _v.cluster_id) {
          this.$refs.myseleTable.toggleRowSelection(v)
        }
      })
    })
  },
  computed: {},
  methods: {
    // 获取群信息
    async getWeChatCluster(wechatNo, taskstatus, name = '') {
      try {
        const Info = await this.$http.Community.getWeChatCluster({
          wechatNo,
          taskstatus,
          name
        })
        return Info
      } catch (err) {
        console.log(err)
      }
    },
    // 搜索群名称
    changeGroup() {
      console.log(this.groupName)
    },
    // 选择
    handleSelectionChange(val) {
      this.chooseGroupList = val
      console.log(val)
    },
    chooseGroup() {
      this.$emit('choose-group', this.chooseGroupList)
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
  justify-content: center;
}
.el-input {
  width: 150px;
}
</style>
