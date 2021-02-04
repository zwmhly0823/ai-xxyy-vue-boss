<template>
  <div class="basics-table">
    <!-- table 上部的操作区 -->
    <div v-if="defaultPlugins && defaultPlugins.length" class="table-action">
      <template v-for="(item, index) in defaultPlugins">
        <custom-render
          v-if="item.render"
          :key="index"
          :render="(e) => item.render(e, index)"
        />
        <template v-else>
          <el-tooltip
            v-if="renderPlugins('reload', item)"
            :key="index"
            effect="dark"
            content="刷新"
            placement="top"
          >
            <svg class="icon" aria-hidden="true" @click="getList">
              <use xlink:href="#icon-reload" />
            </svg>
          </el-tooltip>
          <el-tooltip
            v-if="renderPlugins('setting', item)"
            :key="index"
            effect="dark"
            content="列设置"
            placement="top"
          >
            <el-popover placement="bottom" trigger="click">
              <svg slot="reference" class="icon" aria-hidden="true">
                <use xlink:href="#icon-setting" />
              </svg>
              <el-tree
                ref="tree"
                class="setting-table"
                :data="columns"
                :default-checked-keys="defaultChecked"
                show-checkbox
                node-key="prop"
                default-expand-all
                check-on-click-node
                :expand-on-click-node="false"
                @check-change="checkChange"
              />
            </el-popover>
          </el-tooltip>
        </template>
      </template>
    </div>
    <!-- table list -->
    <el-table
      :key="tableKey"
      ref="BasicsTable"
      v-loading="loading"
      :data="list"
      style="width: 100%"
      v-bind="{
        border: true,
        fit: true,
        'highlight-current-row': true,
        ...table,
        ...attr,
        ...attrs
      }"
      v-on="{ ...events, ...$listeners }"
    >
      <template v-for="(item, index) in columns">
        <table-column
          :key="index"
          :list="list"
          :index="index"
          :item="item"
          :checked="checked"
          :action-function="actionFunction"
          :loadings="loadings"
          :columns-slot="columnsSlot"
        >
          <template
            v-for="slotItem in columnsSlot"
            :slot="slotItem"
            slot-scope="scope"
          >
            <slot
              :name="slotItem"
              :row="scope.row"
              :$index="scope.$index"
              :column="scope.column"
              :list="scope.list"
            />
          </template>
        </table-column>
      </template>
    </el-table>
    <!-- <m-pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="listQuery.pageSizes"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->
    <m-pagination
      :current-page="listQuery.currentPage"
      :page-size="listQuery.pageSize"
      :page-count="listQuery.totalPages"
      :total="listQuery.totalElements"
      :page-size-arr="listQuery.pageSizeArr"
      @current-change="handlePage"
      @current-pagesizes="handlePageSize"
      show-pager
      open="calc(100vw - 170px - 25px)"
      close="calc(100vw - 50px - 25px)"
    ></m-pagination>
  </div>
</template>

<script>
import './font/iconfont.min'
import MPagination from '../MPagination' // Secondary package based on el-pagination
import TableColumn from './components/TableColumn'

export default {
  name: 'BasicsTable',
  components: {
    MPagination,
    TableColumn,
    CustomRender: {
      functional: true,
      render: (createElement, context) => {
        const h = context.props.render(createElement)
        const VNode = createElement('span').constructor
        if (h instanceof VNode) {
          return h
        } else {
          return createElement('span', h)
        }
      }
    }
  },
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    attr: {
      default: () => ({}),
      type: Object
    },
    events: {
      default: () => ({}),
      type: Object
    },
    table: {
      default: () => ({}),
      type: Object
    },
    list: {
      default: () => [],
      type: Array
    },
    columns: {
      default: () => [],
      type: Array
    },
    actionFunction: {
      default: () => ({}),
      type: Object
    },
    loadings: {
      default: () => ({}),
      type: Object
    },
    getList: {
      default: () => {},
      type: Function
    },
    // total: {
    //   default: 0,
    //   type: Number
    // },
    listQuery: {
      default: () => {
        return {
          // currentPage: 1,
          // pageSize: 20,
          // totalElements: 0,
          // totalPages: 1,
          // pageSizeArr: []
        }
      },
      type: Object
    },
    plugins: {
      default: false,
      type: [Array, Boolean]
    }
  },
  data() {
    return {
      attrs: {},
      defaultPlugins: [],
      defaultChecked: [],
      checked: [],
      tableKey: 0
    }
  },
  computed: {
    columnsSlot() {
      const { columns } = this
      const slotLoop = (list) => {
        let slot = []
        list.map((item) => {
          if (item.slot) {
            slot.push(item.slot)
          }
          if (item.children && item.children.length) {
            slot = [...slot, ...slotLoop(item.children)]
          }
        })
        return slot
      }
      return slotLoop(columns)
    }
  },
  watch: {
    columns() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { columns, plugins } = this
      if (columns) {
        const loopLabel = (list) => {
          let propArr = []
          list.map((item) => {
            propArr.push(item.prop)
            if (item.children && item.children.length) {
              propArr = [...propArr, ...loopLabel(item.children)]
            }
          })
          return propArr
        }
        this.defaultChecked = loopLabel(columns) || []
        this.checked = this.defaultChecked
      }
      if (plugins === true) {
        this.defaultPlugins = [
          'download',
          'colum-height',
          'fullscreen',
          'reload',
          'setting'
        ]
      } else {
        if (plugins && plugins.length) {
          this.defaultPlugins = plugins
        }
      }
    },
    // 勾选指定行，供外部调用
    // toggleSelection(row) {
    //   this.$refs.table.toggleRowSelection(row)
    // },
    // // 清除勾选行，供外部调用
    // clearSelection() {
    //   this.$refs.table.clearSelection()
    // },
    renderPlugins(name, item) {
      if (typeof item !== 'string') {
        if ('name' in item) {
          return name === item.name
        }
      }
      return name === item
    },
    // 行高改变
    changeColum(size) {
      const { table, attr } = this
      this.attrs = {
        ...table,
        ...attr,
        size: size
      }
    },
    // 列树改变
    checkChange() {
      const checkedNode = this.$refs.tree[0].getCheckedNodes(false, true)
      const prop = []
      checkedNode.map((item) => {
        prop.push(item.prop)
      })
      this.checked = prop
      this.tableKey++
    },
    // form实例
    getRef() {
      return this.$refs.BasicsTable
    },

    handlePage(page) {
      this.getList(page, this.listQuery.pageSize || 20)
    },
    handlePageSize(size) {
      this.getList(1, size || 20)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.table-action {
  padding: 8px 0;
  text-align: right;
  svg {
    color: #666666;
    font-size: 20px;
    font-weight: bold;
    margin: 0 2px;
    cursor: pointer;
    &:hover {
      color: #171717;
    }
  }
}
.setting-table {
  /deep/ .el-tree-node__label {
    margin-left: 4px;
  }
}
/deep/ .el-table__header {
  th {
    background-color: #f4f4f5;
  }
}
/deep/ .el-table th {
  padding: 0px 0;
}
/deep/ .el-table td {
  padding: 5px 0;
}
.level {
  display: flex;
  justify-content: center;
  align-items: center;
  .item {
    display: block;
    &.large {
      margin: 0 10px;
    }
    &.default {
      margin: 0 5px;
    }
    &.small {
      margin: 0 2px;
    }
  }
}
.vertical {
  .item {
    display: block;
    &.large {
      margin: 10px 0;
    }
    &.default {
      margin: 5px 0;
    }
    &.small {
      margin: 2px 0;
    }
  }
}
.table-img {
  width: 50px;
  height: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
  img {
    width: 50px;
  }
}
</style>
