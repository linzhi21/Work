// 损坏备件管理的按钮组
<template>
  <el-row class="buttom-group" type="flex" justify="end" align="middle">
    <el-button @click="exportDamageList" size="small">导出</el-button>
    <el-button type="primary" size="small" @click="$emit('batchDamageRegister')">损坏登记</el-button>
  </el-row>
</template>
<script>
import axios from "axios";
import apiConfig from "../../../../lib/api/apiConfig";
export default {
  data() {
    return {};
  },
  methods: {
    exportDamageList() {
      let url = `${apiConfig.spareBreakdown}/export`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token
          },
          responseType: "blob"
        })
        .then(res => {
          if (!res) return;

          let fileName = "备件损坏记录.xlsx";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
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
          this.$message.error(error.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.buttom-group {
  padding: 20px calc(0.2rem + 30px) 20px 0;
  div,
  > button {
    margin-left: 10px;
  }
}
</style>