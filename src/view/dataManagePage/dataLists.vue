// 资料库
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
          style="margin-right:29px"
          @click="addDialog(drawer = true, 'add')"
        >新增</el-button>
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
      >
        <template slot-scope="{row}">
          <span class="button cursor" v-if="row.accessories" @click="preview(row)">
            预览
            <el-divider direction="vertical"></el-divider>
          </span>

          <span class="button cursor" @click="addDialog(drawer = true, 'edit', row)">修改</span>
          <el-divider direction="vertical"></el-divider>
          <span class="button cursor" @click="isDelete(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 抽屉 -->
    <el-drawer :title="drawerTitle" :visible.sync="drawer" :with-header="false">
      <div class="drawer-content">
        <div class="drawer-title">{{drawerTitle}}</div>
        <el-form label-position="right" label-width="100px" :model="formObj">
          <el-form-item label="资料名称">
            <el-input v-model="formObj.name"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="formObj.deviceDataBaseTypeId" placeholder="请选择">
              <el-option
                v-for="item in dataBaseTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联设备">
            <el-autocomplete
              v-model="formObj.deviceName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="关联设备编号">
            <el-input v-model="formObj.deviceNo" readonly></el-input>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="formObj.keyword"></el-input>
          </el-form-item>
          <el-form-item label="资料/文件">
            <tpms-choosefile
              style="margin-left:10px ;"
              size="small"
              @getFileData="getMutipleFileData($event)"
              type="default"
              text="上传附件"
            ></tpms-choosefile>
          </el-form-item>
        </el-form>
        <div class="drawer-footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button
            type="primary"
            @click="action()"
            :loading="loading"
          >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { tpmsHeader, tpmsTable, tpmsChoosefile } from "../../components";
import {
  workshopManage,
  factoryManage
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
          checkList: [{ label: "", id: 1 }]
        },
        {
          label: "车间名称",
          props: "workshopId",
          value: "",
          placeholder: "",
          type: "radio",
          checkList: [{ label: "", id: 1 }]
        },
        {
          label: "资料名称",
          props: "factoryId"
        },
        {
          label: "设备名称",
          props: "deviceId",
          value: "",
          placeholder: "",
          type: "radio",
          checkList: [{ label: "", id: 1 }]
        },
      ],
      dataTableList: [
        {
          props: "name",
          label: "资料名称"
        },
        {
          props: "deviceDataBaseTypeName",
          label: "类型"
        },
        {
          props: "deviceName",
          label: "设备名称"
        },
        {
          props: "deviceNo",
          label: "设备编号"
        },
        {
          props: "keyword",
          label: "关键词"
        }
      ],
      drawer: false,
      drawerTitle: "新增",
      drawerType: "edit",
      formObj: {
        accessories: []
      },
      loading: false,
      factoryId: null,
      total: 0,
      devices: [],
      dataBaseTypes: [],
      uploadData: {} // 附件信息
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
    tpmsChoosefile
  },
  mounted() {
    this.getTableData();
    factoryManage["getLists"]().then(res => {
      const factory = res.data.content;
      let factoryList = [];
      factory.forEach(res => {
        factoryList.push({
          id: res.id,
          label: res.name
        });
      });
      this.searchFormList[0].checkList = factoryList;
    });
    workshopManage["getLists"]().then(res => {
      const workshop = res.data.content;
      let workshopCheckList = [];
      workshop.forEach(res => {
        workshopCheckList.push({
          id: res.id,
          label: res.name
        });
      });
      this.searchFormList[1].checkList = workshopCheckList;
    });
    dataBaseTypeApi["select"]().then(res => {
      this.dataBaseTypes = res.data.content;
    });
    device().then(res => {
      const list = res.data.content;
      let l = [];
      list.forEach(r => {
        l.push({
          id: r.id,
          label: r.name
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
        .then(res => {
          this.dataLists = res.data.content;
          this.total = res.data.totalElements;
        })
        .catch(err => {
          this.$message.error(err.error);
        });
    },
    addDialog(s, t, r) {
      if (t === "add") {
        this.drawerTitle = "新增";
      } else {
        this.drawerTitle = "修改";
        dataBaseApi["selectById"](r.id).then(res => {
          this.formObj = res.data;
        });
      }
    },
    action() {
      const data = this.formObj;
      const title = this.drawerTitle;
      if (title === "新增") {
        dataBaseApi["add"](data).then(res => {
          this.$message.success("保存成功");
          this.getTableData();
        });
      } else {
        dataBaseApi["updateById"](data.id, data).then(res => {
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
        type: "warning"
      })
        .then(() => {
          dataBaseApi["del"](r.id).then(() => {
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.getTableData();
          });
        })
        .catch(() => {});
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
      device({ name: queryString }).then(res => {
        const list = res.data.content;
        let l = [];
        list.forEach(r => {
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
      return state => {
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
      uploadAccessory(formData, 8).then(res => {
        this.$store.commit("SET_UPLOADING", false);
        this.formObj.file = res;
        this.formObj.accessories.push({
          accessoryId: res.id,
          accessoryUrl: res.path + res.name
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.add-drawer {
  margin-top: 0.8rem;
}
</style>
