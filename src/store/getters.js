/*
 * @Descripttion:
 * @version:
 * @Author: ShenTong
 * @Date: 2020-04-11 16:06:42
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-27 22:19:41
 */
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  // token: (state) => state.user.token,
  // avatar: (state) => state.user.avatar,
  // name: (state) => state.user.name
  leftbar: (state) => state.leftbar.whackId,
  bransh: (state) => state.leftbar.bransh,
  typeStage: (state) => state.leftbar.typeStage,
  disableClick: (state) => state.leftbar.disableClick,
  team: (state) => state.team,
  tabbed: (state) => state.tabbed,
  teamItem: (state) => state.team.teamItem,
  token: (state) => '',
  avatar: (state) => 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',
  name: (state) => '',
  scheduleTeacherId: (state) => state.schedule.scheduleTeacherId,
  schedulePeriod: (state) => state.schedule.schedulePeriod
}
export default getters
