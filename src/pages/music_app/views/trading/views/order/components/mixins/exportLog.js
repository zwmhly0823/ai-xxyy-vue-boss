const entranceMixins = {
  data () {
    return {
      operatorObj: {
        accountType: 1,
        extra: '',
        operateType:"order_export"
      },
    }
  },
  created () {
    let staff = JSON.parse(localStorage.getItem('staff'))
    this.operatorObj.uid = staff.id
    this.operatorObj.loginName = staff.realName
  },
  methods: {
    initOperateExportLog(params) {
      this.$http.liveBroadcast.operateExportLog(params).then((res) => {}).catch((err) => {
        this.$message.error(err)
      })
    },
    
  }
};

export default entranceMixins;