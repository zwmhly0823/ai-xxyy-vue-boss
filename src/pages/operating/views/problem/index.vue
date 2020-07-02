<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-24 17:01:54
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-02 17:05:31
-->
<template>
  <div class="problem-box">
    <div class="wenjuan-css">
      <el-button @click="onNewWenjuan" size="mini" type="primary"
        ><i class="el-icon-plus"></i>创建问卷</el-button
      >
    </div>
    <div class="table-box">
      <el-table
        :data="tableData"
        style="width: 100%"
        @cell-mouse-enter="onHoverRow"
      >
        <el-table-column
          prop="title"
          label="问卷名称"
          align="center"
          min-width="200"
        >
        </el-table-column>
        <el-table-column
          prop="desc"
          label="问卷说明"
          align="center"
          min-width="200"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.desc || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="封面图" align="center" min-width="300">
          <template slot-scope="scope">
            <img style="width:250px;" :src="scope.row.image" alt="" />
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          align="center"
          min-width="200"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="200">
          <template slot-scope="scope">
            <div style="display:none;">{{ scope.row }}</div>
            <div v-if="scope.row.questionState == 'DEFAULT'">
              <el-button @click="onUpdate" type="text">修改</el-button
              ><el-button type="text">发布</el-button
              ><el-button type="text" disabled>复制地址</el-button>
            </div>
            <div v-else-if="scope.row.questionState == 'PUBLISH'">
              <el-button type="text" disabled>修改</el-button
              ><el-button type="text" disabled>发布</el-button
              ><el-button type="text">复制地址</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        style="height:50px;bottom:0;"
        @current-change="handleCurrentChange"
        :current-page="+pageNum"
        :total="+totalElements"
        open="calc(100vw - 147px - 50px)"
        close="calc(100vw - 26px - 50px)"
      />
    </div>
    <el-dialog
      title="创建调查问卷"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      center
    >
      <newForm ref="newForm" @closeDialogVisible="closeDialogVisible" />
    </el-dialog>
    <div>
      <el-dialog
        :visible.sync="updateDialogFormVisibles"
        width="750px"
        append-to-body
      >
        <updateExperienceProblem
          v-if="updateDialogFormVisibles"
          :questionnaireId="questionnaireId"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import newForm from './components/newForm'
import MPagination from '@/components/MPagination/index.vue'
import updateExperienceProblem from './components/updateExperienceProblem'
export default {
  components: {
    newForm,
    MPagination,
    updateExperienceProblem
  },
  data() {
    return {
      updateDialogFormVisibles: false,
      dialogVisible: false,
      pageNum: '1',
      totalElements: '',
      tableData: [],
      questionnaireId: ''
    }
  },
  created() {
    this.onQueryQuestionnairePage()
  },
  methods: {
    onUpdate() {
      this.updateDialogFormVisibles = true
    },
    onHoverRow(row) {
      this.questionnaireId = row.id
    },
    onQueryQuestionnairePage() {
      this.$http.Operating.queryQuestionnairePage(this.pageNum).then((res) => {
        // this.pageNum = res.payload.number
        this.totalElements = res.payload.totalElements
        const _data = res.payload.content
        _data.forEach((res) => {
          res.address = `https://test.meixiu.mobi/ai-app-h5-test/question?id=${res.id}`
        })
        this.tableData = _data
        console.log(_data)
      })
    },
    onNewWenjuan() {
      this.dialogVisible = true
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.onQueryQuestionnairePage()
    },
    closeDialogVisible() {
      this.$refs.newForm.ruleForm.title = ''
      this.$refs.newForm.ruleForm.desc = ''
      this.$refs.newForm.ruleForm.imageUrl = ''
      this.dialogVisible = false
      setTimeout(() => {
        this.onQueryQuestionnairePage()
      }, 500)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.$refs.newForm.ruleForm.title = ''
          this.$refs.newForm.ruleForm.desc = ''
          this.$refs.newForm.ruleForm.imageUrl = ''
          done()
        })
        .catch((_) => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.problem-box {
  margin: 10px;
  .wenjuan-css {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding-right: 20px;
    height: 50px;
    background: #fff;
  }
  .table-box {
    margin-top: 10px;
    margin-bottom: 60px;
  }
}
</style>
