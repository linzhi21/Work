// BOM关联备件
<template>
  <el-row class="root">
    <el-card>
      <el-row type="flex" align="middle">
        <span>BOM关联备件设置：</span>
        <el-switch v-model="enable" active-color="#84BD00" inactive-color="#CB333B" @change='beforeChange' />
        &nbsp;&nbsp;&nbsp;{{enable?'开':'关'}}
      </el-row>
      <el-row>
          <div class="tips">*注：开启后维修员替换设备备件时，验证备件是否存在于设备BOM表单/通用备件库中，如果不存在，新增一条异常领用记录。</div>
      </el-row>
      <el-row>
        <h3>BOM开关历史记录</h3>
        <tpmsTable
        :column_index="true"
          ref='tpmsTable'
          :data='bomHistory'
          :total='total'
          @inquireTableData='inquireTableData'
           @getTableData="getBomHistory"
          :columns="[
            {props:'bomSwitch',label:'操作状态',translate:val=>val?'关->开':'开->关'},
            {props:'creatorName',label:'操作人'},
            {props:'reason',label:'操作原因'},
            {props:'createDate',label:'操作时间'},
          ]"
        />
      </el-row>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px"
      @close='$refs.form.resetFields(),getEnableBom()'
    >
      <span>请确认是否要对BOM开关进行开启/关闭操作</span>
      <el-form ref="form" :model="formData" label-width='80px' style="margin-top:30px;">
        <el-form-item label="操作原因" prop='bomReason' :rules="[{ required: true, message: '请输入操作原因', trigger: 'blur' },]">
          <el-input type="textarea" v-model="formData.bomReason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false, $refs.form.resetFields()">取 消</el-button>
        <el-button type="primary" @click="$refs.form.validate(validate=>validate&&change())">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
import {principal} from "../../lib/api/user";
import {
    workshopManage
  } from "../../lib/api/workshopSettingsManage";
import { tpmsTable } from '../../components';
export default {
  data() {
    return {
        enable:true,
        id:'',
        dialogVisible:false,
        formData:{bomReason:''},
        bomHistory:[],
        total:0,
        userInfo:null
    };
  },
  components:{
    tpmsTable
  },
  mounted(){
    principal().then(res=>{
      this.userInfo=res
      this.getEnableBom();
      this.getBomHistory();
    })


  },
  methods: {
    inquireTableData() {
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getBomHistory();
    },
    /** 获取BOM备件状态开关 */
    getEnableBom(){
      workshopManage['getBom']('',this.userInfo.principal.workshopId).then(res => {
        this.enable = res.data
      })
    },
    /** 加载BOM开关历史记录 */
    getBomHistory(){
      workshopManage['getBomHistory']('',this.userInfo.principal.workshopId).then(res => {
        this.bomHistory=res.data.content;
        console.log(res)
        this.total=res.data.totalElements
      })
    },
    /** 改变BOM备件开关之前 */
    beforeChange(){
      this.dialogVisible=true;
    },
    /** 改变BOM备件开关 */
    change(){
      console.log({bomSwitch:this.enable,bomReason:this.formData.bomReason})
        workshopManage['edit']({bomSwitch:this.enable,bomReason:this.formData.bomReason},this.userInfo.principal.workshopId).then(res=>{
          this.dialogVisible=false;
          this.getBomHistory();
          this.$message.success('操作成功');
        }).catch(res=>{
          this.dialogVisible=false;
          this.getBomHistory();
          this.$message.enable('操作失败');
        })
    }
  }
};
</script>
<style lang="scss" scoped>
.root{
    > div:first-child{
        padding-top: 30px;
    }
    .tips{
        width: 370px;
        font-size: 14px;
    }
}
</style>
