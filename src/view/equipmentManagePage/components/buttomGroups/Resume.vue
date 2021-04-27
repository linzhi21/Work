<template>
  <div>
    <el-button-group>
      <el-button icon="el-icon-search" @click="searchShow">查询</el-button>
      <el-button>同步BOM</el-button>
      <el-button>设备同步</el-button>
    </el-button-group>
    <el-dropdown @command="handleCommand">
      <el-button>
        模板下载
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="downloadBom">下载BOM模板</el-dropdown-item>
        <el-dropdown-item command="downloadDevice">下载设备模板</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import axios from "axios";
import apiConfig from "../../../../lib/api/apiConfig";
export default {
  data() {
    return {};
  },
  methods: {
    handleCommand(c) {
      switch (c) {
        case "downloadBom":
          this.downloadBom();
          break;
        case "downloadDevice":
          this.downloadDevice();
          break;
        default:
          break;
      }
    },
    downloadBom() {
      // let url = apiConfig.bomDownload; //请求下载文件的地址
      // let token = localStorage.getItem("access_token"); //获取token
      // axios
      //   .get(url, {
      //     headers: {
      //       Authorization: "Bearer " + token
      //     },
      //     responseType: "blob"
      //   })
      //   .then(res => {
      //     console.log(res);
      //     if (!res) return;
      //     let blob = new Blob([res.data], {
      //       type: "application/vnd.ms-excel;charset=utf-8"
      //     });
      //     let url = window.URL.createObjectURL(blob);
      //     let aLink = document.createElement("a");
      //     aLink.style.display = "none";
      //     aLink.href = url;
      //     aLink.setAttribute("download", "Bom.xls"); // 下载的文件
      //     document.body.appendChild(aLink);
      //     aLink.click();
      //     document.body.removeChild(aLink);
      //     window.URL.revokeObjectURL(url);
      //   })
      //   .catch(error => {
      //     this.$message.error(error);
      //   });
    },
    downloadDevice() {
      console.log("DEVICE");
      // let url = `${apiConfig.deviceDownload}?IsModel=false`; //请求下载文件的地址
      // let token = localStorage.getItem("access_token"); //获取token
      // axios
      //   .get(url, {
      //     headers: {
      //       Authorization: "Bearer " + token
      //     },
      //     responseType: "blob"
      //   })
      //   .then(res => {
      //     if (!res) return;
      //     let blob = new Blob([res.data], {
      //       type: "application/vnd.ms-excel;charset=utf-8"
      //     });
      //     let url = window.URL.createObjectURL(blob);
      //     let aLink = document.createElement("a");
      //     aLink.style.display = "none";
      //     aLink.href = url;
      //     aLink.setAttribute("download", "Device.xls"); // 下载的文件
      //     document.body.appendChild(aLink);
      //     aLink.click();
      //     document.body.removeChild(aLink);
      //     window.URL.revokeObjectURL(url);
      //   })
      //   .catch(error => {
      //     this.$message.error(error);
      //   });
    },
    searchShow() {
      console.log("打开搜索");
      this.$emit('searchShow',true);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>