// 损坏备件
<template>
  <div>
    <!-- 头部功能区 -->
    <tpmsHeader ref="tpmsHeader" :formData="sparePartFormList" @inquireTableData="inquireTableData">
      <template slot="time" slot-scope="{row}">
        <el-date-picker
          style="width:1.6rem;"
          v-model="row.value[0]"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期"
        />
        <el-date-picker
          style="width:1.6rem;"
          v-model="row.value[1]"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
        />
      </template>
    </tpmsHeader>
    <buttomGroup ref="buttomGroup" @batchDamageRegister="clickBatchDamageRegister" />
    <tpmsTable
      class="tpms-table"
      ref="tpmsTable"
      selection
      :data="sparePartTableData"
      :total="total"
      :columns="sparePartTableList"
      @inquireTableData="inquireTableData"
      @getTableData="getTableData"
    >
      <template slot-scope="{row}">
        <!-- <span class="button cursor" @click="showSparePartDialog(row)">查看</span> -->
        <span
          v-if="row.repairType === null && row.handleWay === null && row.scrapType === null "
          class="button cursor"
          @click="changeRepairType(row)"
        >损坏登记</span>
        <span v-if="row.repairType === 1" class="button cursor" @click="spairRepairInner(row)">委内维修</span>
        <span v-if="row.repairType === 2" class="button cursor" @click="spairRepairOuter(row)">委外维修</span>
      </template>
    </tpmsTable>

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
          <el-input v-model="damageRegisterData.spareName" disabled />
        </el-form-item>
        <el-form-item label="SVW编号" prop="changeDate">
          <el-input v-model="damageRegisterData.svwMatNum" disabled />
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
          :rules="{ required: true, message: '请选择处理方式', trigger: 'blur' }"
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
          :rules="[{required: damageRegisterData.handleWay=='4', message: '请选择处理方式', trigger: 'blur'}]"
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
          :rules="{required: damageRegisterData.handleWay=='2', message: '请输入次数', trigger: 'blur'}"
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
          <el-select
            v-model="batchDamageRegisterData.appraiserName"
            filterable
            remote
            placeholder="请先选择备件，再选择鉴定人姓名"
            :remote-method="changeAppraiserName"
            @change="selectForm($event, batchDamageRegisterData, 'appraiser')"
          >
            <el-option
              v-for="(item, index) in options.appraiserNameOptions"
              :key="index"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="batchDamageRegisterDataInit()">取消</el-button>
        <el-button
          type="primary"
          @click="$refs.damageRegister.validate(validate=>validate&&beforeDamageRegister())"
        >保存</el-button>
      </el-row>
    </el-dialog>

    <!-- 批量损坏登记 -->
    <el-dialog title="备件损坏登记" :visible.sync="batchDamageRegisterIsShow" width="900px">
      <el-form
        :model="batchDamageRegisterData"
        ref="batchDamageRegisterData"
        inline
        label-position="left"
        size="small"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="备件" prop="spare" :rules="[{ required: true, message: '不能为空'}]">
              <el-select
                v-model="batchDamageRegisterData.spareName"
                filterable
                remote
                placeholder="请输入SVW编号"
                :remote-method="changeSpare"
                @change="selectForm($event, batchDamageRegisterData, 'spare')"
              >
                <el-option
                  v-for="(item, index) in options.spareOptions"
                  :key="index"
                  :label="item.label"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="鉴定人姓名"
              prop="appraiserName"
              :rules="[{ required: true, message: '不能为空'}]"
            >
              <el-select
                v-model="batchDamageRegisterData.appraiserName"
                filterable
                remote
                placeholder="请先选择备件，再选择鉴定人姓名"
                :remote-method="changeAppraiserName"
                @change="selectForm($event, batchDamageRegisterData, 'appraiser')"
              >
                <el-option
                  v-for="(item, index) in options.appraiserNameOptions"
                  :key="index"
                  :label="item.label"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量" prop="num" :rules="[{ required: true, message: '不能为空'}]">
              <el-input v-model="batchDamageRegisterData.num"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6"></el-col>

          <el-col :span="6">
            <el-form-item
              label="处理方式"
              prop="handleWay"
              :rules="[{ required: true, message: '不能为空'}]"
            >
              <el-select v-model="batchDamageRegisterData.handleWay" placeholder="请输入处理方式">
                <el-option label="工业垃圾" value="1"></el-option>
                <el-option label="报废备件" value="2"></el-option>
                <el-option label="修复备件" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="batchDamageRegisterData.handleWay === '4'">
            <el-form-item label="修复方式">
              <el-select v-model="batchDamageRegisterData.repairType" placeholder="请输入修复方式">
                <el-option label="委内维修" value="1"></el-option>
                <el-option label="委外维修【框架内】" value="2"></el-option>
                <el-option label="委外维修【框架外】" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="batchDamageRegisterData.handleWay === '2'">
            <el-form-item label="报废方式">
              <el-select v-model="batchDamageRegisterData.scrapType" placeholder="请输入报废方式">
                <el-option label="金属报废" value="1"></el-option>
                <el-option label="非金属报废" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row type="flex" justify="center" style="margin-top:40px;">
        <el-button @click="batchDamageRegisterDataInit()">取消</el-button>
        <el-button type="primary" @click="beforeBatchDamageRegister('batchDamageRegisterData')">保存</el-button>
      </el-row>
    </el-dialog>

    <!-- 备件详情对话框 -->
    <el-dialog title="备件详情" :visible.sync="sparePartDialog" width="50%">
      <el-row>
        <el-form :model="sparePartDialogForm" label-position="left" label-width="120px">
          <el-col
            v-for="(item,index) in sparePartDialogFormList"
            :span="item.type==='textArea'?24:11"
            :offset="index%2&&item.type!=='textArea'?2:0"
            :key="item.label"
          >
            <el-form-item v-bind="item">
              <el-select
                style="width:100%;"
                v-if="item.type==='radio'"
                v-model="sparePartDialogForm[item.props]"
                :placeholder="item.placeholder||''"
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
                v-else-if="item.type==='textArea'"
                disabled
                type="textarea"
                v-model="sparePartDialogForm[item.props]"
              />
              <el-input v-else disabled v-model="sparePartDialogForm[item.props]" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <!-- <el-form class="spare-part-dialog-form" :model="sparePartDialogForm" label-width="80px">
                <el-form-item :label="item.label" v-for='(item,index) in sparePartDialogFormList' :key="index">
                    <el-input v-model='sparePartDialogForm[item.name]' disabled />
                </el-form-item>
      </el-form>-->
      <span slot="footer">
        <el-button type="primary" @click="sparePartDialog = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  spareBreakdown,
  breakdown,
  getRepairLimitList,
  breakDownRegister,
  breakDownRegisterBatch,
  getSpare,
  spareConsuming,
  spairRrepair
} from "../../lib/api/spart";
import { getUserDropList, spareAppraiser } from "../../lib/api/userManage";
import { deepClone } from "../../utils";
import { tpmsHeader, tpmsTable } from "../../components";
import { DamageListManage as buttomGroup } from "./components/buttomGroups";
export default {
  data() {
    // 处理方式
    function handleWay(val) {
      let result = "";
      switch (val) {
        case 1:
          result = "工业垃圾（原值<=1000）";
          break;
        case 2:
          result = "报废备件（原值>1000)";
          break;
        case 4:
          result = "修复备件";
          break;
      }
      return result;
    }
    //    修复方式
    function repairType(val) {
      console.log(val);
      let result = "";
      switch (val) {
        case 1:
          result = "委内维修";
          break;
        case 2:
          result = "委外维修";
          break;
      }
      return result;
    }
    // 审批状态
    function status(val) {
      console.log(val);
      let result = "";
      switch (val) {
        case 1:
          result = "待审批";
          break;
        case 2:
          result = "已处理";
          break;
        case 3:
          result = "待转移";
          break;
        case 4:
          result = "已退回";
          break;
        case 5:
          result = "待处理";
          break;
        case 6:
          result = "处理待审批";
          break;
        case 7:
          result = "待送修";
          break;
        case 8:
          result = "待签收";
          break;
        case 9:
          result = "待验收";
          break;
        case 10:
          result = "待确认";
          break;
        case 11:
          result = "已修复";
          break;
        case 12:
          result = "未修复";
          break;
      }
      return result;
    }
    return {
      sparePartFormList: [
        //  渲染头部功能区的列表
        { label: "备件名称", props: "name", value: "" },
        { label: "备件编号", props: "no", value: "" }
      ],
      sparePartTableData: [], // 表格的数据
      total: 0, //表格数据量
      sparePartTableList: [
        // 渲染表格的表头
        {
          type: "selection",
          width: "30",
          selectable: /** 状态为正常或损坏时可选 */ ({ status }) =>
            status == 1 || status == 2
        },
        { props: "spareName", label: "备件名称" },
        { props: "dcMatNum", label: "DC编号" },
        { props: "svwMatNum", label: "SVW编号" },
        { props: "num", label: "领用数量" },
        { props: "appraiserName", label: "领用人" },
        {
          props: "handleWay",
          label: "处理方式",
          translate: handleWay,
          width: "180px"
        },
        { props: "repairType", label: "修复方式", translate: repairType },
        { props: "handleDate", label: "处理日期(提交/报废)" }
        // { props: "status", label: "审批状态", translate: status }
      ],
      sparePartDialog: false, // 控制备件详情对话框的打开与关闭
      sparePartDialogForm: {}, // 控制备件详情对话框中的form表单
      sparePartDialogFormList: [
        // 渲染备件详情对话框中的form表单内容
        { props: "no", label: "备件编号" },
        { props: "name", label: "备件名称" },
        { props: "price", label: "原值" },
        { props: "specification", label: "型号规格" },
        {
          props: "deviceNo",
          label: "所属设备编号",
          slotName: "deviceNos",
          width: "120px"
        },
        {
          props: "deviceName",
          label: "所属设备名称",
          slotName: "deviceNames",
          width: "120px"
        },
        { props: "materialNo", label: "东昌物料号" },
        {
          props: "maintenanceNo",
          label: "关联维修单",
          slotName: "maintenanceNos",
          width: "120px"
        },
        {
          props: "maintenanceTime",
          label: "维修时间",
          slotName: "maintenanceTimes",
          width: "120px"
        },
        { props: "comment", label: "备注", type: "textArea" }
      ],
      repairLimitList: [], //返修上限列表
      handleWaySelect: [
        // 处理方式下拉选择框内容
        { label: "工业垃圾", value: 1, disabled: price => price <= 1000 },
        { label: "报废备件", value: 2, disabled: price => price > 1000 },
        { label: "修复备件", value: 4 }
      ],
      repairTypeSelect: [
        // 处理类型下拉选择框内容
        { label: "委内维修", value: 1 },
        { label: "委外维修", value: 2 }
      ],
      scrapTypeSelect: [
        { label: "金属报废", value: 1 },
        { label: "非金属报废", value: 2 }
      ],
      sparePartsSetting: {
        key: "",
        value: ""
      },
      batchDamageRegisterIsShow: false, //备件批量损坏登记模态框
      batchDamageRegisterData: {
        appraiserName: "",
        comment: null,
        handleWay: null,
        num: null,
        repairType: null,
        scrapType: null,
        spare: {},
        spareName: null
      },
      damageRegisterIsShow: false, //单个备件损坏登记模态框
      damageRegisterData: {},
      options: {
        appraiserNameOptions: [{ label: "", value: "" }],
        spareOptions: [{ label: "", value: "" }]
      }
    };
  },
  components: {
    tpmsHeader,
    buttomGroup,
    tpmsTable
  },
  created() {
    getRepairLimitList().then(res => {
      this.repairLimitList = res.data.content;
    });
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    /**
     * @description 分页器中pageSize 改变时触发的事件
     * @param {val} 每页的条数
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    /**
     * @description 分页器中currentPage 改变时触发的事件
     * @param {val} 当前页
     */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    /** 点击查询按钮 */
    inquireTableData() {
      this.$refs.tpmsTable.resetCurrentPage();
      this.getTableData();
    },
    /** 加载页面表格数据 */
    getTableData() {
      let data = this.$refs.tpmsHeader.getData();
      delete data.timeFrame;
      let pageData = this.$refs.tpmsTable.getData();
      spareBreakdown.getList({ ...data, ...pageData }).then(res => {
        console.log(res);
        this.sparePartTableData = res.data.content;
        this.total = res.data.totalElements;
      });
    },
    /** 点击(批量)损坏登记按钮 */
    clickBatchDamageRegister() {
      this.batchDamageRegisterIsShow = true;
    },
    /**
     * 委内维修
     */
    spairRepairInner(row) {
      let param = {
        spare: { id: row.spareId },
        spareBreakDown: { id: row.id }, // 备件损坏记录{id: row.id}
        proposerDept: null, // 申请部门
        specification: null, // 型号、规格
        repairer: null, // 维修员，用户ID
        techRepairer: null, // 维修技术员
        k3: null,
        num: row.num,
        sn: null, //产品系列号/部件修理号
        repairSpareName: row.spareName, // 部件名称
        controlledMember: null, // 部件使用设备及控制对象
        elecRepairResponsor: null, // 电子维修负责人
        techK3: null, // 技术办公室k3经理
        requireFinishDate: null, //要求完成日期
        breakDownDesc: null, // 故障现象描述
        repairConclusion: null, //故障诊断维修结论
        techResponsor: null, //技术负责人
        technicalRequirements: null, //部件修理技术要求
        comment: null
      };
      this.$confirm("是否提交维修?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          spairRrepair.inner(param).then(res => {
            this.getTableData();
            this.$message({
              type: "success",
              message: "提交成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消维修"
          });
        });
    },
    /**
     * 委外维修
     */
    spairRepairOuter(row) {
      let param = {
        spare: { id: row.spareId },
        spareBreakDown: { id: row.id }, // 备件损坏记录{id: row.id}
        type: row.repairType, // 维修方式2：委外维修【框架内】；4：委外维修：【框架外
        k3: null,
        k2: null,
        specification: null, // 型号、规格
        num: row.num,
        sn: null, //产品系列号/部件修理号
        repairSpareName: row.spareName, // 部件名称
        controlledMember: null, // 部件使用设备及控制对象
        outsourcingRepairReason: null, //委外维修理由
        recommendedRepairCompanyAndPrice: null, // 推荐修理单位及初步报价
        operatorName: null, // 经办人姓名
        requireFinishDate: null, //要求完成日期
        breakDownDesc: null, // 故障现象描述
        technicalRequirements: null, //部件修理技术要求
        techInst: null, // 送修单位
        techK3: null, // 技术办公室k3经理
        techK2: null, // 技术办公室k2经理
        sender: null, // 送修人
        senderTel: null, // 送修人电话
        sendDate: null, // 送修日期
        repairInstReceiver: null, // 修理单位取件人
        repairInstReceiverTel: null, // 修理单位取件人联系电话
        sendBackDate: null, // 预计送回日期
        techComment: null, // 技术办公室备注
        breakdownPhotos: null, // 故障照片，附件ID英文逗号分割
        quotationFiles: null, // 报价凭证，附件ID英文逗号分割

        comment: null
      };
      this.$confirm("是否提交维修?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          spairRrepair.outer(param).then(res => {
            this.getTableData();
            this.$message({
              type: "success",
              message: "提交成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消维修"
          });
        });
    },
    /** 打开备件详情的对话框 */
    showSparePartDialog(row) {
      this.sparePartDialog = true;
      this.sparePartDialogForm = {};
      breakdown.getDetail(null, row.id).then(res => {
        for (let key in res.data) {
          if (Array.isArray(res.data[key])) {
            res.data[key] = res.data[key].join("; ");
          }
        }
        this.sparePartDialogForm = res.data;
      });
    },
    /**
     * 单个备件损坏登记之前
     */
    beforeDamageRegister() {
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
        .then(this.breakDownRegisterFun())
        .catch(() => {});
    },
    /** 打开单个备件损坏登记 */
    changeRepairType(row) {
      this.damageRegisterIsShow = true;
      this.damageRegisterData = row;
    },
    /**
     * 单个备件损坏登记
     */
    breakDownRegisterFun() {
      this.damageRegisterData.spare = {id: this.damageRegisterData.spareId};
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
    beforeBatchDamageRegister(formObj) {
      this.$refs[formObj].validate(valid => {
        if (valid) {
          this.batchDamageRegister();
        } else {
          return false;
        }
      });
    },
    /** 批量损坏登记 */
    batchDamageRegister() {
      breakDownRegisterBatch([this.batchDamageRegisterData])
        .then(res => {
          this.$message.success("损坏登记成功");
          this.batchDamageRegisterIsShow = false;
          this.$refs.tpmsTable.$refs.table.clearSelection();
          this.getTableData();
          this.batchDamageRegisterDataInit();
        })
        .catch(fail => {
          this.$message.error("损坏登记失败");
          this.batchDamageRegisterDataInit();
        });
    },
    /**
     * 用户下拉框
     */
    changeAppraiserName(param) {
      if (param !== "") {
        spareAppraiser({ name: param, price: this.batchDamageRegisterData.price }).then(res => {
          const appraiserNameOptions = [];
          res.data.content.forEach(m => {
            appraiserNameOptions.push({
              appraiserId: m.id,
              appraiserName: m.name,
              value: m.id,
              label: m.name,
              id: m.id
            });
            this.options.appraiserNameOptions = appraiserNameOptions;
          });
        });
      } else {
        this.options.appraiserNameOptions = [];
      }
    },
    /**
     * 备件下拉框
     */
    changeSpare(param) {
      if (param !== "") {
        getSpare({ svwMatNum: param }).then(res => {
          const spareOptions = [];
          res.data.content.forEach(m => {
            spareOptions.push({
              spareId: m.id,
              spareName: m.name,
              price: m.price,
              value: m.name,
              label: `${m.descSpec} | ￥${m.price}`,
              id: m.id
            });
            this.options.spareOptions = spareOptions;
          });
        });
      } else {
        this.options.spareOptions = [];
      }
    },
    /**
     * 选择事件
     */
    selectForm(item, formObj, type) {
      const types = {
        spare: "spare",
        appraiser: "appraiser"
      };
      switch (type) {
        case types.spare:
          formObj.spare = { id: item.spareId };
          formObj.price = item.price;
          break;
        default:
          formObj.appraiserId = item.appraiserId;
          formObj.appraiserName = item.appraiserName;
          break;
      }
    },
    /**
     * 初始化表单
     */
    batchDamageRegisterDataInit() {
      this.batchDamageRegisterIsShow = false;
      this.damageRegisterIsShow = false;
      this.batchDamageRegisterData = {
        appraiserName: "",
        comment: null,
        handleWay: null,
        num: null,
        repairType: null,
        scrapType: null,
        spare: {},
        spareName: null
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.spare-part-dialog-form {
  width: 4.3rem;
  margin: 0 auto;
}
.el-select {
  width: 100%;
}
</style>