// 工厂管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button type="primary" size="small" @click='addDialog()'>新增</el-button>
      </el-row>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table ref='tpmsTable' :lazy='lazy' :load='lazyLoad' :row-key="rowKey" :data='tableLists' :columns='tableHeaderList'
        :total='total' :column_index='false' @inquireTableData='inquireTableData'>
        <template slot-scope="{row}" >
          <div v-if='!row.chejian'>
            <span class="button" @click="editDialog(row)">编辑</span>
            <span class="button" @click="lookDialog(row)">查看</span>
            <span v-if='!row.chejian' class="button" @click="addWorkShopDialog(row)">新增车间</span>
          </div>
          <div v-else-if="row.chejian=='chejian'">
            <span class="button" @click="editworkshopDialog(row)">编辑</span>
            <span class="button" @click="lookworkshopDialog(row)">查看</span>
          </div>
          <div v-else-if="row.chejian=='chejianTou'">
            <span>操作</span>
          </div>
        </template>
      </tpms-table>
    </el-row>
    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible" :before-close='dialogClose'>
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px" label-position="right">
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item :prop="item.props" :label="item.label" :label-width="item.labelWidth" style="width: 100%;">
              <el-select v-model="form[item.props]" v-if="item.type==='checkbox'" :filterable="item.filterable" :placeholder="item.placeholder" @change='item.change'>
                <el-option v-for="(item,i) in item.checkList" :key="i" :label="item.key" :value="item.value"></el-option>
              </el-select>
              <el-input v-model="form[item.props]" v-else-if="item.type==='textarea'" :rows='item.rows' :type='item.type' />
              <el-radio v-model="form[item.props]" v-else-if="item.type==='radio'" :label='radio.id' v-for="(radio,i) in item.radioList"
                :key="i">
                {{radio.label}}
              </el-radio>
              <el-input v-model="form[item.props]" v-else />
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
           <el-form-item label="负责人工号" label-width="135px"  style="width: 100%;">
             <el-input v-model="managerworkNo"  disabled='disabled'/>
           </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="ok(dialogType)" v-if='!lookDetail'>确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="workshopdialogTitleTxt" :visible.sync="workshopdialogVisible" >
      <el-form ref="workshopruleForm" :rules="workshoprules" :model="workShopForm" label-width="120px" label-position="right">
        <el-row>
          <el-col :span="24">
             <el-form-item label="所属工厂"   style="width: 100%;">
               <el-input v-model="factoryName"  disabled='disabled'/>
             </el-form-item>
          </el-col>
          <el-col :span="item.span" v-for="(item,index) in workShopFormList" :key="index">
            <el-form-item :prop="item.props" :label="item.label" :label-width="item.labelWidth" style="width: 100%;">
              <el-select v-model="workShopForm[item.props]" v-if="item.type==='checkbox'" :filterable="item.filterable" :placeholder="item.placeholder" @change='item.change'>
                <el-option v-for="(item,i) in item.checkList" :key="i" :label="item.key" :value="item.value"></el-option>
              </el-select>
              <el-input v-model="workShopForm[item.props]" v-else-if="item.type==='textarea'" :rows='item.rows' :type='item.type' />
              <el-radio v-model="workShopForm[item.props]" v-else-if="item.type==='radio'" :label='radio.id' v-for="(radio,i) in item.radioList"
                :key="i">
                {{radio.label}}
              </el-radio>
              <el-input v-model="workShopForm[item.props]" v-else />
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
           <el-form-item label="负责人工号" label-width="135px"  style="width: 100%;">
             <el-input v-model="managerworkNo"  disabled='disabled'/>
           </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer" >
        <el-button @click="workshopdialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="addWorkShop(dialogType)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    tpmsHeader,
    tpmsTable
  } from '../../components';
  import {
    factoryManage,
    workshopManage
  } from "../../lib/api/workshopSettingsManage";
  import {
    getUserLists
  } from "../../lib/api/userManage";
  import { deepClone } from '@/utils'
  export default {
    data() {
      return {
        dialogVisible: false,
        workshopdialogVisible:false,
        dialogTitleTxt: '',
        workshopdialogTitleTxt:'',
        dialogType: '',
        total: 0,
        load: 'lazyLoad',
        rowKey: "id",
        lazy: 'lazy',
        managerworkNo:null,
        userLists:[],
        lookDetail:false,
        form: {
          "address": "",
          "description": "",
          "managerId": null,
          "name": "",
          "no": ""
        },
        formList: [{
            props: 'name',
            label: '工厂名称',
            span: 12,
            type: 'input'
          },
          {
            props: 'no',
            label: '工厂简称/代号',
            span: 12,
            type: 'input'
          },
          {
            props: 'address',
            label: '工厂地址',
            span: 24,
            type: 'input'
          },
          {
            props: 'description',
            label: '工厂描述',
            span: 24,
            type: 'textarea',
            rows: 5
          },
        ],
        factoryName:null,
        workShopForm:{
          "factoryId": null,
          "description": "",
          "managerId": null,
          "name": "",
          "no": "",
          "enable": true
        },
        workShopFormList: [{
            props: 'name',
            label: '车间名称',
            span: 12,
            type: 'input'
          },
          {
            props: 'no',
            label: '车间简称/代号',
            span: 12,
            type: 'input'
          },
          {
            props: 'enable',
            label: '状态',
            span: 24,
            type: 'radio',
            radioList: [{
              label: '启用',
              id: true
            }, {
              label: '禁用',
              id: false
            }]
          },
          {
            props: 'description',
            label: '车间描述',
            span: 24,
            type: 'textarea',
            rows: 5
          },
        ],

        tableLists: [],
        tableHeaderList: [{
            props: 'id',
            label: 'No.'
          },
          {
            props: 'no',
            label: '工厂编号'
          }, {
            props: 'name',
            label: '工厂名称'
          },
          {
            props: 'description',
            label: '工厂描述'
          },
          {
            props: 'managerName',
            label: '工厂负责人'
          }
        ],
        rules: {
          name: [{
            required: true,
            message: '请输入工厂名称',
            trigger: 'blur'
          }, ],
          no: [{
            required: true,
            message: '请输入工厂编号',
            trigger: 'blur'
          }, ],
          address:[{
            required: true,
            message: '请输入工厂名称',
            trigger: 'blur'
          }],
          managerId: [{
            required: true,
            message: '请选择工厂负责人',
            trigger: 'change'
          }]

        },
        workshoprules: {
          name: [{
            required: true,
            message: '请输入车间名称',
            trigger: 'blur'
          }, ],
          no: [{
            required: true,
            message: '请输入车间编号',
            trigger: 'blur'
          }, ],
          managerId: [{
            required: true,
            message: '请选择工厂负责人',
            trigger: 'change'
          }]
        }
      }
    },
    components: {
      tpmsHeader,
      tpmsTable
    },
    mounted() {
      this.getTableData()
      let _self=this
      getUserLists().then(res => {
        let userLists=[];

        res.data.content.forEach((val)=>{
          userLists.push({key:val.name+' '+val.email,value:val.id,workNo:val.workNo})
        })
        this.userLists=userLists
        this.formList.push({
            props: 'managerId',
            label: '工厂负责人',
            span: 24,
            type: 'checkbox',
            filterable:true,
            checkList:userLists,
            change(result){
              let workNo=userLists.filter((wk)=>{return wk.value==result})
              _self.managerworkNo=workNo[0].workNo
            }
          })
         this.workShopFormList.push({
            props: 'managerId',
            label: '工厂负责人',
            span: 24,
            type: 'checkbox',
            filterable:true,
            checkList:userLists,
            change(result){
              let workNo=userLists.filter((wk)=>{return wk.value==result})
              _self.managerworkNo=workNo[0].workNo
            }
          })

      })
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
        let pageData = this.$refs.tpmsTable.getData();
        factoryManage['getLists']({
          ...pageData
        }).then(res => {
          this.tableLists = res.data.content
          this.tableLists.forEach(val => {
            val.hasChildren = true
          })
          this.total = this.tableLists.length
        })
      },
      addDialog() {
        this.dialogVisible = true
        this.dialogTitleTxt = '新增'
        this.dialogType = 'add'
        this.lookDetail=false
      },
      editDialog(row){
        factoryManage['getOne']('',row.id).then(res => {
          this.form=res.data
          let workNo=this.userLists.filter((wk)=>{return wk.value==row.id})
          this.managerworkNo=workNo[0].workNo
          this.dialogVisible = true
          this.dialogTitleTxt = '编辑车间'
          this.dialogType='edit'
          this.lookDetail=false
        })
      },
      editworkshopDialog(row){
        workshopManage['getOne']('',row.id).then(res => {
          this.workShopForm=res.data
          let workNo=this.userLists.filter((wk)=>{return wk.value==row.id})
          this.managerworkNo=workNo[0].workNo
          this.workshopdialogVisible = true
          this.workshopdialogTitleTxt = '查看车间'
          this.dialogType='edit'
          this.lookDetail=false
        })
      },
      lookworkshopDialog(row){
        workshopManage['getOne']('',row.id).then(res => {
          this.workShopForm=res.data
          let workNo=this.userLists.filter((wk)=>{return wk.value==row.id})
          this.managerworkNo=workNo[0].workNo
          this.workshopdialogVisible = true
          this.workshopdialogTitleTxt = '编辑'
          this.dialogType='edit'
          this.lookDetail=true
        })
      },
      lookDialog(row){
        factoryManage['getOne']('',row.id).then(res => {
          this.form=res.data
          let workNo=this.userLists.filter((wk)=>{return wk.value==row.id})
          this.managerworkNo=workNo[0].workNo
          this.dialogVisible = true
          this.dialogTitleTxt = '查看'
          this.dialogType='edit'
          this.lookDetail=true
        })
      },
      lazyLoad(tree, treeNode, resolve) {
          workshopManage['getLists']({
            factoryId:tree.id
          }).then(res=>{
            let chejian=res.data.content;
            chejian.forEach(val=>{
              val['chejian']='chejian'
            })
            chejian.unshift({
              id:'NO.',
              name:'车间名称',
              no:'车间编号',
              description:'车间描述',
              managerName:'车间负责人',
              chejian:'chejianTou'
            })
            resolve(chejian)
          })
      },
      ok(dialogType) {
        var _self = this
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            factoryManage[dialogType](this.form,this.form.id).then(res => {
              this.dialogVisible = false
              this.getTableData();
              this.form = {
              "address": "",
              "description": "",
              "managerId": null,
              "name": "",
              "no": ""
              }
            })
          }else{
            return false
          }})
      },
      addWorkShopDialog(row){
        this.workshopdialogVisible=true
        this.factoryName=row.name
        this.workShopForm.factoryId=row.id;
        this.workshopdialogTitleTxt = '新增车间'
        this.dialogType = 'add'
      },
      addWorkShop(dialogType){
        this.$refs['workshopruleForm'].validate((valid) => {
          if (valid) {
            workshopManage[dialogType](this.workShopForm,this.workShopForm.id).then(res=>{
              this.workshopdialogVisible = false
              this.getTableData();
              this.workShopForm = {
              "factoryId": null,
              "description": "",
              "managerId": null,
              "name": "",
              "no": "",
              "enable": true
              }
            })
          }else{
            return false
          }})


      },


      dialogClose() {
        this.dialogVisible = false
        this.form = {
        "address": "",
        "description": "",
        "managerId": null,
        "name": "",
        "no": ""
        }
        this.managerworkNo=null
        this.lookDetail=false
      }

    }
  };
</script>

<style>
  .add-drawer {
    margin-top: 0.8rem;
  }
</style>
