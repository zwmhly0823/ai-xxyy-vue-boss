<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-23 18:09:12
-->
<template>
  <div class="emoji-container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="emoji-list">
        <div
          class="emoji-item"
          v-for="(emoji, index) in emojiData"
          :key="index"
          @click="emojiClickHandle(emoji)"
        >
          <!-- <img :src="require(`@/assets/images/emoji/${emoji}.png`)" alt="" /> -->
          <img
            :src="require(`${OSSCONFIG.OSS_IMG_BASE_URL_2}/emoji/${emoji}.png`)"
            alt=""
          />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import OSSCONFIG from '@/utils/contants'

export default {
  props: {},
  data() {
    return {
      OSSCONFIG,
      emojiData: [
        '微笑',
        '撇嘴',
        '色',
        '发呆',
        '得意',
        '流泪',
        '害羞',
        '闭嘴',
        '睡',
        '大哭',
        '尴尬',
        '发怒',
        '调皮',
        '呲牙',
        '惊讶',
        '难过',
        '囧',
        '抓狂',
        '吐',
        '偷笑',
        '愉快',
        '白眼',
        '傲慢',
        '困',
        '惊恐',
        '流汗',
        '憨笑',
        '悠闲',
        '奋斗',
        '咒骂',
        '疑问',
        '嘘',
        '晕',
        '衰',
        '骷髅',
        '敲打',
        '再见',
        '擦汗',
        '抠鼻',
        '鼓掌',
        '坏笑',
        '左哼哼',
        '右哼哼',
        '哈欠',
        '鄙视',
        '委屈',
        '快哭了',
        '阴险',
        '亲亲',
        '可怜',
        '菜刀',
        '西瓜',
        '啤酒',
        '咖啡',
        '猪头',
        '玫瑰',
        '凋谢',
        '嘴唇',
        '爱心',
        '心碎',
        '蛋糕',
        '炸弹',
        '便便',
        '月亮',
        '太阳',
        '拥抱',
        '强',
        '弱',
        '握手',
        '胜利',
        '抱拳',
        '勾引',
        '拳头',
        'OK',
        '跳跳',
        '发抖',
        '怄火',
        '转圈',
        '高兴',
        '口罩',
        '笑哭',
        '吐舌头',
        '傻呆',
        '恐惧',
        '悲伤',
        '不屑',
        '嘿哈',
        '捂脸',
        '奸笑',
        '机智',
        '皱眉',
        '耶',
        '鬼脸',
        '合十',
        '加油',
        '庆祝',
        '礼物',
        '红包',
        '鸡'
      ],
      symbolEmoji: {
        高兴: '😁',
        口罩: '😷',
        庆祝: '🎉',
        笑哭: '😂',
        吐舌头: '😝',
        傻呆: '😳',
        恐惧: '😱',
        悲伤: '😔',
        不屑: '😒',
        鬼脸: '👻',
        合十: '🙏'
      }
    }
  },
  components: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    emojiClickHandle(emoji) {
      this.$emit('selectedEmoji', this.symbolEmoji[emoji] || `[${emoji}]`)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-scrollbar__wrap {
  overflow-x: auto;
}
.emoji-container {
  height: 300px;
  .el-scrollbar__wrap.default-scrollbar__wrap {
    overflow-x: auto;
  }
  .el-scrollbar {
    height: 100%;
  }
  .emoji-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .emoji-item {
      width: 30px;
      height: 30px;
      padding: 3px;
      cursor: pointer;
      //   margin-right: 3px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
