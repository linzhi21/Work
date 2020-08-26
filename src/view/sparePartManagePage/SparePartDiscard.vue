<template>
  <div>
          <!-- 头部功能区 -->
        <el-row>
          <el-form :model='sparePartForm' label-width="70px">
            <el-col :span="8" v-for="(item,index) in sparePartFormList" :key='index'>
              <el-form-item :label="item.label">
                <el-input v-model="sparePartForm[item.name]"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更换时间">
                <el-date-picker
                v-model="sparePartForm.changeDate"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="鉴定人">
                <el-input v-model="sparePartForm.appraiser"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="8">
              <el-form-item >
                <el-button type='primary' size="mini">
                    <i class="el-icon-edit"></i>
                    查询
                </el-button>
                <el-button size="mini">
                    <i class="el-icon-edit"></i>
                    重置
                </el-button>
                <!-- 下拉选择框 -->
                <el-dropdown class="drop-down">
                    <el-button type="primary" size="mini">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                        更多
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>导入</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <!-- 底部表格 -->
        <el-row>
            <el-table :data="sparePartTableData" style="width: 100%">
                <el-table-column align="center"  type="index" label="序号" width="60px"></el-table-column>
                <el-table-column align="center" min-width="140" v-for="(item,index) in sparePartTableList" :key='index' :label="item.name" :prop="item.props"></el-table-column>
                <el-table-column align="center" label="状态" width="180px">
                   <template slot-scope="scope">
                        <div v-if='scope.row.status ==1'>
                            <span class="dot dot-blue"></span><span>待审批</span>
                        </div>
                        <div v-if='scope.row.status ==2'>
                            <span class="dot dot-orange"></span><span>已处理</span>
                        </div>
                        <div v-if='scope.row.status ==3'>
                            <span class="dot dot-red"></span><span>待报废</span>
                        </div>
                        <div v-if='scope.row.status ==4'>
                            <span class="dot dot-green"></span><span>待修复</span>
                        </div>
                        <div v-if='scope.row.status ==5'>
                            <span class="dot dot-purple"></span><span>已退回</span>
                        </div>
                   </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="180px">
                   <template slot-scope="scope">
                        <span class="button" @click="showDiscardDetailsDialog">查看</span>
                        <span class="button" v-if='scope.row.operate == 1' @click="showDiscardReceiveDialog">接收</span>
                        <span class="button" v-if='scope.row.operate == 2' @click="showDiscardDialog">转交</span>
                   </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 分页 -->
         <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="30">
        </el-pagination>
        <!-- 报废备件转交 -->
        <el-dialog
        title="报废备件转交"
        :visible.sync="discardDialog"
        width="50%"
        :before-close="handleClose">
        <div class="discard-form">
            <div class="clearfix discard-line" v-for="(item,index) in discardDialogFormList" :key="index">
                <div class="discard-item-left">
                    <span>{{item.leftLabel+'：'}}</span><span>{{discardDialogForm[item.leftName]}}</span>
                </div>
                <div class="discard-item-right">
                    <span>{{item.rightLabel+'：'}}</span><span>{{discardDialogForm[item.rightName]}}</span>
                </div>
            </div>
            <div class="clearfix discard-line" >
                <div class="discard-item-left">
                    <span>审批日期：</span><span>{{discardDialogForm.approverDate}}</span>
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="discardDialog = false"><i class="el-icon-edit"></i>取 消</el-button>
            <el-button type="primary" @click="discardDialog = false"><i class="el-icon-edit"></i>转 交</el-button>
        </span>
        </el-dialog>
        <!-- 报废备件详情 -->
        <el-dialog
        title="报废备件详情"
        :visible.sync="discardDetailsDialog"
        width="50%"
        :before-close="handleClose">
        <div class="discard-form">
            <div class="clearfix discard-line" v-for="(item,index) in discardDetailsDialogFormList" :key="index">
                <div class="discard-item-left">
                    <span>{{item.leftLabel+'：'}}</span><span>{{discardDetailsDialogForm[item.leftName]}}</span>
                </div>
                <div class="discard-item-right">
                    <span>{{item.rightLabel+'：'}}</span><span>{{discardDetailsDialogForm[item.rightName]}}</span>
                </div>
            </div>
            <div class="clearfix discard-line" >
                <div class="discard-item-left">
                    <span>接受单位：</span><span>{{discardDetailsDialogForm.receiveCompany}}</span>
                </div>
            </div>
            <div class="clearfix discard-line" >
                <div class="discard-item-left">
                    <span>备注：</span><span>{{discardDetailsDialogForm.remarks}}</span>
                </div>
            </div>
            <div class="clearfix discard-line" >
                <div class="discard-item-left">
                    <span>附件：</span><img class="attachment-photo" :src="discardDetailsDialogForm.attachment">
                </div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="discardDetailsDialog = false"><i class="el-icon-edit"></i>返 回</el-button>
        </span>
        </el-dialog>
        <!-- 报废备件接收对话框 -->
        <el-dialog
        title="报废备件接收"
        :visible.sync="discardReceiveDialog"
        width="80%"
        :before-close="handleClose">
        <el-form :inline="true" class="internal-pepair-form" :model="discardReceiveForm" label-width="100px">
            <div class="clearfix" v-for="(item,index) in discardReceiveFormList" :key="index">
                <el-form-item :label="item.leftLabel" class="internal-pepair-item-left">
                    <el-input v-model="discardReceiveForm[item.leftName]" disabled></el-input>
                </el-form-item>
                <el-form-item :label="item.rightLabel" class="internal-pepair-item-right">
                    <el-input v-model="discardReceiveForm[item.rightName]" disabled></el-input>
                </el-form-item>
            </div>
            <div class="clearfix">
                <el-form-item label="转交人" class="internal-pepair-item-left">
                    <el-input v-model="discardReceiveForm.referredPersion" disabled></el-input>
                </el-form-item>
                <el-form-item label="接收日期" class="internal-pepair-item-right">
                    <el-input v-model="discardReceiveForm.receiveDate" ></el-input>
                </el-form-item>
            </div>
            <div class="clearfix">
                <el-form-item label="接收单位" class="internal-pepair-item-left">
                    <el-input v-model="discardReceiveForm.receiveCompany"></el-input>
                </el-form-item>
                <el-form-item label="附件" class="internal-pepair-item-right">
                    <el-input v-model="discardReceiveForm.attachment" ></el-input>
                </el-form-item>
            </div>
            <div class="clearfix">
                <el-form-item label="备注" class="internal-pepair-item-left">
                    <el-input type="textarea" v-model="discardReceiveForm.remarks" class="large-textarea"></el-input>
                </el-form-item>
            </div>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="discardReceiveDialog = false">
                <i class="el-icon-edit"></i>
                取 消
            </el-button>
            <el-button type="primary" @click="discardReceiveDialog = false">
                <i class="el-icon-edit"></i>
                提交
            </el-button>
        </span>
        </el-dialog>
  </div>
</template>
<script>
export default {
    data(){
        return{ 
            sparePartForm:{             // 备件管理头部表单
                sparePartName:'',           // 备件名称
                sparePartNumber:'',         // 备件编号
                changeDate:'',              // 更换日期
                appraiser:''                // 鉴定人
            },
            sparePartFormList:[         //  渲染头部功能区的列表
                {label:'备件名称',name:'sparePartName'},
                {label:'备件编号',name:'sparePartNumber'},
            ],
            sparePartTableData:[        // 表格的数据
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:1,operate:0},
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:1,operate:0},
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:1,operate:0},
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:2,operate:0},
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:3,operate:0},
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:4,operate:1},
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:5,operate:2},
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:1,operate:5},
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:1,operate:0},
                {registrationNumber:'123456',changeDate:'2019-07-08',sparePartNumber:'SHB00032',sparePartName:'润滑油站',specifications:'001',originValue:'500',Number:'1',repairTime:'2019-03-02',appraiser:'张三',status:1,operate:0}
            ],
            sparePartTableList:[        // 渲染表格的表头
                {props:'registrationNumber',name:'登记单号'},
                {props:'changeDate',name:'更换日期'},
                {props:'sparePartNumber',name:'备件编号'},
                {props:'sparePartName',name:'备件名称'},
                {props:'specifications',name:'规格型号'},
                {props:'originValue',name:'原值(元)'},
                {props:'Number',name:'数量'},
                {props:'repairTime',name:'报废或修复日期'},
                {props:'appraiser',name:'鉴定人'}
            ],
            discardDetailsDialog:false,                 // 控制报废备件详情对话框的打开与关闭
            discardDetailsDialogForm:{         // 报废备件详情的表单内容
                discardPartNumber:'SHB0023',           // 报废备件单号
                partNumber:'SHB0023',                  // 备件编号
                discardDate:'正常',                 // 报废日期
                type:'asdas',                        // 规格型号
                partName:'润滑油站',                    // 备件名称
                number:'1',                      // 数量
                originValue:'PHY-001',                 // 原值(元)
                appraiser:'张三',                   // 鉴定人
                discardPartType:'干燥设备',             // 报废备件分类
                approverPersion:'张三',             // 审批人
                handleDate:'2020-03-04',                  // 处理日期
                isOK:'是',                        // 是否同意
                approverDateA:'2020-03-04',                 // 审批日期A
                approverDateB:'2020-03-02',                 // 审批日期B
                referredPersion:'张三',                 // 转交人
                receiveDate:'2020-03-02',            // 接受日期
                receiveCompany:'无锡大众分公司',         // 接受单位
                remarks:'备注备注备注备注备注备注备注',    // 备注
                attachment:'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg',                           // 附件
            },  
            discardDetailsDialogFormList:[      // 渲染报废备件转交表单的item项
                {leftLabel:'报废备件单号',leftName:'discardPartNumber',rightLabel:'备件编号',rightName:'partNumber'},
                {leftLabel:'报废日期',leftName:'discardDate',rightLabel:'规格型号',rightName:'type'},
                {leftLabel:'备件名称',leftName:'partName',rightLabel:'数量',rightName:'number'},
                {leftLabel:'原值(元)',leftName:'originValue',rightLabel:'鉴定人',rightName:'appraiser'},
                {leftLabel:'报废备件分类',leftName:'discardPartType',rightLabel:'审批人',rightName:'approverPersion'},
                {leftLabel:'处理日期',leftName:'handleDate',rightLabel:'是否同意',rightName:'isOK'},
                {leftLabel:'审批日期',leftName:'approverDateA',rightLabel:'审批日期',rightName:'approverDateB'},
                {leftLabel:'转交人',leftName:'referredPersion',rightLabel:'接受日期',rightName:'receiveDate'},
            ],
            discardDialog:false,        // 控制报废备件转交对话框的打开与关闭
            discardDialogForm:{         // 报废备件转交的表单内容
                discardPartNumber:'SHB0023',           // 报废备件单号
                partNumber:'SHB0023',                  // 备件编号
                discardDate:'正常',                 // 报废日期
                type:'asdas',                        // 规格型号
                partName:'润滑油站',                    // 备件名称
                number:'1',                      // 数量
                originValue:'PHY-001',                 // 原值(元)
                appraiser:'张三',                   // 鉴定人
                discardPartType:'干燥设备',             // 报废备件分类
                approverPersion:'张三',             // 审批人
                handleDate:'2020-03-04',                  // 处理日期
                isOK:'是',                        // 是否同意
                approverDate:'2020-03-04'                 // 审批日期
            },  
            discardDialogFormList:[      // 渲染报废备件转交表单的item项
                {leftLabel:'报废备件单号',leftName:'discardPartNumber',rightLabel:'备件编号',rightName:'partNumber'},
                {leftLabel:'报废日期',leftName:'discardDate',rightLabel:'规格型号',rightName:'type'},
                {leftLabel:'备件名称',leftName:'partName',rightLabel:'数量',rightName:'number'},
                {leftLabel:'原值(元)',leftName:'originValue',rightLabel:'鉴定人',rightName:'appraiser'},
                {leftLabel:'报废备件分类',leftName:'discardPartType',rightLabel:'审批人',rightName:'approverPersion'},
                {leftLabel:'处理日期',leftName:'handleDate',rightLabel:'是否同意',rightName:'isOK'}
            ],
            discardReceiveDialog:false,        // 控制报废备件接收对话框的打开与关闭
             discardReceiveForm:{               // 备件内部维修申请单的内容
                discardPartNumber:'委内维修',           // 报废备件单号
                partNumber:'',                  // 备件编号
                discardDate:'',                 // 报废日期
                type:'',                        // 规格型号
                partName:'',                    // 备件名称
                number:'',                      // 数量
                originValue:'',                 // 原值(元)
                appraiser:'',                   // 鉴定人
                discardPartType:'',             // 报废备件分类
                approverPersion:'',             // 审批人
                handleDate:'',                  // 处理日期
                isOK:'',                        // 是否同意
                approverDateA:'',                 // 审批日期A
                approverDateB:'',                 // 审批日期B
                referredPersion:'',                 // 转交人
                receiveDate:'',            // 接受日期
                receiveCompany:'',         // 接受单位
                attachment:'',                           // 附件
                remarks:'',    // 备注
             },
             discardReceiveFormList:[               // 渲染报废备件接收的表单内容
               {leftLabel:'报废备件单号',leftName:'discardPartNumber',rightLabel:'备件编号',rightName:'partNumber'},
                {leftLabel:'报废日期',leftName:'discardDate',rightLabel:'规格型号',rightName:'type'},
                {leftLabel:'备件名称',leftName:'partName',rightLabel:'数量',rightName:'number'},
                {leftLabel:'原值(元)',leftName:'originValue',rightLabel:'鉴定人',rightName:'appraiser'},
                {leftLabel:'报废备件分类',leftName:'discardPartType',rightLabel:'审批人',rightName:'approverPersion'},
                {leftLabel:'处理日期',leftName:'handleDate',rightLabel:'是否同意',rightName:'isOK'},
                {leftLabel:'审批日期',leftName:'approverDateA',rightLabel:'审批日期',rightName:'approverDateB'}
             ],
        }
    },
    methods:{
        /**
         * @description 分页器中pageSize 改变时触发的事件
         * @param {val} 每页的条数
         */
         handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
       /**
         * @description 分页器中currentPage 改变时触发的事件
         * @param {val} 当前页
         */
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
      },
       /**
        * @description 关闭对话框
        */
      handleClose(){
           const _this=this
           _this.discardDialog=false
           _this.discardDetailsDialog=false
           _this.discardReceiveDialog=false
      },
      /**
        * @description 打开报废备件转交的对话框
        */
      showDiscardDialog(){
          const _this=this
           _this.discardDialog=true
      },
      /**
        * @description 打开报废备件详情的对话框
        */
      showDiscardDetailsDialog(){
          const _this=this
           _this.discardDetailsDialog=true
      },
      /**
        * @description 打开报废备件详情的对话框
        */
      showDiscardReceiveDialog(){
          const _this=this
           _this.discardReceiveDialog=true
      },
    }
};
</script>
<style lang="scss" scoped>
.el-input{
  width: 3.3rem;
}
.spare-part-dialog-form{
    width: 4.3rem;
    margin: 0 auto;
}
.discard-form{
    padding: 0.1rem 1rem;
}
.discard-line{
    padding: 0 0.4rem;
    border-bottom: 2px dashed #e9e9e9;
    line-height: 40px;
}
.discard-item-right{
    float: right;
    width: 2.5rem;
}
.discard-item-left{
    float: left;
}
.attachment-photo{
    widows: 2rem;
    height: 2rem;
    vertical-align: top;
}
.internal-pepair-form{
    padding: 0.1rem 1.5rem;
}
.internal-pepair-item-right{
    float: right;
}
.internal-pepair-item-left{
    float: left;
}
.large-textarea{
    width: 8rem;
}
.medium-textarea{
    width: 3.2rem;
}
</style>