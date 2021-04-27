// 备件管理
<template>
  <div>
    <!-- 头部功能区 -->
    <tpmsHeader
      ref="tpmsHeader"
      :formData="sparePartFormList"
      @inquireTableData="inquireTableData"
      label-width="85px"
    />
    <buttomGroup
      ref="buttomGroup"
      @setSpareParts="sparePartsSettingIsShow=true,getCommonSpareData()"
      @batchDamageRegister="clickBatchDamageRegister"
      @syncSpareParts="syncSpareParts"
      @exportSpare="exportSpare"
    />
    <tpmsTable
      class="tpms-table"
      ref="tpmsTable"
      selection
      :data="sparePartTableData"
      :total="total"
      :columns="sparePartTableList"
      :row-class-name="({row})=>row.common?'success-row':''"
      @inquireTableData="inquireTableData"
      @getTableData="getTableData"
    >
      <template slot="operation" slot-scope="{row}">
        <span class="button cursor" @click="showSparePartDialog(row)">详情</span>
        <!-- <span class="button cursor" @click="showBomDialog(row)">查看BOM</span> -->
        <span
          v-if="row.status==1||row.status==2"
          class="button cursor"
          @click="clickDamageRegister(row)"
        >损坏登记</span>
      </template>
    </tpmsTable>

    <!-- 常用备件频率设置 -->
    <el-dialog title="常用备件频率设置" :visible.sync="sparePartsSettingIsShow" width="420px">
      <el-form
        ref="sparePartsSetting"
        label-width="60px"
        label-position="left"
        :model="sparePartsSetting"
      >
        <el-form-item
          label="次数"
          prop="key"
          :rules="[
            { required: true, message: '请输入次数', trigger: 'blur' },
            { type: 'number', message: '请输入数字', trigger: 'blur'}
          ]"
        >
          <el-input v-model.number="sparePartsSetting.key" placeholder="期限内，备件使用频率>=该值时，为常用备件" />
        </el-form-item>
        <el-form-item
          label="周期"
          prop="value"
          :rules="{
            required: true, message: '请选择周期', trigger: 'blur'
          }"
        >
          <el-select v-model="sparePartsSetting.value">
            <el-option label="年" value="年" />
            <el-option label="月" value="月" />
            <el-option label="周" value="周" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="$refs.sparePartsSetting.resetFields(),sparePartsSettingIsShow=false">取消</el-button>
        <el-button
          type="primary"
          @click="$refs.sparePartsSetting.validate(validate=>validate&&changeCommonSpareData())"
        >保存</el-button>
      </el-row>
    </el-dialog>

    <!-- 单个备件损坏登记 -->
    <el-dialog title="备件损坏登记" :visible.sync="damageRegisterIsShow" width="45%">
      <el-form
        class="spare-part-dialog-form"
        ref="damageRegister"
        label-width="100px"
        label-position="left"
        :model="damageRegisterData"
      >
        <el-form-item label="备件名称" prop="name">
          <el-input v-model="damageRegisterData.name" disabled />
        </el-form-item>
        <el-form-item label="更换日期" prop="changeDate">
          <el-input v-model="damageRegisterData.changeDate" disabled />
        </el-form-item>
        <el-form-item label="型号规格" prop="specification">
          <el-input v-model="damageRegisterData.specification" disabled />
        </el-form-item>
        <el-form-item label="原值" prop="price">
          <el-input v-model="damageRegisterData.price" disabled />
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input v-model="damageRegisterData.num" disabled />
        </el-form-item>
        <el-form-item
          label="处理方式"
          prop="handleWay"
          :rules="{
            required: true, message: '请选择处理方式', trigger: 'blur'
          }"
        >
          <el-select
            v-model="damageRegisterData.handleWay"
            placeholder="请选择"
            @change="(value)=>{
              value=='1'&&(damageRegisterData.repairType=null,damageRegisterData.scrapType=null);
              value=='2'&&(damageRegisterData.scrapType=null);
              value=='4'&&(damageRegisterData.repairType=null);
            }"
          >
            <el-option
              v-for="item in handleWaySelect"
              :key="item.value"
              :disabled="item.disabled&&item.disabled(damageRegisterData.price)"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="修复方式"
          prop="repairType"
          :rules="{
            required: damageRegisterData.handleWay=='4', message: '请选择处理方式', trigger: 'blur'
          }"
        >
          <el-select
            v-model="damageRegisterData.repairType"
            :disabled="damageRegisterData.handleWay!='4'"
            :placeholder="damageRegisterData.handleWay!='4'?'无':'请选择'"
          >
            <el-option
              v-for="item in repairTypeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="报废方式"
          prop="scrapType"
          :rules="{
            required: damageRegisterData.handleWay=='2', message: '请输入次数', trigger: 'blur'
          }"
        >
          <el-select
            v-model="damageRegisterData.scrapType"
            :disabled="damageRegisterData.handleWay!='2'"
            :placeholder="damageRegisterData.handleWay!='2'?'无':'请选择'"
          >
            <el-option
              v-for="item in scrapTypeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="鉴定人" prop="appraiserName">
          <el-input v-model="damageRegisterData.appraiserName" disabled />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="$refs.damageRegister.resetFields(),damageRegisterIsShow=false">取消</el-button>
        <el-button
          type="primary"
          @click="$refs.damageRegister.validate(validate=>validate&&before_damageRegister())"
        >保存</el-button>
      </el-row>
    </el-dialog>

    <!-- 批量损坏登记 -->
    <el-dialog title="备件批量损坏登记" :visible.sync="batchDamageRegisterIsShow" width="900px">
      <el-form
        :model="spareBreakDownForms[0]"
        ref="spareBreakDownForms"
        inline
        label-position="left"
        size="small"
      >
        <el-row v-for="(formObj, index) in spareBreakDownForms" :key="index">
          <el-col :span="6">
            <el-form-item label="鉴定人姓名">
              <el-autocomplete
                v-model="formObj.appraiserName"
                :fetch-suggestions="changeConsumerName"
                placeholder="请选择鉴定人姓名"
                @select="selectForm($event, formObj, 'consumer')"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备件">
              <el-autocomplete
                v-model="formObj.spare"
                :fetch-suggestions="changeSpare"
                placeholder="请输入SVW编号"
                @select="selectForm($event, formObj, 'spare')"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量">
              <el-input v-model="formObj.num"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6"></el-col>

          <el-col :span="6">
            <el-form-item label="处理方式">
              <!-- <el-autocomplete
                v-model="formObj.handleWay"
                :fetch-suggestions="changeConsumerName"
                placeholder="请输入处理方式"
                @select="selectForm($event, formObj, 'consumer')"
              ></el-autocomplete>-->
              <el-select v-model="formObj.handleWay" placeholder="请输入处理方式">
                <el-option label="工业垃圾" value="1"></el-option>
                <el-option label="报废备件" value="2"></el-option>
                <el-option label="修复备件" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="修复方式">
              <el-select v-model="formObj.repairType" placeholder="请输入修复方式">
                <el-option label="委内维修" value="1"></el-option>
                <el-option label="委外维修【框架内】" value="2"></el-option>
                <el-option label="委外维修【框架外】" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报废方式">
              <el-select v-model="formObj.scrapType" placeholder="请输入报废方式">
                <el-option label="金属报废" value="1"></el-option>
                <el-option label="非金属报废" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="warning" @click.prevent="removeDomain(formObj)" size="small">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row type="flex" justify="center" style="margin-top:40px;">
        <el-button @click="batchDamageRegisterIsShow=false">取消</el-button>
        <el-button type="primary" @click="beforeBatchDamageRegister">保存</el-button>
      </el-row>
    </el-dialog>

    <!-- 备件详情对话框 -->
    <el-dialog title="备件详情" :visible.sync="sparePartDialog" width="60%">
      <el-row>
        <el-form :model="sparePartDialogForm" label-position="left" label-width="140px">
          <el-col
            :span="11"
            :offset="1"
            v-for="(item) in sparePartDialogFormList"
            :key="item.label"
          >
            <el-form-item v-bind="item">
              <el-select
                style="width:100%;background:white"
                v-if="item.type==='radio'"
                v-model="sparePartDialogForm[item.props]"
                :placeholder="item.placeholder||''"
                readonly
                disabled
              >
                <el-option
                  v-for="(item,i) in item.checkList"
                  :key="i"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
              <el-input
                v-else
                readonly
                v-model="sparePartDialogForm[item.props]"
                :title="sparePartDialogForm[item.props]"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row v-if="sapDataList.length > 0">
        <el-table :data="sapDataList">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="erfmg" label="库存" align="center"></el-table-column>
          <el-table-column prop="lgort" label="库存点" align="center"></el-table-column>
        </el-table>
      </el-row>
      <el-row v-else>
        <el-alert title="暂无库存" type="info" show-icon></el-alert>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="sparePartDialog = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import apiConfig from "../../lib/api/apiConfig";
import {
  querySpare as getTableData,
  getSpare,
  getRepairLimitList,
  breakDownRegister,
  getCommonSpare,
  changeCommonSpare,
  breakDownRegisterBatch,
  bomSpare,
  spareExport,
  spareConsuming,
  sap
} from "../../lib/api/spart";
import { deepClone } from "../../utils";
import { sysConfigManage } from "../../lib/api/workshopSettingsManage";
import { getUserDropList } from "../../lib/api/userManage";
import { tpmsHeader, tpmsTable } from "../../components";
import { SparePartContent as buttomGroup } from "./components/buttomGroups";
import {
  sparePartFormList,
  sparePartTableList,
  sparePartDialogFormList,
  handleWaySelect,
  repairTypeSelect,
  scrapTypeSelect
} from "../../public/model/spare";
export default {
  data() {
    // 备件状态列表
    const sparePartStatus = [];
    let statusValue = {};
    sysConfigManage.getLists({ functionalCode: 5 }).then(res => {
      const { content } = res.data;
      content.forEach(item => {
        item.label = item.value;
        item.id = item.key;
        statusValue[item.key] = item.value;
      });
      sparePartStatus.push(...content);
    });
    return {
      spareBomObject: {},
      sparePartFormList: sparePartFormList,
      sparePartTableData: [], // 表格的数据
      total: 0, //表格数据量
      sparePartTableList: sparePartTableList,
      sparePartDialog: false, // 控制备件详情对话框的打开与关闭
      sparePartDialogForm: {}, // 控制备件详情对话框中的form表单
      sparePartDialogFormList: sparePartDialogFormList,
      repairLimitList: [], //返修上限列表
      handleWaySelect: handleWaySelect,
      repairTypeSelect: repairTypeSelect,
      scrapTypeSelect: scrapTypeSelect,
      sparePartsSettingIsShow: false, //常用备件设置模态框
      sparePartsSetting: {
        key: "",
        value: ""
      },
      batchDamageRegisterIsShow: false, //备件批量损坏登记模态框
      damageRegisterIsShow: false, //单个备件损坏登记模态框
      damageRegisterData: {},
      spareBreakDownForms: [
        {
          appraiserName: "",
          comment: null,
          handleWay: null,
          num: null,
          repairType: null,
          scrapType: null,
          spare: []
        }
      ], // 备件批量损坏登记数据
      options: {
        consumerNameOptions: [{ label: "", value: "" }],
        spareOptions: [{ label: "", value: "" }]
      },
      sapDataList: []
    };
  },
  components: {
    tpmsHeader,
    buttomGroup,
    tpmsTable
  },
  created() {
    this.getCommonSpareData();
    getRepairLimitList().then(res => {
      this.repairLimitList = res.data.content;
    });
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    /** 点击查询按钮 */
    inquireTableData() {
      this.$refs.tpmsTable.resetCurrentPage();
      this.getTableData();
    },
    /** 加载页面表格数据 */
    getTableData() {
      let data = this.$refs.tpmsHeader.getData();
      let pageData = this.$refs.tpmsTable.getData();
      getTableData({ ...data, ...pageData }).then(res => {
        this.sparePartTableData = res.data.content;
        this.total = res.data.totalElements;
      });
    },
    /**
     * 表格数据超出省略号处理
     * @param {String[]} val
     */
    pipe(val) {
      if (val.length) {
        return val
          .join(";")
          .slice(0, 5)
          .padEnd(8, ".");
      } else {
        return "无";
      }
    },
    /**
     * 获取常用备件库设置
     */
    getCommonSpareData(val) {
      getCommonSpare(null, "").then(res => {
        res.data.key = parseInt(res.data.key);
        this.sparePartsSetting = res.data;
      });
    },
    /**
     * 常用备件频率设置
     */
    changeCommonSpareData() {
      this.sparePartsSettingIsShow = false;
      this.sparePartsSetting.key = this.sparePartsSetting.key.toString();
      changeCommonSpare(this.sparePartsSetting)
        .then(res => {
          console.log(res);
          this.getCommonSpareData();
          this.$message.success("设置成功");
        })
        .catch(fail => {
          this.$message({
            showClose: true,
            type: "error",
            message: "常用备件频率设置失败",
            duration: 5 * 1000
          });
        });
    },
    /** 点击批量损坏登记按钮 */
    clickBatchDamageRegister() {
      let spareBreakDownForms = this.$refs.tpmsTable.getSelectionList();
      // if (spareBreakDownForms.length === 0) {
      //   this.$message.warning("请选择备件");
      //   return;
      // }
      this.batchDamageRegisterIsShow = true;
      spareBreakDownForms = deepClone(spareBreakDownForms);
      spareBreakDownForms.forEach(item => {
        item.num = 1;
        item.repairType = null;
        item.scrapType = null;
        item.handleWay = null;
        item.appraiserName = $store.state.user.userInfo.principal.name;
        item.appraiserId = $store.state.user.userInfo.principal.id;
        // 异步获取每个备件的更换日期
        getSpare(null, item.id).then(res => {
          const times = res.data.maintenanceTimes;
          item = times && times[0];
        });
      });
      this.spareBreakDownForms = spareBreakDownForms.filter(
        item => item.status == 1 || item.status == 2
      );
      console.log(this.spareBreakDownForms);
    },
    /**
     * 用户下拉框
     */
    changeConsumerName(param, cb) {
      if (param !== "") {
        getUserDropList({ name: param }).then(res => {
          const consumerNameOptions = [];
          res.data.content.forEach(m => {
            consumerNameOptions.push({
              consumerId: m.id,
              consumerName: m.name,
              value: m.name,
              id: m.id
            });
            this.options.consumerNameOptions = consumerNameOptions;
            cb(consumerNameOptions);
          });
        });
      } else {
        this.options.consumerNameOptions = [];
      }
    },
    /**
     * 备件下拉框
     */
    changeSpare(param, cb) {
      if (param !== "") {
        getSpare({ svwMatNum: param }).then(res => {
          const spareOptions = [];
          res.data.content.forEach(m => {
            spareOptions.push({
              spareId: m.id,
              spareName: m.name,
              value: m.name,
              id: m.id
            });
            this.options.spareOptions = spareOptions;
            cb(spareOptions);
          });
        });
      } else {
        this.options.spareOptions = [];
      }
    },
    /** 点击同步按钮 */
    syncSpareParts() {
      setTimeout(() => {
        this.$refs.buttomGroup.syncing = false;
        this.$message.success("同步完成");
      }, 2000);
    },
    /** 点击单个设备的损坏登记 */
    clickDamageRegister(row) {
      this.damageRegisterIsShow = true;
      const damageRegisterData = deepClone(row);
      damageRegisterData.num = 1;
      damageRegisterData.repairType = null;
      damageRegisterData.scrapType = null;
      damageRegisterData.handleWay = null;
      damageRegisterData.appraiserName =
        $store.state.user.userInfo.principal.name;
      damageRegisterData.appraiserId = $store.state.user.userInfo.principal.id;
      damageRegisterData.changeDate = "";
      // 数组全部转成字符串显示，用逗号拼接
      for (let key in damageRegisterData) {
        if (Array.isArray(damageRegisterData[key])) {
          damageRegisterData[key] = damageRegisterData[key].join(",");
        }
      }
      this.damageRegisterData = damageRegisterData;
      // 如果备件状态损坏，更换日期显示最新的一条，否则不显示
      if (damageRegisterData.status == 2) {
        // 异步获取备件的更换日期
        getSpare(null, row.id).then(res => {
          const times = res.data.maintenanceTimes;
          this.damageRegisterData.changeDate = times && times[0];
        });
      }
    },
    /** 打开备件详情的对话框 */
    showSparePartDialog(row) {
      this.sparePartDialog = true;
      this.sparePartDialogForm = {};
      getSpare(null, row.id).then(res => {
        res.data.status = res.data.status + "";
        for (let key in res.data) {
          if (Array.isArray(res.data[key])) {
            res.data[key] = res.data[key].join("; ");
          }
        }
        this.sparePartDialogForm = res.data;
      });
      this.sapDetail(row.svwMatNum);
    },
    /**
     * 单个备件损坏登记之前
     */
    before_damageRegister() {
      const {
        inRepairTimes,
        outRepairTimes,
        repairType
      } = this.damageRegisterData;
      let text = "确认损坏登记?";
      if (repairType == "1") {
        //委内维修
        const repairLimit = this.repairLimitList.filter(
          item => item.key === "委内维修"
        )[0].value;
        if (inRepairTimes > repairLimit)
          text = `此备件委内维修次数为${inRepairTimes},已超过返修上限${repairLimit},是否继续?`;
      }
      if (repairType == "2") {
        //委外维修
        const repairLimit = this.repairLimitList.filter(
          item => item.key === "委外维修"
        )[0].value;
        if (outRepairTimes > repairLimit)
          text = `此备件委内维修次数为${outRepairTimes},已超过返修上限${repairLimit},是否继续?`;
      }
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(this.damageRegister)
        .catch(() => {});
    },
    /** 单个备件损坏登记 */
    damageRegister() {
      this.damageRegisterData.spareId = this.damageRegisterData.id;
      delete this.damageRegisterData.id;
      breakDownRegister(this.damageRegisterData)
        .then(res => {
          this.damageRegisterIsShow = false;
          this.$message.success("备件损坏登记完成");
          this.getTableData();
        })
        .catch(fail => {
          this.$message({
            showClose: true,
            message: "备件损坏登记失败",
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    /**
     * 批量备件损坏登记之前
     */
    beforeBatchDamageRegister() {
      const validate = this.spareBreakDownForms.filter(item => {
        if (!item.handleWay) return true;
        if (item.handleWay == 2 && !item.scrapType) return true;
        if (item.handleWay == 4 && !item.repairType) return true;
        return false;
      });
      if (validate.length) {
        this.$message.warning("缺少必选项");
        return;
      }

      const sparePart_warning = this.spareBreakDownForms.filter(item => {
        if (item.repairType == "1") {
          //委内维修
          const repairLimit = this.repairLimitList.filter(
            item => item.key === "委内维修"
          )[0].value;
          if (item.inRepairTimes > repairLimit) {
            return true;
          }
        }
        if (item.repairType == "2") {
          //委外维修
          const repairLimit = this.repairLimitList.filter(
            item => item.key === "委外维修"
          )[0].value;
          if (item.outRepairTimes > repairLimit) {
            return true;
          }
        }
        return false;
      });
      const sparePartNames = sparePart_warning
        .map(item => item.name)
        .join("、");
      if (sparePartNames) {
        this.$confirm(
          `备件：${sparePartNames}；维修次数已超过返修上限, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(this.batchDamageRegister)
          .catch(() => {
            console.log("已取消");
          });
        return;
      }
      // this.batchDamageRegister();
    },
    /** 批量损坏登记 */
    batchDamageRegister() {
      this.spareBreakDownForms.forEach(item => {
        item.spareId = item.id;
        delete item.id;
      });
      breakDownRegisterBatch(this.spareBreakDownForms)
        .then(res => {
          this.$message.success("批量损坏登记成功");
          this.batchDamageRegisterIsShow = false;
          this.$refs.tpmsTable.$refs.table.clearSelection();
          this.getTableData();
        })
        .catch(fail => {
          this.$message.error("批量损坏登记失败");
        });
    },
    /**
     * 导出备件
     */
    exportSpare() {
      let url = `${apiConfig.spare}/export`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      let data = this.$refs.tpmsHeader.getData();
      axios
        .get(url, {
          params: data,
          headers: {
            Authorization: "Bearer " + token
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) return;

          let fileName = "备件清单.xlsx";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
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
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    /**
     * sap库存  // TODO 参数「sapFactoryNo」传递需调整
     */
    sapDetail(svwMatNum) {
      sap["inventory"]({ svwMatNum: svwMatNum, sapFactoryNo: "1000" })
        .then(res => {
          this.sapDataList = res.data;
        })
        .catch(error => {
          this.$message({
              type: "error",
              message: error.message
            });;
        });
    }
  }
};
</script>
<style lang="scss">
.tpms-table {
  .success-row {
    background: #f0f9eb;
  }
}
.spare-part-dialog-form {
  width: 4.3rem;
  margin: 0 auto;
}
.el-select {
  width: 100%;
}
</style>
