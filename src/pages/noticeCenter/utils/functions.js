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
      hrefUrl = 'trading/#/'
      break
    case 5:
      hrefUrl = 'approval/#/'
      break
    default:
      hrefUrl = 'notice-center/#/'
  }
  // 目前只有单个搜索条件
  const searchQuery = val.split(':')
  localStorage.setItem('noticeParams', searchQuery)
  location.href = `${location.protocol}//${location.host}/${hrefUrl}`
}
