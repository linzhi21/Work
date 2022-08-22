// 首页主体内容
<template>
  <div class="home-content" id="homeContent">
    <!-- <span @click="screen">全屏</span> -->
    <!-- 头部四色卡片区 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card class="card first-card">
          <div class="left">
            <p>工号</p>
            <p>{{ worKClass }}</p>
          </div>
          <div class="right">
            <p>用户角色</p>
            <p>{{ persionalRole }}</p>
          </div>
          <p class="separator"></p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card second-card">
          <p>点、巡检情况</p>
          <p>
            <span>点检</span>
            <el-progress
              class="failure-equipment"
              :show-text="false"
              :percentage="wordorderNumObj.singleRate || 0"
              color="#fff"
            ></el-progress>
            <i
              >{{ wordorderNumObj.singleCompletedCount }} /
              {{ wordorderNumObj.singleAllCount }}</i
            >
          </p>
          <p>
            <span>巡检</span>
            <el-progress
              class="normal-equipment"
              :show-text="false"
              :percentage="wordorderNumObj.patrolRate || 0"
              color="#fff"
            ></el-progress>
            <i
              >{{ wordorderNumObj.patrolCompletedCount }} /
              {{ wordorderNumObj.patrolAllCount }}</i
            >
          </p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card third-card">
          <p>保养情况</p>
          <p>
            <span>已完成</span>
            <el-progress
              class="reply"
              :show-text="false"
              :percentage="wordorderNumObj.maintainRate || 0"
              color="#fff"
            ></el-progress>
            <i>{{ wordorderNumObj.maintainCompletedCount }}</i>
          </p>
          <p>
            <span>未完成</span>
            <el-progress
              class="reply"
              :show-text="false"
              color="#fff"
            ></el-progress>
            <i>{{ wordorderNumObj.maintainWaitCompletedCount }}</i>
          </p>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card fourth-card">
          <p>设备状态({{ parseTimeFun(new Date()) }})</p>
          <div
            v-for="(item, index) in equipmentSheet"
            :key="index"
            class="list"
          >
            <template v-if="item.action">
              <p v-bind:style="item.style">{{ item.value }}</p>
              <p class="small">{{ item.label }}</p>
            </template>
            <template v-else>
              <p>{{ item.value }}</p>
              <p class="small">{{ item.label }}</p>
            </template>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 任务单的区域 -->
    <el-row :gutter="10">
      <el-col :span="6" v-for="(item, index) in taskOrder" :key="index">
        <div>
          <el-card class="task-list spot-check-list">
            <h4 class="list-name">{{ item.orderName }}</h4>
            <div class="list-box">
              <div class="progress">
                <el-progress
                  type="dashboard"
                  :width="100"
                  :show-text="false"
                  :percentage="item.rate || 0"
                ></el-progress>
                <div class="overtime-work-order">
                  <p>{{ item.rate }}%</p>
                  <span>完成率</span>
                </div>
              </div>
              <div class="list-content">
                <div class="list-content-card data-not-reply">
                  <p class="selected">{{ item.waitCompletedCount }}</p>
                  <span>未完成</span>
                </div>
                <div class="list-content-card month-reply">
                  <p>{{ item.allCount }}</p>
                  <span>总工单</span>
                </div>
                <div class="list-content-card month-reply">
                  <p>{{ item.completedCount }}</p>
                  <span>已完成</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- 图表区 -->
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="12">
        <div>
          <el-card class="replacement-part">
            <h4>
              点检详情
              <el-button
                @click="exportChart('single')"
                type="text"
                icon="el-icon-download"
                >导出</el-button
              >
            </h4>
            <div @click="showChart('single')">
              <ve-bar
                :data="pointCheckChartData"
                :settings="chartSettings"
                :colors="['#37bb64', '#f68b2f']"
                :extend="chartExtend"
              ></ve-bar>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card class="replacement-part">
            <h4>
              巡检详情
              <el-button
                @click="exportChart('patrol')"
                type="text"
                icon="el-icon-download"
                >导出</el-button
              >
            </h4>
            <div @click="showChart('patrol')">
              <ve-histogram
                :data="inspectionChartData"
                :settings="chartSettings"
                :colors="['#37bb64', '#f68b2f']"
                :extend="chartExtend"
              ></ve-histogram>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <el-card class="replacement-part">
            <h4>
              保养详情
              <el-button
                @click="exportChart('maintain')"
                type="text"
                icon="el-icon-download"
                >导出</el-button
              >
            </h4>
            <div @click="showChart('maintain')">
              <ve-histogram
                :data="maintainChartData"
                :settings="chartSettings"
                :colors="['#37bb64', '#f68b2f']"
                :extend="chartExtend"
              ></ve-histogram>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="12">
        <div class="unrequired-equipment">
          <h4>未修理设备</h4>
          <el-table :data="unrequiredEquipmentData" height="450">
            <el-table-column
              align="center"
              prop="deviceName"
              label="设备名称"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="deviceNo"
              label="设备编号"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="workshopSectionName"
              label="工段"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="createDate"
              label="报修时间"
              min-width="140"
            ></el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="unrequired-equipment">
          <h4>维修统计</h4>
          <el-tabs v-model="typeSelect" @tab-click="handleClick">
            <el-tab-pane label="日统计" name="1"></el-tab-pane>
            <el-tab-pane label="周统计" name="2"></el-tab-pane>
            <el-tab-pane label="月统计" name="3"></el-tab-pane>
          </el-tabs>
          <el-table :data="maintenanceTimesData" height="450">
            <el-table-column
              align="center"
              prop="deviceName"
              label="设备名称"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="x"
              label="报修时间"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="breakdownTime"
              label="影响生产时间"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="times"
              label="维修次数"
            ></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 报表页 -->
    <el-drawer
      :title="drawerDetail.title"
      :visible.sync="drawer"
      :with-header="true"
      size="80%"
      :before-close="handleClose"
    >
      <el-form :inline="true" label-width="80px" size="mini">
        <el-form-item label="工单状态">
          <el-select v-model="drawerDetail.status" placeholder="请选择工单状态">
            <el-option
              v-for="(item, index) in orderStatusList"
              :key="index"
              :label="item.status"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属工段">
          <el-select
            v-model="drawerDetail.workshopSectionId"
            placeholder="请选择所属工段"
          >
            <el-option
              v-for="(item, index) in workshopSectionSelectList"
              :key="index"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单时间">
          <el-col :span="11">
            <el-date-picker
              v-model="drawerDetail.times"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              checkOutWorkOrder(
                drawerDetail.type,
                { page: 0, size: 1000 },
                drawerDetail
              )
            "
            >查询</el-button
          >
          <el-button @click="clearCheckOutWorkOrder(drawerDetail.type)"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <tpms-table
        :column_index="true"
        ref="tpmsTable"
        :data="drawerDetail.tableLists"
        :total="drawerDetail.total"
        :columns="drawerDetail.columns"
        :pageSizes="[drawerDetail.total]"
      ></tpms-table>
    </el-drawer>

    <!-- 设置 -->
    <el-button
      @click="openTools"
      type="primary"
      icon="el-icon-s-tools"
      class="s_tools"
    ></el-button>
    <el-drawer
      :title="drawerDetail.title"
      :visible.sync="setDrawer"
      :with-header="true"
      size="30%"
      :before-close="handleClose"
    >
      <el-form :inline="false" label-width="80px" size="mini">
        <el-form-item label="查询时间">
          <el-col :span="8">
            <el-date-picker
              v-model="drawerDetail.times"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkTools">查询</el-button>
          <el-button @click="clearCheckTools"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script>
import axios from "axios";
import { tpmsHeader, tpmsTable } from "../../components";
import { orderStatusList } from "../../public/model/order";
import {
  workorderDashboard,
  deviceAndEquipment,
  wordorderNums,
  echartsInit,
} from "./chart";
import apiConfig from "../../lib/api/apiConfig";
import { getOneUser } from "../../lib/api/userManage";
import { maintenanceManage } from "../../lib/api/business";
import { checkWorkOrder, workshopSectionSelect } from "../../lib/api/checkPlan";
import {
  maintainWorkOrder,
  exportWorkOrders,
} from "../../lib/api/upkeepManagePage";
import {
  inspectionCountBasedOnArea,
  statisticsForMaintain,
  statisticsForMaintenanceCost,
  statisticsForMaintenanceRepairList,
  statisticsForMaintenanceSubmitList,
  pointCheckCountBasedOnArea,
  statisticsForReceivedHour,
  statisticsForWorkOrder,
  maintainCountBasedOnArea,
  maintenanceTimes,
} from "../../lib/api/statistics";
import { parseTime, getTodoyTimes,getMonthTimes } from "@/utils";
export default {
  data() {
    this.userInfoLocal = JSON.parse(localStorage.getItem("user_info"));
    this.chartSettings = {
      stack: { 工单: ["completedCount", "waitReceivedCount"] },
      labelMap: {
        completedCount: "完成工单",
        waitReceivedCount: "未完成工单",
        areaName: "区域",
      },
    };
    this.chartExtend = {
      series: function (s) {
        s.forEach((v) => {
          v.label = {
            color: "#fff",
            show: true,
            position: "insideLeft",
          };
        });
        return s;
      },
    };
    this.endTime = getTodoyTimes().endTime;
    this.startTime = getTodoyTimes().startTime;
   
    this.startMonth = getMonthTimes().startTime;
    this.endMonth = getMonthTimes().endTime;
    return {
      drawer: false,
      setDrawer: false,
      worKClass: "A班", // 工作班次
      persionalRole: "维修技术员", // 用户角色
      taskOrder: [
        {
          orderName: "点检任务单",
          rate: 50,
          waitCompletedCount: 69,
          allCount: 138,
          completedCount: 69,
        },
        {
          orderName: "巡检任务单",
          rate: 100,
          waitCompletedCount: 0,
          allCount: 65,
          completedCount: 65,
        },
        {
          orderName: "保养任务单",
          rate: 87,
          waitCompletedCount: 30,
          allCount: 228,
          completedCount: 198,
        },
        {
          orderName: "维修任务单",
          rate: 0,
          waitCompletedCount: 0,
          allCount: 0,
          completedCount: 0,
        },
      ], // 任务单内容
      unrequiredEquipmentData: [], // 未修理设备
      equipmentSheet: [
        {
          value: 0,
          label: "在线设备",
        },
        {
          value: 0,
          label: "已修复",
        },
        {
          value: 0,
          label: "异常中",
        },
      ], // 设备和维修数据
      wordorderNumObj: {
        singleRate: 138,
        singleCompletedCount: 69,
        singleAllCount: 138,
        patrolRate: 65,
        patrolCompletedCount: 65,
        patrolAllCount: 65,
        maintainRate: 198,
        maintainCompletedCount: 198,
        maintainWaitCompletedCount: 30,
      }, // 工单数据
      pointCheckChartData: {
        columns: ["areaName", "completedCount", "waitReceivedCount"],
        rows: [
          { areaName: "UB2", completedCount: 7, waitReceivedCount: 7 },
          { areaName: "UB1", completedCount: 7, waitReceivedCount: 7 },
          { areaName: "ST", completedCount: 14, waitReceivedCount: 14 },
          { areaName: "MABT", completedCount: 4, waitReceivedCount: 4 },
          { areaName: "ABT", completedCount: 25, waitReceivedCount: 25 },
          { areaName: "总装返修区", completedCount: 5, waitReceivedCount: 5 },
          { areaName: "AB", completedCount: 7, waitReceivedCount: 7 },
        ],
      }, // 点检报表
      inspectionChartData: {
        columns: ["areaName", "completedCount", "waitReceivedCount"],
        rows: [
          { areaName: "AB", completedCount: 11, waitReceivedCount: 0 },
          { areaName: "ST", completedCount: 13, waitReceivedCount: 0 },
          { areaName: "UB", completedCount: 15, waitReceivedCount: 0 },
          { areaName: "ABT", completedCount: 26, waitReceivedCount: 0 },
        ],
      }, // 巡检报表
      maintainChartData: {
        columns: [],
        rows: [],
      }, // 保养报表
      drawerDetail: {
        title: "",
        tableList: [],
        total: 0,
        columns: [],
        type: "1,2",
        workshopSectionId: "",
        status: "",
        times: [this.startTime, this.endTime],
      },
      fullscreen: false,
      orderStatusList: orderStatusList,
      workshopSectionSelectList: [],
      typeSelect: "1",
      maintenanceTimesData: [
        // {
        //   deviceName: "充电器电动葫芦",
        //   x: "2022-02-09 14:35:10",
        //   breakdownTime: "10",
        //   times: "1",
        // },
        // {
        //   deviceName: "常规风车(AB-AFO5750DT1)",
        //   x: "2022-01-14 09:46:18",
        //   breakdownTime: "2",
        //   times: "1",
        // },
        // {
        //   deviceName: "手持设备HDT –H78BA14A",
        //   x: "2021-12-23 15:13:18",
        //   breakdownTime: "5",
        //   times: "1",
        // },
        // {
        //   deviceName: "手持设备HDT –H78BAK03",
        //   x: "2021-12-23 15:13:18",
        //   breakdownTime: "5",
        //   times: "1",
        // },
      ],
    };
  },
  components: {
    tpmsTable,
  },
  mounted() {
    const _this = this;
    this.workorderInfo();
    this.searchWorkshopSectionSelect();
  },
  methods: {
    workorderInfo() {
      const role = this.userInfoLocal.authorities;
      const principal = this.userInfoLocal.principal;
      getOneUser("", principal.uuid).then((res) => {
        this.worKClass = res.data.workNo;
        this.persionalRole = res.data.userWorkshops[0].roles[0].name;
      });
      const roleStr = JSON.stringify(role);
      if (
        roleStr.includes("POINT_INSPECTION_MANAGEMENT") ||
        roleStr.includes("ROUTING_INSPECTION_MANAGEMENT") ||
        roleStr.includes("MAINTENANCE_MANAGEMENT") ||
        roleStr.includes("REPAIR_MANAGEMENT") ||
        roleStr.includes("DEVICE_MANAGEMENT")
      ) {
        /**
         * 工单执行数据
         */
        statisticsForWorkOrder({
          endTime: this.endTime,
          startTime: this.startTime,
        }).then((res) => {
          this.taskOrder = workorderDashboard(res);
          this.equipmentSheet = deviceAndEquipment(res);
          this.wordorderNumObj = wordorderNums(res.data);
        });
        /**
         * 巡检根据区域统计接单数量
         */
        inspectionCountBasedOnArea({
          endTime: this.endTime,
          startTime: this.startTime,
        }).then((res) => {
          this.inspectionChartData = {
            columns: ["areaName", "completedCount", "waitReceivedCount"],
            rows: res.data,
          };
        });
        /**
         * 点检根据区域统计接单数量
         */
        pointCheckCountBasedOnArea({
          endTime: this.endTime,
          startTime: this.startTime,
        }).then((res) => {
          this.pointCheckChartData = {
            columns: ["areaName", "completedCount", "waitReceivedCount"],
            rows: res.data,
          };
        });
        /**
         * 保养根据区域统计接单数量
         */
        maintainCountBasedOnArea({
          endTime: this.endMonth,
          startTime: this.startMonth,
        }).then((res) => {
          this.maintainChartData = {
            columns: ["areaName", "completedCount", "waitReceivedCount"],
            rows: res.data,
          };
        });
        /**
         * 展示所有人接单数量根据接单数量排序展示(保养)
         */
        statisticsForMaintain().then((res) =>
          console.log(`statisticsForMaintain:${JSON.stringify(res)}`)
        );
        /**
         * 展示所有人接单时间根据接单数量排序展示
         */
        statisticsForReceivedHour({ types: "1,2" }).then((res) =>
          console.log(`statisticsForReceivedHour1-2:${JSON.stringify(res)}`)
        );
        statisticsForReceivedHour({ types: "3" }).then((res) =>
          console.log(`statisticsForReceivedHour3:${JSON.stringify(res)}`)
        );

        /**
         * 维修时间统计
         */
        statisticsForMaintenanceCost().then((res) =>
          console.log(`statisticsForMaintenanceCost:${JSON.stringify(res)}`)
        );
        /**
         * 当天维修设备清单
         */
        statisticsForMaintenanceRepairList().then((res) =>
          console.log(
            `statisticsForMaintenanceRepairList:${JSON.stringify(res)}`
          )
        );
        /**
         * 当天报修设备清单
         */
        statisticsForMaintenanceSubmitList().then((res) =>
          console.log(
            `statisticsForMaintenanceSubmitList:${JSON.stringify(res)}`
          )
        );
        this.maintenanceTimes(this.typeSelect);
      }
      if (roleStr.includes("REPAIR_MANAGEMENT")) {
        maintenanceManage["getLists"]({ status: "1,2,4,8" }).then((res) => {
          this.unrequiredEquipmentData = res.data.content;
        });
      }
    },
    /**
     * 维修设备影响生产时间统计
     */
    maintenanceTimes(type) {
      maintenanceTimes({
        startTime: "2020-01-01",
        type: type,
      }).then((res) => {
        let data = res.data;
        data.map((r) => (r.time = parseTime(r.x)));
        console.log(`maintenanceTimes:${JSON.stringify(res)}`);
        this.maintenanceTimesData = data;
      });
    },
    handleClose() {
      this.drawerDetail = {
        title: "",
        tableList: [],
        total: 0,
        columns: [],
        type: "1,2", // 抽屉适用类型
        workshopSectionId: "",
        status: "",
        times: [this.startTime, this.endTime],
      };
      this.drawer = false;
      this.setDrawer = false;
    },
    /**
     * 显示报表详情
     */
    showChart(type) {
      this.drawer = true;
      const pageData = { page: 0, size: 1000 };
      switch (type) {
        case "single":
          pageData.size = this.wordorderNumObj.singleAllCount;
          this.checkOutWorkOrder("1,2", pageData, this.drawerDetail);
          break;
        case "patrol":
          pageData.size = this.wordorderNumObj.patrolAllCount;
          this.checkOutWorkOrder("3", pageData, this.drawerDetail);
          break;
        case "maintain":
          this.checkOutWorkOrder("4", pageData, this.drawerDetail);
          break;
        case "repair":
          this.repairWorkOrder();
          break;
        default:
          break;
      }
    },
    /**
     * 查询工单列表
     */
    checkOutWorkOrder(status, pageData, params) {
      this.drawerDetail.type = status;
      const requestData = {
        ...pageData,
        type: status,
      };

      if (params.status !== undefined) {
        requestData.status = params.status;
      }
      if (params.workshopSectionId !== undefined) {
        requestData.workshopSectionId = params.workshopSectionId;
      }
      if (params.times[0] !== undefined) {
        requestData.startTime = params.times[0];
      }
      if (params.times[1] !== undefined) {
        requestData.endTime = params.times[1];
      }

      this.drawerDetail.columns = [
        { props: "type", label: "类型" },
        { props: "statusStr", label: "状态" },
        { props: "deviceName", label: "设备名称" },
        { props: "deviceAssetNo", label: "资产编号" },
        { props: "workshopSectionName", label: "工段" },
        { props: "receiverName", label: "接单人" },
        { props: "completeTime", label: "完成时间", width: "200px" },
        { props: "createDate", label: "工单日期", width: "200px" },
        { props: "no", label: "点检工单编号" },
        { props: "planName", label: "点检计划名称", width: "200px" },
        { props: "planNo", label: "点检计划编号", width: "200px" },
        { props: "hour", label: "总工时" },
      ];

      if (status != "4") {
        checkWorkOrder(requestData).then((res) => {
          const data = res.data.content;
          this.drawerDetail.tableLists = data;
          this.drawerDetail.total = pageData.size;
          this.drawerDetail.title = status === "3" ? "巡检工单" : "点检工单";
        });
      } else {
        maintainWorkOrder(requestData).then((res) => {
          const data = res.data.content;
          this.drawerDetail.tableLists = data;
          this.drawerDetail.total = pageData.size;
          this.drawerDetail.title = "保养工单";
        });
      }
    },
    repairWorkOrder() {
      const data = { status: [1, 2, 4, 8] };
      this.drawerDetail.columns = [
        { props: "no", label: "维修单号" },
        { props: "deviceNo", label: "设备编号" },
        { props: "deviceName", label: "设备名称" },
        { props: "areaName", label: "报修区域" },
        { props: "applicantName", label: "报修人" },
        { props: "workshopSectionName", label: "工段" },
        { props: "description", label: "故障描述" },
        { props: "breakdownTime", label: "报修时间", width: 120 },
      ];
      maintenanceManage["getLists"]({ ...data, ...pageData }).then((res) => {
        this.drawerDetail.tableLists = res.data.content;
        this.drawerDetail.total = res.data.totalElements;
        this.drawerDetail.title = "报修工单";
      });
    },
    /**
     * 重置查询
     */
    clearCheckOutWorkOrder(type) {
      this.startTime = getTodoyTimes().startTime
      this.endTime = getTodoyTimes().endTime
      this.drawerDetail = {
        title: "",
        tableList: [],
        total: 0,
        columns: [],
        type: "1,2", // 抽屉适用类型
        workshopSectionId: "",
        status: "",
        times: [this.startTime, this.endTime],
      };
      this.checkOutWorkOrder(type, {}, this.drawerDetail);
    },
    /**
     * 导出当日工单
     */
    exportChart(type) {
      let param = {
        endTime: this.endTime,
        startTime: this.startTime,
        type: "1,2",
      };
      switch (type) {
        case "single":
          param.type = "1,2";
          this.exportWorkOrder(param);
          break;
        case "patrol":
          param.type = "3";
          this.exportWorkOrder(param);
          break;
        case "maintain":
          param.type = "";
          this.exportWorkOrder(param, "4");
          break;
        default:
          break;
      }
    },
    /**
     * 导出当日工单接口
     */
    exportWorkOrder(param, status) {
      let url = "";
      if (status != "4") {
        url = `${apiConfig.checkWorkOrder}/download`; //请求下载文件的地址
      } else {
        url = `${apiConfig.maintainWorkOrder}/export`; //请求下载文件的地址
      }
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          params: param,
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;
          const today = "";
          let fileName = `TPMS-${today}工单详情.xlsx`;
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", fileName); // 下载的文件
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    /**
     * 表格状态码转文字
     */
    statusTranslate(val) {
      switch (val) {
        case 1:
          val = "待接单";
          break;
        case 2:
          val = "待处理";
          break;
        case 3:
          val = "处理中";
          break;
        case 4:
          val = "待审批";
          break;
        case 5:
          val = "正在审批";
          break;
        case 6:
          val = "已完成";
          break;
        case 7:
          val = "审批驳回";
          break;
        case 8:
          val = "暂停";
          break;
        default:
          val = "待启动";
          break;
      }
      return val;
    },
    screen() {
      // let element = document.documentElement;//设置后就是我们平时的整个页面全屏效果
      let element = document.getElementById("homeContent"); //设置后就是   id==con_lf_top_div 的容器全屏
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    /**
     * 工段下拉
     */
    searchWorkshopSectionSelect() {
      const param = {
        workshopId: this.userInfoLocal.principal.workshopId,
      };
      workshopSectionSelect(param).then((res) => {
        const data = res.data;
        this.workshopSectionSelectList = data;
      });
    },
    /**
     * 打开设置
     */
    openTools() {
      this.setDrawer = true;
      this.drawerDetail.title = "设置";
    },
    /**
     * 设置确定按钮
     */
    checkTools() {
      this.startTime = this.drawerDetail.times[0];
      this.endTime = this.drawerDetail.times[1];
      this.startMonth = this.drawerDetail.times[0];
      this.endMonth = this.drawerDetail.times[1];
      this.workorderInfo();
      this.handleClose();
    },
    clearCheckTools() {
      this.startTime = getTodoyTimes().startTime;
      this.endTime = getTodoyTimes().endTime;
      this.drawerDetail.times = [this.startTime, this.endTime];
      this.checkTools()
    },
    /**
     * 显示当前选择的时间
     */
    parseTimeFun() {
      return parseTime(this.startTime);
    },
    handleClick(tab, event) {
      this.maintenanceTimes(tab.name);
    },
  },
};
</script>
<style lang="scss" scoped>
.card {
  height: 1.5rem;
  color: #fff;
  line-height: 0.3rem;
}
.first-card {
  overflow: hidden;
  background-color: #fb9f51;
  text-align: center;
  .left,
  .right {
    width: 49%;
    height: 100%;
    line-height: 0.5rem;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .separator {
    width: 2px;
    height: 1rem;
    margin-left: 49%;
    background-color: #fff;
  }
}
.second-card {
  background-color: #287ff1;
  span {
    font-size: 0.14rem;
  }
  .failure-equipment {
    display: inline-block;
    width: 1.5rem;
  }
  .normal-equipment {
    display: inline-block;
    width: 1.5rem;
  }
}
.third-card {
  background-color: #37bb64;
  span {
    font-size: 0.14rem;
  }
  .not-reply {
    display: inline-block;
    width: 0.6rem;
  }
  .reply {
    display: inline-block;
    width: 1.5rem;
  }
}
.fourth-card {
  overflow: hidden;
  background-color: rgb(17, 87, 64);
  .list {
    float: left;
    width: 33%;
    height: 0.4rem;
    margin-top: 0.1rem;
    text-align: center;
    .small {
      font-size: 0.14rem;
    }
  }
}
.task-list {
  min-height: 160px;
  height: 2rem;
  .list-name {
    margin-bottom: 0.2rem;
  }
  .list-box {
    display: flex;
    justify-content: space-around;
    width: 100%;
    .progress {
      width: 100px;
      height: 1.2rem;
      overflow: hidden;
      position: relative;
      .overtime-work-order {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 0.6rem;
        text-align: center;
        p {
          font-size: 16px;
          color: #287ff1;
        }
        span {
          font-size: 12px;
          color: #8b8b8b;
        }
      }
    }
    .list-content {
      width: 130px;
      height: 1.4rem;
      .list-content-card {
        float: left;
        min-width: 64px;
        text-align: center;
      }
      .selected {
        color: #f68b2f;
      }
      p {
        font-size: 0.24rem;
      }
      span {
        font-size: 0.14rem;
        color: #8b8b8b;
      }
    }
  }
}
.large-failure {
  margin-top: 0.1rem;
}
.replacement-part {
  height: 5.5rem;
  h4 {
    margin-bottom: 10px;
  }
}
.unrequired-equipment {
  height: 5rem;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #fff;
  h4 {
    margin-bottom: 10px;
  }
}
.equipment-failure-chart,
.large-failure-chart {
  width: 100%;
  height: 1.8rem;
}
.replacement-part-chart {
  width: 100%;
  height: 4rem;
}

.s_tools {
  padding: 10px;
  position: absolute;
  top: 60px;
  right: 0px;
}
</style>