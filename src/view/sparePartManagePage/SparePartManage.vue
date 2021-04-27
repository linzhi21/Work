<template>
    <div>
        <el-row>
            <el-card class="spare-part-manage">
                <!-- 头部导航菜单栏 -->
                <el-menu :default-active="activeIndex" mode='horizontal' active-text-color='#0077C8' text-color='#909399'> 
                    <el-menu-item index="/sparePartContent" @click='jumpItem("sparePartContent","备件管理/常用备件管理")'>常用备件管理</el-menu-item>
                    <el-submenu index="/sparePartDamage">
                        <template slot="title">损坏备件管理</template>
                        <el-menu-item index="/sparePartDamage" @click='jumpItem("sparePartDamage","备件管理/损坏备件管理")'>备件损坏管理</el-menu-item>
                        <el-menu-item index="/repairLimitManage" @click='jumpItem("repairLimitManage","备件管理/损坏备件管理/返修上限管理")'>返修上限管理</el-menu-item>
                        <el-menu-item index="/sparePartCheck" @click='jumpItem("sparePartCheck","备件管理/损坏备件管理/备件备查台账")'>备件备查台账</el-menu-item>
                        <el-menu-item index="/commonSparePart" @click='jumpItem("commonSparePart","备件管理/损坏备件管理/常用备件库")'>常用备件库</el-menu-item>
                        <el-menu-item index="/planReceiveCheck" @click='jumpItem("planReceiveCheck","备件管理/损坏备件管理/计划领用查看")'>计划领用查看</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/sparePartDiscard" @click='jumpItem("sparePartDiscard","备件管理/报废维修列表")'>报废维修列表</el-menu-item>
                    <el-menu-item index="/internalRepairList" @click='jumpItem("internalRepairList","备件管理/内部维修列表")'>内部维修列表</el-menu-item>
                    <el-menu-item index="/externalRepairList" @click='jumpItem("externalRepairList","备件管理/委外维修列表")'>委外维修列表</el-menu-item>
                    <el-menu-item index="/repairPartRegistList" @click='jumpItem("repairPartRegistList","备件管理/修理备件登记列表")'>修理备件登记列表</el-menu-item>
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
            activeIndex:'/sparePartContent',    //    被激活的菜单item
            menuList:[
                {path:'sparePartContent',menuName:'常用备件管理'},
                {path:'sparePartDamage',menuName:'损坏备件管理'},
                {path:'sparePartDiscard',menuName:'报废维修列表'},
                {path:'internalRepairList',menuName:'内部维修列表'},
                {path:'externalRepairList',menuName:'委外维修列表'},
                {path:'repairPartRegistList',menuName:'修理备件登记列表'},
            ]
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