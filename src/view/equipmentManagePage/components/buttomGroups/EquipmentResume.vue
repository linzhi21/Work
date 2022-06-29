// 设备履历页面的按钮组
<template>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button size="small" @click='downloadBom'>
        下载BOM表单模版
      </el-button>
     <!-- <el-upload
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
      </el-upload> -->
	   <tpms-choosefile style="margin-left:10px ;" size="small" @getFileData='uploadBom' type="default" text="上传BOM表单"></tpms-choosefile>
      <!-- 下拉选择框 -->
      <el-dropdown class="button-more">
        <el-button type="primary" size="small">
          <i class="el-icon-arrow-down el-icon--right"></i>
          更多
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <!-- <el-upload
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

            </el-upload> -->
             <tpms-choosefile @getFileData='uploadDevice' type="default" text="导入设备"></tpms-choosefile>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click='downloadDevice'>
              <slot>
                <el-button style="margin:0 10px"  size="small"  type="default">导出设备</el-button>
              </slot>
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
</template>
<script>
import axios from 'axios';
import apiConfig from '../../../../lib/api/apiConfig';
import tpmsChoosefile from '../../../../components/tpmsChoosefile.vue'
import {uploadDevice,uploadBom,deviceManage} from '../../../../lib/api/device.js'
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
  props:{
    getHeaderData: {
      type: Function,
      default: () => ({})
    }
  },
  components:{
    tpmsChoosefile
  },
  methods: {
    uploadDevice(file){
      let formData=new FormData();
      formData.append('file',file);
      this.$store.commit('SET_UPLOADING',true)
      uploadDevice(formData).then(res=>{
        this.$store.commit('SET_UPLOADING',false)
        this.$emit('getTableData');

      })
    },
    uploadBom(file){
      let formData=new FormData();
      formData.append('file',file);
      this.$store.commit('SET_UPLOADING',true)
      uploadBom(formData).then(res=>{
        this.$store.commit('SET_UPLOADING',false)
        this.$emit('getTableData')
      })
    },
    downloadDevice(){
      let url = `${apiConfig.deviceDownload}?IsModel=false`; //请求下载文件的地址
      let token = localStorage.getItem('access_token'); //获取token
      const params = this.getHeaderData();
      axios
        .get(url, {
          params,
          headers: {
            Authorization:'Bearer ' + token
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) return;

          let fileName = 'device.xlsx';
          const disposition = res.headers['content-disposition'];
          if(disposition){
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", fileName); // 下载的文件
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
     /**
     * 批量删除
     */
    deleteMore() {
      const selected = this.$refs.tpmsTable.getSelectionList();
      const ids = selected.map((item) => item.id);
      this.$confirm("此操作将删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
          deviceManage.remove(null, ids).then((res) => {
            this.$message.success("删除成功");
            this.getTableData();
          });
        })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
    },
    /**
     * 批量删除
     */
    handleSelectionChange() {
    },
    downloadBom(){
        let url = apiConfig.bomDownload; //请求下载文件的地址
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

            let fileName = 'bom.xlsx';
            const disposition = res.headers['content-disposition'];
            if(disposition){
              const name = disposition.split(";")[1].split("filename=")[1];
              fileName = decodeURI(name);
            }

            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8"
            });
            let url = window.URL.createObjectURL(blob);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute("download", fileName); // 下载的文件
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
      this.BOMisUploading = false;
      this.$message({
        message: "BOM表单上传完成",
        type: "success"
      });
    },
    /** BOM表单上传错误时的钩子 */
    BOM_uploadError(err) {
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
      this.deviceIsUploading = false;
      this.$message({
        message: "设备信息上传完成",
        type: "success"
      });
    },
    /** 设备信息上传错误时的钩子 */
    device_uploadError(err) {
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
