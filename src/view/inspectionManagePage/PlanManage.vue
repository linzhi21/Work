<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header ref="tpmsHeader" :formData="equipmentFormList" @inquireTableData="inquireTableData" />
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <el-button @click='exportFile' class="button-more" size="small">导出</el-button>
          <el-button class="button-more" type="primary" size="small" @click="add" style="margin-right:30px">新增计划</el-button>
        </el-row>
        <!-- 底部表格 -->
        <tpms-table ref="tpmsTable" :total="total" :data="equipmentTableData" :columns="equipmentTableList"
          @inquireTableData="inquireTableData" @selection-change="handleSelectionChange">
          <template slot="operation" slot-scope="scope">
            <span class="button" @click="view(scope.row)">查看</span>
            <span class="button" @click="approval(scope.row)" v-if="scope.row.status == '待审批'">审批</span>
            <span class="button" @click="viewWorkOrder(scope.row)" v-if="scope.row.status == '已发布' || scope.row.status == '已取消'">查看工单</span>
            <span class="button" @click="edit(scope.row)" v-if="scope.row.status != '待审批' && scope.row.status != '审批中'">编辑</span>
            <span class="button" @click="del(scope.row)" v-if="scope.row.status == '待审批' || scope.row.status == '已退回'">删除</span>
            <span class="button" @click="release(scope.row)" v-if="scope.row.status == '待发布'">发布</span>
            <span class="button" @click="cancel(scope.row)" v-if="scope.row.status == '已发布'">取消计划</span>
            <span class="button" @click="newApproval(scope.row)" v-if="scope.row.status == '已取消' || scope.row.status == '已退回'">重新发起审批</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>

    <!-- 查看工单 -->
    <el-dialog width="90%" title="查看工单" :visible.sync="oneWorkOrderIsShow" center append-to-body>
      <tpms-table height="50vh" :data="oneWorkOrderData" :columns="[
              {props:'no',label:'工单编号'},
              {props:'planNo',label:'巡检计划编号'},
              {props:'planName',label:'巡检计划名称'},
              {props:'createDate',label:'生成日期'},
              {props:'statusStr',label:'状态'},
              {props:'receiverName',label:'接单人'}
            ]"
        :paginationIsShow="false" />
    </el-dialog>

    <!-- 新增对话框 -->
    <el-dialog title="新增" :visible.sync="newAddDialog" width="80%" :before-close="handleClose">
      <!-- 头部表单 -->
      <el-row>
        <el-button class="new-add-button sync-picture" type="message" size="small" :disabled="syncPicture" @click="syncPictureFun">同步图片库</el-button>
      </el-row>
      <el-row style="margin-top:40px">
        <el-form :model="form" ref="form" label-width="140px" label-position="left">
          <el-row>
            <el-col :span="11">
              <el-form-item label="类型2" required="required">
                <el-radio-group v-model="form.type">
                  <el-radio label="1">巡检计划</el-radio>
                  <el-radio label="3">日常保养</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="车间名称" required="required">
                <el-input v-model="form.workshopName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="巡检计划编号" required="required">
                <el-input v-model="form.no" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="巡检名称" required="required">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item,index) in form.planDevices" :key="index" style="background: #f5f5f5;padding: 0.2rem">
            <el-col :span="18">
              <el-form-item label="导入设备巡检计划">
                <div>
                  <tpms-choosefile plain text='选择文件' @getFileData='getFileData($event,index)'></tpms-choosefile>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <!-- <el-button type="primary" size="small" @click="uploadFiles(index)">批量导入文件</el-button> -->
              <tpms-choosefile isMutiple :multiple='true' plain text='批量导入文件' @getFileData='getMutipleFileData($event,index)'></tpms-choosefile>
              <el-button type="primary" plain size="mini" @click="addPlanDevice">新增</el-button>
            </el-col>

            <el-col :span="11">
              <el-form-item label="版本" required="required">
                <el-input v-model="item.version"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2" required="required">
              <el-form-item label="设备(生产线)名称">
                <!-- <el-input v-model="item.deviceName"></el-input> -->
                <el-select @change="getDeviceId($event,item)" v-model="item.deviceName" placeholder="请选择" style="width:100%">
                  <el-option v-for="(item,i) in deviceInfo" :key="i" :label="item.name" :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="11">
              <el-form-item label="工位" required="required">
                <el-select v-model="item.stationId" style="width:100%">
                  <el-option v-for="item in stationList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="工段" required="required">
                <el-select v-model="item.sectionId" style="width:100%">
                  <el-option v-for="item in sectionList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="编制人" required="required">
                <el-input v-model="item.qrPicId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="编制日期" required="required">
                <el-date-picker v-model="item.repairTimes" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>

            <!-- 表格区 -->
            <el-table :data="item.planContents" style="width:100%" border row-key="id" default-expand-all :tree-props="{children: 'childPlanContents', hasChildren: 'hasChildren'}">
              <el-table-column align="center" type="index" label="项目" width="80"></el-table-column>
              <el-table-column align="center" label="时间/部件" width="150">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.executionNode"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.executionNode}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="内容" width="300">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.content"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.content}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="工时(s)">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.hour"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.hour}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="方法">
                <template slot-scope="scope">
                  <el-input v-show="scope.row.editShow" v-model="scope.row.method"></el-input>
                  <span v-show="!scope.row.editShow">{{scope.row.method}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="周期" width="110">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.cycleId" style="width:100%" v-show="scope.row.editShow">
                    <el-option v-for="item in cycleList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                  <el-select v-model="scope.row.cycleId" style="width:100%" v-show="!scope.row.editShow" disabled>
                    <el-option v-for="item in cycleList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="photoDisplay" label="图示">
                <!-- <template slot-scope="scope">
                  <img v-if="scope.row.photoDisplay" :src="scope.row.photoDisplay" class="avatar" />
                </template>-->
              </el-table-column>
              <el-table-column align="center" width="400" label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button size="small" @click="scope.row.editShow = true">编辑</el-button>
                  <el-button size="small" @click="scope.row.editShow = false">保存</el-button>
                  <el-button size="small" @click.native.prevent="deleteRow(scope.$index, item.planContents)" style="margin-right:10px">删除</el-button>
                  <div style="display: inline-block;" @click="uploadImg(index,scope.$index)">
                    <el-upload class="avatar-uploader" :action="uploadImgUrl" :headers="uploadHeaders" :show-file-list="false"
                      :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <el-button size="small" type="file">上传图示</el-button>
                    </el-upload>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-col :span="7" :offset="17" style="margin-top:20px">
            <el-form-item>
              <el-button type="primary" @click="submitForm()">提交</el-button>
              <el-button @click="newAddDialog = false">取 消</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog :visible.sync="orderDetailIsShow" width="80%" title="查看">
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
                <el-input v-model="orderDetail.name" disabled />
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
          <el-row v-for="(item,index) in orderDetail.planDevices" :key="index" style="background: #f5f5f5;padding: 0.2rem">
            <el-col :span="11">
              <el-form-item label="版本">
                <el-input v-model="item.version" disabled />
              </el-form-item>
            </el-col>
            <el-col :offset="13"></el-col>
            <el-col :span="11">
              <el-form-item label="工位">
                <el-input v-model="item.workSectionName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="工段">
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
            <el-table :data="item.planContents" style="width:100%" border default-expand-all :tree-props="{children: 'childPlanContents', hasChildren: 'hasChildren'}">
              <el-table-column align="center" type="index" label="项目" width="50"></el-table-column>
              <el-table-column align="center" prop="executionNode" label="时间/部件" width="150"></el-table-column>
              <el-table-column align="center" prop="content" label="内容" width="300"></el-table-column>
              <el-table-column align="center" prop="hour" label="工时(s)"></el-table-column>
              <el-table-column align="center" prop="method" label="方法"></el-table-column>
              <el-table-column align="center" prop="cycleName" label="周期" width="110"></el-table-column>
              <el-table-column align="center" prop="photoDisplay" label="图示"></el-table-column>
            </el-table>
          </el-row>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 提交审批 -->
    <el-dialog width="30%" title="审批" :visible.sync="approvalIsShow" center append-to-body>
      <div style="text-align: center;">
        <el-button type="primary" @click="adopt()">审批通过</el-button>
        <el-button type="primary" @click="reject()">审批驳回</el-button>
      </div>
    </el-dialog>
    <!-- 批量导入文件 -->
    <el-dialog width="50%" title="批量导入文件" :visible.sync="uploadFileIsShow" center append-to-body>
      <div>
        <el-upload class="upload-demo" ref="upload" :on-remove="handleRemove" :on-change="handleChange" multiple action="#"
          :file-list="fileList" accept=".xls, .xlsx" :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传.xls/.xlsx文件，且不超过30M</div>
        </el-upload>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile
  } from "../../components";
  import {
    getDeviceName
  } from "../../lib/api/device";
  import {
    uploadAccessory
  } from "../../lib/api/accessory";
  import apiConfig from "../../lib/api/apiConfig";
  import {
    device
  } from '@/lib/api/device.js'
  import {
    planList,
    oneWorkorders,
    queryPlan,
    addPlan,
    patchPlan,
    workshopSectionSelect,
    workStationSelect,
    planStatusSelect,
    delPlan,
    workshopAreaManage,
    workshopManage,
    planNewNo,
    cycleSelect,
    updatePlanPicture,
    importURLPlanFile,
    importPlanFile,
    exportExcel
  } from "../../lib/api/checkPlan";
  import {
    getWorkshopname
  } from '../../lib/api/user.js';
  import axios from 'axios'
  export default {
    data() {
      // 类型列表
      const typeList = [{
          id: "1",
          label: "巡检计划"
        },
        {
          id: "3",
          label: "日常保养"
        },
      ];
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
      return {
        User_info: JSON.parse(localStorage.getItem('user_info')),
        uploadHeaders: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token')
        },
        uploadImgUrl: apiConfig.uploadAccessory + 64,
        cycleList: [], // 周期列表
        typeList: typeList, //巡检类型列表
        deviceList: [], //设备列表
        stationList: stationList, //工位列表
        sectionList: sectionList, //工段列表
        statusList: statusList, //状态列表
        //  渲染头部功能区的列表
        equipmentFormList: [{
            label: "设备名称",
            props: "deviceName",
            value: ""
          },
          {
            label: "类型",
            props: "type",
            value: "1",
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
        ],
        total: 0,
        // 表格的数据
        equipmentTableData: [],
        // 渲染表格的表头
        equipmentTableList: [{
            type: 'selection'
          },
          {
            props: "no",
            label: "巡检计划编号",
            width: "160px"
          },
          {
            props: "type",
            label: "类型"
          },
          {
            props: "name",
            label: "巡检名称"
          },
          {
            props: "hour",
            label: "总工时"
          },
          {
            props: "creatorName",
            label: "制定人"
          },
          {
            props: "createDate",
            label: "制定日期",
            width: "200px"
          },
          {
            props: "status",
            label: "状态"
          },
          {
            label: "操作",
            slotName: "operation",
            fixed: "right",
            width: "240px",
          },
        ],
        oneWorkOrderIsShow: false, //查看巡检工单列表弹窗
        oneWorkOrderData: [], //查看巡检工单列表数据
        syncPicture: false,
        newAddDialog: false, //新增巡检计划弹窗
        //新增巡检计划表单
        form: {
          type: "1", //巡检计划
          no: "", //巡检计划编号
          name: "", //巡检名称
          workshopId: "", //车间ID
          workshopName: "", //车间名称
          areaName: "", //区域名称
          planDevices: [{
            id: "",
            version: "", //版本
            stationId: "", //工位
            sectionId: "", //工段
            hour: "", //工时
            qrPicId: "", //编制人
            repairTimes: "", //编制日期
            deviceId: "1", //设备(生产线)名称ID
            planContents: [{
              id: "",
              editShow: false,
              executionNode: "", //时间/部件
              content: "", //  内容
              hour: "", //工时（s）
              cycleId: "", //周期
              accessoryUrl: "111", //图示
              accessoryId: "1", //图示ID
              method: "", //方法
              childPlanContents: [
                //可展开的子节点
              ],
            }, ],
          }, ],
        },
        planDevicesIndex: "",
        orderDetailIsShow: false, //查看巡检计划详情弹窗
        orderDetail: {}, //查看巡检计划详情数据
        approvalIsShow: false,
        importFileUrl: apiConfig.importPlanFile,
        importFileData: {
          workshopName: "PFMA",
        },
        uploadFileIsShow: false,
        importURLFileUrl: apiConfig.importURLPlanFile,
        fileList: [],
        deviceList: [],
        deviceInfo: [], //设备下拉框信息
        planId: ''
      };
    },
    components: {
      tpmsHeader,
      tpmsTable,
      tpmsChoosefile
    },
    created() {},
    mounted() {
      this.getTableData();
      this.getCycleList();
      getWorkshopname();
      this.getDeviceList()
    },
    methods: {
      exportFile() {
        if (this.planId.length > 0) {
          let url = `${apiConfig.exportExcel}`; //请求下载文件的地址
          let token = localStorage.getItem('access_token'); //获取token
          axios
            .get(url, {
              params:{
                planId:this.planId
              },
              headers: {
                Authorization:'Bearer ' + token
              },
              responseType: "blob"
            })
            .then(res => {
          console.log(res)
              if (!res) return;
              let blob = new Blob([res.data], {
                type: "application/vnd.ms-excel;charset=utf-8"
              });
              let url = window.URL.createObjectURL(blob);
              let aLink = document.createElement("a");
              aLink.style.display = "none";
              aLink.href = url;
              aLink.setAttribute("download", "Bom.xls"); // 下载的文件
              document.body.appendChild(aLink);
              aLink.click();
              document.body.removeChild(aLink);
              window.URL.revokeObjectURL(url);
            })
            .catch(error => {
              this.$message.error(error);
            });
        } else {
          this.$message.error('请选择要导出的数据')
        }
      },
      handleSelectionChange(e) {
        // console.log(e)
        let arr = [];
        for (var i = 0; i < e.length; i++) {
          arr.push(e[i].id)
        }
        this.planId = arr.join(',');
      },
      getDeviceId(e, item) {
        for (var i = 0; i < this.deviceInfo.length; i++) {
          if (this.deviceInfo[i].name == e) {
            item.deviceId = this.deviceInfo[i].id;
            break;
          }
        }
      },
      getDeviceList() {
        let option = {

        }
        device(option).then(res => {
          // console.log(res)
          this.deviceInfo = res.data.content;
        })
      },
      /**
       * @description 导入单个文件
       * @param {Object} e 文件对象
       * @param {Object} index 导入的form.planDevices数组下标
       */

      getFileData(file, index) {
        let formData = new FormData();
        let workshopName = localStorage.getItem('workshopName');
        formData.append('file', file);
        // 车间名注意下
        formData.append('workshopName', 'PFMB');
        importPlanFile(formData).then(res => {
          // console.log(res,item)
          let data = res.data[0];
          data.planContents = data.planContents.map(item => {
            return Object.assign(item, {
              editShow: false
            })
          })
          this.form.planDevices[index] = data
          this.$set(this.form.planDevices, index, res.data[0])
          // console.log(this.form)
        })
      },
      getMutipleFileData(files, index) {
        let formData = new FormData();
        files.forEach(function(file) {
          formData.append('file', file, file.name);
        })

        // formData.append('file',file);
        formData.append('workshopName', 'PFMB');
        importURLPlanFile(formData).then(res => {
          console.log(res)

          let data = res.data;
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].planContents.length; j++) {
              data[i].planContents[j].editShow = false;
            }
          }
          this.form.planDevices.splice(index, 1);
          this.form.planDevices = this.form.planDevices.concat(data);
          // let len=index+res.data.length
          // for(var j=index;j<len;j++){
          //   this.form.planDevices[j]=res.data[len-j-index];
          //   this.$set(this.form.planDevices,j,res.data[len-j-index])
          // }
          // this.$forceUpdate()
          // this.$set(this.form.planDevices,index,res.data[0])



        })
      },
      /** 获取周期列表 */
      getCycleList() {
        var workshopId = this.User_info.principal.workshopId;
        cycleSelect(null, workshopId + "/cycle/names").then((res) => {
          // console.log("周期列表", res);
          this.cycleList = res.data;
        });
      },
      /**查询*/
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
        planList({ ...data,
          ...pageData
        }).then((res) => {
          // console.log({ ...data, ...pageData})
          this.total = res.data.totalElements;
          this.equipmentTableData = res.data.content;
        });
      },
      /** 查看巡检计划详情  */
      view(row) {
        queryPlan(null, row.id).then((res) => {
          this.orderDetail = res.data;
        });
        this.orderDetailIsShow = true;
      },
      /** 关闭所有对话框 */
      handleClose() {
        const _this = this;
        _this.newAddDialog = false;
        _this.oneWorkOrderIsShow = false;
        _this.approvalIsShow = false;
      },

      /**  新增巡检计划按钮*/
      add() {
        this.newAddDialog = true;
        this.form = {
          type: "1", //巡检计划
          no: "", //巡检计划编号
          name: "", //巡检名称
          workshopId: "", //车间ID
          workshopName: "", //车间名称
          areaName: "", //区域名称
          planDevices: [{
            id: "",
            version: "", //版本
            stationId: "", //工位
            sectionId: "", //工段
            hour: "", //工时
            qrPicId: "", //编制人
            repairTimes: "", //编制日期
            deviceId: "", //设备(生产线)名称ID
            planContents: [{
              id: "",
              editShow: false,
              executionNode: "", //时间/部件
              content: "", //  内容
              hour: "", //工时（s）
              cycleId: "", //周期
              accessoryUrl: "", //图示
              accessoryId: "", //图示id
              method: "", //方法
              childPlanContents: [
                //可展开的子节点
              ],
            }, ],
          }, ],
        };
        this.getWorkshopAreaManage();
      },
      // 同步图示库
      syncPictureFun() {
        updatePlanPicture(data).then((res) => {
          // console.log(res);
        });
      },
      // 获取点击的导入文件的index
      getIndex(index) {
        this.planDevicesIndex = index;
      },
      /**  导入文件成功 */
      importFileSuccess(res, file) {
        var index = this.planDevicesIndex;
        console.log(index);
        this.form.planDevices[index] = res.data[0];
        console.log(this.form);
      },
      //打开批量导入文件弹窗
      uploadFiles(index) {
        this.planDevicesIndex = index;
        this.uploadFileIsShow = true;
      },
      /**  批量导入文件*/
      submitUpload() {
        console.log(this.fileList);
        if (this.fileList.length === 0) {
          this.$message.warning("请选取文件");
          return false;
        }
        const data = {
          file: this.fileList,
          workshopName: "PFMB",
        };
        importURLPlanFile(data).then((res) => {
          console.log(res);
        });
      },
      // 选择单个文件
      handleChange(fileList) {
        this.fileList.push(fileList);
      },
      // 删除单个文件
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      /**  获取区域名称 */
      getWorkshopAreaManage() {
        workshopAreaManage(
          null,
          this.User_info.principal.workshopAreaId
        ).then((res) => {
          // console.log(res);
          this.form.areaName = res.data.name;
          var areaNo = res.data.no;
          this.getWorkshopManage(areaNo);
        });
      },
      /**  获取车间名称 */
      getWorkshopManage(areaNo) {
        workshopManage(
          null,
          this.User_info.principal.workshopId
        ).then((res) => {
          console.log("workshopName", res.data.name);
          this.form.workshopName = res.data.name;
          this.importFileData.workshopName = res.data.name;
          this.form.workshopId = res.data.id;
          var workshopNo = res.data.no;
          this.getPlanNewNo(workshopNo, areaNo);
        });
      },
      /**  获取巡检计划编号 */
      getPlanNewNo(workshopNo, areaNo) {
        var data = {
          type: this.form.type,
          workshopNo: workshopNo,
          areaNo: areaNo,
        };
        // console.log(data);
        planNewNo(data).then((res) => {
          // console.log(res);
          this.form.no = res.data;
        });
      },
      /** 编辑巡检计划 */
      edit(row) {
        // console.log(row);
        queryPlan(null, row.id).then((res) => {
          // console.log(res);
          this.form = res.data;
        });
        this.newAddDialog = true;
      },
      /** 提交巡检计划 */
      submitForm() {
        var form = this.form;
        var newType = false;
        // if (!form.name) {
        //   this.$message.warning("缺少必填项!");
        //   return false;
        // }
        // const validate = form.planDevices.filter((item) => {
        //   if (!item.version) return true;
        //   if (!item.deviceId) return true;
        //   if (!item.stationId) return true;
        //   if (!item.hour) return true;
        //   if (!item.qrPicId) return true;
        //   if (!item.repairTimes) return true;
        //   const validateee = item.planContents.filter((itemm) => {
        //     if (!itemm.executionNode) return true;
        //     if (!itemm.content) return true;
        //     if (!itemm.hour) return true;
        //     if (!itemm.cycleId) return true;
        //     if (!itemm.photoDisplay) return true;
        //   });
        //   if (validateee.length) {
        //     this.$message.warning("缺少必填项!");
        //     return true;
        //   }
        // });

        // if (validate.length) {
        //   this.$message.warning("缺少必填项!");
        //   return;
        // }

        console.log(JSON.stringify(form));
        addPlan(form).then((res) => {
          console.log(res);
          this.newAddDialog = false;
          this.getTableData();
        });
      },

      /**  新增巡检计划的 planDevices */
      addPlanDevice() {
        this.form.planDevices.push({
          version: "", //版本
          stationId: "", //工位
          sectionId: "", //工段
          hour: "", //工时
          workshopId: "", //设备(生产线)名称
          qrPicId: "", //编制人
          repairTimes: "", //编制日期
          planContents: [{
            id: "",
            editShow: false,
            executionNode: "", //时间/部件
            content: "", //  内容
            hour: "", //工时（s）
            cycleId: "", //周期
            accessoryUrl: "111", //图示
            accessoryId: "1", //图示id
            method: "", //方法
            childPlanContents: [
              //可展开的子节点
            ],
          }, ],
        });
      },
      //删除planContents里的一条数据
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      //审批巡检计划
      approval(row) {
        // console.log(row);
        queryPlan(null, row.id).then((res) => {
          // console.log(res);
          this.form = res.data;
        });
        this.approvalIsShow = true;
      },
      //审批通过
      adopt() {
        this.form.status = 2;
        patchPlan(this.form, this.form.id).then((res) => {
          // console.log(res);
          this.getTableData();
          this.$message({
            type: "success",
            message: "已同意审批!",
          });
        });
      },
      //审批驳回
      reject() {
        this.form.status = 3;
        patchPlan(this.form, this.form.id).then((res) => {
          // console.log(res);
          this.getTableData();
          this.$message({
            type: "success",
            message: "已驳回审批!",
          });
        });
      },
      //发起审批巡检计划
      newApproval(row) {
        // console.log(row);
        this.$confirm("重新发起审批, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            queryPlan(null, row.id).then((res) => {
              // console.log(res);
              this.form = res.data;
            });
            this.form.status = 1;
            patchPlan(this.form, row.id).then((res) => {
              // console.log(res);
              this.getTableData();
              this.$message({
                type: "success",
                message: "重新发起审批成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消重新发起审批!",
            });
          });
      },
      //  查看巡检工单
      viewWorkOrder(row) {
        // console.log(row);
        oneWorkorders(null, row.id + "/workorders").then((res) => {
          // console.log(res);
          this.oneWorkOrderData = res.data;
        });
        this.oneWorkOrderIsShow = true;
      },
      //删除巡检计划
      del(row) {
        // console.log(row);
        this.$confirm("此操作将删除巡检计划, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            delPlan(null, row.id).then((res) => {
              // console.log(res);
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
      //发布巡检计划
      release(row) {
        // console.log(row);
        this.$confirm("发布巡检计划, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            queryPlan(null, row.id).then((res) => {
              // console.log(res);
              this.form = res.data;
            });
            this.form.status = 5;
            patchPlan(this.form, row.id).then((res) => {
              // console.log(res);
              this.getTableData();
              this.$message({
                type: "success",
                message: "发布成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消发布",
            });
          });
      },
      //取消巡检计划
      cancel(row) {
        // console.log(row);
        this.$confirm("取消巡检计划, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            queryPlan(null, row.id).then((res) => {
              // console.log(res);
              this.form = res.data;
            });
            this.form.status = 6;
            patchPlan(this.form, row.id).then((res) => {
              // console.log(res);
              this.getTableData();
              this.$message({
                type: "success",
                message: "取消巡检计划成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消取消巡检计划",
            });
          });
      },
      //获取图片上传按钮的index
      uploadImg(index, num) {
        console.log(index, num);
      },
      // 图片上传成功
      handleAvatarSuccess(res, file) {
        // this.imageUrl = URL.createObjectURL(file.raw);
      },
      // 图片上传之前
      beforeAvatarUpload(file) {
        console.log(file);
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isLt10M) {
          this.$message.error("上传头像图片大小不能超过 10M!");
        }
        return isLt10M;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .sync-picture {
    position: absolute;
    right: 20px;
  }
</style>
