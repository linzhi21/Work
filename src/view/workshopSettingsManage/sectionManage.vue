// 工段管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref='tpmsHeader' :formData='searchFormList' @inquireTableData='inquireTableData' @onValueChanged="onValueChanged" />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button class="button-more" type="primary" size="small" @click='addDialog()'>新增</el-button>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table ref='tpmsTable' :total='total' :data='tableLists' :columns='tableHeaderList' :column_index='true'
        @inquireTableData='inquireTableData'
         @getTableData="getTableData"
        >
        <template slot="operation" slot-scope="{row}">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
           <span class="button cursor" @click="del(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>


    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible" :before-close='dialogClose'>
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px" label-position="right">
        <el-row>
          <el-col  :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item  :prop="item.props" :label="item.label" :label-width="item.labelWidth" style="width: 100%;">
              <el-select class="dialog-select" v-model="form[item.props]" v-if="item.type==='checkbox'" :placeholder="item.placeholder" @change="(val)=>selectChanged(item.props,val)">
                <el-option v-for="(item,i) in item.checkList" :key="i" :label="item.label" :value="item.id"></el-option>
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
    workshopManage,
    workshopAreaManage
  } from "../../lib/api/workshopSettingsManage";
  export default {
    data() {
      // 状态下拉
      const statusList = [
        { label: '启用', id: true },
        { label: '禁用', id: false }
      ];

      // 车间下拉
      const workshopList =[];
      workshopManage.getNames().then(res=>{
        workshopList.push(...res.data);
      });

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
          { label: "工段编号", props: "no", value: "" },
          { label: "工段名称", props: "name", value: "" },
          { label: "状态", props: "enable", value: "", type: 'radio', checkList: statusList },
          { label: "车间", props: "workshopId", value: "", type: 'radio', checkList: workshopList },
          { label: "区域", props: "workshopAreaId", value: "", type: 'radio', checkList: [] },
        ],
        tableHeaderList: [
          {
            props: 'workshopName',
            label: '所属车间'
          },
          {
            props: 'workshopAreaName',
            label: '所属区域'
          },
          {
            props: 'no',
            label: '工段编号'
          }, {
            props: 'name',
            label: '工段名称'
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
          {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "120px",
        }
        ],
        form: {
          no: '',
          name: '',
          description: '',
          workshopId: null,
          workshopAreaId:null,
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
            props: 'workshopId',
            label: '所属车间',
            span: 12,
            type: 'checkbox',
            checkList: workshopList
          },
          {
            props: 'workshopAreaId',
            label: '所属区域',
            span: 12,
            type: 'checkbox',
            checkList: []
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
      })
    },
    methods: {
      /**删除**/
      del(row) {
        this.$confirm('确定是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row)
          workshopSectionManage.remove(row.id).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTableData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
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
		  // console.log(res)
      this.total=res.data.totalElements
          this.tableLists = res.data.content
        })
      },
      /** 头部value变更回调 */
      onValueChanged({props, value}) {
        const { searchFormList } = this;
        if(props === 'workshopId'){
          // 选择车间，重置区域
          workshopAreaManage.getNames({[props]: value}).then(res => {
            searchFormList.forEach(item => {
              if(item.props === 'workshopAreaId'){
                item.checkList = res.data;
                item.value = '';
                return;
              };
            })
          });
        };
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
          // 区域回显
          if(res.data.workshopId){
            workshopAreaManage.getNames({workshopId: res.data.workshopId}).then(res => {
              this.formList.forEach(item => {
                if(item.props === 'workshopAreaId') {
                  item.checkList = res.data;
                }
              })
            })
          }
        })
      },
      /** 新增|编辑 车间和区域之间的联动 */
      selectChanged(props, val){
        if(props === 'workshopId') {
          workshopAreaManage.getNames({[props]: val}).then(res => {
            this.formList.forEach(item => {
              if(item.props === 'workshopAreaId') {
                item.checkList = res.data;
                this.form[item.props] = '';
              }
            })
          })
        }
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
              this.$message.success('操作成功')
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
  .dialog-select {
    width: 100%;
  }
</style>
