// 车间管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header
        ref="tpmsHeader"
        :formData="searchFormList"
        @inquireTableData="inquireTableData"
      />
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button
          class="button-more"
          type="primary"
          size="small"
          @click="addDialog()"
          >新增车间</el-button
        >
      </el-row>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        @getTableData="getTableData"
        ref="tpmsTable"
        :total="total"
        :data="tableLists"
        :columns="tableHeaderList"
        :column_index="true"
        @inquireTableData="inquireTableData"
      >
        <template slot="operation" slot-scope="{ row }">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
          <!-- <span class="button cursor" @click="del(row)">删除</span> -->
        </template>
      </tpms-table>
    </el-row>
    <!-- 车间 | 编辑页 -->
    <el-dialog
      :title="dialogTitleTxt"
      :visible.sync="dialogVisible"
      :before-close="dialogClose"
    >
      <el-form :model="form" label-width="120px" label-position="right">
        <el-form-item label="所属工厂">
          <el-select v-model="form.factoryName" @change="changeFactory">
            <el-option
              v-for="item in this.factoryList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col
            :span="item.span"
            v-for="(item, index) in formList"
            :key="index"
          >
            <el-form-item
              :label="item.label"
              :label-width="item.labelWidth"
              style="width: 100%"
            >
              <el-select
                v-model="form[item.props]"
                v-if="item.type === 'checkbox'"
                :filterable="item.filterable"
                :placeholder="item.placeholder"
              >
                <el-option
                  v-for="(item, i) in item.checkList"
                  :key="i"
                  :label="item.key"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-model="form[item.props]"
                v-else-if="item.type === 'textarea'"
                :rows="item.rows"
                :type="item.type"
              />
              <el-radio
                v-model="form[item.props]"
                v-else-if="item.type === 'radio'"
                :label="radio.id"
                v-for="(radio, i) in item.radioList"
                :key="i"
              >
                {{ radio.label }}
              </el-radio>
              <el-input
                :readonly="item.readonly"
                v-model="form[item.props]"
                v-else
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok(dialogType)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 车间 | 新增页 -->
    <el-dialog
      :title="workshopdialogTitleTxt"
      :visible.sync="workshopdialogVisible"
    >
      <el-form
        :model="workShopForm"
        :rules="workshoprules"
        ref="workshopruleForm"
        label-width="120px"
        label-position="right"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="所属工厂">
              <el-select v-model="factoryName" @change="changeFactory">
                <el-option
                  v-for="item in this.factoryList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="item.span"
            v-for="(item, index) in workShopFormList"
            :key="index"
          >
            <el-form-item
              :prop="item.props"
              :label="item.label"
              :label-width="item.labelWidth"
              style="width: 100%"
            >
              <el-select
                v-model="workShopForm[item.props]"
                v-if="item.type === 'checkbox'"
                :filterable="item.filterable"
                :placeholder="item.placeholder"
                @change="item.change"
              >
                <el-option
                  v-for="(item, i) in item.checkList"
                  :key="i"
                  :label="item.key"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-model="workShopForm[item.props]"
                v-else-if="item.type === 'textarea'"
                :rows="item.rows"
                :type="item.type"
              />
              <el-radio
                v-model="workShopForm[item.props]"
                v-else-if="item.type === 'radio'"
                :label="radio.id"
                v-for="(radio, i) in item.radioList"
                :key="i"
                >{{ radio.label }}</el-radio
              >
              <el-input v-model="workShopForm[item.props]" v-else />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="workshopdialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="addWorkShop(dialogType)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { tpmsHeader, tpmsTable } from "../../components";
import {
  workshopManage,
  factoryManage,
} from "../../lib/api/workshopSettingsManage";
import {
  formList,
  workShopFormList,
  tableHeaderList,
  rules,
  workshoprules,
} from "../../public/model/factory";
import { getUserLists } from "../../lib/api/userManage";
import { editForm, editFormList } from "../../public/model/user";
import { deepClone } from "@/utils";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogTitleTxt: "",
      dialogType: "",
      workshopdialogVisible: false,
      workshopdialogTitleTxt: "",
      editForm: editForm,
      factoryName: "",
      workShopForm: {
        factoryId: null,
        description: "",
        managerId: null,
        name: "",
        no: "",
        enable: true,
      },
      workShopFormList: workShopFormList,
      formList: formList,
      rules: rules,
      workshoprules: workshoprules,
      total: 0,
      load: "lazyLoad",
      rowKey: "id",
      lazy: "lazy",
      parentId: null,
      tableLists: [],
      searchFormList: [
        {
          label: "工厂名称",
          props: "factoryName",
          placeholder: "",
          type: "input",
        },
        {
          label: "车间名称",
          props: "name",
          placeholder: "",
          type: "input",
        },
      ],
      tableHeaderList: [
        {
          props: "no",
          label: "编号",
        },
        {
          props: "factoryName",
          label: "工厂名称",
        },
        {
          props: "name",
          label: "车间名称",
        },
        {
          props: "description",
          label: "车间描述",
        },
        {
          props: "managerName",
          label: "车间负责人",
        },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "120px",
        },
      ],
      form: {
        no: "",
        name: "",
        managerId: null,
        factoryName: "",
        factoryId: "",
        description: "",
      },
      formList: [
        {
          props: "no",
          label: "车间编号",
          span: 12,
          type: "input",
          // readonly: true,
        },
        {
          props: "name",
          label: "车间",
          span: 12,
          type: "input",
          // readonly: true,
        },
        {
          props: "description",
          label: "车间描述",
          span: 24,
          type: "textarea",
        },
      ],
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
  },
  mounted() {
    this.getTableData();
    let _self = this;
    getUserLists().then((res) => {
      let userLists = [];
      res.data.content.forEach((val) => {
        userLists.push({
          key: val.name + " " + val.email,
          value: val.id,
          workNo: val.workNo,
        });
      });
      this.userLists = userLists;

      this.formList.push({
        props: "managerName",
        label: "车间负责人",
        span: 24,
        type: "checkbox",
        filterable: true,
        checkList: userLists,
      });
      this.workShopFormList[4].checkList = userLists;
    });

    factoryManage["getNames"]().then((res) => {
      this.factoryList = res.data;
      this.userFormList.forEach((item) => {
        if (item.props === "factoryId") {
          item.checkList = res.data;
        }
      });
    });
  },
  methods: {
    /**删除**/
    del(row) {
      this.$confirm("确定是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(row);
          workshopManage.remove(row.id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTableData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
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
      console.log(data)
      let pageData = this.$refs.tpmsTable.getData();
      workshopManage["getLists"]({
        ...data,
        ...pageData,
      }).then((res) => {
        this.tableLists = res.data.content;
        this.total = res.data.totalElements;
      });
    },
    editDialog(row) {
      this.dialogVisible = true;
      this.dialogTitleTxt = "编辑";
      this.dialogType = "edit";
      this.form = deepClone(row);
    },
    addDialog() {
      this.workshopdialogVisible = true;
      this.workshopdialoTitleTxt = "添加";
      this.dialogType = "add";
    },
    dialogClose() {
      this.dialogVisible = false;
      this.form = {};
    },
    changeFactory(row) {
      this.form.factoryId = row;
      this.workShopForm.factoryId = row;
    },
    addWorkShop(dialogType, row) {
      this.$refs["workshopruleForm"].validate((valid) => {
        if (valid) {
          workshopManage[dialogType](
            this.workShopForm,
            this.workShopForm.id
          ).then((res) => {
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
              enable: true,
            };
          });
        } else {
          return false;
        }
      });
    },
    /** 编辑用户时的回调 */
    userChanged(props, info) {
      if (props === "factoryId") {
        // 选择工厂，重置车间及以下
        workshopManage.getNames({ [props]: info[props] }).then((res) => {
          info.selectLists.workshopList = res.data;
          info.selectLists.workshopAreaList = [];
          info.selectLists.workshopSectionList = [];
          info.selectLists.workStationList = [];
          info.workshopId = "";
          info.workshopAreaId = "";
          info.workshopSectionId = "";
          info.workStationId = "";
        });
      }
    },
    addWorkShopDialog() {
      this.workshopdialogVisible = true;
      console.log();
      this.workshopdialogTitleTxt = "新增车间";
      this.dialogType = "add";
    },
    ok(dialogType) {
      var _self = this;
      this.form.factoryName = this.factoryName
      workshopManage[dialogType](this.form, this.form.id).then((res) => {
        this.dialogVisible = false;
        console.log(this.form);
        this.getTableData();
        this.form = {
          factoryId: "",
          factoryName: "",
          address: "",
          description: "",
          managerId: null,
          name: "",
          no: "",
        };
      });
    },
  },
};
</script>

<style>
.add-drawer {
  margin-top: 0.8rem;
}
</style>
