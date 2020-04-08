<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-07 20:53:53
 -->
<template>
  <div>
    <div v-if="tables.tabs == 3">
      <el-popover placement="bottom" width="300" trigger="click">
        <!-- <el-button slot="reference">筛选</el-button> -->

        <el-button
          class="screen-text"
          slot="reference"
          @click="visible = !visible"
        >
          <span>
            <svg
              t="1586260816244"
              class="icon-filter"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1148"
              width="200"
              height="200"
            >
              <path
                d="M859.02 234.524l0.808-0.756 0.749-0.813c27.047-29.356 33.876-70.34 17.823-106.957-15.942-36.366-50.416-58.957-89.968-58.957H163.604c-38.83 0-73.043 22.012-89.29 57.444-16.361 35.683-10.632 76.301 14.949 106.004l0.97 1.126 280.311 266.85 2.032 312.074c0.107 16.502 13.517 29.805 29.995 29.805l0.2-0.001c16.568-0.107 29.912-13.626 29.804-30.194l-2.198-337.564-296.478-282.241c-9.526-11.758-11.426-26.933-5.044-40.851 6.446-14.059 19.437-22.452 34.75-22.452h624.828c15.6 0 28.69 8.616 35.017 23.047 6.31 14.391 3.924 29.831-6.354 41.497l-304.13 284.832 1.302 458.63c0.047 16.54 13.469 29.916 29.998 29.915h0.087c16.568-0.047 29.962-13.517 29.915-30.085L573.04 502.36l285.98-267.836z"
                p-id="1149"
              ></path>
              <path
                d="M657.265 595.287c0 16.498 13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.498 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997H687.262c-16.498 0-29.997 13.499-29.997 29.997zM931.159 734.169H687.262c-16.498 0-29.997 13.499-29.997 29.997s13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.499 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997zM931.159 903.047H687.262c-16.498 0-29.997 13.499-29.997 29.997s13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.499 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997z"
                p-id="1150"
              ></path>
            </svg>
          </span>
          筛选</el-button
        >
        <p class="title-text">参课和完课筛选</p>
        <p>选择课程</p>
        <el-autocomplete
          :clearable="true"
          class="inline-input"
          v-model="state2"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @select="handleSelect"
        ></el-autocomplete>
        <p>状态</p>
        <el-checkbox-group
          class="check-states-box"
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            class="check-states"
            v-for="state in states"
            :label="state"
            :key="state"
            >{{ state }}</el-checkbox
          >
        </el-checkbox-group>
        <p>参课情况</p>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="friend in friends"
            :label="friend"
            :key="friend"
            >{{ friend }}</el-checkbox
          >
        </el-checkbox-group>
        <p>完课情况</p>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox v-for="group in groups" :label="group" :key="group">{{
            group
          }}</el-checkbox>
        </el-checkbox-group>
        <div class="check-button">
          <el-button @click="cancel" size="small">清空</el-button>
          <el-button size="medium" type="primary">过滤</el-button>
          <el-button size="medium" type="primary">取消</el-button>
        </div>
      </el-popover>
    </div>
    <div v-if="tables.tabs == 4">
      <el-popover placement="bottom" width="300" trigger="click">
        <!-- <el-button slot="reference">筛选</el-button> -->

        <el-button
          class="screen-text"
          slot="reference"
          @click="visible = !visible"
        >
          <span>
            <svg
              t="1586260816244"
              class="icon-filter"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1148"
              width="200"
              height="200"
            >
              <path
                d="M859.02 234.524l0.808-0.756 0.749-0.813c27.047-29.356 33.876-70.34 17.823-106.957-15.942-36.366-50.416-58.957-89.968-58.957H163.604c-38.83 0-73.043 22.012-89.29 57.444-16.361 35.683-10.632 76.301 14.949 106.004l0.97 1.126 280.311 266.85 2.032 312.074c0.107 16.502 13.517 29.805 29.995 29.805l0.2-0.001c16.568-0.107 29.912-13.626 29.804-30.194l-2.198-337.564-296.478-282.241c-9.526-11.758-11.426-26.933-5.044-40.851 6.446-14.059 19.437-22.452 34.75-22.452h624.828c15.6 0 28.69 8.616 35.017 23.047 6.31 14.391 3.924 29.831-6.354 41.497l-304.13 284.832 1.302 458.63c0.047 16.54 13.469 29.916 29.998 29.915h0.087c16.568-0.047 29.962-13.517 29.915-30.085L573.04 502.36l285.98-267.836z"
                p-id="1149"
              ></path>
              <path
                d="M657.265 595.287c0 16.498 13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.498 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997H687.262c-16.498 0-29.997 13.499-29.997 29.997zM931.159 734.169H687.262c-16.498 0-29.997 13.499-29.997 29.997s13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.499 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997zM931.159 903.047H687.262c-16.498 0-29.997 13.499-29.997 29.997s13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.499 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997z"
                p-id="1150"
              ></path>
            </svg>
          </span>
          筛选</el-button
        >
        <p class="title-text">作品及点评筛选</p>
        <p>选择课程</p>
        <el-autocomplete
          :clearable="true"
          class="inline-input"
          v-model="state2"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @select="handleSelect"
        ></el-autocomplete>
        <p>状态</p>
        <el-checkbox-group
          class="check-states-box"
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            class="check-states"
            v-for="state in states"
            :label="state"
            :key="state"
            >{{ state }}</el-checkbox
          >
        </el-checkbox-group>
        <p>参课情况</p>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="friend in friends"
            :label="friend"
            :key="friend"
            >{{ friend }}</el-checkbox
          >
        </el-checkbox-group>
        <p>完课情况</p>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox v-for="group in groups" :label="group" :key="group">{{
            group
          }}</el-checkbox>
        </el-checkbox-group>
        <div class="check-button">
          <el-button @click="cancel" size="small">清空</el-button>
          <el-button size="medium" type="primary">过滤</el-button>
          <el-button size="medium" type="primary">取消</el-button>
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MCheckBox',
  props: {
    tables: {
      type: Object,
      default: null
    }
  },
  components: {},
  data() {
    return {
      restaurants: [],
      state2: '',
      visible: false,
      checkedCities: [],
      states: ['已年课', '体验完课'],
      friends: ['已参课', '未参课'],
      groups: ['已完课', '未完课']
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  watch: {},
  created() {},
  methods: {
    querySearch(queryString, cb) {
      console.log(queryString, '第1个事件')
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      console.log('第2个事件')
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    loadAll() {
      return [
        { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
        {
          value: 'Hot honey 首尔炸鸡（仙霞路）',
          address: '上海市长宁区淞虹路661号'
        },
        {
          value: '新旺角茶餐厅',
          address: '上海市普陀区真北路988号创邑金沙谷6号楼113'
        },
        { value: '泷千家(天山西路店)', address: '天山西路438号' },
        {
          value: '胖仙女纸杯蛋糕（上海凌空店）',
          address: '上海市长宁区金钟路968号1幢18号楼一层商铺18-101'
        },
        { value: '贡茶', address: '上海市长宁区金钟路633号' },
        {
          value: '豪大大香鸡排超级奶爸',
          address: '上海市嘉定区曹安公路曹安路1685号'
        },
        {
          value: '茶芝兰（奶茶，手抓饼）',
          address: '上海市普陀区同普路1435号'
        },
        { value: '十二泷町', address: '上海市北翟路1444弄81号B幢-107' },
        { value: '星移浓缩咖啡', address: '上海市嘉定区新郁路817号' },
        { value: '阿姨奶茶/豪大大', address: '嘉定区曹安路1611号' },
        { value: '新麦甜四季甜品炸鸡', address: '嘉定区曹安公路2383弄55号' },
        {
          value: 'Monica摩托主题咖啡店',
          address: '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F'
        },
        {
          value: '浮生若茶（凌空soho店）',
          address: '上海长宁区金钟路968号9号楼地下一层'
        },
        { value: 'NONO JUICE  鲜榨果汁', address: '上海市长宁区天山西路119号' },
        { value: 'CoCo都可(北新泾店）', address: '上海市长宁区仙霞西路' },
        {
          value: '快乐柠檬（神州智慧店）',
          address: '上海市长宁区天山西路567号1层R117号店铺'
        },
        {
          value: 'Merci Paul cafe',
          address: '上海市普陀区光复西路丹巴路28弄6号楼819'
        },
        {
          value: '猫山王（西郊百联店）',
          address: '上海市长宁区仙霞西路88号第一层G05-F01-1-306'
        },
        { value: '枪会山', address: '上海市普陀区棕榈路' },
        { value: '纵食', address: '元丰天山花园(东门) 双流路267号' },
        { value: '钱记', address: '上海市长宁区天山西路' },
        { value: '壹杯加', address: '上海市长宁区通协路' },
        {
          value: '唦哇嘀咖',
          address: '上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元'
        },
        { value: '爱茜茜里(西郊百联)', address: '长宁区仙霞西路88号1305室' },
        {
          value: '爱茜茜里(近铁广场)',
          address:
            '上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺'
        },
        {
          value: '鲜果榨汁（金沙江路和美广店）',
          address: '普陀区金沙江路2239号金沙和美广场B1-10-6'
        },
        {
          value: '开心丽果（缤谷店）',
          address: '上海市长宁区威宁路天山路341号'
        },
        { value: '超级鸡车（丰庄路店）', address: '上海市嘉定区丰庄路240号' },
        { value: '妙生活果园（北新泾店）', address: '长宁区新渔路144号' },
        { value: '香宜度麻辣香锅', address: '长宁区淞虹路148号' },
        {
          value: '凡仔汉堡（老真北路店）',
          address: '上海市普陀区老真北路160号'
        },
        { value: '港式小铺', address: '上海市长宁区金钟路968号15楼15-105室' },
        { value: '蜀香源麻辣香锅（剑河路店）', address: '剑河路443-1' },
        { value: '北京饺子馆', address: '长宁区北新泾街道天山西路490-1号' },
        {
          value: '饭典*新简餐（凌空SOHO店）',
          address: '上海市长宁区金钟路968号9号楼地下一层9-83室'
        },
        {
          value: '焦耳·川式快餐（金钟路店）',
          address: '上海市金钟路633号地下一层甲部'
        },
        { value: '动力鸡车', address: '长宁区仙霞西路299弄3号101B' },
        { value: '浏阳蒸菜', address: '天山西路430号' },
        { value: '四海游龙（天山西路店）', address: '上海市长宁区天山西路' },
        {
          value: '樱花食堂（凌空店）',
          address: '上海市长宁区金钟路968号15楼15-105室'
        },
        { value: '壹分米客家传统调制米粉(天山店)', address: '天山西路428号' },
        {
          value: '福荣祥烧腊（平溪路店）',
          address: '上海市长宁区协和路福泉路255弄57-73号'
        },
        {
          value: '速记黄焖鸡米饭',
          address: '上海市长宁区北新泾街道金钟路180号1层01号摊位'
        },
        { value: '红辣椒麻辣烫', address: '上海市长宁区天山西路492号' },
        {
          value: '(小杨生煎)西郊百联餐厅',
          address: '长宁区仙霞西路88号百联2楼'
        },
        { value: '阳阳麻辣烫', address: '天山西路389号' },
        {
          value: '南拳妈妈龙虾盖浇饭',
          address: '普陀区金沙江路1699号鑫乐惠美食广场A13'
        }
      ]
    },
    // input 选中的值
    handleSelect(item) {
      console.log('第3个事件')
      console.log(item)
    },
    handleCheckedCitiesChange(value) {
      console.log(value)
    },
    // 点击取消
    cancel() {
      this.checkedCities = []
    }
  }
}
</script>
<style lang="scss" scoped>
.screen-text {
  border: none;
}
// .screen-text:active {
//   background: #fff;
//   border: none;
// }
.icon-filter {
  font-size: 24px;
  height: 20px;
  width: 20px;
}
.title-text {
  font-weight: 400;
  font-size: 22px;
}
.check-menu {
  width: 260px;
  padding: 10px;
}
.check-button {
  margin-top: 20px;
}
</style>
