<template>
  <div>
          <!-- 头部功能区 -->
        <el-row>
          <el-form :model='sparePartForm' label-width="70px">
            <el-col :span="6">
              <el-form-item label="物料编号">
                <el-input class="input-width" v-model="sparePartForm.stockNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备件名称">
                <el-input class="input-width" v-model="sparePartForm.sparePartName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="修理情况">
                <el-select class="select-width" v-model="sparePartForm.repairStatus">
                    <el-option
                    v-for="item in repairStatusSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="领用日期">
                <el-select class="select-width" v-model="sparePartForm.receiveDate">
                    <el-option
                    v-for="item in receiveDateSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备件编号">
                <el-input v-model="sparePartForm.sparePartNumber"></el-input>
              </el-form-item>
            </el-col>
             <el-col :span="8">
              <el-form-item label-width='130px' label="损坏备件处理方法">
                <el-select v-model="sparePartForm.handleMethod">
                    <el-option
                    v-for="item in handleMethodselect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
                <el-form-item label-width="140px">
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
                          <el-dropdown-item>登入对比</el-dropdown-item>
                          <el-dropdown-item>导出</el-dropdown-item>
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
                <el-table-column align="center" width="140" v-for="(item,index) in sparePartTableList" :key='index' :label="item.name" :prop="item.props"></el-table-column>
                <el-table-column align="center" label="状态" width="180px">
                   <template slot-scope="scope">
                        <div v-if='scope.row.status ==1'>
                            <span class="dot dot-blue"></span><span>未修复</span>
                        </div>
                        <div v-if='scope.row.status ==2'>
                            <span class="dot dot-orange"></span><span>已修复</span>
                        </div>
                        <div v-if='scope.row.status ==3'>
                            <span class="dot dot-blue-green"></span><span>已完成</span>
                        </div>
                        <div v-if='scope.row.status ==4'>
                            <span class="dot dot-green"></span><span>待审批</span>
                        </div>
                        <div v-if='scope.row.status ==5'>
                            <span class="dot dot-purple"></span><span>已退回</span>
                        </div>
                   </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="180px">
                   <template slot-scope="scope">
                        <span class="button" v-if='scope.row.operate==0'>查看</span>
                        <span class="button">编辑</span>
                        <span class="button" v-if='scope.row.operate==4'>修复</span>
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
                stockNumber:'',             // 物料编号
                sparePartName:'',           // 备件名称
                repairStatus:'',            // 修理情况
                receiveDate:'',             // 领用日期
                sparePartNumber:'',         // 备件编号
                handleMethod:'',            // 损坏备件处理方法
            },
            handleMethodselect: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }],
            receiveDateSelect: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }],
            repairStatusSelect: [{          // 修理情况下拉选择框
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }],
            sparePartTableData:[        // 表格的数据
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:1,operate:0},
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:1,operate:0},
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:1,operate:0},
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:2,operate:0},
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:3,operate:0},
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:4,operate:4},
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:5,operate:0},
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:1,operate:0},
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:1,operate:0},
                {repairPartNumber:'123456',receiveDate:'2019-07-08',type:'SHB00032',sparePartName:'润滑油站',partNumber:'001',purchasePrice:'500',Number:'1',useType:'2019-03-02',checkDate:'张三',status:1,operate:0}
            ],
            sparePartTableList:[        // 渲染表格的表头
                {props:'repairPartNumber',name:'修理备件编号'},
                {props:'receiveDate',name:'领用日期'},
                {props:'type',name:'型号规格'},
                {props:'sparePartName',name:'备件名称'},
                {props:'partNumber',name:'设备编号'},
                {props:'purchasePrice',name:'采购价格值'},
                {props:'Number',name:'数量'},
                {props:'useType',name:'用途类别'},
                {props:'checkDate',name:'检定日期'}
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
    width: 6rem;
    margin: 0 auto;
}
.select-width{
    width: 180px;
}
</style>