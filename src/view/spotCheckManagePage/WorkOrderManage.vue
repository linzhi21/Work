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
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
        >
          <template slot-scope="scope">
            <span class="button" @click="view(scope.row)">查看</span>
            <span class="button" @click="stop(scope.row)" v-if="scope.row.status == '待接单'">暂停</span>
            <span class="button" @click="view(scope.row)" v-if="scope.row.status == '已完成'">导出</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>
    <!-- 查看工单详情 -->
    <el-dialog :visible.sync="orderDetailIsShow" width="70%" title="查看">
      <el-row>
        <el-form :model="orderDetail" label-position="left" label-width="120px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="类型">
                <el-input v-model="orderDetail.type" disabled />
              </el-form-item>
            </el-col>
            <el-col :offset="13"></el-col>
            <el-col :span="11">
              <el-form-item label="点检计划编号">
                <el-input v-model="orderDetail.planNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="点检名称">
                <el-input v-model="orderDetail.planName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="点检工单编号">
                <el-input v-model="orderDetail.no" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="总工时">
                <el-input v-model="orderDetail.hour" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-for="(item,index) in orderDetail.workOrderDevices"
            :key="index"
            style="background: #f5f5f5;padding: 0.2rem"
          >
            <el-col :span="11">
              <el-form-item label="版本">
                <el-input v-model="item.version" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2" v-if="item.workSectionName">
              <el-form-item label="工位（工段）">
                <el-input v-model="item.workSectionName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2" v-if="item.workStationName">
              <el-form-item label="工位（工段）">
                <el-input v-model="item.workStationName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="工时">
                <el-input v-model="item.hour" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="设备(生产线)名称">
                <el-input v-model="item.deviceName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="编制人">
                <el-input v-model="item.creatorName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="编制日期">
                <el-input v-model="item.createDate" disabled />
              </el-form-item>
            </el-col>

            <!-- 表格区 -->
            <el-table :data="item.workOrderContents" style="width:100%" border>
              <el-table-column align="center" type="index" label="项目" width="50"></el-table-column>
              <el-table-column align="center" prop="executionNode" label="时间/部件" width="150"></el-table-column>
              <el-table-column align="center" prop="content" label="内容" width="300"></el-table-column>
              <el-table-column align="center" prop="hour" label="工时(s)"></el-table-column>
              <el-table-column align="center" prop="cycleName" label="周期" width="110"></el-table-column>
              <el-table-column align="center" prop="photoDisplay" label="图示"></el-table-column>
              <el-table-column align="center" prop="status" label="状态"></el-table-column>
            </el-table>
          </el-row>
        </el-form>
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
    // 类型列表
    const typeList = [
      { id: "1", label: "点检计划" },
      { id: "3", label: "日常保养" },
    ];
    let getListFuncs = [planStatusSelect];
    let [statusList] = getListFuncs.map((getListFunc) => {
      let arr = [];
      getListFunc(null).then((res) => {
        arr.push(...res.data);
      });
      return arr;
    });
    return {
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "点检工单编号", props: "no", value: "" },
        {
          label: "类型",
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
        { label: "点检计划名称", props: "planName", value: "" },
        { label: "点检计划编号", props: "planNo", value: "" },
      ],
      // 表格的数据
      equipmentTableData: [],
      // 渲染表格的表头
      equipmentTableList: [
        { props: "no", label: "点检工单编号" },
        // { props: "type", label: "类型"},
        { props: "planName", label: "点检计划名称", width: "200px" },
        { props: "planNo", label: "点检计划编号", width: "200px" },
        { props: "hour", label: "总工时" },
        { props: "createDate", label: "工单日期", width: "200px" },
        { props: "statusStr", label: "状态" },
      ],
      orderDetailIsShow: false, //查看工单详情
      //工单详情
      orderDetail: {},
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
      checkWorkOrder({ ...data, ...pageData }).then((res) => {
        this.total = res.data.totalElements;
        console.log(res)
        this.equipmentTableData = res.data.content;
      });
    },
    /** 查看 */
    view(row) {
      queryWorkorders(null, row.id).then((res) => {
        console.log(res)
        this.orderDetail = res.data;
      });
      this.orderDetailIsShow = true;
    },
    /** 暂停 */
    stop(row) {
      this.$confirm("暂停该工单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          queryWorkorders(null, row.id).then((res) => {
            this.form = res.data;
          });
          this.form.status = 8;
          stopWorkorders(this.form, row.id).then((res) => {
            console.log(res);
            this.getTableData();
            this.$message({
              type: "success",
              message: "重暂成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重暂!",
          });
        });
    },
  },
};
</script>
