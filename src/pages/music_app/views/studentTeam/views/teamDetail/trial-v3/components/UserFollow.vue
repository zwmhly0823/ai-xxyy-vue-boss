<!--
 * @Descripttion: table列表中 跟进 数据展示
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-25 11:38:53
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-26 13:24:04
-->
<template>
  <div class="d-flex align-center user-follow">
    <template v-if="!row.userIntention">
      <i
        class="el-icon-circle-plus-outline"
        @click="handleIntention(index, row.id, 'create')"
      ></i>
    </template>
    <template v-else>
      <div class="flex-1">
        <!-- type: 1-低，2-中 3-高 4-无 -->
        <p>
          <span :class="row.userIntention.typeClass"
            >【{{ row.userIntention.typeText }}】</span
          >
          <span
            v-if="
              +row.userIntention.today === tomorrow &&
                +row.userIntention.is_track === 1
            "
            >明日跟进</span
          >
          <span
            v-if="
              +row.userIntention.today === today &&
                +row.userIntention.is_track === 1
            "
            >今日跟进</span
          >
        </p>
        <el-popover
          placement="top-start"
          trigger="hover"
          :content="row.userIntention.describe"
        >
          <p slot="reference" class="ellipsis">
            备注：{{ row.userIntention.describe }}
          </p>
        </el-popover>
      </div>
      <i
        class="el-icon-edit"
        @click="
          handleIntention(
            index,
            row.id,
            !row.userIntention ? 'create' : 'update'
          )
        "
      ></i>
    </template>
  </div>
</template>

<script>
import { todayTimestamp, tomorrowTimestamp } from '../utils'
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: null
    }
  },

  computed: {
    today() {
      return todayTimestamp()
    },
    tomorrow() {
      return tomorrowTimestamp()
    }
  },

  methods: {
    // 创建或修改意向度&跟进记录
    // @type: 'create'，'update'
    handleIntention(index, uid, type = 'update') {
      this.$emit('handle-intention', index, uid, type)
    }
  }
}
</script>

<style lang="scss" scoped>
$dangerColor: #f56c6c;
$mainColor: #2a75ed;
$successColor: #67c23a;
$grayColor: #f0f1f2;

.danger {
  color: $dangerColor;
}
.success {
  color: $successColor;
}
.main-text {
  color: #333;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-follow {
  .flex-1 {
    overflow: hidden;
  }
  i {
    margin-left: 8px;
    cursor: pointer;
  }
}
</style>
