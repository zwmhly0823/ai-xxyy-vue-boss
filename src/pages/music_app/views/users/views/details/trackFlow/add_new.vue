<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-20 16:37:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-20 19:13:33
--><template>
  <el-dialog title="新建跟进记录" :visible.sync="dialogFormVisible" width="50%">
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="所属部门" prop="roleType">
        <el-input v-model="form.roleType" readonly></el-input>
      </el-form-item>
      <div class="justify_lk">
        <el-form-item label="沟通渠道" prop="contactType">
          <el-select v-model="form.contactType" placeholder="请选择沟通渠道">
            <el-option label="坐席" value="TEL"></el-option>
            <el-option label="手机" value="MOBILE"></el-option>
            <el-option label="微信" value="WX"></el-option>
            <el-option label="在线客服" value="ONLINE_SUPPORT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束类型" prop="finishType">
          <el-select v-model="form.finishType" placeholder="请选择结束类型">
            <el-option label="无效沟通" value="INVALID"></el-option>
            <el-option label="完成沟通" value="COMPLETE"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="节点" prop="pointType">
        <el-radio-group v-model="form.pointType">
          <el-radio
            :label="value"
            v-for="(value, name) in {
              首通: 'FIRST',
              老生覆盖: 'EARLY_STUDENT',
              日常回访: 'DAILY_CONTACT',
              运营: 'OPERATIONS',
              客服: 'CUSTOMER_SERVICE',
            }"
            :key="name"
            >{{ name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item label="沟通内容" prop="content">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'addNew',
  props: {
    changeSubject: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      roles: [
        { id: '1', name: '管理员' },
        { id: '2', name: '综合运营' },
        { id: '3', name: '小度市场' },
        { id: '4', name: '财务' },
        { id: '5', name: '供应链' },
        { id: '6', name: '人事' },
        { id: '7', name: '超级管理员' },
        { id: '8', name: 'S1Producer' },
        { id: '9', name: 'S2Producer' },
        { id: '10', name: 'S3Producer' },
        { id: '11', name: 'Administrator' },
        { id: '12', name: 'S1Operator' },
        { id: '13', name: 'S2Operator' },
        { id: '14', name: 'S3Operator' },
        { id: '15', name: 'Anonymous' },
        { id: '16', name: 'WriteAdmin' },
        { id: '17', name: 'MusicAdmin' },
        { id: '18', name: 'ArtAdmin' },
        { id: '19', name: '教研' },
        { id: '22', name: 'S7Producer' },
        { id: '23', name: 'S7Admin' },
        { id: '27', name: 'test' },
        { id: '28', name: '测试' },
        { id: '19', name: '教研' },
        { id: '29', name: '投放运营' },
        { id: '30', name: '产品运营' },
        { id: '31', name: '客服' },
        { id: '32', name: '后端服务' },
        { id: '33', name: '数据分析' },
        { id: '34', name: '社群运营' },
        { id: '35', name: '销售部数据分析' },
        { id: '38', name: 'APP端人员' },
        { id: '39', name: '综合运营部' },
        { id: '40', name: '中台运营' },
      ],
      dialogFormVisible: false,
      // form
      form: {
        uid: 0,
        cid: 0,
        systemType: 'BOSS',
        roleType: '',
        contactType: '',
        finishType: '',
        pointType: '',
        content: '',
      },
      rules: {
        roleType: [{ required: true, message: '必填', trigger: 'change' }],
        contactType: [{ required: true, message: '必选', trigger: 'change' }],
        finishType: [{ required: true, message: '必选', trigger: 'change' }],
        pointType: [{ required: true, message: '必选', trigger: 'change' }],
        content: [
          { required: true, message: '请键入内容', trigger: 'blur' },
          { max: 255, message: '最多255个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { code } = await this.$http.User.submitForm(
            Object.assign(this.form, {
              subject: this.changeSubject ? 'WRITE_APP' : 'ART_APP',
            })
          ).catch((err) => {
            console.error(err)
            this.$message.error('记录提交失败')
          })
          if (code === 0) {
            this.$message.success('记录提交成功')
            this.dialogFormVisible = false
            this.$refs.form.resetFields()
            setTimeout(() => {
              this.$root.$emit('reload', true)
            }, 1500) // 不延时拉不到新数据
          }
        } else {
          this.$message.warning('请检查表单规则')
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.dialogFormVisible = false
    },
  },
  mounted() {
    this.form.uid = this.$route.params.id
    const storage1 = JSON.parse(localStorage.getItem('staff'))
    this.form.cid = storage1.id
    let arr = []
    arr = this.roles.filter(
      (n) => storage1.roleList && n.id === storage1.roleList[0]
    )
    if (arr && arr.length > 0) {
      this.form.roleType = arr[0].name
    }
  },
}
</script>

<style lang="scss" scoped>
.justify_lk {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/deep/ .el-radio {
  margin: 0;
  padding: 10px 10px 10px 0px;
}
</style>
