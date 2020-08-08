<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-20 16:37:49
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-08 15:53:13
--><template>
  <el-drawer :visible.sync="drawer" size="40%" :destroy-on-close="true">
    <template v-slot:title>
      <section class="setou123">
        <strong></strong>
        <span>审核操作</span>
      </section>
    </template>
    <div class="formBody">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="用户信息">
          <el-input v-model="form.infoD" readonly></el-input>
        </el-form-item>
        <el-form-item label="本月通过审核数">
          <el-input v-model="form.digit" readonly></el-input>
        </el-form-item>
        <el-form-item label="上传时间">
          <el-date-picker
            v-model="form.dateTime"
            type="datetime"
            value-format="timestamp"
            readonly
            style="width:100%"
          >
          </el-date-picker>
        </el-form-item>
        <div class="justify_lk">
          <el-form-item label="沟通渠道">
            <el-select v-model="form.contactType" placeholder="请选择沟通渠道">
              <el-option label="坐席" value="TEL"></el-option>
              <el-option label="手机" value="MOBILE"></el-option>
              <el-option label="微信" value="WX"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结束类型">
            <el-select v-model="form.finishType" placeholder="请选择结束类型">
              <el-option label="无效沟通" value="INVALID"></el-option>
              <el-option label="完成沟通" value="COMPLETE"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="沟通内容">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="截图">
          <el-image
            :src="
              form.img ||
                'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
            "
            width="80%"
          ></el-image>
        </el-form-item>
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="form.result">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="0">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因" prop="reason" v-if="!form.result">
          <el-radio-group v-model="form.reason">
            <el-radio
              v-for="(value, name) in {
                0: '朋友圈未保留12小时以上',
                1: '未分享活动指定海报',
                2: '朋友圈设置了分组或私密',
                3: '重复上传',
                4: '无分享语',
                5: '他人朋友圈截图',
                6: '截图不完整',
                7: '截图有特殊处理'
              }"
              :label="name"
              :key="name"
              >{{ value }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'drawer_lk',
  props: {
    initItem: { type: Object, default: () => {} },
    arrageArray: { type: Array, default: () => [] }
  },

  data() {
    return {
      arrageArraySon: [...this.arrageArray], // 单向流原则
      initItemSon: { ...this.initItem }, // 单向流原则
      initItemTrue: {}, // 通用的复现单元数据
      drawer: false,
      // form
      form: {
        uid: 0,
        teacherId: 0,

        infoD: '',
        digit: '',
        dateTime: '',
        img: '',
        result: 1,
        reason: ''
      },
      rules: {
        result: [
          { required: true, message: '审核结果必选', trigger: 'change' }
        ],
        reason: [{ required: true, message: '驳回原因必选', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 回显
    review() {
      if (this.initItemSon.status) {
        // 第1次处理
        this.initItemTrue = this.initItemSon
      } else {
        this.initItemTrue = this.arrageArraySon[0]
      }
    },
    // 提交
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { code } = await this.$http.User.submitForm(this.form).catch(
            (err) => {
              console.error(err)
              this.$message.error('审核处理失败')
            }
          )
          if (code === 0) {
            this.$message.success('该单审核完成')
          }
        } else {
          this.$message.warning('请检查表单规则')
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.drawer = false
    },
    // 提交成功后_往复操作
    recall() {
      // 第1次处理
      if (this.initItemSon.status) {
        this.initItemSon.status = null
        this.arrageArraySon.splice(
          this.arrageArraySon.findIndex(
            (item) => item.flowId === this.initItemSon.flowId
          ),
          1
        )
      } else {
        this.arrageArraySon.shift()
        if (!this.arrageArraySon.length) {
          this.$message.warning('辛苦啦,当前页审批完成! 翻页接着批')
        }
      }
    }
  },
  watch: {
    'form.result': {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue === 1) {
          this.form.reason = ''
        }
      }
    },
    // 他爹点那么一下
    initItemSon: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        // 处理上来就执行的问题
        if (oldValue) {
          console.info('点击审核,单条数据改变触发第1步回显')
          this.review()
        }
      }
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.formBody {
  padding: 20px;
  box-sizing: border-box; // for:ignore padding
  height: calc(100vh - 90px); // 可以多减→缩小容器高度
  overflow-y: scroll;
}
.justify_lk {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/deep/ .el-radio {
  margin: 0;
  padding: 10px 10px 10px 0px;
}
.setou123 {
  padding: 10px 0px;
  span {
    vertical-align: middle;
    font-size: 16px;
  }
  strong {
    vertical-align: middle;
    background-color: #49a3ff;
    display: inline-block;
    width: 16px;
    height: 2px;
    transform: rotate(90deg);
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
