// 时限管理
<template>
  <div>
    <el-row>
      <tpms-header
        ref="tpmsHeader"
        :formData="timeLimitFormList"
        @inquireTableData="inquireTableData"
      />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button type="primary" size="small" @click="editDialog(0)">新增</el-button>
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
        <template slot="operation" slot-scope="{row}">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
          <span class="button cursor" @click="onDelete(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 编辑 -->
    <el-dialog :title="editDialogTitle" :visible.sync="dialogVisible">
      <el-form :model="timeLimitForm" ref="form" label-width="140px">
        <el-form-item label="时限设置(分钟):">
          <el-input v-model="timeLimitForm.time" size="small" width="140px"></el-input>
        </el-form-item>
        <el-form-item label="所属班次:">
          <el-cascader
            v-model="timeLimitForm.value"
            :props="cascaderProps"
            :placeholder="timeLimitForm.placeholder"
            size="small"
            clearable
            style="width:100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="timeLimitForm.comment" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="initDialog()" size="small">取消</el-button>
        <el-button @click="onEdit(timeLimitForm)" type="primary" size="small">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable } from "../../components";
import { timeLimitApi } from "../../lib/api/system";
import {
  factorySelect,
  workshopSelect,
  workshopShiftSelect
} from "../../lib/api/factory";
export default {
  data() {
    const userInfoLocal = localStorage.getItem("user_info");
    const userInfoObj = JSON.parse(userInfoLocal).principal;
    const type = this.$route.params.type;
    // 获取头部搜索组下拉选择的list
    let getListFuncs = [factorySelect, workshopSelect, workshopShiftSelect];
    let [factorys, workshops, workshopShifts] = getListFuncs.map(
      getListFunc => {
        let arr = [];
        getListFunc().then(res => {
          let data = res.data.content || res.data;
          data.forEach(item => {
            item.label = item.label || item.value;
          });
          arr.push(...data);
        });
        return arr;
      }
    );
    return {
      dialogVisible: false, // 模态框
      timeLimitFormList: [
        {
          label: "工厂",
          props: "factoryId",
          value: "",
          type: "radio",
          checkList: factorys
        },
        {
          label: "车间",
          props: "workshopId",
          value: "",
          type: "radio",
          checkList: workshops
        }
      ],
      cascaderProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level, data } = node;
          setTimeout(() => {
            factorys = factorys.map(item => ({
              value: item.id,
              label: item.label,
              leaf: level >= 2
            }));
            let nodes = factorys;
            if (level == 1) {
              workshopSelect({ factoryId: data.id }).then(res => {
                nodes = res.data.map(item => ({
                  value: item.id,
                  label: item.label,
                  leaf: level >= 2
                }));
                resolve(nodes);
              });
            } else if (level == 2) {
              workshopShiftSelect({ workshopId: data.id }).then(res => {
                nodes = res.data.map(item => ({
                  value: item.id,
                  label: item.label,
                  leaf: level >= 2
                }));
                resolve(nodes);
              });
            } else {
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            }
          }, 500);
        }
      },
      total: 0,
      tableHeaderList: [
        {
          props: "time",
          label: "时限(分钟)"
        },
        {
          props: "workshopShiftName",
          label: "班次"
        },
        {
          props: "workshopName",
          label: "车间"
        },
        {
          props: "factoryName",
          label: "工厂"
        },
        {
          props: "comment",
          label: "备注"
        },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "240px"
        }
      ],
      tableLists: [],
      timeLimitForm: {
        comment: "",
        configType: this.$route.params.type,
        time: 0,
        timeType: 0,
        factoryId: null,
        workshopId: null,
        workshopShiftId: null,
        placeholder: ""
      },
      tabParam: {}, // 时限管理参数
      tableParam: {}, // 超时工单参数
      editDialogTitle: ""
    };
  },
  components: {
    tpmsHeader,
    tpmsTable
  },
  mounted() {
    this.getTableData();
  },
  watch: {
    $route(to, from) {
      //监听路由是否变化
      if (to.params.type != from.params.type) {
        this.getTableData();
      }
    }
  },
  methods: {
    /**
     * 查询事件
     */
    inquireTableData() {
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getTableData();
    },
    /**
     * 初始化数据
     */
    getTableData() {
      // 获取头部搜索组数据
      let data = this.$refs.tpmsHeader.getData();
      data.configType = this.$route.params.type;
      let pageData = this.$refs.tpmsTable.getData();
      timeLimitApi["getTimeLimit"]({ ...data, ...pageData }).then(res => {
        this.total = res.data.totalElements;
        this.tableLists = res.data.content;
      });
    },
    /**
     * 新增时限
     */
    onSubmit(type) {
      this.timeLimitForm.type = type;
      timeLimitApi["postTimeLimit"](this.timeLimitForm).then(res => {
        this.getTableData();
      });
    },
    /**
     * 修改时限
     */
    onEdit(form) {
      this.timeLimitForm.factoryId = form.value[0];
      this.timeLimitForm.workshopId = form.value[1];
      this.timeLimitForm.workshopShiftId = form.value[2];
      timeLimitApi["putTimeLimit"](this.timeLimitForm).then(res => {
        this.$message({
          type: "success",
          message: "保存成功!"
        });
        this.getTableData();
        this.initDialog();
      });
    },
    /**
     * 删除时限
     */
    onDelete(row) {
      this.$confirm("此操作将删除时限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          timeLimitApi["deleteTimeLimit"]({
            ids: row.id
          }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getTableData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editDialog(status) {
      this.dialogVisible = true;
      if (status === 0) {
        this.editDialogTitle = "新增";
      } else {
        this.editDialogTitle = "编辑";
        status.placeholder = `${status.factoryName}/${status.workshopName}/${status.workshopShiftName}`;
        this.timeLimitForm = status;
      }
    },
    initDialog() {
      this.timeLimitForm = {
        comment: "",
        configType: this.$route.params.type,
        time: 0,
        timeType: 0,
        factoryId: null,
        workshopId: null,
        workshopShiftId: null,
        placeholder: ""
      };
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.buttom-group {
  padding: 20px 30px 20px 0;
  div {
    margin-left: 10px;
  }
}
</style>