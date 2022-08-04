// 故障类型管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref="tpmsHeader" :Btnoffset="8" :formData="authFormList" @inquireTableData="inquireTableData" />
    </el-row>
    <el-row>
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button type="primary" size="small" @click="dialog_add.isShow = true">新增</el-button>
        <el-button size="small" @click='deleteMore'>
          批量删除
        </el-button>
      </el-row>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table ref="tpmsTable" :data="tableData" :total="tableTotal" :columns="[
        { type: 'selection' },
        { label: '故障名称', props: 'faultName' },
        { label: '工厂', props: 'factoryName' },
        { label: '车间', props: 'workshopName' },
        { label: '描述', props: 'faultDesc' },
        {
          label: '操作',
          slotName: 'operation',
        },
      ]" @inquireTableData="inquireTableData" @getTableData="getTableData" @selection-change="handleSelectionChange">
        <template slot="operation" slot-scope="{row}">
          <span class="button cursor" @click="editClick(row)">编辑</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 新增故障类型模态框 -->
    <el-dialog width="500px" title="新增故障类型" center :visible.sync="dialog_add.isShow"
      @close="$refs.dialog_add.resetFields()">
      <el-form ref="dialog_add" label-width="100px" :model="dialog_add.data" :rules="dialog_add.rules">
        <el-form-item label="故障名称" prop="faultName" required>
          <el-input v-model="dialog_add.data.faultName" placeholder="故障名称" style="width:100%;" />
        </el-form-item>
        <el-form-item label="工厂" prop="factoryId" required>
          <el-select v-model="dialog_add.data.factoryId" placeholder="工厂" style="width:100%;">
            <el-option v-for="item in dialog_add.list.factoryList" :label="item.label" :value="item.id" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车间" prop="workshopId" required>
          <el-select v-model="dialog_add.data.workshopId" placeholder="车间" style="width:100%;">
            <el-option v-for="item in dialog_add.list.workshopList" :label="item.label" :value="item.id" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="故障描述" prop="faultDesc">
          <el-input v-model="dialog_add.data.faultDesc" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="dialog_add.isShow = false">取消</el-button>
        <el-button type="primary" @click="$refs.dialog_add.validate(validate => validate && beforeAddFalutType())">保存
        </el-button>
      </el-row>
    </el-dialog>

    <!-- 编辑故障类型模态框 -->
    <el-dialog width="500px" title="编辑故障类型" center :visible.sync="dialogEdit.isShow"
      @close="$refs.dialogEdit.resetFields()">
      <el-form ref="dialogEdit" label-width="100px" :model="dialogEdit.data" :rules="dialogEdit.rules">
        <el-form-item label="故障名称" prop="faultName" required>
          <el-input v-model="dialogEdit.data.faultName"></el-input>
        </el-form-item>
        <el-form-item label="工厂" prop="factoryId" required>
          <el-select v-model="dialogEdit.data.factoryId" placeholder="工厂" style="width:100%;">
            <el-option v-for="item in dialogEdit.list.factoryList" :label="item.label" :value="item.id" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车间" prop="workshopId" required>
          <el-select v-model="dialogEdit.data.workshopId" placeholder="车间" style="width:100%;">
            <el-option v-for="item in dialogEdit.list.workshopList" :label="item.label" :value="item.id"
              :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="故障描述" prop="faultDesc">
          <el-input v-model="dialogEdit.data.faultDesc" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="dialogEdit.isShow = false">取消</el-button>
        <el-button type="primary" @click="$refs.dialogEdit.validate(validate => validate && beforeEdit())">保存
        </el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  tpmsHeader,
  tpmsTable
} from '../../components';
import { faultTypeController } from '../../lib/api/business';
import { factoryManage, workshopManage } from '../../lib/api/workshopSettingsManage';
export default {
  data() {
    const getListFuncs = [
      faultTypeController.getNames,
      factoryManage.getNames,
      workshopManage.getNames
    ];
    // 工厂和车间下拉列表
    const [faultName, factoryList, workshopList] = getListFuncs.map(func => {
      const arr = [];
      func().then(res => {
        arr.push(...res.data)
      });
      return arr;
    });
    return {
      authFormList: [
        { label: "故障名称", props: "faultName", value: "", },
        { label: "工厂", props: "factoryId", value: "", type: "radio", checkList: factoryList },
        { label: "车间", props: "workshopId", value: "", type: "radio", checkList: workshopList },
      ],
      table: {
        data: [],
        total: 0
      },
      tableData: [],
      tableTotal: 0,
      // 新增故障类型模态框
      dialog_add: {
        isShow: false,
        list: {
          factoryList,//工厂选项
          workshopList,//车间选项
        },
        data: {
          faultName: '',//故障名称
          factoryId: '',//工厂ID
          workshopId: '',//车间ID
          faultDesc: '',//故障描述
        },
        rules: {}
      },
      // 智库编辑模态框
      dialogEdit: {
        isShow: false,
        list: {
          factoryList,//工厂选项
          workshopList,//车间选项
        },
        id: '',
        data: {},
      },
    }
  },
  components: {
    tpmsHeader, tpmsTable
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
      faultTypeController.getList({ ...data, ...pageData }).then(res => {
        const { content, totalElements } = res.data;
        this.tableData = content;
        this.tableTotal = totalElements;
      })
    },
    /** 新增故障之前 */
    beforeAddFalutType() {
      this.$confirm("确认新增？", "确认信息", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(this.addFalutType)
        .catch(() => {
        });
    },
    /** 新增故障 */
    addFalutType() {
      const { data } = this.dialog_add;
      faultTypeController.add(data).then(res => {
        this.$message.success('新增完成');
        this.getTableData();
        this.dialog_add.isShow = false;
      })
    },
    /** 点击编辑按钮 */
    editClick(row) {
      this.dialogEdit.isShow = true;
      this.dialogEdit.id = row.id;
      let data = row
      this.dialogEdit.data = {...data};
      //   faultTypeController.getDetail(null, id).then(res => {
      //     this.dialogEdit.data = res.data;
      //   });
    },
    /**批量删除 */
    deleteMore() {
      const selected = this.selected
      const ids = selected.map((item) => item.id);
      this.$confirm("此操作将删除该故障, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          faultTypeController.remove({ ids: `${ids}` }).then((res) => {
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
    /** 提交修改之前 */
    beforeEdit() {
      this.$confirm("确认修改？", "确认信息", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(this.edit)
        .catch(() => {
        });
    },
    /** 确认提交修改 */
    edit() {
      const { id, data } = this.dialogEdit;
      faultTypeController.edit(data, id).then(res => {
        this.$message.success('修改成功')
        this.getTableData();
        this.dialogEdit.isShow = false;
      });
    },
    /**批量选择 */
    handleSelectionChange(e) {
      this.selected = e
    },
  }
};
</script>

<style lang='scss' scoped>
</style>
