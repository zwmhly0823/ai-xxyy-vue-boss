<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-20 16:37:49
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-02 12:17:17
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
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="用户信息概况:">
          <section>{{ initItemTrue.userName }}</section>
          <!-- <el-input v-model="initItemTrue.userName" readonly></el-input> -->
        </el-form-item>
        <el-form-item label="本月通过审核数:">
          <section style="color:#f84e5e">
            {{ initItemTrue.currentMonthAgreeCount }}
          </section>
        </el-form-item>
        <el-form-item label="截图上传时间:">
          <section>{{ initItemTrue.ctime }}</section>
        </el-form-item>
        <el-form-item label="用户上传截图:">
          <el-image
            :src="
              initItemTrue.uploadUrl ||
                'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
            "
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item label="审核结果:" prop="isAgree">
          <el-radio-group v-model="form.isAgree">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因:" prop="remark" v-if="!form.isAgree">
          <el-radio-group v-model="form.remark">
            <el-radio
              v-for="(value, name) in {
                0: '朋友圈未保留2小时以上',
                1: '未分享活动指定海报',
                2: '朋友圈设置了分组或私密',
                3: '重复上传',
                4: '无分享语',
                5: '他人朋友圈截图',
                6: '截图不完整',
                7: '截图有特殊处理'
              }"
              :label="value"
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
  inject: ['cr'],
  props: {
    arrangeArr: { type: Array, default: () => [] },
    approvingItem: { type: Object, default: () => {} }
  },

  data() {
    return {
      arrageArraySon: [],
      initItemTrue: {}, // 通用的复现单元数据
      drawer: false,
      // form
      form: {
        id: '',
        isAgree: true,
        remark: ''
      },
      rules: {
        isAgree: [
          { required: true, message: '审核结果必选', trigger: 'change' }
        ],
        remark: [{ required: true, message: '驳回原因必选', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 回显
    review(r) {
      this.initItemTrue = r || this.arrageArraySon[0]
    },
    // 提交
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 追加参数:flowId后提交
          this.form.id = +this.initItemTrue.flowId
          const { code } = await this.$http.Operating.submit_img(
            this.form
          ).catch((err) => {
            console.error(err)
            this.$message.error('审核处理失败')
          })
          if (code === 0) {
            this.$message.success('该单审核完成')
            this.recall()
          }
        } else {
          this.$message.warning('请检查表单规则')
        }
      })
    },

    // 下条
    recall() {
      // 删除已审核过的上条
      this.arrageArraySon.splice(
        this.arrageArraySon.findIndex(
          (item) => item.flowId === this.initItemTrue.flowId
        ),
        1
      )
      // 视当前页库存情况
      if (!this.arrageArraySon.length) {
        this.$alert('当前页审批已全部完成', '辛苦啦', {
          callback: () => {
            this.drawer = false
            this.cr.getData({ pageSize: this.cr.pageSize })
            // 功能达成;副作用页码不响应,因为每次拉新都选第1页数据
            // 原因是每次审核是以页为单位,审完1页才接口更新总量数据
          }
        })
      } else {
        this.review()
      }
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.drawer = false
    }
  },
  watch: {
    arrangeArr: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.log(newValue, oldValue, 'arrangeArr')
        this.arrageArraySon = newValue
      }
    },
    approvingItem: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.log(newValue, oldValue, 'approvingItem')
        this.initItemTrue = newValue
      }
    },

    'form.isAgree': {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue === true) {
          this.form.remark = ''
        }
      }
    }
  }
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
/deep/ .el-form .el-form-item {
  margin-bottom: 7px;
}
</style>
