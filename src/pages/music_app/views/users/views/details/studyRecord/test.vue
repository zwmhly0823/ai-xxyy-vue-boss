<template>
  <div class="posterMark">
    <van-loading size="24" type="spinner" v-show="!loading" />
    <canvas id="share-poster" v-show="loading" />
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'posterMark',
  props: [
    'codeImg',
    'headLogo',
    'posterText',
    'headPosition',
    'headName',
    'nowDate',
    'week',
    'posterUrl',
    'posterlogo'
  ],
  data() {
    return {
      bg: '',
      loading: false
    }
  },
  components: {},
  created() {},
  computed: {
    date() {
      let date = this.nowDate + '  ' + this.week
      return date
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.cerateCanvas()
    })
  },
  methods: {
    test() {
      const pro = new Promise((resolve, reject) => {
        const posterlogo = new Image()
        posterlogo.src =
          'http://s1.meixiu.mobi/write/android-images/2020-12-09/49548465bec24d6798c272765773a3c5.jpeg'
        posterlogo.setAttribute('crossOrigin', '*')
        return (posterlogo.onload = () => {
          console.log('pro----resolve.onload')
          resolve()
        })
      })

      const test2 = new Image()
      test2.src =
        'http://s1.meixiu.mobi/android-images/2020-12-26/afbf0d78e462464e934c744c2290804f.png'
      test2.setAttribute('crossOrigin', '*')

      const pro2 = new Promise((resolve, reject) => {
        return (test2.onload = () => {
          console.log('pro2----resolve.onload')
          resolve()
        })
      })

      Promise.all([pro, pro2]).then((res) => {
        console.log('--进入promise--------', res)
        // let strDataURI = canvas.toDataURL('image/png')
        // ctx.getImageData(10, 10, 30, 30)
        // console.log('111')
      })
    },
    setSize(rex) {
      let ww = document.documentElement.clientWidth
      //   let hh = document.documentElement.clientHeight
      return (rex / 750) * ww
    },

    getPixelRatio(context) {
      var backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1
      return (window.devicePixelRatio || 1) / backingStore
    },

    async cerateCanvas() {
      let that = this
      let canvas = document.getElementById('share-poster')
      let ctx = canvas.getContext('2d')
      let _canvas = document.querySelector('.posterMark')
      let w = parseInt(window.getComputedStyle(_canvas).width)
      let h = parseInt(window.getComputedStyle(_canvas).height)

      let ratio = this.getPixelRatio(ctx)
      canvas.width = w * ratio
      canvas.height = h * ratio
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'

      ctx.scale(ratio, ratio)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, that.setSize(570), that.setSize(990))
      ctx.beginPath()

      // 日期
      ctx.font = '20px SourceHanSerifCN-Regular, SourceHanSerifCN'
      ctx.fillStyle = '#333333'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(that.date, that.setSize(285), that.setSize(625))

      // 描述
      ctx.font = '14px PingFangSC-Regular, PingFang SC'
      ctx.fillStyle = '#333333'
      let shopStoreName = that.posterText
      const shopStoreNameT = this.checkTwoText(
        ctx,
        shopStoreName,
        this.setSize(500)
      )
      console.log(shopStoreNameT, 'shopStoreNameT')
      shopStoreNameT.forEach((item, index) => {
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(
          item,
          that.setSize(285),
          this.setSize(700) +
            index * this.setSize(40) +
            (shopStoreNameT.length === 1 ? this.setSize(20) : 0)
        )
      })

      // 名片信息
      ctx.fillStyle = '#fbfbfb'
      ctx.fillRect(0, that.setSize(790), that.setSize(570), that.setSize(200))

      ctx.font = '16px Arial'
      ctx.fillStyle = '#222222'
      ctx.textAlign = 'left'
      let headName = that.headName
      ctx.fillText(headName, that.setSize(150), that.setSize(870))

      ctx.font = '12px Arial'
      ctx.fillStyle = '#000000'
      let headPosition = that.headPosition
      ctx.fillText(headPosition, that.setSize(150), that.setSize(915))

      // 公司logo
      let posterlogo = new Image()
      posterlogo.src = that.posterlogo
      posterlogo.setAttribute('crossOrigin', '*')

      console.log(posterlogo, '公司logo')
      const pro = new Promise((resolve, reject) => {
        posterlogo.onload = () => {
          ctx.drawImage(posterlogo, 0, 0, that.setSize(570), that.setSize(148))
          ctx.save()
          resolve()
        }
      })

      // 海报内容
      let posterUrl = new Image()
      posterUrl.src = that.posterUrl
      posterUrl.setAttribute('crossOrigin', '*')

      console.log(posterUrl, '海报图片')
      const posterUrlPro = new Promise((resolve, reject) => {
        posterUrl.onload = () => {
          ctx.drawImage(
            posterUrl,
            0,
            that.setSize(148),
            that.setSize(570),
            that.setSize(406)
          )
          ctx.save()
          resolve()
        }
      })
      // 名片头像
      let headLogo = new Image()
      headLogo.src = that.headLogo
      headLogo.setAttribute('crossOrigin', '*')

      console.log(headLogo, '名片头像')
      const headLogox = new Promise((resolve, reject) => {
        headLogo.onload = () => {
          ctx.save()
          ctx.beginPath()
          ctx.arc(
            that.setSize(80),
            that.setSize(890),
            that.setSize(100) / 2,
            0,
            2 * Math.PI
          )
          ctx.fill()
          ctx.clip()
          ctx.drawImage(
            headLogo,
            that.setSize(30),
            that.setSize(840),
            that.setSize(100),
            that.setSize(100)
          )
          ctx.restore()
          resolve()
        }
      })
      // 二维码
      let codeImg = new Image()
      codeImg.src = that.codeImg
      codeImg.setAttribute('crossOrigin', '*')

      console.log(codeImg, '二维码')
      const codeImgPro = new Promise((resolve, reject) => {
        codeImg.onload = () => {
          console.log('进入onload')
          ctx.drawImage(
            codeImg,
            that.setSize(400),
            that.setSize(820),
            that.setSize(137),
            that.setSize(137)
          )
          ctx.save()
          resolve()
        }
      })

      Promise.all([posterUrlPro, pro, headLogox, codeImgPro]).then(() => {
        console.log('--进入promise')
        // let strDataURI = canvas.toDataURL('image/png')
        // ctx.getImageData(10, 10, 30, 30)
        // console.log('111')
        var strDataURI
        try {
          // 将canvas对象转化为image/png
          strDataURI = canvas.toDataURL('image/png')
        } catch (err) {
          console.log(err, '--')
        }
        that.$emit('uploadImg', strDataURI)
        that.loading = true
      })

      // posterUrlPro.then(res => {
      //   pro.then(w => {
      //     headLogox.then(x => {
      //       codeImgPro.then(y => {
      //         that.loading = true
      //         let strDataURI = canvas.toDataURL()
      //         that.$emit('uploadImg', strDataURI)
      //       })
      //     })
      //   })
      // })
    },
    // 绘制两行文字
    checkTwoText(ctx, shopText, shopTextWidth) {
      let shopTitle = ''
      let newArr = []
      if (shopText) {
        let shopTextArr = shopText.split('')
        for (let index = 0; index < shopTextArr.length; index++) {
          shopTitle += shopTextArr[index]
          if (ctx.measureText(shopTitle).width >= shopTextWidth) {
            newArr.push(shopTitle)
            shopTitle = ''
          }
        }
        if (newArr.length > 2 || (shopTitle.length && newArr.length === 2)) {
          const str = newArr[1]
          newArr[1] = str.substr(0, str.length - 1) + '...'
          return [newArr[0], newArr[1]]
        }
        shopTitle.length && newArr.push(shopTitle)
      }
      return newArr
    }
  }
}
</script>
<style lang="scss" scoped>
.posterMark {
  width: 570px;
  height: 990px;
  position: fixed;
  left: 90px;
  top: 100px;
  background: rgba(0, 0, 0, 0.8);
  overflow: hidden;
}
.share-poster {
  // width: 570px;
  // height: 990px;
}
</style>
