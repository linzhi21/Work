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
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <el-button class="button-more" size="small" @click='download'>导出</el-button>
          <el-button
            class="button-more"
            type="primary"
            size="small"
            @click="addIsShow=true"
            style="margin-right:30px"
          >新增</el-button>
        </el-row>
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :data="tableLists"
          :columns="tableHeaderList"
          @inquireTableData="inquireTableData"
          :total='total'
          @getTableData='getTableData'
        >
          <template slot-scope="{row}">
            <span class="button" @click="see(row)">查看</span>
            <span class="button" @click="seeEquipment(row)">设备资料</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>

    <!-- 新增维修单 -->
    <el-dialog title="新增报修" :visible.sync="addIsShow" width="80%" center>
      <el-form
        :model="addData"
        ref="dialog_AddSparePart"
        :rules="rules_addData"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="维修单号" prop="no" required>
              <el-input v-model="addData.no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车间" prop="workshop">
              <el-select v-model="addData.workshop" placeholder="请选择车间">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="partNumber">
              <el-select v-model="addData.partNumber" placeholder="请选择设备编号">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="partName">
              <el-input v-model="addData.partName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报修区域" prop="repairArea">
              <el-input v-model="addData.repairArea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修地址" prop="repairAddress">
              <el-input v-model="addData.repairAddress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="委托人" prop="bailor" required>
              <el-input v-model="addData.bailor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工段" prop="workshopSection" required>
              <el-input v-model="addData.workshopSection"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="班次" prop="Shift" required>
              <el-input v-model="addData.Shift"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急程度" prop="emergencyLevel">
              <el-select v-model="addData.emergencyLevel" placeholder="请选择紧急程度">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="故障描述" prop="faultDescription">
            <el-input type="textarea" :rows="4" v-model="addData.faultDescription"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="故障时间">
              <el-date-picker v-model="addData.failureTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否停线修理" prop="stopLine">
              <el-radio-group v-model="addData.stopLine">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="故障种类" prop="faultType">
              <el-select v-model="addData.faultType" placeholder="请选择故障种类">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="故障照片" prop="faultPhotos">
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
          </el-form-item>
        </el-row>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="$refs.dialog_AddSparePart.resetFields(),addIsShow=false">取消</el-button>
        <el-button
          type="primary"
          @click="$refs.dialog_AddSparePart.validate(validate=>validate&&add())"
        >报修</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable } from "../../components";
import axios from 'axios';
import apiConfig from '../../lib/api/apiConfig';
import {
    maintenanceManage,
  } from "../../lib/api/business";
export default {
  data() {
    return {
      total:0,
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "维修单号", key: "no", value: "" },
        { label: "设备编号", key: "deviceNo", value: "" },
        { label: "设备名称", key: "deviceName", value: "" },
        {
          label: "状态",
          key: "status",
          value: "",
          type: "checkbox",
          checkList: [
            { label: "待接单", id: 1 },
            { label: "待维修", id: 2 },
            { label: "待验收", id: 4 },
            { label: "待补充", id: 8 },
            { label: "已退回", id: 16 },
            { label: "待确认", id: 32 },
            { label: "已完成", id: 64 }
          ]
        }
      ],
      tableLists: [],
      tableHeaderList: [
        // 渲染表格的表头
        { props: "no", label: "维修单号" },
        { props: "workshopName", label: "车间", width: 120 },
        { props: "deviceNo", label: "设备编号" },
        { props: "deviceName", label: "设备名称" },
        { props: "areaName", label: "报修区域" },
        { props: "address", label: "报修地址" },
        { props: "applicantName", label: "委托人" },
        { props: "workshopSectionName", label: "工段" },
        { props: "workshopShiftName", label: "班次" },
        { props: "emergencyDegreeName", label: "紧急程度" },
        { props: "description", label: "故障描述" },
        {
          props: "stopLine",
          label: "是否停线修理",
          translate: value => (value ? "是" : "否"),
          width: 120
        },
        { props: "assignmentOfPosts", label: "指派岗位" },
        { props: "breakdownTime", label: "报修时间", width: 120 }
      ],
      addIsShow: false,
      addData: {
        //新增报修模态框 数据
        no: "",
        workshopId: "",
        workshopSectionId: "",
        workshopShiftId: "",
        deviceId:'',
        deviceNo:'',
        deviceName:'',
        emergencyDegree:"",
        applicantId: "",
        stopLine:true,
        areaId: "",
        address: "",
        description: "",
        breakdownTime: "",
        breakdownType: "",
        breakdownPhotos: ""
      },
      rules_addData: {
        //新增报修验证规则
        no: [
          { required: true, message: "请输入维修单号", trigger: "blur" }
        ],
        workshopId:[
          { required: true, message: "请输入车间", trigger: "blur" }
        ],
        bailor: [{ required: true, message: "请输入委托人", trigger: "blur" }],
        workshopSection: [
          { required: true, message: "请输入工段", trigger: "blur" }
        ],
        Shift: [{ required: true, message: "请输入班次", trigger: "blur" }]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      options: [
        { value: "选项1", label: "小龙虾" },
        { value: "选项2", label: "黄金糕" }
      ]
    };
  },
  components: {
    tpmsHeader,
    tpmsTable
  },
  mounted() {
    this.getTableData()
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
      let pageData = this.$refs.tpmsTable.getData();
      maintenanceManage['getLists']({ ...data,
        ...pageData
      }).then(res => {
        console.log(res)
        this.tableLists = res.data.content
        this.total = res.data.totalElements;
      })
    },
    /** 导出 */
   download(){
       let url = `${apiConfig.systemUrl}/tpms/business/maintenance/export` //请求下载文件的地址
       let token = localStorage.getItem('access_token'); //获取token
       axios
         .get(url, {
           headers: {
             Authorization:'Bearer ' + token
           },
           responseType: "blob"
         })
         .then(res => {
           if (!res) return;
           let blob = new Blob([res.data], {
             type: "application/vnd.ms-excel;charset=utf-8"
           });
           let url = window.URL.createObjectURL(blob);
           let aLink = document.createElement("a");
           aLink.style.display = "none";
           aLink.href = url;
           aLink.setAttribute("download", "维修单.xls"); // 下载的文件
           document.body.appendChild(aLink);
           aLink.click();
           document.body.removeChild(aLink);
           window.URL.revokeObjectURL(url);
         })
         .catch(error => {
           this.$message.error(error);
         });
   },
    add() {
      console.log(this.addSparePartData);
    },
    resetFields() {
      this.$refs.dialog_AddSparePart.resetFields();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-top: 0.2rem;
}
.button {
  color: #2c93fd;
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
  > .el-row {
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
