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
          <!-- <el-button class="button-more" size="small">导出</el-button> -->
        </el-row>

        <!-- 底部表格 -->
        <tpms-table
          class="table-more"
          ref="tpmsTable"
          :total="total"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
          @getTableData="getTableData"
        ></tpms-table>
        <!-- 底部表格 -->
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable } from "../../components";
import { checkPlanChanges } from "../../lib/api/checkPlan";
export default {
  data() {
    return {
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "巡检单编号", props: "planNo", value: "" }
      ],
      // 表格的数据
      equipmentTableData: [],
      equipmentTableList: [
        { props: "planNo", label: "巡检单编号" },
        {
          label: "更改前内容",
          children: [
            { props: "oldPlanDeviceNo", label: "设备(生产线)名称", width: "140px" },
            { props: "oldExecutionNode", label: "时间部件", width: "100px" },
            { props: "oldCycleName", label: "周期", width: "140px" },
            { props: "oldMethod", label: "方法", width: "140px" },
            { props: "oldContent", label: "内容" },
          ]
        },
        {
          label: "更改后内容",
          children: [
            { props: "newPlanDeviceNo", label: "设备(生产线)名称", width: "140px" },
            { props: "newExecutionNode", label: "时间部件", width: "100px" },
            { props: "newCycleName", label: "周期", width: "140px" },
            { props: "newMethod", label: "方法", width: "140px" },
            { props: "newContent", label: "内容" },
          ]
        },
        { props: "reason", label: "更改理由" },
        { props: "createDate", label: "变更日期" }
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
      let pageData = this.$refs.tpmsTable.getData();
      checkPlanChanges({ ...data, ...pageData, type: '3' }).then(res => {
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
      });
    }
  }
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