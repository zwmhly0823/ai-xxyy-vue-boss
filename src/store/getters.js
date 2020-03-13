const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  // token: (state) => state.user.token,
  // avatar: (state) => state.user.avatar,
  // name: (state) => state.user.name
  token: (state) => '',
  avatar: (state) =>
    'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=132227816,2615538666&fm=26&gp=0.jpg',
  name: (state) => '张三'
}
export default getters
