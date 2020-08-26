// 异常领用记录页面的按钮组
<template>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button type="primary" size="small" @click="exportData">导出</el-button>
    </el-row>
</template>
<script>
//
export default {
  methods: {
      exportData(){},
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