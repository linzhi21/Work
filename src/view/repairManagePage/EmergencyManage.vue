// 紧急程度管理
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
        <el-button type="primary" size="small" @click="dialog_add.isShow=true">新增</el-button>
      </el-row>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :data="table.data"
        :total="table.total"
        :columns="[
            { label: '紧急程度名称', props: 'emergencyDegreeName' },
            { label: '工厂', props: 'factoryName' },
            { label: '车间', props: 'workshopName' },
            { label: '描述', props: 'emergencyDegreeDesc' },
            { label: '备注', props: 'comment' },
        ]"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template slot-scope="{row}">
          <span class="button cursor" @click="editClick(row)">编辑</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 新增紧急程度模态框 -->
    <el-dialog
      width="500px"
      title="新增紧急程度"
      center
      :visible.sync="dialog_add.isShow"
      @close="$refs.dialog_add.resetFields()"
    >
      <el-form
        ref="dialog_add"
        label-width="120px"
        :model="dialog_add.data"
        :rules="dialog_add.rules"
      >
        <el-form-item label="紧急程度名称" prop="emergencyDegreeName" required>
          <el-input v-model="dialog_add.data.emergencyDegreeName"></el-input>
        </el-form-item>
        <el-form-item label="工厂" prop="factoryId" required>
            <el-select v-model="dialog_add.data.factoryId" placeholder="工厂" style="width:100%;">
                <el-option v-for="item in dialog_add.list.factoryList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="车间" prop="workshopId" required>
            <el-select v-model="dialog_add.data.workshopId" placeholder="车间" style="width:100%;">
                <el-option v-for="item in dialog_add.list.workshopList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="紧急程度描述" prop="emergencyDegreeDesc">
          <el-input v-model="dialog_add.data.emergencyDegreeDesc" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="dialog_add.data.comment" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="dialog_add.isShow=false">取消</el-button>
        <el-button
          type="primary"
          @click="$refs.dialog_add.validate(validate=>validate&&beforeAddFalutType())"
        >保存</el-button>
      </el-row>
    </el-dialog>

    <!-- 编辑紧急程度模态框 -->
    <el-dialog
      width="500px"
      title="编辑紧急程度"
      center
      :visible.sync="dialog_edit.isShow"
      @close="$refs.dialog_edit.resetFields()"
    >
      <el-form
        ref="dialog_edit"
        label-width="120px"
        :model="dialog_edit.data"
        :rules="dialog_edit.rules"
      >
        <el-form-item label="紧急程度名称" prop="emergencyDegreeName" required>
          <el-input v-model="dialog_edit.data.emergencyDegreeName"></el-input>
        </el-form-item>
        <el-form-item label="工厂" prop="factoryId" required>
            <el-select v-model="dialog_edit.data.factoryId" placeholder="工厂" style="width:100%;">
                <el-option v-for="item in dialog_edit.list.factoryList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="车间" prop="workshopId" required>
            <el-select v-model="dialog_edit.data.workshopId" placeholder="车间" style="width:100%;">
                <el-option v-for="item in dialog_edit.list.workshopList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="紧急程度描述" prop="emergencyDegreeDesc">
          <el-input v-model="dialog_edit.data.emergencyDegreeDesc" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="dialog_edit.data.comment" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-button @click="dialog_edit.isShow=false">取消</el-button>
        <el-button
          type="primary"
          @click="$refs.dialog_edit.validate(validate=>validate&&beforeEdit())"
        >保存</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  tpmsHeader,
  tpmsTable
} from '../../components';
import { emergencyDegree } from '../../lib/api/business';
import { factoryManage, workshopManage } from '../../lib/api/workshopSettingsManage';
export default {
  data() {
    const getListFuncs = [
      factoryManage.getNames,
      workshopManage.getNames
    ];
    // 工厂和车间下拉列表
    const [factoryList, workshopList] = getListFuncs.map(func => {
      const arr = [];
      func().then(res => {
        arr.push(...res.data)
      });
      return arr;
    });
    return {
      authFormList: [
        { label: "紧急程度名称", props: "emergencyDegreeName", value: "", 'label-width': '100px' },
        { label: "工厂", props: "factoryId", value: "", type: "radio", checkList: factoryList },
        { label: "车间", props: "workshopId", value: "", type: "radio", checkList: workshopList },
      ],
      table: {
        data: [],
        total: 0
      },
      // 新增紧急程度模态框
      dialog_add: {
        isShow: false,
        list:{
            factoryList,//工厂选项
            workshopList,//车间选项
        },
        data: {
          emergencyDegreeName: '',//紧急程度名称
          factoryId: '',//工厂ID
          workshopId: '',//车间ID
          emergencyDegreeDesc: '',//紧急程度描述
        },
        rules: {}
      },
      // 智库编辑模态框
      dialog_edit: {
        isShow: false,
        list:{
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
      emergencyDegree.getList({ ...data, ...pageData }).then(res => {
        const { content, totalElements } = res.data;
        this.table.data = content;
        this.table.total = totalElements;
      })
    },
    /** 新增紧急程度之前 */
    beforeAddFalutType() {
      this.$confirm("确认新增？", "确认信息", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(this.addFalutType)
        .catch(() => {
        });
    },
    /** 新增紧急程度 */
    addFalutType() {
      const { data } = this.dialog_add;
      emergencyDegree.add(data).then(res => {
        this.$message.success('新增完成');
        this.getTableData();
        this.dialog_add.isShow = false;
      })
    },
    /** 点击编辑按钮 */
    editClick(row) {
      this.dialog_edit.isShow = true;
      this.dialog_edit.id = row.id;
      this.dialog_edit.data = row;
    //   emergencyDegree.getDetail(null, id).then(res => {
    //     this.dialog_edit.data = res.data;
    //   });
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
      const { id, data } = this.dialog_edit;
      emergencyDegree.edit(data, id).then(res => {
        this.$message.success('修改成功')
        this.getTableData();
        this.dialog_edit.isShow = false;
      });
    },

  }
};
</script>

<style lang='scss' scoped>
</style>
