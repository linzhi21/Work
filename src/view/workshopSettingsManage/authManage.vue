// 权限管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row v-if="false">
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
        style="margin-right: 45px"
        @click="addDialog()"
        >新增模块</el-button
      >
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :paginationIsShow="false"
        :lazy="lazy"
        :load="lazyLoad"
        :data="tableLists"
        :columns="tableHeaderList"
        :total="total"
        :column_index="false"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template slot="operation" slot-scope="{ row }">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" @click="lookDialog(row)">子模块</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" @click="addFunctionDialog(row)"
            >新增子模块</span
          >
          <!-- <el-divider direction="vertical"></el-divider> -->
          <!-- <span class="button cursor" @click="change(row)">{{row.enable?'禁用':'启用'}}</span> -->
        </template>
      </tpms-table>
    </el-row>
    <!-- 模态框 -->
    <el-dialog
      :title="dialogTitleTxt"
      :visible.sync="dialogVisible"
      :before-close="dialogClose"
    >
      <el-form
        :model="form"
        label-width="70px"
        label-position="right"
        size="small"
      >
        <el-row>
          <el-col :span="24" v-if="parentId">
            <el-form-item label="模块名称" style="width: 100%">
              <el-input v-model="parentId" readonly />
            </el-form-item>
          </el-col>
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
                :placeholder="item.placeholder"
              >
                <el-option
                  v-for="(item, i) in item.checkList"
                  :key="i"
                  :label="item.code"
                  :value="item.code"
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
                >{{ radio.label }}</el-radio
              >
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
    <!-- 一级子模块 -->
    <el-dialog
      :title="dialogChildTitleTxt"
      :visible.sync="dialogChild"
      :before-close="dialogChildClose"
    >
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :paginationIsShow="false"
        :lazy="lazy"
        :load="lazyLoad"
        :data="childTableData"
        :columns="tableHeaderList"
        :total="total"
         width="80%"
        :column_index="false"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template slot="operation" slot-scope="{ row }">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" @click="lookChildDialog(row)">子模块</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" @click="addFunctionDialog(row)"
            >新增子模块</span
          >
          <!-- <el-divider direction="vertical"></el-divider> -->
          <!-- <span class="button cursor" @click="change(row)">{{row.enable?'禁用':'启用'}}</span> -->
        </template>
      </tpms-table>
    </el-dialog>

    <!-- 二级子模块 -->
    <el-dialog
      :title="dialogGrandsonTitleTxt"
      :visible.sync="dialogGrandson"
      :before-close="dialogGrandsonClose"
    >
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :paginationIsShow="false"
        :lazy="lazy"
        :load="lazyLoad"
        :data="childTableData"
        :columns="tableHeaderList"
        :total="total"
         width="80%"
        :column_index="false"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template slot="operation" slot-scope="{ row }">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
          <!-- <el-divider direction="vertical"></el-divider> -->
          <!-- <span class="button cursor" @click="change(row)">{{row.enable?'禁用':'启用'}}</span> -->
        </template>
      </tpms-table>
    </el-dialog>
  </div>
</template>

<script>
import { tpmsHeader, tpmsTable } from "../../components";
import {
  authManage,
  sysConfigManage,
} from "../../lib/api/workshopSettingsManage";
import { deepClone } from "@/utils";
export default {
  data() {
    return {
      treeId: 1,
      dialogVisible: false,
      childTableData: "",
      dialogTitleTxt: "",
      dialogType: "",
      dialogChild: false,
      dialogChildTitleTxt: "",
      dialogChildType: "",
      dialogGrandson: false,
      dialogGrandsonType: "",
      dialogGrandsonTitleTxt:"",
      childId:"",
      total: 0,
      load: "lazyLoad",
      rowKey: "id",
      lazy: "lazy",
      parentId: null,
      form: {
        name: "",
        code: "",
        // valueNo:'',
        description: "",
        url: "",
        type: 1,
        sort: 0,
        icon: "",
        groupNo: 0,
        enabled: true,
        parent: null,
      },
      formList: [
        {
          props: "name",
          label: "名称",
          span: 12,
          type: "input",
        },
        {
          props: "code",
          label: "模块编号",
          span: 12,
          type: "input",
        },

        {
          props: "url",
          label: "路径",
          span: 24,
          type: "input",
        },
        {
          props: "description",
          label: "描述",
          span: 24,
          type: "textarea",
          rows: 5,
        },
        {
          props: "sort",
          label: "序号",
          span: 24,
          type: "input",
        },
        {
          props: "groupNo",
          label: "权限组",
          span: 12,
          type: "checkbox",
          checkList: [
            {
              label: "类型1",
              id: 1,
            },
            {
              label: "类型2",
              id: 2,
            },
          ],
        },
      ],
      tableLists: [],
      searchFormList: [
        //  渲染头部功能区的列表
        {
          label: "模块/功能名称",
          labelWidth: "120px",
          props: "name",
          value: "",
          placeholder: "请选择类型",
          type: "input",
        },
      ],
      tableHeaderList: [
        {
          props: "id",
          label: "ID",
        },
        {
          props: "code",
          label: "编号",
        },
        {
          props: "name",
          label: "模块名称",
        },
        {
          props: "description",
          label: "模块描述",
        },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "200px",
        },
      ],
      lastloadNodeMap: new Map(),
      loadNodeMap: new Map(),
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    /** 点击查询按钮 */
    inquireTableData() {
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getTableData();
    },
    /** 加载页面表格数据 */
    async getTableData() {
      // 获取头部搜索组数据
      let data = this.$refs.tpmsTable.getData();
      let pageData = this.$refs.tpmsTable.getData();
      // let groups = await sysConfigManage["getLists"]();
      // this.formList.forEach(val => {
      //   if (val.props == "groupNo") {
      //     val.checkList = groups.data.content;
      //   }
      // });
      authManage["getRoot"]({ ...data, ...pageData }).then((res) => {
        this.tableLists = res.data;
        this.tableLists.forEach((val) => {
          val.hasChildren = true;
        });
        this.formList.forEach((val) => {
          if (val.props == "groupNo") {
            val.checkList = this.tableLists;
          }
        });
        this.total = res.data.totalElements;
      });
    },
    addDialog() {
      this.dialogVisible = true;
      this.dialogTitleTxt = "新增";
      this.dialogType = "add";
      this.form = {};
    },
    addFunctionDialog(row) {
      this.dialogVisible = true;
      this.dialogTitleTxt = "新增子模块";
      this.dialogType = "add";
      this.parentId = row.name;
      this.form.parent = { id: row.id };
    },
    editDialog(row) {
      this.dialogVisible = true;
      this.dialogTitleTxt = "编辑";
      this.dialogType = "edit";
      this.form = deepClone(row);
    },
    lookDialog(row) {
      this.dialogChild = true;
      this.dialogChildTitleTxt = row.name + "-" + "权限管理";
      this.dialogGrandsonType = "look";
      this.childResultdata;
      this.childId = row.id;
      authManage["getParentChild"]("", this.childId).then((res) => {
        let resultdata = res.data;
        console.log(resultdata);
        this.childTableData = resultdata;
        resultdata.forEach((val) => {
          val.hasChildren = "true";
        });
      });
    },
    lookChildDialog(row) {
      this.dialogGrandson = true;
      this.dialogGrandsonTitleTxt = row.name + "-" + "权限管理";
      this.dialogGrandsonType = "look";
      this.childResultdata;
      this.childId = row.id;
      authManage["getParentChild"]("", this.childId).then((res) => {
        let resultdata = res.data;
        console.log(resultdata);
        this.childTableData = resultdata;
        resultdata.forEach((val) => {
          val.hasChildren = "true";
        });
      });
    },
    ok(dialogType) {
      var _self = this;
      authManage[dialogType](this.form).then((res) => {
        this.dialogVisible = false;
        this.parentId = null;
        const _this = this;
        setTimeout(() => {
          this.getTableData();
          // this.lazyLoad(this.tree)
          this.refreshTreeNode();
        }, 3000);

          authManage["getParentChild"]("", this.childId).then((res) => {
          let resultdata = res.data;
          console.log(resultdata);
          this.childTableData = resultdata;
          resultdata.forEach((val) => {
            val.hasChildren = "true";
          });
        });

        this.form = {
          name: "",
          code: "",
          valueNo: "",
          description: "",
          url: "",
          type: "",
          sort: 0,
          icon: "",
          groupNo: 0,
          enable: true,
          parent: null,
        };
      });
    },
    lazyLoad(tree, treeNode, resolve) {
      this.tree = tree;
      // 缓存当前 Node   **重要
      this.loadNodeMap.set(tree.id, { tree, treeNode, resolve });
      // 缓存上次节点的Node
      this.lastloadNodeMap.set(tree.id, { tree, treeNode, resolve });

      authManage["getParentChild"]("", tree.id).then((res) => {
        let resultdata = res.data;
        console.log(resultdata);
        resultdata.forEach((val) => {
          val.hasChildren = "true";
        });
        resolve(resultdata);
      });
    },
    /*
     * 刷新树节点
     */
    refreshTreeNode() {
      const node = this.loadNodeMap.get(this.tree.id);
      if (node === undefined) {
        return;
      }
      // 获取需要刷新节点
      const { tree, treeNode, resolve } = node;
      // 重新展开节点
      this.lazyLoad(tree, treeNode, resolve);
    },
    dialogClose() {
      this.dialogVisible = false;
      this.parentId = null;
      this.form = {
        name: "",
        code: "",
        valueNo: "",
        description: "",
        url: "",
        type: "",
        sort: 0,
        icon: "",
        groupNo: 0,
        enable: true,
        parent: null,
      };
    },
    dialogChildClose() {
      this.dialogChild = false;
    },
     dialogGrandsonClose() {
      this.dialogGrandson = false;
    },
  },
};
</script>

<style>
.add-drawer {
  margin-top: 0.8rem;
}
</style>
