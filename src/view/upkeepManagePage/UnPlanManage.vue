<template>
  <div>
    <el-row>
      <!-- 头部功能区 -->
      <tpms-header
        ref="tpmsHeader"
        :formData="equipmentFormList"
        @inquireTableData="inquireTableData"
        label-width="75px"
        @onValueChanged="onValueChanged"
      />
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button class="button-more" type="primary" size="small" @click="add"
          >新增计划</el-button
        >
        <!-- <tpms-choosefile
          plain
          text="新增计划"
          isMutiple
          @getFileData="getFileData($event)"
        ></tpms-choosefile> -->
      </el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :total="total"
        :data="equipmentTableData"
        :columns="[
          { type: 'selection' },
          { props: 'deviceName', label: '设备名称' },
          { props: 'deviceAssetNo', label: '资产编号' },
          { props: 'workshopSectionName', label: '位置/工段' },
          { props: 'statusStr', label: '状态' },
          { props: 'receiverName', label: '接单人' },
          { props: 'completeTime', label: '完成时间', width: '200px' },
          { props: 'createDate', label: '工单日期', width: '200px' },
          { props: 'no', label: '点检工单编号' },
          { props: 'planName', label: '点检计划名称', width: '200px' },
          { props: 'planNo', label: '点检计划编号', width: '200px' },
          { props: 'hour', label: '总工时' },
        ]"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
        @selection-change="handleSelectionChange"
      >
      </tpms-table>
    </el-row>

    <EditModule
      @changeDialog="changeDialog"
      :dialog="newAddDialog"
      :dialogTitle="dialogTitle"
    />
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable, tpmsChoosefile } from "../../components";
import EditModule from "./comp/EditModule.vue";
import {
  workshopSectionSelect,
  workStationSelect,
  planStatusSelect,
  workshopAreaManage,
  workshopManage,
  cycleSelect,
} from "../../lib/api/checkPlan";

import {
  maintainWorkOrder, //查看保养工单
} from "../../lib/api/upkeepManagePage.js";
import {
  factoryManage,
  workshopManage as workshopManageAll,
  workStationManage,
  workshopSectionManage,
} from "../../lib/api/workshopSettingsManage";
export default {
  components: {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile,
    EditModule,
  },
  data() {
    let getListFuncs = [
      planStatusSelect, //状态
      factoryManage.getNames, //工厂
    ];
    let [statusList, factoryList] = getListFuncs.map((getListFunc) => {
      let arr = [];
      getListFunc(null).then((res) => {
        arr.push(...res.data);
      });
      return arr;
    });
    return {
      equipmentFormList: [
        { label: "名称", props: "name", value: "" },
        {
          label: "工厂",
          props: "factoryId",
          value: "",
          type: "radio",
          checkList: factoryList,
        },
        {
          label: "车间",
          props: "workshopId",
          value: "",
          type: "radio",
          checkList: [],
        },
        { label: "设备名称", props: "deviceName", value: "" },
        { label: "资产编号", props: "deviceAssetNo", value: "" },
        {
          label: "状态",
          props: "status",
          value: "",
          type: "radio",
          checkList: statusList,
        },
      ],
      total: 0,
      // 表格的数据
      equipmentTableData: [],
      newAddDialog: false,
      dialogTitle: "新增",
    };
  },
  mounted() {
    this.getTableData();
    // this.getDeviceList();
  },
  methods: {
    /**查询*/
    inquireTableData() {
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getTableData();
    },
    /** 加载页面表格数据 */
    getTableData() {
      // 获取头部搜索组数据
      let data = this.$refs.tpmsHeader.getData();
      data.isTem = 1; // 临时工单条件
      let pageData = this.$refs.tpmsTable.getData();
      maintainWorkOrder({ ...data, ...pageData }).then((res) => {
        // console.log({ ...data, ...pageData})
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
      });
    },
    /** 头部value变更回调 */
    onValueChanged({ props, value }) {
      if (props === "factoryId") {
        // 选择工厂，重置车间
        workshopManageAll.getNames({ factoryId: value }).then((res) => {
          this.equipmentFormList.forEach((item) => {
            if (item.props === "workshopId") {
              item.checkList = res.data;
              item.value = "";
            }
          });
        });
      }
    },
    /**
     * 新增
     */
    add() {
      this.changeDialog(true);
    },
    /**
     * @description 导入单个文件
     */
    getFileData(files) {
      this.loading = true;
      let formData = new FormData();
      files.map((file) => formData.append("file", file));
      importTemporary(formData)
        .then((res) => {
          // console.log(res,item)
          let datas = res.data;
          this.form;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /**
     * 多选
     */
    handleSelectionChange(e) {
      // console.log(e)
      let arr = [];
      for (var i = 0; i < e.length; i++) {
        arr.push(e[i].id);
      }
      this.planId = arr.join(",");
    },
    /**
     * 模态框状态控制
     * @param name 模态框名称
     * @param dialog 模态框状态
     */
    changeDialog(dialog) {
      console.log(1234567);
      this.newAddDialog = dialog;
      this.getTableData();
    },
  },
};
</script>
<style>
</style>