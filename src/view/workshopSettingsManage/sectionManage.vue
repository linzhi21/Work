// 工段管理
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
      <tpms-table ref='tpmsTable' :total='total' :data='tableLists' :columns='tableHeaderList' :column_index='false'
        @inquireTableData='inquireTableData'>
        <template slot-scope="{row}">
          <span class="button" @click="editDialog(row)">编辑</span>
        </template>
      </tpms-table>
    </el-row>


    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible" :before-close='dialogClose'>
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item :prop="item.props" :label="item.label" :label-width="item.labelWidth" style="width: 100%;">
              <el-select v-model="form[item.props]" v-if="item.type==='checkbox'" :placeholder="item.placeholder">
                <el-option v-for="(item,i) in item.checkList" :key="i" :label="item.key" :value="item.value"></el-option>
              </el-select>
              <el-input v-model="form[item.props]" v-else-if="item.type==='textarea'" :rows='item.rows' :type='item.type' />
              <el-radio v-model="form[item.props]" v-else-if="item.type==='radio'" :label='radio.id' v-for="(radio,i) in item.radioList"
                :key="i">
                {{radio.label}}
              </el-radio>

              <el-tree style="top: 8px;" :data="item.treedata" show-checkbox node-key="id" v-else-if="item.type==='tree'">
              </el-tree>

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
    workshopSectionManage,
    workshopManage
  } from "../../lib/api/workshopSettingsManage";
  export default {
    data() {
      return {
        dialogVisible: false,
        dialogTitleTxt: '',
        dialogType: '',
        total: 0,
        load: 'lazyLoad',
        rowKey: "id",
        lazy: 'lazy',
        parentId: null,
        tableLists: [],
        searchFormList: [
          //  渲染头部功能区的列表
          {
            label: "编号",
            props: "no",
            value: "",
            placeholder: '',
            type: 'input',
          },
          {
            label: "工段名称",
            props: "name",
            value: "",
            placeholder: '',
            type: 'input',
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
            label: 'No.'
          },
          {
            props: 'workshopName',
            label: '所属车间'
          },
          {
            props: 'no',
            label: '工段编号'
          }, {
            props: 'name',
            label: '工段'
          },
          {
            props: 'description',
            label: '工段描述'
          },

          {
            props: 'enable',
            label: '状态',
            translate: (value) => value ? '启用' : '禁用'
          },
        ],
        form: {
          no: '',
          name: '',
          description: '',
          workshopId: null,
          enable: true
        },
        formList: [
          {
            props: 'name',
            label: '工段',
            span: 12,
            type: 'input'
          },
          {
            props: 'no',
            label: '工段编号',
            span: 12,
            type: 'input'
          },
          {
            props: 'description',
            label: '工段描述',
            span: 24,
            type: 'textarea'
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
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }, ],
          no: [{
            required: true,
            message: '请输入编号',
            trigger: 'blur'
          }, ],
          enable: [{
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }],
          workshopId: [{
            required: true,
            message: '请选择所属车间',
            trigger: 'change'
          }],
          parentId: [{
            required: true,
            message: '请选择上级区域',
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
      workshopManage['getLists']().then(res => {
        let workshopLists = [];
        res.data.content.forEach((val) => {
          workshopLists.push({
            key: val.name,
            value: val.id
          })
        })
        // this.workshopLists=workshopLists
        this.formList.splice(2,0,{
          props: 'workshopId',
          label: '所属车间',
          span: 24,
          type: 'checkbox',
          filterable: true,
          checkList: workshopLists
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
        let data = this.$refs.tpmsHeader.getData();
        let pageData = this.$refs.tpmsTable.getData();
        workshopSectionManage['getLists']({ ...data,
          ...pageData
        }).then(res => {
          this.tableLists = res.data.content
        })
      },
      addDialog() {
        this.dialogVisible = true
        this.dialogTitleTxt = '新增'
        this.dialogType = 'add'
      },
      editDialog(row){
        workshopSectionManage['getOne']('',row.id).then(res => {
          this.form=res.data
          this.dialogVisible = true
          this.dialogTitleTxt = '编辑'
          this.dialogType='edit'
        })
      },
      dialogClose() {
        this.dialogVisible = false
        this.form = {
          no: '',
          name: '',
          description: '',
          workshopId: null,
          enable: true
        }
      },
      ok(dialogType) {
        var _self = this
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            workshopSectionManage[dialogType](this.form, this.form.id).then(res => {
              this.dialogVisible = false
              this.getTableData();
              this.form = {
                no: '',
                name: '',
                description: '',
                workshopId: null,
                enable: true
              }
            })
          } else {
            return false;
          }
        });
        
      }

    }
  };
</script>

<style>
  .add-drawer {
    margin-top: 0.8rem;
  }
</style>
