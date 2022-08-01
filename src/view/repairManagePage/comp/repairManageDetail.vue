<template>
  <el-dialog :title="dialog.title" :visible.sync="dialog.isDetailShow" width="80%">
    <el-form :model="dialog.data" ref="dialog" label-width="120px" :disabled="dialog.disabled">
      <!-- 委托部门填写 -->
      <el-row style="background: #f5f5f5; padding: 0.2rem">
        <el-col :span="12">
          <el-form-item label="设备名称." prop="deviceName">
            <el-input v-model="dialog.data.deviceName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备编号" prop="deviceNo">
            <el-input v-model="dialog.data.deviceNo"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="车间" prop="workshopId">
            <el-select v-model="dialog.data.workshopId" placeholder="请选择车间" disabled>
              <el-option v-for="item in dialog.list.workshopList" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="工段" prop="workshopSectionId">
            <el-select v-model="dialog.data.workshopSectionInfo" value-key="id" placeholder="请选择工段" @change="
              ({ id, label }) => (
                (dialog.data.workshopSectionId = id),
                (dialog.data.workshopSectionName = label)
              )
            ">
              <el-option v-for="item in dialog.list.workshopSectionList" :key="item.id" :label="item.label"
                :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="委托人" prop="applicantName">
            <el-input v-model="dialog.data.applicantName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="故障时间" prop="breakdownTime">
            <el-date-picker v-model="dialog.data.breakdownTime" type="datetime" placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="故障描述" prop="description">
            <el-input type="textarea" :rows="4" v-model="dialog.data.content"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="报修时间" prop="createDate">
            <el-input v-model="dialog.data.createDate"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="报修位置" prop="address">
            <el-input v-model="dialog.data.address"></el-input>
          </el-form-item>
        </el-col>

        <!-- 维修部门填写 -->
        <el-col :span="12">
          <el-form-item label="接单人" prop="receiverName">
            <el-input v-model="dialog.data.receiverName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="维修部位" prop="repairPart">
            <el-input v-model="dialog.data.repairPart" readonly=""></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="接单时间" prop="repairStartTime">
            <el-input v-model="dialog.data.repairStartTime" readonly=""></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="结束时间" prop="repairEndTime">
            <el-input v-model="dialog.data.repairEndTime" readonly=""></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否停线修理" prop="stopLine" required="">
            <el-radio-group v-model="dialog.data.stopLine">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="影响生产时间" prop="breakdownDuration">
            <el-input v-model="dialog.data.breakdownDuration"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="故障种类" prop="breakdownType">
            <el-select v-model="dialog.data.breakdownTypeInfo" value-key="id" placeholder="请选择故障种类" @change="
              ({ id, label }) => (
                (dialog.data.breakdownType = id),
                (dialog.data.breakdownTypeName = label)
              )
            ">
              <el-option v-for="item in dialog.list.faultTypeList" :key="item.id" :label="item.label" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="维修内容急故障原因" prop="reason">
            <el-input type="textarea" :rows="4" v-model="dialog.data.reason"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 底部表格 -->
      <tpms-table ref="tpmsTable" :total="dialog.data.spares.length" :data="dialog.data.spares" :columns="[
        {
          props: 'replaceSpareName',
          label: '替换备件名称',
          width: '160px',
        },
        { props: 'replaceSpareNo', label: '替换备件编号' },
        { props: 'amount', label: '替换数量' },
        {
          props: 'brokeSpareName',
          label: '损坏备件名称',
          width: '160px',
        },
        { props: 'brokeSpareNo', label: '损坏备件编号' },
      ]" @getTableData="dialog.data.spares">
      </tpms-table>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button @click="$refs.dialog.resetFields(), (dialog.isDetailShow = false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { tpmsTable } from "../../../components";
export default {
  name: 'RepairManageDetail',
  props: ['dialog'],
  components: { tpmsTable },
  data() {
    return {}
  }
}
</script>

<style>
</style>