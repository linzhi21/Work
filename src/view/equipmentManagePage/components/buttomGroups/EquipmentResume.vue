// 设备履历页面的按钮组
<template>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button size="small" @click='downloadBom'>
        下载BOM表单
      </el-button>
      <el-upload
        action="http://47.102.146.110:8080/tpms/device/api/device/bom/upload"
        :headers='uploadHeaders'
        :disabled="BOMisUploading"
        :show-file-list="false"
        :before-upload="BOM_beforeUpload"
        :on-success="BOM_uploadSucess"
        :on-error="BOM_uploadError"
      >
        <el-button v-if="BOMisUploading" class="upload-bom-btn" size="small">
          <i class="el-icon-loading"></i>
          BOM表单上传中
        </el-button>
        <el-button v-else class="upload-bom-btn" size="small">上传BOM表单</el-button>
      </el-upload>
      <!-- 下拉选择框 -->
      <el-dropdown class="button-more">
        <el-button type="primary" size="small">
          <i class="el-icon-arrow-down el-icon--right"></i>
          更多
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-upload
              :action="action"
              :disabled="deviceIsUploading"
              :headers='uploadHeaders'
              :show-file-list="false"
              :before-upload="device_beforeUpload"
              :on-success="device_uploadSucess"
              :on-error="device_uploadError"
            >
              <el-button class="border-none" v-if="deviceIsUploading" size="small">
                <i class="el-icon-loading" />
                正在导入
              </el-button>
              <el-button class="border-none" v-else size="small">导入设备</el-button>
            </el-upload>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button class="border-none" size="small" @click='downloadDevice'>导出设备</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
      BOMisUploading: false, //BOM表单是否正在上传
      BOMdata: false, //BOM备件维修详情模态框数据
      BOMspartPartRecordData: [], //BOM备件维修记录列表
      deviceIsUploading: false, //设备信息是否正在上传
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
			  console.log(res)
            if (!res) return;
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8"
            });
            let url = window.URL.createObjectURL(blob);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", "Bom.xls"); // 下载的文件
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
            window.URL.revokeObjectURL(url);
          })
          .catch(error => {
            this.$message.error(error);
          });
    },
    /** BOM上传之前的钩子 */
    BOM_beforeUpload() {
      this.BOMisUploading = true;
    },
    /** BOM表单上传完成时钩子 */
    BOM_uploadSucess(res, file, fileList) {
      console.log(res);
      console.log(file);
      console.log(fileList);
      this.BOMisUploading = false;
      this.$message({
        message: "BOM表单上传完成",
        type: "success"
      });
    },
    /** BOM表单上传错误时的钩子 */
    BOM_uploadError(err) {
      console.log(err);
      this.BOMisUploading = false;
      this.$message({
        message: "BOM表单上传失败",
        type: "error"
      });
    },
    /** 设备上传之前的钩子 */
    device_beforeUpload() {
      this.deviceIsUploading = true;
    },
    /** 设备信息上传完成时钩子 */
    device_uploadSucess(res, file, fileList) {
      console.log(res);
      console.log(file);
      console.log(fileList);
      this.deviceIsUploading = false;
      this.$message({
        message: "设备信息上传完成",
        type: "success"
      });
    },
    /** 设备信息上传错误时的钩子 */
    device_uploadError(err) {
      console.log(err);
      this.deviceIsUploading = false;
       // this.$msgbox({
       //  title: '消息',
       // })
      this.$message({
        message: "设备信息上传失败,错误信息:"+err,
        type: "error"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.buttom-group{
    padding: 20px calc(0.2rem + 30px) 20px 0;
    div{
        margin-left: 10px;
    }
}
</style>
