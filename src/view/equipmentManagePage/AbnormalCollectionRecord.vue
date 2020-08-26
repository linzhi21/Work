// 异常领用记录
<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <!-- <el-row type="flex" justify="space-between"> -->
        <tpms-header ref='tpmsHeader' :formData='equipmentFormList' @inquireTableData='inquireTableData' label-width='90px' />
        <buttomGroup />
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :data='equipmentTableData'
          :columns="equipmentTableList"
        >
          <template slot-scope="{row}">
            <span class="button" @click="seeDeatil(row)">查看</span>
          </template>
        </tpms-table>
        <!-- 分页 -->
      </el-card>
    </el-row>

    <!-- 维修记录详情模态框 -->
    <el-dialog title="查看" :visible.sync="detailIsShow" width="60%" center>
      <el-row>
        <el-form :model="detailData" label-position="left" label-width="120px">
          <el-col :span="item.type==='textArea'?24:11" :offset="index%2&&item.type!=='textArea'?2:0" v-for='(item,index) in detailDataKey' :key='item.label'>
            <el-form-item :label="item.label">
              <el-input v-if="item.type==='textArea'" type="textarea" disabled v-model="detailData[item.props]" />
              <el-input v-else disabled v-model="detailData[item.props]" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { queryAbnormalConsuming as getData, getAbnormalConsumingDetail } from '../../lib/api/device';
import { tpmsHeader, tpmsTable } from '../../components';
import { AbnormalCollectionRecord as buttomGroup } from './components/buttomGroups';
export default {
  data() {
    return {
      equipmentForm: {
        // 设备管理头部表单
        equipmentName: "", // 设备名称
        equipmentNumber: "", // 设备编号
        workshopSection: "", // 工位
        team: "", // 班组
        equipmentArea: "" // 区域
      },
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "设备名称", props: "deviceName", value: "" },
        { label: "设备编号", props: "deviceNo", value: "" },
        { label: "领用人", props: "consumerId", value: "" },
        {
          label: "领用时间",
          props: "timeFrame",
          value: [],
          type: "timeFrame"
        },
        { label: "备件名称", props: "spareName", value: "" },
        { label: "备件编号", props: "spareNo", value: "" },
        { label: "维修单编号", props: "maintenanceNo", value: "" }
      ],
      equipmentTableData: [
        // 表格的数据
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        },
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        },
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        },
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        },
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        },
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        },
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        },
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        },
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        },
        {
          equipmentNumber: "123456",
          equipmentName: "润滑油站",
          wokrshop: "润滑油站",
          equipmentArea: "PHY-001",
          sectionName: "001",
          team: "主机温度",
          jobNumber: "1300",
          manufacturer: "1100",
          codeNumber: "1400",
          enable: "2020-09-06",
          whether: "34"
        }
      ],
      equipmentTableList: [
        // 渲染表格的表头
        { props: "deviceName", label: "设备名称" },
        { props: "deviceNo", label: "设备编号" },
        { props: "consumerId", label: "领用人" },
        { props: "maintenanceNo", label: "关联维修单号" },
        { props: "spareName", label: "领用备件名称" },
        { props: "usage", label: "用途" }
      ],
      currentPage: 1, //分页起 当前页
      pageSize: 10, //分页器 每页展示多少数据
      total: 30, //分页器 一共有多少条数据
      detailIsShow: false, //异常记录详情模态框
      detailData: {}, //异常记录详情模态框数据
      detailDataKey: [ //异常记录详情模态框展示哪些字段
        { props: "deviceNo", label: "设备编号" },
        { props: "deviceName", label: "设备名称" },
        { props: "consumerName", label: "领用人" },
        { props: "consumerDate", label: "领用日期" },
        { props: "maintenanceNo", label: "维修单编号" },
        { props: "team", label: "领用备件名称" },
        { props: "usage", label: "用途" },
        { props: "sectionName", label: "备注", type:'textArea' },
      ],
    };
  },
  components:{
    tpmsHeader,tpmsTable,buttomGroup
  },
  mounted(){
    this.getTableData();
  },
  methods: {
    /**
     * @description 分页器中pageSize 改变时触发的事件
     * @param {val} 每页的条数
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.getTableData();
    },
    /**
     * @description 分页器中currentPage 改变时触发的事件
     * @param {val} 当前页
     */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getTableData();
    },
    /** 查询页面表格数据 */
    inquireTableData() {
      this.currentPage = 1;
      this.getTableData();
    },
    /** 加载页面表格数据 */
    getTableData() {
      // 获取头部搜索组数据
      const data = this.$refs.tpmsHeader.getData();
      const { timeFrame } = data;
      if(timeFrame===null||timeFrame.length===0){
        var startTime = endTime = ''
      }else{
        var startTime = timeFrame.split(',')[0];
        var endTime = timeFrame.split(',')[1];
      }
      delete data.timeFrame;
      const pageData = this.$refs.tpmsTable.getData();
        getData({
          startTime,
          endTime,
          ...data,
          ...pageData
        }).then(res=>{
          console.log(res)
            this.total=res.data.total;
            this.equipmentTableData=res.data.content;
        })
      console.log(data);
    },
    /** 查看异常记录详情 */
    seeDeatil(row) {
      this.detailIsShow = true;
      this.detailData={};
      getAbnormalConsumingDetail(null,row.id).then(res=>{
        console.log(res)
        this.detailData=res.data;
      })
    },
  }
};
</script>