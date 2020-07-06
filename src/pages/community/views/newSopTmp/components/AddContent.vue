<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-06 19:04:54
-->
<template>
  <el-dialog
    :title="isEdit ? '编辑内容' : '添加内容'"
    :visible.sync="centerDialog"
    width="60%"
    top="20vh"
    :center="!content.isEdit"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    custom-class="dialog-custom"
  >
    <div class="dialog-center" :class="{ shaky: isShaky }">
      <div class="tabs">
        <div
          class="tab"
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{ active: index === tabIndex }"
          @click="topTabClick(index)"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.title }}</span>
        </div>
        <!-- <svg class="iconfont iconemoji"></svg> -->
        <div class="emoji" v-if="!tabIndex">
          <i
            class="el-icon-burger"
            @click="changeEmojiToggle = !changeEmojiToggle"
          ></i>

          <div class="emoji-list" v-if="changeEmojiToggle">
            <el-scrollbar wrap-class="scrollbar-wrapper">
              <a
                href="javascript:void(0);"
                @click="getEmo(index)"
                v-for="(item, index) in faceList"
                :key="index"
                class="emotionItem"
                >{{ item }}</a
              >
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="edit-content">
        <div
          class="text-ctent"
          v-if="!tabIndex"
          @click="changeEmojiToggle = false"
        >
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="addContentForm.textarea"
            id="textarea"
          >
          </el-input>
        </div>
        <div class="img-ctent" v-else>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="uploadHandle"
            :on-remove="handleRemove"
          >
            <img
              v-if="addContentForm.imgUrl"
              :src="addContentForm.imgUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        @click="dialogOperate('submit')"
        :type="isEdit ? 'primary' : ''"
        size="mini"
        >提交</el-button
      >
      <el-button
        type="primary"
        @click="dialogOperate('continue')"
        size="mini"
        v-if="!isEdit"
        >提交并继续添加</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { debounce } from 'lodash'
// import uploadFile from '@/utils/upload' // 上传公共方法 TODO:
const appData = require('@/utils/emoji.json')
export default {
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      addContentForm: {
        imgUrl: '',
        textarea: ''
      },
      faceList: [],
      isEdit: false,
      changeEmojiToggle: false,
      tabIndex: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      isShaky: false,
      disabled: false,
      tabs: [
        {
          icon: 'el-icon-edit-outline',
          title: '文本'
        },
        {
          icon: 'el-icon-picture-outline',
          title: '图片'
        }
      ]
    }
  },
  components: {},
  computed: {
    centerDialog() {
      return this.centerDialogVisible
    }
  },
  created() {
    const { msgType = '1', msgContent = '', isEdit = false } = this.content
    this.isEdit = isEdit
    // console.log(msgType, 'msgType')
    if (msgType === '1') {
      this.addContentForm.textarea = msgContent
    } else {
      this.tabIndex = 1
      this.addContentForm.imgUrl = msgContent
    }
    console.log(this.content, 'props')
  },
  mounted() {
    for (const i in appData) {
      this.faceList.push(appData[i].char)
    }
  },
  methods: {
    /** 此处不可使用箭头函数 */
    topTabClick: debounce(function(index) {
      this.tabIndex = index
      // 图片格式
      if (index) {
        this.changeEmojiToggle = false
      }
    }, 300),
    /** img-upload */
    // 上传附件
    uploadHandle(file) {
      this.addContentForm.imgUrl =
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      // TODO:
      console.log(file, this.addContentForm.imgUrl)
      //   uploadFile(file).then((res) => {
      //     console.log('res', res)
      //     this.addContentForm.imgUrl // 取来图片remote地址
      //   })
    },
    handleRemove(file) {
      this.addContentForm.imgUrl = ''
    },
    handlePictureCardPreview(imgUrl) {
      this.dialogImageUrl = imgUrl
      this.dialogVisible = true
    },
    /** img-upload */
    dialogClose() {
      this.$emit('dialogOperate', { close: true })
    },
    /** 新增内容底部按钮操作 */
    dialogOperate(type) {
      if (!this.validateAddForn()) {
        this.isShaky = true
        setTimeout(() => {
          this.isShaky = false
        }, 250)
      } else {
        const { isEdit = false, curIndex = 0 } = this.content
        console.log('this.addContentForm', this.addContentForm)
        this.$emit('dialogOperate', {
          ...this.addContentForm,
          msgType: !this.tabIndex ? '1' : '3',
          close: type !== 'continue',
          closeOnly: false,
          isEdit,
          curIndex
        })
      }
    },
    /** 验证新增内容的信息 */
    validateAddForn() {
      if (!this.tabIndex) {
        // 文本模式
        return Boolean(this.addContentForm.textarea)
      } else {
        return Boolean(this.addContentForm.imgUrl)
      }
    },
    getEmo(index) {
      var textArea = document.getElementById('textarea')
      function changeSelectedText(obj, chart) {
        const str = `${chart} `
        if (window.getSelection) {
          // 非IE浏览器
          textArea.setRangeText(str)
          // 在未选中文本的情况下，重新设置光标位置
          textArea.selectionStart += str.length
          textArea.focus()
        } else if (document.selection) {
          // IE浏览器
          obj.focus()
          var sel = document.selection.createRange()
          sel.text = str
        }
      }
      changeSelectedText(textArea, this.faceList[index])
      this.addContentForm.textarea = textArea.value // 要同步data中的数据
    }
  }
}
</script>
<style>
.el-scrollbar__wrap {
  overflow-x: auto;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #2a75ed;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-center {
  border: 1px solid #ebeef3;
  border-radius: 5px;
  .tabs {
    display: flex;
    height: 30px;
    align-items: center;
    position: relative;
    .tab {
      display: flex;
      align-items: center;
      width: 70px;
      height: 100%;
      background: #f2f4f7;
      justify-content: center;
      cursor: pointer;
      span {
        margin-left: 5px;
      }
      &:first-child {
        border-radius: 5px 0 0 0;
      }
      &.active {
        background: #fff;
        color: #2a75ed;
      }
    }
    .emoji {
      position: absolute;
      right: 15px;
      height: 100%;
      display: flex;
      align-items: center;
      i {
        cursor: pointer;
      }
      .emoji-list {
        border: 1px solid #eee;
        width: 310px;
        height: 200px;
        position: absolute;
        right: 0;
        top: 20px;
        z-index: 9;
        background: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        padding: 5px;
        // overflow-y: scroll;
        box-sizing: border-box;
        .el-scrollbar__wrap.default-scrollbar__wrap {
          overflow-x: auto;
        }
        .el-scrollbar {
          //   flex: 1;
          height: 100%;
          //   overflow-x: hidden;
        }
        a {
          //   padding: 5px;
          margin: 5px;
          display: inline-block;
        }
      }
    }
  }
  .edit-content {
    padding: 15px;
    min-height: 180px;
  }
}
.dialog-footer {
  &.is-edit {
  }
}
.shaky {
  -webkit-transform-origin: center center;
  -ms-transform-origin: center center;
  transform-origin: center center;
  -webkit-animation-name: shaky-slow;
  -ms-animation-name: shaky-slow;
  animation-name: shaky-slow;
  -webkit-animation-duration: 2s;
  -ms-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-timing-function: ease-in-out;
  -ms-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-animation-delay: 0s;
  -ms-animation-delay: 0s;
  animation-delay: 0s;
  -webkit-animation-play-state: running;
  -ms-animation-play-state: running;
  animation-play-state: running;
  &.dialog-center {
    border-color: #e4393c;
    box-shadow: 0 2px 12px 0 rgba(255, 255, 0, 0.1);
  }
}
@-webkit-keyframes shaky-slow {
  0% {
    -webkit-transform: translate(0px, 0px) rotate(0deg);
  }
  2% {
    -webkit-transform: translate(-1px, 1.5px) rotate(1.5deg);
  }
  4% {
    -webkit-transform: translate(1.3px, 0px) rotate(-0.5deg);
  }
  6% {
    -webkit-transform: translate(1.4px, 1.4px) rotate(-2deg);
  }
  8% {
    -webkit-transform: translate(-1.3px, -1px) rotate(-1.5deg);
  }
  10% {
    -webkit-transform: translate(1.4px, 0px) rotate(-2deg);
  }
  12% {
    -webkit-transform: translate(-1.3px, -1px) rotate(-2deg);
  }
  14% {
    -webkit-transform: translate(1.5px, 1.3px) rotate(1.5deg);
  }
  16% {
    -webkit-transform: translate(1.5px, -1.5px) rotate(-1.5deg);
  }
  18% {
    -webkit-transform: translate(1.3px, -1.3px) rotate(-2deg);
  }
  20% {
    -webkit-transform: translate(1px, 1px) rotate(-0.5deg);
  }
  22% {
    -webkit-transform: translate(1.3px, 1.5px) rotate(-2deg);
  }
  24% {
    -webkit-transform: translate(-1.4px, -1px) rotate(2deg);
  }
  26% {
    -webkit-transform: translate(1.3px, -1.3px) rotate(0.5deg);
  }
  28% {
    -webkit-transform: translate(1.6px, -1.6px) rotate(-2deg);
  }
  30% {
    -webkit-transform: translate(-1.3px, -1.3px) rotate(-1.5deg);
  }
  32% {
    -webkit-transform: translate(-1px, 0px) rotate(2deg);
  }
  34% {
    -webkit-transform: translate(1.3px, 1.3px) rotate(-0.5deg);
  }
  36% {
    -webkit-transform: translate(1.3px, 1.6px) rotate(1.5deg);
  }
  38% {
    -webkit-transform: translate(1.3px, -1.6px) rotate(1.5deg);
  }
  40% {
    -webkit-transform: translate(-1.4px, -1px) rotate(-0.5deg);
  }
  42% {
    -webkit-transform: translate(-1.4px, 1.3px) rotate(-0.5deg);
  }
  44% {
    -webkit-transform: translate(-1.6px, 1.4px) rotate(0.5deg);
  }
  46% {
    -webkit-transform: translate(-2.1px, -1.3px) rotate(-0.5deg);
  }
  48% {
    -webkit-transform: translate(1px, 1.6px) rotate(1.5deg);
  }
  50% {
    -webkit-transform: translate(1.6px, 1.6px) rotate(1.5deg);
  }
  52% {
    -webkit-transform: translate(-1.4px, 1.6px) rotate(0.5deg);
  }
  54% {
    -webkit-transform: translate(1.6px, -1px) rotate(-2deg);
  }
  56% {
    -webkit-transform: translate(1.3px, -1.6px) rotate(-2deg);
  }
  58% {
    -webkit-transform: translate(-1.3px, -1.6px) rotate(0.5deg);
  }
  60% {
    -webkit-transform: translate(1.3px, 1.6px) rotate(-0.5deg);
  }
  62% {
    -webkit-transform: translate(0px, 0px) rotate(-1.5deg);
  }
  64% {
    -webkit-transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  66% {
    -webkit-transform: translate(1.6px, -1.6px) rotate(0.5deg);
  }
  68% {
    -webkit-transform: translate(0px, -1.6px) rotate(-2deg);
  }
  70% {
    -webkit-transform: translate(-1.6px, 1px) rotate(1.5deg);
  }
  72% {
    -webkit-transform: translate(-1.6px, 1.6px) rotate(2deg);
  }
  74% {
    -webkit-transform: translate(1.3px, -1.6px) rotate(-0.5deg);
  }
  76% {
    -webkit-transform: translate(1.4px, 1px) rotate(-0.5deg);
  }
  78% {
    -webkit-transform: translate(-1px, 1.4px) rotate(2deg);
  }
  80% {
    -webkit-transform: translate(1.4px, 1.6px) rotate(2deg);
  }
  82% {
    -webkit-transform: translate(-1.6px, -1.6px) rotate(-0.5deg);
  }
  84% {
    -webkit-transform: translate(-1.4px, 1.4px) rotate(-2deg);
  }
  86% {
    -webkit-transform: translate(1px, 1.4px) rotate(-2deg);
  }
  88% {
    -webkit-transform: translate(-1.4px, 1.4px) rotate(-1.5deg);
  }
  90% {
    -webkit-transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  92% {
    -webkit-transform: translate(-1.6px, 1.6px) rotate(2deg);
  }
  94% {
    -webkit-transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  96% {
    -webkit-transform: translate(-1.4px, 1.3px) rotate(-2deg);
  }
  98% {
    -webkit-transform: translate(1.3px, 1px) rotate(-0.5deg);
  }
}
@keyframes shaky-slow {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  2% {
    transform: translate(-1px, 1.5px) rotate(1.5deg);
  }
  4% {
    transform: translate(1.3px, 0px) rotate(-0.5deg);
  }
  6% {
    transform: translate(1.4px, 1.4px) rotate(-2deg);
  }
  8% {
    transform: translate(-1.3px, -1px) rotate(-1.5deg);
  }
  10% {
    transform: translate(1.4px, 0px) rotate(-2deg);
  }
  12% {
    transform: translate(-1.3px, -1px) rotate(-2deg);
  }
  14% {
    transform: translate(1.5px, 1.3px) rotate(1.5deg);
  }
  16% {
    transform: translate(1.5px, -1.5px) rotate(-1.5deg);
  }
  18% {
    transform: translate(1.3px, -1.3px) rotate(-2deg);
  }
  20% {
    transform: translate(1px, 1px) rotate(-0.5deg);
  }
  22% {
    transform: translate(1.3px, 1.5px) rotate(-2deg);
  }
  24% {
    transform: translate(-1.4px, -1px) rotate(2deg);
  }
  26% {
    transform: translate(1.3px, -1.3px) rotate(0.5deg);
  }
  28% {
    transform: translate(1.6px, -1.6px) rotate(-1.5deg);
  }
  30% {
    transform: translate(-1.3px, -1.3px) rotate(-1.5deg);
  }
  32% {
    transform: translate(-1px, 0px) rotate(2deg);
  }
  34% {
    transform: translate(1.3px, 1.3px) rotate(-0.5deg);
  }
  36% {
    transform: translate(1.3px, 1.6px) rotate(1.5deg);
  }
  38% {
    transform: translate(1.3px, -1.6px) rotate(1.5deg);
  }
  40% {
    transform: translate(-1.4px, -1px) rotate(-0.5deg);
  }
  42% {
    transform: translate(-1.4px, 1.3px) rotate(-0.5deg);
  }
  44% {
    transform: translate(-1.6px, 1.4px) rotate(0.5deg);
  }
  46% {
    transform: translate(-2.1px, -1.3px) rotate(-0.5deg);
  }
  48% {
    transform: translate(1px, 1.6px) rotate(1.5deg);
  }
  50% {
    transform: translate(1.6px, 1.6px) rotate(1.5deg);
  }
  52% {
    transform: translate(-1.4px, 1.6px) rotate(0.5deg);
  }
  54% {
    transform: translate(1.6px, -1px) rotate(-2deg);
  }
  56% {
    transform: translate(1.3px, -1.6px) rotate(-2deg);
  }
  58% {
    transform: translate(-1.3px, -1.6px) rotate(0.5deg);
  }
  60% {
    transform: translate(1.3px, 1.6px) rotate(-0.5deg);
  }
  62% {
    transform: translate(0px, 0px) rotate(-1.5deg);
  }
  64% {
    transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  66% {
    transform: translate(1.6px, -1.6px) rotate(0.5deg);
  }
  68% {
    transform: translate(0px, -1.6px) rotate(-2deg);
  }
  70% {
    transform: translate(-1.6px, 1px) rotate(1.5deg);
  }
  72% {
    transform: translate(-1.6px, 1.6px) rotate(2deg);
  }
  74% {
    transform: translate(1.3px, -1.6px) rotate(-0.5deg);
  }
  76% {
    transform: translate(1.4px, 1px) rotate(-0.5deg);
  }
  78% {
    transform: translate(-1px, 1.4px) rotate(2deg);
  }
  80% {
    transform: translate(1.4px, 1.6px) rotate(2deg);
  }
  82% {
    transform: translate(-1.6px, -1.6px) rotate(-0.5deg);
  }
  84% {
    transform: translate(-1.4px, 1.4px) rotate(-2deg);
  }
  86% {
    transform: translate(1px, 1.4px) rotate(-2deg);
  }
  88% {
    transform: translate(-1.4px, 1.4px) rotate(-1.5deg);
  }
  90% {
    transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  92% {
    transform: translate(-1.4px, 1.6px) rotate(2deg);
  }
  94% {
    transform: translate(-1.6px, -1.6px) rotate(-2deg);
  }
  96% {
    transform: translate(-1.4px, 1.3px) rotate(-2deg);
  }
  98% {
    transform: translate(1.3px, 1px) rotate(-0.5deg);
  }
}
</style>
