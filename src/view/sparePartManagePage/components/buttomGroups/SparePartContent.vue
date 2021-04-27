// 备件管理页面的按钮组
<template>
  <div>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button size="small" @click="$emit('setSpareParts')">常用备件设置</el-button>
      <el-button size="small" @click="getRepairLimit">返修上限设置</el-button>
      <!-- <el-button size="small" @click="$emit('batchDamageRegister')">批量损坏登记</el-button> -->

      <el-button size="small" @click="$emit('exportSpare')">导出</el-button>
      <!-- <el-upload
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
      </el-upload>-->

      <!-- <el-button v-if="syncing" type="primary" size="small">
      <i class="el-icon-loading" />
      同步中
    </el-button>
      <el-button v-else type="primary" size="small" @click="sync">同步</el-button>-->
    </el-row>

    <el-dialog title="返修上限设置" :visible.sync="isShow" width="680px">
      <el-form :inline="true">
        <div v-for="(formInline, index) in repairLimits" :key="index">
          <el-form-item label="返修类型">
            <el-select v-model="formInline.key" placeholder="返修类型" size="small" disabled>
              <el-option :label="formInline.keyLabel" :value="formInline.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="返修上限值">
            <el-input v-model="formInline.value" placeholder="返修上限值" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="confirmEdit(formInline)">确认修改</el-button>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="isShow = false">返回</el-button>
        <el-button type="primary" @click="isShow = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRepairLimitList,
  changeRepairLimit,
  spareExport
} from "../../../../lib/api/spart";
import axios from 'axios';
import apiConfig from "../../../../lib/api/apiConfig";

export default {
  data() {
    return {
      uploading: false,
      syncing: false,
      isShow: false,
      repairLimits: [
        {
          keyLabel: "委内维修",
          key: "SPARE_REPAIR_LIMIT_INNER",
          value: ""
        },
        {
          keyLabel: "委外维修",
          key: "SPARE_REPAIR_LIMIT_OUTER",
          value: ""
        }
      ]
    };
  },
  created() {},
  methods: {
    /**
     * 获取返修上限
     */
    getRepairLimit() {
      this.isShow = true;
      getRepairLimitList().then(res => {
        this.repairLimits.forEach(l => {
          res.data.content.forEach((item, index) => {
            if (item.key == l.key) {
              l.value = item.value;
            }
          });
        });
      });
    },
    /**
     * 修改返修上限
     */
    confirmEdit(row) {
      changeRepairLimit({ value: row.value, key: row.key })
        .then(res => {
          this.$message.success("修改成功");
        })
        .catch(fail => {
          this.$message.error("修改失败");
        });
    },
    /**
     * 导出备件
     */
    exportSpare() {
      let url = `${apiConfig.spare}/export`; //请求下载文件的地址
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

          let fileName = '备件清单.xlsx';
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
          this.$message.error(error.message);
        });
    },
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
    sync() {
      this.syncing = true;
      this.$emit("syncSpareParts");
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
