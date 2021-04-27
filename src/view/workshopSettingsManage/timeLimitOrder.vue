// 时限管理
<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane
      v-for="(tabs, index) of tabLists"
      :key="index"
      :label="tabs.label"
      :name="tabs.name"
    >
      <div>
        <el-form :inline="true" :model="timeLimitForm" ref="form" label-width="140px">
          <el-form-item label="时限设置(分钟):">
            <el-input v-model="timeLimitForm.time" size="small"></el-input>
          </el-form-item>
          <!-- <el-form-item label="二次时限设置(分钟):">
            <el-input></el-input>
          </el-form-item>-->
          <el-form-item label="备注:">
            <el-input v-model="timeLimitForm.comment" size="small"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              v-if="buttonStatus == 0"
              @click="onSubmit(tabs.type)"
              type="primary"
              size="small"
            >新增</el-button>
            <div v-else>
              <el-button @click="onEdit(tabs.type)" type="primary" size="small">编辑</el-button>
              <el-button @click="onDelete(tabs.type)" type="danger" size="small">删除</el-button>
            </div>
          </el-form-item>
        </el-form>

        <!-- TODO 超时工单 缺失保养和维修 -->
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { timeLimitApi } from "../../lib/api/system";
export default {
  data() {
    const userInfoLocal = localStorage.getItem("user_info");
    const userInfoObj = JSON.parse(userInfoLocal).principal;
    console.log(this.$route.params);
    
    return {
      activeName: "0",
      tabLists: [
        {
          label: "点检时限",
          name: "0",
          type: 0
        },
        {
          label: "巡检时限",
          name: "1",
          type: 1
        },
        {
          label: "保养时限",
          name: "2",
          type: 2
        },
        {
          label: "维修时限",
          name: "4",
          type: 4
        }
      ],
      timeLimitForm: {
        comment: "",
        configType: 0,
        time: 0,
        timeType: 0,
        factoryId: userInfoObj.factoryId,
        workshopId: userInfoObj.workshopId,
        workshopShiftId: userInfoObj.workshopShiftId
      },
      buttonStatus: 0, // 0: 新增 | 1: 修改/删除
      tabParam: {}, // 时限管理参数
      tableParam: {} // 超时工单参数
    };
  },
  mounted() {
    this.tableParam = { type: "1,2" };
    this.tabParam = this.timeLimitForm;
    this.initDataList();
  },
  methods: {
    /**
     * Tabs点击事件
     */
    handleClick(tab, event) {
      const type = tab.name;
      this.timeLimitForm.type = type;
      this.tabParam = this.timeLimitForm;
      switch (type) {
        case '0':
          this.tableParam = { type: "1,2" };
          break;
        case '1':
          this.tableParam = { type: "3" };
          break;
        case '2':
          // TODO 暂无参数
          break;
        case '4':
          // TODO 暂无参数
          break;
        default:
          break;
      }
      this.initDataList();
    },
    /**
     * 初始化数据
     */
    initDataList() {
      timeLimitApi["getTimeLimit"](this.tabParam).then(res => {});
      timeLimitApi["timeLimitOrder"](this.tableParam).then(res => {});
    },
    /**
     * 新增时限
     */
    onSubmit(type) {
      this.timeLimitForm.type = type;
      timeLimitApi["postTimeLimit"](this.timeLimitForm).then(res => {
        this.initDataList();
      });
    },
    /**
     * 修改时限
     */
    onEdit(type) {
      this.timeLimitForm.type = type;
      timeLimitApi["putTimeLimit"](this.timeLimitForm).then(res => {
        this.initDataList();
      });
    },
    /**
     * 删除时限
     */
    onDelete(type) {
      this.timeLimitForm.type = type;
      timeLimitApi["deleteTimeLimit"](this.timeLimitForm).then(res => {
        this.initDataList();
      });
    }
  }
};
</script>
<style>
</style>