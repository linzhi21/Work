<template>
  <!-- 巡检记录卡 -->
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header
          ref="tpmsHeader"
          :formData="formList"
          @inquireTableData="inquireTableData"
          label-width="90px"
        />
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <el-button @click="exportPlanChange" class="button-more" size="small"
            >导出</el-button
          >
        </el-row>

        <!-- 底部表格 -->
        <tpms-table
          class="table-more"
          ref="tpmsTable"
          :total="total"
          :data="tableData"
          :columns="tableList"
          @inquireTableData="inquireTableData"
          @getTableData="getTableData"
          @selection-change="handleSelectionChange"
        ></tpms-table>
        <!-- 底部表格 -->
      </el-card>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
import apiConfig from "../../lib/api/apiConfig";
import { tpmsHeader, tpmsTable } from "../../components";
import { workOrderCompletionController } from "../../lib/api/checkPlan";
export default {
  data() {
    return {
      formList: [
        //  渲染头部功能区的列表
        { label: "资产编号", props: "deviceNo", value: "" },
        { label: "设备名称", props: "deviceName", value: "" },
        { label: "计划编号", props: "no", value: "" },
        { label: "计划名称", props: "name", value: "" },
        {
          label: "年份",
          props: "year",
          value: "",
          type: "dateFrame",
          date: "year",
          format: "yyyy",
        },
        {
          label: "月份",
          props: "month",
          value: "",
          type: "dateFrame",
          date: "month",
          format: "MM",
        },
      ],
      // 表格的数据
      tableData: [],
      tableList: [
        { type: "selection" },
        { props: "no", label: "计划编号" },
        { props: "name", label: "计划名称" },
        { props: "deviceName", label: "设备名称", width: "140px" },
        { props: "deviceNos", label: "资产编号", width: "140px" },
        { props: "positionName", label: "位置", width: "140px" },
        { props: "hour", label: "工时", width: "140px" },
      ],
      total: 0,
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
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
      let pageData = this.$refs.tpmsTable.getData();
      workOrderCompletionController({ ...data, ...pageData }, 'maintain').then(
        (res) => {
          this.total = res.data.totalElements;
          this.tableData = res.data.content;
        }
      );
    },
    exportPlanChange() {
      let data = this.$refs.tpmsHeader.getData();
      if (data.month) {
        data.month = parseInt(data.month);
      } else {
        this.$message({
          type: "info",
          message: "请选择 年 - 月",
        });
        return;
      }
      const selected = this.$refs.tpmsTable.getSelectionList();
      const ids = selected.map((item) => item.completionId);
      data.completionIds = ids.join(",");

      let url = `${apiConfig.workOrderCompletion}/maintain/download`; //请求下载文件的地址

      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          params: { ...data },
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
    handleSelectionChange(e) {
      let arr = [];
      for (var i = 0; i < e.length; i++) {
        arr.push(e[i].id);
      }
      arr.join(",");
    },
  },
};
</script

<style lang="scss">
.table-more{
  table {
    tr {
      th {
        background: #a6bbc8!important;
      }
    }
  }
}
</style>