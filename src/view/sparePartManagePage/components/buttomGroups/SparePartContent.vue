// 备件管理页面的按钮组
<template>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button size="small" @click="$emit('setSpareParts')">常用备件库设置</el-button>
      <el-button size="small">导出</el-button>

        <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :disabled="uploading"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="uploadSucess"
            :on-error="uploadError"
        >
            <el-button class="border-none" v-if="uploading" size="small">
                <i class="el-icon-loading" />
                正在导入
            </el-button>
            <el-button class="border-none" v-else size="small">导入</el-button>
        </el-upload>

      <el-button size="small" @click="$emit('batchDamageRegister')">批量损坏登记</el-button>
      <el-button v-if="syncing" type="primary" size="small">
          <i class="el-icon-loading" />
          同步中
      </el-button>
      <el-button v-else type="primary" size="small" @click="sync">同步</el-button>
    </el-row>
</template>
<script>
//
export default {
    data(){
        return {
            uploading:false,
            syncing:false,
        }
    },
  methods: {
    /** 导入之前的钩子 */
    beforeUpload() {
      this.uploading = true;
    },
    /** 导入完成时钩子 */
    uploadSucess(res, file, fileList) {
      console.log(res);
      console.log(file);
      console.log(fileList);
      this.uploading = false;
      this.$message({
        message: "导入完成",
        type: "success"
      });
    },
    /** 导入错误时的钩子 */
    uploadError(err) {
      console.log(err);
      this.uploading = false;
      this.$message({
        message: "导入失败",
        type: "error"
      });
    },
    /** 点击同步按钮 */
    sync(){
        this.syncing=true;
        this.$emit('syncSpareParts');
    }
  }
};
</script>
<style lang="scss" scoped>
.buttom-group{
    padding: 20px calc(0.2rem + 30px) 20px 0;
    div,>button{
        margin-left: 10px;
    }
}
</style>