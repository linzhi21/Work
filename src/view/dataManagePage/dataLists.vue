// 资料库
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref="tpmsHeader" :Btnoffset="8" :formData="searchFormList" :total="total"
        @inquireTableData="inquireTableData" @getTableData="getTableData" />
    </el-row>
    <el-row>
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button class="button-more" type="primary" size="small" style="" @click="exportModelFile('/maintainPlan')">
          保养计划</el-button>
        <el-button class="button-more" type="primary" size="small" style="" @click="exportModelFile('/plan')">点巡检计划
        </el-button>
        <el-button class="button-more" type="primary" size="small" style="margin-right: 29px"
          @click="addDialog((drawer = true), 'add')">新增</el-button>
      </el-row>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table ref="tpmsTable" :data="dataLists" :columns="dataTableList" :column_index="true" :total="total"
        @inquireTableData="inquireTableData" @getTableData="getTableData">
        <template slot-scope="{ row }">
          <span class="button cursor" @click="addDialog((drawer = true), 'look', row)">
            查看
            <el-divider direction="vertical"></el-divider>
          </span>

          <span class="button cursor" @click="addDialog((drawer = true), 'edit', row)">修改</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" @click="isDelete(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 抽屉 -->
    <el-drawer :title="drawerTitle" :visible.sync="drawer" :with-header="false">
      <div class="drawer-content">
        <div class="drawer-title">{{ drawerTitle }}</div>
        <el-form label-position="right" label-width="100px" :model="formObj">
          <el-form-item label="资料名称">
            <el-input v-model="formObj.name" :readonly="drawerTitle == '查看'"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="formObj.deviceDataBaseTypeId" placeholder="请选择" :disabled="drawerTitle == '查看'">
              <el-option v-for="item in dataBaseTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联设备">
            <el-autocomplete v-model="formObj.deviceName" :fetch-suggestions="querySearchAsync" placeholder="请输入内容，搜索设备"
              @select="handleSelect" :readonly="drawerTitle == '查看'"></el-autocomplete>
          </el-form-item>
          <el-form-item label="关联设备编号">
            <el-input v-model="formObj.deviceNo" readonly></el-input>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="formObj.keyword" :readonly="drawerTitle == '查看'"></el-input>
          </el-form-item>
          <el-form-item label="资料/文件">
            <tpms-choosefile style="margin-left: 10px" size="small" @getFileData="getMutipleFileData($event)"
              type="default" text="上传附件" v-if="drawerTitle == '修改' || drawerTitle == '新增'"></tpms-choosefile>
            <el-button style="margin-left: 10px" size="small" @click="exportAllFile()" type="primary"
              v-if="drawerTitle == '查看'">下载附件</el-button>
          </el-form-item>
          <el-form-item v-if="drawerTitle == '查看'" label="文件列表">
            <div v-for="(acc, index) in formObj.deviceDataBaseAccessories" :key="index">{{acc.accessoryUrl}}</div>
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
import axios from "axios";
import apiConfig from "../../lib/api/apiConfig";
import { tpmsHeader, tpmsTable, tpmsChoosefile } from "../../components";
import {
  workshopManage,
  factoryManage,
} from "../../lib/api/workshopSettingsManage";
import { device } from "../../lib/api/device";
import { dataBaseApi, dataBaseTypeApi } from "../../lib/api/dataBase";
import { uploadAccessory } from "../../lib/api/accessory";
export default {
  data() {
    return {
      dataLists: [],
      searchFormList: [
        //  渲染头部功能区的列表
        {
          label: "工厂名称",
          props: "factoryId",
          value: "",
          placeholder: "",
          type: "radio",
          checkList: [{ label: "", id: 1 }],
        },
        {
          label: "车间名称",
          props: "workshopId",
          value: "",
          placeholder: "",
          type: "radio",
          checkList: [{ label: "", id: 1 }],
        },
        {
          label: "资料名称",
          props: "factoryId",
        },
        {
          label: "设备名称",
          props: "deviceId",
          value: "",
          placeholder: "",
          type: "radio",
          checkList: [{ label: "", id: 1 }],
        },
      ],
      dataTableList: [
        {
          props: "name",
          label: "资料名称",
        },
        {
          props: "deviceDataBaseTypeName",
          label: "类型",
        },
        {
          props: "deviceName",
          label: "设备名称",
        },
        {
          props: "deviceNo",
          label: "设备编号",
        },
        {
          props: "keyword",
          label: "关键词",
        },
      ],
      drawer: false,
      drawerTitle: "新增",
      drawerType: "edit",
      formObj: {
        deviceDataBaseAccessories: [],
      },
      loading: false,
      factoryId: null,
      total: 0,
      devices: [],
      dataBaseTypes: [],
      uploadData: {}, // 附件信息
      dataId: 0,// 资料id
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile,
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
    dataBaseTypeApi["select"]().then((res) => {
      this.dataBaseTypes = res.data.content;
    });
    device().then((res) => {
      const list = res.data.content;
      let l = [];
      list.forEach((r) => {
        l.push({
          id: r.id,
          label: r.name,
        });
      });
      this.searchFormList[3].checkList = l;
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
      dataBaseApi["select"]({ ...data, ...pageData })
        .then((res) => {
          this.dataLists = res.data.content;
          this.total = res.data.totalElements;
        })
        .catch((err) => {
          this.$message.error(err.error);
        });
    },
    addDialog(s, t, r) {
      if (t === "add") {
        this.drawerTitle = "新增";
      } else if (t === "look") {
        this.drawerTitle = "查看";
        dataBaseApi["selectById"](r.id).then((res) => {
          this.formObj = res.data;
          this.dataId = r.id;
        });
      } else {
        this.drawerTitle = "修改";
        dataBaseApi["selectById"](r.id).then((res) => {
          this.formObj = res.data;
        });
      }
    },
    action() {
      const data = this.formObj;
      const title = this.drawerTitle;
      if (title === "新增") {
        dataBaseApi["add"](data).then((res) => {
          this.$message.success("保存成功");
          this.getTableData();
        });
      } else {
        dataBaseApi["updateById"](data.id, data).then((res) => {
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
          dataBaseApi["del"](r.id, '').then(() => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getTableData();
          });
        })
        .catch(() => { });
    },
    cancelForm() {
      this.loading = false;
      this.formObj = {};
      this.drawer = false;
    },
    /**
     * 搜索设备信息
     */
    querySearchAsync(queryString, cb) {
      device({ name: queryString }).then((res) => {
        const list = res.data.content;
        let l = [];
        list.forEach((r) => {
          r.value = r.name;
          l.push(r);
        });
        this.devices = l;
      });
      const devices = this.devices;
      const results = queryString
        ? devices.filter(this.createStateFilter(queryString))
        : devices;
      let timeout = null;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    /**
     * 搜索设备信息 - 成功回调
     */
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    /**
     * 搜索设备信息 - 选取事件
     */
    handleSelect(e) {
      this.formObj.deviceNo = e.no;
      this.formObj.deviceId = e.id;
    },
    /**
     * 上传附件事件
     */
    getMutipleFileData(files) {
      let formData = new FormData();
      formData.append("file", files);
      formData.append("module", "8");
      this.$store.commit("SET_UPLOADING", true);
      const _this = this;
      uploadAccessory(formData, 8).then((res) => {
        _this.$store.commit("SET_UPLOADING", false);
        _this.formObj.file = res;
        _this.formObj.deviceDataBaseAccessories.push({
          accessoryId: res.id,
          accessoryUrl: res.path + res.name,
        });
      });
    },
    /**
     * 导出所有附件
     */
    exportAllFile() {
      if (this.formObj.deviceDataBaseAccessories) {
        for (let i = 0; i < this.formObj.deviceDataBaseAccessories.length; i++) {
          let id = this.formObj.deviceDataBaseAccessories[i].accessoryId;
          this.exportMutipleFileData(id);
        }
      } else {
        this.$message.warning("对不起，没有附件可下载")
      }
    },
    /**
     * 下载附件文件
     */
    exportMutipleFileData(id) {
      let url = `${apiConfig.downloadAccessory}/${id}`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;
          let fileName = '';
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
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
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    /**
     * 导出模板
     * @param {*} urlStr 
     */
    exportModelFile(urlStr) {
      let url = `${apiConfig.templateDownload}${urlStr}`; //请求下载文件的地址

      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;
          const today = "";
          let fileName = `TPMS-${today}工单详情.xlsx`;
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
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
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-drawer {
  margin-top: 0.8rem;
}
</style>
