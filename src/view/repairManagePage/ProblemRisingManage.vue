<template>
  <div>
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header
          ref="tpmsHeader"
          :formData="equipmentFormList"
          @inquireTableData="inquireTableData"
        />
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <el-button
            class="button-more"
            type="primary"
            size="small"
            @click="addIsShow=true"
            style="margin-right:30px"
          >新增</el-button>
        </el-row>
        <!-- 底部表格 -->
        <tpms-table
          ref="tpmsTable"
          :data="problemTable"
          :columns="problemTableList"
          @inquireTableData="inquireTableData"
        >
          <template slot-scope="{row}">
            <span class="button" @click="see(row)">编辑</span>
            <span class="button" @click="seeEquipment(row)">删除</span>
          </template>
        </tpms-table>
      </el-card>
    </el-row>
    <!-- 查看问题上升机制的对话框 -->
    <el-dialog title="查看问题上升机制" :visible.sync="checkDialog" width="50%" :before-close="handleClose">
      <div class="check-dialog">
        <p>故障时长(分钟)：1</p>
        <p>推行人：张三</p>
        <p>推送岗位：修理工</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkDialog = false">
          <i class="el-icon-edit"></i>返 回
        </el-button>
      </span>
    </el-dialog>
    <!-- 编辑的对话框 -->
    <el-dialog title="编辑" :visible.sync="editDialog" width="50%" :before-close="handleClose">
      <el-form class="edit-form" :model="editForm" label-width="120px">
        <el-form-item label="故障时长(分钟)">
          <el-input type="text" v-model="editForm.faultTime" placeholder="1"></el-input>
        </el-form-item>
        <el-form-item label="推送人">
          <el-select v-model="editForm.pushPersion" placeholder="推送人">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推送岗位">
          <el-select v-model="editForm.pushWorkshop" placeholder="推送岗位">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">
          <i class="el-icon-edit"></i>取 消
        </el-button>
        <el-button type="primary" @click="editDialog = false">
          <i class="el-icon-edit"></i>保 存
        </el-button>
      </span>
    </el-dialog>
    <!-- 新增的对话框 -->
    <el-dialog title="新增" :visible.sync="newAddDialog" width="50%" :before-close="handleClose">
      <el-form class="edit-form" :model="newAddForm" label-width="120px">
        <el-form-item label="故障时长(分钟)">
          <el-input type="text" v-model="newAddForm.faultTime" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="推送人">
          <el-select v-model="newAddForm.pushPersion" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推送岗位">
          <el-select v-model="newAddForm.pushWorkshop" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newAddDialog = false">
          <i class="el-icon-edit"></i>取 消
        </el-button>
        <el-button type="primary" @click="newAddDialog = false">
          <i class="el-icon-edit"></i>保 存
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable } from "../../components";
export default {
  data() {
    return {
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "推送人", key: "pushPersion", value: "" },
        {
          label: "推送岗位",
          key: "pushWorkshop",
          value: "",
          type: "checkbox",
          checkList: [
            { label: "岗位1", id: 1 },
            { label: "岗位1", id: 2 }
          ]
        }
      ],
      problemTable: [
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        },
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        },
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        },
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        },
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        },
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        },
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        },
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        },
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        },
        {
          faultTime: "SHB023",
          pushPersion: "润滑油站",
          pushWorkshop: "润滑油站"
        }
      ],
      problemTableList: [
        // 渲染表格的表头
        { props: "faultTime", label: "故障时长", width: 120 },
        { props: "pushPersion", label: "推送人" },
        { props: "pushWorkshop", label: "推送岗位" }
      ],
      checkDialog: false, // 控制问题上升机制对话框的打开与关闭
      editDialog: false, // 控制编辑对话框的打开与关闭
      editForm: {
        faultTime: "",
        pushPersion: "",
        pushWorkshop: ""
      },
      newAddDialog: false, // 控制新增对话框的打开与关闭
      newAddForm: {
        faultTime: "",
        pushPersion: "",
        pushWorkshop: ""
      },
      options: [
        { value: "选项1", label: "小龙虾" },
        { value: "选项2", label: "黄金糕" }
      ]
    };
  },
  components: {
    tpmsHeader,
    tpmsTable
  },
  methods: {
    /**
     * @description 分页器中pageSize 改变时触发的事件
     * @param {val} 每页的条数
     */
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    /**
     * @description 分页器中currentPage 改变时触发的事件
     * @param {val} 当前页
     */
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    },
    /**
     * @description 打开查看问题上升机制对话框
     */
    showCheckDialog(row) {
      const _this = this;
      _this.checkDialog = true;
      _this.checkDialogContent = row;
    },
    /**
     * @description 关闭所有的对话框
     */
    handleClose() {
      const _this = this;
      _this.checkDialog = false;
      _this.editDialog = false;
      _this.newAddDialog = false;
    },
    /**
     * @description 打开编辑的对话框
     */
    showEditDialog() {
      const _this = this;
      _this.editDialog = true;
    },
    /**
     * @description 打开新增的对话框
     */
    showNewAddDialog() {
      const _this = this;
      _this.newAddDialog = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-top: 0.2rem;
}
.button {
  color: #2883fe;
}

.check-dialog {
  padding: 0.5rem 20%;
  p {
    padding: 0.1rem 1rem;
    border-bottom: 1px dashed #e9e9e9;
  }
}
.edit-form {
  width: 60%;
  margin: 0 20%;
  .el-input {
    width: 217px;
  }
}
</style>