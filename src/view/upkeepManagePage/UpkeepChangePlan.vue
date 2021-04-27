<template>
  <div>
    <el-row>
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
          :column_index="true"
          ref="tpmsTable"
          :total="total"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
          @getTableData='getTableData'
        ></tpms-table>
    </el-row>
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable } from "../../components";
import { maintainPlanChanges } from "../../lib/api/upkeepManagePage";
export default {
  data() {
    return {
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "保养单编号", props: "planNo", value: "" }
      ],
      // 表格的数据
      equipmentTableData: [],
      equipmentTableList: [
        { props: "planNo", label: "保养单编号" },
        {
          label: "更改前内容",
          children: [
            { props: "oldPlanDeviceNo", label: "设备编号", width: "140px" },
            { props: "oldExecutionPart", label: "保养部位", width: "100px" },
            { props: "oldExecutionNode", label: "保养位置", width: "100px" },
            { props: "oldContent", label: "保养内容", width: "100px" },
            { props: "oldCycleName", label: "计划名称", width: "100px" },
            { props: "oldCycle", label: "计划ID", width: "100px" },
          ]
        },
        {
          label: "更改后内容",
          children: [
            { props: "newPlanDeviceNo", label: "设备编号", width: "140px" },
            { props: "newExecutionPart", label: "保养部位", width: "100px" },
            { props: "newExecutionNode", label: "保养位置", width: "100px" },
            { props: "newContent", label: "保养内容", width: "100px" },
            { props: "newCycleName", label: "计划名称", width: "100px" },
            { props: "newCycle", label: "计划ID", width: "100px" },
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
      console.log(data);
      let pageData = this.$refs.tpmsTable.getData();
      maintainPlanChanges({ ...data, ...pageData }).then(res => {
        console.log(res);
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
        // console.log(this.equipmentTableData)
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