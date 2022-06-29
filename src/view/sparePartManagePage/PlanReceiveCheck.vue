// 备件领用
<template>
  <div>
    <!-- 头部功能区 -->
    <tpms-header ref="tpmsHeader" :formData="headerFormList" :total="total" @inquireTableData="inquireTableData">
      <template slot="time" slot-scope="{ row }">
        <el-date-picker style="width: 1.6rem" v-model="row.value[0]" type="date" value-format="yyyy-MM-dd"
          placeholder="开始日期" />
        <el-date-picker style="width: 1.6rem" v-model="row.value[1]" type="date" value-format="yyyy-MM-dd"
          placeholder="结束日期" />
      </template>
    </tpms-header>
    <!-- 按钮组 -->
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button size="small" type="primary" @click="dialogShow()">新增</el-button>
      <el-button size="small" type="primary" @click="exportSpareConsuming()">备查台账</el-button>
    </el-row>
    <!-- 底部表格 -->
    <tpms-table ref="tpmsTable" :data="tableData" :columns="tableColumns" @inquireTableData="getTableDate">
      <template slot-scope="{ row }">
        <el-button @click="seeDetail(row, 'detail')">查看</el-button>
        <el-button @click="seeDetail(row, 'edit')">编辑</el-button>
      </template>
    </tpms-table>

    <!-- 领用申请 -->
    <el-dialog title="领用申请" :visible.sync="addDialogIsShow" width="80%" :before-close="dialogClose">
      <el-form :model="dialogForm" ref="dialogForm" inline label-position="left" size="small">
        <el-row v-for="(formObj, index) in dialogForm.dialogForms" :key="index">
          <el-col :span="6">
            <el-form-item label="领用人" :prop="'dialogForms.' + index + '.consumerName'"
              :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change'] }">
              <el-select v-model="formObj.consumerName" filterable remote placeholder="请输入领用人"
                :remote-method="changeConsumerName" @change="selectForm($event, formObj, 'consumer')">
                <el-option v-for="(item, index) in options.consumerNameOptions" :key="index" :label="item.label"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备件" :prop="'dialogForms.' + index + '.spareName'"
              :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change'] }">
              <el-select v-model="formObj.spareName" filterable remote placeholder="请输入SVW编号"
                :remote-method="changeSpare" @change="selectForm($event, formObj, 'spare')">
                <el-option v-for="(item, index) in options.spareOptions" :key="index" :label="item.label" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量" :prop="'dialogForms.' + index + '.num'" :rules="[{ required: true, message: '不能为空', trigger: ['blur', 'change'] },
            {
              type: 'number', message: '请输入数字', trigger: 'blur', transform(value) {
                if (value) {
                  return Number(value);
                }
              }
            }]">
              <el-input v-model="formObj.num"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称" :prop="'dialogForms.' + index + '.deviceName'"
              :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change'] }">
              <el-select v-model="formObj.deviceName" filterable remote placeholder="请输入资产编号"
                :remote-method="changeDevice" @change="selectForm($event, formObj, 'device')">
                <el-option v-for="(item, index) in options.deviceOptions" :key="index" :label="item.label"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="维修单号">
              <el-select v-model="formObj.maintenanceNo" filterable remote placeholder="请输入维修单号"
                :remote-method="changeMaintenance" @change="selectForm($event, formObj, 'maintenance')">
                <el-option v-for="(item, index) in options.maintenanceOptions" :key="index" :label="item.label"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用途">
              <el-input v-model="formObj.purpose"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label>
              <el-button type="warning" @click.prevent="removeDomain(formObj)" size="small">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="initDialog()">取 消</el-button>
        <el-button @click="addDomain">新增记录</el-button>
        <el-button @click="addDialogSubmit()" type="primary">提交</el-button>
      </div>
    </el-dialog>

    <!-- 领用查看 | 修改 -->
    <el-dialog title="领用申请" :visible.sync="dialogIsShow" width="80%">
      <el-form :model="dialogForm" v-loading="loading" ref="dialogForm" inline label-position="left" size="small">
        <el-row>
          <!-- v-for="(formObj, index) in dialogForm.dialogForms" :key="index" -->
          <el-col :span="6">
            <el-form-item label="领用人" prop="consumerName">
              <el-select v-model="dialogForm.dialogForms[0].consumerName" filterable remote placeholder="请输入领用人"
                :remote-method="changeConsumerName" @change="
                  selectForm($event, dialogForm.dialogForms[0], 'consumer')
                " disabled>
                <el-option v-for="(item, index) in options.consumerNameOptions" :key="index" :label="item.label"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备件" prop="spareName">
              <el-select v-model="dialogForm.dialogForms[0].spareName" filterable remote placeholder="请输入SVW编号"
                :remote-method="changeSpare" @change="selectForm($event, dialogForm.dialogForms[0], 'spare')" disabled>
                <el-option v-for="(item, index) in options.spareOptions" :key="index" :label="item.label" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量" prop="num">
              <el-input v-model="dialogForm.dialogForms[0].num" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称" :rules="{ required: true, message: '不能为空', trigger: ['blur', 'change'] }">
              <el-select v-model="dialogForm.dialogForms[0].deviceName" filterable remote placeholder="请输入资产编号"
                :remote-method="changeDevice" @change="
                  selectForm($event, dialogForm.dialogForms[0], 'device')
                ">
                <el-option v-for="(item, index) in options.deviceOptions" :key="index" :label="item.label"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="维修单号">
              <el-select v-model="dialogForm.dialogForms[0].maintenanceNo" filterable remote placeholder="请输入维修单号"
                :remote-method="changeMaintenance" @change="
                  selectForm($event, dialogForm.dialogForms[0], 'maintenance')
                ">
                <el-option v-for="(item, index) in options.maintenanceOptions" :key="index" :label="item.label"
                  :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用途">
              <el-input v-model="dialogForm.dialogForms[0].purpose"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="initDialog()">取 消</el-button>
        <el-button v-if="dialogType == 'edit'" @click="updateDialogSubmit()" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import apiConfig from "../../lib/api/apiConfig";
import { getSpare, spareConsuming } from "../../lib/api/spart";
import { getUserDropList } from "../../lib/api/userManage";
import { device } from "../../lib/api/device";
import { maintenanceManage } from "../../lib/api/business";
import { tpmsHeader, tpmsTable } from "../../components";
import { userDropDownType } from "../../public/model/user";
export default {
  data() {
    return {
      options: {
        consumerNameOptions: [{ label: "", value: "" }],
        spareOptions: [{ label: "", value: "" }],
        deviceOptions: [{ label: "", value: "" }],
        maintenanceOptions: [{ label: "", value: "" }],
      },
      headerFormList: [
        { label: "备件编号", props: "spareNo", value: "" },
        { label: "备件名称", props: "spareName", value: "" },
        { label: "领用日期", props: "timeFrame", value: [], slotName: "time" },
        { label: "设备编号", props: "deviceNo", value: "" },
        { label: "设备名称", props: "deviceName", value: "" },
      ],
      tableData: [], // 表格的数据
      total: 0,
      tableColumns: [
        // 渲染表格的表头
        { props: "deviceNo", label: "设备编号" },
        { props: "deviceName", label: "设备名称" },
        { props: "spareNo", label: "备件编号" },
        { props: "spareName", label: "备件名称" },
        { props: "specification", label: "规格型号" },
        { props: "consumerName", label: "领用人" },
        { props: "consumingDate", label: "领用日期" },
        { props: "maintenanceNo", label: "维修单号" },
        { props: "price", label: "采购价格" },
        { props: "num", label: "数量" },
        { props: "purpose", label: "设备用途" },
        { props: "workshopName", label: "车间" },
      ],
      addDialogIsShow: false, // 新增领用对话框的打开与关闭
      dialogIsShow: false, // 控制查看详情对话框的打开与关闭
      dialogType: "detail", //模态框类型：detail、approval、add、edit
      dialogForm: {
        dialogForms: [
          {
            consumerId: null,
            consumerName: "",
            deviceId: null,
            deviceName: null,
            maintenanceId: null,
            maintenanceNo: null,
            num: null,
            purpose: "",
            spareId: null,
            purpose: null,
          },
        ],
      },
      loading: false,
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
  },
  mounted() {
    this.getTableDate();
  },
  methods: {
    dialogShow() {
      this.addDialogIsShow = true;
    },
    /** 点击查询按钮 */
    inquireTableData(val) {
      console.log(val);
      this.$refs.tpmsTable.resetCurrentPage();
      this.getTableDate();
    },
    /** 加载表格数据 */
    getTableDate() {
      this.tableData = [];
      let data = this.$refs.tpmsHeader.getData();
      data.startTime = data.timeFrame.split(",")[0];
      data.endTime = data.timeFrame.split(",")[1];
      delete data.timeFrame;
      let pageData = this.$refs.tpmsTable.getData();
      spareConsuming.getList({ ...data, ...pageData }).then((res) => {
        this.tableData = res.data.content;
        this.total = res.data.numberOfElements;
      });
    },
    /** 加载模态框详情 */
    getTableItemDetail(row) {
      this.loading = true;
      spareConsuming.getDetail(null, row.id).then((res) => {
        this.dialogForm.dialogForms = [res.data];
        this.loading = false;
      });
    },
    /** 点击表格查看按钮 */
    seeDetail(row, type) {
      this.getTableItemDetail(row);
      this.dialogIsShow = true;
      this.dialogType = type;
    },
    /**
     * 导出备件备查台账
     */
    exportSpareConsuming() {
      let url = `${apiConfig.spareConsuming}/export`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      let data = this.$refs.tpmsHeader.getData();
      axios
        .get(url, {
          // params: data,
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;

          let fileName = "备件清单.xlsx";
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
    },
    /**
     * 审批驳回｜审批通过 （弃用）
     * @param {Boolean} enable - true:审批通过；false:审批驳回
     */
    approval(enable) {
      this.dialogIsShow = false;
      spareConsuming
        .approval({ workflowStatus: enable ? 1 : 2 }, this.dialogData.id)
        .then((res) => {
          console.log(res);
          this.$message.success("操作完成");
          this.getTableDate();
        })
        .catch((fail) => {
          this.$message.error("操作失败");
        });
    },
    /**
     * 新增备件选型
     */
    addDomain() {
      this.dialogForm.dialogForms.push({
        consumerId: null,
        consumerName: "",
        deviceId: null,
        maintenanceId: null,
        maintenanceNo: null,
        num: 0,
        purpose: "",
        spareId: null,
      });
    },
    /**
     * 删除备件选型
     */
    removeDomain(formObj) {
      var index = this.dialogForm.dialogForms.indexOf(formObj);
      if (index !== -1) {
        this.dialogForm.dialogForms.splice(index, 1);
      }
    },
    /**
     * 用户下拉框
     */
    changeConsumerName(param) {
      if (param !== "") {
        getUserDropList({
          name: param,
          type: userDropDownType.spareConsumingQueryUserByRoles,
        }).then((res) => {
          const consumerNameOptions = [];
          res.data.content.forEach((m) => {
            consumerNameOptions.push({
              consumerId: m.id,
              consumerName: m.name,
              value: m.id,
              label: m.name,
            });
            this.options.consumerNameOptions = consumerNameOptions;
          });
        });
      } else {
        this.options.consumerNameOptions = [];
      }
    },
    /**
     * 备件下拉框
     */
    changeSpare(param) {
      if (param !== "") {
        getSpare({ svwMatNum: param }).then((res) => {
          const spareOptions = [];
          res.data.content.forEach((m) => {
            spareOptions.push({
              spareId: m.id,
              spareName: m.name,
              value: m.id,
              label: m.descSpec,
              id: m.id,
            });
            this.options.spareOptions = spareOptions;
          });
        });
      } else {
        this.options.spareOptions = [];
      }
    },
    /**
     * 设备下拉
     */
    changeDevice(param) {
      if (param !== "") {
        device({ name: param }).then((res) => {
          const deviceOptions = [];
          res.data.content.forEach((m) => {
            deviceOptions.push({
              deviceId: m.id,
              deviceName: m.name,
              value: m.id,
              label: `${m.name}-${m.assetNo}`,
              id: m.id,
            });
            this.options.deviceOptions = deviceOptions;
          });
        });
      } else {
        this.options.deviceOptions = [];
      }
    },
    /**
     * 维修单下拉
     */
    changeMaintenance(param) {
      if (param !== "") {
        maintenanceManage["getLists"]({ no: param }).then((res) => {
          const maintenanceOptions = [];
          res.data.content.forEach((m) => {
            maintenanceOptions.push({
              maintenanceId: m.id,
              maintenanceNo: m.no,
              value: m.id,
              label: m.no,
              id: m.id,
            });
            this.options.maintenanceOptions = maintenanceOptions;
          });
        });
      } else {
        this.options.maintenanceOptions = [];
      }
    },
    /**
     * 领用选择事件
     */
    selectForm(item, formObj, type) {
      const types = {
        device: "device",
        maintenance: "maintenance",
        spare: "spare",
        consumer: "consumer",
      };
      switch (type) {
        case types.maintenance:
          formObj.maintenanceId = item.maintenanceId;
          formObj.maintenanceNo = item.maintenanceNo;
          break;
        case types.device:
          formObj.deviceId = item.deviceId;
          formObj.deviceName = item.deviceName;
          break;
        case types.spare:
          formObj.spareId = item.spareId;
          break;
        default:
          formObj.consumerId = item.consumerId;
          formObj.consumerName = item.consumerName;
          break;
      }
    },
    /**
     * 提交领用
     */
    addDialogSubmit(e, i) {
      const param = this.dialogForm.dialogForms;
      // if (param.consumerId == null) {
      //   this.$message.info("领用人不能为空");
      //   return;
      // }
      // if (param.spareId == null) {
      //   this.$message.info("备件不能为空");
      //   return;
      // }
      // if (param.num == null) {
      //   this.$message.info("数量不能为空");
      //   return;
      // }
      // if (param.deviceName == null) {
      //   this.$message.info("设备不能为空");
      //   return;
      // }
      spareConsuming["add"](param).then((res) => {
        this.$message.success("保存成功");
        this.inquireTableData();
        this.getTableDate();
        this.initDialog();
      });
    },
    /**
     * 修改领用
     */
    updateDialogSubmit() {
      const param = this.dialogForm.dialogForms[0];
      spareConsuming["update"](param).then((res) => {
        this.$message.success("保存成功");
        this.inquireTableData();
        this.getTableDate();
        this.initDialog();
      });
    },
    /**
     * 初始化模态框的表单内容
     */
    initDialog() {
      this.addDialogIsShow = false;
      this.dialogIsShow = false;
      this.dialogForm = {
        dialogForms: [
          {
            consumerId: null,
            consumerName: "",
            deviceId: null,
            deviceName: null,
            maintenanceId: null,
            maintenanceNo: null,
            num: 0,
            purpose: "",
            spareId: null,
            purpose: null,
          },
        ],
      };
    },
    dialogClose() {
      this.dialogForm = {
        dialogForms: [
          {
            consumerId: null,
            consumerName: "",
            deviceId: null,
            deviceName: null,
            maintenanceId: null,
            maintenanceNo: null,
            num: null,
            purpose: "",
            spareId: null,
            purpose: null,
          },
        ],
      };
      this.addDialogIsShow = false
    },
  },
};
</script>
<style lang="scss" scoped>
</style>