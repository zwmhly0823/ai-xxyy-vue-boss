/*
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2019-12-26 17:13:38
 * @Last Modified by: YangJiyong
 * @Last Modified time: 2020-04-30 20:17:30
 * @Description: (顶部)模块导航 map - 显示对应名称
 * 如果 `src/pages/`下的模板名称是 小骆峰 ，link改为 中线 - 连接
 * TODO: 动态设置
 */

const menuItems = [{
        link: 'user',
        text: '用户',
        isShow: true
    },
    {
        link: 'trading',
        text: '交易中心',
        isShow: true
    },
    {
        link: 'finance',
        text: '财务',
        isShow: true
    },
    {
        link: 'student-team',
        text: '班级中心',
        isShow: true
    },
    {
        link: 'users',
        text: '学员中心',
        isShow: true
    },
    {
        link: 'teacher',
        text: '社群销售',
        isShow: true
    },
    {
        link: 'operating',
        text: '运营中心',
        isShow: true
    },
    {
        link: 'approval',
        text: '审批中心',
        isShow: true
    },
    {
        link: 'finance',
        text: '财务',
        isShow: true
    },
    {
        link: 'statistics',
        text: '数据中心',
        isShow: true
    },
    {
        link: 'dashboard',
        text: 'Dashboard',
        isShow: false
    },
    {
        link: 'login',
        text: '登录',
        isShow: false
    },
    {
        link: 'notice-center',
        text: '通知中心',
        isShow: false
    },
    {
        link: 'express',
        text: '物流中心',
        isShow: true
    },
    {
        link: 'community',
        text: '社群工具',
        isShow: true
    },
    {
        link: 'outbound',
        text: '呼叫中心',
        isShow: true
    },
    {
        link: 'marketing',
        text: '营销中心',
        isShow: true
    },
    {
        link: 'write_app',
        text: '美术宝写字',
        isShow: false
    }
]

// 获取菜单名称 @link: 模块链接或名称
function getMenuText(link) {
    if (!link) return ''
    const menu = menuItems.filter((item) => item.link === link)
    return menu[0] ? menu[0].text : ''
}

module.exports = { getMenuText, menuItems }