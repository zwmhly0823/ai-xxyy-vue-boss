/*
 * @Descripttion: 导出、下载excel文件操作
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-04 17:19:22
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-04 17:22:59
 */

export function downloadHandle(data, name = '下载', callback) {
  if (!data) return
  const blob = new Blob([data])
  const fileUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = fileUrl
  link.setAttribute('download', `${name}.xls`)

  document.body.appendChild(link)
  link.click()

  if (callback) callback()
}
