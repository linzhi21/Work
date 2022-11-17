<template>
  <el-form :model="orderDetail" label-position="left" label-width="120px">
    <el-row>
      <!-- <el-col :span="11">
              <el-form-item label="类型">
                <el-input v-model="orderDetail.type" disabled />
              </el-form-item>
            </el-col>
            <el-col :offset="13"></el-col>-->
      <el-col :span="11">
        <el-form-item label="保养计划编号">
          <el-input v-model="orderDetail.no" disabled />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <div v-if="isShow">
              <el-col :span="8">
                <el-form-item label="区域" label-width="55px">
                  <el-select v-model="orderDetail.workshopareaId"  disabled placeholder="请选择" style="width: 90%">
                    <el-option
                      v-for="item in orderDetail.quOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工段" label-width="55px" >
                  <el-select
                    v-model="orderDetail.sectionId"
                    disabled
                    clearable placeholder="请选择"
                    style="width: 90%"
                  >
                    <el-option
                      v-for="item in orderDetail.gdOptions"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审批流" label-width="55px">
                  <el-select
                    v-model="orderDetail.workflowId"
                    disabled
                    placeholder="请选择"
                    style="margin: 0px 10px;width: 90%"

                  >
                    <el-option
                      v-for="(item, index) in orderDetail.splOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
      <!-- <el-col :span="11" >
              <el-form-item label="车间名称">
                <el-input v-model="orderDetail.workShopName" disabled />
              </el-form-item>
            </el-col>-->
      <!-- <el-col :span="11" :offset="2">
              <el-form-item label="保养名称">
                <el-input v-model="orderDetail.name" disabled />
              </el-form-item>
            </el-col>-->
      <!-- <el-col :span="11">
              <el-form-item label="保养工单编号">
                <el-input v-model="orderDetail.no" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-form-item label="总工时">
                <el-input v-model="orderDetail.hour" disabled />
              </el-form-item>
            </el-col>-->
    </el-row>
    <el-row
      v-for="(item, index) in orderDetail.maintainContentColonies"
      :key="index"
      style="background: #f5f5f5; padding: 0.2rem"
    >
      <el-col :span="11">
        <el-form-item label="版本">
          <el-input v-model="item.version" disabled />
        </el-form-item>
      </el-col>
      <!-- <el-col :span="11" :offset="2">
              <el-form-item label="工位/工段">
                <el-input v-model="item.sectionOrStationName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="工时">
                <el-input v-model="item.hour" disabled />
              </el-form-item>
            </el-col> -->
      <el-col :span="11" :offset="2">
        <el-form-item label="设备(生产线)名称">
          <el-input v-model="item.deviceNames" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="编制人">
          <el-input v-model="item.creatorName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="2">
        <el-form-item label="编制日期">
          <el-input v-model="item.createDate" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="图示">
          <div>
            <el-image
              v-for="img in item.maintainPlanPictures"
              :key="img.accessoryId"
              :src="img.url"
              fit="fill"
            ></el-image>
          </div>
        </el-form-item>
      </el-col>
      <!-- 表格区 -->
      <el-table
        :data="item.maintainPlanContents"
        style="width: 100%"
        border
        default-expand-all
        :tree-props="{
          children: 'childmaintainPlanContents',
          hasChildren: 'hasChildren',
        }"
      >
        <el-table-column
          align="center"
          type="index"
          label="项目"
          width="50"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="executionPart"
          label="保养部件"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="executionNode"
          label="保养位置"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="content"
          label="保养内容"
        ></el-table-column>
        <!-- <el-table-column align="center" prop="hour" label="工时(s)"></el-table-column> -->
        <el-table-column
          align="center"
          prop="cycleName"
          label="周期"
        ></el-table-column>
        <!-- <el-table-column align="center" prop="photoDisplay" label="图示">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.accessoryUrl"
                    style="width: 40px;height: 40px;"
                    :src="`${apiConfig.accessoryFile+scope.row.accessoryUrl}`"
                    class="avatar"
                  />
                </template>
              </el-table-column> -->
      </el-table>
    </el-row>
  </el-form>
</template>
<script>
export default {
  created(){
    //console.log("------------");
    // console.log("dddd"+this.orderDetail.gdOptions.label);
    JSON.parse(localStorage.getItem("user_info")).principal.workshopId === 4
        ? (this.isShow = true)
        : (this.isShow = false); 
  },
  name: "ShowPlanManage",
  props: ["orderDetail"],
  data() {
    return {
      workshopareaId:"",//区域ID
    };
  },
};
</script>