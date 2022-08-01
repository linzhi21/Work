// 班次管理
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
        style="margin-right: 45px"
        @click="addDialog()"
        >新增</el-button
      >
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :total="total"
        :data="tableLists"
        :columns="tableHeaderList"
        :column_index="true"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template slot="operation" slot-scope="{ row }">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
          <span class="button cursor" @click="del(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>

    <el-dialog
      :title="dialogTitleTxt"
      :visible.sync="dialogVisible"
      :before-close="dialogClose"
    >
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="form"
        label-width="100px"
        label-position="right"
      >
        <el-row>
          <el-col
            :span="item.span"
            v-for="(item, index) in formList"
            :key="index"
          >
            <el-form-item
              :prop="item.props"
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
              <el-tree
                style="top: 8px"
                :data="item.treedata"
                show-checkbox
                node-key="id"
                v-else-if="item.type === 'tree'"
              >
              </el-tree>
              <el-time-picker
                v-model="form[item.props]"
                placeholder="任意时间点"
                v-else-if="item.type === 'timePicker'"
              ></el-time-picker>

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
import { tpmsHeader, tpmsTable } from "../../components";
import {
  workshopShiftManage,
  workshopManage,
} from "../../lib/api/workshopSettingsManage";
import { deepClone } from "@/utils";
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
      parentId: null,
      tableLists: [],
      searchFormList: [
        //  渲染头部功能区的列表
        {
          label: "班次",
          props: "name",
          value: "",
          placeholder: "",
          type: "input",
        },
        {
          label: "状态",
          props: "enable",
          value: "",
          placeholder: "请选择状态",
          type: "radio",
          checkList: [
            {
              label: "启用",
              id: true,
            },
            {
              label: "禁用",
              id: false,
            },
          ],
        },
      ],
      tableHeaderList: [
        {
          props: "workshopName",
          label: "所属车间",
        },
        {
          props: "name",
          label: "班次",
        },
        {
          props: "description",
          label: "班次描述",
        },
        {
          props: "startTime",
          label: "开启时间",
        },
        {
          props: "endTime",
          label: "结束时间",
        },
        {
          props: "enable",
          label: "状态",
          translate: (value) => (value ? "启用" : "禁用"),
        },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "120px",
        },
      ],
      form: {
        name: "",
        description: "",
        workshopId: null,
        enable: true,
        startTime: null,
        endTime: null,
        workshopName: "",
      },

      formList: [
        {
          props: "name",
          label: "班次名称",
          span: 24,
          type: "input",
        },
        {
          props: "startTime",
          label: "开始时间",
          span: 12,
          type: "timePicker",
        },
        {
          props: "endTime",
          label: "结束时间",
          span: 12,
          type: "timePicker",
        },
        {
          props: "description",
          label: "班次描述",
          span: 24,
          type: "textarea",
        },
        {
          props: "enable",
          label: "班次状态",
          span: 24,
          type: "radio",
          radioList: [
            {
              label: "启用",
              id: true,
            },
            {
              label: "禁用",
              id: false,
            },
          ],
        },
      ],
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        no: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur",
          },
        ],
        enable: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
        workshopId: [
          {
            required: true,
            message: "请选择所属车间",
            trigger: "change",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
  },
  mounted() {
    this.getTableData();
    workshopManage["getLists"]().then((res) => {
      let workshopLists = [];
      res.data.content.forEach((val) => {
        workshopLists.push({
          key: val.name,
          value: val.id,
        });
      });

      // this.workshopLists=workshopLists
      this.formList.unshift({
        props: "workshopId",
        label: "所属车间",
        span: 24,
        type: "checkbox",
        filterable: true,
        checkList: workshopLists,
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
          workshopShiftManage.remove(row.id).then((res) => {
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
      let pageData = this.$refs.tpmsTable.getData();
      workshopShiftManage["getLists"]({ ...data, ...pageData }).then((res) => {
        this.total = res.data.totalElements;
        this.tableLists = res.data.content;
        // console.log(this.tableLists)
      });
    },
    addDialog() {
      this.dialogVisible = true;
      this.dialogTitleTxt = "新增";
      this.dialogType = "add";

      this.form = {};
      let startTime = this.form.startTime.split(":");
      let endTime = this.form.endTime.split(":");
      this.form.startTime = new Date(
        0,
        0,
        0,
        startTime[0],
        startTime[1],
        startTime[2]
      );
      this.form.endTime = new Date(0, 0, 0, endTime[0], endTime[1], endTime[2]);
    },
    editDialog(row) {
      console.log(row);
      this.form = deepClone(row);
      let startTime = this.form.startTime.split(":");
      let endTime = this.form.endTime.split(":");
      this.form.startTime = new Date(
        0,
        0,
        0,
        startTime[0],
        startTime[1],
        startTime[2]
      );
      this.form.endTime = new Date(0, 0, 0, endTime[0], endTime[1], endTime[2]);
      this.dialogVisible = true;
      this.dialogTitleTxt = "编辑";
      this.dialogType = "edit";
      // workshopShiftManage['getOne']('',row.id).then(res => {
      //   this.form=res.data
      //   this.dialogVisible = true
      //   this.dialogTitleTxt = '编辑'
      //   this.dialogType='edit'
      //   this.form.workshopId-=0
      //   console.log(this.form)
      // })
    },
    dialogClose() {
      this.dialogVisible = false;
      this.form = {
        name: "",
        description: "",
        workshopId: null,
        enable: true,
        startTime: null,
        endTime: null,
      };
    },
    ok(dialogType) {
      var _self = this;
      let form = this.form;
      // delete form.workshopName;
      console.log(this.form);
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let startTimeH =
            new Date(this.form.startTime).getHours() < 10
              ? "0" + new Date(this.form.startTime).getHours()
              : new Date(this.form.startTime).getHours();
          let startTimeM =
            new Date(this.form.startTime).getMinutes() < 10
              ? "0" + new Date(this.form.startTime).getMinutes()
              : new Date(this.form.startTime).getMinutes();
          let startTimes =
            new Date(this.form.startTime).getSeconds() < 10
              ? "0" + new Date(this.form.startTime).getSeconds()
              : new Date(this.form.startTime).getSeconds();
          let endTimeH =
            new Date(this.form.endTime).getHours() < 10
              ? "0" + new Date(this.form.endTime).getHours()
              : new Date(this.form.endTime).getHours();
          let endTimeM =
            new Date(this.form.endTime).getMinutes() < 10
              ? "0" + new Date(this.form.endTime).getMinutes()
              : new Date(this.form.endTime).getMinutes();
          let endTimes =
            new Date(this.form.endTime).getSeconds() < 10
              ? "0" + new Date(this.form.endTime).getSeconds()
              : new Date(this.form.endTime).getSeconds();
          this.form.startTime =
            startTimeH + ":" + startTimeM + ":" + startTimes;
          this.form.endTime = endTimeH + ":" + endTimeM + ":" + endTimes;
          workshopShiftManage[dialogType](form, form.id).then((res) => {
            this.$message.success("操作成功");
            this.dialogVisible = false;
            this.getTableData();
            this.form = {
              name: "",
              description: "",
              workshopId: null,
              enable: true,
              startTime: null,
              endTime: null,
            };
          });
        } else {
          return false;
        }
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
