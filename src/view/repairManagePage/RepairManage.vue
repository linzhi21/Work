<template>
    <div>
        <el-row>
            <el-card class="spare-part-manage">
                <!-- 头部导航菜单栏 -->
                <el-menu :default-active="activeIndex" mode='horizontal' active-text-color='#0077C8' text-color='#909399'> 
                    <el-menu-item index="/repairManageContent" @click='jumpItem("repairManageContent","维修管理")'>维修管理</el-menu-item>
                    <el-menu-item index="/problemRisingManage" @click='jumpItem("problemRisingManage","维修管理/问题上升机制管理")'>问题上升机制管理</el-menu-item>
                    <el-menu-item index="/emergencyManage" @click='jumpItem("emergencyManage","维修管理/紧急程度管理")'>紧急程度管理</el-menu-item>
                    <el-menu-item index="/faultTypeManage" @click='jumpItem("faultTypeManage","维修管理/故障种类管理")'>故障种类管理</el-menu-item>
                    <el-menu-item index="/majorFailureSetting" @click='jumpItem("majorFailureSetting","维修管理/大故障记录时间设置")'>大故障记录时间设置</el-menu-item>
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
            activeIndex:'/repairManageContent',    //    被激活的菜单item
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