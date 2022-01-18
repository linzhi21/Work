<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header
          ref="tpmsHeader"
          :formData="equipmentFormList"
          @inquireTableData="inquireTableData"
          label-width="90px"
          
        />
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <el-button @click="exportPlanChange" class="button-more" size="small">导出</el-button>
        </el-row>

        <!-- 底部表格 -->
        <tpms-table
          class="table-more"
          :column_index="true"
          ref="tpmsTable"
          :total="total"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
          @getTableData='getTableData'
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
import { checkPlanChanges } from "../../lib/api/checkPlan";
export default {
  data() {
    const typeList = [
        { label: "点检计划", id: "1" },
        { label: "日常保养", id: "2" },
    ];
    return {
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "计划编号", props: "planNo", value: "" },
        { label: "计划名称", props: "planName", value: "" },
        { label: "开始时间", props: "startTime", value: "", type: "dateFrame" },
        { label: "结束时间", props: "endTime", value: "", type: "dateFrame" },
      ],
      // 表格的数据
      equipmentTableData: [],
      equipmentTableList: [
        { props: "planNo", label: "计划编号" },
        { props: "oldPlanDeviceName", label: "设备名称", width: "140px" },
        { props: "oldPlanDeviceNo", label: "设备编号", width: "140px" },
        {
          label: "更改前内容",
          children: [
            { props: "oldExecutionPart", label: "保养部件", width: "100px" },
            { props: "oldExecutionNode", label: "保养位置", width: "100px" },
            { props: "oldContent", label: "保养内容细则", width: "100px" },
            { props: "oldCycleName", label: "保养周期", width: "100px" },
          ],
        },
        {
          label: "更改后内容",
          children: [
            { props: "newExecutionPart", label: "保养部件", width: "100px" },
            { props: "newExecutionNode", label: "保养位置", width: "100px" },
            { props: "newContent", label: "保养内容细则", width: "100px" },
            { props: "newCycleName", label: "保养周期", width: "100px" },
          ],
        },
        { props: "reason", label: "更改理由" },
        { props: "createDate", label: "变更日期" },
      ],
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
      // if(!data.type){
      //   this.$message.warning('请选择计划类型');
      //   return;
      // }
      let pageData = this.$refs.tpmsTable.getData();
      checkPlanChanges({ ...data, ...pageData, type: '1,2' }).then(res => {
        console.log(res);
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
        // console.log(this.equipmentTableData)
      });
    },
    exportPlanChange() {
      let data = this.$refs.tpmsHeader.getData();
      let url = `${apiConfig.plan}/planChanges/download`; //请求下载文件的地址

      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          params: {...data, type: "1,2"},
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
    }
  }
};
</script>

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