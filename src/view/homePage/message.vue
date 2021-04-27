<template>
  <el-row>
    <el-card>
      <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button size="small" @click='readAll'>
            全部已读
        </el-button>
        <el-button size="small" type="primary" @click='cleanAll'>
            全部清空
        </el-button>
      </el-row>
      <tpmsTable
        ref="tpmsTable"
        :total="table.total"
        :data="table.data"
        :columns="[
            {label:'内容',props:'content'},
            {label:'时间',props:'createDate'},
            {label:'状态',props:'readed',translate:(val)=>val?'已读':'未读'},
          ]"
        @getTableData="getTableData"
      >
        <template slot-scope="{row}">
          <span v-if="!row.readed" class="button cursor" @click="readOne(row)">已读</span>
        </template>
      </tpmsTable>

      <!-- 消息详情模态框 -->
      <el-dialog title="消息详情" :visible.sync="detailDialog.isShow" width="80%">
        <el-row>
          <el-form :model="detailDialog.data" ref="form" label-width="140px" label-position="left">
            <el-row>
              <el-col :span="11">
                <el-form-item label="内容">
                  <el-input v-model="detailDialog.data.content" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="时间" required="required">
                  <el-input v-model="detailDialog.data.createDate"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-col :span="7" :offset="17" style="margin-top:20px">
            <el-form-item>
              <!-- <el-button v-if="newAddDialogTitle==='新增'" type="primary" @click="submitForm()">提交</el-button>
              <el-button v-if="newAddDialogTitle==='编辑'" type="primary" @click="changePlan()">保存</el-button>-->
              <el-button @click="detailDialog.isShow = false">取 消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-dialog>
    </el-card>
  </el-row>
</template>

<script>
import { tpmsTable } from "../../components";
import { messageManage } from "../../lib/api/system";
export default {
  data() {
    return {
      // 表格数据
      table: {
        data: [],
        total: 0,
      },
      // 模态框数据
      detailDialog: {
        id: '',
        isShow: false,
        data: {},
      }
    }
  },
  components: {
    tpmsTable
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    /** 加载消息列表 */
    getTableData() {
      const pageData = this.$refs.tpmsTable.getData();
      messageManage.getList({
          ...pageData,
          deleted:false
      }).then(res => {
        const { content, totalElements } = res.data;
        this.table.data = content;
        this.table.total = totalElements;
      })
    },
    /** 加载消息详情 */
    getDetail({ uuid }) {
      const { detailDialog } = this;
      detailDialog.isShow = true;
      detailDialog.id = id;
      messageManage.getDetail(null, uuid).then(res => {
        detailDialog.data = res.data;
      })
    },
    /** 标记单个消息为已读 */
    readOne({ id }) {
      messageManage.readOne(null, id).then(res => {
        this.getTableData();
      })
    },
    /** 全部已读 */
    readAll(){
        messageManage.readAll().then(res=>{
            this.getTableData();
        })
    },
    /** 全部清空 */
    cleanAll(){
        const ids = this.table.data.map(item=>item.id).join(',');
        messageManage.cleanAll({ids}).then(res=>{
            this.getTableData();
        })
    }
  }
}
</script>

<style>
</style>