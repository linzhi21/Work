<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref="tpmsHeader" :formData="equipmentFormList" @inquireTableData="inquireTableData" />
    </el-row>
     <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <input @change="chooseFile" v-show="false" type="file" ref='file'>
          <el-button @click='importFile' class="button-more" size="small">导入</el-button>
          <el-button
            class="button-more"
            type="primary"
            size="small"
            @click='newAddDialog=true'
            style="margin-right:30px"
          >新增计划</el-button>
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
          <!-- <template slot="seeDetail" slot-scope="{row}">
            <span class="button" @click="seeEquipmentDetail(row)">详情</span>
          </template> -->
          <template slot="operation" slot-scope="{row}">
            <span class="button" @click="showPlanDetail(row)">查看详情</span>
            <span class="button" @click="checkWorkorders(row)">查看工单</span>
            <!-- <span class="button" @click="brCodeIsShow=true">编辑</span> -->
            <span class="button" @click="del(row.id)">删除</span>
            <!-- <span class="button" @click="seeBOM(row)">发布</span> -->
          </template>
        </tpms-table>
      </el-card>
    </el-row>

    <!-- 查看详情对话框 -->
    <el-dialog :visible.sync="detailDialog" width="80%" title="查看详情">
      <el-row>
        <el-form :model="detail" label-position="left" label-width="120px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="保养名称">
                <el-input v-model="detail.name" readonly="" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="保养计划编号">
                <el-input v-model="detail.no" readonly="" />
              </el-form-item>
            </el-col>
             <el-col :span="11">
              <el-form-item label="设备/生产线名称">
                <el-input v-model="detail.workshopName" readonly="" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="审批状态">
                <el-input :value='getExamineStatus(detail.status)' readonly="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-for="(item,index) in detail.maintainContentColonies"
            :key="index"
            style="background: #f5f5f5;padding: 0.2rem"
          >
            <el-col :span="11">
              <el-form-item label="设备名称">
                <el-input v-model="item.deviceNames" readonly />
              </el-form-item>
            </el-col>

            <el-col :span="11" :offset="2">
              <el-form-item label="设备编号">
                <el-input v-model="item.deviceNos" readonly />
              </el-form-item>
            </el-col>

            <!-- 表格区 -->
            <el-table
              :data="item.maintainPlanContents"
              style="width:100%"
              border
              default-expand-all
              :tree-props="{children: 'childPlanContents', hasChildren: 'hasChildren'}"
            >
              <el-table-column align="center" type="index" label="项目" width="50"></el-table-column>
              <!-- <el-table-column align="center" prop="executionNode" label="时间/部件" width="150"></el-table-column> -->
              <el-table-column align="center" prop="content" label="内容" width="300"></el-table-column>
              <el-table-column align="center" prop="executionNode" label="保养位置"></el-table-column> -->
              <el-table-column align="center" prop="executionPart" label="保养部位"></el-table-column>
              <el-table-column align="center" prop="cycleName" label="周期" width="110"></el-table-column>
              <!-- <el-table-column align="center" prop="photoDisplay" label="图示"></el-table-column> -->
            </el-table>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>

    <!-- 查看保养计划生成的工单 -->
    <el-dialog :visible.sync="workerOrdersDialog" width="80%" title="查看工单">
      <el-row>
        <el-form :model="detail" label-position="left" label-width="120px">
          <el-row style="background: #f5f5f5;padding: 0.2rem">
            <!-- 表格区 -->
            <el-table
              :data="workerOrdersData"
              style="width:100%"
              border
              default-expand-all
              :tree-props="{children: 'childPlanContents', hasChildren: 'hasChildren'}"
            >
              <el-table-column align="center" type="index" label="项目" width="50"></el-table-column>
              <!-- <el-table-column align="center" prop="executionNode" label="时间/部件" width="150"></el-table-column> -->
              <el-table-column align="center" prop="planName" label="保养名称" width="300"></el-table-column>
              <el-table-column align="center" prop="planNo" label="保养计划编号"></el-table-column> -->
              <el-table-column align="center" prop="no" label="区域代号"></el-table-column>
              <el-table-column align="center" prop="status" label="审批状态" width="110"></el-table-column>
              <!-- <el-table-column align="center" prop="photoDisplay" label="图示"></el-table-column> -->
            </el-table>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="editDialog" width="80%" :before-close="handleClose">
      <el-form
        :inline="true"
        class="upkeep-form edit-form"
        :model="editDialogForm"
        label-width="170px"
      >
        <div v-for="(item,index) in editDialogFormList" :key="index">
          <el-form-item :label="item.leftLabel">
            <el-input v-model="editDialogForm[item.leftName]"></el-input>
          </el-form-item>
          <el-form-item :label="item.rightLabel">
            <el-input v-model="editDialogForm[item.rightName]"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">
          <i class="el-icon-edit"></i>
          取 消
        </el-button>
        <el-button type="primary" @click="editDialog = false">
          <i class="el-icon-edit"></i>
          保存
        </el-button>
      </span>
    </el-dialog>


    <!-- 新增对话框 -->
    <el-dialog title="新增" :visible.sync="newAddDialog" width="80%" :before-close="handleClose">
      <!-- 头部表单 -->
     <!-- <el-row>
        <el-button
          class="new-add-button sync-picture"
          type="message"
          size="small"
          :disabled="syncPicture"
          @click="syncPictureFun"
        >同步图片库</el-button>
      </el-row> -->
      <el-row style="margin-top:40px">
        <el-form :model="newAddDialogForm" ref="form" label-width="140px" label-position="left">
          <el-row>
            <el-col :span="11">
              <el-form-item label="保养名称" required="required">
               <el-input v-model="newAddDialogForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="保养计划编号" required="required">
                <el-input v-model="newAddDialogForm.no" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="设备/生产线名称" required="required">
                <el-input v-model="newAddDialogForm.workshopName" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="审批状态" required="required">
                <el-select v-model="newAddDialogForm.status">
                  <el-option v-for="(v,i) in statusSelect"
                   :key='i'
                   :value='v.value'
                   :label='v.label'
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-for="(item,index) in newAddDialogForm.maintainContentColonies"
            :key="index"
            style="background: #f5f5f5;padding: 0.2rem"
          >
            <el-col :span="24">
              <!-- <el-button type="primary" size="small" @click="uploadFiles(index)">批量导入文件</el-button> -->
              <el-button type="primary" size="small" @click="addPlanDevice">新增</el-button>
            </el-col>

            <el-col :span="11" >
              <el-form-item label="设备名称" required="required">
                <el-input v-model="item.deviceNames"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2" required="required">
              <el-form-item label="设备编号">
                <el-input v-model="item.deviceNos"></el-input>
              </el-form-item>
            </el-col>
            <el-table
              :data="item.maintainPlanContents"
              style="width:100%"
              border
              row-key="id"
              default-expand-all
              :tree-props="{children: 'childPlanContents', hasChildren: 'hasChildren'}"
            >
              <el-table-column align="center" type="index" label="项目" width="80"></el-table-column>
              <el-table-column align="center" label="保养部位" width="150">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.executionPart"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.executionPart}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养位置" width="200">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.executionNode"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.executionNode}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养内容" width="200">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.content"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.content}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="执行顺序">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.sort"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.sort}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="所属周期ID" width="200">
                <!-- <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.cycleId"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.cycleId}}</span>
                </template> -->
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.cycleId"
                    style="width:100%"
                    v-show="scope.row.editShow"
                  >
                    <el-option
                      v-for="item in cycleList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" width="280" label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button size="small" @click="scope.row.editShow = true">编辑</el-button>
                  <el-button size="small" @click="scope.row.editShow = false">保存</el-button>
                  <el-button
                    size="small"
                    @click.native.prevent="deleteRow(scope.$index, item.maintainPlanContents)"
                    style="margin-right:10px"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-col :span="10" :offset="14" style="margin-top:20px">
            <el-form-item>
              <el-button type="primary" @click="add()">提交</el-button>
              <el-button @click="newAddDialog = false">取 消</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>

    <el-dialog title="预览" :visible.sync="previewDialog" width="80%" :before-close="handleClose">
      <!-- 头部表单 -->
      <el-row style="margin-top:40px">
        <el-form :model="previewData" ref="form" label-width="140px" label-position="left">
          <el-row

            style="background: #f5f5f5;padding: 0.2rem"
          >
           <el-col :span="11">
             <el-form-item label="保养名称" required="required">
              <el-input v-model="previewData.name"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="11" :offset="2">
             <el-form-item label="保养计划编号" required="required">
               <el-input v-model="previewData.no" ></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="11">
             <el-form-item label="设备/生产线名称" required="required">
               <el-input v-model="previewData.workshopName" ></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="11" :offset="2">
             <el-form-item label="审批状态" required="required">
               <el-select v-model="previewData.status">
                 <el-option v-for="(v,i) in statusSelect"
                  :key='i'
                  :value='v.value'
                  :label='v.label'
                 >
                 </el-option>
               </el-select>
             </el-form-item>
           </el-col>
            <el-table
              :data="previewData.maintainContentColonies[0].maintainPlanContents"
              style="width:100%"
              border
              row-key="id"
              default-expand-all
              :tree-props="{children: 'childPlanContents', hasChildren: 'hasChildren'}"
            >
              <el-table-column align="center" type="index" label="项目" width="80"></el-table-column>
              <el-table-column align="center" label="保养部位" width="150">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.executionPart"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.executionPart}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养位置" width="200">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.executionNode"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.executionNode}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="保养内容" width="200">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.content"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.content}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="执行顺序">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.sort"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.sort}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="所属周期ID" width="200">
                <!-- <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.cycleId"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.cycleId}}</span>
                </template> -->
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.cycleId"
                    style="width:100%"
                    v-show="scope.row.editShow"
                  >
                    <el-option
                      v-for="item in cycleList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" width="280" label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button size="small" @click="scope.row.editShow = true">编辑</el-button>
                  <el-button size="small" @click="scope.row.editShow = false">保存</el-button>
                  <el-button
                    size="small"
                    @click.native.prevent="deleteRow(scope.$index, item.maintainPlanContents)"
                    style="margin-right:10px"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-col :span="10" :offset="14" style="margin-top:20px">
            <el-form-item>
              <el-button type="primary" @click="saveFile">保存</el-button>
              <el-button @click="previewDialog = false">取 消</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  maintainPlan, //查看计划详情
  checkPlanDetail, //查看保养计划详情
  addmaintainPlan, //新增保养计划
  deletePlanDetail, //删除保养计划
  checkWorkorders, // 查看保养计划生成的工单
  importFile     //导入文件
} from "../../lib/api/upkeepManagePage.js";
import {getWorkshopname} from '../../lib/api/user.js';
//查询单个车间
import {queryWorkShop} from '../../lib/api/factory.js';
import { tpmsHeader, tpmsTable } from "../../components";
import {getExamineStatus} from '../../utils/index'
import {cycleSelect} from "../../lib/api/checkPlan";
export default {
  data() {
    return {
      cycleList:[],
      User_info:JSON.parse(localStorage.getItem('user_info')),
      addRules:{},
      equipmentFormList: [   //搜索框数据
        {
          label: "设备名称",
          props: "deviceName",
          value: "",
          placeholder: "请输入设备名称",
        },
        {
          label: "审批状态",
          props: "status",
          value: "",
          type: "radio",
          checkList: [
            {
              label: "待审批",
              id: 1,
            },
            {
              label: "审批中",
              id: 2,
            },
            {
              label: "已退回",
              id: 4,
            },
            {
              label: "待发布",
              id: 8,
            },
            {
              label: "已发布",
              id: 16,
            },
          ],
        },
      ],
      listData: [], //查看的列表详情
      detail:{},//查看的详情
      total:0,  //数据总数
      // 周期的下拉选择框
      statusSelect: [
        {
          value: 1,
          label: "待审批",
        },
        {
          value: 2,
          label: "审批中",
        },
        {
          value: 4,
          label: "已退回",
        },
        {
          value: 8,
          label: "待发布",
        },
        {
          value: 16,
          label: "已发布",
        },
      ],
      equipmentTableList: [
        {
          props: "no",
          label: "保养计划编号",
        },
        {
          props: "name",
          label: "保养名称",
        },
        {
          props: "version",
          label: "版本",
        },
        {
          props: "hour",
          label: "工位/工段",
        },
        {
          props: "workshopTime",
          label: "工时",
        },
        {
          props: "workshopName",
          label: "设备/生产线名称",
        },
        {
          props: "creatorName",
          label: "编制人",
        },
        {
          props: "createDate",
          label: "编制日期",
          width: "180",
        },
        {
          props: "status",
          label: "状态",
        },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "220px",
        }
      ],
      detailDialog: false, // 控制查看详情对话框的打开与关闭
      detailDialogForm: {
        // 查看详情的表单内容
        upkeepName: "SHB0023", // 保养名称
        upkeepPlanNumber: "SHB0023", // 保养计划编号
        version: "正常", // 版本
        workshopStation: "asdas", // 工位/工段
        workshopTime: "润滑油站", // 工时
        partName: "1", // 设备(生产线)名称
        preparePersion: "PHY-001", // 编制人
        prepareDate: "张三", // 编制日期
      },
      editDialog: false, // 控制编辑对话框的打开与关闭
      editDialogForm: {},// 编辑对话框中表单的内容
      editDialogFormList: [
        // 渲染编辑对话框的表单内容
        {
          leftLabel: "检点名称",
          leftName: "upkeepName",
          rightLabel: "工时",
          rightName: "workshopTime",
        },
        {
          leftLabel: "保养计划编号",
          leftName: "upkeepPlanNumber",
          rightLabel: "工位/工段",
          rightName: "workshopStation",
        },
        {
          leftLabel: "版本",
          leftName: "version",
          rightLabel: "设备(生产线)名称",
          rightName: "partName",
        },
        {
          leftLabel: "编制人",
          leftName: "preparePersion",
          rightLabel: "编制日期",
          rightName: "prepareDate",
        },
      ],
      newAddDialog: false, // 控制新增对话框的打开与关闭
      newAddDialogForm: {
          "maintainContentColonies": [
            {
              "deviceNames": "",
              "deviceNos": "",
              "maintainPlanContents": [
                {
                  "accessoryId": 0,
                  "accessoryUrl": "",
                  "content": "",
                  "cycleId": '',
                  "cycleName": "",
                  "executionNode": "",
                  "executionPart": "",
                  "sort": '',
                  "editShow":false
                }
              ]
            }
          ],
          "name": "",
          "no": "",
          "reason": "",
          "status": '',
          "workshopId": '',
          "workshopName": ""
      },   // 新增对话框头部表单
      workerOrdersData:[],        //工单数据
      workerOrdersDialog:false,//是否显示工单详情
      previewDialog:false,   //是否显示预览dialog
      previewData:{
        "maintainContentColonies": [
          {
            "deviceNames": "",
            "deviceNos": "",
            "maintainPlanContents": [
              {
                "accessoryId": 0,
                "accessoryUrl": "",
                "content": "",
                "cycleId": '',
                "cycleName": "",
                "executionNode": "",
                "executionPart": "",
                "sort": '',
                "editShow":false
              }
            ]
          }
        ],
        "name": "",
        "no": "",
        "reason": "",
        "status": '',
        "workshopId": '',
        "workshopName": ""
      }        ,//预览数据
    }
  },
  components: {
    tpmsTable,
    tpmsHeader,
  },
  mounted() {
    this.getData();
    this.getCycleList();
    // this.getWorkShopName();
    getWorkshopname();
  },
  methods: {
    /**
     * @description 保存导入的数据
     */
    saveFile(){

       console.log(JSON.stringify(this.previewData))
      addmaintainPlan(this.previewData).then(res=>{
        this.$message.success('操作成功');
        this.newAddDialog=false;
        this.getData()
      })
    },
    /**
     * @description 选择要导入的文件
     */
    chooseFile(){
      // console.log(this.$refs.file.files)
      let file=this.$refs.file.files[0];
      let formData=new FormData();
      let workshopName=localStorage.getItem('workshopName');
      formData.append('file',file);
      formData.append('workshopName',workshopName);
      importFile(formData).then(res=>{
        let data=res.data[0];
        data.maintainPlanContents=data.maintainPlanContents.map(item=>{
          return Object.assign(item,{editShow:false})
        })
		let {name,workshopId}=JSON.parse(localStorage.getItem('user_info')).principal
        this.previewData={
			"maintainContentColonies":[data],
			"name": name,
			"no": "12",
			"reason": "",
			"status": '',
			"workshopId": workshopId,
			"workshopName": workshopName
		};
        this.previewDialog=true;
      })
    },
    // 导入文件
    importFile(){
      this.$refs.file.click()
    },
    /**
     * @description  查看保养计划生成的工单
     * @param {Object} 当前查看保养的数据对象
     */
    checkWorkorders(row){
      let {id}=row;
      this.workerOrdersDialog=true
      checkWorkorders(null,id).then(res=>{
        console.log(res)
        this.workerOrdersData=res.data.content;
      })

    },
    /** 获取周期列表 */
    getCycleList() {
      var workshopId = this.User_info.principal.workshopId;
      cycleSelect(null, workshopId + "/cycle/names").then((res) => {
        console.log("周期列表", res);
        this.cycleList = res.data;
      });
    },
    /**
     * @description 删除指定的保养子项
     * @param {Number} index  当前被删除项的下标
     * @param {Object} row    当前被删除项的数组
     */
    deleteRow(index,row){
      row.splice(index,1)
    },
    edit(option){
     console.log(option)
     option.editShow=true;
     // this.$forceUpdate();
    },
    /**
     * @description 获取周期列表
     */
    getCycleList() {
      var workshopId = this.User_info.principal.workshopId;
      cycleSelect(null, workshopId + "/cycle/names").then((res) => {
        this.cycleList = res.data;
      });
    },
    /**
     * @description 新增保养子项
     */
    addPlanDevice(){
      this.newAddDialogForm.maintainContentColonies.push({
          "deviceNames": "",
          "deviceNos": "",
          "maintainPlanContents": [
            {
              "accessoryId": 0,
              "accessoryUrl": "",
              "content": "",
              "cycleId": '',
              "cycleName": "",
              "executionNode": "",
              "executionPart": "",
              "sort": '',
              "editShow":false
            }
          ]
      })
    },
    /**
     * @description 删除指定的保养
     * @param {Object} id 要删除的保养的id编号
     */
    del(id){
      console.log(id)
      // return false;
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                deletePlanDetail(null,id).then(res=>{
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getData();
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
    },
    /**
     * @description 添加保养计划
     */
    add(){
      addmaintainPlan(this.newAddDialogForm).then(res=>{
        this.$message.success('操作成功');
        this.newAddDialog=false;
        this.getData()
      })
    },
    /**
     * @description 根据状态码返回相对应的中文审批状态
     */
    getExamineStatus,
    showPlanDetail(row) {
      this.detailDialog = !this.detailDialog;
      checkPlanDetail(null,row.id).then(res=>{
        // console.log(res,row.id)
        this.detail=res.data
      })
    },
     /**
      * @description 点击查询按钮触发该函数
     */
    inquireTableData() {
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getData();
    },
    /**
     * @description 查看计划列表
     */
    getData() {
      let data = this.$refs.tpmsHeader.getData();
      let pageData = this.$refs.tpmsTable.getData();
      console.log(data);
      maintainPlan({ ...data, ...pageData }).then((res) => {
        this.listData = res.data.content;
        this.total = res.data.totalElements;
      });
    },
    /**
     * @description 打开查看详情对话框
     * @param {val} 表格中每一行的数据
     */
    showDetailDialog(val) {
      const _this = this;
      _this.detailDialog = true;
      _this.detailDialogForm = val;
    },
    /**
     * @description 打开查看编辑对话框
     */
    showEditDialog(val) {
      const _this = this;
      _this.editDialog = true;
      _this.editDialogForm = val;
    },
    /**
     * @description 打开新增对话框
     */
    showNewAddDialog(val) {
      const _this = this;
      if (val == 0) {
        _this.newAddDialog = true;
      }
    },
    /**
     * @description 关闭所有对话框
     */
    handleClose() {
      const _this = this;
      _this.detailDialog = false;
      _this.editDialog = false;
      _this.newAddDialog = false;
      this.previewDialog=false
    },
  },
};
</script>
<style lang="scss" scoped>
.add-input {
  width: 60%;
}

.spare-part-dialog-form {
  width: 4.3rem;
  margin: 0 auto;
}

.upkeep-form {
  padding: 0.1rem 1rem;
}

.edit-form {
  & > div {
    display: flex;
    justify-content: space-around;
  }
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
  color: #2888fd;
}

.el-select {
  width: 100%;
}
</style>
