// 审批流管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref='tpmsHeader'   :formData='authFormList' @inquireTableData='inquireTableData' />
    </el-row>
    <el-row>
        <!-- 底部表格 -->
        <tpms-table ref='tpmsTable'
          :data='authLists'
          :columns='authTableList'
          :column_index='false'
          @getTableData="getTableData"
          @inquireTableData='inquireTableData'
        >
          <template slot-scope="{row}">
            <span class="button cursor">编辑</span>
          </template>
        </tpms-table>
    </el-row>
  </div>
</template>

<script>
  import {
    tpmsHeader,
    tpmsTable
  } from '../../components';
  import {
    getAuthLists
  } from "../../lib/api/workshopSettingsManage";
  export default {
    data() {
      return {
        SearchForm: {
          workshop: ''
        },
        authLists: [],
        authFormList:[
          //  渲染头部功能区的列表
          { label: "资料名称", key: "workshopTeamId", value: "", placeholder:'', type:'checkbox', checkList:[{label:'状态1',id:1},{label:'状态2',id:2}] },
          { label: "资料类型",labelWidth:'120px', key: "workshopTeamId", value: "", placeholder:'', type:'checkbox', checkList:[{label:'状态1',id:1},{label:'状态2',id:2}] },
          { label: "关键字", key: "workshopTeamId", value: "", placeholder:'请选择状态', type:'checkbox', checkList:[{label:'状态1',id:1},{label:'状态2',id:2}] },
          { label: "分享形式", key: "workshopTeamId", value: "", placeholder:'请选择状态', type:'checkbox', checkList:[{label:'状态1',id:1},{label:'状态2',id:2}] },
          { label: "上传人", key: "workshopTeamId", value: "", placeholder:'请选择状态', type:'checkbox', checkList:[{label:'状态1',id:1},{label:'状态2',id:2}] },
          ],
        authTableList: [{
            props: 'id',
            label: 'No.'
          },
          {
            props: '',
            label: '资料名称'
          },{
            props: 'id',
            label: '资料类型'
          },
          {
            props: 'id',
            label: '关键字'
          },
          {
            props: 'id',
            label: '分享形式'
          },
          {
            props: 'id',
            label: '上传人'
          },
         {
            props: 'id',
            label: '上传时间'
          },
          {
             props: 'id',
             label: '评论次数'
           },
          {
            props: 'id',
            label: '点赞次数'
          },
          {
           props: 'id',
           label: '共享答复'
          },
        ],
      }
    },
    components:{
      tpmsHeader,tpmsTable
    },
    mounted() {
      this.getTableData()

    },
    methods: {
     /** 点击查询按钮 */
     inquireTableData() {
       // 重置table页为第一页
       this.$refs.tpmsTable.resetCurrentPage();

       this.getTableData();
     },
     /** 加载页面表格数据 */
     getTableData(){
       // 获取头部搜索组数据
       let data = this.$refs.tpmsHeader.getData();
       let pageData = this.$refs.tpmsTable.getData();
      //  getAuthLists({...data,...pageData}).then(res=>{
      //     this.authLists = res.data.content
      //  })
     },

    }
  };
</script>

<style>
  .add-drawer {
    margin-top: 0.8rem;
  }
</style>
