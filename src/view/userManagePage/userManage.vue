// 用户管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref="tpmsHeader" :formData="userFormList" @inquireTableData="inquireTableData" @onValueChanged="onValueChanged" @afterClear="initHeader" />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button v-if="userInfo.includes('USER_ADD')" size="small" @click="addClick">新增</el-button>
      <el-button v-if="userInfo.includes('USER_EXPORT')" @click="exportUser" class="border-none" size="small">导出</el-button>
      <tpms-choosefile v-if="userInfo.includes('USER_ADD')" plain text="导入" @getFileData="getFileData"></tpms-choosefile>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :data="userLists"
        :columns="userTableList"
        :column_index="false"
        :total="total"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template slot="operation" slot-scope="{row}">
          <span class="button cursor" v-if="userInfo.includes('USER_VIEW')" @click="editDialog(row.uuid, '查看')">查看</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" v-if="userInfo.includes('USER_EDIT')" @click="editDialog(row.uuid, '编辑')">编辑</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" v-if="userInfo.includes('USER_DELETE')" @click="del(row)">删除</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" v-if="userInfo.includes('USER_RESET_PASSWORD')" @click="showPassword(row)">重置密码</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 编辑|查看 -->
    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible">
      <el-form :model="editForm" ref="editForm" inline label-position="left" size="small">
        <el-divider content-position="left">用户基础信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工号">
              <el-input :read-only="dialogTitleTxt=='查看' || userInfo.includes('USER_EDIT_FACTORY')" v-model="editForm.workNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" :label-width="labelWidth">
              <el-input :read-only="dialogTitleTxt=='查看' || userInfo.includes('USER_EDIT_FACTORY')" v-model="editForm.name" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="电话" :label-width="labelWidth">
              <el-input :readonly="dialogTitleTxt=='查看' || userInfo.includes('USER_EDIT_FACTORY')" v-model="editForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" :label-width="labelWidth">
              <el-input :readonly="dialogTitleTxt=='查看' || userInfo.includes('USER_EDIT_FACTORY')" v-model="editForm.email" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看' || userInfo.includes('USER_EDIT_FACTORY')" v-model="editForm.gender">
                <el-option
                  v-for="item in genderList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看' || userInfo.includes('USER_EDIT_FACTORY')" v-model="editForm.enabled">
                <el-option
                  v-for="item in enabledList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-for="(formObj, index) in editForm.userWorkshops" :key="index">
          <el-divider content-position="left">用户工厂信息</el-divider>
          <el-col :span="12">
            <el-form-item label="工厂" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看' || userInfo.includes('USER_EDIT_FACTORY')" v-model="formObj.factoryId" @change="userChanged('factoryId',formObj)">
                <el-option
                  v-for="item in formObj.selectLists.factoryList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车间" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看' || userInfo.includes('USER_EDIT_FACTORY')" v-model="formObj.workshopId" @change="userChanged('workshopId',formObj)">
                <el-option
                  v-for="item in formObj.selectLists.workshopList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看'" v-model="formObj.workshopAreaId" @change="userChanged('workshopAreaId',formObj)">
                <el-option
                  v-for="item in formObj.selectLists.workshopAreaList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工段" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看'" v-model="formObj.workshopSectionId" @change="userChanged('workshopSectionId',formObj)">
                <el-option
                  v-for="item in formObj.selectLists.workshopSectionList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工位" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看'" v-model="formObj.workStationId">
                <el-option
                  v-for="item in formObj.selectLists.workStationList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班组" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看'" v-model="formObj.workshopTeamId">
                <el-option
                  v-for="item in userFormList.filter(({props})=>props==='workshopTeamId')[0].checkList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看'" v-model="formObj.positionIds"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in userFormList.filter(({props})=>props==='positionCodeSum')[0].checkList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="班次" :label-width="labelWidth">
              <el-select clearable :disabled="dialogTitleTxt=='查看'" v-model="formObj.workshopShiftId">
                <el-option
                  v-for="item in userFormList.filter(({props})=>props==='workshopShiftId')[0].checkList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="角色" :label-width="labelWidth">
              <el-select
                :disabled="dialogTitleTxt=='查看' || userInfo.includes('USER_EDIT_FACTORY')"
                v-model="formObj.roleIds"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in userFormList.filter(({props})=>props==='roleId')[0].checkList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button :disabled="userInfo.includes('USER_EDIT_FACTORY')" v-if="dialogTitleTxt !== '查看' " type="warning" @click.prevent="removeDomain(formObj)" size="small">删除</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="userInfo.includes('USER_EDIT_FACTORY')" v-if="dialogTitleTxt !== '查看' " @click="addDomain">新增工厂信息</el-button>
        <el-button v-if="dialogTitleTxt==='编辑'" type="primary" @click="edit()">确 定</el-button>
        <el-button v-if="dialogTitleTxt==='添加用户'" type="primary" @click="beforeAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog title="重置密码" :visible.sync="showPasswordMoal">
      <el-form inline label-position="left">
        <el-row>
          <el-col :span="24">
            <el-form-item label="密码" label-width="100px">
              <el-input placeholder="请输入密码" v-model="PasswordHistoryVO.password" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="再次输入密码" :label-width="labelWidth">
              <el-input placeholder="请再次输入密码" v-model="PasswordHistoryVO.repeatPassword" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPasswordMoal = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { tpmsHeader, tpmsTable, tpmsChoosefile } from "../../components";
import {
  getUserLists,
  getOneUser,
  addUser,
  editUser,
  removeUser,
  editUserPassword,
  importData
} from "../../lib/api/userManage";
import {
  workStationManage,
  workshopAreaManage,
  workshopManage,
  sysPositionManage,
  factoryManage,
  workshopSectionManage,
  workshopShiftManage,
  workshopTeamManage,
  roleManage
} from "../../lib/api/workshopSettingsManage";
import {
  editForm,
  form,
  genderList,
  enabledList,
  editFormList,
  userFormList,
  userTableList
} from "../../public/model/user";
import axios from 'axios';
import apiConfig from "../../lib/api/apiConfig";

export default {
  data() {
    const userInfoLocal = localStorage.getItem('user_info');
    return {
      userInfo: userInfoLocal,
      showPasswordMoal: false,
      PasswordHistoryVO: {
        password: "",
        repeatPassword: "",
        userId: ""
      },
      labelWidth: "",
      dialogVisible: false,
      dialogTitleTxt: "",
      userLists: [],
      editForm: editForm,
      factory: null,
      // workStation: null,
      // workshopArea: null,
      // workshop: null,
      // workshopSection: null,
      // workshopShift: null,
      // workshopTeam: null,
      // role: null,
      // positionCodeSum: null,
      editData: {},
      form: form,
      genderList: genderList,
      enabledList: enabledList,
      editFormList: editFormList,
      total: 0,
      userFormList: userFormList,
      userTableList: userTableList,
      factoryList: [],
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile
  },
  mounted() {
    this.getTableData();
    this.initHeader();
    workshopTeamManage["getNames"]().then(res => {
      this.userFormList.forEach(item => {
        if(item.props === 'workshopTeamId'){
          item.checkList = res.data;
        }
      })
    });
    workshopShiftManage["getNames"]().then(res => {
      this.userFormList.forEach(item => {
        if(item.props === 'workshopShiftId'){
          item.checkList = res.data;
        }
      })
    });
    sysPositionManage["getNames"]().then(res => {
      this.userFormList.forEach(item => {
        if(item.props === 'positionCodeSum'){
          item.checkList = res.data;
        }
      })
    });
    roleManage["getNames"]().then(res => {
      res.data.forEach(item=>{
        item.label = item.name;
      })
      this.userFormList.forEach(item => {
        if(item.props === 'roleId'){
          item.checkList = res.data;
        }
      })
    });
    factoryManage["getNames"]().then(res => {
      this.factoryList = res.data;

      this.userFormList.forEach(item => {
        if(item.props === 'factoryId'){
          item.checkList = res.data;
        }
      })
    });
  },
  methods: {
    /** 初始化头部车间、区域、工段、工位下拉选项 */
    initHeader(){
      userFormList.forEach(item => {
        // 车间
        if(item.props === 'workshopId'){
          workshopManage.getNames().then(res => {
            item.checkList = res.data;
          });
          return;
        };
        
        // 区域
        if(item.props === 'workshopAreaId'){
          workshopAreaManage.getNames().then(res => {
            item.checkList = res.data;
          });
          return;
        };

        // 工段
        if(item.props === 'workshopSectionId'){
          workshopSectionManage.getNames().then(res => {
            item.checkList = res.data;
          });
          return;
        }

        // 工位
        if(item.props === 'workStationId'){
          workStationManage.getNames().then(res => {
            item.checkList = res.data;
          })
        }
      })
    },
    del(row) {
      let option = {
        ids: row.id
      };
      this.$confirm("确定要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeUser(option).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getTableData();
          });
        })
        .catch(() => {});
    },
    getFileData(file) {
      let formData = new FormData();
      formData.append("file", file);
      importData(formData).then(res => {
        console.log(res);
        // this.$message.error(JSON.stringify(res.data));
        this.getTableData();
      });
    },
    resetPassword() {
      let { password, repeatPassword } = this.PasswordHistoryVO;
      if (!password && !repeatPassword) {
        this.$message.error("请输入密码");
        return false;
      }
      if (password != repeatPassword) {
        this.$message.error("两次密码输入不一致");
        return false;
      }
      this.$confirm("确定修改密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          editUserPassword(this.PasswordHistoryVO).then(res => {
            console.log(res);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.showPasswordMoal = false;
            this.getTableData();
          });
        })
        .catch(() => {});
    },
    showPassword(row) {
      this.showPasswordMoal = true;
      console.log(row);
      this.PasswordHistoryVO.userId = row.id;
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
      // data.workshopIds = data.workshopIds.length ? data.workshopIds.split(',') : [];

      let pageData = this.$refs.tpmsTable.getData();
      var _self = this;
      getUserLists({ ...data, ...pageData })
        .then(res => {
          // console.log({ ...data,
          //   ...pageData
          // })
          // console.log(res)
          _self.userLists = res.data.content;
          this.total = res.data.totalElements;
        })
        .catch(err => {
          this.$message.error(err.error);
        });
    },
    /** 
     * 头部value变更回调 
     * @param {props, value} 当前changed整条item
     * @param {object} searchData 整个搜索组所有有值的key-value
     */
    onValueChanged({props, value}, searchData) {
      const {
        factoryId = '',//工厂
        workshopId = '',//车间
        workshopAreaId = '',//区域
        workshopSectionId = '',//工段
      } = searchData;

      const { userFormList } = this;

      // 选择工厂，重置车间
      if(['factoryId'].includes(props)){
        const requestData = { factoryId };

        workshopManage.getNames(requestData).then(res => {
          userFormList.forEach(item => {
            if(item.props === 'workshopId'){
              item.checkList = res.data;
              item.value = '';
            };
          })
        });
      };

      // 选择工厂|车间，都重置区域
      if(['factoryId', 'workshopId'].includes(props)){
        const requestData = { factoryId, workshopId };

        workshopAreaManage.getNames(requestData).then(res => {
          userFormList.forEach(item => {
            if(item.props === 'workshopAreaId'){
              item.checkList = res.data;
              item.value = '';
            };
          })
        });
      };

      // 选择工厂|车间|区域，都重置工段
      if(['factoryId', 'workshopId', 'workshopAreaId'].includes(props)){
        const requestData = { factoryId, workshopId, workshopAreaId };

        workshopSectionManage.getNames(requestData).then(res => {
          userFormList.forEach(item => {
            if(item.props === 'workshopSectionId'){
              item.checkList = res.data;
              item.value = '';
            };
          })
        });
      };

      // 选择工厂|车间|区域|工段，都重置工位
      if(['factoryId', 'workshopId', 'workshopAreaId', 'workshopSectionId'].includes(props)){
        const requestData = { factoryId, workshopId, workshopAreaId, workshopSectionId };
        
        workStationManage.getNames(requestData).then(res => {
          userFormList.forEach(item => {
            if(item.props === 'workStationId'){
              item.checkList = res.data;
              item.value = '';
            }
          })
        });
      };
    },
    /** 编辑用户时的回调 */
    userChanged(props, info) {
      if(props === 'factoryId'){
        // 选择工厂，重置车间及以下
        workshopManage.getNames({[props]: info[props]}).then(res => {
          info.selectLists.workshopList = res.data;
          info.selectLists.workshopAreaList = [];
          info.selectLists.workshopSectionList = [];
          info.selectLists.workStationList = [];
          info.workshopId = '';
          info.workshopAreaId = '';
          info.workshopSectionId = '';
          info.workStationId = '';
        });
      };
 
      if(props === 'workshopId'){
        // 选择车间，重置区域及以下
        workshopAreaManage.getNames({[props]: info[props]}).then(res => {
          info.selectLists.workshopAreaList = res.data;
          info.selectLists.workshopSectionList = [];
          info.selectLists.workStationList = [];
          info.workshopAreaId = '';
          info.workshopSectionId = '';
          info.workStationId = '';
        });
      };
 
      if(props === 'workshopAreaId'){
        // 选择区域，重置工段及以下
        workshopSectionManage.getNames({[props]: info[props]}).then(res => {
          info.selectLists.workshopSectionList = res.data;
          info.selectLists.workStationList = [];
          info.workshopSectionId = '';
          info.workStationId = '';
        });
      };
 
      if(props === 'workshopSectionId'){
        // 选择工段，重置工位
        workStationManage.getNames({[props]: info[props]}).then(res => {
          info.selectLists.workStationList = res.data;
          info.workStationId = '';
        });
      };
    },
    /** 点击新增按钮 */
    addClick(){
      this.dialogVisible = true;
      this.dialogTitleTxt = '添加用户';
      this.editForm = {
        workNo: '',
        name: '',
        phone: '',
        email: '',
        gender: '',
        enabled: '',
        userWorkshops:[
          {
            factoryId: null,
            workshopId: null,
            workshopAreaId: null,
            workshopSectionId: null,
            workshopTeamId: null,
            workStationId: null,
            workshopShiftId: null,
            roleIds: [],
            positionIds: [],
            selectLists:{
              factoryList:this.factoryList,
              workshopList:[],
              workshopAreaList:[],
              workshopSectionList:[],
              workStationList:[]
            }
          }
        ]
      };
    },
    /** 添加之前 */
    beforeAdd(){
      this.$confirm(
        `确认添加`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(this.add.bind(this))
        .catch(() => {
          console.log("已取消");
        });
    },
    add(){
      const _self = this;
      let form = this.editForm;
      form.workshopTeamId = form.workshopTeamName;
      form.workshopShiftId = form.workshopShiftName;
      form.workshopAreaId = form.workshopAreaName;
      form.workshopSectionId = form.workshopSectionName;
      form.workshopId = isNaN(form.workshopName)
        ? form.workshopId
        : form.workshopName;
      form.workStationId = form.workStationName;
      addUser(form).then(res=>{
        this.$message.success("添加完成");
        this.dialogVisible = false;
        this.getTableData();
      })
    },
    editDialog(id, dialogTitleTxt) {
      getOneUser("", id).then(res => {
        console.log(res);
        const data = res.data;
        data.userWorkshops.forEach(item => {
          item.roleIds = item.roles.map(({id}) => id);
          item.positionIds = item.sysPositions.map(({id}) => id);
          item.selectLists = {};
          Object.assign(item.selectLists, {
            factoryList: this.factoryList,
            workshopList:[],
            workshopAreaList:[],
            workshopSectionList:[],
            workStationList:[]
          });

          item.factoryId && workshopManage.getNames({factoryId: item.factoryId}).then(res => {
            item.selectLists.workshopList = res.data;
          });
          item.workshopId && workshopAreaManage.getNames({workshopId: item.workshopId}).then(res => {
            item.selectLists.workshopAreaList = res.data;
          });
          item.workshopAreaId && workshopSectionManage.getNames({workshopAreaId: item.workshopAreaId}).then(res => {
            item.selectLists.workshopSectionList = res.data;
          });
          item.workshopSectionId && workStationManage.getNames({workshopSectionId: item.workshopSectionId}).then(res => {
            item.selectLists.workStationList = res.data;
          });
        });
        if(dialogTitleTxt == '查看') {
          // this.userInfo = false
        }
        this.editForm = data;
        this.dialogVisible = true;
        this.dialogTitleTxt = dialogTitleTxt;
      });
    },
    edit() {
      const _self = this;
      let form = this.editForm;
      form.workshopTeamId = form.workshopTeamName;
      form.workshopShiftId = form.workshopShiftName;
      form.workshopAreaId = form.workshopAreaName;
      form.workshopSectionId = form.workshopSectionName;
      form.workshopId = isNaN(form.workshopName)
        ? form.workshopId
        : form.workshopName;
      form.workStationId = form.workStationName;

      console.log(JSON.stringify(form));
      editUser(form).then(res => {
        console.log(res);
        this.$message.success("修改成功");
        _self.dialogVisible = false;
        this.getTableData();
      });
    },
    addDomain() {
      this.editForm.userWorkshops.push({
        factoryId: null,
        workshopId: null,
        workshopAreaId: null,
        workshopSectionId: null,
        workshopTeamId: null,
        workStationId: null,
        workshopShiftId: null,
        roleIds: [],
        positionIds: [],
        selectLists:{
          factoryList:this.factoryList,
          workshopList:[],
          workshopAreaList:[],
          workshopSectionList:[],
          workStationList:[]
        }
      });
    },
    removeDomain(item) {
      var index = this.editForm.userWorkshops.indexOf(item);
      if (index !== -1) {
        this.editForm.userWorkshops.splice(index, 1);
      }
    },
    /**
     * 角色导出
     */
    exportUser() {
      let url = `${apiConfig.userManage}/export`; //请求下载文件的地址
      let token = localStorage.getItem('access_token'); //获取token
      axios
        .get(url, {
          headers: {
            Authorization:'Bearer ' + token
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) return;

          let fileName = '用户清单.xlsx';
          const disposition = res.headers['content-disposition'];
          if(disposition){
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }
          
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", fileName); // 下载的文件
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          this.$message.error(error.message);
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