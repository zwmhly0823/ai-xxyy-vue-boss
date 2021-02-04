<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-25 16:09:21
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-25 17:33:37
-->
<template>
  <div>
    <template v-if="!row.user_label">
      <i
        class="el-icon-circle-plus-outline"
        @click="editSysTag(index, row.id)"
      ></i>
    </template>
    <template v-else>
      <div class="d-flex justify-between align-center tag-box">
        <el-popover
          placement="top-start"
          trigger="hover"
          @show="tagPopoverShow(row)"
        >
          <div
            v-if="!tagPopoverData"
            v-loading="true"
            style="width: 200px;height: 200px"
          ></div>
          <tags-popover
            ref="tagPopover"
            v-if="tagPopoverData"
            :tagPopoverData="tagPopoverData"
          ></tags-popover>
          <div slot="reference">
            <tags-item
              v-for="(item, index) in row.user_label.split(',')"
              :key="index"
              :text="item"
            ></tags-item>
          </div>
        </el-popover>
        <i class="el-icon-edit" @click="editSysTag(index, row.id)"></i>
      </div>
    </template>
  </div>
</template>

<script>
import tagsItem from '@/pages/music_app/views/users/components/trial/tags/TagsItem.vue'
import tagsPopover from '@/pages/music_app/views/users/components/trial/tags/TagsPopover.vue'
export default {
  components: {
    tagsItem,
    tagsPopover
  },
  props: {
    tagPopoverData: {
      type: Object,
      default: () => {}
    },
    row: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: null
    }
  },
  methods: {
    editSysTag(index, uid) {
      console.log(index, uid)
      this.$emit('edit-tag', index, uid)
    },
    tagPopoverShow(row) {
      this.$emit('show-tag', row)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ i {
  cursor: pointer;
}
.tag-box {
  .tags-more-text {
    font-size: 12px;
    color: #2a75ed;
  }
  /deep/ .tag-class {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.tag-box > span {
  width: 85%;
  line-height: initial;
  overflow: hidden;
}
.tag-box > span > div {
  white-space: nowrap;
  overflow: hidden;
  max-width: 92%;
}
</style>
