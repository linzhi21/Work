<template>
  <div>
    正在加载。。。
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import { principal, ivLogin } from "../../lib/api/user";
import { getUserMenus } from "../../lib/api/userManage";
export default {
  data() {
    return {};
  },
  components: {
  },
  methods: {
    ssoLogin(){
      console.log("sso")
      ivLogin().then(res => {
        if (res.access_token) {
          // 获取用户信息
          principal().then(() => {
              this.$router.push("/home");
              getUserMenus();
          });
        }
      })
    }
  },
  created() {
    if(Cookies.get('iv-user')){
      this.ssoLogin();
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100vh;
}
</style>

