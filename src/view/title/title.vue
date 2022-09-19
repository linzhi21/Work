<template>
  <el-container class="home-page">
    <!-- 头部信息栏 -->
    <el-header>
      <div class="left-message">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-if="title[0] != '首页'" :to="{ path: '/homeContent' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(text, i) in title" :key="i">{{text}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="right-message">
        <el-select v-model="workshopId" @change="setUserWorkshop">
          <el-option
            v-for="item in workshopsList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- 帮助文档下载按钮 -->
        <a href="static\TPMS-Web端用户操作手册.pdf" @mouseout="showHover=false" download="TPMS-Web端用户操作手册"><i
              class="el-icon-question" slot="reference"></i></a>
        <el-badge
          class="unread-count-message"
          :style="{'margin-right':unreadCount===0?'0':'25px'}"
          :hidden="unreadCount===0"
          :value="unreadCount"
        >
          <i class="el-icon-message" @click="jumpMessage"></i>
        </el-badge>
        <i class="el-icon-s-cooperation" @click="jumpChangePassword"></i>
        <el-dropdown :hide-on-click="false" trigger="click">
          <i class="el-icon-user-solid"></i>
          <span style="font-size:16px;">{{username}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 路由占位符 -->
    <el-main class="scrollbar">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import { principal, userWorkshopManage } from "../../lib/api/user";
import { getUserMenus } from "../../lib/api/userManage";
import { messageManage } from "../../lib/api/system";
export default {
  data() {
    return {
      showHover: false,
      title: [], // window.title ? window.title : "首页",
      username: JSON.parse(localStorage.getItem("user_info")).principal.name,
      workshopsList: [],
      workshopName: "",
      workshopId: "",
      unreadCount: 0
    };
  },

  watch: {
    /**
     * @description 监听地址栏的变化改变title的值
     */
    $route(to, from) {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getCurrentWorkshop();
    this.getWorkshopList();
    this.getUnreadCount();
    this.getBreadcrumb();
  },
  methods: {
    /** 面包屑。当前支持处理最多二级面包屑 */
    getBreadcrumb() {
      // only show routes with meta.title
      const title = [];
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      );
      if (matched && matched[0] && matched[0].meta && matched[0].meta.title) {
        title.push(matched[0].meta.title);
      }

      if (this.$route.meta && this.$route.meta.title) {
        title.push(this.$route.meta.title);
      }

      this.title = title;
    },
    /** 定时刷新未读消息数量 */
    /**首页提示弹窗*/
    // getUnreadCount() {
    //   if (window.getUnreadCount) return;
    //   window.getUnreadCount = setInterval(() => {
    //     messageManage.getUnreadCount().then(res => {
    //       this.unreadCount = res.data;
    //     });
    //   }, 1000 * 20);
    // },
    /**
     * 跳转到个人信息的页面
     */
    jumpPersional() {
      this.$router.push("/persional");
    },
    /**
     * 跳转到修改密码的页面
     */
    jumpChangePassword() {
      this.$router.push("/changePassword");
    },
    /**
     * 跳转到消息列表
     */
    jumpMessage() {
      this.$router.push("/message");
    },
    /** 获取用户当前所在车间工厂 */
    getCurrentWorkshop() {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const { userWorkshopId } = userInfo.principal;
      this.workshopId = userWorkshopId;
    },
    /** 获取用户所有所属车间工厂 */
    getWorkshopList() {
      userWorkshopManage.getList().then(res => {
        const data = res.data;
        const ary = data;
        this.workshopsList = ary;
      });
    },
    /**
     * 更换工厂车间时，刷新权限 // TODO
     */
    setUserWorkshop() {
      console.log("更换工厂了");
      userWorkshopManage.setWorkshop(null, this.workshopId).then(res => {
        getUserMenus();
        principal().then(() => {
          this.getCurrentWorkshop();
          console.log("工厂更换完了");
          const { fullPath } = this.$route;
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
      // 重新加载页面
      // location. reload();
      // this.$router.go(0);
    },
    /** 退出登陆 */
    logout() {
      this.$router.replace({
        name: "login",
        params: {
          // 阻止登陆
          preventLogin: true
        }
      });
      this.$store.dispatch("clear");
    }
  }
};
</script>
<style lang="scss" scoped>
.home-page {
  background-color: #f0f4f6;
  .left-message {
    float: left;
    .el-breadcrumb {
      font-size: 14px;
      line-height: inherit;
    }
  }
  .right-message {
    float: right;
    i {
      color: #909399;
      font-size: 0.2rem;
      margin: 0 0.05rem;
      vertical-align: middle;
    }
    span {
      color: #0077c8;
    }
  }
}
</style>

<style lang="scss">
.home-page {
  .right-message {
    .el-select {
      width: initial;
      input {
        text-align: end;
        border: none;
      }
    }
    .unread-count-message {
      line-height: initial;
    }
  }
}
</style>
