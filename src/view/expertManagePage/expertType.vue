// 专家类型设置
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header
        ref="tpmsHeader"
        :Btnoffset="8"
        :formData="authFormList"
        @inquireTableData="inquireTableData"
      />
    </el-row>
    <el-row>
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button type="primary" size="small" @click="dialog_add.isShow = true"
          >新增</el-button
        >
      </el-row>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :data="table.data"
        :total="table.total"
        :columns="[
          { label: '专家类型名称', props: 'name' },
          { label: '设备资料类型描述', props: 'description' },
          {
            label: '是否启用',
            props: 'enable',
            translate: (val) => (val ? '已启用' : '已禁用'),
          },
        ]"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template slot-scope="{ row }">
          <span class="button cursor" @click="editClick(row)">编辑</span>
          <span class="button cursor" @click="delClick(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 新增专家类型模态框 -->
    <el-dialog
      width="500px"
      title="新增专家类型"
      center
      :visible.sync="dialog_add.isShow"
      @close="$refs.dialog_add.resetFields()"
    >
      <el-form
        ref="dialog_add"
        label-width="140px"
        :model="dialog_add.data"
        :rules="dialog_add.rules"
      >
        <el-form-item label="专家类型名字" prop="name" required>
          <el-input v-model="dialog_add.data.name"></el-input>
        </el-form-item>
        <el-form-item label="设备资料类型描述" prop="description" required>
          <el-input
            v-model="dialog_add.data.description"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="dialog_add.data.enable"></el-switch>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="dialog_add.isShow = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            $refs.dialog_add.validate(
              (validate) => validate && beforeAddThemeType()
            )
          "
          >保存</el-button
        >
      </el-row>
    </el-dialog>

    <!-- 编辑专家类型模态框 -->
    <el-dialog
      width="500px"
      title="编辑专家类型"
      center
      :visible.sync="dialog_edit.isShow"
      @close="$refs.dialog_edit.resetFields()"
    >
      <el-form
        ref="dialog_edit"
        label-width="140px"
        :model="dialog_edit.data"
        :rules="dialog_edit.rules"
      >
        <el-form-item label="专家类型名字" prop="name" required>
          <el-input v-model="dialog_edit.data.name"></el-input>
        </el-form-item>
        <el-form-item label="设备资料类型描述" prop="description" required>
          <el-input
            v-model="dialog_edit.data.description"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="dialog_edit.data.enable"></el-switch>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="dialog_edit.isShow = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            $refs.dialog_edit.validate((validate) => validate && beforeEdit())
          "
          >保存</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { tpmsHeader, tpmsTable } from "../../components";
import { expertTypeManage } from "../../lib/api/expert";
export default {
  data() {
    return {
      authFormList: [
        {
          label: "专家类型名称",
          props: "name",
          value: "",
          "label-width": "100px",
        },
      ],
      table: {
        data: [],
        total: 0,
      },
      // 新增专家类型模态框
      dialog_add: {
        isShow: false,
        data: {
          name: "",
          description: "",
          enable: false,
        },
        rules: {},
      },
      // 智库详情模态框
      dialog_edit: {
        isShow: false,
        id: "",
        data: {},
      },
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
    getTableData() {
      // 获取头部搜索组数据
      let data = this.$refs.tpmsHeader.getData();
      let pageData = this.$refs.tpmsTable.getData();
      expertTypeManage.getList({ ...data, ...pageData }).then((res) => {
        const { content, totalElements } = res.data;
        this.table.data = content;
        this.table.total = totalElements;
      });
    },
    /** 新增专家之前 */
    beforeAddThemeType() {
      this.$confirm("确认新增？", "确认信息", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(this.addThemeType)
        .catch(() => {});
    },
    /** 新增专家 */
    addThemeType() {
      const { data } = this.dialog_add;
      expertTypeManage.add(data).then((res) => {
        this.$message.success("新增完成");
        this.getTableData();
        this.dialog_add.isShow = false;
      });
    },
    /** 点击编辑按钮 */
    editClick({ id }) {
      this.dialog_edit.isShow = true;
      this.dialog_edit.id = id;
      expertTypeManage.getDetail(null, id).then((res) => {
        console.log(res);
        this.dialog_edit.data = res.data;
      });
    },
    /** 提交修改之前 */
    beforeEdit() {
      this.$confirm("确认修改？", "确认信息", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(this.edit)
        .catch(() => {});
    },
    /** 确认提交修改 */
    edit() {
      const { id, data } = this.dialog_edit;
      expertTypeManage.edit(data, id).then((res) => {
        this.$message.success("修改成功");
        this.getTableData();
        this.dialog_edit.isShow = false;
      });
    },
    /**
     * 删除
     */
    delClick(row) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          expertTypeManage.remove(row.id).then(() => {
            this.$message.success("删除成功");
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
  },
};
</script>

<style lang='scss' scoped>
</style>
