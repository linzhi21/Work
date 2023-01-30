// 巡检
<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header
          ref="tpmsHeader"
          :formData="equipmentFormList"
          @inquireTableData="inquireTableData"
          label-width="95px"
          @onValueChanged="onValueChanged"
        />
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <el-button @click="releaseMore" class="button-more" size="small"
            >批量发布</el-button
          >
          <el-button @click="deleteMore" class="button-more" size="small"
            >批量删除</el-button
          >
          <el-button @click="exportPlans" class="button-more" size="small"
            >导出</el-button
          >
          <el-button
            class="button-more"
            type="primary"
            size="small"
            @click="add"
            >新增计划</el-button
          >
        </el-row>
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :column_index="true"
          :total="total"
          :data="equipmentTableData"
          :columns="equipmentTableList"
          @inquireTableData="inquireTableData"
          @getTableData="getTableData"
          @selection-change="handleSelectionChange"
        >
          <template slot="operation" slot-scope="scope">
            <span class="button cursor" @click="view(scope.row)">查看</span>
            <span
              class="button cursor"
              @click="approval(scope.row)"
              v-if="scope.row.buttons.includes('approval')"
              >审批</span
            >
            <span
              class="button cursor"
              @click="viewWorkOrder(scope.row)"
              v-if="
                scope.row.status == '已发布' || scope.row.status == '已取消'
              "
              >查看工单</span
            >
            <span
              class="button cursor"
              @click="edit(scope.row)"
              v-if="scope.row.buttons.includes('launch')"
              >编辑</span
            >
            <span
              class="button cursor"
              @click="del(scope.row)"
              v-if="scope.row.buttons.includes('delete')"
              >删除</span
            >
            <span
              class="button cursor"
              @click="release(scope.row)"
              v-if="scope.row.buttons.includes('release')"
              >发布</span
            >
            <span
              class="button cursor"
              @click="cancel(scope.row)"
              v-if="scope.row.buttons.includes('canceled')"
              >取消计划</span
            >
            <span
              class="button cursor"
              @click="newApproval(scope.row)"
              v-if="scope.row.buttons.includes('launch')"
              >重新发起审批</span
            >
            <span class="button cursor" @click="exportFile(scope.row)"
              >导出</span
            >
          </template>
        </tpms-table>
      </el-card>
    </el-row>

    <!-- 查看工单 -->
    <el-dialog
      width="90%"
      title="查看工单"
      :visible.sync="oneWorkOrderIsShow"
      center
      append-to-body
    >
      <tpms-table
        ref="oneWorkOrderTable"
        height="50vh"
        :data="oneWorkOrderData.data"
        :total="oneWorkOrderData.totalElements || 0"
        :columns="[
          { props: 'no', label: '工单编号' },
          { props: 'planNo', label: '巡检计划编号' },
          { props: 'planName', label: '巡检计划名称' },
          { props: 'createDate', label: '生成日期' },
          { props: 'status', label: '状态' },
          { props: 'receiverName', label: '接单人' },
        ]"
        @getTableData="viewWorkOrder"
      />
    </el-dialog>

    <!-- 新增|编辑对话框 -->
    <el-dialog
      v-loading="loading"
      element-loading-text="文件导入中"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :title="newAddDialogTitle"
      :visible.sync="newAddDialog"
      width="80%"
      :before-close="handleClose"
    >
      <!-- 头部表单 -->
      <!-- <el-row>
        <el-button
          class="new-add-button sync-picture"
          type="message"
          size="small"
          :disabled="syncPicture"
          @click="syncPictureFun"
        >同步图片库</el-button>
      </el-row>-->
      <el-row style="margin-top: 40px">
        <el-form
          :model="form"
          ref="form"
          label-width="140px"
          label-position="left"
          :rules="rules"
        >
          <el-row>
            <!-- <el-col :span="11">
              <el-form-item label="类型2" required="required">
                <el-radio-group v-model="form.type">
                  <el-radio label="1">巡检计划</el-radio>
                  <el-radio label="3">日常保养</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>-->
            <!-- <el-col :span="11">
              <el-form-item label="车间名称">
                <el-input v-model="form.workshopName" readonly></el-input>
              </el-form-item>
            </el-col> -->
            <!--  <el-col :span="11" :offset="2">
              <el-form-item label="巡检计划编号" required="required">
                <el-input v-model="form.no" readonly></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :span="11">
              <el-form-item label="巡检名称" required="required">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- 冲压车间的用户保养计划导入，单独处理下拉列表三个 -->
            <div v-if="isShow">
              <el-col :span="8">
                <el-form-item label="区域"   label-width="55px" prop="workshopareaId">
                  <el-select v-model="form.workshopareaId" @change="getWorkshopSectionList"  placeholder="请选择" style="width: 90%">
                    <el-option
                      v-for="item in quOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工段"  label-width="55px" prop="sectionId">
                  <el-select
                    v-model="form.sectionId"
                    placeholder="请选择"
                    style="width: 90%"
                  >
                    <el-option
                      v-for="item in gdOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审批流"  label-width="70px" prop="ttWorkflowId">
                  <el-select
                    v-model="form.ttWorkflowId"
                    placeholder="请选择"
                    style="margin: 0px 10px ;width: 90%"
                  >
                    <el-option
                      v-for="(item, index) in splOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="导入设备巡检计划">
                <div>
                  <tpms-choosefile
                    plain
                    text="选择文件"
                    isMutiple
                    @getFileData="getFileData($event)"
                  ></tpms-choosefile>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <!-- <el-button type="primary" size="small" @click="uploadFiles(index)">批量导入文件</el-button> -->
              <!-- <tpms-choosefile isMutiple :multiple='true' plain text='批量导入文件' @getFileData='getMutipleFileData($event,index)'></tpms-choosefile> -->
              <!-- <el-button type="primary" plain size="mini" @click="addPlanDevice">新增</el-button> -->
            </el-col>
          </el-row>
          <el-row
            v-for="(item, index) in form.planDevices"
            :key="index"
            style="background: #f5f5f5; padding: 0.2rem"
          >
            <el-col :span="11">
              <el-form-item label="版本" required="required">
                <el-input v-model="item.version"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="设备(生产线)名称" required="required">
                <!-- <el-input v-model="item.deviceName"></el-input> -->
                <!-- <el-select @change="getDeviceId($event,item)" v-model="item.deviceName" placeholder="请选择" style="width:100%">
                  <el-option v-for="(item,i) in deviceInfo" :key="i" :label="item.name" :value="item.name">
                  </el-option>
                </el-select>-->
                <el-input v-model="item.deviceNos"></el-input>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="11">
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
            </el-col>-->
            <el-col :span="11">
              <el-form-item label="工位(工段)" required="required">
                <el-input v-model="item.sectionOrStationName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="总工时">
                <el-input v-model="item.hour" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="编制人" required="required">
                <!-- <el-date-picker value-format='yyyy-MM-dd' v-model="item.deviceCreatorDate" type="date" placeholder="选择日期"
                style="width: 100%;"></el-date-picker>-->
                <el-input readonly v-model="item.creatorName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="编制日期" required="required">
                <el-input readonly v-model="item.createDate" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="图示">
                <!-- 20230103 图片拖拽排序 -->
                <!-- 使用element-ui自带样式 -->
                <ul class="el-upload-list el-upload-list--picture-card">
                    <draggable v-model="item.planPictures">
                        <li v-for="(img, index) in item.planPictures" :key="img.accessoryId" class="el-upload-list__item is-success animated">
                            <img :src="img.url" alt="" class="el-upload-list__item-thumbnail ">
                            <i class="el-icon-close"></i>
                            <span class="el-upload-list__item-actions">
                              <!-- 预览 -->
                              <span class="el-upload-list__item-preview" @click="handlePictureCardPreviewFileDetail(img)">
                                <i class="el-icon-zoom-in"></i>
                              </span>
                              <!-- 删除 -->
                              <span class="el-upload-list__item-delete" @click="handleRemoveFileDetail(index,item.planPictures)">
                                <i class="el-icon-delete"></i>
                              </span>
                            </span>
                        </li>
                    </draggable>
                </ul>
                <el-upload
                  class="avatar-uploader"
                  list-type="picture-card"
                  multiple
                  :action="uploadImgUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  accept=".jpg, .png, .jpeg"
                  :on-error="
                  (res, file) => handleAvatarError(res, file, item)
                  "
                  :on-success="
                    (res, file) => handleAvatarSuccess(res, file, item)
                  "
                  :on-remove="
                    (file, fileList) => handleRemove(file, fileList, item)
                  "
                  :before-upload="beforeAvatarUpload"
                >
                  <el-button size="small" type="file">点击上传图示</el-button>
                </el-upload>
                <!-- 预览弹出层 -->
                <el-dialog :visible.sync="dialogVisibleDetail" :append-to-body="true">
                    <img width="100%" :src="dialogImageDetailUrl" alt="">
                </el-dialog>
              </el-form-item>
            </el-col>
            <!-- 表格区 -->
            <el-table
              :data="item.planContents"
              style="width: 100%"
              border
              row-key="content"
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
              <el-table-column align="center" label="时间/部件" width="150">
                <template slot-scope="scope">
                  <el-input
                    v-show="scope.row.editShow"
                    v-model="scope.row.executionNode"
                  ></el-input>
                  <span
                    v-show="!scope.row.editShow"
                    :style="{
                      'text-decoration':
                        scope.row.deleted === true ? 'line-through' : '',
                    }"
                    >{{ scope.row.executionNode }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" label="内容" width="300">
                <template slot-scope="scope">
                  <el-input
                    v-show="scope.row.editShow"
                    v-model="scope.row.content"
                  ></el-input>
                  <span
                    v-show="!scope.row.editShow"
                    :style="{
                      'text-decoration':
                        scope.row.deleted === true ? 'line-through' : '',
                    }"
                    >{{ scope.row.content }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" label="工时(s)">
                <template slot-scope="scope">
                  <el-input
                    v-show="scope.row.editShow"
                    v-model="scope.row.hour"
                    @change="calcTime(item)"
                  ></el-input>
                  <span
                    v-show="!scope.row.editShow"
                    :style="{
                      'text-decoration':
                        scope.row.deleted === true ? 'line-through' : '',
                    }"
                    >{{ scope.row.hour }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" label="方法">
                <template slot-scope="scope">
                  <el-input
                    v-show="scope.row.editShow"
                    v-model="scope.row.method"
                  ></el-input>
                  <span
                    v-show="!scope.row.editShow"
                    :style="{
                      'text-decoration':
                        scope.row.deleted === true ? 'line-through' : '',
                    }"
                    >{{ scope.row.method }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" label="周期" width="110">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.cycleId"
                    style="width: 100%"
                    :disabled="!scope.row.editShow"
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
              <el-table-column align="center" label="顺序" width="110">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.sort"
                    style="width: 100%"
                    :disabled="!scope.row.editShow"
                  >
                    <el-option
                      v-for="itemSort in item.planContents.length"
                      :key="itemSort"
                      :label="itemSort"
                      :value="itemSort"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- <el-table-column align="center" prop="photoDisplay" label="图示">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.accessoryUrl"
                    style="width: 40px;height: 40px;"
                    :src="`${apiConfig.accessoryFile+scope.row.accessoryUrl}`"
                    class="avatar"
                  />
                </template>
              </el-table-column>-->
              <el-table-column
                align="center"
                width="300"
                label="操作"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    @click="scope.row.editShow = true"
                    :disabled="scope.row.deleted"
                    >编辑</el-button
                  >
                  <el-button
                    v-if="newAddDialogTitle === '编辑'"
                    size="small"
                    @click.native.prevent="
                      deleteRow(scope.row, item.planContents), calcTime(item)
                    "
                    :disabled="scope.row.deleted"
                    style="margin-right: 10px"
                    >删除</el-button
                  >
                  <el-button
                    v-if="newAddDialogTitle === '新增'"
                    size="small"
                    @click.native.prevent="
                      addDeleteRow(scope, item.planContents), calcTime(item)
                    "
                    style="margin-right: 10px"
                    >删除</el-button
                  >
                  <el-button size="small" @click="scope.row.editShow = false, calcTime(item)"
                    >保存</el-button
                  >
                  <!-- <div style="display: inline-block;" @click="uploadImg(index,scope.$index)">
                    <el-upload
                      class="avatar-uploader"
                      :action="uploadImgUrl"
                      :headers="uploadHeaders"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <el-button size="small" type="file">上传图示</el-button>
                    </el-upload>
                  </div>-->
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center">
              <i
                class="el-icon-circle-plus"
                style="font-size: 30px; color: #0077dc"
                @click="addTableRow(item.planContents)"
              ></i>
            </el-row>
          </el-row>
          <el-col :span="7" :offset="17" style="margin-top: 20px">
            <el-form-item>
              <el-button
                v-if="newAddDialogTitle === '新增'"
                type="primary"
                @click="submitForm()"
                >提交</el-button
              >
              <el-button
                v-if="newAddDialogTitle === '编辑'"
                type="primary"
                @click="changePlan()"
                >保存</el-button
              >
              <el-button @click="newAddDialog = false">取 消</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog :visible.sync="orderDetailIsShow" width="80%" title="查看">
      <el-row>
        <ShowPlanManage :orderDetail="orderDetail" />
      </el-row>
    </el-dialog>
    <!-- 提交审批 -->
    <el-dialog
      width="30%"
      title="审批"
      :visible.sync="approvalIsShow"
      center
      append-to-body
    >
      <el-form :model="form">
        <el-form-item label="审批理由" prop="reason">
          <el-input
            v-model="form.reason"
            placeholder="审批驳回必须填写理由"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="adopt()">审批通过</el-button>
        <el-button type="primary" @click="reject()">审批驳回</el-button>
      </div>
    </el-dialog>
    <!-- 批量导入文件 -->
    <el-dialog
      width="50%"
      title="批量导入文件"
      :visible.sync="uploadFileIsShow"
      center
      append-to-body
    >
      <div>
        <el-upload
          class="upload-demo"
          ref="upload"
          :on-change="handleChange"
          multiple
          action="#"
          :file-list="fileList"
          accept=".xls, .xlsx"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
          <div slot="tip" class="el-upload__tip">
            只能上传.xls/.xlsx文件，且不超过30M
          </div>
        </el-upload>
      </div>
    </el-dialog>

    <el-dialog
      width="50%"
      title="提示"
      :visible.sync="showRejectMoal"
      center
      append-to-body
    >
      <div>
        <el-form>
          <el-row>
            <el-col :span="24">
              <el-form-item label-width="100px" label="拒绝理由">
                <el-input v-model="form.reason" type="textarea" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="14">
              <el-form-item>
                <el-button @click="showRejectMoal = false">取消</el-button>
                <el-button type="primary" @click="rejectConfirm"
                  >确认</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import draggable from "vuedraggable";  // 引入插件
import { tpmsHeader, tpmsTable, tpmsChoosefile } from "../../components";
import { uploadAccessory } from "../../lib/api/accessory";
import apiConfig from "../../lib/api/apiConfig";
import { device } from "@/lib/api/device.js";
import {setHeadToken} from "../../utils/index"
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
  postPlan,
  worksectionIdManage,
} from "../../lib/api/checkPlan";
import { parseTime } from "@/utils";
import axios from "axios";
import {
  workflowManage, //巡检审批流
} from "../../lib/api/approvalManage";
import {
  factoryManage,
  workshopManage as workshopManageAll,
  workStationManage,
  workshopSectionManage as workshopSectionManageList,
  workshopAreaManage as WorkshopAreaManageList,
} from "../../lib/api/workshopSettingsManage";
import ShowPlanManage from "./comp/ShowPlanManage";
export default {
  data() {
    // 类型列表
    const typeList = [
      {
        id: "1",
        label: "巡检计划",
      },
      {
        id: "3",
        label: "日常保养",
      },
    ];
    // 获取头部搜索组下拉选择的list
    let getListFuncs = [
      workStationSelect, //工位
      workshopSectionSelect, //工段
      planStatusSelect, //状态
      factoryManage.getNames, //工厂
      workshopManageAll.getNames, //车间
    ];
    let [stationList, sectionList, statusList, factoryList, workshopList] =
      getListFuncs.map((getListFunc) => {
        let arr = [];
        getListFunc(null).then((res) => {
          arr.push(...res.data);
        });
        return arr;
      });
    return {
      dialogImageDetailUrl: "",
      dialogVisibleDetail:false,
      //校验表单数据，为空触发提示
      rules:{
        // name:[
        //   {required:true,message:"保养名称不能为空",trigger:"blur"}
        // ],
        workshopareaId:[
          {required:true,message:"区域不能为空",trigger:"change"}
        ],
        sectionId:[
          {required:true,message:"工段不能为空",trigger:"change"}
        ],
        ttWorkflowId:[
          {required:true,message:"审批不能为空",trigger:"change"}
        ]
      },
      isShow: false, //用于判断条件下拉列表显隐
      quOptions: [], //区域下拉列表
      gdOptions: [], //工段下拉列表
      splOptions: [], //审批流下拉列表
      //quOptions1: [], //区域查看下拉列表
      gdOptions1: [], //工段查看下拉列表
      splOptions1: [], //审批流查看下拉列表
      newAddDialogTitle: "",
      apiConfig,
      planDevicesIndex: 0,
      planContentsIndex: 0,
      showRejectMoal: false,
      User_info: JSON.parse(localStorage.getItem("user_info")),
      uploadHeaders: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      uploadImgUrl: apiConfig.uploadAccessory + "/128",
      cycleList: [], // 周期列表
      typeList: typeList, //巡检类型列表
      deviceList: [], //设备列表
      stationList: stationList, //工位列表
      sectionList: sectionList, //工段列表
      statusList: statusList, //状态列表
      //  渲染头部功能区的列表
      equipmentFormList: [
        { label: "名称", props: "name", value: "" },
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
        // { label: "工位", props: "workStationId", type: "radio", checkList: stationList },
        // { label: "工段", props: "workshopSectionId", type: "radio", checkList: sectionList },
        { label: "工位/工段", props: "positionName", value: "" },
        { label: "设备名称", props: "deviceName", value: "" },
        { label: "设备(生产线)", props: "deviceNos", value: "" },
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
      equipmentTableList: [
        { type: "selection" },
        {
          props: "no",
          label: "巡检计划编号",
          width: "160px",
        },
        {
          props: "type",
          label: "类型",
        },
        {
          props: "name",
          label: "巡检名称",
        },
        {
          props: "hour",
          label: "总工时",
        },
        {
          props: "creatorName",
          label: "制定人",
        },
        {
          props: "lastChangeDate",
          label: "最新编辑时间",
          width: "200px",
        },
        {
          props: "status",
          label: "状态",
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
        type: "3", //巡检计划
        no: "", //巡检计划编号
        name: "", //巡检名称
        workshopId: "", //车间ID
        workshopName: "", //车间名称
        areaName: "", //区域名称
        //zyl 20221206
        workshopareaId: "", //区域ID
        sectionId: "", //工段ID
        ttWorkflowId: "", //审批流ID
        reason: "", //拒绝原因
        planDevices: [
          {
            id: "",
            type: 1,
            version: "", //版本
            stationId: "", //工位
            sectionId: "", //工段
            hour: "", //工时
            creatorName: JSON.parse(localStorage.getItem("user_info")).principal
              .name, //编制人
            createDate: parseTime(new Date()), //编制日期
            deviceId: "1", //设备(生产线)名称ID
            creatorName: "",
            createDate: "",
            sectionOrStationName: "",
            planContents: [
              {
                id: "",
                type: 1,
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
              },
            ],
          },
        ],
      },
      planDevicesIndex: "",
      orderDetailIsShow: false, //查看巡检计划详情弹窗
      orderDetail: {}, //查看巡检计划详情数据
      approvalIsShow: false,
      importFileData: {
        workshopName: "PFMA",
      },
      uploadFileIsShow: false,
      importURLFileUrl: apiConfig.importURLPlanFile,
      fileList: [],
      deviceList: [],
      deviceInfo: [], //设备下拉框信息
      planId: "",
      loading: false,
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile,
    ShowPlanManage,
    draggable,
  },
  created() {},
  mounted() {
    this.getTableData();
    this.getCycleList();
    this.getDeviceList();
    //zyl 20221206
    this.getworkflowManageList();
    this.getWorkshopAreaManageList();
    this.getWorkshopSectionList();
    this.gdOptions1= this.gdOptions; //工段查看
    this.splOptions1=this.splOptions; //审批流查看
  },
  methods: {
    // zyl20230103 放大预览图片
    handlePictureCardPreviewFileDetail(file) {
        this.dialogImageDetailUrl = file.url;
        this.dialogVisibleDetail = true;
    },
    // zyl20230103 删除图片
    handleRemoveFileDetail(index,planPictures) {
      planPictures.splice(index, 1);
    },
    /** 导出单个计划 */
    exportFile({ id }) {
      let url = `${apiConfig.exportExcel}/${id}/download`; //请求下载文件的地址
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

          let fileName = "plan.zip";
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
    /** 导出符合所有搜索条件的计划 */
    exportPlans() {
      const searchData = this.$refs.tpmsHeader.getData();
      let url = apiConfig.exportPlans; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          params: { ...searchData, type: "3" },
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;

          let fileName = "plans.zip";
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
    handleSelectionChange(e) {
      let arr = [];
      for (var i = 0; i < e.length; i++) {
        arr.push(e[i].id);
      }
      this.planId = arr.join(",");
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
      let option = {};
      device(option).then((res) => {
        // console.log(res)
        this.deviceInfo = res.data.content;
      });
    },
    /**
     * @description 导入单个文件
     * @param {Object} e 文件对象
     * @param {Object} index 导入的form.planDevices数组下标
     */
    getFileData(files) {
      this.loading = true;
      let formData = new FormData();
      let workshopName = localStorage.getItem("workshopName");
      files.map((file) => formData.append("file", file));
      formData.append("module", 3); //{1:'点检',2:'日常保养',3:'巡检',4:'保养'};
      importURLPlanFile(formData)
        .then((res) => {
          // console.log(res,item)
          let datas = res.data;
          datas.forEach((data) => {
            data.creatorName = JSON.parse(
              localStorage.getItem("user_info")
            ).principal.name; //编制人
            data.createDate = parseTime(new Date()); //编制日期
            data.planContents.forEach((item) => (item.editShow = false));
            delete data.planPictures;
          });
          // Object.assign(data,{
          //   creatorName: JSON.parse(localStorage.getItem('user_info')).principal.name, //编制人
          //   createDate: parseTime(new Date()), //编制日期
          // })
          // data.planContents = data.planContents.map(item => {
          //   return Object.assign(item, {
          //     editShow: false
          //   })
          // })
          this.form.planDevices = datas;
          this.loading = false;
          // console.log(this.form)
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getMutipleFileData(files, index) {
      this.loading = true;
      let formData = new FormData();
      files.forEach(function (file) {
        formData.append("file", file, file.name);
      });

      // formData.append('file',file);
      formData.append("workshopName", "PFMB");
      importURLPlanFile(formData).then((res) => {
        // console.log(res)
        this.loading = false;
        let data = res.data;
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].planContents.length; j++) {
            data[i].planContents[j].editShow = false;
          }
        }
        this.form.planDevices.splice(index, 1);
        this.form.planDevices.splice(index, 1, ...data);
        // let len=index+res.data.length
        // for(var j=index;j<len;j++){
        //   this.form.planDevices[j]=res.data[len-j-index];
        //   this.$set(this.form.planDevices,j,res.data[len-j-index])
        // }
        // this.$forceUpdate()
        // this.$set(this.form.planDevices,index,res.data[0])
      });
    },
    /** 获取周期列表 */
    getCycleList() {
      var workshopId = this.User_info.principal.workshopId;
      const data = {
        module: 3, //{1:'点检',2:'日常保养',3:'巡检',4:'保养'};
      };
      cycleSelect(data, workshopId + "/cycle/names").then((res) => {
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
      planList({ ...data, ...pageData, type: "3" }).then((res) => {
        // console.log({ ...data, ...pageData})
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
      });
    },
    /** 头部value变更回调 */
    onValueChanged({ props, value }) {
      if (props === "factoryId") {
        // 选择工厂，重置车间
        workshopManageAll.getNames({ factoryId: value }).then((res) => {
          this.equipmentFormList.forEach((item) => {
            if (item.props === "workshopId") {
              item.checkList = res.data;
              item.value = "";
            }
          });
        });
      }
    },
    /** 查看巡检计划详情  */
    view(row) {
      queryPlan(null, row.id).then((res) => {
        res.data.planDevices.map((item) => {
          item.planPictures &&
            item.planPictures.forEach((ever) => {
              ever.name = ever.accessoryId;
              ever.url = this.apiConfig.accessoryFile + ever.accessoryUrl;
            });
        });
        this.orderDetail = res.data;
        //zyl 20221206
        //渲染区域列表;
        worksectionIdManage(null,this.orderDetail.sectionId).then((r) => {
          //查看时,为区域下拉列表赋值回显;
          this.$set(this.orderDetail, 'workshopareaId',r.data.workshopAreaId);
        });
        this.orderDetail.quOptions = this.quOptions;
        this.orderDetail.gdOptions = this.gdOptions1;
        this.orderDetail.splOptions = this.splOptions;
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
      this.newAddDialogTitle = "新增";
      //zyl 20221206
      JSON.parse(localStorage.getItem("user_info")).principal.workshopId === 4
        ? (this.isShow = true)
        : (this.isShow = false);
      this.form = {
        type: "1", //巡检计划
        no: "", //巡检计划编号
        name: "", //巡检名称
        workshopId: "", //车间ID
        workshopName: "", //车间名称
        areaName: "", //区域名称
        sectionId: "", //工段ID
        ttWorkflowId: "", //审批流ID
        reason: "", //审核拒绝原因
        planDevices: [
          {
            id: "",
            version: "", //版本
            stationId: "", //工位
            sectionId: "", //工段
            hour: "", //工时
            creatorName: JSON.parse(localStorage.getItem("user_info")).principal
              .name, //编制人
            createDate: parseTime(new Date()), //编制日期
            deviceId: "", //设备(生产线)名称ID
            planContents: [
              {
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
                sort: 1,
              },
            ],
          },
        ],
      };
      this.getWorkshopAreaManage();
      this.getWorkshopAreaManageList();//查询区域下拉框
      this.getworkflowManageList(); //查询审批流id下拉框
    },
    // 同步图示库
    syncPictureFun() {
      updatePlanPicture(this.form).then((res) => {
        this.form = res.data;
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
    handleRemove(file, fileList, item) {
      if (file.id) {
        item.planPictures = item.planPictures.filter((ever) => {
          return ever.accessoryId !== file.response.id;
        });
      } else {
        item.planPictures = item.planPictures.filter((ever) => {
          return ever.name !== file.name;
        });
      }
    },
    //zyl 20221206
    /**获取区域下拉列表 */
    getWorkshopAreaManageList() {
      WorkshopAreaManageList.getNames(this.User_info.principal.workshopId).then(
        (res) => {
          this.quOptions = res.data;
        }
      );
    },
    /**获取工段下拉列表 */
    getWorkshopSectionList(areaID) {
      this.form.sectionId='';
      workshopSectionManageList.getNames(
        {"workshopAreaId": areaID}
      ).then((res) => {
        this.gdOptions = res.data;
        if(areaID == null){
          this.gdOptions1 = res.data;
        }
      });
    },

    /**获取审批流下拉列表 */
    getworkflowManageList() {
      workflowManage
        .getLists(
          {"application": "巡检工单审批","enable":"true"}
        )
        .then((res) => {
          this.splOptions = res.data.content;
        });
    },
    /**  获取区域名称 */
    getWorkshopAreaManage() {
      workshopAreaManage(null, this.User_info.principal.workshopAreaId).then(
        (res) => {
          // console.log(res);
          this.form.areaName = res.data.name;
          var areaNo = res.data.no;
          this.getWorkshopManage(areaNo);
        }
      );
    },
    /**  获取车间名称 */
    getWorkshopManage(areaNo) {
      workshopManage(null, this.User_info.principal.workshopId).then((res) => {
        console.log("workshopName", res.data.name);
        this.form.workshopName = res.data.name;
        this.importFileData.workshopName = res.data.name;
        this.form.workshopId = res.data.id;
        var workshopNo = res.data.no;
        // this.getPlanNewNo(workshopNo, areaNo);
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
      this.newAddDialogTitle = "编辑";
      //zyl 20221206
      JSON.parse(localStorage.getItem("user_info")).principal.workshopId === 4
        ? (this.isShow = true)
        : (this.isShow = false);
      this.getworkflowManageList();
      this.getWorkshopAreaManageList();
      this.getWorkshopSectionList();

      queryPlan(null, row.id).then((res) => {
        console.log(res);
        let data = res.data;
        for (var j = 0; j < data.planDevices.length; j++) {
          for (var i = 0; i < data.planDevices[j].planContents.length; i++) {
            data.planDevices[j].planContents[i].editShow = false;
          }
        }
        res.data.planDevices.map((item) => {
          item.planPictures &&
            item.planPictures.forEach((ever) => {
              ever.name = ever.accessoryId;
              ever.url = this.apiConfig.accessoryFile + ever.accessoryUrl;
            });
        });
        //zyl 20221206 编辑能不能获取到区域/工段id？需要验证
        //查询岗位的所属区域
        worksectionIdManage(null,data.sectionId).then((r) => {
          this.form.workshopareaId = r.data.workshopAreaId;
        });
        this.form.status = "";
        this.form = data;
        //为区域下拉列表赋值;
        this.$set(this.form, 'workshopareaId');
      });
      this.newAddDialog = true;
    },
    /** 提交巡检计划 */
    submitForm() {
      delete this.form.status;
      var form = this.form;
      form.type = 3;
      var newType = false;
      if (!form.name) {
        this.$message.warning("缺少必填项!");
        return false;
      }
      const validateDevices = form.planDevices.filter((item) => {
        if (!item.version) return true;
        if (!item.deviceNos) return true;
        if (!item.sectionOrStationName) return true;
        // if (!item.hour) return true;
        // if (!item.qrPicId) return true;
        // if (!item.repairTimes) return true;
        const validateee = item.planContents.filter((itemm) => {
          if (!itemm.executionNode) return true;
          if (!itemm.content) return true;
          if (!itemm.hour) return true;
          if (!itemm.cycleId) return true;
          if (!itemm.method) return true;
          return false;
        });
        if (validateee.length) {
          this.$message.warning("缺少必填项!");
          return true;
        }
        return false;
      });

      if (validateDevices.length) {
        this.$message.warning("缺少必填项!");
        return;
      }
      const validate = form.planDevices.some(({ planContents }) => {
        const arr = planContents.map(({ sort }) => sort);
        return new Set(arr).size !== arr.length;
      });
      if (validate) {
        this.$message.warning("工作内容顺序重复，请修改");
        return;
      }
      console.log(JSON.stringify(form));
      this.$refs['form'].validate((valid) => {
        if (valid) {
        addPlan(form).then((res) => {
          // console.log(res);
          this.$message.success("操作成功");
          this.newAddDialog = false;
          this.getTableData();
        });
          console.log(JSON.stringify(form));
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    /** 修改计划 */
    changePlan() {
      const validate = this.form.planDevices.some(({ planContents }) => {
        const arr = planContents.map(({ sort }) => sort);
        return new Set(arr).size !== arr.length;
      });
      if (validate) {
        this.$message.warning("工作内容顺序重复，请修改");
        return;
      }
      const validateDevices = this.form.planDevices.filter(item => {
        const validateee = item.planContents.filter(itemm => {
          if(!itemm.executionNode) return true;
          if(!itemm.content) return true;
          if(!itemm.hour) return true;
          if(!itemm.cycleId) return true;
          if(!itemm.method) return true;
          return false;
        });
        if (validateee.length) {
          this.$message.warning("缺少必填项!");
          return true;
        }
        return false
      })
      if (validateDevices.length) {
        return;
      }
      console.log(JSON.stringify(this.form));
      delete this.form.status;
      patchPlan(this.form, this.form.id).then((res) => {
        this.newAddDialog = false;
        this.getTableData();
      });
    },

    /** 表格添加一行 */
    addTableRow(table) {
      console.log(table);
      table.push({
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
        sort: table.length + 1,
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
        creatorName: JSON.parse(localStorage.getItem("user_info")).principal
          .name, //编制人
        createDate: parseTime(new Date()), //编制日期
        planContents: [
          {
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
            sort: 1,
            deleted: false
          },
        ],
      });
    },
    /**
     * 点击新增的时候删除数据
     */
    addDeleteRow(row, rows) {
      this.form.planDevices.map((device) => {
        const planContents = device.planContents;
        console.log(planContents[row.$index])
        planContents.splice(row.$index,1)
      })
    },
    //删除planContents里的一条数据
    deleteRow(row, rows) {
      this.form.planDevices.map((device) => {
        const planContents = device.planContents;
        planContents.map((item, i) => {
          if (row.id === item.id) {
            item.deleted = true;
          }
        });
      });
    },
    /** 计算工时 */
    calcTime(item) {
      console.log(item);
      const { planContents } = item;
      window.planContents = planContents;
      const sum = planContents
        .filter((row => row.deleted == false))
        .map((row) => row.hour)
        .reduce((a, b) => {
          const pre = parseInt(a) || 0;
          const next = parseInt(b) || 0;
          return pre + next;
        },0);
      item.hour = sum;
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
        this.approvalIsShow = false;
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
          message: "已同意审批!",
        });
        this.approvalIsShow = false;
      });
    },
    // 审核驳回确认
    rejectConfirm() {
      console.log(this.form);
      patchPlan(this.form, this.form.id).then((res) => {
        // console.log(res);
        this.showRejectMoal = false;
        this.approvalIsShow = false;
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
      this.oneWorkOrderIsShow = true;
      this.$nextTick(() => {
        let id = "";
        if (row && row.id) {
          id = row.id;
        } else {
          id = this.oneWorkOrderData.planId;
        }
        const pageData = this.$refs.oneWorkOrderTable.getData();
        oneWorkorders(pageData, id + "/workorders").then((res) => {
          this.oneWorkOrderData = {
            data: res.data.content,
            planId: id,
            totalElements: res.data.totalElements,
          };
        });
      });
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

      this.planDevicesIndex = index;
      this.planContentsIndex = num;
    },
    //图片上传失败
    handleAvatarError(){
      this.$message.error("上传失败");
    },
    // 图片上传成功
    handleAvatarSuccess(res, file, item) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(res,file)
      // this.form.planDevices[this.planDevicesIndex].planContents[this.planContentsIndex].=`${apiConfig.accessoryFile}/${res.path}${res.name}`
      // this.form.planDevices[this.planDevicesIndex].planContents[
      //   this.planContentsIndex
      // ].accessoryId = res.id;
      // this.form.planDevices[this.planDevicesIndex].planContents[
      //   this.planContentsIndex
      // ].accessoryUrl = `/${res.path + res.name}`;
      const img = {
        accessoryId: res.id,
        accessoryUrl: `/${res.path + res.name}`,
        // 这是element组件回显用的
        name: res.id,
        url: `${this.apiConfig.accessoryFile}/${res.path + res.name}`,
      };
      //item.planPictures = item.planPictures || [];
      if(!item.planPictures){
        this.$set(item, 'planPictures',[]);
      }
      item.planPictures.push(img);
      console.log(item);
      this.$message.success("上传完成");
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      setHeadToken(this.uploadHeaders);
      // console.log(file);
      const isLt10M = file.size / 1024 / 1024 < 10;

      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "png";
      const extension2 = testmsg === "jpeg";
      const extension3 = testmsg === "jpg";

      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: "上传文件只能是 png、jpeg、jpg格式的文件",
          type: "warning",
        });
      }

      if (!isLt10M) {
        this.$message.error("上传头像图片大小不能超过 10M!");
      }
      return (extension || extension2 || extension3) && isLt10M;
    },
    /**
     * 批量发布
     */
    releaseMore() {
      const selected = this.$refs.tpmsTable.getSelectionList();
      const ids = selected.map((item) => item.id);

      if (ids.length === 0) {
        this.$message.warning("请先选择需要发布的计划");
        return;
      }

      this.$confirm("批量发布点检计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          postPlan(ids, "released")
            .then((res) => {
              this.$message({
                type: "success",
                message: "发布成功!",
              });
              this.inquireTableData();
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "发布失败",
              });
            });
          this.getTableData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布",
          });
        });
    },
    /**
     * 批量删除
     */
    deleteMore() {
      const selected = this.$refs.tpmsTable.getSelectionList();
      const ids = selected.map((item) => item.id);

      if (ids.length === 0) {
        this.$message.warning("请先选择需要删除的计划");
        return;
      }
      this.$confirm("批量删除点检计划, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delPlan(ids)
            .then((res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败",
              });
            });
          this.getTableData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.sync-picture {
  position: absolute;
  right: 20px;
}
.buttom-group {
  padding: 20px 30px 20px 0;
  div {
    margin-left: 10px;
  }
}
</style>
