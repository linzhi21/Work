// 审批设置
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header
        ref="tpmsHeader"
        :formData="searchFormList"
        @inquireTableData="inquireTableData"
      />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button
        class="button-more"
        type="primary"
        size="small"
        style="margin-right:45px"
        @click="addDialog()"
      >新增</el-button>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :total="total"
        :data="tableLists"
        :columns="tableHeaderList"
        :column_index="false"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template slot="operation" slot-scope="{row}">
          <span class="button cursor" @click="editDialog(row,'编辑')">编辑</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" @click="editDialog(row,'查看')">查看</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" @click="isEnable(row)">{{row.enable?'禁用':'启用'}}</span>
          <!-- <span class="button cursor" @click="remove(row)">删除</span> -->
        </template>
      </tpms-table>
    </el-row>

    <el-dialog
      :title="dialogTitleTxt"
      :visible.sync="dialogVisible"
      :before-close="dialogClose"
      width="80%"
    >
      <el-form :model="form" label-width="100px" label-position="right" size="small">
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item v-if="item.hidden!==true" :label="item.label" :label-width="item.labelWidth||'180px'" style="width: 100%;">
              <el-select
                v-model="form[item.props]"
                v-if="item.type==='checkbox'"
                :multiple="item.multiple===true"
                :disabled="dialogTitleTxt==='查看'"
                :placeholder="item.placeholder"
                style="width:100%;"
                @change="formChanged(item)"
              >
                <el-option
                  v-for="(item,i) in item.checkList"
                  :key="i"
                  :label="item.key"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="form[item.props]"
                v-else-if="item.type==='checkbox_search'"
                :disabled="dialogTitleTxt==='查看'"
                :placeholder="item.placeholder"
                multiple
                filterable
                remote
                :remote-method="remoteMethodFirst"
                :loading="roleSearchLoading"
                style="width:100%;"
              >
                <el-option
                  v-for="(item,i) in item.checkList"
                  :key="i"
                  :label="item.key"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-model="form[item.props]"
                v-else-if="item.type==='textarea'"
                :disabled="dialogTitleTxt==='查看'"
                :rows="item.rows"
                :type="item.type"
              />
              <el-radio
                v-model="form[item.props]"
                v-else-if="item.type==='radio'"
                :disabled="dialogTitleTxt==='查看'"
                :label="radio.id"
                v-for="(radio,i) in item.radioList"
                :key="i"
              >{{radio.label}}</el-radio>
              <el-tree
                style="top: 8px;"
                :data="item.treedata"
                show-checkbox
                node-key="id"
                v-else-if="item.type==='tree'"
              ></el-tree>
              <el-input :disabled="dialogTitleTxt==='查看'" v-model="form[item.props]" v-else />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :paginationIsShow="false"
          :data="form.nodeList"
          :columns="tableNodeHeaderList"
          :column_index="false"
          @inquireTableData="inquireTableData"
        >
          <!-- <template slot-scope="{row,index}">
            <span class="button" @click="removeNodeDialog(row)">删除</span>
          </template>-->
          <template slot-scope="{row,$index}">
            <span class="button cursor" @click="editNodeDialog(row,$index)">编辑</span>
            <span class="button cursor" @click="removeNodeDialog(row,$index)">删除</span>
          </template>
        </tpms-table>
      </el-row>

      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button v-if="dialogTitleTxt!=='查看'" @click="ok(dialogType)">保存</el-button>
        <el-button v-if="dialogTitleTxt!=='查看'" type="primary" @click="addNodeDialog()">新增节点</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增/编辑节点" :visible.sync="nodeDialogVisible" center>
      <el-form label-width="140px" label-position="right">
        <el-row>
          <el-col>
            <el-form-item label="节点名称" style="width: 100%;">
              <el-input v-model="nodeFormList.name" />
            </el-form-item>
            <!--  <el-form-item label="上级节点"  style="width: 100%;">
              <el-input  v-model="nodeFormList.prev.description"/>
            </el-form-item>-->
            <el-form-item label="审批类型" style="width: 100%;">
              <el-radio-group v-model="nodeFormList.approvalType">
                <el-radio v-for="(v,i) in approvalType" :key="i" :label="v.value">{{v.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="nodeFormList.approvalType==2||nodeFormList.approvalType==4" label="多人审批时审批方式" style="width: 100%;">
              <el-select
                v-model="nodeFormList.multiApprovalType"
                style="width:100%;"
              >
                <el-option label="会签" :value="1"></el-option>
                <el-option label="或签" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="nodeFormList.approvalType==2" label="成员" style="width: 100%;">
              <el-select
                v-model="nodeFormList.users"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="userSelectLoading"
                style="width: 100%;">
                <el-option
                  v-for="item in usersList"
                  :key="item.workNo"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.workNo }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="nodeFormList.approvalType==4" label="岗位" style="width: 100%;">
              <el-select
                v-model="nodeFormList.positions"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="positionRemoteMethod"
                :loading="positionSelectLoading"
                style="width: 100%;">
                <el-option
                  v-for="item in positionsList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.workNo }}</span>
                </el-option>
              </el-select>
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
import { tpmsHeader, tpmsTable } from "../../components";
import {
  workflowManage,
  workflowNodeManage
} from "../../lib/api/approvalManage.js";
import { deepClone } from "@/utils";
import { authManage, sysPositionManage, roleManage } from "../../lib/api/workshopSettingsManage.js";
import { getUserDropList } from "../../lib/api/userManage";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitleTxt: "",
      dialogType: "",
      total: 0,
      load: "lazyLoad",
      rowKey: "id",
      lazy: "lazy",
      nodeDialogVisible: false,
      tableLists: [],
      searchFormList: [
        //  渲染头部功能区的列表
        {
          label: "审批流名称",
          labelWidth: "120px",
          props: "name",
          value: "",
          placeholder: "",
          type: "input"
        },
        {
          label: "模块",
          props: "module",
          value: "",
          placeholder: "",
        }
        // {
        //   label: "应用",
        //   props: "application",
        //   value: "",
        //   placeholder: '请选择应用',
        //   type: 'checkbox',
        //   checkList: []
        // },
      ],
      tableHeaderList: [
        {
          props: "id",
          label: "No."
        },
        {
          props: "name",
          label: "审批流名称"
        },
        {
          props: "module",
          label: "模块"
        },
        {
          props: "application",
          label: "应用"
        },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "160px"
        }
      ],
      tableNodeHeaderList: [
        {
          props: "name",
          label: "节点名称"
        },
        // {
        //   props: 'prev.description',
        //   label: '上级节点',
        //   translate: (value) => value ? value.name : '无'
        // },
        {
          props: "approvalType",
          label: "节点类型",
          translate: value => {
            switch (value) {
              case 1:
                return "发起人自己";
                break;
              case 2:
                return "指定成员";
                break;
              case 4:
                return "指定岗位";
                break;
              case 8:
                return "主管";
                break;
            }
          }
        }
      ],
      nodeTableHeaderList: [
        {
          props: "id",
          label: "No."
        },
        {
          props: "name",
          label: "审批流名称"
        },
        {
          props: "module",
          label: "模块"
        },
        {
          props: "application",
          label: "应用"
        }
      ],
      form: {
        application: "",
        code: "",
        comment: "",
        enable: true,
        // "module": "",
        id: "",
        name: "",
        opinionRequired: false,
        selfAutoApprove: true,
        whoCanLaunch: 1,
        nodeList: [],
        roleList: [],
        userList: [],
        flag: true, //true 节点新增     false 修改节点
        nodeIndex: 0 //要修改的节点下标
      },
      nodeForm: {
        approvalType: null,
        name: "",
        sort: 0,
        prev: null
      },
      nodeFormList: {
        name: "",
        // prev:{
        //   description:''
        // },
        approvalType: ""
      },
      approvalType: [
        { label: "发起人自己", value: 1 },
        { label: "指定成员", value: 2 },
        { label: "指定岗位", value: 4 },
        { label: "主管", value: 8 }
      ],
      formList: [
        {
          props: "name",
          label: "审批流名称",
          span: 24,
          type: "input"
        },
        {
          props: "module",
          label: "所属模块",
          span: 12,
        },
        {
          props: 'application',
          label: '所属应用',
          span: 12,
        },
        {
          props: "enable",
          label: "是否启用",
          span: 12,
          type: "checkbox",
          checkList: [
            {key:'启用', value: true},
            {key:'禁用', value: false}
          ]
        },
        {
          props: "selfAutoApprove",
          label: "发起人审批时自动通过",
          span: 12,
          type: "checkbox",
          checkList: [
            {key:'是', value: true},
            {key:'否', value: false}
          ]
        },
        {
          props: "whoCanLaunch",
          label: "谁可以发起",
          span: 12,
          type: "checkbox",
          checkList: [
            {key:'所有人', value: 1},
            {key:'角色', value: 2},
            {key:'用户', value: 4}
          ]
        },
        {
          props: "userList",
          label: "可发起审批流的用户",
          span: 12,
          type: "checkbox_search",
          checkList: [],
          hidden: true,
          loading: false
        },
        {
          props: "roleList",
          label: "可发起审批流的角色",
          span: 12,
          type: "checkbox",
          checkList: [],
          multiple:true,
          hidden: true
        },
      ],
      module: [],
      usersList:[],
      userSelectLoading: false,
      positionsList:[],
      positionSelectLoading: false,
      roleSearchLoading: false,
    };
  },
  components: {
    tpmsHeader,
    tpmsTable
  },
  mounted() {
    this.getTableData();
    // this.getRoot();
    this.getRoleList();
  },
  methods: {
    getRoleList(){
      roleManage.getNames().then(res=>{
        res.data.forEach(role=>{
          role.key = role.name;
          role.value = role.id;
        })
        this.formList.forEach(item=>{
          if(item.props === 'roleList') {
            item.checkList = res.data;
          }
        })
      })
    },
    getRoot() {
      authManage.getRoot({ page: 0, size: 100 }).then(res => {
        console.log(res);
        let data = res.data.map(item => {
          return {
            key: item.name,
            value: item.name
          };
        });
        let data2 = res.data.map(item => {
          return {
            id: item.name,
            label: item.name
          };
        });
        console.log(data);
        this.searchFormList[1].checkList = data2;
        this.formList[1].checkList = data;
        this.module = data;
      });
    },
    // 启用|禁用
    isEnable(row) {
      const enable = !row.enable
      const data = Object.assign(row, { enable })
      workflowManage.edit(data).then(res => {
        this.getTableData();
        this.$message.success(`${enable?'启用':'禁用'}成功`)
      })
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
      workflowManage["getLists"]({ ...data, ...pageData }).then(res => {
        this.tableLists = res.data.content;
        this.total = res.data.totalElements;
      });
    },
    /**
     * 编辑保存
     */ 
    ok(dialogType) {
      var _self = this;
      console.log(JSON.stringify(this.form));
      console.log(dialogType);
      workflowManage[dialogType](this.form).then(res => {
        this.dialogVisible = false;
        this.parentId = null;
        this.getTableData();
      });
    },
    /**
     * 新增节点
     */
    okNode(dialogType) {
      if (this.flag) {
        //添加节点
        this.form.nodeList = this.form.nodeList ? this.form.nodeList : [];
        this.form.nodeList.push(this.nodeFormList);
      } else {
        //编辑节点
        this.$set(this.form.nodeList, this.nodeIndex, this.nodeFormList);
      }

      this.nodeDialogVisible = false;
    },
    remove(row) {
      workflowManage["remove"](",", row.uuid).then(res => {
        console.log(res);
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.getTableData();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      });
    },
    addDialog() {
      this.dialogVisible = true;
      this.dialogTitleTxt = "新增";
      this.dialogType = "add";
      this.reset();
    },
    addNodeDialog() {
      this.nodeDialogVisible = true;
      this.flag = true;
      // this.dialogTitleTxt='新增'
      this.nodeFormList = {
        name: "",
        // prev: {
        //   description: ""
        // },
        approvalType: ""
      };
    },
    editNodeDialog(row, index) {
      console.log(row, index);
      this.dialogTitleTxt = "编辑";
      this.nodeDialogVisible = true;
      this.nodeFormList = deepClone(row);
      this.flag = false;
      this.nodeIndex = index;
      this.positionsList = row.positions.map((item, i) => {
        return {
          name: row.positionNames[i],
          id: item
        }
      });
      this.usersList = row.users.map((item, i) => {
        return {
          name: row.userNames[i],
          id: item
        }
      });
    },
    removeNodeDialog(row, index) {
      this.form.nodeList.splice(index, 1);
    },
    editDialog(row, dialogText) {
      workflowManage["getOne"]("null", row.id).then(res => {
        let data = res.data;
        console.log(res);
        let {
          application,
          comment,
          enable,
          module,
          name,
          opinionRequired,
          selfAutoApprove,
          whoCanLaunch,
          id
        } = data;
        this.form = {
          application,
          comment,
          enable,
          module,
          name,
          opinionRequired,
          selfAutoApprove,
          whoCanLaunch,
          id,
          nodeList: data.nodeList ? data.nodeList : [],
          roleList: data.roleList ? data.roleList : [],
          userList: data.userList ? data.userList : []
        };
        this.dialogVisible = true;
        this.dialogTitleTxt = dialogText;
        if (dialogText == "编辑") {
          this.dialogType = "edit";
        }
        
        if(whoCanLaunch==1){
          this.formList.forEach(item=>{
            if(item.props==='roleList') item.hidden = true;
            if(item.props==='userList') item.hidden = true;
          })
        }else if(whoCanLaunch==2){
          this.formList.forEach(item=>{
            if(item.props==='roleList') item.hidden = false;
            if(item.props==='userList') item.hidden = true;
          })
        }else if(whoCanLaunch==4){
          this.formList.forEach(item=>{
            if(item.props==='userList') item.hidden = false;
            if(item.props==='roleList') item.hidden = true;
          })
        }

        this.formList.forEach(item => {
          if(item.props === 'userList'){
            const userNameList = data.userNameList || [];
            data.userList.map((evry, i)=>{
              return {
                key: userNameList[i],
                value: evry
              }
            })
          };
          if(item.props === 'roleList'){
            const roleNameList = data.roleNameList || [];
            data.roleList.map((evry, i)=>{
              return {
                key: roleNameList[i],
                value: evry
              }
            })
          };
        })
        console.log(this.form)
        console.log(this.formList)
      });
    },
    formChanged({props}){
      console.log(this.formList)
      if(props === 'whoCanLaunch') {
        if(this.form[props] == 1){
          this.formList.forEach(item=>{
            if(['userList', 'roleList'].includes(item.props)){
              item.hidden = true;
            };
          })
        };
        if(this.form[props] == 2){
          this.formList.forEach(item=>{
            if(item.props === 'userList'){
              item.hidden = true;
            };
            if(item.props === 'roleList'){
              item.hidden = false;
            };
          })
        };
        if(this.form[props] == 4){
          this.formList.forEach(item=>{
            if(item.props === 'userList'){
              item.hidden = false;
            };
            if(item.props === 'roleList'){
              item.hidden = true;
            };
          })
        };
      }
    },
    remoteMethodFirst(query){
      const item = this.formList.filter(({props})=>props==='userList')[0];
      if (query !== '') {
        item.checkList = [];
        item.loading = true;
        getUserDropList({name:query}).then(res=>{
          const { content } = res.data;
          content.forEach(ever => {
            ever.key = ever.name;
            ever.value = ever.id;
          })
          item.checkList = content;
          item.loading = false;
          console.log(item)
        }).catch(()=>{
          item.loading = false;
        })
      } else {
        item.checkList = [];
      }
    },
    dialogClose() {
      this.dialogVisible = false;
    },
    reset() {
      this.form = {
        application: "",
        code: "",
        comment: "",
        enable: true,
        module: "",
        name: "",
        opinionRequired: false,
        selfAutoApprove: true,
        whoCanLaunch: 1,
        nodeList: [],
        roleList: [],
        userList: []
      };
    },
    remoteMethod(query){
      if (query !== '') {
        this.userSelectLoading = true;
        getUserDropList({name:query}).then(res=>{
          const { content } = res.data;
          this.usersList = content;
          this.userSelectLoading = false;
        }).catch(()=>{
          this.userSelectLoading = false;
        })
      } else {
        this.options = [];
      }
    },
    positionRemoteMethod(query){
      if (query !== '') {
        this.positionSelectLoading = true;
        sysPositionManage.getLists({name:query}).then(res=>{
          const { content } = res.data;
          this.positionsList = content;
          this.positionSelectLoading = false;
        }).catch(()=>{
          this.positionSelectLoading = false;
        })
      } else {
        this.options = [];
      }
    }
  }
};
</script>

<style>
.add-drawer {
  margin-top: 0.8rem;
}
</style>
