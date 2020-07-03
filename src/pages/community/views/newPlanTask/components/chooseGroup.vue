<!--
 * @Descripttion: BOSS小熊
 * @version: 1.0.0
 * @Author: Shasen
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: Shasen
 * @LastEditTime: 2020-06-30 14:54:11
-->
<template>
  <div class="choose-group">
    <el-form ref="sopFrom" size="mini" class="sop-form">
      <el-form-item label="群名称">
        <el-select
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
        </el-select>
      </el-form-item>
    </el-form>
    <div class="tablecon">
      <ele-table
        :tableSize="'small'"
        :dataList="tableData"
        tableHeight="350"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="序号" prop="a" align="center"></el-table-column>
        <el-table-column
          label="计划名称"
          prop="b"
          align="center"
        ></el-table-column>
        <el-table-column
          label="调用模版"
          prop="c"
          align="center"
        ></el-table-column>
        <el-table-column
          label="发送微信号"
          prop="d"
          align="center"
        ></el-table-column>
      </ele-table>
    </div>
    <div class="bottom_choose">
      <el-button>取消</el-button>
      <el-button type="primary">确认</el-button>
    </div>
  </div>
</template>
<script>
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      tableData: [
        {
          a: 1,
          b: '完课提醒全部销售',
          c: '完课提醒',
          d: 'xiaoxong01'
        },
        {
          a: 1,
          b: '完课提醒全部销售',
          c: '完课提醒',
          d: 'xiaoxong01'
        }
      ],
      groupName: '',
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
    EleTable
  },
  mounted() {
    // this.calcTableHeight()
  },
  computed: {},
  methods: {
    // 选择
    handleSelectionChange(val) {
      console.log(val)
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
</style>
