<template>
  <!-- 临时保养 -->
  <!-- 新增|编辑对话框 -->
  <el-dialog
    v-loading="loading"
    element-loading-text="文件导入中"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :title="dialogTitle"
    :visible.sync="dialog"
    width="80%"
    :before-close="handleClose"
  >
    <!-- 头部表单 -->
    <el-row style="margin-top: 40px">
      <el-form
        ref="form"
        label-width="140px"
        label-position="left"
      >
        <el-row>
          <el-col :span="18">
            <el-form-item label="导入临时保养">
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
        </el-row>
        <el-row style="background: #f5f5f5; padding: 0.2rem">
          <!-- 表格区 -->
          <el-table
            :data="form[0].maintainWorkOrderColonies"
            style="width: 100%"
            border
            default-expand-all>
            <el-table-column
              align="center"
              type="index"
              label="项目"
              width="80"
            ></el-table-column>
            <el-table-column label="设备名称" prop="deviceNames"></el-table-column>
            <el-table-column label="内容" prop="maintainWorkOrderContents[0].content"></el-table-column>
            <el-table-column label="资产编号" prop="deviceAssetNo"></el-table-column>
            <el-table-column label="位置" prop="maintainWorkOrderContents[0].executionNode"></el-table-column>
            <el-table-column label="负责人" prop="receiverName"></el-table-column>
            <el-table-column label="保养人" prop="assisterNames"></el-table-column>
          </el-table>
          <el-row type="flex" justify="center">
            <i
              class="el-icon-circle-plus"
              style="font-size: 30px; color: #0077dc"
              @click="addTableRow(item.maintainPlanContents)"
            ></i>
          </el-row>
        </el-row>
        <el-col :span="7" :offset="17" style="margin-top: 20px">
          <el-form-item>
            <el-button type="primary" @click="saveData()">提交</el-button>
            <el-button @click="handleClose">取 消</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </el-dialog>
</template>
<script>
import axios from "axios";
import apiConfig from "@/lib/api/apiConfig";
import { parseTime } from "@/utils";
import { tpmsChoosefile } from "@/components";
import { cycleSelect } from "../../../lib/api/checkPlan";
import { importTemporary, temporary } from "../../../lib/api/upkeepManagePage";

export default {
  name: "EditModule",
  props: ["changeDialog", "dialogTitle", "dialog"],
  components: {
    tpmsChoosefile,
  },
  data() {
    return {
      loading: false,
      newAddDialog: this.dialog,
      cycleList: [], // 周期列表
      form: [],
      uploadImgUrl: apiConfig.uploadAccessory,
      uploadHeaders: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      User_info: JSON.parse(localStorage.getItem("user_info")),
    };
  },
  mounted() {
    this.initForm();
    this.getCycleList();
  },
  methods: {
    initForm() {
      this.form = [{
        no: "", //保养计划编号
        name: "", //保养名称
        workshopId: "", //车间ID
        workshopName: "", //车间名称
        areaName: "", //区域名称
        reason: "", //拒绝原因
        maintainWorkOrderColonies: [{
          deviceNames: "",
          deviceNo: null,
          deviceAssetNo: "",
          deviceId: null,
          route: null,
          workshopAreaId: null,
          receiverId: null,
          receiverName: "",
          assisters: [],
          assisterNames: [],
          maintainWorkOrderContents: [{
            executionNode: "",
            content: "",
            hour: null
          }]
        }],
      }]
    },
    /**
     * @description 关闭组件
     */
    handleClose() {
      this.initForm();
      this.$emit("changeDialog", false);
    },
    /** 获取周期列表 */
    getCycleList() {
      var workshopId = this.User_info.principal.workshopId;
      const data = {
        module: 4, //{1:'点检',2:'日常保养',3:'巡检',4:'保养'};
      };
      cycleSelect(data, workshopId + "/cycle/names").then((res) => {
        this.cycleList = res.data;
      });
    },
    /**
     * @description 导入单个文件
     */
    getFileData(files) {
      this.loading = true;
      let formData = new FormData();
      files.map((file) => formData.append("file", file));
      importTemporary(formData)
        .then((res) => {
          this.loading = false;
          let datas = res.data;
          this.form = datas;
          console.log(this.form);
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    /**
     * @description 保存工单
     */
    saveData() {
      temporary(this.form).then(() => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
        this.handleClose();

      })
      .catch((err) => {
        this.loading = false;
      })
    }
  },
};
</script>