// 用户管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <!-- 底部表格 -->
      <tpms-table @getTableData="getTableData" ref='tpmsTable' :total='total' :data='tableLists' :columns='tableHeaderList' :column_index='true'
        @inquireTableData='inquireTableData'>
        <template slot="operation" slot-scope="{row}">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
          <!-- <span class="button cursor" @click="del(row)">删除</span> -->
        </template>
      </tpms-table>
    </el-row>


    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible" :before-close='dialogClose'>
      <el-form :model="form" label-width="120px" label-position="right">
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item :label="item.label" :label-width="item.labelWidth" style="width: 100%;">
              <el-select v-model="form[item.props]" v-if="item.type==='checkbox'" :filterable="item.filterable"
                :placeholder="item.placeholder">
                <el-option v-for="(item,i) in item.checkList" :key="i" :label="item.key" :value="item.value"></el-option>
              </el-select>
              <el-input v-model="form[item.props]" v-else-if="item.type==='textarea'" :rows='item.rows' :type='item.type' />
              <el-radio v-model="form[item.props]" v-else-if="item.type==='radio'" :label='radio.id' v-for="(radio,i) in item.radioList"
                :key="i">
                {{radio.label}}
              </el-radio>
              <el-input :readonly='item.readonly'  v-model="form[item.props]" v-else />
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
    workshopManage
  } from "../../lib/api/workshopSettingsManage";
  import {
    getUserLists
  } from "../../lib/api/userManage";
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
        tableHeaderList: [
          {
            props: 'no',
            label: '编号'
          }, {
            props: 'name',
            label: '车间名称'
          },
          {
            props: 'description',
            label: '车间描述'
          }, {
            props: 'managerName',
            label: '车间负责人'
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
          "managerId": null,
          description: '',
        },
        formList: [{
            props: 'no',
            label: '车间编号',
            span: 12,
            type: 'input',
            readonly:true
          },
          {
            props: 'name',
            label: '车间',
            span: 12,
            type: 'input',
            readonly:true
          },
          {
            props: 'description',
            label: '车间描述',
            span: 24,
            type: 'textarea'
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
      let _self = this
      getUserLists().then(res => {
        let userLists = [];
        res.data.content.forEach((val) => {
          userLists.push({
            key: val.name + ' ' + val.email,
            value: val.id,
            workNo: val.workNo
          })
        })
        this.userLists = userLists
        this.formList.push({
          props: 'managerId',
          label: '车间负责人',
          span: 24,
          type: 'checkbox',
          filterable: true,
          checkList: userLists
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
          workshopManage.remove(row.id).then(res=>{
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
        let pageData = this.$refs.tpmsTable.getData();
        workshopManage['getLists']({
          ...pageData
        }).then(res => {
          this.tableLists = res.data.content
          this.total = res.data.totalElements
        })
      },
      editDialog(row) {
        this.dialogVisible = true
        this.dialogTitleTxt = '编辑'
        this.dialogType = 'edit'
        this.form = deepClone(row)
        console.log(this.form)
      },
      dialogClose() {
        this.dialogVisible = false
      },
      ok(dialogType) {
        var _self = this
        workshopManage[dialogType](this.form, this.form.id).then(res => {
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
      },

    }
  };
</script>

<style>
  .add-drawer {
    margin-top: 0.8rem;
  }
</style>
