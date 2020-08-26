// 设备履历
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
        <buttom-group />

        <!-- 底部表格 -->
        <tpms-table
          :column_index='false'
          ref="tpmsTable"
          :total='total'
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
          @getTableData='getTableData'
        >
          <template slot="seeDetail" slot-scope="{row}">
            <span class="button" @click="seeEquipmentDetail(row)">详情</span>
          </template>
          <template slot-scope="{row}">
            <span class="button" @click="editDevice(row)">编辑</span>
            <span class="button" @click="brCodeIsShow=true">生产二维码</span>
            <span class="button" @click="seeBOM(row)">查看BOM</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>

    <!-- 维修记录详情模态框 -->
    <el-dialog title="维修记录" :visible.sync="equipmentDetailIsShow" width="80%" center>
      <tpms-table
        height="60vh"
        :data="equipmentTableData"
        :columns="[
          {props:'name',label:'维修单号'},
          {props:'name',label:'设备编号'},
          {props:'name',label:'设备名称'},
          {props:'name',label:'报修区域'},
          {props:'name',label:'报修内容'},
          {props:'name',label:'报修地址'},
          {props:'name',label:'紧急程度'},
          {props:'name',label:'状态'},
          {props:'name',label:'创建时间'},
          {props:'name',label:'创建人'},
        ]"
        :paginationIsShow="false"
      >
        <template slot-scope="{row}">
          <span class="button" slot="reference" @click="seeSparePartsRecord(row)">查看</span>
        </template>
      </tpms-table>
      <el-dialog width="70%" title="维修详情" :visible.sync="sparePartIsShow" center append-to-body>
        <tpms-table
          height="50vh"
          :data="equipmentTableData"
          :columns="[
            {props:'name',label:'备件编号'},
            {props:'name',label:'备件名称'},
            {props:'name',label:'设备编号'},
            {props:'name',label:'设备名称'},
            {props:'name',label:'备件参数'},
            {props:'name',label:'制造商编号'},
            {props:'name',label:'东昌物料号'},
            {props:'name',label:'创建时间'},
            {props:'name',label:'创建人'},
            {props:'name',label:'标签'},
          ]"
          :paginationIsShow="false"
        />
      </el-dialog>
    </el-dialog>

    <!-- 编辑设备模态框 -->
    <el-dialog :visible.sync="editIsShow" width="70%" title="编辑设备">
      <el-row>
        <el-form :model="deviceDetail" label-position="left" label-width="120px">
          <el-col :span="11" :offset="1" v-for="(item) in equipmentTableList" :key="item.label">
            <el-form-item v-bind="item">
              <el-select
                style="width:100%;"
                v-if="item.type==='radio'"
                v-model="deviceDetail[item.props]"
                :placeholder="item.placeholder"
              >
                <el-option
                  v-for="(item,i) in item.checkList"
                  :key="i"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
              <el-input v-else v-model="deviceDetail[item.props]" />
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
        ref='BOMtable'
        height="50vh"
        :data="BOMdata"
        :total='BOMdataTotal'
        :columns="[
          {props:'name',label:'备件名称'},
          {props:'no',label:'备件编号'},
          {props:'specification',label:'型号规格'},
          {props:'materialNo',label:'东昌物料号'},
          {props:'manufacturer',label:'制作商编号'},
          {props:'repairTimes',label:'维修次数'},
          {slotName:'recod',label:'维修记录'},
        ]"
      >
        <template slot="recod" slot-scope="{row}">
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
            {props:'name',label:'维修单号'},
            {props:'name',label:'设备编号'},
            {props:'name',label:'设备名称'},
            {props:'name',label:'报修区域'},
            {props:'name',label:'报修内容'},
            {props:'name',label:'报修地址'},
            {props:'name',label:'紧急程度'},
            {props:'name',label:'状态'},
            {props:'name',label:'创建时间'},
            {props:'name',label:'创建人'},
            {slotName:'recod',label:'备件更换记录'},
          ]"
          :paginationIsShow="false"
        >
          <template slot="recod" slot-scope="{row}">
            <span class="button" @click="seeBOMspartPartReplaceRecord(row)">查看</span>
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
              {props:'name',label:'备件编号'},
              {props:'name',label:'备件名称'},
              {props:'name',label:'设备编号'},
              {props:'name',label:'设备名称'},
              {props:'name',label:'备件参数'},
              {props:'name',label:'制造商编号'},
              {props:'name',label:'东昌物料号'},
              {props:'name',label:'创建时间'},
              {props:'name',label:'创建人'},
              {props:'name',label:'标签'},
            ]"
            :paginationIsShow="false"
          />
        </el-dialog>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { device as getData, queryDevice, putDevice, queryBom, getBomDetail, queryDeviceStatus,deviceStatusManage } from '../../lib/api/device';
import { getWorkshopSection, getWorkShopTeam, getWorkshopArea, workshopAreaNames } from '../../lib/api/factory';
import { workshopSelect } from '../../lib/api/factory';
import { tpmsHeader, tpmsTable } from '../../components';
import { EquipmentResume as buttomGroup } from './components/buttomGroups';
export default {
  data() {
    // 获取头部搜索组下拉选择的list
    let getListFuncs = [ deviceStatusManage['getNames'], workshopAreaNames, workshopSelect ];
    let [ deviceStatus, workshopAreas, workshops ] = getListFuncs.map(getListFunc=>{
      let arr = [];
      getListFunc().then(res=>{
        let data=res.data.content||res.data;
        data.forEach(item=>{
          item.label=item.label||item.value;
        });
        arr.push(...data);
      })
      return arr;
    })
    return {
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "设备名称", props: "name", value: "" },
        { label: "设备编号", props: "no", value: "" },
        { label: "设备状态", props: "deviceStatus", value: "", type:'radio', checkList:deviceStatus },
        { label: "区域", props: "areaId", value: "", type:'radio', checkList:workshopAreas },
        { label: "车间", props: "workshopId", value: "", type:'radio', checkList:workshops },
        { label: "封存状态", props: "archiveState", value: "", type:'radio', checkList:[{label:'已封存',id:true},{label:'未封存',id:false}] },
      ],
      total:0,
      equipmentTableData: [],
      equipmentTableList: [
        // 渲染表格的表头
         { props: "id", label: "序号"},
        { props: "no", label: "设备编号" },
        { props: "name", label: "设备名称",},
        { props: "sap", label: "SAP编号" },
        { props: "model", label: "型号" },
        { props: "specification", label: "规格" },
        { props: "price", label: "原值" },
        { props: "enableDate", label: "启用日期" },
        { props: "primaryAreaName", label: "一级区域" },
        { props: "secondaryAreaName", label: "二级区域" },
        { props: "tertiaryAreaName", label: "三级区域" },
        { props: "deviceType", label: "设备类型" },
        { props: "productionElement", label: "生成因素" },
        { props: "overhaulElement", label: "检修因素" },
        { props: "reserveElement", label: "备用因素" },
        { props: "abc", label: "ABC类" },
        { props: "assetType", label: "资产分类" },
        { props: "secondAssetType", label: "资产二级分类",width:'120px'},
        { props: "deviceStatus", label: "封存状态", translate:(value)=>value?'封存':'未封存',},
        { props: "contractNo", label: "合同编号" },
        { props: "wbs", label: "WBS元素" },
        { props: "bm", label: "BM单编号" },
        { props: "qrPicId", label: "二维码" },
        { props: "repairTimes", label: "维修次数" },
      ],
      equipmentDetailIsShow: false, //查看设备维修记录列表模态框
      equipmentDetailData: [], //查看设备维修记录模态框列表数据
      editIsShow:false,//编辑模态框
      deviceDetail:{},//设备详情，可编辑
      brCodeIsShow:false,//二维码模态框
      brCodeSrc:'http://img5.imgtn.bdimg.com/it/u=3602624501,870193918&fm=26&gp=0.jpg',//二维码地址
      sparePartIsShow: false, //某一条维修记录的 更换的备件列表 模态框
      sparePartData: [], //维修记录更换的备件数据列表
      BOMIsShow: false, //BOM备件维修详情模态框
      BOMdata:[],//BOM列表数据
      BOMdataTotal:0,//BOM列表一共有多少条
      BOMspartPartRecordIsShow: false, //BOM备件维修记录模态框
      BOMspartPartRecordData:[],//BOM备件维修记录
      BOMspartPartReplaceRecordIsShow:false,//BOM备件更换记录模态框
      BOMspartPartReplaceRecordData:[],//BOM备件更换记录

    };
  },
  components:{
    tpmsHeader,buttomGroup,tpmsTable
  },
  created(){},
  mounted(){
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
    getTableData(){
      // 获取头部搜索组数据
      let data = this.$refs.tpmsHeader.getData();
      console.log(data)
      let pageData = this.$refs.tpmsTable.getData();
      getData({...data,...pageData}).then(res=>{
        console.log(res)
          this.total=res.data.totalElements;
          this.equipmentTableData=res.data.content;
          console.log(this.equipmentTableData)
      })
    },
    /** 查看设备维修记录列表 */
    seeEquipmentDetail(row) {
      this.equipmentDetailIsShow = true;
      this.equipmentDetailData = [];
      this.$message.warning('暂无接口')
      console.log(row);
    },
    /** 编辑设备 */
    editDevice(row){
      this.deviceDetail={};
      queryDevice(null,row.id).then(res=>{
        console.log(res)
        this.deviceDetail=res.data;
      })
      this.editIsShow=true;
    },
    /** 保存已编辑的设备 */
    saveDevice(){
      this.editIsShow=false;
      putDevice(this.deviceDetail,this.deviceDetail.id).then(res=>{
      this.editIsShow=false;
        this.$message.success('保存成功')
        console.log(res)
      })
    },
    /** 查看备件更换记录 */
    seeSparePartsRecord(row) {
      this.sparePartIsShow = true;
      this.sparePartData = [];
      console.log(row);
    },
    /** 查看BOM */
    seeBOM(row) {
      this.BOMIsShow = true;
      this.BOMdata=[];
      this.BOMdataTotal=0;
      // 等待查看BOM 模态框挂载完成
      this.$nextTick(()=>{
        const pageData = this.$refs.BOMtable.getData();
        const data={
          deviceId:row.id,
          ...pageData
        };
        queryBom(data).then(res=>{
          console.log(res)
          this.BOMdata = res.data.content;
          this.BOMdataTotal=res.data.totalElements;
        })
      })
    },
    /** 查看BOM备件维修记录列表 */
    seeBOMspartPartRecord(row) {
      console.log(row)
      this.BOMspartPartRecordIsShow = true;
      this.BOMspartPartRecordData = [];
      this.$message.warning('暂无接口')
      getBomDetail(null,row.id).then(res=>{
        console.log(res)
        this.BOMspartPartRecordData=[res.data]
      })
    },
    /** 查看BOM备件更换记录列表 */
    seeBOMspartPartReplaceRecord(row){
      console.log(row)
      this.BOMspartPartReplaceRecordIsShow=true;
      this.BOMspartPartReplaceRecordData=[];
      this.$message.warning('暂无接口')
    }
  }
};
</script>
