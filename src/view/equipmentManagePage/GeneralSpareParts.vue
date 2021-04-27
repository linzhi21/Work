// 通用备件
<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header ref='tpmsHeader' :formData='searchConditions' @inquireTableData='inquireTableData' />
        <buttomGroup />
        <!-- 底部表格 -->
        <tpmsTable
        :column_index="true"
          ref="tpmsTable"
          :data='equipmentTableData'
          :columns='equipmentTableList'
          :total='total'
           @inquireTableData="inquireTableData"
           @getTableData="getTableData"
        >
          <!-- <template slot='detail' slot-scope="{row}">
            <span class="button cursor" @click="seeEquipmentDetail(row)">详情</span>
          </template> -->
          <template slot="operation" slot-scope="{row}">
            <!-- <span class="buton cursor">download</span> -->
            <span class="button cursor" @click="seeEquipmentDetail(row)">详情</span>
            <span class="button cursor" @click="seeSparePart(row)">查看</span>
          </template>
        </tpmsTable>
      </el-card>
    </el-row>

    <!-- 新增备件模态框 -->
    <el-dialog width="500px" title="新增备件" :visible.sync="addSparePartIsShow" center>
      <el-form
        :model="addSparePartData"
        ref="dialog_AddSparePart"
        :rules="rules_AddSparePartData"
        label-width="100px"
      >
        <el-form-item label="备件编号" prop="number" required>
          <el-input v-model="addSparePartData.number"></el-input>
        </el-form-item>
        <el-form-item label="备件名称" prop="name" required>
          <el-input v-model="addSparePartData.name"></el-input>
        </el-form-item>
        <el-form-item label="型号规格" prop="specifications">
          <el-input v-model="addSparePartData.specifications"></el-input>
        </el-form-item>
        <el-form-item label="制造商编号" prop="manufacturerId">
          <el-input v-model="addSparePartData.manufacturerId"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" required>
          <el-radio-group v-model="addSparePartData.status">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <!-- 这里的点击事件没有抽离到methods里，目的是后面更方便地提取组件 -->
        <el-button @click="$refs.dialog_AddSparePart.resetFields(),addSparePartIsShow=false">取消</el-button>
        <el-button
          type="primary"
          @click="$refs.dialog_AddSparePart.validate(validate=>validate&&addSparePart())"
        >保存</el-button>
      </el-row>
    </el-dialog>

    <!-- 查看备件详情模态框 -->
    <el-dialog :visible.sync='seeSparePartIsShow' width="70%" title="备件详情">
      <el-row>
        <el-form :model="sparePartDetail" label-position="left" label-width="120px">
          <el-col :span="11" :offset="index%2?2:0" v-for='(item,index) in equipmentTableList.filter(item=>item.props)' :key='item.label'>
            <el-form-item :label="item.label">
              <el-radio-group v-if="item.type==='radio'" v-model="sparePartDetail[item.props]" readonly>
                <el-radio :label="true" >启用</el-radio>
                <el-radio :label="false">禁用</el-radio>
              </el-radio-group>
              <el-input v-else readonly v-model="sparePartDetail[item.props]" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <!-- <el-row type="flex" justify='end'>
            <el-button @click="seeSparePartIsShow = false">
                取 消
            </el-button>
            <el-button type="primary" @click="">
                保存
            </el-button>
      </el-row> -->
    </el-dialog>

    <!-- 维修记录详情模态框 -->
    <el-dialog title="维修记录" :visible.sync="equipmentDetailIsShow" width="80%" center>
      <tpmsTable
        :data="equipmentTableData"
        :columns="[
          {props:'equipmentNumber',label:'维修单号'},
          {props:'sectionName',label:'设备编号'},
          {props:'equipmentName',label:'设备名称'},
          {props:'equipmentArea',label:'报修区域'},
          {props:'equipmentName',label:'报修内容'},
          {props:'equipmentArea',label:'报修地址'},
          {props:'sectionName',label:'紧急程度'},
          {props:'sectionName',label:'状态'},
          {props:'enable',label:'创建时间',width:'140px'},
          {props:'wokrshop',label:'创建人'},
          {slotName:'record',label:'备件更换记录',width:'150px'},
        ]"
        :paginationIsShow='false'
      >
        <template slot='record' slot-scope="{row}">
            <span class="button cursor" slot="reference" @click="seeSparePartsRecord(row)">查看</span>
        </template>
      </tpmsTable>
      <el-dialog width="70%" title="维修详情" :visible.sync="sparePartIsShow" center append-to-body>
        <tpmsTable
          :data="equipmentTableData"
          :columns="[
            {props:'equipmentNumber',label:'备件编号'},
            {props:'equipmentName',label:'备件名称'},
            {props:'equipmentNumber',label:'设备编号'},
            {props:'equipmentName',label:'设备名称'},
            {props:'equipmentArea',label:'备件参数'},
            {props:'sectionName',label:'制造商编号'},
            {props:'sectionName',label:'东昌物料号'},
            {props:'enable',label:'创建时间',width:'140px'},
            {props:'sectionName',label:'创建人'},
            {props:'sectionName',label:'标签'},
          ]"
          :paginationIsShow='false'
        >
          <template slot='record' slot-scope="{row}">
              <span class="button cursor" slot="reference" @click="seeSparePartsRecord(row)">查看</span>
          </template>
        </tpmsTable>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { queryUniversalSpare as getData, getUniversalSpare } from '../../lib/api/spart';
import {bomManage} from '../../lib/api/device';
import { tpmsHeader, tpmsTable } from '../../components';
import { GeneralSpareParts as buttomGroup } from './components/buttomGroups';
export default {
  data() {
    let statusList=[{label:'启用',id:true},{label:'禁用',id:false}];
    return {
      // 头部搜索条件
      searchConditions: [
        //  渲染头部功能区的列表
        { label: "备件名称", props: "name", value: "" },
        { label: "备件编号", props: "no", value: "" },
        { label: "状态", props: "enable", value: "", type:'radio', checkList:statusList}
      ],
      equipmentTableData: [
        // 表格的数据
      ],
      equipmentTableList: [
        // 渲染表格的表头
        { props: "name", label: "备件名称" },
        { props: "dcNO", label: "备件编号" },
        { props: "specification", label: "型号规格" },
        { props: "svwNO", label: "制造商编号" },
        { props: "enable", label: "状态", translate:(value)=>value?'启用':'禁用', type:'radio' },
        { props: "unitPrice", label: "原值" },
        { props: "number", label: "维修次数" },
        { slotName:'detail', label: "维修记录", },
         {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "240px",
        }
      ],
      addSparePartIsShow: false, //新增备件模态框
      addSparePartData: {
        //新增备件模态框 数据
        number: "",
        name: "",
        specifications: "",
        manufacturerId: "",
        status: ""
      },
      rules_AddSparePartData: {
        //新增备件数据验证规则
        number: [
          { required: true, message: "请输入备件编号", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入备件名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择备件状态", trigger: "blur" }]
      },
      total: 30, //分页器 一共有多少条数据
      equipmentDetailIsShow: false, //查看设备维修记录列表模态框
      equipmentDetailData: [], //查看设备维修记录模态框列表数据
      seeSparePartIsShow:false,//查看备件详情模态框
      sparePartDetail:{},//查看备件详情模态框数据
      sparePartIsShow: false, //某一条维修记录的 更换的备件列表 模态框
      sparePartData: [], //维修记录更换的备件数据列表
      deviceIsUploading: false //设备信息是否正在上传
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
      let data = this.$refs.tpmsHeader.getData();
      data.isBasics=true;
      let pageData = this.$refs.tpmsTable.getData();
      bomManage['getLists']({ ...data,
          ...pageData
        }).then(res => {
          console.log(res)
          this.equipmentTableData = res.data.content
          this.total = res.data.totalElements;
        })

    },
    /** 查看设备维修记录列表 */
    seeEquipmentDetail(row) {
      this.equipmentDetailIsShow = true;
      this.equipmentDetailData = [];
      this.$message.warning('暂无接口')
    },
    /** 查看备件信息 */
    seeSparePart(row){
      this.seeSparePartIsShow=true;
      bomManage['getOne'](null,row.id).then(res=>{
        this.sparePartDetail=res.data;
        console.log(res)
        // this.equipmentDetailData=res
      })
    },
    /** 查看备件更换记录 */
    seeSparePartsRecord(row) {
      this.sparePartIsShow = true;
      this.sparePartData = [];
      console.log(row);
    },
    /** 设备上传之前的钩子 */
    device_beforeUpload() {
      this.deviceIsUploading = true;
    },
    /** 设备信息上传完成时钩子 */
    device_uploadSucess(res, file, fileList) {
      console.log(res);
      console.log(file);
      console.log(fileList);
      this.deviceIsUploading = false;
      this.$message({
        message: "备件信息上传完成",
        type: "success"
      });
    },
    /** 设备信息上传错误时的钩子 */
    device_uploadError(err) {
      console.log(err);
      this.deviceIsUploading = false;
      this.$message({
        message: "备件信息上传失败",
        type: "error"
      });
    },
    /** 新增通用备件 */
    addSparePart() {
      console.log(this.addSparePartData);
      this.addSparePartIsShow=false;
      this.$message.success('新增备件成功')
    },
    /**
     * 	el-form：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
     */
    resetFields() {
      this.$refs.dialog_AddSparePart.resetFields();
    },

    /** 清空还原数据 */
    clear(target) {
      if (Array.isArray(target)) {
        target.forEach(item => (item.value = ""));
      } else {
        for (let key in target) {
          target[key] = "";
        }
      }
    }
  }
};
</script>
