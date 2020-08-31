<template>
    <div>
        <el-row>
            <el-card class="spare-part-manage">
                <!-- 头部导航菜单栏 -->
               <!-- <el-menu :default-active="activeIndex" mode='horizontal' active-text-color='#2b91fc' text-color='#646464'> 
                    <el-menu-item index="/upKeepPlanManage" @click='jumpItem("upKeepPlanManage","保养管理/计划管理")'>计划管理</el-menu-item>
                    <el-menu-item index="/upKeepWorkOrderManage" @click='jumpItem("upKeepWorkOrderManage","保养管理/工单管理")'>工单管理</el-menu-item>
                    <el-menu-item index="/upKeepPhotoLibrary" @click='jumpItem("upKeepPhotoLibrary","保养管理/图示库")'>图示库</el-menu-item>
                    <el-menu-item index="/upKeepChangePlan" @click='jumpItem("upKeepChangePlan","保养管理/保养计划更改目录")'>保养计划更改目录</el-menu-item>
                </el-menu> -->
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
            activeIndex:'/upKeepPlanManage',    //    被激活的菜单item
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