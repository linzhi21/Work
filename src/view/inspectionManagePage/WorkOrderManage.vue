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
          @onValueChanged="onValueChanged"
        />
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
          @getTableData="getTableData"
          :total='total'
        >
          <template slot="operation" slot-scope="scope">
            <span class="button cursor" @click="view(scope.row, '查看')">查看</span>
            <span
              class="button cursor"
              @click="view(scope.row, '审批')"
              v-if="scope.row.statusStr == '待审批'"
              >审批</span
            >
            <span class="button cursor" @click="stop(scope.row)" v-if="scope.row.status == '待接单'">暂停</span>
            <span class="button cursor" @click="view(scope.row)" v-if="scope.row.status == '已完成'">导出</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>
    <!-- 查看工单详情 -->
    <el-dialog :visible.sync="orderDetailIsShow" width="70%" :title="title">
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
              <el-form-item label="巡检计划编号">
                <el-input v-model="orderDetail.planNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="巡检名称">
                <el-input v-model="orderDetail.planName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="巡检工单编号">
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
            <el-col :span="11" v-if="item.workStationName">
              <el-form-item label="工位（工段）">
                <el-input v-model="item.workStationName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="工时">
                <el-input v-model="item.hour" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="设备(生产线)名称">
                <el-input v-model="item.deviceName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="编制人">
                <el-input v-model="item.creatorName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11">
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
      <div
        v-if="title === '审批'"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="orderDetailIsShow = false">取 消</el-button>
        <el-button type="warning" @click="approval(orderDetail, 7)"
          >驳回</el-button
        >
        <el-button type="primary" @click="approval(orderDetail, 5)"
          >审批通过</el-button
        >
      </div>
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
  updateOrderStatus
} from "../../lib/api/checkPlan";
import {
  factoryManage,
  workshopManage,
  workStationManage,
  workshopSectionManage,
} from "../../lib/api/workshopSettingsManage";
export default {
  data() {
    //待接单就是1,待处理就是2、3和7,审批中是4,5,已完成就是6
    const statusList = [
      { label: "待接单", id: "1" },
      { label: "待处理", id: "2,3,7" },
      { label: "审批中", id: "4,5" },
      { label: "已完成", id: "6", },
    ];
    let getListFuncs = [
      factoryManage.getNames,//工厂
      workshopManage.getNames,//车间
      workStationManage.getNames,//工位
      workshopSectionManage.getNames,//工段
    ];
    let [factoryList, workshopList, stationList, sectionList] = getListFuncs.map((getListFunc) => {
      let arr = [];
      getListFunc(null).then((res) => {
        arr.push(...res.data);
      });
      return arr;
    });
    /** 表格状态码转文字 */
    function statusTranslate(val){
      if(val == 1) return "待接单";
      if(val == 2 || val == 3 || val ==7) return "待处理";
      if(val == 4 || val ==5) return "审批中";
      if(val == 6) return "已完成";
    };
    return {
      equipmentFormList: [
        { label: "工厂", props: "factoryId", type: "radio", checkList: factoryList },
        { label: "车间", props: "workshopId", type: "radio", checkList: [] },
        { label: "工段", props: "workshopSectionId", type: "radio", checkList: [] },
        { label: "工位", props: "workStationId", type: "radio", checkList: [] },
        // { label: "状态", props: "status", value: "", type: "radio", checkList: statusList },
        // { label: "工位/工段", props: "positionName" },
        { label: "设备编号", props: "deviceNo", value: "" },
        { label: "资产编号", props: "deviceAssetNo", value: "" },
        { label: "开始时间", props: "startTime", type: "dateFrame", value: "" },
        { label: "结束时间", props: "endTime", type: "dateFrame", value: "" },
        { label: "巡检计划编号", props: "planNo", value: "" },
      ],
      // 表格的数据
      equipmentTableData: [],
      // 渲染表格的表头
      equipmentTableList: [
        { props: "type", label: "类型"},
        { props: "status", label: "状态", translate: statusTranslate},
        { props: "deviceName", label: "设备名称"},
        { props: "deviceAssetNo", label: "资产编号"},
        { props: "workshopSectionName", label: "工段"},
        { props: "receiverName", label: "接单人" },
        { props: "completeTime", label: "完成时间", width: "200px" },
        { props: "createDate", label: "工单日期", width: "200px" },
        { props: "no", label: "点检工单编号" },
        { props: "planName", label: "点检计划名称", width: "200px" },
        { props: "planNo", label: "点检计划编号", width: "200px" },
        { props: "hour", label: "总工时" },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "100px",
        }
      ],
      orderDetailIsShow: false, //查看工单详情
      //工单详情
      orderDetail: {},
      total: 0,
      title: '查看',
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
      checkWorkOrder({ ...data, ...pageData, type: '3' }).then((res) => {
        this.total = res.data.totalElements;
        console.log(res)
        this.equipmentTableData = res.data.content;
      });
    },
    /** 头部value变更回调 */
    onValueChanged({props, value}) {
      const { equipmentFormList } = this;
      if(props === 'factoryId'){
        // 选择工厂，重置车间及以下
        workshopManage.getNames({factoryId: value}).then(res => {
          equipmentFormList.forEach(item => {
            if(item.props === 'workshopId'){
              item.checkList = res.data;
              item.value = '';
            };
            if(item.props === 'workshopSectionId' || item.props === 'workStationId'){
              item.value = '';
              item.checkList = [];
            }
          })
        });
      };

      if(props === 'workshopId'){
        // 选择车间，重置工段及以下
        workshopSectionManage.getNames({workshopId: value}).then(res => {
          equipmentFormList.forEach(item => {
            if(item.props === 'workshopSectionId'){
              item.checkList = res.data;
              item.value = '';
            };
            if(item.props === 'workStationId'){
              item.value = '';
              item.checkList = [];
            }
          })
        });
      };

      if(props === 'workshopSectionId'){
        // 选择工段，重置工位
        workshopSectionManage.getNames({workshopSectionId: value}).then(res => {
          equipmentFormList.forEach(item => {
            if(item.props === 'workStationId'){
              item.checkList = res.data;
              item.value = '';
            }
          })
        });
      };
    },
    /** 查看 */
    view(row, title) {
      queryWorkorders(null, row.id).then((res) => {
        console.log(res)
        this.orderDetail = res.data;
      });
      this.orderDetailIsShow = true;
      this.title = title;
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
    
    /**
     * 审批
     */
    approval(row, status) {
      const data = {
        ids: [row.id],
        status: status,
      };
      updateOrderStatus(data)
        .then((res) => {
          this.$message({
            type: "success",
            message: "审批成功!",
          });
          this.orderDetailIsShow = false;
        })
        .catch((e) => {
          this.$message({
            type: "error",
            message: e.message,
          });
          this.orderDetailIsShow = false;
        });
    },
  },
};
</script>
