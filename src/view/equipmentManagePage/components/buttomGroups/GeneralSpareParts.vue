// 通用备件页面的按钮组
<template>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <!-- 下拉选择框 -->
      <el-dropdown class="button-more" trigger="click" placement='bottom'>
        <el-button v-if="isUploading" size="small">
            <i class="el-icon-loading" />
            正在导入
        </el-button>
        <el-button v-else size="small">
          <i class="el-icon-arrow-down el-icon--right"></i>
          导入
        </el-button>
        <el-dropdown-menu slot="dropdown" v-if="!isUploading">
          <el-dropdown-item>
            <el-button size="small" style="width:80px;" @click='downloadDevice'>下载模版</el-button>
          </el-dropdown-item>
          <el-dropdown-item :disabled='isUploading'>
            <el-upload
              :action='action'
              :disabled="isUploading"
              :headers='uploadHeaders'
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="uploadSucess"
              :on-error="uploadError"
            >
              <el-button size="small" style="width:80px;text-align:center;">导入</el-button>
            </el-upload>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" size="small" @click='downloadBom'>导出</el-button>
      <!-- <el-button type="primary" size="small">新增</el-button> -->
    </el-row>
</template>
<script>
  import axios from 'axios';
  import apiConfig from '../../../../lib/api/apiConfig';
//
export default {
  data() {
    return {
      action:`${apiConfig.systemUrl}/tpms/device/api/device/upload`,
      isUploading: false, //是否正在上传
      uploadHeaders:{Authorization:'Bearer ' + localStorage.getItem('access_token')}
    };
  },
  methods: {
    downloadDevice(){
      let url = `${apiConfig.systemUrl}/tpms/device/api/device/download?IsModel=false`; //请求下载文件的地址
      let token = localStorage.getItem('access_token'); //获取token
      axios
        .get(url, {
          headers: {
            Authorization:'Bearer ' + token
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) return;
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", "Device.xls"); // 下载的文件
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    downloadBom(){
        let url = `${apiConfig.systemUrl}/tpms/device/api/device/bom/download`; //请求下载文件的地址
        let token = localStorage.getItem('access_token'); //获取token
        axios
          .get(url, {
            headers: {
              Authorization:'Bearer ' + token
            },
            responseType: "blob"
          })
          .then(res => {
            if (!res) return;
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8"
            });
            let url = window.URL.createObjectURL(blob);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", "BOM.xls"); // 下载的文件
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
            window.URL.revokeObjectURL(url);
          })
          .catch(error => {
            this.$message.error(error);
          });
    },
    /** 设备上传之前的钩子 */
    beforeUpload() {
      this.isUploading = true;
    },
    /** 上传完成时钩子 */
    uploadSucess(res, file, fileList) {
      console.log(res);
      console.log(file);
      console.log(fileList);
      this.isUploading = false;
      this.$message({
        message: "导入完成",
        type: "success"
      });
    },
    /** 上传错误时的钩子 */
    uploadError(err) {
      console.log(err);
      this.isUploading = false;
      this.$message({
        message: "导入失败",
        type: "error"
      });
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
