<template>
    <div>
        <el-row>
            <el-tabs v-model="status" @tab-click="inquireTableData" style="width:3rem;">
                <el-tab-pane label="待处理" name="1" />
                <el-tab-pane label="已处理" name="2" />
            </el-tabs>
        </el-row>
        <!-- 头部功能区 -->
        <tpms-header ref="tpmsHeader" :formData="headerFormList" :total="total" @inquireTableData='inquireTableData'>
            <template slot="time" slot-scope="{row}">
                <el-date-picker style="width:1.6rem;" v-model="row.value[0]" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" />
                <el-date-picker style="width:1.6rem;" v-model="row.value[1]" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" />
            </template>
        </tpms-header>
        <!-- 底部表格 -->
        <tpms-table ref="tpmsTable" :data="tableData" :columns="tableColumns" @inquireTableData='getTableDate'>
            <template slot-scope="{row}">
                <el-button type="text" @click="seeDetail(row)">查看</el-button>
                <el-button v-if="status=='1'" type="text" @click="clickApproval(row)">审批</el-button>
            </template>
        </tpms-table>
        <!-- 查看详情|审批 对话框 -->
        <el-dialog
            :title="{detail:'查看详情',approval:'审批'}[dialog_Type]"
            :visible.sync="dialog_IsShow"
            width="50%"
            @closed='dialog_Data={}'
        >
            <el-row>
                <el-form :model="dialog_Data" label-position="left" label-width="120px" disabled>
                    <el-col :span="item.type==='textArea'?24:11" :offset="index%2&&item.type!=='textArea'?2:0" v-for='(item,index) in dialog_Form' :key='item.label'>
                        <el-form-item :label="item.label">
                            <el-input v-if="item.type==='textArea'" type="textarea" v-model="dialog_Data[item.props]" />
                            <el-input v-else disabled v-model="dialog_Data[item.props]" />
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row v-if="dialog_Type==='approval'" type="flex" justify="center">
                <el-button @click="approval(false)">
                    审批驳回
                </el-button>
                <el-button type="primary" @click="approval(true)">
                    审批通过
                </el-button>
            </el-row>
            <el-row v-if="dialog_Type==='detail'" type="flex" justify="center">
                <el-button type="primary" @click="dialog_IsShow = false">
                    返 回
                </el-button>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import {spareConsuming} from '../../lib/api/spart';
import { tpmsHeader, tpmsTable } from '../../components';
export default {
    data() {
        return {
            status:'1',
            headerFormList: [
                { label: "备件编号", props: "spareNo", value: "" },
                { label: "备件名称", props: "spareName", value: "" },
                { label: "领用日期", props: "timeFrame", value: [], slotName:'time' },
                { label: "设备编号", props: "deviceNo", value: "" },
                { label: "设备名称", props: "deviceName", value: "" }
            ],
            tableData: [],// 表格的数据
            total:0,
            tableColumns: [        // 渲染表格的表头
                { props: 'workshopName', label: '车间' },
                { props: 'spareNo', label: '备件编号' },
                { props: 'spareName', label: '备件名称' },
                { props: 'specification', label: '规格型号' },
                { props: 'price', label: '采购价格' },
                { props: 'num', label: '数量' },
                { props: 'consumerName', label: '领用人' },
                { props: 'consumerDate', label: '领用日期' },
                { props: 'maintenanceNo', label: '维修单号' },
                { props: 'deviceNo', label: '设备编号' },
                { props: 'deviceName', label: '设备名称' },
                { props: 'purpose', label: '设备用途' },
            ],
            dialog_IsShow: false,// 控制查看详情对话框的打开与关闭
            dialog_Type:'detail',//模态框类型，detail、approval
            dialog_Data:{},
            dialog_Form: [
                { props: 'maintenanceNo', label: '维修单号' },
                { props: 'deviceNo', label: '设备编号' },
                { props: 'deviceName', label: '设备名称' },
                { props: 'spareNo', label: '备件编号' },
                { props: 'spareName', label: '备件名称' },
                { props: 'specification', label: '规格型号' },
                { props: 'num', label: '数量' },
                { props: 'price', label: '原值' },
                { props: 'purpose', label: '用途' },
                { props: 'consumerName', label: '领用人' },
                { props: 'consumerDate', label: '领用日期' },
                { props: 'comment', label: '备注' , type:'textArea' },
            ],
            dialog_FormList: [      // 渲染报废备件转交表单的item项
                { leftLabel: '备件名称', leftName: 'sparePartName', rightLabel: '物料编号', rightName: 'matericalNumber' },
                { leftLabel: '采购价格', leftName: 'purchasePrice', rightLabel: '规格型号', rightName: 'type' },
                { leftLabel: '领用人', leftName: 'receivePersion', rightLabel: '数量', rightName: 'number' },
                { leftLabel: '设备名称', leftName: 'partName', rightLabel: '审批日期', rightName: 'applyDate' },
                { leftLabel: '报废备件分类', leftName: 'discardPartClassify', rightLabel: '设备编号', rightName: 'partNumber' }
            ],
        }
    },
    components: {
        tpmsHeader,
        tpmsTable
    },
    mounted(){
        this.getTableDate();
    },
    methods: {
        test(row){
            console.log(row)
        },
        /** 点击查询按钮 */
        inquireTableData(val){
            console.log(val)
            this.$refs.tpmsTable.resetCurrentPage();
            this.getTableDate();
        },
        /** 加载表格数据 */
        getTableDate(){
            this.tableData=[];
            let data = this.$refs.tpmsHeader.getData();
            data.startTime=data.timeFrame.split(',')[0];
            data.endTime=data.timeFrame.split(',')[1];
            delete data.timeFrame;
            let pageData = this.$refs.tpmsTable.getData();
            const status=this.status;
            spareConsuming.getList({...data,...pageData,status}).then(res=>{
                this.tableData=res.data.content;
                this.total=res.data.numberOfElements;
            })
        },
        /** 加载模态框详情 */
        getTableItemDetail(row){
            spareConsuming.getDetail(null,row.id).then(res=>{
                this.dialog_Data=res.data;
            })
        },
        /** 点击表格查看按钮 */
        seeDetail(row){
            this.dialog_IsShow=true;
            this.dialog_Type='detail';
            this.getTableItemDetail(row);
        },
        /** 点击表格审批按钮 */
        clickApproval(row){
            this.dialog_IsShow=true;
            this.dialog_Type='approval';
            this.getTableItemDetail(row);
        },
        /** 审批驳回｜审批通过
         * @param {Boolean} enable - true:审批通过；false:审批驳回 
        */
        approval(enable){
            this.dialog_IsShow=false;
            spareConsuming.approval({workflowStatus:enable?1:2},this.dialog_Data.id).then(res=>{
                console.log(res)
                this.$message.success('操作完成');
                this.getTableDate();
            }).catch(fail=>{
                this.$message.error('操作失败')
            })
        }
    }
};
</script>
<style lang="scss" scoped>
</style>