// 角色管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref='tpmsHeader' :formData='searchFormList' @inquireTableData='inquireTableData' />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button class="border-none" size="small">导出角色</el-button>
      <el-button class="button-more" type="primary" size="small" style="margin-right:29px" @click='addDialog()'>新增</el-button>
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

              <el-tree style="top: 8px;" ref="tree" lazy :load="loadChildren" :props="defaultProps" show-checkbox
                node-key="id" v-else-if="item.type==='tree'">
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
    roleManage,
    authManage
  } from "../../lib/api/workshopSettingsManage";
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
        parentId: null,
        tableLists: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        searchFormList: [
          //  渲染头部功能区的列表
          {
            label: "角色名称",
            props: "name",
            value: "",
            placeholder: '',
            type: 'input',
            checkList: []
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
            props: 'code',
            label: '角色编号'
          }, {
            props: 'name',
            label: '角色名称'
          },
          {
            props: 'enabled',
            label: '状态',
            translate: (value) => value ? '启用' : '禁用',
          },
        ],
        form: {
          code: '',
          name: '',
          enable: true,
          description: '',
          authorityValues: null,
        },
        formList: [{
            props: 'name',
            label: '角色名称',
            span: 12,
            type: 'input'
          },
          {
            props: 'code',
            label: '角色编号',
            span: 12,
            type: 'input'
          },
          {
            props: 'description',
            label: '角色描述',
            span: 24,
            type: 'textarea'
          },
          {
            props: 'enable',
            label: '角色状态',
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
            props: 'authorities',
            label: '角色数据权限',
            span: 24,
            type: 'tree'

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
        roleManage['getLists']({ ...data,
          ...pageData
        }).then(res => {
          this.tableLists = res.data.content
          this.total = this.tableLists.length
        })
      },
      loadChildren(node, resolve) {
        if (node.level === 0) {
          authManage['getRoot']().then(res => {
            let authLists = res.data
            return resolve(authLists);
          })
        } else {
          authManage['getParentChild']('', node.id).then(res => {
            let resultdata = res.data
            resolve(resultdata)
          })
        }
      },
      addDialog() {
        this.dialogVisible = true
        this.dialogTitleTxt = '新增'
        this.dialogType = 'add'
        if (this.$refs.tree) {
          this.$refs.tree[0].setCheckedKeys([])
        }
      },
      dialogClose() {
        this.dialogVisible = false
        if (this.$refs.tree) {
          this.$refs.tree[0].setCheckedKeys([])
        }
        this.form = {
          code: '',
          name: '',
          enable: true,
          description: '',
          authorityValues: null,
        }
      },
      editDialog(row) {
        var _self = this
        this.dialogVisible = true
        this.dialogTitleTxt = '编辑'
        this.dialogType = 'edit'
        this.form = deepClone(row)
        this.$nextTick(()=>{
          this.$refs.tree[0].setCheckedKeys(this.form.authorityValues.split(','))
        })
      },
      ok(dialogType) {
        var _self = this
        let authoritiesNode = _self.$refs.tree[0].getCheckedKeys()
        this.form.authorityValues = authoritiesNode.join(',')
        roleManage[dialogType](this.form, this.form.id).then(res => {
          this.dialogVisible = false
          this.getTableData();
          this.form = {
            code: '',
            name: '',
            enable: true,
            description: '',
            authorityValues: null,
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
