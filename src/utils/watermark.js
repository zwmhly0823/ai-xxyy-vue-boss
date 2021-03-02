/*
 * @Descripttion: 添加水印
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-25 17:54:11
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-25 20:54:13
 * 需要加水印的元素国 .with-watermark
 */
export default {
  addWaterMark(info = '') {
    // 需要显示的信息 默认当前用户名称+id: 张三_29802
    const staff = localStorage.getItem('staff')
    const staffInfo = JSON.parse(staff || '{}')
    const { realName, userName, id } = staffInfo
    // 针对测试环境id大于5位的，取后5位
    const tid =
      (id && (id.length > 5 ? id.substring(id.length - 5, id.length) : id)) ||
      ''
    const msg = info || `${realName || userName}_${tid}`
    const ctx = document.createElement('canvas')
    ctx.width = 250
    ctx.height = 100
    ctx.style.display = 'none'
    const cans = ctx.getContext('2d')
    cans.rotate((-20 * Math.PI) / 180)
    cans.font = '12px Microsoft YaHei'
    cans.fillStyle = 'rgba(17, 17, 17, 0.1)'
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.zIndex = '9999'
    // 文字换行
    cans.fillText('小熊音乐', 0, 50)
    cans.fillText(msg, 0, 70)
    cans.save()
    const imgSrc = ctx.toDataURL()
    const style = document.createElement('style')
    style.innerHTML = `.with-watermark:before{
        content: "";
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        z-index: 9999;
        pointer-events: none;
        background-image: url("${imgSrc}");
    }`
    ;(document.head.append || document.head.appendChild).apply(document.head, [
      style
    ])
  }
}
