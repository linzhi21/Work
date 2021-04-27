<template>
  <div>
    <el-row>
      <el-card class="log-manage">
        <!-- 头部功能区 -->
        <tpms-header
          ref="tpmsHeader"
          :formData="logFormList"
          @inquireTableData="inquireTableData"
          label-width="90px"
        />
        <!-- 表格 -->
        <tpms-table
          ref="tpmsTable"
          :data="logTableData"
          :columns="logTableList"
          :total="total"
          @inquireTableData="inquireTableData"
          @getTableData="getTableData"
        >
          <!-- <template slot-scope="{row}">
            <span class="button cursor" @click="seeDeatil(row)">查看</span>
          </template> -->
        </tpms-table>
        <!-- 分页 -->
      </el-card>
    </el-row>
  </div>
</template>
<script>
import { tpmsHeader, tpmsTable } from "../../components";
import { getLog as getData } from "../../lib/api/log";

export default {
  data() {
    return {
      logFormList: [{ label: "方法名(默认登陆日志)", props: "method", value: "login" }],
      logTableData: [{}],
      logTableList: [
        { props: "username", label: "用户名" },
        { props: "operation", label: "操作" },
        { props: "method", label: "方法名" },
        { props: "success", label: "状态" },
        { props: "createDate", label: "调用时间" },
        { props: "ip", label: "IP" },
        { props: "exception", label: "异常信息" }
      ],
      currentPage: 1, //分页起 当前页
      pageSize: 30, //分页器 每页展示多少数据
      total: 30 //分页器 一共有多少条数据
    };
  },
  components: {
    tpmsHeader,
    tpmsTable
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    /**
     * @description 分页器中pageSize 改变时触发的事件
     * @param {val} 每页的条数
     */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.getTableData();
    },
    /**
     * @description 分页器中currentPage 改变时触发的事件
     * @param {val} 当前页
     */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getTableData();
    },
    /** 查询页面表格数据 */
    inquireTableData() {
      // this.currentPage = 1;
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getTableData();
    },
    /** 加载页面表格数据 */
    getTableData() {
      // 获取头部搜索组数据
      const data = this.$refs.tpmsHeader.getData();
      const pageData = this.$refs.tpmsTable.getData();
      const param = {
        ...data,
        ...pageData
      };
      getData(param).then(res => {
        console.log(res);
        this.total = res.data.totalElements;
        this.logTableData = res.data.content;
      });
    }
  }
};
</script>
<style lang="sass">

</style>