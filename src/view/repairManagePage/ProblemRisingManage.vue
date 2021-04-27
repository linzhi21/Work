// 问题上升机制
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header
        ref="tpmsHeader"
        :Btnoffset="8"
        :formData="authFormList"
        @inquireTableData="inquireTableData"
      >
        <template slot="users" slot-scope="{row}">
            <el-select
              v-model="row.value"
              filterable
              remote
              :remote-method="getUserLists"
              :loading="userList.loading"
              style="width:3.3rem;"
            >
              <el-option
                v-for="option in userList.data"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              ></el-option>
            </el-select>
        </template>
      </tpms-header>
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
            { label: '工厂', props: 'factoryName' },
            { label: '车间', props: 'workshopName' },
            { label: '故障时长(分钟)', props: 'faultDuration' },
            { label: '推送人', props: 'userNames' },
            { label: '推送岗位', props: 'positionNames' },
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

    <!-- 新增故障类型模态框 -->
    <el-dialog
      width="500px"
      title="新增问题上升机制"
      center
      :visible.sync="dialog_add.isShow"
      @close="$refs.dialog_add.resetFields()"
    >
      <el-form
        ref="dialog_add"
        label-width="100px"
        :model="dialog_add.data"
        :rules="dialog_add.rules"
      >
        <el-form-item label="故障时长" prop="faultDuration" required>
          <el-input-number v-model="dialog_add.data.faultDuration" :min="1" label=""></el-input-number>
        </el-form-item>
        <el-form-item label="工厂" prop="factoryId" required>
            <el-select v-model="dialog_add.data.factoryId" placeholder="" style="width:100%;">
                <el-option v-for="item in dialog_add.list.factoryList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="车间" prop="workshopId" required>
            <el-select v-model="dialog_add.data.workshopId" placeholder="" style="width:100%;">
                <el-option v-for="item in dialog_add.list.workshopList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="推送人" prop="users">
            <!-- <el-select v-model="dialog_add.data.users" placeholder="推送人" style="width:100%;">
                <el-option v-for="item in dialog_add.list.workshopList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select> -->
            <el-select
              v-model="dialog_add.data.users"
              multiple
              filterable
              remote
              :remote-method="getUserLists"
              :loading="userList.loading"
              placeholder=""
              style="width:100%;"
            >
              <el-option
                v-for="option in userList.data"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="推送岗位" prop="positions">
            <el-select v-model="dialog_add.data.positions" multiple placeholder="" style="width:100%;">
                <el-option v-for="item in dialog_add.list.positionList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="机制备注" prop="comment">
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

    <!-- 编辑故障类型模态框 -->
    <el-dialog
      width="500px"
      title="编辑问题上升机制"
      center
      :visible.sync="dialog_edit.isShow"
      @close="$refs.dialog_edit.resetFields()"
    >
      <el-form
        ref="dialog_edit"
        label-width="100px"
        :model="dialog_edit.data"
        :rules="dialog_edit.rules"
      >
        <el-form-item label="故障时长" prop="faultDuration" required>
          <el-input-number v-model="dialog_edit.data.faultDuration" :min="1" label=""></el-input-number>
        </el-form-item>
        <el-form-item label="工厂" prop="factoryId" required>
            <el-select v-model="dialog_edit.data.factoryId" placeholder="" style="width:100%;">
                <el-option v-for="item in dialog_edit.list.factoryList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="车间" prop="workshopId" required>
            <el-select v-model="dialog_edit.data.workshopId" placeholder="" style="width:100%;">
                <el-option v-for="item in dialog_edit.list.workshopList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="推送人" prop="users">
            <!-- <el-select v-model="dialog_edit.data.users" placeholder="推送人" style="width:100%;">
                <el-option v-for="item in dialog_edit.list.workshopList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select> -->
            <el-select
              v-model="dialog_edit.data.users"
              multiple
              filterable
              remote
              :remote-method="getUserLists"
              :loading="userList.loading"
              placeholder=""
              style="width:100%;"
            >
              <el-option
                v-for="option in userList.data"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="推送岗位" prop="positions">
            <el-select v-model="dialog_edit.data.positions" multiple placeholder="" style="width:100%;">
                <el-option v-for="item in dialog_edit.list.positionList" :label="item.label" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="机制备注" prop="comment">
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
import { problemUpManage } from '../../lib/api/business';
import { getUserLists } from '../../lib/api/userManage';
import { factoryManage, workshopManage, sysPositionManage } from '../../lib/api/workshopSettingsManage';
export default {
  data() {
    const getListFuncs = [
      factoryManage.getNames,
      workshopManage.getNames,
      sysPositionManage.getNames
    ];
    // 工厂和车间下拉列表
    const [factoryList, workshopList, positionList] = getListFuncs.map(func => {
      const arr = [];
      func().then(res => {
        arr.push(...res.data)
      });
      return arr;
    });
    return {
      authFormList: [
        // { label: "名称", props: "faultName", value: "", },
        { label: "工厂", props: "factoryId", value: "", type: "radio", checkList: factoryList },
        { label: "车间", props: "workshopId", value: "", type: "radio", checkList: workshopList },
        // { label: "推送人", props: "factoryId", value: "", type: "radio", checkList: factoryList },
        // { label: "推送人", props: "users", slotName: "users" },
        // { label: "推送岗位", props: "positions", value: "", type: "radio", checkList: positionList },
      ],
      table: {
        data: [],
        total: 0
      },
      userList:{//用户下拉列表
        loading: false,
        data:[]
      },
      // 新增故障类型模态框
      dialog_add: {
        isShow: false,
        list:{
            factoryList,//工厂选项
            workshopList,//车间选项
            positionList,//推送岗位选项
        },
        data: {
          faultDuration: 1,//故障时长
          factoryId: '',//工厂ID
          workshopId: '',//车间ID
          users: [],
          positions: [],
          comment: '',//备注
        },
        rules: {}
      },
      // 智库编辑模态框
      dialog_edit: {
        isShow: false,
        list:{
            factoryList,//工厂选项
            workshopList,//车间选项
            positionList,//推送岗位选项
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
      const data = this.$refs.tpmsHeader.getData();
      const pageData = this.$refs.tpmsTable.getData();
      // data.users = data.users.split(',');
      // data.positions = data.positions.split(',');
      console.log(data)
      problemUpManage.getList({ ...data, ...pageData }).then(res => {
        const { content, totalElements } = res.data;
        this.table.data = content;
        this.table.total = totalElements;
      })
    },
    // 用户下拉列表
    getUserLists(name){
      if(name){
        this.userList.loading = true;
        getUserLists({name,page:0,size:100}).then(res=>{
          const list = res.data.content.map(item=>({label: item.name, id: item.id}));
          this.userList.data.splice(0,100,...list);
          this.userList.loading = false;
        })
      }
    },
    /** 新增故障之前 */
    beforeAddFalutType() {
      const {users, positions} = this.dialog_add.data;
      if(users.length === 0 && positions.length === 0){
        this.$message.warning('请选择推送人或推送岗位');
        return;
      };
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
      problemUpManage.add(data).then(res => {
        this.$message.success('新增完成');
        this.getTableData();
        this.dialog_add.isShow = false;
      })
    },
    /** 点击编辑按钮 */
    editClick(row) {
      this.dialog_edit.isShow = true;
      this.dialog_edit.id = row.id;
      // 显示详情时，推送人 通过id回显名称
      row.userNames.split(',').map((item, i) => {
        this.userList.data.push({
          id: row.users[i],
          label: item
        });
      });
      this.dialog_edit.data = row;
    //   problemUpManage.getDetail(null, id).then(res => {
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
      problemUpManage.edit(data, id).then(res => {
        this.$message.success('修改成功');
        this.getTableData();
        this.dialog_edit.isShow = false;
      });
    },

  }
};
</script>

<style lang='scss' scoped>
</style>
