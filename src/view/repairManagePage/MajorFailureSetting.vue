<template>
  <div>
    <el-row class="major-failure">
      <p>
        <span>大故障记录时间(分钟):</span>
        <el-input v-model="time" size="small" :readonly="!edit" style="width:100px;margin-right:30px;" />
        <el-button v-if="edit" size="small" @click="edit=!edit">取消</el-button>
        <el-button v-if="edit" type="primary" size="small" @click="beforeChangeTime">保存</el-button>
        <el-button v-if="!edit" type="primary" size="small" @click="edit=!edit">编辑</el-button>
      </p>
    </el-row>
  </div>
</template>
<script>
import { bigFaultTimeManage } from '../../lib/api/business'
export default {
  data() {
    return {
      time: '',        // 大故障记录时间
      edit: false,
    }
  },
  created() {
    this.getTime();
  },
  methods: {
    /** 获取大故障记录时间 */
    getTime() {
      bigFaultTimeManage.get().then(res => {
        this.time = res.data;
      })
    },
    /** 修改时间志强 */
    beforeChangeTime() {
      this.$confirm("确定要修改吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changeTime();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    /** 修改大故障记录时间 */
    changeTime() {
      console.log(this.time)
      this.edit = false;
      const data = {
          time: this.time,
      };
      bigFaultTimeManage.edit(data).then(res=>{
        this.$message.success('修改完成');
        this.getTime();
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.major-failure {
  height: 100vh;
  padding: 0.5rem 0;
  p {
    height: 0.5rem;
  }
  .el-button {
    margin-top: 0.5rem;
  }
}
</style>