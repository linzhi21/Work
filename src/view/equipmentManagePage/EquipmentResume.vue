// 设备履历
<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <!-- <tpms-search -->
        <tpms-header
          ref="tpmsHeader"
          :formData="equipmentFormList"
          @inquireTableData="inquireTableData"
          :drawer="isSearchDrawer"
          @onValueChanged="onValueChanged"
        />
        <el-row>
          <el-col :span="20">
            <buttom-group
              @getTableData="getTableData"
              :getHeaderData="getHeaderData"
            />
          </el-col>
          <el-col :span="4">
            <!-- 新增设备按钮 -->
            <el-row
              class="buttom-group"
              type="flex"
              justify="end"
              align="middle"
            >
              <el-button size="small" @click='deleteMore'>
                批量删除
              </el-button>
              <el-button
                class="button-more"
                type="primary"
                size="small"
                @click="editDevice(false)"
                >新增设备</el-button
              >
            </el-row>
          </el-col>
        </el-row>
        <!-- <resume @searchShow="searchShow" /> -->

        <!-- 底部表格 -->
        <tpms-table
          :column_index="true"
          ref="tpmsTable"
          :total="total"
          :data="equipmentTableData"
          :columns="[
            { type: 'selection' },
            { label: '设备编号', props: 'no' },
            { label: '资产编号', props: 'assetNo' },
            { label: '设备名称', props: 'name' },
            { label: '所属工厂', props: 'factoryName' },
            { label: '所属车间', props: 'workshopName' },
            { label: '区域名称', props: 'areaName' },
            { label: '一级区域', props: 'primaryAreaName' },
            { label: '二级区域', props: 'secondaryAreaName' },
            { label: '三级区域', props: 'tertiaryAreaName' },
            { label: '工段名称', props: 'workshopSectionName' },
            { label: '工位名称', props: 'workStationName' },
            { label: '所属PLC', props: 'plc' },
            { label: 'SAP编号', props: 'sap' },
            { label: '型号', props: 'model' },
            { label: '规格', props: 'specification' },
            { label: '原值', props: 'price' },
            { label: '启用日期', props: 'enableDate' },
            { label: '设备类型', props: 'deviceType' },
            { label: '生成因素', props: 'productionElement' },
            { label: '检修因素', props: 'overhaulElement' },
            { label: '备用因素', props: 'reserveElement' },
            { label: 'ABC类', props: 'abc' },
            { label: '资产分类', props: 'assetType' },
            { label: '资产二级分类', width: '120px', props: 'secondAssetType' },
            { label: '设备状态', props: 'deviceStatusStr' },
            { label: '合同编号', props: 'contractNo' },
            { label: 'WBS元素', props: 'wbs' },
            { label: 'BM单编号', props: 'bm' },
            { label: '维修次数', props: 'repairTimes' },
            {
              label: '操作',
              slotName: 'operation',
              fixed: 'right',
              width: '250px',
            },
          ]"
          @inquireTableData="inquireTableData"
          @getTableData="getTableData"
          @selection-change="handleSelectionChange"
        >
          <template slot="operation" slot-scope="{ row }">
            <span class="button cursor" @click="editDevice(row)">编辑</span>
            <el-divider direction="vertical"></el-divider>
            <span class="button cursor" @click="seeMaintainWorkOrders(row)"
              >查看保养工单</span
            >
            <el-divider direction="vertical"></el-divider>
            <el-dropdown>
              <span class="el-dropdown-link">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><span @click="createQrcode(row)">生成二维码</span></el-dropdown-item
                >
                <el-dropdown-item
                  ><span @click="seeRepair(row)">维修单</span></el-dropdown-item
                >
                <el-dropdown-item
                  ><span @click="seeSparePartsRecord(row)">维修备件记录</span></el-dropdown-item
                >
                <el-dropdown-item
                  ><span @click="seeBOM(row)">查看BOM</span></el-dropdown-item
                >
                <el-dropdown-item
                  ><span @click="exportSpare(row)">导出BOM清单</span></el-dropdown-item
                >
                <el-dropdown-item divided
                  ><span @click="deleteDevice(row)">删除</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>

            <!-- <span class="button" @click="seeEquipmentDetail(row)">维修记录</span> -->
          </template>
        </tpms-table>
      </el-card>
    </el-row>

    <!-- 维修记录详情模态框 -->
    <el-dialog
      title="维修记录"
      :visible.sync="equipmentDetailIsShow"
      width="80%"
      center
    >
      <tpms-table
        height="60vh"
        :data="equipmentTableData"
        :columns="[
          { props: 'name', label: '维修单号' },
          { props: 'name', label: '设备编号' },
          { props: 'name', label: '设备名称' },
          { props: 'name', label: '报修区域' },
          { props: 'name', label: '报修内容' },
          { props: 'name', label: '报修地址' },
          { props: 'name', label: '紧急程度' },
          { props: 'name', label: '状态' },
          { props: 'name', label: '创建时间' },
          { props: 'name', label: '创建人' },
        ]"
        :paginationIsShow="false"
      >
        <template slot-scope="{ row }">
          <span
            class="button"
            slot="reference"
            @click="seeSparePartsRecord(row)"
            >查看</span
          >
        </template>
      </tpms-table>
    </el-dialog>
    <!-- 设备更换的备件 -->
    <el-dialog
      width="70%"
      title="维修详情"
      :visible.sync="sparePartIsShow"
      center
    >
      <tpms-table
        height="50vh"
        :data="sparePartData"
        :columns="[
          { props: 'brokeSpareNo', label: '备件编号' },
          { props: 'brokeSpareName', label: '备件名称' },
          { props: 'replaceSpareNo', label: '设备编号' },
          { props: 'replaceSpareName', label: '设备名称' },
          { props: 'amount', label: '备件参数' },
          { props: 'comment', label: '制造商编号' }
        ]"
        :paginationIsShow="false"
      >
       <template slot-scope="{ row }">
          <span
            class="button"
            slot="reference"
            @click="seeSparePartsRecord(row)"
            >查看</span
          >
        </template>
      </tpms-table>
    </el-dialog>

    <!-- 编辑设备模态框 -->
    <el-dialog
      :visible.sync="editIsShow"
      width="70%"
      :title="deviceDetail.title"
    >
      <el-row>
        <el-form
          ref="editForm"
          :model="deviceDetail"
          :rules="rules"
          label-position="left"
          label-width="120px"
        >
          <!-- <el-form-item label="状态名称" prop="assetNo" required>
          <el-input style="width:300px;" v-model="deviceDetail.assetNo"></el-input>
        </el-form-item> -->
          <el-col
            :span="11"
            :offset="1"
            v-for="(item, index) in equipmentTableList"
            :key="index"
            v-show="item.props"
          >
            <el-form-item :label="item.label" :prop="item.props">
              <el-select
                style="width: 100%"
                v-if="item.type === 'radio'"
                v-model="deviceDetail[item.props]"
                :placeholder="item.placeholder"
                :disabled="item.disabled === true"
                @change="(val) => editSelectChanged(item, val)"
              >
                <el-option
                  v-for="(item, i) in item.checkList"
                  :key="i"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
              <el-date-picker
                v-else-if="item.type === 'datePicker'"
                v-model="deviceDetail[item.props]"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :disabled="item.disabled === true"
              ></el-date-picker>
              <el-input
                :readonly="item.props == 'no'"
                v-else
                v-model="deviceDetail[item.props]"
                :disabled="item.disabled === true"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row type="flex" justify="end">
        <!-- <el-col> -->
        <el-button @click="editIsShow = false">取 消</el-button>
        <el-button type="primary" @click="saveDevice">保存</el-button>
        <!-- </el-col> -->
      </el-row>
    </el-dialog>

    <!-- 二维码模态框 -->
    <el-dialog title="二维码" width="600px" :visible.sync="brCodeIsShow">
      <el-row type="flex" justify="center">
        <img :src="brCodeSrc" />
      </el-row>
    </el-dialog>

    <!-- 查看BOM 模态框 -->
    <el-dialog width="80%" title="查看BOM" :visible.sync="BOMIsShow" center>
      <tpms-table
        ref="BOMtable"
        height="50vh"
        :data="BOMdata"
        :total="BOMdataTotal"
        :columns="[
          { props: 'name', label: '备件名称' },
          { props: 'no', label: '备件编号' },
          { props: 'specification', label: '型号规格' },
          { props: 'materialNo', label: '东昌物料号' },
          { props: 'manufacturer', label: '制作商编号' },
          { props: 'repairTimes', label: '维修次数' },
          { slotName: 'recod', label: '维修记录' },
        ]"
      >
        <template slot="recod" slot-scope="{ row }">
          <span class="button" @click="seeBOMspartPartRecord(row)">详情</span>
        </template>
      </tpms-table>
      <el-dialog
        width="70%"
        title="BOM备件维修详情"
        :visible.sync="BOMspartPartRecordIsShow"
        center
        append-to-body
      >
        <tpms-table
          height="50vh"
          :data="BOMspartPartRecordData"
          :columns="[
            { props: 'name', label: '维修单号' },
            { props: 'name', label: '设备编号' },
            { props: 'name', label: '设备名称' },
            { props: 'name', label: '报修区域' },
            { props: 'name', label: '报修内容' },
            { props: 'name', label: '报修地址' },
            { props: 'name', label: '紧急程度' },
            { props: 'name', label: '状态' },
            { props: 'name', label: '创建时间' },
            { props: 'name', label: '创建人' },
            { slotName: 'recod', label: '备件更换记录' },
          ]"
          :paginationIsShow="false"
        >
          <template slot="recod" slot-scope="{ row }">
            <span class="button" @click="seeBOMspartPartReplaceRecord(row)"
              >查看</span
            >
          </template>
        </tpms-table>
        <el-dialog
          width="70%"
          title="BOM备件更换记录"
          :visible.sync="BOMspartPartReplaceRecordIsShow"
          center
          append-to-body
        >
          <tpms-table
            height="50vh"
            :data="BOMspartPartReplaceRecordData"
            :columns="[
              { props: 'name', label: '备件编号' },
              { props: 'name', label: '备件名称' },
              { props: 'name', label: '设备编号' },
              { props: 'name', label: '设备名称' },
              { props: 'name', label: '备件参数' },
              { props: 'name', label: '制造商编号' },
              { props: 'name', label: '东昌物料号' },
              { props: 'name', label: '创建时间' },
              { props: 'name', label: '创建人' },
              { props: 'name', label: '标签' },
            ]"
            :paginationIsShow="false"
          />
        </el-dialog>
      </el-dialog>
    </el-dialog>
    <!-- 保养工单 模态框 -->
    <el-dialog
      width="80%"
      title="查看保养工单"
      :visible.sync="maintainOrders_dialog.isShow"
      center
    >
      <tpms-table
        ref="maintainOrders"
        height="50vh"
        :data="maintainOrders_dialog.data"
        :total="maintainOrders_dialog.total"
        :columns="[
          { props: 'no', label: '工单编号' },
          { props: 'statusStr', label: '状态' },
          { props: 'receiverName', label: '操作人' },
          { props: 'receiveTime', label: '操作时间' },
          { props: 'resultStr', label: '结果' },
        ]"
        @getTableData="getMaintainOrdersData"
      ></tpms-table>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import {
  device as getData,
  queryDevice,
  addDevice,
  putDevice,
  deviceManage,
  queryBom,
  getBomDetail,
  queryDeviceStatus,
  deviceStatusManage,
} from "../../lib/api/device";
import {
  getWorkshopSection,
  getWorkShopTeam,
  getWorkshopArea,
  workshopAreaNames,
  workshopSelect,
} from "../../lib/api/factory";
import {
  workshopSectionManage,
  workStationManage,
  factoryManage,
} from "../../lib/api/workshopSettingsManage";
import { showSparePartsRecord } from "../../lib/api/repairManagePage"
import { tpmsHeader, tpmsTable, tpmsSearch } from "../../components";
import {
  EquipmentResume as buttomGroup,
  Resume,
} from "./components/buttomGroups";
import apiConfig from "../../lib/api/apiConfig";
import { maintainWorkOrder } from "../../lib/api/upkeepManagePage";
// console.log(apiConfig)
export default {
  data() {
    // 获取头部搜索组下拉选择的list
    let getListFuncs = [
      deviceStatusManage["getNames"],
      workshopAreaNames,
      workshopSelect,
      workshopSectionManage.getNames, //工段
      workStationManage.getNames, //工位
      factoryManage.getNames, //工厂
    ];
    let [
      deviceStatus,
      workshopAreas,
      workshops,
      workshopSections,
      workStations,
      factorys,
    ] = getListFuncs.map((getListFunc) => {
      let arr = [];
      getListFunc().then((res) => {
        let data = res.data.content || res.data;
        data.forEach((item) => {
          item.label = item.label || item.value;
        });
        arr.push(...data);
      });
      return arr;
    });
    return {
      isSearchDrawer: false,
      fileBaseUrl: apiConfig.accessoryFile,
      loading: true,
      equipmentFormList: [
        //  渲染头部功能区的列表
        {
          label: "车间",
          props: "workshopId",
          value: "",
          type: "radio",
          checkList: workshops,
        },
        {
          label: "区域",
          props: "areaId",
          value: "",
          placeholder: "请先选择车间",
          type: "radio",
          checkList: workshopAreas,
        },
        {
          label: "工段",
          props: "workshopSectionId",
          value: "",
          placeholder: "请先选择区域",
          type: "radio",
          checkList: workshopSections,
        },
        {
          label: "设备状态",
          props: "deviceStatus",
          value: "",
          type: "radio",
          checkList: deviceStatus,
        },
        {
          label: "使用人",
          props: "userName",
          value: "",
        },
        {
          label: "设备名称",
          props: "name",
          value: "",
        },
        {
          label: "设备编号",
          props: "no",
          value: "",
        },
        {
          label: "资产编号",
          props: "assetNo",
          value: "",
        },
      ],
      total: 0,
      equipmentTableData: [],
      equipmentTableList: [
        { label: "设备编号", props: "no", disabled: true },
        { label: "资产编号", props: "assetNo", disabled: false },
        { label: "设备名称", props: "name" },
        {
          label: "所属工厂",
          props: "factoryId",
          type: "radio",
          checkList: factorys,
        },
        {
          label: "所属车间",
          props: "workshopId",
          type: "radio",
          checkList: workshops,
        },
        {
          label: "所属区域",
          props: "areaId",
          type: "radio",
          checkList: workshopAreas,
        },
        {
          label: "工段名称",
          props: "workshopSectionId",
          type: "radio",
          checkList: workshopSections,
        },
        {
          label: "工位名称",
          props: "workStationId",
          type: "radio",
          checkList: workStations,
        },
        { label: "一级区域", props: "primaryAreaName" },
        { label: "二级区域", props: "secondaryAreaName" },
        { label: "三级区域", props: "tertiaryAreaName" },
        { label: "所属PLC", props: "plc" },
        { label: "SAP编号", props: "sap" },
        { label: "型号", props: "model" },
        { label: "规格", props: "specification" },
        { label: "原值", props: "price" },
        { label: "启用日期", props: "enableDate", type: "datePicker" },
        { label: "设备类型", props: "deviceType" },
        { label: "生成因素", props: "productionElement" },
        { label: "检修因素", props: "overhaulElement" },
        { label: "备用因素", props: "reserveElement" },
        { label: "ABC类", props: "abc" },
        { label: "资产分类", props: "assetType" },
        { label: "资产二级分类", props: "secondAssetType", width: "120px" },
        {
          label: "设备状态",
          props: "deviceStatusId",
          type: "radio",
          checkList: deviceStatus,
        },
        { label: "合同编号", props: "contractNo" },
        { label: "WBS元素", props: "wbs" },
        { label: "BM单编号", props: "bm" },
        { label: "维修次数", props: "repairTimes" },
        { label: "点检班组", props: "pointTeam" },
        { label: "巡检路线", props: "inspectionRoute" },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "240px",
        },
      ],
      equipmentDetailIsShow: false, //查看设备维修记录列表模态框
      equipmentDetailData: [], //查看设备维修记录模态框列表数据
      editIsShow: false, //编辑模态框
      deviceDetail: {
        assetNo: null,
        name: null,
        factoryId: null,
        workshopId: null,
        areaId: null,
        workshopSectionId: null,
      }, //设备详情，可编辑
      brCodeIsShow: false, //二维码模态框
      brCodeSrc: "", //二维码地址
      sparePartIsShow: false, //某一条维修记录的 更换的备件列表 模态框
      sparePartData: [], //维修记录更换的备件数据列表
      BOMIsShow: false, //BOM备件维修详情模态框
      BOMdata: [], //BOM列表数据
      BOMdataTotal: 0, //BOM列表一共有多少条
      BOMspartPartRecordIsShow: false, //BOM备件维修记录模态框
      BOMspartPartRecordData: [], //BOM备件维修记录
      BOMspartPartReplaceRecordIsShow: false, //BOM备件更换记录模态框
      BOMspartPartReplaceRecordData: [], //BOM备件更换记录
      rules: {
        assetNo: [
          {
            required: true,
            message: "请输入设备资产编号",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur",
          },
        ],
        factoryId: [
          {
            required: true,
            message: "请选择所属工厂",
            trigger: "blur",
          },
        ],
        workshopId: [
          {
            required: true,
            message: "请选择所属车间",
            trigger: "blur",
          },
        ],
        areaId: [
          {
            required: true,
            message: "请选择所属区域",
            trigger: "blur",
          },
        ],
        workshopSectionId: [
          {
            required: true,
            message: "请选择所属工段",
            trigger: "blur",
          },
        ],
        deviceStatusStr: [
          {
            required: true,
            message: "请选择设备状态",
            trigger: "blur",
          },
        ],
      },
      // 保养工单模态框
      maintainOrders_dialog: {
        isShow: false,
        deviceNo: "",
        data: [],
        total: 0,
      },
      // 多选对象
      selected: []
    };
  },
  components: {
    tpmsHeader,
    buttomGroup,
    tpmsTable,
    Resume,
    tpmsSearch,
  },
  created() {},
  mounted() {
    this.getTableData();
  },
  methods: {
    searchShow(e) {
      this.isSearchDrawer = e;
    },
    /** 生成二维码**/
    createQrcode(row) {
      console.log(row.id + "/noImage");
      deviceManage.getQrcode(null, row.id + "/noImage").then((res) => {
        console.log(res);
        this.brCodeSrc = this.fileBaseUrl + "/" + res.data;
      });
      this.brCodeIsShow = true;
    },
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
      getData({ ...data, ...pageData }).then((res) => {
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
      });
    },
    /** 头部value变更回调 */
    onValueChanged({ props, value }) {
      const { equipmentFormList } = this;
      if (props === "workshopId") {
        // 选择车间，重置区域和工段
        workshopAreaNames({ [props]: value }).then((res) => {
          equipmentFormList.forEach((item) => {
            if (item.props === "areaId") {
              item.checkList = res.data;
              item.value = "";
            }
            if (item.props === "workshopSectionId") {
              item.checkList = [];
              item.value = "";
            }
          });
        });
      }

      if (props === "areaId") {
        // 选择区域，重置工段
        workshopSectionManage
          .getNames({ workshopAreaId: value })
          .then((res) => {
            equipmentFormList.forEach((item) => {
              if (item.props === "workshopSectionId") {
                item.checkList = res.data;
                item.value = "";
              }
            });
          });
      }
    },
    /** 返回头部搜索 */
    getHeaderData() {
      return this.$refs.tpmsHeader.getData();
    },
    /** 查看设备维修记录列表 */
    seeEquipmentDetail(row) {
      this.equipmentDetailIsShow = true;
      this.equipmentDetailData = [];
      this.$message.warning("暂无接口");
      console.log(row);
    },
    /** 编辑设备 */
    editDevice(row) {
      if (row) {
        this.deviceDetail = {};
        queryDevice(null, row.id).then((res) => {
          const data = res.data;
          this.deviceDetail = data;
          this.deviceDetail.title = "编辑设备";
        });
      } else {
        this.deviceDetail = {
          title: "新增设备",
        };
      }

      this.editIsShow = true;
    },
    editSelectChanged({ props }, id) {
      const { equipmentTableList, deviceDetail } = this;
      if (props === "factoryId") {
        // 选择工厂，重置车间及以下
        workshopSelect({ [props]: id }).then((res) => {
          equipmentTableList.forEach((item) => {
            if (item.props === "workshopId") {
              item.checkList = res.data;
              deviceDetail[item.props] = "";
              return;
            }
            if (
              ["areaId", "workshopSectionId", "workStationId"].includes(
                item.props
              )
            ) {
              item.checkList = [];
              deviceDetail[item.props] = "";
            }
          });
        });
      }
      if (props === "workshopId") {
        // 选择车间，重置区域及以下
        workshopAreaNames({ [props]: id }).then((res) => {
          equipmentTableList.forEach((item) => {
            if (item.props === "areaId") {
              item.checkList = res.data;
              deviceDetail[item.props] = "";
              return;
            }
            if (["workshopSectionId", "workStationId"].includes(item.props)) {
              item.checkList = [];
              deviceDetail[item.props] = "";
            }
          });
        });
      }
      if (props === "areaId") {
        // 选择区域，重置工段及以下
        workshopSectionManage.getNames({ [props]: id }).then((res) => {
          equipmentTableList.forEach((item) => {
            if (item.props === "workshopSectionId") {
              item.checkList = res.data;
              deviceDetail[item.props] = "";
              return;
            }
            if (["workStationId"].includes(item.props)) {
              item.checkList = [];
              deviceDetail[item.props] = "";
            }
          });
        });
      }
      if (props === "workshopSectionId") {
        // 选择工段，重置工位
        workStationManage.getNames({ [props]: id }).then((res) => {
          equipmentTableList.forEach((item) => {
            if (item.props === "workStationId") {
              item.checkList = res.data;
              deviceDetail[item.props] = "";
            }
          });
        });
      }
    },
    /** 保存已编辑的设备 */
    saveDevice() {
      if (this.deviceDetail.title === "新增设备") {
        this.$refs["editForm"].validate((valid) => {
          console.log(valid);
          if (valid) {
            addDevice(this.deviceDetail).then((res) => {
              this.editIsShow = false;
              this.$message.success("保存成功");
              this.getTableData();
            });
          } else {
            return false;
          }
        });
      } else {
        this.$refs["editForm"].validate((valid) => {
          console.log(valid);
          if (valid) {
            putDevice(this.deviceDetail, this.deviceDetail.id).then((res) => {
              this.editIsShow = false;
              this.$message.success("保存成功");
              this.getTableData();
              console.log(res);
            });
          } else {
            return false;
          }
        });
      }
    },
    /** 查看备件更换记录 */
    seeSparePartsRecord(row) {
      showSparePartsRecord(null, row.id).then(res => {
        this.sparePartData = res.data.content;
        this.sparePartIsShow = true;
      })
    },
    /** 查看保养工单 */
    seeMaintainWorkOrders({ no }) {
      this.maintainOrders_dialog.isShow = true;
      this.maintainOrders_dialog.deviceNo = no;
      this.$nextTick(() => {
        this.getMaintainOrdersData();
      });
      // this.$router.push({
      //   path: '/upKeepWorkOrderManage',
      //   query: {
      //     deviceNo: no
      //   }
      // })
    },
    /** 加载保养工单 */
    getMaintainOrdersData() {
      const { deviceNo } = this.maintainOrders_dialog;
      const pageData = this.$refs.maintainOrders.getData();

      maintainWorkOrder({ deviceNo, ...pageData }).then((res) => {
        this.maintainOrders_dialog.data = res.data.content;
        this.maintainOrders_dialog.total = res.data.totalElements;
      });
    },
    /** 表格状态码转文字 */
    statusTranslate(val) {
      if (val == 1) return "待接单";
      if (val == 2 || val == 3 || val == 7) return "待处理";
      if (val == 4 || val == 5) return "审批中";
      if (val == 6) return "已完成";
    },
    /** 查看BOM */
    seeBOM(row) {
      this.BOMIsShow = true;
      this.BOMdata = [];
      this.BOMdataTotal = 0;
      // 等待查看BOM 模态框挂载完成
      this.$nextTick(() => {
        const pageData = this.$refs.BOMtable.getData();
        const data = {
          deviceId: row.id,
          ...pageData,
        };
        queryBom(data).then((res) => {
          console.log(res);
          this.BOMdata = res.data.content;
          this.BOMdataTotal = res.data.totalElements;
        });
      });
    },
    /** 查看BOM备件维修记录列表 */
    seeBOMspartPartRecord(row) {
      console.log(row);
      this.BOMspartPartRecordIsShow = true;
      this.BOMspartPartRecordData = [];
      this.$message.warning("暂无接口");
      getBomDetail(null, row.id).then((res) => {
        console.log(res);
        this.BOMspartPartRecordData = [res.data];
      });
    },
    /** 查看BOM备件更换记录列表 */
    seeBOMspartPartReplaceRecord(row) {
      console.log(row);
      this.BOMspartPartReplaceRecordIsShow = true;
      this.BOMspartPartReplaceRecordData = [];
      this.$message.warning("暂无接口");
    },
    /** 导出备件 */
    exportSpare({ id }) {
      let url = `${apiConfig.deviceBomDownload}`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          params: {
            deviceId: id,
          },
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;

          let fileName = "bom.xlsx";
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
    /** 删除备件 */
    deleteDevice({ id }) {
      this.$confirm("此操作将删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deviceManage.remove(null, id).then((res) => {
            this.$message.success("删除成功");
            this.getTableData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /**
     * 批量删除
     */
    deleteMore() {
      const selected = this.selected
      const ids = selected.map((item) => item.id);
      this.$confirm("此操作将删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
          deviceManage.remove(null, ids).then((res) => {
            this.$message.success("删除成功");
            this.getTableData();
          });
        })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
    },
    /**
     * 批量选择
     */
    handleSelectionChange(e) {
      this.selected = e
    },
  },
};
</script>
