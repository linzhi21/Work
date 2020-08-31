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
          <el-button class="button-more" size="small">导出</el-button>
          <el-button
            class="button-more"
            type="primary"
            size="small"
            style="margin-right:30px"
            @click="add"
          >登记变更</el-button>
        </el-row>
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
        >
          <template slot-scope="scope">
            <span class="button" @click="view(scope.row)">查看</span>
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
import { tpmsHeader, tpmsTable } from "../../components";
import {
  checkWorkOrder,
  queryWorkorders,
  stopWorkorders,
  planStatusSelect,
} from "../../lib/api/checkPlan";
export default {
  data() {
       // 类型列表
      const typeList= [
        { id: "1", label: "类型1" },
        { id: "2", label: "类型2" },
      ];
      // 类型列表
      const statusList= [
        { id: "1", label: "已修改" },
        { id: "2", label: "未修复" },
        { id: "3", label: "待审批" },
        { id: "4", label: "已退回" },
        { id: "5", label: "已完成" },
      ];
    return {
      // 修理情况下拉选择框内容
      repairStatusSelect: [
        { label: "工业垃圾", value: "1" },
        { label: "报废备件", value: "2" },
        { label: "修复备件", value: "3" },
      ],
      // 规格型号下拉选择框内容
      typeSelect: [
        { label: "委内维修", value: "1" },
        { label: "委外维修", value: "2" },
      ],
      // 原值下拉选择框内容
      originValueSelect: [
        { label: "委内维修", value: "1" },
        { label: "委外维修", value: "2" },
      ],
      // 数量下拉选择框内容
      numberSelect: [
        { label: "委内维修", value: "1" },
        { label: "委外维修", value: "2" },
      ],
     
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "备件名称", props: "sparePartName", value: "" },
        { label: "备件编号", props: "sparePartNumber", value: "" },
        { label: "处理日期", props: "applyDate", value: [], slotName: "time" },
        {
          label: "处理类型",
          props: "type",
          value: "",
          type: "radio",
          checkList: typeList,
        },
        {
          label: "状态",
          props: "status",
          value: "",
          type: "radio",
          checkList: statusList,
        },
      ],
      // 表格的数据
      equipmentTableData: [],
      // 渲染表格的表头
      equipmentTableList: [
        { props: "no", label: "修理备件登记编号" , width: "200px"},
        { props: "type", label: "部门" },
        { props: "createDate", label: "修理日期", width: "200px" },
        { props: "planName", label: "备件编号" },
        { props: "planNo", label: "备件名称" },
        { props: "hour", label: "型号规格" },
        { props: "hour", label: "原值" },
        { props: "hour", label: "数量" },
        { props: "hour", label: "处理类型" },
        { props: "hour", label: "处理日期", width: "200px" },
        { props: "status", label: "状态" },
      ],
      detailIsShow: false, //详情
      addIsShow: false, //新增
      repairPartDialogForm: {},
      detailData: {},
      total: 0,
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
    /** 打开新增弹窗 */
    add(row) {
      this.addIsShow = true;
    },
    submitForm() {
      console.log(this.repairPartDialogForm);
    },
  },
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