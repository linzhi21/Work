// 用户管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref='tpmsHeader' :formData='userFormList' @inquireTableData='inquireTableData' />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button class="button-more" type="primary" size="small" style="margin-right:45px">导出</el-button>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table ref='tpmsTable' :data='userLists' :columns='userTableList' :column_index='false' :total='total'
        @inquireTableData='inquireTableData' @getTableData='getTableData'>
        <template slot-scope="{row}">
          <span class="button">查看</span>
          <span class="button" @click='editDialog(row.uuid)'>编辑</span>
          <span class="button" @click="seeBOM(row)">重置密码</span>
        </template>
      </tpms-table>
    </el-row>

    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible">
      <el-form :model="editForm" inline label-width="70px" label-position="left">
        <el-row>
          <el-col :span="12" v-for="(item,index) in editFormList" :key="index">
            <el-form-item :label="item.label" :label-width="item.labelWidth">
              <el-input v-model="item.translate?item.translate(editForm[item.props]):editForm[item.props]" :disabled='item.disabled'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
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
    getUserLists,
    getOneUser,
    addUser,
    editUser,
    removeUser,
    editUserPassword
  } from "../../lib/api/userManage";

  import{
    workStationManage,
    workshopAreaManage,
    workshopManage,
    sysPositionManage,
    factoryManage,
    workshopSectionManage,
    workshopShiftManage,
    workshopTeamManage,
    roleManage
  }from "../../lib/api/workshopSettingsManage";

  export default {
    data() {
      return {
        dialogVisible: false,
        dialogTitleTxt: '',
        userLists: [],
        editForm: {
          workNo: '',
          name: '',
          gender: '',
          phone: '',
          email: '',
          workshopId: '',
          enabled: '',
        },
        factory:null,
        workStation:null,
        workshopArea:null,
        workshop:null,
        workshopSection:null,
        workshopShift:null,
        workshopTeam:null,
        role:null,
        positionCodeSum:null,
        editData: {},
        editFormList: [{
            props: 'workNo',
            label: '工号',
            disabled: true
          },
          {
            props: 'name',
            label: '姓名',
            disabled: true
          },
          {
            props: 'gender',
            label: '性别',
            translate: (value) => value == 1 ? '男' : '女',
            disabled: true
          },
          {
            props: 'phone',
            label: '电话',
            disabled: true
          },
          {
            props: 'email',
            label: '邮箱',
            disabled: true
          },
          {
            props: 'workshopId',
            label: '车间',
            disabled: true
          },
          {
            props: 'nService',
            label: '员工状态',
            disabled: true
          },
        ],
        total: 0,
        userFormList: [
          //  渲染头部功能区的列表
          {
            label: "车间",
            props: "workshopId",
            value: "",
            type: 'radio',
            checkList: []
          },
          {
            label: "工段",
            props: "workshopSectionId",
            value: "",
            type: 'radio',
            checkList: []
          },
          {
            label: "班组",
            props: "workshopTeamId",
            value: "",
            type: 'radio',
            checkList: []
          },
          {
            label: "工位",
            props: "workStationId",
            value: "",
            type: 'radio',
            checkList: []
          },
          {
            label: "班次",
            props: "workshopShiftId",
            value: "",
            type: 'radio',
            checkList: []
          },
          {
            label: "岗位",
            props: "positionCodeSum",
            value: "",
            type: 'radio',
            checkList: []
          },
          {
            label: "角色",
            props: "roleCodeSum",
            value: "",
            type: 'radio',
            checkList: []
          },
          {
            label: "区域",
            props: "workshopAreaId",
            value: "",
            type: 'radio',
            checkList: []
          },
          {
            label: "员工",
            props: "name",
            value: "",
            type: 'input',
            checkList: []
          },
          {
            label: "状态",
            props: "enabled",
            value: "",
            placeholder: '请选择员工状态',
            type: 'radio',
            checkList: [{
              label: '启用',
              id: true
            }, {
              label: '禁用',
              id: false
            }]
          }
        ],
        userTableList: [{
            props: 'id',
            label: 'No.'
          },
          {
            props: 'username',
            label: '用户名'
          },
          {
            props: 'workNo',
            label: '工号'
          },
          {
            props: 'name',
            label: '姓名'
          },
          {
            props: 'gender',
            label: '性别',
            translate: (value) => value == 1 ? '男' : '女'
          },
          {
            props: 'phone',
            label: '电话'
          },
          {
            props: 'email',
            label: '邮箱'
          },
          {
            props: 'workshopId',
            label: '车间'
          },
          {
            props: 'workshopSectionId',
            label: '工段'
          },
          {
            props: 'workshopTeamId',
            label: '班组'
          },
          {
            props: 'workshopShiftId',
            label: '工次'
          },
          {
            props: 'workshopAreaId',
            label: '班次'
          },
          {
            props: 'workshopAreaId',
            label: '岗位'
          },
          {
            props: 'roleCodeSum',
            label: '角色'
          },
          {
            props: 'workshopAreaId',
            label: '区域'
          }
        ],
      }
    },
    components: {
      tpmsHeader,
      tpmsTable
    },
    mounted() {
      this.getTableData()
      workshopManage['getLists']().then(res=>{
        this.workshop=res.data.content;
        this.workshop.forEach(val=>{
          this.userFormList[0].checkList.push({id:val.id,label:val.name})
        })
      })
      workshopSectionManage['getLists']().then(res=>{
        this.workshopSection=res.data.content;
        this.workshopSection.forEach(val=>{
          this.userFormList[1].checkList.push({id:val.id,label:val.name})
        })
      })
      workshopTeamManage['getLists']().then(res=>{
        this.workshopTeam=res.data.content;
        this.workshopTeam.forEach(val=>{
          this.userFormList[2].checkList.push({id:val.id,label:val.name})
        })
      })
      workStationManage['getLists']().then(res=>{
        this.workStation=res.data.content;
        this.workStation.forEach(val=>{
          this.userFormList[3].checkList.push({id:val.id,label:val.name})
        })
      })
      workshopShiftManage['getLists']().then(res=>{
        this.workshopShift=res.data.content;
        this.workshopShift.forEach(val=>{
          this.userFormList[4].checkList.push({id:val.id,label:val.name})
        })
      })
      sysPositionManage['getLists']().then(res=>{
        this.positionCodeSum=res.data.content;
        this.positionCodeSum.forEach(val=>{
          this.userFormList[5].checkList.push({id:val.id,label:val.name})
        })
      })
      roleManage['getLists']().then(res=>{
        this.role=res.data.content;
        this.role.forEach(val=>{
          this.userFormList[6].checkList.push({id:val.id,label:val.name})
        })
      })
      workshopAreaManage['getLists']().then(res=>{
        this.workshopArea=res.data.content;
        console.log(res)
        this.workshopArea.forEach(val=>{

          this.userFormList[7].checkList.push({id:val.id,label:val.no})
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
        var _self = this;
        getUserLists({ ...data,
          ...pageData
        }).then(res => {
          _self.userLists = res.data.content
          this.total=res.data.totalElements
        })
      },
      add() {},
      editDialog(id) {
        let _self = this
        getOneUser('', id).then(res => {
          let data = res.data;
          _self.editData = data
          for (let v in data) {
            _self.editForm[v] = data[v]
          }
          _self.dialogVisible = true
          _self.dialogTitleTxt = '编辑'
        })
      },
      edit() {
        let _self = this
        editUser(_self.editForm).then(res => {
          console.log(res)
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
