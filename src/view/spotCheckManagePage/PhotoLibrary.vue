<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <el-card class="equipment-manage">
        <!-- 头部功能区 -->
        <tpms-header
          ref="tpmsHeader"
          :formData="equipmentFormList"
          @inquireTableData="inquireTableData"
          label-width="90px"
        />
        <el-row class="buttom-group" type="flex" justify="end" align="middle">
          <!-- <el-button class="button-more" size="small">下载</el-button> -->
          <!-- <el-button class="button-more" size="small" type="primary">新增</el-button> -->
           <tpms-choosefile accept="image/*"   size="small" text='新增' @getFileData='getMutipleFileData($event)'></tpms-choosefile>     
        </el-row>
        <!-- 主题内容区 -->
        <el-row>
          <el-col :span="6" v-for="(item,index) in equipmentTableData" :key='index'>
            <el-card class="spot-card">
              <p class="title" style="text-align: center;">{{item.originName}}</p>
              <img
                class="spot-photo"
                :src="accessoryFile+'/'+item.path+item.name"
                download='1.png'
                alt
              />
              <div class="img-icon flex-wrap">
                <i class="el-icon-delete flex-icon cursor" @click="del(item)"></i>
                <!-- <i class="el-icon-edit flex-icon" @click="edit(item)"></i> -->
                <i class="el-icon-download flex-icon cursor" @click="download(item)"></i>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 分页区 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { tpmsHeader,tpmsChoosefile } from "../../components";
import axios from 'axios';
import apiConfig from '../../lib/api/apiConfig';
import {
  accessoryList,
  delAccessory,
  downloadAccessory,
  uploadAccessory,
  uploadAccessoryBatch,
  accessoryFile
} from "../../lib/api/accessory";
export default {
  data() {
    return {
      equipmentFormList: [
        //  渲染头部功能区的列表
        { label: "文件名", props: "originName", value: "" },
      ],
      currentPage:1,
      pageSize:10,
      total: 0,
      // 表格的数据
      equipmentTableData: [],
      accessoryFile:accessoryFile
    };
  },
  components: {
    tpmsHeader,tpmsChoosefile 
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 新增文件
    getMutipleFileData(files){
       let formData = new FormData();
       formData.append('file',files)
        formData.append('module','64');
         this.$store.commit('SET_UPLOADING',true)
        uploadAccessory(formData,64).then(res=>{
          console.log(res)
           this.$store.commit('SET_UPLOADING',false);
           this.getTableData();
        })
    },
    /**
     * @description 分页器中pageSize 改变时触发的事件
     * @param {val} 每页的条数
     */
    handleSizeChange(val) {
      this.pageSize=val;
      this.getTableData()
      // console.log(`每页 ${val} 条`);
    },
    /**
     * @description 分页器中currentPage 改变时触发的事件
     * @param {val} 当前页
     */
    handleCurrentChange(val) {
       this.currentPage=val
       this.getTableData()
      // console.log(`当前页: ${val}`);
    },
    /**查询*/
    inquireTableData() {
      // 重置table页为第一页
      this.currentPage=1
      this.getTableData();
    },
    /** 加载页面表格数据 */
    getTableData() {
      // 获取头部搜索组数据
      let data = this.$refs.tpmsHeader.getData();
      let page={
        page:this.currentPage-1,
        size:this.pageSize
      }
      accessoryList({ module:64,...data,...page}).then((res) => {
        this.total = res.data.totalElements;
        this.equipmentTableData = res.data.content;
      });
    },
     /** 删除 */
    del(item) {
      delAccessory(null, item.id).then((res) => {
        this.getTableData();
      });
    },
     /** 编辑 */
    edit(item) {
      var data = item;
      delAccessory(data).then((res) => {
        this.getTableData();
      });
    },
     /** 下载 */
    download(item) {
      let url = apiConfig.downloadAccessory+'/'+item.id; //请求下载文件的地址
      let token = localStorage.getItem('access_token'); //获取token
      axios
        .get(url, {
          headers: {
            Authorization:'Bearer ' + token
          },
          enctype:"multipart/form-data",
          responseType: "blob"
        })
        .then(res => {
          console.log(res)
          if (!res) return;
          let blob = new Blob([res.data], {
            type: "application/x-png;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download",item.originName); // 下载的文件
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-row {
  padding: 0.2rem 0.4rem;
  .inline-block {
    display: inline-block;
    width: 200px;
  }
}
.spot-card {
  width: 90%;
  height: 3.5rem;
  padding: 0.05rem;
  margin: 5px auto;
  border-radius: 0.1rem;
}
.spot-photo {
  width: 100%;
  height: 2.4rem;
  // border-radius: 0.2rem 0.2rem 0 0;
  margin-bottom: 0.2rem;
}
.title {
  width: 100%;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
}

.button-group {
  padding-top: 7px;
}
.img-icon {
  text-align: center;
}
.flex-wrap{
  display: flex;
}
.flex-icon{
  flex:1;
  font-size: 20px;
  cursor: pointer;
}
.flex-icon.el-icon-delete{
  color:#CB333B;
}
.flex-icon.el-icon-download{
  color:#0077DC;
}
</style>
