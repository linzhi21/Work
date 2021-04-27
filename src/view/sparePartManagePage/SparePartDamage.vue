// 损坏备件处理 弃用
<template>
  <div>
    <!-- 头部功能区 -->
    <tpmsHeader ref="tpmsHeader" :formData="sparePartFormList" @inquireTableData="inquireTableData">
      <template slot="time" slot-scope="{row}">
        <el-date-picker style="width:1.6rem;" v-model="row.value[0]" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" />
        <el-date-picker style="width:1.6rem;" v-model="row.value[1]" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" />
      </template>
    </tpmsHeader>
    <buttomGroup ref="buttomGroup" @batchDamageRegister="clickBatchDamageRegister" />
    <tpmsTable @selection-change="handleSelectionChange" class="tpms-table" ref="tpmsTable" selection :data="sparePartTableData"
      :total="total" :columns="sparePartTableList" @inquireTableData="inquireTableData" @getTableData="getTableData">
      <template slot="operation" slot-scope="{row}">
        <span class="button cursor" @click="showSparePartDialog(row)">查看</span>
        <span class="button cursor" @click="clickDamageRegister(row)">损坏登记</span>
        <span class="button cursor" @click="clickShowWasteModal(row)">报废转移</span>
      </template>
    </tpmsTable>

    <!-- 单个备件损坏登记 -->
    <el-dialog @close='onClose' title="备件损坏登记" :visible.sync="damageRegister_isShow" width="60%">
      <el-row>
        <el-form class="spare-part-dialog-form" ref="damageRegister" label-width="100px" label-position="left" :model="damageRegisterData"
          style="width: 90%;">
          <el-col>
            <el-form-item label="处理方式" prop="handleWay" :rules="{
                            required: true, message: '请选择处理方式', trigger: 'blur'
                        }">
              <el-select v-model="damageRegisterData.handleWay" placeholder="请选择处理方式" >
                <el-option v-for="item in handleWaySelect" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="修复方式" prop="repairType" :rules="{
                            required: damageRegisterData.handleWay=='4', message: '请选择修复方式', trigger: 'blur'
                        }">
              <el-select v-model="damageRegisterData.repairType" placeholder="请选择修复方式">
                <el-option v-for="item in repairTypeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="报废方式" prop="scrapType" :rules="{
                            required: damageRegisterData.scrapType=='2', message: '请选择报废方式', trigger: 'blur'
                        }">
              <el-select v-model="damageRegisterData.scrapType" placeholder="请选择报废方式">
                <el-option v-for="item in scrapTypeSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <el-row type="flex" justify="center">
        <el-button @click="$refs.damageRegister.resetFields(),damageRegister_isShow=false">取消</el-button>
        <el-button type="primary" @click="$refs.damageRegister.validate(validate=>validate&&before_damageRegister())">确认</el-button>
      </el-row>
    </el-dialog>



    <!-- 备件详情对话框 -->
    <el-dialog title="备件详情" :visible.sync="sparePartDialog" width="60%">
      <el-row>
        <el-form :model="sparePartDialogForm" label-position="left" label-width="160px">
          <el-col v-for="(item,index) in sparePartDialogFormList" :span="item.type==='textArea'?24:11" :offset="index%2&&item.type!=='textArea'?2:0"
            :key="item.label">
            <el-form-item v-bind="item">
              <el-input v-if="item.isTranslate" :value='item.translate(sparePartDialogForm[item.props])' readonly />
              <el-input v-else readonly v-model="sparePartDialogForm[item.props]" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="sparePartDialog = false">返回</el-button>
      </span>
    </el-dialog>

    <el-dialog v-loading='loading' element-loading-text="文件上传中" @close="onClose"  title="报废转移" :visible.sync="showWasteModal" width="40%">
      <div class="add-receiptFiles">
        <tpms-choosefile accept='' plain text='选择文件' @getFileData='getFileData($event)'></tpms-choosefile>
      </div>
      <el-row>
        <el-form  :model="sparePartDialogForm" label-position="left" label-width="120px">

          <div style="clear: both;"></div>
          <el-col :span='24'>
            <el-form-item label="接收单位">
              <el-input v-model="wasteObject.receiveCompany"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label="接收日期">
            <!--  <el-input v-model="wasteObject.receiveDate"></el-input> -->
            <el-date-picker value-format='yyyy-MM-dd' style="width: 100%;"
                  v-model="wasteObject.receiveDate"
                  type="date"
                  placeholder="选择接收日期">
                </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label="接收单">
              <!-- <el-input v-model="wasteObject.receiptFiles"></el-input> -->
               <el-input type='textarea' v-model="fileNames"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-form-item label="接收单位">
              <el-input type='textarea' v-model="wasteObject.comment"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer">
        <el-button type="primary" @click="showWasteModal = false">取消</el-button>
        <el-button type="primary" @click="wasteConfirm">确认</el-button>
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
  } from "../../lib/api/spart";
  import {
    deepClone
  } from "../../utils";
  import {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile
  } from "../../components";
  import {
    DamageListManage as buttomGroup
  } from "./components/buttomGroups";
  import {
    factoryManage,
    workshopManage
  } from '../../lib/api/workshopSettingsManage.js';
  import {uploadAccessory} from '../../lib/api/accessory.js'
  export default {
    data() {
      let statusList = [{
          label: '待审批',
          value: 1
        },
        {
          label: '已处理',
          value: 2
        },
        {
          label: '待转移',
          value: 3
        },
        {
          label: '已退回',
          value: 4
        },
        {
          label: '待处理',
          value: 5
        },
        {
          label: '处理待审批',
          value: 6
        },
        {
          label: '待送修',
          value: 7
        },
        {
          label: '待签收',
          value: 8
        },
        {
          label: '待验收',
          value: 9
        },
        {
          label: '待确认',
          value: 10
        },
        {
          label: '已修复',
          value: 11
        },
        {
          label: '未修复',
          value: 12
        }
      ]
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
        loading:false,
        fileNames:'',
        fileList:[],
        wasteObject:{},
        showWasteModal:false,  //报废转移模态框是否显示
        isMultiple: false,   //是否批量操作
        registerList: [],
        statusList,
        workShopList: [],
        factoryList: [],
        sparePartFormList: [
          //  渲染头部功能区的列表
          {
            label: "备件名称",
            props: "name",
            value: ""
          },
          {
            label: "备件编号",
            props: "no",
            value: ""
          },
          // { label: "维修日期", props: "timeFrame", value: [], slotName:'time' },
          // { label: '设备名称', props: 'deviceName', value: '', },
          // { label: '设备编号', props: 'deviceNo', value: '', },
        ],
        sparePartTableData: [], // 表格的数据
        total: 0, //表格数据量
        sparePartTableList: [
          // 渲染表格的表头
          {
            type: "selection",
            width: "55",
            selectable: /** 状态为正常或损坏时可选 */ ({
                status
              }) =>
              status == 1 || status == 2,
          },
          {
            props: "name",
            label: "备件名称"
          },
          {
            props: "no",
            label: "备件编号"
          },
          {
            props: "deviceName",
            label: "设备名称"
          },
          {
            props: "deviceNo",
            label: "设备编号"
          },
          {
            props: "handleWay",
            label: "处理方式",
            translate: handleWay,
            width: "180px",
          },
          {
            props: "repairType",
            label: "修复方式",
            translate: repairType
          },
          {
            props: "handleDate",
            label: "处理日期(提交/报废)"
          },
          {
            props: "status",
            label: "审批状态",
            translate: status
          },
          {
            label: "操作",
            slotName: "operation",
            fixed: "right",
            width: "180px",
          }
        ],
        sparePartDialog: false, // 控制备件详情对话框的打开与关闭
        sparePartDialogForm: {}, // 控制备件详情对话框中的form表单
        sparePartDialogFormList: [
          // 渲染备件详情对话框中的form表单内容
          {
            props: "no",
            label: "备件编号"
          },
          {
            props: "name",
            label: "备件名称"
          },
          {
            props: "deviceName",
            label: "设备名称"
          },
          {
            props: "deviceNo",
            label: "设备编号"
          },
          {
            props: "handleWay",
            label: "处理方式",
            width: "120px",
            translate: handleWay,
            isTranslate: true
          },
          {
            props: "repairType",
            label: "修复方式",
            width: "120px",
            translate: repairType,
            isTranslate: true
          },
          {
            props: "handleDate",
            label: "处理日期(提交/报废)"
          },
          {
            props: "status",
            label: "审批状态",
            width: "120px",
            translate: status,
            isTranslate: true
          }
        ],
        repairLimitList: [], //返修上限列表
        handleWaySelect: [
          // 处理方式下拉选择框内容
          {
            label: "工业垃圾",
            value: 1,
            disabled: (price) => price <= 1000
          },
          {
            label: "报废备件",
            value: 2,
            disabled: (price) => price > 1000
          },
          {
            label: "修复备件",
            value: 4
          },
        ],
        repairTypeSelect: [
          // 处理类型下拉选择框内容
          {
            label: "委内维修",
            value: 1
          },
          {
            label: "委外维修",
            value: 2
          },
        ],
        scrapTypeSelect: [{
            label: "金属报废",
            value: 1
          },
          {
            label: "非金属报废",
            value: 2
          },
        ],
        sparePartsSetting_isShow: false, //常用备件设置模态框
        sparePartsSetting: {
          key: "",
          value: "",
        },
        batchDamageRegister_isShow: false, //备件批量损坏登记模态框
        batchDamageRegisterData: [],
        damageRegister_isShow: false, //单个备件损坏登记模态框
        damageRegisterData: {},
      };
    },
    components: {
      tpmsHeader,
      buttomGroup,
      tpmsTable,
      tpmsChoosefile
    },
    created() {
      getRepairLimitList().then((res) => {
        this.repairLimitList = res.data.content;
      });
    },
    mounted() {
      this.getTableData();
      this.getFactoryList();
      this.getWorkshopList()
    },
    methods: {
      /**报废转移确认**/
      wasteConfirm(){
        console.log(this.wasteObject);

        spareBreakdown.scrapTransfer(this.wasteObject,this.spareId).then(res=>{
          console.log(res);
          this.$message.success('操作成功');
          this.showWasteModal=false;
          this.fileNames='';
          this.wasteObject={}
        })
      },
      getFileData(file){
        let formData=new FormData();
        formData.append('file',file);
        formData.append('module','4');
        this.loading=true;
        uploadAccessory(formData,4).then(res=>{
          this.loading=false;
          this.fileList.push({filename:res.originName,id:res.id});
          let data=this.fileList.map(item=>{
            return item.id
          })
          this.fileNames=this.fileList.map(item=>{
            return item.filename
          }).join()
          this.wasteObject.receiptFiles=data.join(',');

        })
      },
      // 显示报废转移模态框
      clickShowWasteModal(row){
        console.log(row)
        this.spareId=row.id;
        this.showWasteModal=true
      },
      /**关闭模态框**/
      onClose(){
        this.damageRegisterData={};
        this.wasteObject={};
        this.fileNames=''
      },
      /**批量操作**/
      handleSelectionChange(val) {
        // console.log(val)
        this.registerList = val;
      },
      /**获取工厂列表**/
      getFactoryList() {
        factoryManage.getLists(null).then(res => {
          this.factoryList = res.data.content.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        })
      },
      /**获取车间列表**/
      getWorkshopList() {
        workshopManage.getLists(null).then(res => {
          console.log(res)
          this.workShopList = res.data.content.map(item => {
            return {
              label: item.name,
              value: item.id
            }
          })
        })
      },
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
        // data.startTime=data.timeFrame.split(',')[0];
        // data.endTime=data.timeFrame.split(',')[1];
        delete data.timeFrame;
        let pageData = this.$refs.tpmsTable.getData();
        spareBreakdown.getList({ ...data,
          ...pageData
        }).then((res) => {
          this.sparePartTableData = res.data.content;
          this.total = res.data.totalElements;
        });
      },
      /** 点击批量损坏登记按钮 */
      clickBatchDamageRegister(val) {
        if (this.registerList.length > 0) {
          this.damageRegister_isShow = true;
          this.isMultiple = true
        } else {
          this.$message.error('至少选择一项')
        }

      },
      /** 点击单个设备的损坏登记 */
      clickDamageRegister(row) {
        console.log(row)
        this.damageRegister_isShow = true;
        const damageRegisterData = deepClone(row);
        damageRegisterData.num = 1;
        damageRegisterData.repairType = null;
        damageRegisterData.scrapType = null;
        damageRegisterData.handleWay = null;
        // damageRegisterData.appraiserName =
        // this.$store.state.user.userInfo.principal.name;
        // damageRegisterData.appraiserId = this.$store.state.user.userInfo.principal.id;
        // damageRegisterData.changeDate = damageRegisterData.maintenanceTime;
        this.damageRegisterData = damageRegisterData;
        this.isMultiple = false;
      },
      /** 打开备件详情的对话框 */
      showSparePartDialog(row) {
        this.sparePartDialog = true;
        console.log(row)
        this.sparePartDialogForm = {};
        spareBreakdown.getOne(null, row.id).then((res) => {
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
      before_damageRegister() {
        let text = "确认损坏登记?";
        this.$confirm(text, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            if (this.isMultiple) {
              this.batchDamageRegister() //批量操作
            } else {
              this.damageRegister();
            }
          })
          .catch(() => {});
      },
      /** 单个备件损坏登记 */
      damageRegister() {
        let {
          spareId,
          handleWay,
          repairType,
          scrapType
        } = this.damageRegisterData;
        let option = {
          spare: {
            id: spareId
          },
          handleWay,
          repairType,
          scrapType
        }
        // return false
        breakDownRegister(option)
          .then((res) => {
            this.damageRegister_isShow = false;
            this.$message.success("备件损坏登记完成");
            this.getTableData();
          })
          .catch((fail) => {
            this.$message({
              showClose: true,
              message: "备件损坏登记失败",
              type: "error",
              duration: 5 * 1000,
            });
          });
      },
      /**
       * 批量备件损坏登记之前
       */
      before_batchDamageRegister() {

        // this.batchDamageRegister();
      },
      /** 批量损坏登记 */
      batchDamageRegister() {
        console.log(this.registerList)
        let {
          handleWay,
          repairType,
          scrapType
        } = this.damageRegisterData;
        let option = this.registerList.map((item) => {
          return {
           handleWay,
           repairType,
           scrapType,
            "spare": {
              "id": item.spareId
            }
          }

        })
        console.log(option)
        breakDownRegisterBatch(option)
          .then((res) => {
            this.$message.success("批量损坏登记成功");
            this.damageRegister_isShow = false;
            this.$refs.tpmsTable.$refs.table.clearSelection();
            this.getTableData();
          })
          .catch((fail) => {
            this.$message.error("批量损坏登记失败");
          });
      },
    },
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
  .add-receiptFiles{
    overflow: hidden;
    margin: 20px 0;


  }
</style>
