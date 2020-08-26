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
          <el-button class="button-more" size="small" style="margin-right:30px">导出</el-button>
        </el-row>

        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :total="total"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
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
            { props: "deviceName", label: "设备(生产线)名称", width: "140px" },
            {
              props: "stationName",
              label: "工位(工段)",
              translate: (val, row) => row.stationName || row.sectionName,
              width: "100px"
            },
            { props: "oldExecutionNode", label: "巡检部位" },
            { props: "oldHour", label: "工时" },
            { props: "oldContent", label: "巡检内容" },
            { props: "oldCycle", label: "周期" }
          ]
        },
        {
          label: "更改后内容",
          children: [
            { props: "deviceName", label: "设备(生产线)名称", width: "140px" },
            {
              props: "stationName",
              label: "工位(工段)",
              translate: (val, row) => row.stationName || row.sectionName,
              width: "100px"
            },
            { props: "newExecutionNode", label: "巡检部位" },
            { props: "newHour", label: "工时" },
            { props: "newContent", label: "巡检内容" },
            { props: "newCycle", label: "周期" }
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
      checkPlanChanges({ ...data, ...pageData }).then(res => {
        console.log(res);
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
        // console.log(this.equipmentTableData)
      });
    }
  }
};
</script>
