export function noticeLinkTo(type, val) {
  let hrefUrl = ''
  switch (+type) {
    case 3:
      // 课前提醒
      // 本期仅涉及体验课
      hrefUrl = 'users/#/trial'
      break
    case 4:
      // 订单
      hrefUrl = 'trading/#/order'
      break
    case 5:
      hrefUrl = 'approval/#/approvalCenter'
      break
    default:
      hrefUrl = 'notice-center/#/noticeHome'
  }
  // 目前只有单个搜索条件
  const searchQuery = val.split(':')
  localStorage.setItem('noticeParams', searchQuery)
  // 测试环境url多了点东西
  let testUrlAppend = ''
  if (location.hostname.split('.')[0] === 'test') {
    testUrlAppend = 'ai-app-vue-boss-test/'
  }
  // 如果已经在目标页面就刷新
  const targetHref = `${location.protocol}//${location.host}/${testUrlAppend}${hrefUrl}`
  if (location.href === targetHref) {
    location.reload()
  } else {
    location.href = targetHref
  }
}
