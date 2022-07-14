<template>
  <div>
    <!-- 头部功能区 -->
    <tpms-header
      ref="tpmsHeader"
      :formData="equipmentFormList"
      @inquireTableData="inquireTableData"
      label-width="100px"
      @onValueChanged="onValueChanged"
    />
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button @click="getMaintainOverview" class="button-more" size="small"
        >导出设备保养概览</el-button>
      <el-button @click="exportWorkOrders" class="button-more" size="small"
        >导出车间设备保养实施表</el-button>
      <tpms-choosefile plain text="指派工单" isMutiple @getFileData="importThisMonthMaintainWorkOrder($event)"></tpms-choosefile>
    </el-row>

    <!-- 表格 -->
    <el-row>
      <el-card>
        <tpms-table
          :column_index="true"
          ref="tpmsTable"
          :total="total"
          :data="listData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
          @getTableData="getData"
        >
          <template slot="status" slot-scope="{ row }">
            <span>{{ statusTranslate(row.status) }}</span>
          </template>
          <template slot="operation" slot-scope="{ row }">
            <span class="button cursor" @click="showPlanDetail(row)">查看</span>
            <span class="button cursor" @click="showPlanDetail(row, 'approval')">审批</span>
            <span class="button cursor" @click="getDeviceMaintain(row)"
              >导出记录卡</span
            >
            <span class="button cursor" @click="previewNowMonthWorkOrder(row)"
              >月度情况</span
            >
            <span
              class="button cursor"
              v-if="row.overdue === 1"
              @click="turnOn(row)"
              >激活</span
            >
          </template>
        </tpms-table>
      </el-card>
    </el-row>
    <!-- 详情 -->
    <el-dialog title="查看详情" :visible.sync="detailModal" width="80%">
      <!-- 头部表单 -->
      <el-row style="margin-top: 40px">
        <el-form
          :model="detail"
          ref="form"
          label-width="140px"
          label-position="left"
        >
          <el-row>
            <el-col :span="11">
              <el-form-item label="保养工单" required="required">
                <el-input v-model="detail.no" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="计划名称" required="required">
                <el-input v-model="detail.planName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="计划编号" required="required">
                <el-input v-model="detail.planNo" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
                <el-button v-if="approvalBtn" @click="approval(detail)" type="primary" size="small">审批</el-button>
              <!-- <el-form-item label="审批状态" required="required">
                <el-input v-model="detail.status" readonly></el-input>
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row
            v-for="(v, i) in detail.maintainWorkOrderColonies"
            :key="i"
            style="background: #f5f5f5; padding: 0.2rem"
          >
            <el-col :span="11">
              <el-form-item label="设备名称" required="required">
                <el-input v-model="v.deviceNames" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="设备编号" required="required">
                <el-input v-model="v.deviceAssetNo" readonly></el-input>
              </el-form-item>
            </el-col>

            <el-table
              :data="v.maintainWorkOrderContents"
              style="width: 100%"
              border
              row-key="id"
              default-expand-all
              :tree-props="{
                children: 'childPlanContents',
                hasChildren: 'hasChildren',
              }"
            >
              <el-table-column
                align="center"
                type="index"
                label="项目"
                width="80"
              ></el-table-column>
              <el-table-column align="center" label="保养部位" width="150">
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{
                    scope.row.executionPart
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养位置">
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{
                    scope.row.executionNode
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养内容">
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{
                    scope.row.content
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="周期">
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{
                    scope.row.cycleName
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养结果">
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{
                    scope.row.result
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="异常记录">
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{
                    scope.row.exception
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row>
            <el-col :span="24">
             
            </el-col>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  maintainWorkOrder, //工单
  maintainWorkOrderDetail,
  updateMaintainWorkOrder,
  generate,
  exportWorkOrders,
  exportNowMonthWorkOrder,
  previewNowMonthWorkOrder,
  importThisMonthMaintainWorkOrder,
  approvalMaintainWorkorder
} from "../../lib/api/upkeepManagePage";
import { tpmsHeader, tpmsTable, tpmsChoosefile } from "../../components";
import {
  factoryManage,
  workshopManage,
  workStationManage,
  workshopSectionManage,
} from "../../lib/api/workshopSettingsManage";
import apiConfig from "../../lib/api/apiConfig";
import axios from "axios";
import { log } from '../../../environment.dev';
export default {
  data() {
    //待接单就是1,待处理就是2、3和7,审批中是4,5,已完成就是6，9异常
    const statusList = [
      { label: "待接单", id: "1" },
      { label: "待处理", id: "2,3,7" },
      { label: "审批中", id: "4,5" },
      { label: "已完成", id: "6" },
      { label: " 异常 ", id: "9", },
    ];
    // 获取头部搜索组下拉选择的list
    let getListFuncs = [
      factoryManage.getNames, //工厂
      // workshopManage.getNames,//车间
      // workStationManage.getNames,//工位
      // workshopSectionManage.getNames,//工段
    ];
    let [factoryList /** workshopList, stationList, sectionList */] =
      getListFuncs.map((getListFunc) => {
        let arr = [];
        getListFunc(null).then((res) => {
          arr.push(...res.data);
        });
        return arr;
      });
    return {
      equipmentFormList: [
        {
          label: "工厂",
          props: "factoryId",
          value: "",
          type: "radio",
          checkList: factoryList,
        },
        {
          label: "车间",
          props: "workshopId",
          value: "",
          type: "radio",
          checkList: [],
        },
        { label: "设备名称", props: "deviceName", value: "" },
        { label: "设备编号", props: "deviceNo", value: "" },
        { label: "资产编号", props: "deviceAssetNo", value: "" },
        { label: "计划名称", props: "planName", value: "" },
        {
          label: "工单状态",
          props: "status",
          value: "",
          type: "radio",
          checkList: [
            { label: "未指派", id: "0" },
            { label: "待接单", id: "1" },
            { label: "待处理", id: "2" },
            { label: "审批中", id: "4" },
            { label: "已完成", id: "6" },
            { label: " 异常 ", id: "9", },
          ],
        },
        {
          label: "执行结果",
          props: "result",
          value: "",
          type: "radio",
          checkList: [
            { label: "未处理", id: "1" },
            { label: "正常", id: "2" },
            { label: "异常", id: "3" },
            { label: "停用", id: "4" },
          ],
        },
        { label: "指派时间", props: "exceptTime", value: "" },
      ],
      listData: [],
      equipmentTableList: [
        { props: "deviceName", label: "设备名称" },
        { props: "deviceAssetNo", label: "资产编号" },
        { props: "workshopSectionName", label: "工段" },
        { props: "statusStr", label: "工单状态" },
        { props: "resultStr", label: "执行结果" },
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
          width: "200px",
          fixed: "right",
        },
      ],
      total: 0,
      detailModal: false,
      detail: {},
      approvalBtn: false
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,tpmsChoosefile
  },
  mounted() {
    // 从设备履历页面跳转到这里带入设备编号
    const { deviceNo = "" } = this.$route.query;
    if (deviceNo) {
      this.equipmentFormList.forEach((item) => {
        if (item.props === "deviceNo") item.value = deviceNo;
      });
    }

    this.getData();
  },
  methods: {
    showPlanDetail(row, type) {
      let { id } = row;
      maintainWorkOrderDetail(null, id).then((res) => {
        console.log(res);
        let data = res.data;
        data.status = this.statusTranslate(data.status);
        this.detail = res.data;
        this.detailModal = true;
        if(type === 'approval') {this.approvalBtn = true} 
        else {this.approvalBtn = false}
      });
    },
    editWorkorders() {},
    /** 表格状态码转文字 */
    statusTranslate(val) {
      if (val == 1) return "待接单";
      if (val == 2 || val == 3 || val == 7) return "待处理";
      if (val == 4 || val == 5) return "审批中";
      if (val == 6) return "已完成";
      if (val == 9) return "异常";
    },
    /**
     * @description 点击头部按钮查询
     */
    inquireTableData() {
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getData();
    },
    getData() {
      let data = this.$refs.tpmsHeader.getData();
      let pageData = this.$refs.tpmsTable.getData();
      console.log(data);
      maintainWorkOrder({ ...data, ...pageData }).then((res) => {
        this.listData = res.data.content;
        this.total = res.data.totalElements;
      });
    },
    /** 头部value变更回调 */
    onValueChanged({ props, value }) {
      const { equipmentFormList } = this;
      if (props === "factoryId") {
        // 选择工厂，重置车间及以下
        workshopManage.getNames({ factoryId: value }).then((res) => {
          equipmentFormList.forEach((item) => {
            if (item.props === "workshopId") {
              item.checkList = res.data;
              item.value = "";
            }
          });
        });
      }
    },
    /**
     * 激活工单
     */
    turnOn(row) {
      this.$confirm("此操作将重新激活该工单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateMaintainWorkOrder({ status: 10 }, row.id).then((res) => {
            this.inquireTableData();
            this.$message({
              type: "success",
              message: "激活成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消激活",
          });
        });
    },
    /**
     * @description 导出车间设备保养实施表
     */
    exportWorkOrders() {
      // let url = apiConfig.maintainWorkOrder + "/export"; //请求下载文件的地址
      let url = apiConfig.maintainWorkOrder + "/getThisMonthMaintainWorkOrder"; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: "Bearer " + token
        },
      })
        .then((res) => {
          if (!res) return;
          let fileName = '车间设备保养实施表.xls';
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
        .catch((error) => {
          this.$message.error(error);
        });
    },
    /**
     * @description 导入指派工单
     */
    importThisMonthMaintainWorkOrder(fileList) {
      let formData = new FormData();
      fileList.map(file => formData.append('file', file))
      console.log(formData)
      importThisMonthMaintainWorkOrder(formData).then(
        () => {
          this.$message.success("指派成功");
          this.inquireTableData();
        }
      ).catch(err => this.$message.error(err))
    },
    /**
     * @description 导出设备保养概览
     * @param row 工单对象
     */
    getMaintainOverview() {
      let url = apiConfig.maintainWorkOrder + "/getMaintainOverview"; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios.get(url, {
        responseType: 'blob',
        headers: {
          Authorization: "Bearer " + token
        },
      }).then((res) => {
          if (!res) return;
          let fileName = '设备保养概览.xls';
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
        .catch((error) => {
          this.$message.error(error);
        });
    },
    /**
     * @description 预览当月工单情况
     * @param row 工单对象
     */
    previewNowMonthWorkOrder(row) {
      previewNowMonthWorkOrder({workOrderId: row.id})
        .then((res) => {
          if (!res) return;
          let data = res.data.split(',');
          let path = '';
          let name = '';
          data.forEach(s => {
            if (s.indexOf('name=') > -1) name = s.split('=')[1];
            if (s.indexOf('path=') > -1) path = s.split('=')[1];
          });
          window.open(`${apiConfig.accessoryFile}/${path}${name}`);
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
     /**
     * @description 导出设备保养记录卡
     * @param maintainWorkOrderId 工单Id
     */
    getDeviceMaintain(row) {
      let url = apiConfig.maintainWorkOrder + "/getDeviceMaintain"; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios.get(url, {
        params: {maintainWorkOrderId: row.id},
        responseType: 'blob',
        headers: {
          Authorization: "Bearer " + token
        },
      }).then((res) => {
          if (!res) return;
          let fileName = '设备保养记录卡.xls';
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
        .catch((error) => {
          this.$message.error(error);
        });
    },
    /**
     * 审批
     */
    approval(row) {
      let id = row.id
      approvalMaintainWorkorder({status: 5},id).then(res => {
        this.$message.success('审批成功！');
        this.getData();
        this.detailModal = false;
      }).catch(err => {
        this.$message.error('审批失败！');
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.spare-part-dialog-form {
  width: 4.3rem;
  margin: 0 auto;
}
.upkeep-form {
  padding: 0.1rem 1rem;
}
.upkeep-line {
  padding: 0 0.4rem;
  border-bottom: 2px dashed #e9e9e9;
  line-height: 40px;
}
.upkeep-item-right {
  float: right;
  width: 2.5rem;
}
.upkeep-item-left {
  float: left;
}
.new-add-button {
  margin-left: 3rem;
}
.color-blue {
  color: #0077c8;
}
.el-select {
  width: 100%;
}
</style>
