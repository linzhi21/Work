<template>
  
    <!-- 查看详情|审批 对话框 -->
    <el-dialog
      title="领用申请"
      :visible.sync="addDialogIsShow"
      width="80%"
      @closed="dialogData={}"
    >
      <el-row>
        <el-form :model="dialogData" label-position="left" label-width="120px" disabled>
          <el-col
            :span="item.type==='textArea'?24:11"
            :offset="index%2&&item.type!=='textArea'?2:0"
            v-for="(item,index) in dialogForm"
            :key="item.label"
          >
            <el-form-item :label="item.label">
              <el-input
                v-if="item.type==='textArea'"
                type="textarea"
                v-model="dialogData[item.props]"
              />
              <el-input v-else disabled v-model="dialogData[item.props]" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row v-if="dialogType==='approval'" type="flex" justify="center">
        <el-button @click="approval(false)">审批驳回</el-button>
        <el-button type="primary" @click="approval(true)">审批通过</el-button>
      </el-row>
      <el-row v-if="dialogType==='detail'" type="flex" justify="center">
        <el-button type="primary" @click="dialogIsShow = false">返 回</el-button>
      </el-row>
    </el-dialog>
</template>
<script>
export default {
  props: [''],
  data() {
    addDialogIsShow: false;
  },
  methods:{
    
  }
}
</script>
<style lang="scss" scoped>

</style>