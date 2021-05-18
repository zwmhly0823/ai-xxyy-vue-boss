import TableSearch from '../components/tableSearch'
import TableList from '../components/tableList'
import PeriodDialog from '../components/dialog/newEditPeriod'
import { mapGetters } from 'vuex'
import UploadExcel from '@/pages/music_app/views/operating/components/uploadExcel' // 上传excel文件
import axios from '@/api/axiosConfig'
import { Sup_scheduleIndex} from '@/utils/supList'
const courseTypeEnum = {
  0: 'TESTCOURSE', // 双周
  1: 'SYSTEMCOURSE', // 系统课
  2: 'TESTCOURSE_SINGLE', //单周
}
export default {
  components: { TableSearch, TableList, PeriodDialog, UploadExcel },
  data() {
    return {
      channelList: [],
      channelClassList: [],
      // 渠道三级列表展示数据
      showDatas: [],
      // 新增、编辑失败渠道
      failChannelData: [],

      // table 数据加载状态
      flags: {
        loading: false
      },
      tabQuery: {
        size: 20,
        page: 1
      },
      // 筛选条件参数
      queryParams: {
        channelIds: [],
        periods: [],
        channelId: ''
      },
      // 总页数
      total: 1,
      // 表格数据
      tableData: [],
      // 新增、编辑渠道状态
      channelModal: false,
      // 渠道新增、编辑失败 内层dialog
      channelInnerModal: false,
      // 课程类型
      courseType: 0,
      // 编辑当前的渠道期信息
      curPeriodInfo: {},
      // 导入数据
      showUploadExcel: false,
      // 上传excel文件种类
      uploadCategory: ''
    }
  },

  async created() {
    const { courseType } = this.$route.params
    this.courseType = Sup_scheduleIndex[courseType]
    await this.getChannel()
    await this.getChannelClassList()
    this.formatData(this.channelList, this.channelClassList)
    this.getTrialOperPeroid()
  },

  computed: {
    ...mapGetters(['subjects'])
  },

  methods: {
    // 批量配置、修改
    exportExcel(type) {
      this.uploadCategory = type
      this.showUploadExcel = true
    },
    // 获取渠道来源 filter: 过滤关键词  eg：filter:"抖音"
    async getChannel() {
      const subject = { subject: this.$store.getters.subjects.subjectCode }
      await axios
        .post('/graphql/v1/toss', {
          query: `{
            ChannelAllList(query:${JSON.stringify(JSON.stringify(subject))}) {
                id
                channel_class_id
                channel_outer_name
              }
            }
          `
        })
        .then((res) => {
          this.channelList = res.data.ChannelAllList
        })
    },

    // 获取渠道来源分类 filter: 过滤关键词  eg：filter:"抖音"
    async getChannelClassList() {
      const res = await this.$http.Operating.getChannelClassList()
      this.channelClassList = res?.data?.ChannelClassList || []
    },

    // 处理渠道三级数据
    formatData(classdata, classifiData) {
      // 第一级目录
      const arrList = []
      classifiData.forEach((item) => {
        item.channel_outer_name = item.channel_class_name
      })
      const firstNode =
        classifiData &&
        classifiData.filter((item) => {
          if (+item.channel_class_parent_id !== 0) {
            arrList.push(item)
          }
          return +item.channel_class_parent_id === 0
        })

      firstNode.forEach((item) => (item.children = []))
      arrList.forEach((item, index) => {
        firstNode.forEach((val, idx) => {
          if (+item.channel_class_parent_id === +val.id) {
            val.children.push(item)
          }
        })
      })
      firstNode.forEach(
        (item) =>
          item.children && item.children.forEach((vals) => (vals.children = []))
      )

      classdata.forEach((content, num) => {
        arrList.forEach((datas, nums) => {
          if (+content.channel_class_id === +datas.id) {
            datas.children.push(content)
          }
        })
      })

      const result = firstNode.map((item) => {
        if (item.children && item.children.length === 0) {
          item.children = null
        }
        if (item.children) {
          item.children.forEach((sub) => {
            if (sub.children && sub.children.length === 0) sub.children = null
          })
        }
        return item
      })

      this.showDatas = result
    },

    // 获取体验课定向排期列表
    getTrialOperPeroid() {
      const params = {
        pageNumber: this.tabQuery.page - 1,
        pageSize: this.tabQuery.size,
        type: courseTypeEnum[this.courseType],
        category: '0'
      }
      Object.assign(params, this.queryParams)
      this.$http.Operating.getTrialOperPeroid(params)
        .then((res) => {
          const { code, payload } = res
          if (code === 0) {
            this.tableData = payload.content
            this.total = Number(payload.totalElements)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    // 筛选项change
    changeSearch({ key, data }) {
      // 渠道只要带有三级的
      switch (key) {
        case 'channelIds': {
          const filterThree = data.filter((item) => item.length === 3)
          this.queryParams[key] = filterThree.length
            ? filterThree.map((item) => item[2])
            : []
          break
        }
        case 'periods': {
          this.queryParams[key] = data[key]
          break
        }
        default:
          this.queryParams[key] = data
      }
      this.tabQuery.page = 1
      this.getTrialOperPeroid()
    },

    // 新建、编辑招生期渠道 弹窗
    handlePeriod(val = {}) {
      this.curPeriodInfo = val || {}
      this.channelModal = true
    },

    // 渠道新增、编辑功能
    handlePost({ channelIds, period }) {
      if (period && channelIds.length) {
        const isNew = !Object.keys(this.curPeriodInfo).length
        this.saveOrEditConfigTrialOperPeroid({ channelIds, period, isNew })
      } else {
        this.channelModal = false
      }
    },

    // 新增/编辑 渠道定向招生
    saveOrEditConfigTrialOperPeroid({ channelIds, period, isNew }) {
      const apiKey = isNew
        ? 'saveConfigTrialOperPeroid'
        : 'editConfigTrialOperPeroid'
      const params = {
        channelIds: channelIds.map((item) => item[2]),
        period,
        subject: this.subjects.subject,
        type: courseTypeEnum[this.courseType] || 'CATEGORYTESTCOURSE',
        category: Number(this.courseType) === 0 ? '' : '19' // 双周体验课 0 单周需要类别为19
      }
      if (!isNew) {
        params.id = this.curPeriodInfo.id
      }
      this.loading()
      this.$http.Operating[apiKey](params)
        .then((res) => {
          const { payload = {}, code } = res
          if (payload.status === 0 || (!isNew && code === 0)) {
            this.channelModal = false
          }

          // 新增渠道失败 （有一个失败就算失败）
          if (isNew && payload.status === 1) {
            this.failChannelHandle(payload.failList)
            this.channelInnerModal = true
          }

          this.getTrialOperPeroid()
          this.loading().close()
        })
        .catch((err) => {
          this.loading.close()
          console.log(err)
        })
    },

    // 体验课定向招生渠道切换启用状态
    switchStatusTrialOperPeroid({ id, status }) {
      const params = {
        id,
        status: Number(status) === 1 ? 0 : 1
      }
      this.loading()
      this.$http.Operating.switchStatusTrialOperPeroid(params)
        .then((res) => {
          res.code === 0 &&
            this.$message.success(
              `${Number(status) === 1 ? '启用' : '停用'}成功～`
            )
          this.loading().close()
          this.getTrialOperPeroid()
        })
        .catch((err) => {
          this.loading().close()
          console.log(err)
        })
    },

    // 加载中loading
    loading(text = '加载中', lock = true) {
      const loading = this.$loading({
        lock,
        text,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      return loading
    },

    // 分页切换
    pageChange(page) {
      this.tabQuery.page = page
      this.getTrialOperPeroid()
    },

    // 关闭失败的内层渠道提示
    closeInnerDialog() {
      this.channelInnerModal = false
    },

    // 失败渠道
    failChannelHandle(data) {
      const arr = []
      data.length &&
        data.forEach((valId) => {
          let str = ''
          this.showDatas.forEach((item) => {
            item.children &&
              item.children.forEach((itemChild) => {
                itemChild.children &&
                  itemChild.children.forEach((val) => {
                    if (val.id === valId) {
                      str = `${itemChild.channel_class_name}/${itemChild.channel_outer_name}/${val.channel_outer_name}`
                      arr.push(str)
                    }
                  })
              })
          })
        })
      this.failChannelData = arr
    }
  }
}
