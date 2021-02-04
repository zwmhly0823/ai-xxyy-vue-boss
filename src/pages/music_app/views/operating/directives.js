<<<<<<< HEAD
/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-06-28 11:48:45
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-28 12:19:43
 */
import Vue from 'vue'
export default Vue.directive('loadmore', {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector(
      '.el-select-dropdown .el-select-dropdown__wrap'
    )
    SELECTWRAP_DOM.addEventListener('scroll', function() {
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (CONDITION) {
        binding.value()
      }
    })
  }
})
=======
/*
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-06-28 11:48:45
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-28 12:19:43
 */
import Vue from 'vue'
export default Vue.directive('loadmore', {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector(
      '.el-select-dropdown .el-select-dropdown__wrap'
    )
    SELECTWRAP_DOM.addEventListener('scroll', function() {
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight
      if (CONDITION) {
        binding.value()
      }
    })
  }
})
>>>>>>> feature/ossPlugin-20210204
