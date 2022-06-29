// 工厂管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref="tpmsHeader" :formData="userFormList" @inquireTableData="inquireTableData" />
    </el-row>
    <el-row>
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-dropdown style="margin-right:30px;" trigger="click" placement="bottom">
          <el-button size="small">
            <i class="el-icon-arrow-down el-icon--right"></i>
            导入
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <tpmsChoosefile size="small" text="导入基础信息" @getFileData="importBase($event)" />
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button size="small" style="width:130px;" @click="exportBase">导出基础信息模板</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button type="primary" size="small" @click="addDialog()">新增</el-button>
      </el-row>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :lazy="lazy"
        :load="lazyLoad"
        :data="tableLists"
        :columns="tableHeaderList"
        :total="total"
        @getTableData="getTableData"
        @selection-change="handleSelectionChange"
        @inquireTableData="inquireTableData"
      >
        <template
          slot="operation"
          slot-scope="{row}"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <div v-if="!row.chejian">
            <span class="button cursor" @click="editDialog(row)">编辑</span>
            <span class="button cursor" @click="lookDialog(row)">查看</span>
            <span class="button cursor" @click="del(row,'1')">删除</span>
          </div>
          <div v-else-if="row.chejian=='chejian'">
            <span class="button cursor" @click="editworkshopDialog(row)">编辑</span>
            <span class="button cursor" @click="lookworkshopDialog(row)">查看</span>
            <span class="button cursor" @click="del(row,2)">删除</span>
          </div>
          <div v-else-if="row.chejian=='chejianTou'">
            <span>操作</span>
          </div>
        </template>
      </tpms-table>
    </el-row>
    <!-- 工厂查看 | 编辑页 -->
    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible" :before-close="dialogClose">
      <el-form
        :model="form"
        ref="ruleForm"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item
              :prop="item.props"
              :label="item.label"
              :label-width="item.labelWidth"
              style="width: 100%;"
            >
              <el-select
                :readonly="dialogTitleTxt=='查看'"
                v-model="form[item.props]"
                v-if="item.type==='checkbox'"
                :filterable="item.filterable"
                :placeholder="item.placeholder"
                @change="item.change"
              >
                <el-option
                  v-for="(item,i) in item.checkList"
                  :key="i"
                  :label="item.key"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                :readonly="dialogTitleTxt=='查看'"
                v-model="form[item.props]"
                v-else-if="item.type==='textarea'"
                :rows="item.rows"
                :type="item.type"
              />
              <el-radio
                v-model="form[item.props]"
                v-else-if="item.type==='radio'"
                :label="radio.id"
                v-for="(radio,i) in item.radioList"
                :key="i"
              >{{radio.label}}</el-radio>
              <el-input :readonly="dialogTitleTxt=='查看'" v-model="form[item.props]" v-else />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="ok(dialogType)" v-if="!lookDetail">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 车间查看 | 编辑页 -->
    <el-dialog :title="workshopdialogTitleTxt" :visible.sync="workshopdialogVisible">
      <el-form
        ref="workshopruleForm"
        :rules="workshoprules"
        :model="workShopForm"
        label-width="120px"
        label-position="right"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="所属工厂" style="width: 100%;">
              <el-input v-model="factoryName" readonly="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="item.span" v-for="(item,index) in workShopFormList" :key="index">
            <el-form-item
              :prop="item.props"
              :label="item.label"
              :label-width="item.labelWidth"
              style="width: 100%;"
            >
              <el-select
                v-model="workShopForm[item.props]"
                v-if="item.type==='checkbox'"
                :filterable="item.filterable"
                :placeholder="item.placeholder"
                @change="item.change"
              >
                <el-option
                  v-for="(item,i) in item.checkList"
                  :key="i"
                  :label="item.key"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-model="workShopForm[item.props]"
                v-else-if="item.type==='textarea'"
                :rows="item.rows"
                :type="item.type"
              />
              <el-radio
                v-model="workShopForm[item.props]"
                v-else-if="item.type==='radio'"
                :label="radio.id"
                v-for="(radio,i) in item.radioList"
                :key="i"
              >{{radio.label}}</el-radio>
              <el-input v-model="workShopForm[item.props]" v-else />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="workshopdialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="addWorkShop(dialogType)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { tpmsHeader, tpmsTable, tpmsChoosefile } from "../../components";
import {
  factoryManage,
  workshopManage,
  baseImport
} from "../../lib/api/workshopSettingsManage";
import { getUserLists } from "../../lib/api/userManage";
import apiConfig from "../../lib/api/apiConfig";
import { deepClone } from "@/utils";
import { userFormList, formList, workShopFormList, tableHeaderList, rules, workshoprules } from "../../public/model/factory"
export default {
  data() {
    return {
      userFormList: userFormList,
      dialogVisible: false,
      workshopdialogVisible: false,
      dialogTitleTxt: "",
      workshopdialogTitleTxt: "",
      dialogType: "",
      total: 0,
      load: "lazyLoad",
      lazy: true,
      managerworkNo: null,
      userLists: [],
      lookDetail: false,
      form: {
        address: "",
        description: "",
        managerId: null,
        name: "",
        no: "",
        sapNo: ""
      },
      formList: formList,
      factoryName: null,
      workShopForm: {
        factoryId: null,
        description: "",
        managerId: null,
        name: "",
        no: "",
        enable: true
      },
      workShopFormList: workShopFormList,

      tableLists: [],
      tableHeaderList: tableHeaderList,
      rules: rules,
      workshoprules: workshoprules,
      maps: new Map()
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile
  },
  mounted() {
    this.getTableData();
    let _self = this;
    getUserLists().then(res => {
      let userLists = [];

      res.data.content.forEach(val => {
        userLists.push({
          key: val.name + " " + val.email,
          value: val.id,
          workNo: val.workNo
        });
      });
      this.userLists = userLists;
      if(this.formList.length <= 5){
        this.formList.push({
          props: "managerId",
          label: "工厂负责人",
          span: 24,
          type: "checkbox",
          filterable: true,
          checkList: userLists,
          change(result) {
            let workNo = userLists.filter(wk => {
              return wk.value == result;
            });
            _self.managerworkNo = workNo[0].workNo;
          }
        });
      }
      
      if(this.workShopFormList.length <= 4) {
        this.workShopFormList.push({
          props: "managerId",
          label: "车间负责人",
          span: 24,
          type: "checkbox",
          filterable: true,
          checkList: userLists,
          change(result) {
            let workNo = userLists.filter(wk => {
              return wk.value == result;
            });
            _self.managerworkNo = workNo[0].workNo;
          }
        });
      }
      
    });
  },
  methods: {
    /**选择输入框执行**/
    handleSelectionChange(e) {
      console.log(e);
    },
    /**点击删除按钮**/
    del(row, type) {
      let key = type == 1 ? factoryManage : workshopManage;
      console.log(row.id); 
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          key.remove(null, row.id).then(res => {
            if (res.data >= 1) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getTableData();
              const { id } = this.row; //取出当前删除行的pid
              const { tree, treeNode, resolve } = this.maps.get(id); //根据pid取出对应的节点数据
              // this.$set(this.$refs.tpmsTable.store.states.lazyTreeNodeMap, id, []); //将对应节点下的数据清空，从而实现数据的重新加载
              this.lazyLoad(tree, treeNode, resolve);
              this.$forceUpdate();
            } else {
              this.$message({
                type: "info",
                message: "删除失败!"
              });
            }
            this.getTableData();
          }).catch((err) =>{
          });
        })
        .catch((err) => {
          this.$message({
            type: "info",
            message: "已取消删除"
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
      factoryManage["getLists"]({
        ...pageData,
        ...data
      }).then(res => {
        this.tableLists = res.data.content;
        this.tableLists.forEach(val => {
          val.hasChildren = true;
          val.uniquelyId = val.id + val.no + val.name;
        });
        // console.log(this.tableLists)
        this.total = res.data.totalElements;
      });
    },
    importBase(file) {
      let formData = new FormData();
      formData.append("file", file);
      baseImport(formData).then(res => {
        this.getTableData();
        this.$message.success("导入成功");
      });
    },
    exportBase() {
      let url = `${apiConfig.baseDownload}`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) return;

          let fileName = "factory.xlsx";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
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
          this.$message.error(error);
        });
    },
    addDialog() {
      this.dialogVisible = true;
      this.dialogTitleTxt = "新增";
      this.dialogType = "add";
      this.lookDetail = false;
      this.form = {}
    },
    editDialog(row) {
      factoryManage["getOne"]("", row.id).then(res => {
        this.form = res.data;
        let workNo = this.userLists.filter(wk => {
          return wk.value == row.id;
        });
        if (workNo.length) {
          this.managerworkNo = workNo[0].workNo;
        }
        this.dialogVisible = true;
        this.dialogTitleTxt = "编辑工厂";
        this.dialogType = "edit";
        this.lookDetail = false;
        this.getTableData();
      });
    },
    editworkshopDialog(row) {
      workshopManage["getOne"]("", row.id).then(res => {
        this.workShopForm = res.data;
        let workNo = this.userLists.filter(wk => {
          return wk.value == row.id;
        });
        if (workNo.length) {
          this.managerworkNo = workNo[0].workNo;
        }
        this.workshopdialogVisible = true;
        this.workshopdialogTitleTxt = "编辑车间";
        this.dialogType = "edit";

        this.factoryName = res.data.factoryName;
        this.lookDetail = false;
        this.getTableData();
      });
    },
    lookworkshopDialog(row) {
      workshopManage["getOne"]("", row.id).then(res => {
        this.workShopForm = res.data;
        let workNo = this.userLists.filter(wk => {
          return wk.value == row.id;
        });
        if (workNo.length) {
          this.managerworkNo = workNo[0].workNo;
        }
        this.workshopdialogVisible = true;
        this.workshopdialogTitleTxt = "查看";
        this.factoryName = res.data.factoryName;

      });
    },
    lookDialog(row) {
      factoryManage["getOne"]("", row.id).then(res => {
        this.form = res.data;
        let workNo = this.userLists.filter(wk => {
          return wk.value == row.id;
        });
        if (workNo.length) {
          this.managerworkNo = workNo[0].workNo;
        }
        this.dialogVisible = true;
        this.dialogTitleTxt = "查看";
        this.dialogType = "edit";
        this.lookDetail = true;
      });
    },
    lazyLoad(tree, treeNode, resolve) {
      console.log(tree);
      this.row = tree;
      const pid = tree.id;
      this.maps.set(pid, {
        tree,
        treeNode,
        resolve
      });
      workshopManage["getLists"]({
        factoryId: tree.id
      }).then(res => {
        let chejian = res.data.content;
        chejian.forEach(val => {
          val["chejian"] = "chejian";
          val.uniquelyId = val.id + val.no + val.name;
        });
        console.log(chejian);
        resolve(chejian);
      });
    },
    ok(dialogType) {
      var _self = this;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          factoryManage[dialogType](this.form, this.form.id).then(res => {
            this.dialogVisible = false;
            this.getTableData();
            this.$message.success("操作成功");
            this.form = {
              address: "",
              description: "",
              managerId: null,
              name: "",
              no: ""
            };
          });
        } else {
          return false;
        }
      });
    },
    addWorkShopDialog(row) {
      this.workshopdialogVisible = true;
      console.log(row)
      this.factoryName = row.name;
      this.workShopForm.factoryId = row.id;
      this.workshopdialogTitleTxt = "新增车间";
      this.dialogType = "add";
      this.row = row;
    },
    addWorkShop(dialogType, row) {
      this.$refs["workshopruleForm"].validate(valid => {
        if (valid) {
          workshopManage[dialogType](
            this.workShopForm,
            this.workShopForm.id
          ).then(res => {
            this.workshopdialogVisible = false;
            this.getTableData();
            const { id } = this.row; //取出当前删除行的pid
            const { tree, treeNode, resolve } = this.maps.get(id); //根据pid取出对应的节点数据
            // this.$set(this.$refs.tpmsTable.store.states.lazyTreeNodeMap, id, []); //将对应节点下的数据清空，从而实现数据的重新加载
            this.lazyLoad(tree, treeNode, resolve);
            this.$forceUpdate();
            this.$message.success("操作成功");
            this.workShopForm = {
              factoryId: null,
              description: "",
              managerId: null,
              name: "",
              no: "",
              enable: true
            };
          });
        } else {
          return false;
        }
      });
    },

    dialogClose() {
      this.dialogVisible = false;
      this.form = {
        address: "",
        description: "",
        managerId: null,
        name: "",
        no: ""
      };
      this.managerworkNo = null;
      this.lookDetail = false;
    }
  }
};
</script>

<style>
.add-drawer {
  margin-top: 0.8rem;
}
</style>
