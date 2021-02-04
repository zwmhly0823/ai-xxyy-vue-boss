<<<<<<< HEAD
<!--
/*
 * @Descripttion:
 * @version:
 * @Author: songyanan
 * @Date: 2020-05-11 10:48:18
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-11 17:45:30
 */
 -->
<template>
  <div class="container">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="待点评">
        <div v-if="tabIndex === '0'">
          <ToRiview />
        </div>
      </el-tab-pane>
      <el-tab-pane label="已点评">
        <div v-if="tabIndex === '1'">
          <HaveRiview />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: '0'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.tabIndex = tab.index
    }
  },
  components: {
    ToRiview: () => import('./toRiview'),
    HaveRiview: () => import('./haveRiview')
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: -10px;
  padding: 15px;
}
</style>
=======
<!--
/*
 * @Descripttion:
 * @version:
 * @Author: songyanan
 * @Date: 2020-05-11 10:48:18
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-11 17:45:30
 */
 -->
<template>
  <div class="container">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="待点评">
        <div v-if="tabIndex === '0'">
          <ToRiview />
        </div>
      </el-tab-pane>
      <el-tab-pane label="已点评">
        <div v-if="tabIndex === '1'">
          <HaveRiview />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: '0'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.tabIndex = tab.index
    }
  },
  components: {
    ToRiview: () => import('./toRiview'),
    HaveRiview: () => import('./haveRiview')
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: -10px;
  padding: 15px;
}
</style>
>>>>>>> feature/ossPlugin-20210204
