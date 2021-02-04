/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-28 19:52:26
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-29 18:18:35
 */
export default ({ sendFriendMessage, sendWechatMessage }) => {
  return [
    {
      type: 'button', // 按钮
      label: '加好友短信',
      click: sendFriendMessage,
      attr: {
        // type: 'primary',
        plain: true,
        size: 'mini'
      }
    }
  ]
}
