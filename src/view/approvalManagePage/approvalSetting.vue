// 审批管理
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
          <span class="button" @click="remove(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>


    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible" :before-close='dialogClose' width="80%" center>
      <el-form :model="form" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item :label="item.label" :label-width="item.labelWidth" style="width: 100%;">
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
      <el-row>
        <!-- 底部表格 -->
        <tpms-table ref='tpmsTable' :total='total' :data='form.nodes' :columns='tableNodeHeaderList' :column_index='false'
          @inquireTableData='inquireTableData'>
          <template slot-scope="{row}">
            <span class="button" @click="removeNodeDialog(row)">删除</span>
          </template>
          <template slot-scope="{row}">
            <span class="button" @click="editNodeDialog(row)">编辑</span>
          </template>
        </tpms-table>
      </el-row>


      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="ok(dialogType)">保存</el-button>
        <el-button type="primary" @click="addNodeDialog()">新增节点</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitleTxt" :visible.sync="nodeDialogVisible" center>
      <el-form :model="nodeForm" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in nodeFormList" :key="index">
            <el-form-item :label="item.label" :label-width="item.labelWidth" style="width: 100%;">
              <el-select v-model="nodeForm[item.props]" v-if="item.type==='checkbox'" :placeholder="item.placeholder">
                <el-option v-for="(item,i) in item.checkList" :key="i" :label="item.key" :value="item.value"></el-option>
              </el-select>
              <el-input v-model="nodeForm[item.props]" v-else-if="item.type==='textarea'" :rows='item.rows' :type='item.type' />
              <el-radio v-model="nodeForm[item.props]" v-else-if="item.type==='radio'" :label='radio.id' v-for="(radio,i) in item.radioList"
                :key="i">
                {{radio.label}}
              </el-radio>
              <el-tree style="top: 8px;" :data="item.treedata" show-checkbox node-key="id" v-else-if="item.type==='tree'">
              </el-tree>
              <el-input v-model="nodeForm[item.props]" v-else />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="nodeDialogVisible = false">取 消</el-button>
        <el-button @click="okNode(dialogType)">保存</el-button>
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
    workflowManage,
    workflowNodeManage
  } from "../../lib/api/approvalManage.js";
  import {
    deepClone
  } from '@/utils'
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
        nodeDialogVisible: false,
        tableLists: [],
        searchFormList: [
          //  渲染头部功能区的列表
          {
            label: "审批流名称",
            labelWidth: '120px',
            props: "name",
            value: "",
            placeholder: '',
            type: 'input',
          },
          {
            label: "模块",
            props: "module",
            value: "",
            placeholder: '',
            type: 'checkbox',
            checkList: []
          },
          {
            label: "应用",
            props: "application",
            value: "",
            placeholder: '请选择应用',
            type: 'checkbox',
            checkList: []
          },
        ],
        tableHeaderList: [{
            props: 'id',
            label: 'No.'
          },
          {
            props: 'name',
            label: '审批流名称'
          }, {
            props: 'module',
            label: '模块'
          },
          {
            props: 'application',
            label: '应用'
          },
        ],
        tableNodeHeaderList: [{
            props: 'id',
            label: 'No.'
          },
          {
            props: 'name',
            label: '节点名称'
          },
          {
            props: 'prev',
            label: '上级节点',
            translate:(value) => value ? value.name : '无'
          },
          {
            props: 'approvalType',
            label: '节点类型',
            translate: (value) => {
              switch (value) {
                case 1:
                  return '发起人自己'
                  break;
                case 2:
                  return '指定成员'
                  break;
                case 4:
                  return '指定岗位'
                  break;
                case 8:
                  return '主管'
                  break;
              }
            }
          },

        ],
        nodeTableHeaderList: [{
            props: 'id',
            label: 'No.'
          },
          {
            props: 'name',
            label: '审批流名称'
          }, {
            props: 'module',
            label: '模块'
          },
          {
            props: 'application',
            label: '应用'
          },
        ],


        form: {
          "application": "",
          "code": "",
          "comment": "",
          "enable": true,
          "module": "",
          "name": "",
          "opinionRequired": true,
          "selfAutoApprove": true,
          "whoCanLaunch": 1,
          nodes: []
        },
        nodeForm: {
          "approvalType": null,
          "name": "",
          "sort": 0,
          prev: null
        },
        nodeFormList: [{
            props: 'name',
            label: '节点名称',
            span: 24,
            type: 'input'
          },
          {
              props: 'name',
              label: '上级节点',
              span: 24,
              type: 'input'
            },
          {
            props: 'approvalType',
            label: '审批类型',
            span: 24,
            type: 'radio',
            radioList: [{
              label: '发起人自己',
              id: 1
            }, {
              label: '指定成员',
              id: 2
            }, {
              label: '指定岗位',
              id: 4
            }, {
              label: '主管',
              id: 8
            }]
          },
        ],
        formList: [{
            props: 'name',
            label: '审批流名称',
            span: 24,
            type: 'input'
          },
          {
            props: 'module',
            label: '所属模块',
            span: 12,
            type: 'checkbox',
            checkList: [{
              key: '审批列表',
              value: '审批列表'
            }, {
              key: '专家智库',
              value: '专家智库'
            }]
          },
          {
            props: 'application',
            label: '所属应用',
            span: 12,
            type: 'checkbox',
            checkList: [{
              key: '工厂基础设置',
              value: '工厂基础设置'
            }, {
              key: '设备管理',
              value: '设备管理'
            }]
          }
        ]
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
        workflowManage['getLists']({ ...data,
          ...pageData
        }).then(res => {
          this.tableLists = res.data.content
          this.total=res.data.totalElements
        })
      },
      ok(dialogType) {
        var _self = this
        workflowManage[dialogType](this.form, this.form.uuid).then(res => {
          this.dialogVisible = false
          this.parentId = null
          this.getTableData();
        })
      },
      okNode() {
        this.form.nodes.push(this.nodeForm)
        this.nodeDialogVisible = false
      },
      remove(row) {
        workflowManage['remove'](',', row.uuid).then(res => {
          this.getTableData();
        })
      },
      addDialog() {
        this.dialogVisible = true
        this.dialogTitleTxt = '新增'
        this.dialogType = 'add'

      },
      addNodeDialog() {
        this.nodeDialogVisible = true
      },
      editNodeDialog(row){
        this.nodeDialogVisible = true
        this.nodeForm=deepClone(row)
      },
      editDialog(row) {
        workflowManage['getOne'](',', row.id).then(res => {
          this.form = res.data;
          this.dialogVisible = true
          this.dialogTitleTxt = '编辑'
          this.dialogType = 'edit'
          console.log(res.data)
        })
      },
      dialogClose() {
        this.dialogVisible = false
      }

    }
  };
</script>

<style>
  .add-drawer {
    margin-top: 0.8rem;
  }
</style>
