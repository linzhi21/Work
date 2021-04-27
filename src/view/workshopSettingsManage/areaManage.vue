// 区域管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref='tpmsHeader' :formData='searchFormList' @inquireTableData='inquireTableData' />
    </el-row>
    <el-row>
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button class="button-more" type="primary" size="small" @click='addDialog()'>新增</el-button>
      </el-row>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table ref='tpmsTable' :total='total' :data='tableLists' :columns='tableHeaderList' :column_index='true'
        @inquireTableData='inquireTableData' @getTableData='getTableData'>
        <template slot="operation" slot-scope="{row}">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
           <span class="button cursor" @click="del(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>
    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible" :before-close='dialogClose'>
      <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item :prop="item.props" :label="item.label" :label-width="item.labelWidth" style="width: 100%;"
              :required="item.required">
              <el-select v-model="form[item.props]" v-if="item.type==='checkbox'" :placeholder="item.placeholder">
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
    workshopAreaManage,
    workshopManage
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
          { label: "区域名称", props: "name", value: "" },
          { label: "状态", props: "enable", value: "", type: 'radio', checkList: statusList },
          { label: "车间", props: "workshopId", value: "", type: 'radio', checkList: workshopList },
        ],
        tableHeaderList: [
          {
            props: 'workshopName',
            label: '所属车间'
          },
          {
            props: 'primaryArea',
            label: '一级区域'
          },
          {
            props: 'secondaryArea',
            label: '二级区域'
          },
          {
            props: 'tertiaryArea',
            label: '三级区域'
          },
          {
            props: 'description',
            label: '区域描述'
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
          width: "200px",
        }
        ],
        form: {
          no: '',
          name: '',
          isChooseParent:true,
          description: '',
          parentId: null,
          workshopId: null,
          enable: true
        },
        formList: [{
            props: 'name',
            label: '区域名称',
            span: 12,
            type: 'input',
          },
          {
            props: 'no',
            label: '区域编号',
            span: 12,
            type: 'input',
          },
          {
            props: 'description',
            label: '区域描述',
            span: 24,
            type: 'textarea',
          },
          {
            props: 'enable',
            label: '区域状态',
            span: 24,
            type: 'radio',
            radioList: [{
              label: '启用',
              id: true
            }, {
              label: '禁用',
              id: false
            }],
          },
        ],
        rules: {
          name: [{
            required: true,
            message: '请输入区域名称',
            trigger: 'blur'
          }, ],
          no: [{
            required: true,
            message: '请输入区域编号',
            trigger: 'blur'
          }, ],
          enable: [{
            required: true,
            message: '请选择区域状态',
            trigger: 'change'
          }],
          workshopId: [{
            required: true,
            message: '请选择所属车间',
            trigger: 'change'
          }],
          // parentId: [{
          //   required: true,
          //   message: '请选择上级区域',
          //   trigger: 'change'
          // }]
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
        this.formList.unshift({
          props: 'workshopId',
          label: '所属车间',
          span: 24,
          type: 'checkbox',
          filterable: true,
          checkList: workshopLists,
        })
      })

      workshopAreaManage['getNames']().then(res => {
        let workshopAreaLists = [];
        res.data.forEach((val) => {
          workshopAreaLists.push({
            key: val.label,
            value: val.id
          })
        })
        // this.workshopLists=workshopLists
        // this.formList.push({
        //   props: 'parentId',
        //   label: '上级区域',
        //   span: 12,
        //   type: 'checkbox',
        //   checkList: workshopAreaLists,
        // })
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
          workshopAreaManage.remove(row.id).then(res=>{
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
        workshopAreaManage['getLists']({ ...data,
          ...pageData
        }).then(res => {
          this.tableLists = res.data.content
          this.total = res.data.totalElements;
        })
      },
      addDialog() {
        this.dialogVisible = true
        this.dialogTitleTxt = '新增'
        this.dialogType = 'add'
      },
      editDialog(row) {
        workshopAreaManage['getOne']('', row.id).then(res => {
          this.form = res.data
          this.dialogVisible = true
          this.dialogTitleTxt = '编辑'
          this.dialogType = 'edit'
          this.form.workshopId -= 0
          console.log(this.form)
        })
      },
      dialogClose() {
        this.dialogVisible = false
        this.form = {
          no: '',
          name: '',
          isChooseParent:true,
          description: '',
          parentId: null,
          workshopId: null,
          enable: true
        }
      },
      ok(dialogType) {
        var _self = this
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            workshopAreaManage[dialogType](this.form, this.form.id).then(res => {
              this.dialogVisible = false
              this.getTableData();
              this.form = {
                no: '',
                name: '',
                description: '',
                parentId: null,
                workshopId: null,
                isChooseParent:true,
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
