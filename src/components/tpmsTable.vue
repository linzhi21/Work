// 设备履历
<template>
  <el-row>
    <el-table :height='data.length?620:"auto"' ref='table' :data="data" style="width: 100%" size="small" v-bind="$attrs" @selection-change='val=>selectionList=val' v-on="$listeners">
      <el-table-column v-if="columns.some(item=>item.type==='selection')" type="selection" width="55" v-bind="columns.filter(item=>item.type==='selection')[0]" />
      <el-table-column v-if="column_index" align="center" type="index" label="NO." width="60px" />
      <el-table-column align="center" min-width="100px" v-for="(item,index) in columns.filter(item=>item.type!=='selection')" :key="index" :label="item.label"
        v-bind="item">
        <el-table-column v-for="(child,i) in item.children" :key="i" v-bind="child" align="center">
          <template slot-scope="scope">
            <!-- 自定义插槽，item设置属性slotName，再传递相应的具名template -->
            <slot :name="child.slotName" v-bind='scope'>
              <!-- 自定义转换， translate为自定义转换方法-->
              {{child.translate?child.translate(scope.row[child.props],scope.row):scope.row[child.props]}}
            </slot>
          </template>
        </el-table-column>

        <template v-if="!item.children" slot-scope="scope">
          <!-- 自定义插槽，item设置属性slotName，再传递相应的具名template -->
          <slot :name="item.slotName" v-bind='scope'>
            <!-- 自定义转换， translate为自定义转换方法-->
            {{item.translate?item.translate(scope.row[item.props],scope.row):scope.row[item.props]}}
          </slot>
        </template>
      </el-table-column>

      <!-- 查看详情一列 -->
      <!-- TODO: 不建议再使用，灵活度不够，位置和el-table-column标签上的属性只能写死。 建议使用自定义插槽 -->
      <el-table-column v-if="$scopedSlots.seeDetail" label="维修记录" align="center" width="200px">
        <template slot-scope="scope">
          <slot name="seeDetail" :row="scope.row" />
        </template>
      </el-table-column>
      <!-- 自定义操作一列，用法同 element表格组件自定义列模版 -->
      <el-table-column v-if="$scopedSlots.default" label="操作" align="center" width="240px">
        <template slot-scope="scope">
          <slot v-bind='scope' />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination v-if="paginationIsShow" 
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage" 
      :page-sizes="pageSizes" 
      :page-size.sync="pageSize" 
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"></el-pagination>
  </el-row>
</template>
<script>
  export default {
    data() {
      return {
        equipmentTableData: [],
        currentPage: 1, //分页起 当前页
        pageSize: 10, //分页器 每页展示多少数据
        selectionList: [], //多选时，选中的数据
        //   total: 30 //分页器 一共有多少条数据
      };
    },
    props: {
      //   表格数据
      data: {
        type: Array,
        default: () => []
      },
      // 默认展示序号列
      column_index: {
        type: Boolean,
        default: true
      },
      // 表格展示的列
      columns: {
        type: Array,
        default: () => []
      },
      pageSizes: {
        type: Array,
        default: () => [5, 10, 15, 20]
      },
      // 一共多少条数据，用于计算总页数
      total: {
        type: Number | String,
        default: 0
      },
      // 是否展示分页组件
      paginationIsShow: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      /**
       * @description 分页器中pageSize 改变时触发的事件
       * @param {val} 每页的条数
       */
      handleSizeChange(val) {
        this.pageSize = val;
        this.$emit('getTableData');
      },
      /**
       * @description 分页器中currentPage 改变时触发的事件
       * @param {val} 当前页
       */
      handleCurrentChange(val) {
        this.currentPage = val;
        this.$emit('getTableData');
      },
      /** 重置当前页数；一般父组件点击查询按钮会调用 */
      resetCurrentPage() {
        this.currentPage = 1;
      },
      /**
       * 父组件调用获取分页数据
       * TODO: 父组件在mounted阶段才能调用
       */
      getData() {
        let data;
        if (this.paginationIsShow) {
          data = {
            page: this.currentPage - 1,
            size: this.pageSize
          };
        } else {
          data = null;
          console.warn('没有分页数据')
        };
        return data;
      },
      /**
       * 父组件调用获取多选的数据
       */
      getSelectionList() {
        return this.selectionList;
      },
      /** 通知父组件查询数据 */
      emit() {
        this.selectionList = []; //清空多选的数据
        this.$emit("inquireTableData");
      }
    }
  };
</script>
<style lang="scss" scoped>
</style>
