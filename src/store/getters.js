/*
 * @Descripttion:
 * @version:
 * @Author: ShenTong
 * @Date: 2020-04-11 16:06:42
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-16 15:26:58
 */
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  // token: (state) => state.user.token,
  // avatar: (state) => state.user.avatar,
  // name: (state) => state.user.name
  leftbar: (state) => state.leftbar.whackId,
  bransh: (state) => state.leftbar.bransh,
  disableClick: (state) => state.leftbar.disableClick,
  token: (state) => '',
  avatar: (state) => 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',
  name: (state) => ''
}
export default getters
