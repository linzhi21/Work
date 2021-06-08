<template>
  <div>
    <el-row>
      <el-card class="change-password-form">
        <el-form class="password-form" :model="passwordForm" label-width="1.4rem">
          <el-form-item label="填写旧密码">
            <el-input v-model="passwordForm.oldPassword" placeholder="旧密码"></el-input>
          </el-form-item>
          <el-form-item label="输入新密码">
            <el-input v-model="passwordForm.newPassword" placeholder="新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input v-model="passwordForm.confirmNewPassword" placeholder="新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="verifyPassword">
              <i class="el-icon-plus"></i>
              保存
            </el-button>
            <el-button @click="cancel">
              <i class="el-icon-minus"></i>
              取消
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>
<script>
// import * as user from "../../lib/api/user";
import * as user from '../../lib/api/userManage'
export default {
  data() {
    return {
      passwordForm: {
        // 修改密码的表单数据
        oldPassword: "", // 旧密码
        newPassword: "", // 新密码
        confirmNewPassword: "" // 确认新密码
      }
    };
  },
  created(){
  },
  methods: {
    /* 验证新密码 */
    verifyPassword() {
      const {
        oldPassword,
        newPassword,
        confirmNewPassword
      } = this.passwordForm;
      if (!oldPassword) {
        this.$message.warning("请填写旧密码");
        return;
      }
      if (!newPassword) {
        this.$message.warning("请填写新密码");
        return;
      }
      if (!confirmNewPassword) {
        this.$message.warning("请填写确认密码");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        this.$message.warning("两次密码不一致");
        return;
      }
      this.beforeChangePassword();
    },
    /* 修改密码前确认提示 */
    beforeChangePassword() {
      this.$confirm("确认修改密码？", "确认信息", {
        confirmButtonText: "保存",
        cancelButtonText: "放弃修改"
      })
        .then(this.changePassword)
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },
    /* 调用修改密码接口 */
    changePassword() {
       const {
        newPassword,
        confirmNewPassword
      } = this.passwordForm;
      const param  = {
        password: newPassword,
        repeatPassword: confirmNewPassword,
        userId: this.$store.state.user.userInfo.principal.id
      };
      user.editUserPassword(param).then(res=>{
        this.$message({
          type: "success",
          message: "密码修改成功！ "
        });
      }).catch(err => {
        this.$message({
          type: "error",
          message: "密码修改失败！ "
        });
      });
      this.clear();
    },
    /*取消修改密码 */
    cancel() {
      this.$router.go(-1);
    },
    /* 清空还原页面数据 */
    clear() {
      this.passwordForm.oldPassword = "";
      this.passwordForm.newPassword = "";
      this.passwordForm.confirmNewPassword = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.change-password-form {
  height: 10.1rem;
  .password-form {
    width: 5rem;
    margin: 0.4rem auto;
  }
}
</style>