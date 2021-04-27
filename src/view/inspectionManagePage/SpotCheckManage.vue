<template>
    <div>
        <el-row>
            <el-card class="spare-part-manage">
                <!-- 头部导航菜单栏 -->
                <el-menu :default-active="activeIndex" mode='horizontal' active-text-color='#0077C8' text-color='#909399'> 
                    <el-menu-item index="/inSpectionPlanManage" @click='jumpItem("inSpectionPlanManage","巡检管理/计划管理")'>计划管理</el-menu-item>
                    <el-menu-item index="/inSpectionWorkOrderManage" @click='jumpItem("inSpectionWorkOrderManage","巡检管理/工单管理")'>工单管理</el-menu-item>
                    <el-menu-item index="/inSpectionPhotoLibrary" @click='jumpItem("inSpectionPhotoLibrary","巡检管理/图示库")'>图示库</el-menu-item>
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
            activeIndex:'/inSpectionPlanManage',    //    被激活的菜单item
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