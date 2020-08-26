<template>
  <div>
          <!-- 头部功能区 -->
        <el-row>
          <el-form :model='sparePartForm' label-width="70px">
            <el-col :span="8">
              <el-form-item label="备件编号">
                <el-input v-model="sparePartForm.sparePartNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备件名称">
                <el-input v-model="sparePartForm.sparePartName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label-width="40px">
                    <el-button type='primary' size="mini">
                        <i class="el-icon-edit"></i>
                        查询
                    </el-button>
                    <el-button size="mini">
                        <i class="el-icon-edit"></i>
                        重置
                    </el-button>
                    <!-- 下拉选择框 -->
                    <el-dropdown class="drop-down" @command='showFrequencySetDialog'> 
                        <el-button type="primary" size="mini">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                            更多
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>同步</el-dropdown-item>
                            <el-dropdown-item>导出</el-dropdown-item>
                            <el-dropdown-item command='2'>频次设置</el-dropdown-item>
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
      <!-- 频次设置对话框 -->
        <el-dialog
        title="频次设置"
        :visible.sync="frequencySetDialog"
        width="50%"
        :before-close="handleClose">
        <el-form :model='frequencySetForm' label-width="100px" class="frequency-width">
            <el-form-item label="次数">
                <el-input v-model="frequencySetForm.time" placeholder="期限内，备件使用频率> =该值时，为常用备件"></el-input>
            </el-form-item>
            <el-form-item label="周期">
               <el-select v-model="frequencySetForm.period">
                    <el-option v-for='(item,index) in periodSelect' :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="frequencySetDialog = false">
                <i class="el-icon-edit"></i>
                取 消
            </el-button>
            <el-button type="primary" @click="frequencySetDialog = false">
                <i class="el-icon-edit"></i>
                保 存
            </el-button>
        </span>
        </el-dialog>
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
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:0},
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:0},
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:0},
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:0},
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:0},
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:4},
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:0},
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:0},
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:0},
                {repairPartNumber:'123456',manufacturerNumber:'2019-07-08',partParams:'SHB00032',sparePartName:'润滑油站',partNumber:'001',partName:'张三',mateicalNumber:'500',repairList:'1',repairDate:'2019-03-02',operate:0}
            ],
            sparePartTableList:[        // 渲染表格的表头
                {props:'repairPartNumber',name:'修理备件编号'},
                {props:'manufacturerNumber',name:'制造商编号'},
                {props:'partParams',name:'备件参数'},
                {props:'sparePartName',name:'备件名称'},
                {props:'partNumber',name:'所属设备编号'},
                {props:'partName',name:'所属设备名称'},
                {props:'mateicalNumber',name:'东昌物料号'},
                {props:'repairList',name:'关联维修单'},
                {props:'repairDate',name:'维修日期'}
            ],
             frequencySetDialog:false,         // 控制频次设置对话框的打开与关闭
            frequencySetForm:{                // 频次设置表单
                time:'',            // 次数
                period:'',               // 周期
            },
            periodSelect:[               // 周期的下拉选择框
                 {label:"委内维修",value:'1'},
                 {label:"委外维修",value:'2'}
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
       /**
         * @description 打开频次设置对话框
         */
        showFrequencySetDialog(val){
            const _this=this
            if(val==2){
                _this.frequencySetDialog=true
            }
        },
         /**
         * @description 关闭频次设置对话框
         */
        handleClose(){
            const _this=this
            _this.frequencySetDialog=false
        }
    }
};
</script>
<style lang="scss" scoped>
.el-input{
    width: 3.3rem;
}
.spare-part-dialog-form{
    width: 6rem;
    margin: 0 auto;
}
.frequency-width{
    padding: 0.1rem 2rem;
}
</style>