<!--
 * @Author: wuhao
 * @Date: 2018-12-17 16:47:14
 * @LastEditors: wuhao
 * @LastEditTime: 2018-12-25 15:44:22
 * @Description: 封装table搜索条件
 -->
<template>
  <div :class="{ hidden: hidden }" class="query-conditions-container">
    <el-form
      ref="qform"
      :inline="true"
      :model="queryParams"
      size="small"
      label-width="150px"
      class="demo-form-inline"
    >
      <template v-for="(item, index) in queryFormList">
        <el-form-item v-if="item.type === 'input'" :key="index" :label="item.label">
          <el-input
            v-model="item.value"
            :placeholder="item.placeholder || ''"
            :maxlength="item.maxlength || '20'"
            clearable
            @input="item.format ? formatData(item) : ''"
          />
        </el-form-item>
        <el-form-item v-else-if="item.type === 'select'" :label="item.label" :key="index">
          <el-select
            :clearable="item.clearable === '' ? true : item.clearable"
            :filterable="item.filterable"
            v-model="item.value"
            :collapse-tags="true"
            :placeholder="item.placeholder || ''"
          >
            <el-option
              v-for="(option, i) in item.options"
              :key="i"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'team'" :label="item.label" :key="index">
          <el-select
            :remote-method="remoteMethod"
            v-model="item.value"
            :clearable="true"
            :placeholder="item.placeholder || ''"
            filterable
            remote
            reserve-keyword
          >
            <el-option
              v-for="(option, i) in item.options"
              :key="i"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'subIds'" :label="item.label" :key="index">
          <el-select
            :remote-method="remoteSubMethod"
            v-model="item.value"
            :clearable="true"
            :placeholder="item.placeholder || ''"
            filterable
            remote
            multiple
            reserve-keyword
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'serveCus'" :label="item.label" :key="index">
          <el-select
            :remote-method="remoteServe"
            v-model="item.value"
            :clearable="true"
            :placeholder="item.placeholder || ''"
            filterable
            remote
            reserve-keyword
          >
            <el-option
              v-for="(option, i) in item.options"
              :key="i"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'qudao'" :label="item.label" :key="index">
          <el-select
            :remote-method="remotequdao"
            v-model="item.value"
            :clearable="true"
            :placeholder="item.placeholder || ''"
            filterable
            remote
            reserve-keyword
          >
            <el-option
              v-for="(option, i) in item.options"
              :key="i"
              :label="option.label"
              :value="option.value"
              :clearable="true"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'qudaocome'" :label="item.label" :key="index">
          <el-cascader
            v-model="item.value"
            :options="item.options"
            :filterable="true"
            :clearable="true"
            :before-filter="remotequdaocome"
          />
        </el-form-item>
        <el-form-item v-else-if="item.type == 'cascader'" :label="item.label" :key="index">
          <el-cascader
            :options="item.options"
            v-model="item.value"
            :filterable="item.filterable != null ? item.filterable : true"
            props="{ checkStrictly: true }"
            clearable
          />
        </el-form-item>
        <el-form-item v-else-if="item.type == 'cascader2'" :label="item.label" :key="index">
          <el-cascader
            :options="item.options"
            :props="{ checkStrictly: true }"
            v-model="item.value"
            :filterable="item.filterable != null ? item.filterable : true"
            clearable
          />
        </el-form-item>
        <el-form-item v-else-if="item.type === 'doubleinput'" :key="index" :label="item.label">
          <el-input
            ref="startDay"
            v-model="pre"
            :placeholder="item.placeholder || ''"
            clearable
            @blur="nextInputFocus"
            @clear="clearInput(pre)"
          />
          <span style="letter-spacing:-2px">——</span>
          <el-input
            ref="endDay"
            v-model="next"
            :placeholder="item.placeholder || ''"
            clearable
            @change="preInputFocus"
            @clear="clearInput(next)"
          />
        </el-form-item>
        <el-form-item
          v-else-if="
            item.type === 'date' ||
              item.type === 'datetimerange' ||
              item.type === 'daterange' ||
              item.type === 'month'
          "
          :label="item.label"
          :key="index"
        >
          <el-date-picker
            :type="item.type"
            :format="item.format ? item.format : 'yyyy-MM-dd'"
            v-model="item.value"
            :clearable="item.clearable === '' ? true : item.clearable"
            range-separator="至"
            placeholder="选择日期"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="daterangeChange"
          />
        </el-form-item>
        <el-form-item v-else-if="item.type == 'switch'" :label="item.label" :key="index">
          <el-switch v-model="item.value"></el-switch>
        </el-form-item>
      </template>
      <el-form-item class="query-btn">
        <el-button class="search-btn" icon="el-icon-search" type="primary" @click="search">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "@/api/index";

import { provinceCodeData } from "@/utils/filteRqueryForm";
import ChinaAddressCustData from "@/utils/areaData";
export default {
  name: "QueryConditions",
  components: {
  },
  props: {
    hidden: {
      type: Boolean,
      default: false
    },
    queryParams: {
      type: Object,
      default() {
        return {};
      }
    },
    queryFormList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isFocus: false,
      pre: "",
      next: "",
      searchable: {} // 输入内容是否合乎格式，默认为全为true
    };
  },
  created() {},
  mounted() {
    this.computedList();
  },
  methods: {
    computedList() {
      const array = this.queryFormList;
      for (let i = 0; i < array.length; i++) {
        if (array[i].name.includes("provinceCode")) {
          array[i].options = ChinaAddressCustData;
        } else if (
          ["saleAreaName", "areaId", "saleArea"].includes(array[i].name)
        ) {
          this.getAreaList(array[i].name);
        } else if (array[i].name == "typeId") {
          this.getattributeList();
        } else if (array[i].name == "agentType") {
          this.getattributeList("1");
        } else if (array[i].name.includes("provinceDobule")) {
          array[i].options = ChinaAddressCustData;
        }
      }
      this.queryFormList = array;
    },
    async remoteSubMethod(query) {
      if (query) {
        const obj = {
          from: query
        };
        const res = await api.getSubChannel(obj);
        if (res.status == 1) {
          const tempArr = [];
          if (res.data == null || res.data.length == 0) {
            return;
          }
          res.data.map((item, index) => {
            tempArr.push({
              label: item.channelName,
              value: item.channelId
            });
          });
          for (let i = 0; i < this.queryFormList.length; i++) {
            if (this.queryFormList[i].name == "subIds") {
              this.queryFormList[i].options = tempArr;
            }
          }
        }
      }
    },
    async remoteMethod(query) {
      if (query) {
        const obj = {
          teamName: query
        };
        const res = await api.agentTeamSelect(obj);
        if (res.status == 1) {
          this.teamList = res.data;
          const tempArr = [];
          if (res.data == null || res.data.length == 0) {
            return;
          }
          res.data.map((item, index) => {
            tempArr.push({
              label: item.teamName,
              value: item.teamId
            });
          });
          for (let i = 0; i < this.queryFormList.length; i++) {
            if (this.queryFormList[i].name == "teamId") {
              this.queryFormList[i].options = tempArr;
            }
          }
        }
      }
    },
    async remoteServe(query) {
      if (query) {
        const obj = {
          agentName: query
        };
        const res = await api.getAgentList(obj);
        if (res.status == 1) {
          this.agentList = res.data;
          const tempArr = [];
          if (res.data == null || res.data.length == 0) {
            return;
          }
          res.data.map((item, index) => {
            tempArr.push({
              label: item.agentName,
              value: item.agentId
            });
          });
          for (let i = 0; i < this.queryFormList.length; i++) {
            if (this.queryFormList[i].name == "agentId") {
              this.queryFormList[i].options = tempArr;
            }
          }
        }
      }
    },
    async remotequdao(query) {
      if (query) {
        const obj = {
          channelName: query
        };
        const res = await api.getChannelOpt(obj);
        if (res.status == 1) {
          this.assignmentTeam = res.data;
          const tempArr = [];
          res.data.map((item, index) => {
            tempArr.push({
              label: item.channelName,
              value: item.channelId
            });
          });
          for (let i = 0; i < this.queryFormList.length; i++) {
            if (this.queryFormList[i].name == "channelId") {
              this.queryFormList[i].options = tempArr;
            }
          }
        }
      }
    },
    async remotequdaocome(query) {
      if (query) {
        const obj = {
          channelName: query
        };
        const result = await api.getChannelList(obj);
        const tempArr = [];
        if (result.status == 1) {
          result.data["new"].map((item, index) => {
            tempArr.push({
              label: item.channelName,
              value: item.channelId
            });
          });

          for (let i = 0; i < this.queryFormList.length; i++) {
            if (this.queryFormList[i].name == "channelId") {
              this.queryFormList[i].options = tempArr;
            }
          }
        }
      } else {
        for (let i = 0; i < this.queryFormList.length; i++) {
          if (this.queryFormList[i].name == "channelId") {
            this.queryFormList[i].options = [];
          }
        }
      }
    },
    search(val) {
      if (!this.checkData()) {
        this.$message.error("你输入的内容有误，请确认");
      } else {
        this.$emit("search", this.queryParams);
      }
    },
    // 日期区间选择callback
    daterangeChange(val) {
      this.$emit("daterangeChange", val);
    },
    nextInputFocus() {
      var pre = parseInt(this.$refs["startDay"][0].value);
      var next = parseInt(this.$refs["endDay"][0].value);
      if (pre >= next) {
        this.pre = "";
        this.$message.error("有效期起始值不能大于结束值");
        return false;
      }
      if (this.next == "") {
        this.$refs["endDay"][0].focus();
      }
    },
    preInputFocus(e) {
      if (this.$refs["startDay"][0].value == "") {
        this.$refs["startDay"][0].focus();
      } else {
        var pre = parseInt(this.$refs["startDay"][0].value);
        var next = parseInt(this.$refs["endDay"][0].value);
        if (pre >= next) {
          this.$message.error("有效期起始值不能大于结束值");
          this.next = "";
          return false;
        } else {
          for (var i in this.queryFormList) {
            if (this.queryFormList[i].type == "doubleinput") {
              this.queryFormList[i].options[0] = pre;
              this.queryFormList[i].options[1] = next;
            }
          }
        }
      }
    },
    clearInput(type) {
      this.next = "";
      this.pre = "";
      for (let i = 0; i < this.queryFormList.length; i++) {
        if (this.queryFormList[i].type == "doubleinput") {
          this.queryFormList[i].options = [];
        }
      }
    },
    resetForm() {
      this.pre = "";
      this.next = "";
      this.$emit("resetForm", "true");
    },
    formatData(item) {
      if (item.value == "") {
        this.searchable[item.name] = true;
        return;
      }
      // 数字类专用 format = 'number'
      const value = item.value;
      const value2 = item.value.replace(/[^0-9]/gi, "");
      this.searchable[item.name] = value == value2;
      if (!this.searchable[item.name]) {
        this.$message.error("你输入的内容有误，请确认");
      }
    },
    checkData() {
      let result = true;
      for (const key in this.searchable) {
        result = result && this.searchable[key];
      }
      return result;
    },
    // 区域中心
    async getAreaList(type) {
      const res = await api.getAgentManagerlArea();
      if (res.status == 1) {
        this.areaList = res.data;
        const tempArr = [];
        if (res.data == null || res.data.length == 0) {
          return;
        }
        res.data.map((item, index) => {
          if (type == "saleArea") {
            tempArr.push({
              label: item.areaName,
              value: item.areaName
            });
          } else if (type == "saleAreaName") {
            tempArr.push({
              label: item.saleAreaName,
              value: item.saleAreaName
            });
          } else if (type == "areaName") {
            tempArr.push({
              label: item.saleAreaName,
              value: item.areaId
            });
          } else {
            tempArr.push({
              label: item.areaName,
              value: item.areaId
            });
          }
        });
        this.addFormData(type, tempArr);
      }
    },
    // 顾问属性
    async getattributeList(type) {
      const res = await api.searchAgentType();
      if (res.status == 1) {
        this.agentTypes = res.data;
        const tempArr = [];
        if (res.data == null || res.data.length == 0) {
          return;
        }
        res.data.map((item, index) => {
          if (type) {
            tempArr.push({
              label: item.agentTypeName,
              value: item.agentType
            });
          } else {
            tempArr.push({
              label: item.agentTypeName,
              value: item.typeId
            });
          }
        });
        if (type) {
          this.addFormData("agentType", tempArr);
        } else {
          this.addFormData("typeId", tempArr);
        }
      }
    },
    // 插入queryForm数据
    addFormData(key, arr) {
      if (key === "" || arr.length === 0) {
        return;
      }
      for (let i = 0; i < this.queryFormList.length; i++) {
        if (this.queryFormList[i].name === key) {
          this.queryFormList[i].options = arr;
        }
      }
    }
  }
};
</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.el-date-editor .el-range-separator {
  width: 8%;
}
</style>

<style scoped lang="less">
.query-conditions-container {
  background: #eee;
  padding: 18px 0 0;
  border: 1px solid #d3dce6;
  .el-input,
  .el-select {
    width: 190px;
  }

  .search-btn {
    margin-left: 20px;
  }
}
.query-conditions-container.hidden {
  display: none;
}
.query-btn {
  text-align: right;
  padding-right: 50px;
  display: block;
}
</style>
