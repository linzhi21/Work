<template>
    <div>
        <el-row>
            <el-card class="spare-part-manage">
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