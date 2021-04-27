<template>
  <!-- <el-row style="height:90vh;">
        <tpms-table :data="tableData" :columns="tableColumns" :paginationIsShow="false">
            <template slot="value" slot-scope="{row}">
                <el-input-number v-if="row.edit" v-model="row.value" :min="1" size="mini" />
                <span v-else>{{row.value}}</span>
            </template>
            <template slot-scope="{row}">
                <el-button v-if="row.edit" type="primary" size="mini" @click="confirmEdit(row)">保存</el-button>
                <el-button v-if="row.edit" type="warning" size="mini" @click="row.edit=false">取消</el-button>
                <el-button v-else type="primary" size="mini" @click="row.edit=true">编辑</el-button>
            </template>
        </tpms-table>
  </el-row>-->
  <div style="height:90vh;">
    <h3>返修上限设置</h3>
    <el-form :inline="true">
      <div v-for="(formInline, index) in repairLimits" :key="index">
        <el-form-item label="返修类型">
          <el-select v-model="formInline.key" placeholder="返修类型" size="small" disabled>
            <el-option :label="formInline.keyLabel" :value="formInline.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返修上限值">
          <el-input v-model="formInline.value" placeholder="返修上限值" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">确认修改</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-divider></el-divider>
    <h3>常用频次设置</h3>

    <el-divider></el-divider>
    <h3>报废金额设置</h3>
  </div>
</template>
<script>
import { tpmsTable } from "../../components";
import { getRepairLimitList, changeRepairLimit } from "../../lib/api/spart";

export default {
  data() {
    return {
      tableData: [],
      repairLimits: [
        {
          keyLabel: "委内维修",
          key: "SPARE_REPAIR_LIMIT_INNER",
          value: ""
        },
        {
          keyLabel: "委外维修",
          key: "SPARE_REPAIR_LIMIT_OUTER",
          value: ""
        }
      ]
    };
  },
  components: {
    tpmsTable
  },
  created() {
    this.getTableData();
  },
  methods: {
    /**
     * 返修上限类别
     */
    getTableData() {
      getRepairLimitList().then(res => {
        res.data.content.forEach(item => (item.edit = false));
        this.tableData = res.data.content;
      });
    },
    /**
     * 修改返修上限
     */
    confirmEdit(row) {
      row.edit = false;
      changeRepairLimit({ value: row.value }, row.id)
        .then(res => {
          this.getTableData();
          this.$message.success("修改成功");
        })
        .catch(fail => {
          this.$message.error("修改失败");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.input-width {
  width: 50px;
}
</style>