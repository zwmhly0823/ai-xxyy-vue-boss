<template>
  <el-drawer
    ref="adjustDrawer"
    :title="adjustDrawerData.title"
    :visible.sync="adjustDrawerShow"
    direction="rtl"
    class="adjust-drawer-class"
    :modal-append-to-body="false"
    :before-close="handleDrawerClose"
    v-loading="adjustDrawerData.loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-form
      :model="adjustDrawerData"
      class="adjust-drawer-form"
      v-if="reload"
      :key="now"
    >
      <el-form-item
        v-for="(dItem, dKey) in adjustDrawerData.content"
        :key="dKey"
        :label="dItem.label"
        :label-width="adjustDrawerData.width"
      >
        <template v-if="dItem.type === 'img'">
          <template
            v-if="
              dItem.value.indexOf('mp4') > -1 ||
                dItem.value.indexOf('mov') > -1 ||
                dItem.value.indexOf('flv') > -1 ||
                dItem.value.indexOf('rmvb') > -1
            "
          >
            <video
              style="width: 220px; height: 120px;"
              :src="dItem.value"
              controls
            ></video>
          </template>
          <template v-else>
            <el-image
              v-if="dItem.value"
              style="width: 220px; height: 120px"
              :src="dItem.value"
              fit="contain"
              :preview-src-list="[dItem.value]"
            >
            </el-image>
            <span v-else>未上传</span>
          </template>
        </template>
        <template v-else-if="dItem.label === '用户电话'">
          <el-link
            v-if="!is3d"
            type="primary"
            :href="'/music_app/#/details/' + dItem.valueId"
            target="_blank"
            >{{ dItem.value }}</el-link
          >
          <el-link
            v-else
            type="primary"
            :href="'/music_app/#/details/' + dItem.valueId"
            target="_blank"
            >{{ dItem.value }}</el-link
          >
        </template>
        <template v-else-if="dItem.type === 'arrayInfo'">
          <div
            v-for="(childItem, childIndex) in dItem.value"
            :key="childIndex"
            class="array-info-class"
          >
            <div class="array-info-item">
              商品{{ childIndex + 1 }}： {{ childItem.name }}
            </div>
            <div class="array-info-item">
              版 本：
              <el-select
                v-if="childItem.versionOption"
                class="package-select"
                v-model="childItem.proVersion"
                placeholder=""
                size="mini"
                @change="packageVersionChange($event, childItem, childIndex)"
              >
                <el-option
                  v-for="item in childItem.versionOption"
                  :key="item.centerProductCode"
                  :label="item.proVersion"
                  :value="item.proVersion"
                >
                </el-option>
              </el-select>
            </div>
            <div class="array-info-item">
              商品码： {{ childItem.centerProductCode }}
            </div>
          </div>
        </template>
        <template v-else>
          <span>{{ dItem.value }}</span>
        </template>
      </el-form-item>
    </el-form>
    <div
      v-if="
        adjustDrawerData.type === 'notDone' &&
          isStaffId &&
          !adjustDrawerData.packagePower
      "
      class="adjust-drawer-button-box"
    >
      <el-button @click="adjustDrawerPass('reject')">拒 绝</el-button>
      <el-button type="primary" @click="adjustDrawerPass('pass')"
        >同 意</el-button
      >
    </div>
    <div
      v-if="adjustDrawerData.financeStatus === 'DECLINE'"
      class="adjust-drawer-button-box"
    >
      <el-button @click="rejectedDrawerPass('left')">
        {{ adjustDrawerData.leftButtonText }}
      </el-button>
      <el-button
        type="primary"
        v-show="adjustDrawerData.hasEdit"
        @click="rejectedDrawerPass('right')"
      >
        {{ adjustDrawerData.rightButtonText }}
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'adjustDrawer',
  props: {
    adjustDrawerData: {},
    isStaffId: {},
    is3d: { default: 0 },
    packagePower: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      adjustDrawerShow: false,
      reload: true,
      now: new Date().getTime(),
      originGoodsInfo: []
    }
  },
  methods: {
    adjustDrawerPass(data) {
      this.$emit('result', data, this.originGoodsInfo)
    },
    handleDrawerOpen() {
      this.adjustDrawerShow = true
    },
    handleDrawerClose() {
      this.adjustDrawerShow = false
    },
    reloadFun() {
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    },
    rejectedDrawerPass(data) {
      this.$emit('drawButtonEmit', data)
    },
    async initVersionList(list) {
      const versionData = await this.getVersionList(list[0].sup)
      if (!versionData) {
        return
      }
      for (
        let i = 0, len = this.adjustDrawerData.content.length;
        i < len;
        i++
      ) {
        const item = this.adjustDrawerData.content[i]
        if (item.label !== '商品信息') {
          continue
        }
        item.value.forEach((child) => {
          // 找每个商品有那些版本列表
          Object.keys(versionData).forEach((vKey) => {
            if (child.level.slice(1) === vKey.slice(5)) {
              child.versionOption = versionData[vKey]
              this.now = new Date().getTime()
            }
          })
          // 保存一份商品的原始数据，之后修改版本号的时候要用
          this.originGoodsInfo.push({
            oldCenterProductCode: child.centerProductCode,
            oldProVersion: child.proVersion
          })
        })
      }
      this.now = new Date().getTime()
    },
    getVersionList(sup) {
      return this.$http.Approval.getPackagesCourseMaterials(sup)
        .then((res) => {
          if (res.status !== 'OK') {
            return false
          }
          return res.payload
        })
        .catch(() => {
          return false
        })
    },
    packageVersionChange(val, item, index) {
      const selectItem = item.versionOption.find((child) => {
        return child.proVersion === val
      })
      item.proVersion = val
      item.centerProductCode = selectItem.centerProductCode
      this.originGoodsInfo[index].newProVersion = val
      this.originGoodsInfo[index].newCenterProductCode =
        selectItem.centerProductCode
      this.now = new Date().getTime()
    }
  }
}
</script>

<style lang="scss" scoped>
.adjust-drawer-class {
  margin-top: 50px;
  /deep/ .el-drawer__body {
    overflow: auto;
    .el-form-item {
      margin-bottom: 3px;
      .el-form-item__content {
        padding-left: 20px;
        word-wrap: break-word;
      }
    }
  }
  /deep/ .el-drawer__header span[role='heading']:focus {
    outline: 0;
  }
  .adjust-drawer-form {
    margin-bottom: 60px;
    .array-info-class {
      margin-bottom: 20px;
      .array-info-item {
        height: 20px;
        .package-select {
          width: 100px;
          /deep/ input {
            height: 21px;
            line-height: 21px;
          }
        }
      }
    }
  }
  .adjust-drawer-button-box {
    text-align: center;
    height: 60px;
    line-height: 60px;
    width: 100%;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .adjust-drawer-button-box {
    text-align: center;
    height: 60px;
    line-height: 60px;
    width: 100%;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
