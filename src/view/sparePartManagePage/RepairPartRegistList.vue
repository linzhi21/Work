<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header
          ref="tpmsHeader"
          :formData="equipmentFormList"
          @inquireTableData="inquireTableData"
          label-width="100px"
        />
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <el-button @click="exportRepair" class="button-more" size="small">导出</el-button>
          <!-- <el-button
            class="button-more"
            type="primary"
            size="small"
            style="margin-right:30px"
            @click="add"
          >登记变更</el-button>-->
        </el-row>
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
          @getTableData="getTableData"
        >
          <template slot="operation" slot-scope="scope">
            <span class="button cursor" @click="view(scope.row)">查看</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>
    <!-- 修理备件登记对话框 -->
    <el-dialog title="备件损坏登记" :visible.sync="addIsShow" width="50%">
      <el-form class="spare-part-dialog-form" :model="repairPartDialogForm" label-width="180px">
        <el-form-item label="修理备件登记编号">
          <el-input v-model="repairPartDialogForm.repairPartRegistNumber" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="修理情况">
          <el-select v-model="repairPartDialogForm.repairStatus">
            <el-option
              v-for="(item,index) in repairStatusSelect"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修理日期">
          <el-input v-model="repairPartDialogForm.repairDate" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备件编号">
          <el-input v-model="repairPartDialogForm.sparePartNumber" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="repairPartDialogForm.sparePartName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-select v-model="repairPartDialogForm.type">
            <el-option
              v-for="(item,index) in typeSelect"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原值">
          <el-select v-model="repairPartDialogForm.originValue">
            <el-option
              v-for="(item,index) in originValueSelect"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-select v-model="repairPartDialogForm.number">
            <el-option
              v-for="(item,index) in numberSelect"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="鉴定人">
          <el-input v-model="repairPartDialogForm.appraiser" disabled></el-input>
        </el-form-item>
        <el-form-item label="鉴定日期">
          <el-input v-model="repairPartDialogForm.checkDate" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="repairPartDialog = false">
          <i class="el-icon-edit"></i>取消
        </el-button>
        <el-button @click="submitForm">
          <i class="el-icon-edit"></i>保存
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import apiConfig from "../../lib/api/apiConfig";
import { tpmsHeader, tpmsTable } from "../../components";
import {
  checkWorkOrder,
  queryWorkorders,
  stopWorkorders,
  planStatusSelect
} from "../../lib/api/checkPlan";

import { spairRrepair } from "../../lib/api/spart";
export default {
  data() {
    // 类型列表
    const typeList = [
      { id: "1", label: "委内维修" },
      { id: "2", label: "委外维修【框架内】" },
      { id: "4", label: "委外维修【框架外】" }
    ];
    // 类型列表
    const statusList = [
      { id: "1", label: "已修改" },
      { id: "2", label: "未修复" },
      { id: "3", label: "待审批" },
      { id: "4", label: "已退回" },
      { id: "5", label: "已完成" }
    ];
    function transType(params) {
      let result = "";
      switch (params) {
        case 1:
          result = "委内维修";
          break;
        case 2:
          result = "委外维修【框架内】";
          break;
        case 4:
          result = "委外维修【框架外】";
          break;
      }
      return result;
    }
    return {
      // 修理情况下拉选择框内容
      repairStatusSelect: [
        { label: "工业垃圾", value: "1" },
        { label: "报废备件", value: "2" },
        { label: "修复备件", value: "3" }
      ],
      // 规格型号下拉选择框内容
      typeSelect: [
        { label: "委内维修", value: "1" },
        { label: "委外维修", value: "2" }
      ],
      // 原值下拉选择框内容
      originValueSelect: [
        { label: "委内维修", value: "1" },
        { label: "委外维修", value: "2" }
      ],
      // 数量下拉选择框内容
      numberSelect: [
        { label: "委内维修", value: "1" },
        { label: "委外维修", value: "2" }
      ],

      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "备件名称", props: "spareName", value: "" },
        { label: "备件编号", props: "spareNo", value: "" },
        { label: "领用日期", props: "time", value: [], type: "timeFrame" },
        { label: "维修单号", props: "no" },
        {
          label: "维修方式",
          props: "type",
          value: "",
          type: "radio",
          checkList: typeList
        }

        // {
        //   label: "状态",
        //   props: "status",
        //   value: "",
        //   type: "radio",
        //   checkList: statusList,
        // },
      ],
      // 表格的数据
      equipmentTableData: [],
      // 渲染表格的表头
      equipmentTableList: [
        { props: "spareName", label: "备件名称", width: "200px" },
        { props: "spareNo", label: "备件编号" },
        { props: "no", label: "维修单号" },
        // { props: "startTime", label: "领用起始日期", width: "200px" },
        // { props: "endtime", label: "领用结束日期" },
        {
          props: "type",
          label: "维修方式",
          translate: transType,
          width: "150px"
        },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "120px"
        }
      ],
      detailIsShow: false, //详情
      addIsShow: false, //新增
      repairPartDialogForm: {},
      detailData: {},
      total: 0
    };
  },
  components: {
    tpmsHeader,
    tpmsTable
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    /** 点击查询按钮 */
    inquireTableData() {
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();

      this.getTableData();
    },
    /** 加载页面表格数据 */
    getTableData() {
      // 获取头部搜索组数据
      let data = this.$refs.tpmsHeader.getData();
      console.log(data);
      if (data.time) {
        let timeArr = data.time.split(",");
        data.startTime = timeArr[0];
        data.endTime = timeArr[1];
      } else {
        data.startTime = "";
        data.endTime = "";
      }
      delete data.time;
      let pageData = this.$refs.tpmsTable.getData();
      spairRrepair.getList({ ...data, ...pageData }).then(res => {
        // console.log(res);
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
      });
    },
    /** 查看 */
    view(row) {
      console.log(row);
      spairRrepair.getOne(null, row.id).then(res => {
        console.log(res);
        this.detailData = res.data;
      });
      this.detailIsShow = true;
    },
    /** 打开新增弹窗 */
    add(row) {
      this.addIsShow = true;
    },
    submitForm() {
      console.log(this.repairPartDialogForm);
    },
    exportRepair() {
      let url = `${apiConfig.spairRrepair}/export`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) return;

          let fileName = "备件修复记录.xlsx";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
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
        .catch(error => {
          this.$message.error(error.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.spare-part-dialog-form {
  width: 6rem;
  margin: 0 auto;
}
</style>