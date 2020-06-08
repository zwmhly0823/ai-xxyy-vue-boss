<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:30:11
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-08 18:49:47
 -->
<template>
  <el-card border="false" shadow="never" :class="$style.elard">
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item label="用户搜索:" :class="{ [$style.marginer]: true }">
        <el-input
          v-model="input"
          @input="onInput"
          placeholder="用户手机号"
          size="mini"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户行为:" :class="{ [$style.marginer]: true }">
        <el-select
          v-model="userBehavior"
          multiple
          collapse-tags
          clearable
          size="mini"
          filterable
          placeholder="请选择用户行为"
          @change="onUserBehavior"
        >
          <el-option
            v-for="item in userBehaviorList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否转化:" :class="{ [$style.marginer]: true }">
        <el-select
          v-model="conversion"
          clearable
          size="mini"
          placeholder="选择是否转化"
          @change="onConversion"
        >
          <el-option
            v-for="item in conversionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="课程排期:" :class="{ [$style.marginer]: true }">
        <el-select
          v-model="curriculum"
          clearable
          size="mini"
          placeholder="体验课排期"
          @change="onCurriculum"
        >
          <el-option
            v-for="item in curriculumList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 课程期数 -->
      <el-form-item :class="{ [$style.marginer]: true }">
        <searchStage
          @result="result"
          :placeholder="placeholder"
          :type="curriculumType"
        />
      </el-form-item>
      <br />
      <el-form-item label="下单时间:" :class="{ [$style.marginer]: true }">
        <date-picker
          :class="[$style.fourPoint, 'allmini']"
          @result="getDate"
          name="ctime"
        >
          <template v-slot:buttons>
            <div class="row_colum margin_l10">
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur0 }"
                @click="today"
                >今日</el-button
              >
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur1 }"
                @click="yesterday"
                >昨天</el-button
              >
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur2 }"
                @click="thisweek"
                >本周</el-button
              >
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur3 }"
                @click="thismonth"
                >本月</el-button
              >
            </div>
          </template>
        </date-picker>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import datePicker from '@/components/MSearch/searchItems/datePicker.vue'
import searchStage from '@/components/MSearch/searchItems/searchStage.vue'
export default {
  components: {
    datePicker,
    searchStage
  },
  data() {
    return {
      cur0: false,
      cur1: false,
      cur2: false,
      cur3: false,
      currentBtn: null,
      input: '',
      userBehaviorList: [
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
      ],
      userBehavior: [],
      conversionList: [
        {
          value: '0',
          label: '未转化'
        },
        {
          value: '1',
          label: '已转化'
        }
      ],
      conversion: '',
      curriculumList: [
        {
          value: '1',
          label: '系统课排期'
        },
        {
          value: '0',
          label: '体验课排期'
        }
      ],
      placeholder: ' ',
      curriculumType: '0',
      curriculum: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getActionTypeList()
  },
  mounted() {},
  methods: {
    getActionTypeList() {
      this.$http.Statistics.actionTypeList().then((res) => {
        console.log(res)

        const _data = res.data.actionTypeList
        _data.forEach((item) => {
          item.label = item.name
          item.value = item.id
        })
        this.userBehaviorList = _data
      })
    },
    getDate(res) {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      if (!res || !res.quick) this.currentBtn = null
      if (res.quick && this.currentBtn) this[`cur${this.currentBtn}`] = true
      delete res.quick
      this.$emit('fourpoints', res)
    },
    // 4点外移
    // 今日
    today() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur0 = true
      this.currentBtn = '0'
      const start = new Date(new Date().toLocaleDateString()).getTime() // 设定日期,时间默认0点
      const end = Date.now()
      console.log([start, end])
      this.$root.$emit('fourpoint', [start, end])
    },
    // 昨日
    yesterday() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur1 = true
      this.currentBtn = '1'
      const yester = new Date()
      yester.setDate(new Date().getDate() - 1)
      yester.toLocaleDateString()
      const start = new Date(
        yester.toLocaleDateString() + ' 00:00:00'
      ).valueOf()
      const end = new Date(yester.toLocaleDateString() + ' 23:59:59').valueOf()
      this.$root.$emit('fourpoint', [start, end])
    },
    // 本周
    thisweek() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur2 = true
      this.currentBtn = '2'
      const week = new Date()
      const reverseDays = week.getDay() ? week.getDay() - 1 : 6
      const start =
        new Date(new Date().toLocaleDateString()).getTime() -
        reverseDays * 86400000
      const end = new Date().getTime()
      this.$root.$emit('fourpoint', [start, end])
    },
    // 本月
    thismonth() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur3 = true
      this.currentBtn = '3'
      const date = new Date()
      date.setDate(1)
      const start = new Date(new Date(date).toLocaleDateString()).getTime()
      const end = new Date().getTime()
      this.$root.$emit('fourpoint', [start, end])
    },
    // 手机号搜索返回值
    onInput(data) {
      this.$emit('onInputValue', data)
    },
    // 用户行为
    onUserBehavior(data) {
      this.$emit('onBehavior', data.toString())
    },
    // 是否转化
    onConversion(data) {
      console.log(data)
    },
    // 选择课程排期
    onCurriculum(data) {
      this.curriculumType = data
    },
    // 课程选择的期数
    result(data) {
      console.log(data)
    }
  }
}
</script>
<style lang="scss" module>
.elard {
  border: none;
  margin-top: 5px;
  margin-bottom: 5px;
}
.marginer {
  margin-bottom: 0px;
}
.fourPoint {
  display: flex;
}
:global {
  /* 定义多个全局样式 */
  .allmini {
    display: flex;
    align-items: center;
    height: 40px;
  }
  .row_colum {
    display: flex;
  }
  .margin_l10 {
    margin-left: 10px;
  }
}
</style>
<style lang="scss"></style>
