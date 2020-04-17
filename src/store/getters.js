/*
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 13:06:07
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-17 16:35:29
 */
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  // token: (state) => state.user.token,
  // avatar: (state) => state.user.avatar,
  // name: (state) => state.user.name
  leftbar: (state) => state.leftbar.whackId,
  bransh: (state) => state.leftbar.bransh,
  token: (state) => '',
  avatar: (state) => 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',
  name: (state) => '',
  scheduleTeacherId: (state) => state.schedule.scheduleTeacherId
}
export default getters
