<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-20 16:37:49
 * @LastEditors: liukun
 * @LastEditTime: 2020-11-09 20:58:09
--><template>
  <el-dialog title="新建跟进记录" :visible.sync="dialogFormVisible" width="50%">
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="120px"
      label-position="right"
    >
      <div class="justify_lk">
        <el-form-item label="沟通渠道" prop="contactType">
          <el-select v-model="form.contactType" placeholder="请选择沟通渠道">
            <el-option label="坐席" value="TEL"></el-option>
            <el-option label="手机" value="MOBILE"></el-option>
            <el-option label="微信" value="WX"></el-option>
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
              退费挽单: 'DETAIN'
            }"
            :key="name"
            >{{ name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="升舱意向标签" prop="labelId">
        <el-radio-group v-model="form.labelId">
          <el-radio v-for="item of tags_ft" :key="item.id" :label="item.id">{{
            item.name
          }}</el-radio>
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
    userId: {
      // 抽屉内容接口值
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      tags_ft: [],
      // form
      form: {
        uid: 0,
        cid: 0,
        systemType: 'BOSS',
        pointType: '',
        contactType: '',
        finishType: '',
        labelId: '',
        content: ''
      },
      rules: {
        contactType: [{ required: true, message: '必选', trigger: 'change' }],
        finishType: [{ required: true, message: '必选', trigger: 'change' }],
        pointType: [{ required: true, message: '必选', trigger: 'change' }],
        labelId: [{ required: true, message: '必选', trigger: 'change' }],
        content: [
          { required: true, message: '请键入内容', trigger: 'blur' },
          { max: 255, message: '最多255个字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    userId: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue !== oldValue) this.form.uid = newValue
      }
    }
  },
  methods: {
    async getTags() {
      const {
        code,
        payload
      } = await this.$http.Approval.getTagsFangTao().catch((err) => {
        console.error(err)
        this.$message.error('意向标签获取失败_网络')
      })
      if (!code) {
        this.tags_ft = payload
      } else {
        this.$message.error('意向标签获取失败_接口')
      }
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.info(
            6666,
            Object.assign(this.form, {
              subject: this.$store.state.subjects.subject
            })
          )
          const { code } = await this.$http.User.submitForm(
            Object.assign(this.form, {
              subject: this.$store.state.subjects.subject
            })
          ).catch((err) => {
            console.error(err)
            this.$message.error('记录提交失败')
          })
          if (code === 0) {
            this.$message.success('记录提交成功')
            this.dialogFormVisible = false
          }
        } else {
          this.$message.warning('请检查表单规则')
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.dialogFormVisible = false
    }
  },
  mounted() {
    this.getTags()
    const storage1 = JSON.parse(localStorage.getItem('staff'))
    this.form.cid = storage1.id
  }
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
