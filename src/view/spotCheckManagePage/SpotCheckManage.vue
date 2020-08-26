<template>
    <div>
        <el-row>
            <el-card class="spare-part-manage">
                <!-- 头部导航菜单栏 -->
                <el-menu :default-active="activeIndex" mode='horizontal' active-text-color='#2b91fc' text-color='#646464'> 
                    <el-menu-item index="/planManage" @click='jumpItem("planManage","点检管理/计划管理")'>计划管理</el-menu-item>
                    <el-menu-item index="/workOrderManage" @click='jumpItem("workOrderManage","点检管理/工单管理")'>工单管理</el-menu-item>
                    <el-menu-item index="/photoLibrary" @click='jumpItem("photoLibrary","点检管理/图示库")'>图示库</el-menu-item>
                </el-menu>
                <!-- 底部内容区域 -->
                <router-view></router-view>
            </el-card>
        </el-row>
    </div>
</template>
<script>
export default {
    data(){
        return{
            activeIndex:'/planManage',    //    被激活的菜单item
        }
    },
    methods: {
        /**
         * @description 显示不同的子页面
         */
        jumpItem(path,name){
             const _this=this
            _this.$router.push(path)
             window.title=name
        }
    },
}
</script>
<style lang="scss" scoped>

</style>