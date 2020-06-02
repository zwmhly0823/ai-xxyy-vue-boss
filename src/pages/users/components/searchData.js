const enums = {
  addedWechatStatus: [
    {
      id: 1,
      text: '已添加老师微信'
    },
    {
      id: 0,
      text: '未添加老师微信'
    }
  ],
  addedGroupStatus: [
    {
      id: 1,
      text: '已进群'
    },
    {
      id: 0,
      text: '未进群'
    }
  ],
  followWechatStatus: [
    {
      id: 1,
      text: '已关注'
    },
    {
      id: 0,
      text: '未关注'
    }
  ],
  joinCourseStatus: [
    {
      id: 1,
      text: '已参课'
    },
    {
      id: 0,
      text: '未参课'
    }
  ],
  completeCourseStatus: [
    {
      id: 1,
      text: '已完课'
    },
    {
      id: 0,
      text: '未完课'
    }
  ],
  courseTaskStatus: [
    {
      id: 1,
      text: '已上传作品'
    },
    {
      id: 0,
      text: '未上传作品'
    }
  ],
  // conversion_type 0 未转化 1 月课 2半年课 3 年课
  conversionStatus: [
    {
      id: 2,
      text: '已购半年系统课'
    },
    {
      id: 3,
      text: '已购年系统课'
    },
    {
      id: 0,
      text: '未转化'
    }
  ],
  conversionType: {
    0: '未转化',
    1: '已购月系统课',
    2: '已购半年系统课',
    3: '已购年系统课'
  },

  /**
   * 退费状态
   * 1: '已退费',
    2: '申请退费',
    3: '退费中'
   */
  refundStatus: [
    {
      id: 1,
      text: '已退费'
    },
    {
      id: 2,
      text: '申请退费'
    },
    {
      id: 3,
      text: '退费中'
    }
    // {
    //   id: 0,
    //   text: '未退费'
    // }
  ]
}

export default enums
