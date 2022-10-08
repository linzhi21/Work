// 资料类型设置
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header
        ref="tpmsHeader"
        :Btnoffset="8"
        :formData="searchFormList"
        @inquireTableData="inquireTableData"
      />
    </el-row>
    <el-row>
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button
          class="button-more"
          type="primary"
          size="small"
          style="margin-right: 29px"
          @click="addDialog((drawer = true), 'add')"
          >新增</el-button
        >
      </el-row>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :data="dataLists"
        :columns="dataTableList"
        :column_index="true"
        :total="total"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template slot-scope="{ row }">
          <span
            class="button cursor"
            @click="addDialog((drawer = true), 'edit', row)"
            >编辑</span
          >
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" @click="isDelete(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 抽屉 -->
    <el-drawer :title="drawerTitle" :visible.sync="drawer" :with-header="false">
      <div class="drawer-content">
        <div class="drawer-title">{{ drawerTitle }}</div>
        <el-form label-position="right" label-width="80px" :model="formObj">
          <el-form-item label="资料类型">
            <el-input v-model="formObj.name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="formObj.description"></el-input>
          </el-form-item>
        </el-form>
        <div class="drawer-footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="action()" :loading="loading">{{
            loading ? "提交中 ..." : "确 定"
          }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { tpmsHeader, tpmsTable } from "../../components";
import {
  workshopManage,
  factoryManage,
} from "../../lib/api/workshopSettingsManage";
import { dataBaseTypeApi } from "../../lib/api/dataBase";
import { Result } from "element-ui";
export default {
  data() {
    return {
      dataLists: [],
      searchFormList: [
        //  渲染头部功能区的列表
        {
          label: "类型名称",
          props: "name",
          value: "",
          placeholder: "",
          type: "input",
        },
      ],
      dataTableList: [
        {
          props: "name",
          label: "类型名称",
        },
        {
          props: "description",
          label: "描述",
        },
      ],
      drawer: false,
      drawerTitle: "新增",
      drawerType: "edit",
      formObj: {},
      loading: false,
      factoryId: null,
      total: 0,
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
  },
  mounted() {
    this.getTableData();
    factoryManage["getLists"]().then((res) => {
      const factory = res.data.content;
      let factoryList = [];
      factory.forEach((res) => {
        factoryList.push({
          id: res.id,
          label: res.name,
        });
      });
      this.searchFormList[0].checkList = factoryList;
    });
    workshopManage["getLists"]().then((res) => {
      const workshop = res.data.content;
      let workshopCheckList = [];
      workshop.forEach((res) => {
        workshopCheckList.push({
          id: res.id,
          label: res.name,
        });
      });
      this.searchFormList[1].checkList = workshopCheckList;
    });
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
      dataBaseTypeApi["select"]({ ...data, ...pageData })
        .then((res) => {
          this.dataLists = res.data.content;
          console.log(this.dataLists);
          this.total = res.data.totalElements;
        })
        .catch((err) => {
          this.$message.error(err.error);
        });
    },
    addDialog(s, t, r) {
      if (t === "add") {
        this.drawerTitle = "新增";
        this.formObj = {
          name:'',
          description:''
        };      
      } else {
        this.drawerTitle = "修改";
        dataBaseTypeApi["selectById"](r.id).then((res) => {
          this.formObj = res.data;
        });
      }
    },
    action() {
      const data = this.formObj;
      const title = this.drawerTitle;

      // console.log(this.dataLists.includes(data.name));
      if (title === "新增") {
        let rusult = this.dataLists.some((item) => {
          if (item.name === data.name) {
            return true;
          }
        });
        if (rusult) {
          this.$message.error("保存失败，有相同的类型名称");
          return;
        }
        dataBaseTypeApi["add"](data).then((res) => {
          this.$message.success("保存成功");

          this.getTableData();
        });
      } else {
        let flag = 0;
        let rusult = false;
        for(let i= 0; i<this.dataLists.length; i++) {
          if(this.dataLists[i].name === data.name) {
            flag++;
          }
        }
        if (flag>1) {debugger
          this.$message.error("保存失败，有相同的类型名称");
          return;
        }
        dataBaseTypeApi["updateById"](data.id, data).then((res) => {
          this.$message.success("保存成功");
          this.getTableData();
        });
      }
      this.formObj = {};
      this.drawer = false;
      this.getTableData();
    },
    isDelete(r) {
      this.$confirm("确定要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dataBaseTypeApi["del"](null, r.id).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getTableData();
          });
        })
        .catch(() => {});
    },
    cancelForm() {
      this.loading = false;
      this.drawer = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.add-drawer {
  margin-top: 0.8rem;
}
</style>
