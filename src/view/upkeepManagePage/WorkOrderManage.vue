<template>
  <div>
	  <!-- 头部功能区 -->
	  <tpms-header ref="tpmsHeader" :formData="equipmentFormList" @inquireTableData="inquireTableData" />

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
          <template slot="status" slot-scope="{row}">
            <span >{{getExamineStatus(row.status)}}</span>
          </template>
          <template slot="operation" slot-scope="{row}">
            <span class="button" @click="showPlanDetail(row)">查看</span>
            <span class="button" @click="editWorkorders(row)">编辑工单</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>
    <!-- 详情 -->
    <el-dialog title="查看详情" :visible.sync="detailModal" width="80%" >
      <!-- 头部表单 -->
      <el-row style="margin-top:40px">
        <el-form :model="detail" ref="form" label-width="140px" label-position="left">
          <el-row

          >
           <el-col :span="11">
             <el-form-item label="保养工单" required="required">
              <el-input v-model="detail.no" readonly=""></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="11" :offset="2">
             <el-form-item label="计划名称" required="required">
               <el-input v-model="detail.no" readonly></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="11">
             <el-form-item label="计划编号" required="required">
               <el-input v-model="detail.planNo" readonly></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="11" :offset="2">
             <el-form-item  label="审批状态" required="required">
               <el-input v-model="detail.status" readonly></el-input>
             </el-form-item>
           </el-col>
          </el-row>
          <el-row v-for="(v,i) in detail.maintainWorkOrderColonies" style="background: #f5f5f5;padding: 0.2rem">
            <el-col :span="11">
              <el-form-item label="设备名称" required="required">
               <el-input v-model="v.deviceNames" readonly=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="设备编号" required="required">
                <el-input v-model="v.deviceNos" readonly></el-input>
              </el-form-item>
            </el-col>

            <el-table
              :data="v.maintainWorkOrderContents"
              style="width:100%"
              border
              row-key="id"
              default-expand-all
              :tree-props="{children: 'childPlanContents', hasChildren: 'hasChildren'}"
            >
              <el-table-column align="center" type="index" label="项目" width="80"></el-table-column>
              <el-table-column align="center" label="保养部位" width="150">
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{scope.row.executionPart}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养位置" >
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{scope.row.executionNode}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养内容">
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{scope.row.content}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="周期" >
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{scope.row.cycleName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="周期ID" >
                <template slot-scope="scope">
                  <span v-show="!scope.row.editShow">{{scope.row.cycleId}}</span>
                </template>

              </el-table-column>

            </el-table>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
	import {
	  workshopSectionSelect,
	  workStationSelect,
	  planStatusSelect
	} from "../../lib/api/checkPlan";
  import {
   maintainWorkOrder,//工单
   maintainWorkOrderDetail
  } from "../../lib/api/upkeepManagePage";
  import {
    tpmsHeader,
    tpmsTable
  } from "../../components";
  import {getExamineStatus} from '../../utils/index.js'
export default {
    data(){
		// 获取头部搜索组下拉选择的list
		let getListFuncs = [
		  workshopSectionSelect,
		  workStationSelect,
		  planStatusSelect,
		];
		let [stationList, sectionList, statusList] = getListFuncs.map(
		  (getListFunc) => {
		    let arr = [];
		    getListFunc(null).then((res) => {
		      arr.push(...res.data);
		    });
		    return arr;
		  }
		);
        return{
          statusList,
			equipmentFormList:[
				{label:'设备编号',props:'no',value:''},
				{label:'计划名称',props:'planName',value:''},
				{label:'状态',props:'status',value:'',type:'radio',checkList:statusList}
			],
      listData:[],
      equipmentTableList:[
        {props:'no',label:'工单编号'},
        {props:'planName',label:'计划名称'},
        {props:'planNo',label:'计划编号'},
        {props:'hour',label:'工时'},
        {props:'type',label:'类型'},
        {props:'status',label:'状态',slotName:'status'},
        {props:'',label:''},
        {label:'操作',slotName:'operation',width:'200px',fixed:'right'}
      ],
      total:0,
      detailModal:false,
      detail:{}
      }
    },
    components: {
      tpmsHeader,
      tpmsTable
    },
    mounted() {
      this.getData()
    },
    methods:{
    showPlanDetail(row){
      let {id}=row;
      maintainWorkOrderDetail(null,id).then(res=>{
        console.log(res)
        let data=res.data;
        data.status=this.getExamineStatus(data.status)
        this.detail=res.data;
        this.detailModal=true
      })
    },
    editWorkorders(){},
    getExamineStatus,
    /**
     * @description 点击头部按钮查询
     */
		inquireTableData(){
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getData();
    },
    getData(){
        let data = this.$refs.tpmsHeader.getData();
        let pageData = this.$refs.tpmsTable.getData();
        console.log(data);
        maintainWorkOrder({ ...data, ...pageData }).then((res) => {
          this.listData = res.data.content;
          this.total = res.data.totalElements;
        });
    },
        /**
         * @description 分页器中pageSize 改变时触发的事件
         * @param {val} 每页的条数
         */
         handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
       /**
         * @description 分页器中currentPage 改变时触发的事件
         * @param {val} 当前页
         */
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
      },
    }
};
</script>
<style lang="scss" scoped>

.spare-part-dialog-form{
    width: 4.3rem;
    margin: 0 auto;
}
.upkeep-form{
    padding: 0.1rem 1rem;
}
.upkeep-line{
    padding: 0 0.4rem;
    border-bottom: 2px dashed #e9e9e9;
    line-height: 40px;
}
.upkeep-item-right{
    float: right;
    width: 2.5rem;
}
.upkeep-item-left{
    float: left;
}
.new-add-button{
    margin-left: 3rem;
}
.color-blue{
    color:#2888fd;
}
.el-select{
    width: 100%;
}
</style>
