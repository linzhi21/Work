<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header
          ref="tpmsHeader"
          :formData="equipmentFormList"
          @inquireTableData="inquireTableData"
        />
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <!-- <el-button class="button-more" size="small">导出</el-button>
          <el-button
            class="button-more"
            type="primary"
            size="small"
            style="margin-right:30px"
            @click="add"
          >导入</el-button> -->
        </el-row>
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
        >
          <template slot-scope="scope">
            <span class="button cursor" @click="view(scope.row)">查看</span>
            <span class="button cursor" @click="edit(scope.row)">编辑</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>
    <!-- 编辑 -->
    <el-dialog :visible.sync="editIsShow" width="70%" title="编辑">
      <el-row>
        <el-form :model="editData" label-position="left" label-width="120px"></el-form>
      </el-row>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog :visible.sync="detailIsShow" width="70%" title="查看">
      <el-row>
        <el-form :model="detailData" label-position="left" label-width="120px"></el-form>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable } from "../../components";
import {
  checkWorkOrder,
  queryWorkorders,
  stopWorkorders,
  planStatusSelect,
} from "../../lib/api/checkPlan";
export default {
  data() {
    return {
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "备件编号", props: "no", value: "" },
        { label: "备件名称", props: "planName", value: "" },
        { label: "领用日期", props: "planNo", value: [], slotName: "time"},
      ],
      // 表格的数据
      equipmentTableData: [],
      // 渲染表格的表头
      equipmentTableList: [
        { props: "no", label: "领用日期", width: "200px" },
        { props: "type", label: "备件编号" },
        { props: "planName", label: "备件名称",},
        { props: "planNo", label: "型号规格", },
        { props: "hour", label: "原值" },
        { props: "createDate", label: "数量"},
        { props: "status", label: "用途类别" },
        { props: "status", label: "设备编号名称" },
        { props: "status", label: "领用人" },
        { props: "status", label: "备注" },
      ],
      detailIsShow: false,
      detailData: {},
      total: 0,
      editIsShow: false,
      editData: {},
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
  },
  mounted() {
    // this.getTableData();
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
      // console.log(data);
      let pageData = this.$refs.tpmsTable.getData();
      checkWorkOrder({ ...data, ...pageData }).then((res) => {
        // console.log(res);
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
      });
    },
    /** 查看 */
    view(row) {
      console.log(row);
      queryWorkorders(null, row.id).then((res) => {
        console.log(res);
        this.detailData = res.data;
      });
      this.detailIsShow = true;
    },
    /** 编辑 */
    edit(row) {
      console.log(row);
      queryWorkorders(null, row.id).then((res) => {
        console.log(res);
        this.editData = res.data;
      });
      this.editIsShow = true;
    },
  },
};
</script>