<template>
  <div>
    <!-- 个人信息表单 -->
    <el-row>
      <el-card class="persion-card">
        <el-form class="persion-form" :model="perisonList" label-width="0.8rem">
          <el-form-item :label="item.label" v-for="(item,index) in arr" :key="index">
            <el-input :model="perisonList[item.name]" :placeholder="item.content"></el-input>
          </el-form-item>
          <el-form-item label="头像">
               <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                >
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
          </el-form-item>
          <el-form-item>
              <el-button type="primary">
                  <i class="el-icon-plus"></i>
                  保存
                </el-button>
                <el-button>
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
export default {
  data() {
    return {
      perisonList: {            // 个人信息
          jobNumber:'',         // 工位
          name:'',              // 姓名
          sex:'',               // 性别
         telphone:'',           // 电话  
          eMail:'',             // 邮箱
          workshop:'',          // 车间
          workshopSection:'',   // 工段
          team:'',              // 班组
          station:'',           // 工位
          class:'',             // 班次
          post:'',              // 岗位
          avator:''             // 头像

      },   // 
      arr: [
        { name:'jobNumber',label: "工号", content: "干燥设备" },
        { name:'name',label: "姓名", content: "设备名称" },
        { name:'sex',label: "性别", content: "型号描述" },
        { name:'telphone',label: "电话", content: "1234567" },
        { name:'eMail',label: "邮箱", content: "1234567" },
        { name:'workshop',label: "车间", content: "1234567" },
        { name:'workshopSection',label: "工段", content: "1234567" },
        { name:'team',label: "班组", content: "1234567" },
        { name:'station',label: "工位", content: "1234567" },
        { name:'class',label: "班次", content: "1234567" },
        { name:'post',label: "岗位", content: "1234567" }
      ],
        dialogImageUrl: '',     // 用户上传的头像地址
        dialogVisible: false    // 控制用户头像图片的对话框的打开与关闭 
    };
  },
  methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
       /**
        * @description 获取用户上传的头像并赋值给dialogImageUrl，并且打开对话框
        * @param {object} file 用户上传的头像对象 
        */
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
  }
};
</script>
<style lang="scss" scoped>
  .persion-card {
    height: 10.1rem;
    .persion-form {
      width: 5rem;
      margin: 0.4rem auto;
    }
  }
.el-upload--picture-card{
    width: 0.84rem;
    height: 0.84rem;
    line-height: 0.84rem;
}
.el-upload--picture-card i{
    font-size: 0.24rem;
}
.el-form-item{
    margin-bottom: 0.15rem;
}
</style>