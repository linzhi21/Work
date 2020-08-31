<template>
    <div>
        <el-row>
            <el-form label-width="100px">
                <el-col :span="10">
                    <el-form-item label="设备名称">
                        <el-input class="inline-block" type="text" v-model="partName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="设备编号">
                        <el-input class="inline-block" type="text" v-model="partNumber"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="新生效日期">
                        <el-select v-model="leftDate" placeholder="">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <span>——</span>
                        <el-select v-model="rightDate" placeholder="">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="2">
                    <el-form-item label-width="20px">
                        <el-button size="mini" type="primary">
                            <i class="el-icon-edit"></i>
                            查询
                        </el-button>
                        <el-button size="mini">
                            <i class="el-icon-edit"></i>
                            重置
                        </el-button>
                        <!-- 下拉选择框 -->
                        <el-dropdown class="drop-down">
                            <el-button size="mini">
                                <i class="el-icon-arrow-down el-icon--right"></i>
                                更多
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>导出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
       <el-row>
            <!-- 表格区域 -->
            <el-table :data='upkeepPlanTable'>
                <el-table-column align="center" type="index" label="序号"></el-table-column>
                <el-table-column align="center" width="100" prop="partNumber" label="设备编号"></el-table-column>
                <el-table-column align="center" width="100" prop="partName" label="设备名称"></el-table-column>
                <el-table-column align="center" label="更改前内容">
                    <el-table-column prop="preUpkeepPart" label="保养部件"></el-table-column>
                    <el-table-column prop="preUpkeepStation" label="保养位置"></el-table-column>
                    <el-table-column prop="preUpkeepContent" label="保养内容细则"></el-table-column>
                    <el-table-column prop="preUpkeepPeriod" label="保养周期"></el-table-column>
                </el-table-column>
                <el-table-column align="center" label="更改后内容">
                    <el-table-column prop="lastUpkeepPart" label="保养部件"></el-table-column>
                    <el-table-column prop="lastUpkeepStation" label="保养位置"></el-table-column>
                    <el-table-column prop="lastUpkeepContent" label="保养内容细则"></el-table-column>
                    <el-table-column prop="lastUpkeepPeriod" label="保养周期"></el-table-column>
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
            partName:'',        // 设备名称
            partNumber:'',          // 设备编号
            leftDate:'',            // 新生效日期左侧日期
            rightDate:'',           // 新生效日期右侧日期
            options:[               // 新生效日期下载选择框内容
                    {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }
            ],
            upkeepPlanTable:[       // 表格数据
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
                {partNumber:'123456',partName:'润滑油站',preUpkeepPart:'润滑油站',preUpkeepStation:'PHY-001',preUpkeepContent:'001',preUpkeepPeriod:'主机温度',lastUpkeepPart:'1300',lastUpkeepStation:'318531',lastUpkeepContent:'',lastUpkeepPeriod:''},
            ]
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
}
</script>
<style lang="scss" scoped>
    .inline-block{
        display: inline-block;
        width: 200px;
    }
</style>