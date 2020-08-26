// 数据字典管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref='tpmsHeader' :formData='searchFormList' @inquireTableData='inquireTableData' />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button class="button-more" type="primary" size="small" style="margin-right:45px" @click='addDialog()'>新增</el-button>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table ref='tpmsTable' :data='tableLists' :columns='tableHeaderList' :total='total' :column_index='false'
        @inquireTableData='inquireTableData'>
        <template slot-scope="{row}">
          <span class="button" @click="editDialog(row)">编辑</span>
          <span class="button" @click="change(row)">{{row.enable?'禁用':'启用'}}</span>
        </template>
      </tpms-table>
    </el-row>
    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible">
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item :prop="item.props"  :label="item.label" :label-width="item.labelWidth" style="width: 100%;">
              <el-select v-model="form[item.props]" v-if="item.type==='checkbox'" :placeholder="item.placeholder">
                <el-option  v-for="(item,i) in item.checkList" :key="i" :label="item.label" :value="item.id"></el-option>
              </el-select>
              <el-input v-model="form[item.props]" v-else-if="item.type==='textarea'" :rows='item.rows' :type='item.type' />
              <el-radio v-model="form[item.props]" v-else-if="item.type==='radio'" :label='radio.id' v-for="(radio,i) in item.radioList" :key="i">
                {{radio.label}}
              </el-radio>
              <el-input v-model="form[item.props]" v-else />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok(dialogType)">确 定</el-button>
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
    sysConfigManage
  } from "../../lib/api/workshopSettingsManage";
  import { deepClone } from '@/utils'
  export default {
    data() {
      return {
        dialogVisible: false,
        dialogTitleTxt: '',
        dialogType:'',
        total: 0,
        form: {
          functionalDes: '',
          functionalCode:'',
          enable:true,
          key:'',
          value:''
        },
        formList: [{
            props: 'key',
            label: '编号',
            span: 24,
            type: 'input'
          },
          {
            props: 'functionalCode',
            label: '字段类型',
            span: 24,
            type: 'checkbox',
            checkList: [{
              label: '类型1',
              id: 1
            }, {
              label: '类型2',
              id: 2
            }]
          },
          {
            props: 'value',
            label: '字段名称',
            translate: (value) => value == 1 ? '男' : '女',
            span: 24,
            type: 'input'
          },
          {
            props: 'functionalDes',
            label: '字段描述',
            span: 24,
            type: 'textarea',
            rows: 5
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
        ],
        tableLists: [],
        searchFormList: [
          //  渲染头部功能区的列表
          {
            label: "类型",
            labelWidth: '120px',
            props: "functionalCode",
            value: "",
            placeholder: '请选择类型',
            type: 'radio',
            checkList: [{
              label: '类型1',
              id: 1
            }, {
              label: '类型2',
              id: 2
            }]
          },
          {
            label: "状态",
            props: "enable",
            value: "",
            placeholder: '请选择状态',
            type: 'radio',
            checkList: [{
              label: '启用',
              id: true
            }, {
              label: '禁用',
              id: false
            }]
          },
        ],
        tableHeaderList: [{
            props: 'id',
            label: '序号'
          },
          {
            props: 'functionalCode',
            label: '功能编号'
          },
          {
            props: 'key',
            label: '键'
          },
          {
            props: 'value',
            label: '值'
          },
          {
            props: 'functionalDes',
            label: '字段描述'
          },
          {
            props: 'enable',
            label: '是否禁用',
            translate: (value) => value ? '启用' : '禁用',
          },
        ],
        rules: {
          key: [{
            required: true,
            message: '请输入编号',
            trigger: 'blur'
          }, ],
          value: [{
            required: true,
            message: '请输入字段名称',
            trigger: 'blur'
          }, ],
          enable: [{
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }],
          functionalCode: [{
            required: true,
            message: '请选择类型',
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
        sysConfigManage['getLists']({ ...data,
          ...pageData
        }).then(res => {
          this.tableLists = res.data.content
          this.total = res.data.content.length
        })
      },
      addDialog() {
        this.dialogVisible = true
        this.dialogTitleTxt = '新增'
        this.dialogType='add'
      },
      editDialog(row){
        this.dialogVisible = true
        this.dialogTitleTxt = '编辑'
        this.dialogType='edit'
        this.form = deepClone(row)
      },
      ok(dialogType){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            sysConfigManage[dialogType](this.form,this.form.id).then(res=>{
              this.dialogVisible = false
              this.getTableData();
              this.form={
                  functionalDes: '',
                  functionalCode:'',
                  enable:true,
                  key:'',
                  value:''
                }
            })
          } else {
            return false;
          }
        });

      },
      change(row){
          this.form = deepClone(row);
          this.form.enable=!this.form.enable;
          sysConfigManage['edit'](this.form,this.form.id).then(res=>{
            this.getTableData();
            this.form={
                functionalDes: '',
                functionalCode:'',
                enable:true,
                key:'',
                value:''
              }
          })
      }
    }
  };
</script>

<style>
  .add-drawer {
    margin-top: 0.8rem;
  }
</style>
