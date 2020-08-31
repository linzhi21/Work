<template>
    <div>
        <!-- 头部功能区 -->
        <el-row>
            <el-col :span="6">
                <span>名称</span>
                <el-input class="inline-block" type="text" v-model="name"></el-input>
            </el-col>
            <el-col :span="6">
                <span>部件</span>
                <el-input class="inline-block" type="text" v-model="part"></el-input>
            </el-col>
            <el-col :span="6">
                <span>时间</span>
                <el-input class="inline-block" type="text" v-model="time"></el-input>
            </el-col>
            <el-col :span="6"> 
                <div class="button-group">
                    <el-button type="primary" size="mini">
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
                            <el-dropdown-item>新增</el-dropdown-item>
                            <el-dropdown-item>下载</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>
        <!-- 主题内容区 -->
        <el-row>
            <el-col :span="6" v-for="item in 8" :key="item">
                <el-card class="spot-card">
                    <img class="spot-photo" src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg" alt="">
                    <div class="clearfix bottom-desc">
                        <p class="left">上横梁点检</p>
                        <div class="right">
                            <i class="el-icon-edit"></i>
                            <i class="el-icon-share"></i>
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 分页区 -->
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
            name:'',
            part:'',
            time:''
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
    .el-row{
        padding: .2rem .4rem;
        .inline-block{
            display: inline-block;
            width: 200px;
        }
    }
    .spot-card{
        width: 90%;
        height:3.5rem;
        padding: 0.05rem;
        margin: 5px auto;
        border-radius: 0.1rem;
    }
    .spot-photo{
        width: 100%;
        height:2.4rem;
        border-radius: 0.2rem 0.2rem 0 0;
        margin-bottom: 0.2rem;
    }
    .left{
        float: left;
    }
    .right{
        float: right;
        i{
            margin-left: 5px;
        }
    }
    .button-group{
        padding-top: 7px;
    }
</style>