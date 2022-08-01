<template>
  <!-- 维修管理 -->
  <div>
    <el-row>
      <!-- 头部功能区 -->
      <tpms-header ref="tpmsHeader" :formData="equipmentFormList" @inquireTableData="inquireTableData" />
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button class="button-more" size="small" style="margin-left: 20px" @click="download">导出</el-button>
        <el-button class="button-more" type="primary" size="small" @click="showAddModal">新增报修</el-button>
      </el-row>
      <!-- 底部表格 -->
      <tpms-table :column_index="true" ref="tpmsTable" :data="tableLists" :total="total" :columns="[
        { props: 'no', label: '维修单号' },
        { props: 'workshopName', label: '车间', width: 100 },
        { props: 'deviceNo', label: '设备编号' },
        { props: 'deviceName', label: '设备名称' },
        { props: 'applicantName', label: '委托人' },
        { props: 'receiverName', label: '接单人' },
        {
          props: 'status',
          label: '状态',
          translate: (value) => {
            if (value == 1) value = '待接单';
            if (value == 2 || value == 32) value = '已接单';
            if (value == 4 || value == 8) value = '待审批';
            if (value == 16) value = '已完成';
            return value;
          },
        },
        { props: 'workshopSectionName', label: '工段' },
        { props: 'areaName', label: '报修区域' },
        { props: 'content', label: '故障描述' },
        {
          props: 'stopLine',
          label: '是否停线修理',
          translate: (value) => (value ? '是' : '否'),
          width: 120,
        },
        { props: 'breakdownTime', label: '报修时间', width: 120 },
        {
          label: '操作',
          slotName: 'operation',
          fixed: 'right',
          width: '120px',
        },
      ]" @inquireTableData="inquireTableData" @getTableData="getTableData">
        <template slot="operation" slot-scope="{ row }">
          <span class="button cursor" @click="showDetailModal(row)">查看</span>
          <span class="button cursor" @click="showEditModal(row)">编辑</span>
          <span class="button cursor" @click="del(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 新增|编辑|详情 维修单 -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.isShow" width="80%">
      <el-form :model="dialog.data" ref="dialog" label-width="120px" :disabled="dialog.disabled">
        <el-row style="background: #f5f5f5; padding: 0.2rem">
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="dialog.data.deviceName"></el-input>
              <!-- <el-select
                v-model="dialog.data.deviceInfo"
                filterable
                remote
                reserve-keyword
                value-key="name"
                placeholder="请输入设备名称搜索"
                :remote-method="remoteMethod"
                :loading="dialog.data.searchLoading"
                @change="deviceChange"
              >
                <el-option
                  v-for="item in dialog.list.deviceList"
                  :key="item.value"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设备编号" prop="deviceNo">
              <el-input v-model="dialog.data.deviceNo"></el-input>
              <!-- <el-select
                v-model="dialog.data.deviceInfo"
                filterable
                remote
                reserve-keyword
                value-key="no"
                placeholder=""
                disabled
              >
                <el-option
                  v-for="item in dialog.list.deviceList"
                  :key="item.value"
                  :label="item.no"
                  :value="item"
                ></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="车间" prop="workshopId">
              <el-select v-model="dialog.data.workshopId" placeholder="请选择车间" disabled>
                <el-option v-for="item in dialog.list.workshopList" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修区域" prop="areaId">
              <el-select v-model="dialog.data.areaInfo" value-key="id" placeholder="请选择报修区域" @change="
                ({ id, label }) => (
                  (dialog.data.areaId = id), (dialog.data.areaName = label)
                )
              ">
                <el-option v-for="item in dialog.list.workshopAreaList" :key="item.id" :label="item.label"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工段" prop="workshopSectionId">
              <el-select v-model="dialog.data.workshopSectionInfo" value-key="id" placeholder="请选择工段" @change="
                ({ id, label }) => (
                  (dialog.data.workshopSectionId = id),
                  (dialog.data.workshopSectionName = label)
                )
              ">
                <el-option v-for="item in dialog.list.workshopSectionList" :key="item.id" :label="item.label"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="故障种类" prop="breakdownType">
              <el-select v-model="dialog.data.breakdownTypeInfo" value-key="id" placeholder="请选择故障种类" @change="
                ({ id, label }) => (
                  (dialog.data.breakdownType = id),
                  (dialog.data.breakdownTypeName = label)
                )
              ">
                <el-option v-for="item in dialog.list.faultTypeList" :key="item.id" :label="item.label" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="紧急程度" prop="emergencyDegree">
              <el-select
                v-model="dialog.data.emergencyDegreeInfo"
                value-key="id"
                placeholder="请选择紧急程度"
                @change="
                  ({ id, label }) => (
                    (dialog.data.emergencyDegree = id),
                    (dialog.data.emergencyDegreeName = label)
                  )
                "
              >
                <el-option
                  v-for="item in dialog.list.emergencyDegreeList"
                  :key="item.id"
                  :label="item.label"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="报修位置" prop="address">
              <el-input v-model="dialog.data.address"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="报修内容" prop="content">
              <el-input v-model="dialog.data.description"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="委托人" prop="applicantName">
              <el-input v-model="dialog.data.applicantName" readonly=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否停线修理" prop="stopLine" required="">
              <el-radio-group v-model="dialog.data.stopLine">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="故障时间" prop="breakdownTime">
              <el-date-picker v-model="dialog.data.breakdownTime" type="datetime" placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="影响生产时间" prop="breakdownDuration">
              <el-input v-model="dialog.data.breakdownDuration"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="故障描述" prop="description">
              <el-input type="textarea" :rows="4" v-model="dialog.data.content"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-form-item label="故障照片" prop="breakdownPhotos">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>-->
        </el-row>
        <!-- 底部表格 -->
        <tpms-table ref="tpmsTable" :total="dialog.data.spares.length" :data="dialog.data.spares" :columns="[
          {
            props: 'replaceSpareName',
            label: '替换备件名称',
            width: '160px',
          },
          { props: 'replaceSpareNo', label: '替换备件编号' },
          { props: 'amount', label: '替换数量' },
          {
            props: 'brokeSpareName',
            label: '损坏备件名称',
            width: '160px',
          },
          { props: 'brokeSpareNo', label: '损坏备件编号' },
        ]" @getTableData="dialog.data.spares">
        </tpms-table>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="$refs.dialog.resetFields(), (dialog.isShow = false)">取消</el-button>
        <el-button v-if="!dialog.disabled" type="primary" @click="
          $refs.dialog.validate((validate) => validate && save()),
          (dialog.isShow = false)
        ">保存</el-button>
      </el-row>
    </el-dialog>
    <!-- 详情 维修单 -->
    <RepairManageDetail :dialog="dialog" />
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable } from "../../components";
import axios from "axios";
import apiConfig from "../../lib/api/apiConfig";
import { parseTime } from "@/utils";

import { maintenanceManage } from "../../lib/api/business";
import {
  // workshopManage,
  sysConfigManage,
} from "../../lib/api/workshopSettingsManage";
import { showDetail, edit, add, del } from "../../lib/api/repairManagePage";
import { device } from "../../lib/api/device";
import {
  factoryManage,
  workshopManage,
  workshopAreaManage,
  workshopSectionManage,
  workshopShiftManage,
} from "../../lib/api/workshopSettingsManage";
import { emergencyDegree, faultTypeManage } from "../../lib/api/business";
import RepairManageDetail from './comp/repairManageDetail.vue'
export default {
  data() {
    const getListFuncs = [
      factoryManage.getNames, //工厂
      workshopManage.getNames, //车间
      workshopAreaManage.getNames, //区域
      workshopSectionManage.getNames, //工段
      workshopShiftManage.getNames, //班次
      emergencyDegree.getNames, //紧急程度
      faultTypeManage.getNames, //故障类型
    ];
    // 工厂和车间下拉列表
    const [
      factoryList,
      workshopList,
      workshopAreaList,
      workshopSectionList,
      workshopShiftList,
      emergencyDegreeList,
      faultTypeList,
    ] = getListFuncs.map((func) => {
      const arr = [];
      func().then((res) => {
        arr.push(...res.data);
      });
      return arr;
    });
    return {
      dialogTitle: "",
      detailIsShow: false,
      editIsShow: false,
      total: 0,
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "维修单号", props: "no", value: "" },
        { label: "设备编号", props: "deviceNo", value: "" },
        {
          label: "起始时间",
          props: "times",
          value: "",
          type: "timeFrame",
        },
        // {
        //   label: "结束时间",
        //   props: "endTime",
        //   value: "",
        //   type: "dateFrame",
        // },
        { label: "设备名称", props: "deviceName", value: "" },
        {
          label: "状态",
          props: "status",
          value: "",
          type: "radio",
          checkList: [
            { label: "待接单", id: [1] },
            { label: "已接单", id: [2, 32] },
            { label: "待审批", id: [4, 8] },
            { label: "已完成", id: [16] },
          ],
        },
      ],
      tableLists: [],
      // 新增|编辑|详情 模态框
      dialog: {
        isShow: false,
        isDetailShow: false,
        title: "新增",
        disabled: false,
        list: {
          factoryList, //工厂选项
          workshopList, //车间选项
          workshopAreaList, //区域选项
          workshopSectionList, //工段选项
          workshopShiftList, //班次选项
          emergencyDegreeList, //紧急程度选项
          faultTypeList, //故障类型选项
          deviceList: [], //设备选项
        },
        searchLoading: false, //设备Id搜索loading
        data: {
          factoryId: "", //所属工厂ID
          workshopId: "", //所属车间ID
          workshopName: "", //所属车间名称
          deviceId: "", //设备ID
          deviceNo: "", //设备编号
          deviceName: "", //设备名称
          areaId: "", //报修区域ID
          areaName: "", //报修区域名称
          address: "", //报修地址
          content: "", //报修内容
          applicantId: "", //报修人ID
          applicantName: "", //报修人姓名
          workshopSectionId: "", //工段ID
          workshopSectionName: "", //工段名称
          workshopShiftId: "", //班次ID
          workshopShiftName: "", //班次名称
          emergencyDegree: "", //紧急程度
          emergencyDegreeName: "", //紧急程度名称
          breakdownType: "", //故障种类
          breakdownTypeName: "", //故障种类名称
          description: "", //故障描述
          stopLine: "", //是否停线处理
          breakdownTime: "", //故障发生时间
          breakdownPhotos: "", //故障照片，附件ID，英文逗号分割的字符串
          type: 4,
          spares: []
        },
        rules: {
          workshopId: [
            { required: true, message: "请输入车间", trigger: "blur" },
          ],
          bailor: [
            { required: true, message: "请输入委托人", trigger: "blur" },
          ],
          workshopSection: [
            { required: true, message: "请输入工段", trigger: "blur" },
          ],
          Shift: [{ required: true, message: "请输入班次", trigger: "blur" }],
        },
      },
      dialogImageUrl: "",
      dialogVisible: false,
      detail: {},
      status: [
        { label: "待接单", value: 1 },
        { label: "待维修", value: 2 },
        { label: "待验收", value: 4 },
        { label: "待补充", value: 8 },
        { label: "待确认", value: 16 },
        { label: "已完成", value: 32 },
        { label: "待退回", value: 64 },
      ],
      deviceList: [],
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
    RepairManageDetail
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
      if (data.times) {
        const time = data.times.split(',');
        data.startTime = `${time[0]} 00:00:00`;
        data.endTime = `${time[1]} 23:59:59`
      }
      let pageData = this.$refs.tpmsTable.getData();
      maintenanceManage["getLists"]({ ...data, ...pageData }).then((res) => {
        this.tableLists = res.data.content;
        this.total = res.data.totalElements;
      });
    },
    // getWorkshopList() {
    //   workshopManage.getNames().then(res=>{
    //   })
    // },
    /** 设备搜索选择 */
    remoteMethod(query) {
      if (query) {
        this.dialog.searchLoading = true;
        device({
          name: query,
        }).then((res) => {
          // res.data.content.forEach(item => {
          //   item.label = item.name;
          // });
          this.dialog.list.deviceList = res.data.content;
        });
      }
    },
    /** 设备选择时id、no、name的联动 */
    deviceChange({ id, no, name }) {
      Object.assign(this.dialog.data, {
        deviceId: id,
        deviceNo: no,
        deviceName: name,
      });
    },
    del(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del({ ids: row.id }).then((res) => {
            this.getTableData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /** 点击新增按钮 */
    showAddModal() {
      this.dialog.data = {};
      const { id, name, factoryId, workshopId } =
        this.$store.state.user.userInfo.principal;
      this.dialogTitle = "新增";
      this.dialog.isShow = true;
      this.dialog.disabled = false;
      this.dialog.data.type = 4;
      this.dialog.data.spares = [];
      const workshop = this.dialog.list.workshopList.filter(
        (item) => item.id === workshopId
      )[0];
      Object.assign(this.dialog.data, {
        applicantId: id,
        applicantName: name,
        factoryId,
        workshopId,
        workshopName: workshop && workshop.label,
      });
    },
    save() {
      if (this.dialog.title == "编辑") {
        edit(this.dialog.data).then((res) => {
          this.$message.success("操作成功");
          this.detailIsShow = false;
          this.getTableData();
        });
      } else if (this.dialog.title == "新增") {
        add(this.dialog.data).then((res) => {
          this.$message.success("操作成功");
          this.dialog.isShow = false;
          this.getTableData();
        });
      }
    },
    transformStatus(status) {
      let str = "";
      switch (status) {
        case 1:
          str = "待接单";
          break;
        case 2:
          str = "待维修";
          break;
        case 4:
          str = "待验收";
          break;
        case 8:
          str = "待补充";
          break;
        case 16:
          str = "待确认";
          break;
        case 32:
          str = "已完成";
          break;
        case 64:
          str = "待退回";
          break;
      }
    },
    /** 显示详情Modal **/
    showDetailModal(row) {
      this.dialog.isDetailShow = true;
      this.dialog.title = "详情";
      this.dialog.disabled = true;

      showDetail(null, row.id).then((res) => {
        const data = res.data;

        const deviceInfo = {
          id: data.deviceId, //设备ID
          no: data.deviceNo, //设备编号
          name: data.deviceName, //设备名称
        };
        data.deviceInfo = deviceInfo;
        this.dialog.list.deviceList = [deviceInfo];
        this.dialog.data.deviceInfo = deviceInfo;
        console.log(this.dialog.list.deviceList);

        data.areaInfo = { id: data.areaId, label: data.areaName };

        data.workshopSectionInfo = {
          id: data.workshopSectionId,
          label: data.workshopSectionName,
        };

        data.workshopShiftInfo = {
          id: data.workshopShiftId,
          label: data.workshopShiftName,
        };

        data.breakdownTypeInfo = {
          id: data.breakdownType,
          label: data.breakdownTypeName,
        };

        data.emergencyDegreeInfo = {
          id: data.emergencyDegree,
          label: data.emergencyDegreeName,
        };
        this.dialog.data = { ...data, type: 4 };
      });
      this.$nextTick(() => {
        this.$refs.dialog.resetFields();
      });
    },
    /**显示编辑modal**/
    showEditModal(row) {
      this.dialog.isShow = true;
      this.dialog.title = "编辑";
      this.dialog.disabled = false;
      showDetail(null, row.id).then((res) => {
        const data = res.data;

        const deviceInfo = {
          id: data.deviceId, //设备ID
          no: data.deviceNo, //设备编号
          name: data.deviceName, //设备名称
        };
        data.deviceInfo = deviceInfo;
        this.dialog.list.deviceList = [deviceInfo];

        data.areaInfo = { id: data.areaId, label: data.areaName };

        data.workshopSectionInfo = {
          id: data.workshopSectionId,
          label: data.workshopSectionName,
        };

        data.workshopShiftInfo = {
          id: data.workshopShiftId,
          label: data.workshopShiftName,
        };

        data.breakdownTypeInfo = {
          id: data.breakdownType,
          label: data.breakdownTypeName,
        };

        data.emergencyDegreeInfo = {
          id: data.emergencyDegree,
          label: data.emergencyDegreeName,
        };

        this.dialog.data = { ...data, type: 4, workOrderId: data.id };
      });
    },
    /** 导出 */
    download() {
      let data = this.$refs.tpmsHeader.getData();
      const time = data.times.split(',');
      if (data.times) {
        const time = data.times.split(',');
        data.startTime = `${time[0]} 00:00:00`;
        data.endTime = parseTime(new Date(`${time[1]} 00:00:00`));
      }
      let url = `${apiConfig.systemUrl}/tpms/business/maintenance/export?startTime=${data.startTime}&endTime=${data.endTime}`; //请求下载文件的地址

      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;

          let fileName = "维修单.xls";
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
          this.$message.error(error);
        });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-top: 0.2rem;
}

.button {
  color: #0077c8;
}

.repair-photo {
  width: 3.1rem;
  height: 1.9rem;
  border: 1px solid #c0c0c0;
}

.detail-card {
  height: 6.1rem;
  padding: 0 1rem;
  margin-bottom: 1rem;

  >.el-row {
    margin-top: 0.3rem;
  }
}

.bottom-content {
  position: absolute;
  bottom: 1rem;
  width: 90%;
  height: 1.7rem;
  padding: 0.5rem 10%;
  box-sizing: border-box;
  background-color: #fff;
}

.acc-bottom-content {
  position: absolute;
  bottom: 1rem;
  width: 90%;
  height: 2rem;
  padding: 0 10%;
  box-sizing: border-box;
  background-color: #fff;
}

.el-select {
  width: 100%;
}
</style>