<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
    data(){
        return{ 
            equipmentForm:{             // 设备管理头部表单
                equipmentName:'',           // 设备名称
                equipmentNumber:'',         // 设备编号
                workshopSection:'',         // 工位
                team:'',                    // 班组
                equipmentArea:''            // 区域
            },
            equipmentFormList:[         //  渲染头部功能区的列表
                {label:'设备名称',name:'equipmentName'},
                {label:'设备编号',name:'equipmentNumber'},
                {label:'工位',name:'workshopSection'},
                {label:'班组',name:'team'},
                {label:'区域',name:'equipmentArea'},
            ],
            equipmentTableData:[            // 表格的数据
            ],
            equipmentTableList:[                // 渲染表格的表头
                {props:'equipmentNumber',name:'设备编号'},
                {props:'equipmentName',name:'设备名称'},
                {props:'wokrshop',name:'车间名称'},
                {props:'equipmentArea',name:'区域名称'},
                {props:'sectionName',name:'工段名称'},
                {props:'team',name:'班组名称'},
                {props:'jobNumber',name:'工位名称'},
                {props:'manufacturer',name:'生产厂商'},
                {props:'codeNumber',name:'二维码值'},
                {props:'enable',name:'是否启用'},
                {props:'whether',name:'是否'}
            ]
        }
    },
    methods:{
        /**
         * @description 分页器中pageSize 改变时触发的事件
         * @param {val} 每页的条数
         */
         handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
       /**
         * @description 分页器中currentPage 改变时触发的事件
         * @param {val} 当前页
         */
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
};
</script>
<style lang="scss" scoped>

.el-input{
    width: 3.3rem;
}
.el-dropdown{
  margin-left:10px;
}
</style>