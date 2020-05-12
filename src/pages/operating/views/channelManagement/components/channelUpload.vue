<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-05-06 16:33:15
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-08 17:54:49
 -->
<template>
  <div class="channelUpload-box">
    <div class="channelUpload-table">
      <div class="channelUpload-upload-box">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button class="upload-btn" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            当前仅支持CSV格式文件（大小控制在10M内），请使用office2010以上的版本，否则会出现导入异常。
          </div>
        </el-upload>
        <el-button class="upload-mb" type="text">下载模板</el-button>
      </div>
      <el-table
        :header-cell-style="headerCss"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="date" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="name" label="导入时间" width="180">
        </el-table-column>
        <el-table-column prop="address" label="导入数"> </el-table-column>
        <el-table-column prop="address" label="实际导入数"> </el-table-column>
        <el-table-column prop="address" label="导入状态"> </el-table-column>
        <el-table-column prop="address" label="说明"> </el-table-column>
      </el-table>
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="1"
        :total="10"
        open="calc(100vw - 95px - 100px)"
        close="calc(100vw - 23px - 50px)"
      />
    </div>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
export default {
  props: {
    tabIndex: {
      type: String,
      default: ''
    }
  },
  components: {
    MPagination
  },
  data() {
    return {
      fileList: [
        // {
        //   name: 'food.jpeg',
        //   url:
        //     'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // },
        // {
        //   name: 'food2.jpeg',
        //   url:
        //     'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],
      tableData: [
        // {
        //   date: '2016-05-02',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }
      ]
    }
  },
  created() {},
  methods: {
    handleCurrentChange() {},
    handleRemove(file, fileList) {
      console.log(file, fileList, '1')
    },
    handlePreview(file) {
      console.log(file, '2')
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      return 'font-size:12px;color:#666;font-weight:normal;background:#f0f1f2;'
    }
  }
}
</script>

<style lang="scss" scoped>
.channelUpload-box {
  background: #f0f1f2;
  padding: 10px 10px 10px 10px;
  height: calc(100vh - 129px);
  overflow: scroll;
  .channelUpload-table {
    padding: 10px;
    // margin-top: 10px;
    margin-bottom: 20px;
    background: #fff;
    .channelUpload-upload-box {
      position: relative;
      .upload-btn {
        margin-top: 10px;
        margin-left: 10px;
        margin-bottom: 20px;
        width: 120px;
        height: 40px;
      }
      .upload-mb {
        position: absolute;
        top: 20px;
        left: 150px;
      }
    }
  }
}
</style>
