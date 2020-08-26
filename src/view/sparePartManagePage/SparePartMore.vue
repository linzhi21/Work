<template>
    <div>
        <el-row>
            <el-card class="spare-part-more">
                <el-table :data="sparePartMoreTable">
                    <el-table-column align='center' type="index" label="序号"></el-table-column>
                    <el-table-column align='center' v-for="(item,index) in sparePartMoreTableList" :key="index" :label="item.label" :prop="item.name" width="120px"></el-table-column>
                    <el-table-column align='center' label="处理方式" min-width="320px" >
                        <template slot-scope="scope">
                            <div>
                                <el-radio-group v-model="scope.row.processMode">
                                    <el-radio label="1">工业垃圾</el-radio>
                                    <el-radio label="2">报废备件</el-radio>
                                    <el-radio label="3">修复备件</el-radio>
                                </el-radio-group>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align='center' label="鉴定人" width="120px" prop="appraiser"></el-table-column>
                    <el-table-column align='center' label="处理类型" min-width="210px">
                        <template slot-scope="scope">
                            <div>
                                <el-radio-group v-model="scope.row.processType">
                                    <el-radio label="1">委内维修</el-radio>
                                    <el-radio label="2">委外维修</el-radio>
                                </el-radio-group>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="submit">
                    <el-button @click="jumpSparePartContent">
                        <i class="el-icon-edit"></i>
                        返回
                    </el-button>
                    <el-button type="primary">
                        <i class="el-icon-edit"></i>
                        保存
                    </el-button>
                </div>
            </el-card>
        </el-row>
    </div>
</template>
<script>
export default {
    data(){
        return{
            sparePartMoreTable:[        // 批量备件损坏登记表数据
                 {sparePartName:'123456',changeDate:'润滑油站',type:'润滑油站',originValue:'PHY-001',number:'001',processMode:'2',appraiser:'1300',processType:'1'},
                 {sparePartName:'123456',changeDate:'润滑油站',type:'润滑油站',originValue:'PHY-001',number:'001',processMode:'2',appraiser:'1300',processType:'1'},
                 {sparePartName:'123456',changeDate:'润滑油站',type:'润滑油站',originValue:'PHY-001',number:'001',processMode:'2',appraiser:'1300',processType:'1'},
                 {sparePartName:'123456',changeDate:'润滑油站',type:'润滑油站',originValue:'PHY-001',number:'001',processMode:'2',appraiser:'1300',processType:'1'},
                 {sparePartName:'123456',changeDate:'润滑油站',type:'润滑油站',originValue:'PHY-001',number:'001',processMode:'2',appraiser:'1300',processType:'1'},
                 {sparePartName:'123456',changeDate:'润滑油站',type:'润滑油站',originValue:'PHY-001',number:'001',processMode:'2',appraiser:'1300',processType:'1'},
                 {sparePartName:'123456',changeDate:'润滑油站',type:'润滑油站',originValue:'PHY-001',number:'001',processMode:'2',appraiser:'1300',processType:'1'},
                 {sparePartName:'123456',changeDate:'润滑油站',type:'润滑油站',originValue:'PHY-001',number:'001',processMode:'2',appraiser:'1300',processType:'1'},
            ],
            sparePartMoreTableList:[        // 渲染批量备件损坏登记表的表头
                {label:'备件名称',name:'sparePartName'},
                {label:'更换日期',name:'changeDate'},
                {label:'型号规格',name:'type'},
                {label:'原值',name:'originValue'},
                {label:'数量',name:'number'},
                
            ],
            radio:'2'
        }
    },
    methods: {
        /**
         * @description 跳转回到备件管理页面
         */
        jumpSparePartContent(){
            const _this=this
            _this.$router.push({path:'sparePartContent',query:{name:'备件管理'}})
        }
    },
}
</script>
<style lang="scss" scoped>
   
    .spare-part-more{
        height: 10.1rem;
    }
    .submit{
        float: right;
        margin: 0.2rem;
    }
    
</style>