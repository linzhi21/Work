<template>
  <div class="home-page">
      <!-- 头部信息栏 -->
    <div class="header-message">
        <span>{{title}}</span>
        <div class="right-user-message">
            <i class="el-icon-user-solid" @click="jumpPersional"></i>
            <i class="el-icon-s-tools" @click='jumpChangePassword'></i>
            <el-dropdown :hide-on-click="false">
                <span style="font-size:16px;">
                    令狐晓丹
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="logout">退出登陆</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>
<script>
export default {
    data(){
        return{
            title:window.title ? window.title:'主页',
        }
    },
   
    watch:{
        /**
         * @description 监听地址栏的变化改变title的值
         */
        '$route'(to,from){
            const _this=this
            if(_this.$route){
                _this.title=window.title
            }
        }
    },
    methods:{
        /**
         * @description 跳转到个人信息的页面
         */
        jumpPersional(){
            this.$router.push('/persional')
        },
        /**
         * @description 跳转到修改密码的页面
         */
        jumpChangePassword(){
            this.$router.push('/changePassword')
        },
        /** 退出登陆 */
        logout(){
            this.$router.replace({
                name:'login',
                params:{
                    // 阻止登陆
                    preventLogin:true
                }
            });
            this.$store.dispatch('clear');
        }
    }
};
</script>
<style lang="scss" scoped>
.home-page{
    background-color: #f0f4f6;
    .header-message{
        height: 0.4rem;
        padding: 0.1rem 0.3rem;
        background-color: #FFF;
        line-height: 0.4rem;
        color: #a3a3a3;
        .right-user-message{
           float: right;
           i{
               font-size: 0.2rem;
               margin: 0 0.05rem;
               vertical-align: middle;
           }
           span{
               color:#2779f1;
           }
        }
    }
}

</style>