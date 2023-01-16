<template>
  <div class="login-container">
    <div class="bg"></div>
    <el-card class="login-wrap">
      <p class="title">TPMS设备管理系统</p>
      <div class="form">
        <div class="inp-wrap">
          <i class="el-icon-user"></i>
          <input type="text" v-model="loginForm.username" placeholder="请输入用户名" />
        </div>
        <div class="inp-wrap">
          <i class="el-icon-lock"></i>
          <input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </div>
        <p class="remember-password">
          <span class="remmber-password">
            <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
          </span>
          <!-- <span>忘记密码？请联系管理员重置</span> -->
        </p>
        <el-button @click="login" class="login-btn" type="primary" round>登录</el-button>
        <div class="forget-password">
          <span>忘记密码？请联系管理员重置</span>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { login, principal, ivLogin, refreshToken } from "../../lib/api/user";
import { getUserMenus } from "../../lib/api/userManage";
import { factory } from "../../lib/api/factory";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      loginForm: {
        username: "", // 用户名
        password: "" // 密码
      },
      rememberPassword: false // 用于判断用户是否需要记住密码
    };
  },
  created() {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username && password) {
      this.loginForm.username = username;
      this.loginForm.password = password;
      this.rememberPassword = true;
      // 从主页退出登陆，阻止再次登陆
      const { preventLogin } = this.$route.params;
      preventLogin || this.login();
    }
    if(Cookies.get('iv-user')){
      this.ivLogin();
    }
  },
  methods: {
    // 点击登录按钮跳转到首页
    login() {
      const { username, password } = this.loginForm;
      login({
        username,
        password
      })
        .then(res => {
          if (res.access_token) {
            // 获取用户信息
            principal().then(() => {
              this.$router.push("/home");
              // 检查是否要记住密码
              this.storagePassword();
              getUserMenus();
            });
          }
        })
        .catch(fail => {
          this.$message.error(fail);
          console.log(fail);
        });
    },
    /** 检查是否要记住密码 */
    storagePassword() {
      if (this.rememberPassword) {
        localStorage.setItem("username", this.loginForm.username);
        localStorage.setItem("password", this.loginForm.password);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      }
    },
    ivLogin(){
        ivLogin({
        })
            .then(res => {
                if (res.access_token) {
                    // 获取用户信息
                    principal().then(() => {
                        this.$router.push("/home");
                        getUserMenus();
                    });
                }
            })
    }
  }
};
</script>
<style lang='scss' scoped>
.login-container {
  position: relative;
  height: 100vh;
  width: 100%;
  background: #f9f9f9;
  .bg {
    width: 50%;
    height: 100%;
    background: rgb(0, 119, 200);
    border-top-right-radius: 250px;
    border-bottom-right-radius: 250px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
  .login-wrap {
    // width: 450px;
    width: 30%;
    position: absolute;
    // height: 450px;
    height: 70%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    .title {
      margin: 40px 0;
      font-weight: 600;
      font-size: 22px;
      color: rgb(0, 119, 200);
    }
    .inp-wrap {
      width: 80%;
      margin: 30px auto;
      border: none;
      line-height: 1.8;
      box-sizing: border-box;
      background-image: linear-gradient(#fff, #fff),
        linear-gradient(to bottom right, rgb(0, 119, 200), rgb(0, 119, 200));
      font-weight: 300;
      padding: 0.5px;
      border-radius: 10px;
      background-clip: content-box, padding-box;
      i {
        float: left;
        color: rgb(0, 119, 200);
        font-weight: 600;
        font-size: 24px;
        margin: 10px;
      }
      input {
        width: calc(100% - 60px);
        height: 36px;
        margin: 6px 0;
        border: 0;
        outline: none;
        font-size: 14px;
        float: left;
      }

      &::after {
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
    }
    .login-btn {
      width: 80%;
      margin: 30px auto;
    }
    .remember-password {
      width: 80%;
      margin: 0 auto;
      text-decoration: underline;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .forget-password {
      text-decoration: underline;
    }
  }
}
</style>
