<!--
 * @Descripttion: 真人点评配置 - 列表
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-10-29 22:35:09
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-27 20:05:09
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container">
      <!-- container -->
      <div class="part-time-container">
        <div class="header">
          <el-button @click="handleAdd" type="primary" size="small"
            >新建真人点评排期</el-button
          >
        </div>
        <!-- dom -->
        <div class="tableInner" ref="tableInner"></div>
        <el-table :data="tableData" :height="tableHeight" style="width: 100%">
          <el-table-column
            align="center"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            v-for="(item, index) in columns"
            :key="index"
          >
            <template slot-scope="scope">
              <!-- 如果有render,自定义数据 -->
              <p v-if="item.render">
                {{ item.render(scope.row, scope.$index) }}
              </p>
              <p v-else>{{ scope.row[item.prop] }}</p>
            </template>
            <!-- 多个表头 -->
            <template v-if="item.children && item.children.length > 0">
              <el-table-column
                align="center"
                :prop="child.prop"
                :label="child.label"
                :min-width="child.width"
                v-for="(child, cidx) in item.children"
                :key="cidx"
              >
                <template slot-scope="scopeChild">
                  <!-- 如果有render,自定义数据 -->
                  <p v-if="child.render">
                    {{ child.render(scopeChild.row, cidx) }}
                  </p>
                  <p v-else>{{ scopeChild.row[item.prop][child.prop] }}</p>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button
                @click="handleShowDetail(scope.row)"
                type="text"
                size="small"
                >详细</el-button
              >
              <el-button @click="handleEdit(scope.row)" type="text" size="small"
                >编辑</el-button
              >
              <!-- <el-button @click="handleStop(scope.row)" type="text" size="small"
                >停止分配</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-row>
</template>

<script>
import { SUP_LEVEL_UPPER } from '@/utils/supList'
// import MPagination from '@/components/MPagination/index.vue'
export default {
  name: 'parttimeScheduleList',
  components: {
    // MPagination
  },
  data() {
    return {
      tableHeight: 0,
      currentPage: 1,
      totalPages: 0,
      totalElements: 0,
      tableData: [],
      columns: [
        {
          label: '序号',
          prop: '',
          width: 80,
          render: (row, index, list = this.tableData) => {
            return list.length - index
          }
        },
        {
          label: '期名',
          prop: 'periodName',
          width: 160
        },
        {
          label: '配置班级',
          prop: 'teamConfigCount',
          children: [
            {
              label: SUP_LEVEL_UPPER.S4,
              prop: 'S4',
              width: 80
            },
            {
              label: SUP_LEVEL_UPPER.S1,
              prop: 'S1',
              width: 80
            },
            {
              label: SUP_LEVEL_UPPER.S2,
              prop: 'S2',
              width: 80
            },
            {
              label: SUP_LEVEL_UPPER.S5,
              prop: 'S5',
              width: 80
            },
            {
              label: SUP_LEVEL_UPPER.S3,
              prop: 'S3',
              width: 80
            }
          ]
        }
      ]
    }
  },

  watch: {
    $route(to, from) {
      console.log(from)
      const { path } = from
      const { query } = this.$route
      console.log(query)

      // 新增或编辑成功后，返回重新请求列表
      if (path?.includes('/realReviewScheduleSet/') && query.refresh) {
        this.init()
      }
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getCommentTeamConfigCount()
      this.$nextTick(() => {
        const tableHeight =
          document.body.clientHeight - this.$refs.tableInner.offsetTop - 90
        this.tableHeight = tableHeight + ''
      })
    },
    async getCommentTeamConfigCount() {
      const {
        payload = []
      } = await this.$http.ReviewManage.getCommentTeamConfigCount()
      console.log(payload)
      // format data
      const result = payload.map((item) => {
        // const obj = {}
        const teamConfigCount = {}
        const { countList = [] } = item
        countList.forEach((count) => {
          // 配置班级（班级数量）
          Object.assign(teamConfigCount, {
            [`${count.sup}`]: count.teamConfigCount || 0
          })
        })
        return {
          ...item,
          teamConfigCount
        }
      })
      console.log(result)

      this.tableData = result
    },
    handleAdd() {
      this.$router.replace('/realReviewScheduleSet/add')
    },
    handleShowDetail(row) {
      const { term } = row
      if (!term) return
      this.$router.push(`/realReviewScheduleView/${term}`)
    },
    handleEdit(row) {
      console.log(row)
      const { term } = row
      if (!term) return
      this.$router.push(`/realReviewScheduleSet/edit?term=${term}`)
    },
    handleStop(row) {
      console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.part-time-container {
  .header {
    padding: 10px;
  }
  ::v-deep {
    .el-table th,
    .el-table td {
      padding: 0;
    }
  }
}
</style>
