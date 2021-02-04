export default ({ sendMessage, sendFriendMessage }) => {
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
    },
    {
      type: 'button', // 按钮
      label: '地址催发短信',
      click: sendMessage,
      attr: {
        // type: 'primary',
        plain: true,
        size: 'mini'
      }
    }
  ]
}
