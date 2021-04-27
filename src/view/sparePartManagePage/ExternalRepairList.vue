<template>
  <div>
          <!-- 头部功能区 -->
        <el-row>
          <el-form :model='sparePartForm' label-width="70px">
            <el-col :span="8" >
              <el-form-item label="备件名称">
                <el-input v-model="sparePartForm.sparePartName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请日期">
                <el-date-picker
                v-model="sparePartForm.applyDateA"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请日期">
                <el-date-picker
                v-model="sparePartForm.applyDateB"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="16">
              <el-form-item>
                <el-button type='primary' size="mini">
                    <i class="el-icon-edit"></i>
                    查询
                </el-button>
                <el-button size="mini">
                    <i class="el-icon-edit"></i>
                    重置
                </el-button>
                <!-- 下拉选择框 -->
                <el-dropdown class="drop-down">
                    <el-button type="primary" size="mini">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                        更多
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>导入</el-dropdown-item>
                        <el-dropdown-item>打印</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <!-- 底部表格 -->
        <el-row>
            <el-table :data="sparePartTableData" style="width: 100%">
                <el-table-column align="center"  type="index" label="序号" width="60px"></el-table-column>
                <el-table-column align="center" min-width="110px" v-for="(item,index) in sparePartTableList" :key='index' :label="item.name" :prop="item.props"></el-table-column>
                <el-table-column align="center"  label="产品系列号/备件维修号" width="170px" prop="repairNumber"></el-table-column>
                <el-table-column align="center"  label="委外类型" width="110px" prop="externalType"></el-table-column>
                <el-table-column align="center" label="状态" width="90px">
                   <template slot-scope="scope">
                        <div v-if='scope.row.status ==1'>
                            <span class="dot dot-blue"></span><span>未修复</span>
                        </div>
                        <div v-if='scope.row.status ==2'>
                            <span class="dot dot-orange"></span><span>待审批</span>
                        </div>
                        <div v-if='scope.row.status ==3'>
                            <span class="dot dot-red"></span><span>已退回</span>
                        </div>
                        <div v-if='scope.row.status ==4'>
                            <span class="dot dot-green"></span><span>修复中</span>
                        </div>
                        <div v-if='scope.row.status ==5'>
                            <span class="dot dot-purple"></span><span>已修复</span>
                        </div>
                        <div v-if='scope.row.status ==6'>
                            <span class="dot dot-blue-green"></span><span>待办&nbsp;&nbsp;</span>
                        </div>
                        <div v-if='scope.row.status ==7'>
                            <span class="dot dot-pink"></span><span>待验收</span>
                        </div>
                   </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="180px">
                   <template slot-scope="scope">
                        <span class="button cursor">查看</span>
                        <span class="button cursor" v-if='scope.row.operate == 1'>返修</span>
                        <span class="button cursor" v-if='scope.row.operate == 2'>编辑</span>
                        <span class="button cursor" v-if='scope.row.operate == 3'>送修</span>
                        <span class="button cursor" v-if='scope.row.operate == 4'>确认</span>
                        <span class="button cursor" v-if='scope.row.operate == 5'>签收</span>
                        <span class="button cursor" v-if='scope.row.operate == 6'>验收</span>
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
            sparePartForm:{             // 备件管理头部表单
                sparePartName:'',           // 备件名称
                applyDateA:'',         // 申请日期
                applyDateB:'',              // 申请日期
            },
            sparePartTableData:[        // 表格的数据
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架内',status:1,operate:1},
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架内',status:1,operate:1},
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架内',status:1,operate:1},
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架内',status:2,operate:0},
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架外',status:3,operate:2},
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架外',status:4,operate:3},
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架内',status:5,operate:4},
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架内',status:6,operate:5},
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架外',status:7,operate:6},
                {internalRepairNumber:'123456',applyPersion:'2019-07-08',telphone:'SHB00032',applyDate:'润滑油站',partNumber:'001',partName:'500',Number:'1',repairNumber:'2019-03-02',externalType:'框架外',status:1,operate:1}
            ],
            sparePartTableList:[        // 渲染表格的表头
                {props:'internalRepairNumber',name:'内部维修单号'},
                {props:'applyPersion',name:'申请人'},
                {props:'telphone',name:'电话'},
                {props:'applyDate',name:'申请日期'},
                {props:'partNumber',name:'备件编号'},
                {props:'partName',name:'备件名称'},
                {props:'Number',name:'数量'}
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
};
</script>
<style lang="scss" scoped>
.el-input{
  width: 3.3rem;
}
.spare-part-dialog-form{
    width: 4.3rem;
    margin: 0 auto;
}
</style>