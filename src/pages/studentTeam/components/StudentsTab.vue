<template>
  <el-table :data="tableData" style="width: 100%;" max-height="600px">
    <el-table-column fixed label="基本信息" class="information">
      <template slot-scope="scope">
        <div class="information-img">
          <i :class="scope.row.img"></i>
        </div>
        <div class="information-right">
          <div class="phone">{{ scope.row.phone }}</div>
          <div class="age">{{ scope.row.age }}</div>
          <div class="wechatnote">微信备注:{{ scope.row.wechatNote }}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="上课信息" class="haveclass"
      >å
      <template slot-scope="scope">
        <div class="haveclass-content">
          参课:
          <span>{{ scope.row.participate }}</span>
          完课:
          <span>{{ scope.row.end }}</span>
        </div>
        <div class="haveclass-content">
          作品:
          <span>{{ scope.row.works }}</span>
          点评:
          <span>{{ scope.row.review }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="关联物流" class="logistics">
      <template slot-scope="scope">
        <div class="logistics-num">{{ scope.row.logisticsNum }}</div>
        <div>{{ scope.row.logisticsState }}</div>
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <div>{{ scope.row.course }}</div>
        <div>{{ scope.row.addBuddy }}</div>
        <div>{{ scope.row.wechatGroup }}</div>
      </template>
    </el-table-column>
    <!-- <el-table-column label="标签" class="thelabel"></el-table-column> -->
  </el-table>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          // 基本信息
          img: 'el-icon-user',
          phone: '15133266546',
          age: '2岁3个月 无基础',
          wechatNote: '爱死的鱼',
          // 上课信息
          participate: '3',
          end: '4',
          works: '5',
          review: '6',
          // 关联物流
          logisticsNum: '5',
          logisticsState: '最近一次已发货',
          // 状态
          course: '已体验课',
          addBuddy: '已加好友',
          wechatGroup: '已进微信群'
        },
        {
          // 基本信息
          img: 'el-icon-user',
          phone: '15133266546',
          age: '2岁3个月 无基础',
          wechatNote: '爱死的鱼',
          // 上课信息
          participate: '3',
          end: '4',
          works: '5',
          review: '6',
          // 关联物流
          logisticsNum: '5',
          logisticsState: '最近一次已发货',
          // 状态
          course: '已体验课',
          addBuddy: '已加好友',
          wechatGroup: '已进微信群'
        },
        {
          // 基本信息
          img: 'el-icon-user',
          phone: '15133266546',
          age: '2岁3个月 无基础',
          wechatNote: '爱死的鱼',
          // 上课信息
          participate: '3',
          end: '4',
          works: '5',
          review: '6',
          // 关联物流
          logisticsNum: '5',
          logisticsState: '最近一次已发货',
          // 状态
          course: '已体验课',
          addBuddy: '已加好友',
          wechatGroup: '已进微信群'
        },
        {
          // 基本信息
          img: 'el-icon-user',
          phone: '15133266546',
          age: '2岁3个月 无基础',
          wechatNote: '爱死的鱼',
          // 上课信息
          participate: '3',
          end: '4',
          works: '5',
          review: '6',
          // 关联物流
          logisticsNum: '5',
          logisticsState: '最近一次已发货',
          // 状态
          course: '已体验课',
          addBuddy: '已加好友',
          wechatGroup: '已进微信群'
        },
        {
          // 基本信息
          img: 'el-icon-user',
          phone: '15133266546',
          age: '2岁3个月 无基础',
          wechatNote: '爱死的鱼',
          // 上课信息
          participate: '3',
          end: '4',
          works: '5',
          review: '6',
          // 关联物流
          logisticsNum: '5',
          logisticsState: '最近一次已发货',
          // 状态
          course: '已体验课',
          addBuddy: '已加好友',
          wechatGroup: '已进微信群'
        },
        {
          // 基本信息
          img: 'el-icon-user',
          phone: '15133266546',
          age: '2岁3个月 无基础',
          wechatNote: '爱死的鱼',
          // 上课信息
          participate: '3',
          end: '4',
          works: '5',
          review: '6',
          // 关联物流
          logisticsNum: '5',
          logisticsState: '最近一次已发货',
          // 状态
          course: '已体验课',
          addBuddy: '已加好友',
          wechatGroup: '已进微信群'
        },
        {
          // 基本信息
          img: 'el-icon-user',
          phone: '15133266546',
          age: '2岁3个月 无基础',
          wechatNote: '爱死的鱼',
          // 上课信息
          participate: '3',
          end: '4',
          works: '5',
          review: '6',
          // 关联物流
          logisticsNum: '5',
          logisticsState: '最近一次已发货',
          // 状态
          course: '已体验课',
          addBuddy: '已加好友',
          wechatGroup: '已进微信群'
        }
      ]
    }
  },
  methods: {}
}
</script>
<style scoped lang="scss">
// 基本信息
.information {
  &-img {
    line-height: 70px;
    width: 20px;
    float: left;
  }
  &-right {
    float: left;
    .wechatnote {
      color: #cccccc;
    }
  }
}
// 上课信息
.haveclass {
  &-content {
    span {
      color: #409eff;
    }
  }
}
//关联物流
.logistics {
  &-num {
    color: #409eff;
  }
}
</style>
