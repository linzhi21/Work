<template>
  <div>
          <!-- 头部功能区 -->
        <el-row>
          <el-form :model='sparePartForm' label-width="80px">
            <el-col :span="7">
              <el-form-item label="工位/工段">
                <el-input v-model="sparePartForm.workshopStation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="160px" label="设备/生产线名称">
                <el-input v-model="sparePartForm.partName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="周期" >
                <el-select v-model="sparePartForm.period" placeholder=''>
                    <el-option
                    v-for="item in periodSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="状态" >
                <el-select v-model="sparePartForm.status" placeholder=''>
                    <el-option
                    v-for="item in statusSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="11">
              <el-form-item>
                <el-button type='primary' size="mini">
                    <i class="el-icon-edit"></i>
                    查询
                </el-button>
                <el-button size="mini">
                    <i class="el-icon-edit"></i>
                    重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <!-- 底部表格 -->
        <el-row>
            <el-table :data="sparePartTableData" style="width: 100%">
                <el-table-column align="center"  type="index" label="序号" width="60px"></el-table-column>
                <el-table-column align="center" width="140" v-for="(item,index) in sparePartTableList" :key='index' :label="item.name" :prop="item.props"></el-table-column>
                <el-table-column align="center" label="状态" width="180px">
                   <template slot-scope="scope">
                        <div v-if='scope.row.status ==1'>
                            <span class="dot dot-blue"></span><span>待审批</span>
                        </div>
                        <div v-if='scope.row.status ==2'>
                            <span class="dot dot-orange"></span><span>已处理</span>
                        </div>
                        <div v-if='scope.row.status ==3'>
                            <span class="dot dot-red"></span><span>待报废</span>
                        </div>
                        <div v-if='scope.row.status ==4'>
                            <span class="dot dot-green"></span><span>待修复</span>
                        </div>
                        <div v-if='scope.row.status ==5'>
                            <span class="dot dot-purple"></span><span>已退回</span>
                        </div>
                   </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="180px">
                   <template slot-scope="scope">
                        <span class="button">查看</span>
                        <span class="button" v-if='scope.row.operate == 2'>导出</span>
                        <span class="button" v-if='scope.row.operate == 1' >暂停</span>
                   </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 分页 -->
         <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="30">
        </el-pagination>
  </div>
</template>
<script>
export default {
    data(){
        return{ 
            sparePartForm:{             // 头部表单
                workshopStation:'',           // 工位/工段
                partName:'',         // 设备/生产线名称
                period:'',              // 周期
                status:''                // 状态
            },
            periodSelect:[{value:'选项1',label:'黄金糕'},{value:"选项2",label:'双皮奶'}],   // 周期的下拉选择框
            statusSelect:[{value:'选项1',label:'黄金糕'},{value:"选项2",label:'双皮奶'}],    // 状态的下拉选择框
            sparePartTableData:[        // 表格的数据
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:1,operate:0},
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:1,operate:0},
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:1,operate:0},
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:2,operate:0},
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:3,operate:0},
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:4,operate:1},
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:5,operate:2},
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:1,operate:5},
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:1,operate:0},
                {upkeepPlanNumber:'123456',upkeepName:'2019-07-08',version:'SHB00032',workshopStation:'润滑油站',workshopTime:'001',partName:'500',prepareDate:'2019-03-02',preparePersion:'张三',status:1,operate:0}
            ],
            sparePartTableList:[        // 渲染表格的表头
                {props:'upkeepPlanNumber',name:'保养计划编号'},
                {props:'upkeepName',name:'保养名称'},
                {props:'version',name:'版本'},
                {props:'workshopStation',name:'工位/工段'},
                {props:'workshopTime',name:'工时'},
                {props:'partName',name:'设备/生产线名称'},
                {props:'preparePersion',name:'编制人'},
                {props:'prepareDate',name:'编制日期'}
            ],
        }
    },
    methods:{
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
    }
};
</script>
<style lang="scss" scoped>

.spare-part-dialog-form{
    width: 4.3rem;
    margin: 0 auto;
}
.upkeep-form{
    padding: 0.1rem 1rem;
}
.upkeep-line{
    padding: 0 0.4rem;
    border-bottom: 2px dashed #e9e9e9;
    line-height: 40px;
}
.upkeep-item-right{
    float: right;
    width: 2.5rem;
}
.upkeep-item-left{
    float: left;
}
.new-add-button{
    margin-left: 3rem;
}
.color-blue{
    color:#2888fd;
}
.el-select{
    width: 100%;
}
</style>