<template>
  <div>
    <el-checkbox-group
      class="sys-v2-el-checkbox-group"
      v-model="sysCheckList"
      @change="getGroup"
    >
      <transition-group tag="div">
        <div
          v-for="(item, index) in sysTableList"
          :key="item.title"
          draggable="true"
          @dragstart="handleDragStart($event, item)"
          @dragover.prevent="handleDragOver($event, item)"
          @dragenter="handleDragEnter($event, item)"
          @dragend="handleDragEnd($event, item)"
        >
          <div class="sys-v2-checkbox">
            <el-checkbox size="medium" :label="item.title">
              {{ item.title }}</el-checkbox
            >
            <div>
              <el-button
                v-show="index > 0 && item.flag && isFlag && item.top"
                @click="moveButton(index, 'up')"
                class="sys-v2-button"
              >
                <i class="el-icon-upload2 sys-v2-icon"></i>
              </el-button>
              <el-button
                v-show="
                  index + 1 != sysTableList.length &&
                    item.flag &&
                    isFlag &&
                    item.down
                "
                @click="moveButton(index, 'down')"
                class="sys-v2-button"
                ><i class="el-icon-download sys-v2-icon"></i
              ></el-button>
            </div>
          </div>
        </div>
      </transition-group>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'TableSetColumn',
  props: {
    table_list: {
      type: Object
    }
  },
  data() {
    return {
      isFlag: true,
      sysTableList: [],
      sysCheckList: [] // 设置表格列显示与顺序
    }
  },
  mounted() {
    console.log(this.table_list, '我是子组件列表')
    this.sysTableList = this.table_list.expression.column
    const arr = []
    let flag = true
    this.sysTableList.forEach((item) => {
      item.top = true
      item.down = true
      if (item.flag) {
        arr.push(item.title)
        if (flag) {
          flag = false
          console.log('我是第一个true', item)
          item.top = false
        }
      }
    })
    this.sysTableList.forEach((item) => {
      if (item.title === arr[arr.length - 1]) {
        item.down = false
        console.log('我是最后一个true', item)
      } else {
        item.down = true
      }
    })
    this.sysCheckList = arr
    if (arr.length === 1) {
      this.isFlag = false
    } else {
      this.isFlag = true
    }
  },
  methods: {
    // 移动列表 TableSetColumn
    handleDragStart(e, item) {
      this.dragging = item
    },
    handleDragEnd(e, item) {
      this.$emit('tableSet', this.sysTableList)
      this.dragging = null
    },
    // 首先把div变成可以放置的元素，即重写dragenter/dragover
    handleDragOver(e) {
      e.dataTransfer.dropEffect = 'move' // e.dataTransfer.dropEffect="move";// 在dragenter中针对放置目标来设置!
    },
    handleDragEnter(e, item) {
      e.dataTransfer.effectAllowed = 'move' // 为需要移动的元素设置dragstart事件
      if (item === this.dragging) {
        return
      }
      const newItems = [...this.sysTableList]
      const src = newItems.indexOf(this.dragging)
      const dst = newItems.indexOf(item)
      newItems.splice(dst, 0, ...newItems.splice(src, 1))
      this.sysTableList = newItems
    },

    // 移动列表
    moveButton(index, type) {
      const arr = []
      if (type === 'up') {
        if (!this.sysTableList[index - 1].flag) {
          // 判断下一位是否为false
          for (let i = index; i > -1; i--) {
            if (!this.sysTableList[i].flag) {
              arr.push(this.sysTableList[i])
              if (this.sysTableList[i - 1].flag) {
                // 判断是否为连续false
                break
              }
            }
          }
          this.sysTableList[index] = this.sysTableList.splice(
            index - (arr.length * 1 + 1), // 切换flag:false 长度加1的位置
            1,
            this.sysTableList[index]
          )[0]
        } else {
          this.sysTableList[index] = this.sysTableList.splice(
            index - 1,
            1,
            this.sysTableList[index]
          )[0]
        }
      }
      if (type === 'down') {
        if (!this.sysTableList[index + 1].flag) {
          for (let i = index; i < this.sysTableList.length; i++) {
            if (!this.sysTableList[i].flag) {
              arr.push(this.sysTableList[i])
              if (this.sysTableList[i + 1].flag) {
                break
              }
            }
          }
          this.sysTableList[index] = this.sysTableList.splice(
            index + (arr.length * 1 + 1),
            1,
            this.sysTableList[index]
          )[0]
        } else {
          this.sysTableList[index] = this.sysTableList.splice(
            index + 1,
            1,
            this.sysTableList[index]
          )[0]
        }
      }
      {
        console.log(this.sysTableList[index], 'index-----------------------')
        const arr = []
        let flag = true
        console.log(this.sysTableList.indexOf(true))
        this.sysTableList.forEach((item) => {
          if (item.flag) {
            arr.push(item)
            if (flag) {
              flag = false
              item.top = false
              console.log('我是第一个true', item)
            } else {
              item.top = true
            }
          }
        })
        this.sysTableList.forEach((item) => {
          if (item.title === arr[arr.length - 1].title) {
            item.down = false
            console.log('我是最后一个true', item)
          } else {
            item.down = true
          }
        })
      }
      this.$emit('tableSet', this.sysTableList)
    },
    // 获取设置列表
    getGroup(res) {
      if (res.length === 0) {
        this.sysTableList.forEach((item) => {
          item.flag = false
        })
        this.$emit('tableSet', this.sysTableList)
        return
      }
      const arr = []
      let flag = true
      console.log(this.sysTableList.indexOf(true))
      this.sysTableList.forEach((item) => {
        if (res.indexOf(item.title) === -1) {
          item.flag = false
        } else {
          item.flag = true
          arr.push(item)
          if (flag) {
            flag = false
            item.top = false
            console.log('我是第一个true', item)
          } else {
            item.top = true
          }
        }
      })
      this.sysTableList.forEach((item) => {
        if (item.title === arr[arr.length - 1].title) {
          item.down = false
          console.log('我是最后一个true', item)
        } else {
          item.down = true
        }
      })
      if (arr.length === 1) {
        this.isFlag = false
      } else {
        this.isFlag = true
      }
      console.log(arr, 'arr---------------------')
      this.$emit('tableSet', this.sysTableList)
    }
  }
}
</script>

<style lang="scss" scoped>
.sys-v2-el-checkbox-group {
  display: flex;
  flex-direction: column;
  min-width: 190px;
}
.sys-v2-checkbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  div {
    min-width: 50px;
    height: auto;
    display: flex;
  }
}
.sys-v2-checkbox:hover {
  background: #e7f7ff;
}
.sys-v2-icon {
  color: #0096ff;
}
.sys-v2-button {
  padding: 0;
  border: none;
  display: none;
}
.sys-v2-checkbox:hover .sys-v2-button {
  display: block;
}
</style>
