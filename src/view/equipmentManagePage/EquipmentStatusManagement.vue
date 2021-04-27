// 设备状态管理
<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <!-- <el-row type="flex" justify="space-between"> -->
        <tpmsHeader ref='tpmsHeader' :formData='equipmentFormList' @inquireTableData='inquireTableData' />
        <buttomGroup @add='addDeviceStatusIsShow=true' />
        <tpmsTable
          ref="tpmsTable"
          :data='equipmentTableData'
          :total="total"
          :column_index='true'
          :columns='equipmentTableList'
          @inquireTableData='inquireTableData'
          @getTableData='getTableData'
        >
          <template slot-scope="{row}">
            <span class="button cursor" @click="edit(row)">编辑</span>
            <el-divider direction="vertical"></el-divider>
            <span class="button cursor" @click="changeStatus(row)">启用/禁用</span>
          </template>
        </tpmsTable>
        <!-- 底部表格 -->
        <!-- <el-row>
          <el-table
            :data="[...equipmentTableData,...equipmentTableData,...equipmentTableData]"
            style="width: 100%"
          >
            <el-table-column align="center" type="index" label="序号" width="60px"></el-table-column>
            <el-table-column
              align="center"
              min-width="100px"
              v-for="(item,index) in equipmentTableList"
              :key="index"
              :label="item.name"
              :prop="item.props"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="200px">
              <template>
                <span class="button">编辑</span>
                <span class="button">启用/禁用</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row> -->
        <!-- 分页 -->
        <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination> -->
      </el-card>
    </el-row>

    <!-- 新增设备状态模态框 -->
    <el-dialog width="500px" title="新增设备状态" :visible.sync="addDeviceStatusIsShow" center>
      <el-form :model="addDeviceStatusData" :rules="rules_AddSparePartData" ref="dialog_addDeviceStatus" label-width="100px">
        <el-form-item label="状态名称" prop="status" required>
          <el-input style="width:300px;" v-model="addDeviceStatusData.status"></el-input>
        </el-form-item>
        <el-form-item label="状态描述" prop="description">
          <el-input style="width:300px;" v-model="addDeviceStatusData.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="类型状态" prop="enable" required>
          <el-radio-group v-model="addDeviceStatusData.enable">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <!-- 这里的点击事件没有抽离到methods里，目的是后面更方便地提取组件 -->
        <el-button
          @click="$refs.dialog_addDeviceStatus.resetFields(),addDeviceStatusIsShow=false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="$refs.dialog_addDeviceStatus.validate(validate=>validate&&addDeviceStatus())"
        >保存</el-button>
      </el-row>
    </el-dialog>

    <!-- 编辑设备状态模态框 -->
    <el-dialog width="500px" title="编辑设备状态" :visible.sync="editIsShow" center @close='$refs.dialog_edit.resetFields()'>
      <el-form :model="editData" :rules="rules_AddSparePartData" ref="dialog_edit" label-width="100px">
        <el-form-item label="状态名称" prop="status" required>
          <el-input style="width:300px;" v-model="editData.status"></el-input>
        </el-form-item>
        <el-form-item label="状态描述" prop="description">
          <el-input style="width:300px;" v-model="editData.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="类型状态" prop="enable" required>
          <el-radio-group v-model="editData.enable">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <!-- 这里的点击事件没有抽离到methods里，目的是后面更方便地提取组件 -->
        <el-button
          @click="$refs.dialog_edit.resetFields(),editIsShow=false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="$refs.dialog_edit.validate(validate=>validate&&saveEditData())"
        >保存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { queryDeviceStatus as getData, getDeviceStatusDetail, changeDeviceStatus,deviceStatusManage } from '../../lib/api/device';
import { tpmsHeader, tpmsTable } from '../../components';
import { EquipmentStatusManagement as buttomGroup } from './components/buttomGroups';
export default {
  data() {
    let statusList=[{label:'启用',id:true},{label:'禁用',id:false}];
    return {
      equipmentForm: {
        // 设备管理头部表单
        equipmentName: "", // 设备名称
        equipmentNumber: "", // 设备编号
        workshopSection: "", // 工位
        team: "", // 班组
        equipmentArea: "" // 区域
      },
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "状态名称", props: "status", value: "" },
        { label: "状态", props: "enable", value: "", type:'radio', checkList:statusList}
      ],
      equipmentTableData: [
        // 表格的数据
      ],
      equipmentTableList: [
        // 渲染表格的表头
         // { props: "id", label: "序号"},
        { props: "status", label: "状态名称" },
        { props: "description", label: "状态描述" },
        { props: "enable", label: "使用状态", translate:(value)=>value?'启用':'禁用' }
      ],
      currentPage: 1, //分页起 当前页
      pageSize: 10, //分页器 每页展示多少数据
      total: 7, //分页器 一共有多少条数据
      addDeviceStatusIsShow: false, //新增设备状态管理模态框
      addDeviceStatusData: {
        //新增设备状态管理模态框数据
        status:'',
        description:'',
        enable:true
      },
      rules_AddSparePartData: {
        //新增设备状态管理数据验证规则
        no:[
          { required: true, message: "请输入状态编号", trigger: "blur" }
        ],
        status:[
          { required: true, message: "请输入状态", trigger: "blur" }
        ]
      },
      editIsShow:false,//编辑设备 模态框
      editData:{
        status:'',
        description:'',
        enable:true
      },//编辑设备
    };
  },
  components:{
    tpmsHeader,buttomGroup,tpmsTable
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
      let pageData = this.$refs.tpmsTable.getData();
        getData({...data,...pageData}).then(res=>{
          console.log(res)
            this.total=res.data.totalElements;
            this.equipmentTableData=res.data.content;
        })
    },
    /** 新增设备状态 */
    addDeviceStatus() {
        console.log(this.editData)
        deviceStatusManage['add'](this.addDeviceStatusData).then(res=>{
          this.addDeviceStatusIsShow=false;
          this.$message.success('新增设备状态成功');
          this.editIsShow=false;
          this.getTableData();
        })
    },
    /** 编辑设备状态 */
    edit(row){
      this.editIsShow=true;
      this.editData={};
      getDeviceStatusDetail().then(res=>{
        this.editData=res.data.content[0];
      });
    },
    /** 点击 启用/禁用 按钮 */
    changeStatus(row){
      const data = {...row};
      data.enable = !data.enable;
      deviceStatusManage['edit'](data,data.id).then(res=>{
        this.$message.success(`${data.enable?'启用':'禁用'}成功`);
        this.getTableData();
      })
    },
    /** 保存编辑的设备状态 */
    saveEditData(){
      deviceStatusManage['edit'](this.editData,this.editData.id).then(res=>{
        this.$message.success('保存成功');
        this.editIsShow=false;
        this.getTableData();
      })
    },
    /** 清空还原数据 */
    clear(target) {
      if (Array.isArray(target)) {
        target.forEach(item => {
          Array.isArray(item.value) ? (item.value = []) : (item.value = "");
        });
      } else {
        for (let key in target) {
          target[key] = "";
        }
      }
    }
  }
};
</script>
