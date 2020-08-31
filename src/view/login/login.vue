<template>
  <div class="login-container">
    <!-- 登录卡片 -->
    <div class="login-area">
      <!-- 左侧图片展示区 -->
      <div class="left-photo"></div>
      <!-- 右侧登录表单区 -->
      <div class="right-form">
        <!-- 头部logo -->
        <div class="login-logo">
          <div>
            <!-- <img src="../../assets/image/login/login_logo.png" alt /> -->
          </div>
          <span>大众TPMS系统</span>
        </div>
        <!-- 表单区 -->
        <el-form class="login-form" :model="loginForm" label-width="0">
          <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username">
              <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password">
              <i slot="prefix" class="el-input__icon el-icon-s-goods"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="remember-password">
              <input type="checkbox" v-model="rememberPassword" />
              <span>记住密码</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="login-button" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { login, principal, refreshToken } from "../../lib/api/user";
import { factory } from "../../lib/api/factory";
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
          // 获取用户信息
          principal();
		      
          this.$router.push("/home");
          // 检查是否要记住密码
          this.storagePassword();
        })
        .catch(fail => {
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
    }
  }
};
</script>
<style lang='scss' scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: url(../../assets/image/login/loginbg.png);
  background-size: 100% 100%;
  .login-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 10.8rem;
    height: 6rem;
    margin: auto;
    background-color: #fff;
    .left-photo {
      float: left;
      width: 5.7rem;
      height: 100%;
      background-image: url(../../assets/image/login/login_leftphoto.png);
      background-image: 100% 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right-form {
      width: 5.1rem;
      padding: 0.5rem;
      box-sizing: border-box;
      float: right;
      .login-logo {
        color: #2d9bfb;
        text-align: center;
        div {
          width: 0.5rem;
          height: 0.5rem;
          margin: 0.1rem auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .login-form {
        margin-top: 0.2rem;
        .remember-password {
          margin-top: -0.2rem;
          text-align: right;
          input {
            vertical-align: middle;
            border-color: #2d9bfb;
            background-color: #2d9bfb;
          }
        }
        .login-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
