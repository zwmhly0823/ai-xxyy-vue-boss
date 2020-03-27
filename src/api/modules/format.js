// 格式化物流订单详情数据 增加标题
export default function formatGetExpressDetailForAPP(data) {
  const newArr = []
  data.forEach((item) => {
    switch (item.status) {
      case '揽收':
        newArr.push({
          state: 1,
          name: '已揽收',
          context: item.context,
          time: item.time
        })
        break
      case '派件':
      case '在途':
        newArr.push({
          state: 2,
          name: '运输中',
          dataLists: {
            context: item.context,
            time: item.time
          }
        })
        break
      case '签收':
        newArr.push({
          state: 3,
          name: '已签收',
          context: item.context,
          time: item.time
        })
        break
      default:
        break
    }
  })

  const showArr = []
  newArr.forEach((item) => {
    if (item.state === 2) {
      showArr.push(item.dataLists)
    }
  })
  const res = newArr.filter((item) => item.state !== 2)
  if (showArr.length) {
    res.splice(res.indexOf(res.find((item) => item.state === 1)), 0, {
      state: 2,
      name: '运输中',
      context: showArr
    })
  }

  return res
}
