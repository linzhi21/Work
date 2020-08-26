<template>
    <div>
        <!-- 头部功能区 -->
        <tpmsHeader
            ref="tpmsHeader"
            :formData="sparePartFormList"
            @inquireTableData="inquireTableData"
        >
            <template slot="time" slot-scope="{row}">
                <el-date-picker style="width:1.6rem;" v-model="row.value[0]" type="date" value-format="yyyy-MM-dd" placeholder="开始日期" />
                <el-date-picker style="width:1.6rem;" v-model="row.value[1]" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" />
            </template>
        </tpmsHeader>
        <buttomGroup
            ref="buttomGroup"
            @batchDamageRegister="clickBatchDamageRegister"
        />
        <tpmsTable
            class="tpms-table"
            ref="tpmsTable"
            selection
            :data="sparePartTableData"
            :total="total"
            :columns="sparePartTableList"
            @inquireTableData="inquireTableData"
        >
            <template slot-scope="{row}">
                <span class="button" @click="showSparePartDialog(row)">查看</span>
                <span class="button" @click="clickDamageRegister(row)">损坏登记</span>
            </template>
        </tpmsTable>

        <!-- 单个备件损坏登记 -->
        <el-dialog title="备件损坏登记" :visible.sync="damageRegister_isShow" width="45%">
            <el-form
                class="spare-part-dialog-form"
                ref="damageRegister"
                label-width="100px"
                label-position="left"
                :model="damageRegisterData"
            >
                <el-form-item label="备件名称" prop="name">
                    <el-input v-model="damageRegisterData.name" disabled />
                </el-form-item>
                <el-form-item label="更换日期" prop="changeDate">
                    <el-input v-model="damageRegisterData.changeDate" disabled />
                </el-form-item>
                <el-form-item label="型号规格" prop="specification">
                    <el-input v-model="damageRegisterData.specification" disabled />
                </el-form-item>
                <el-form-item label="原值" prop="price">
                    <el-input v-model="damageRegisterData.price" disabled />
                </el-form-item>
                <el-form-item label="数量" prop="num">
                    <el-input v-model="damageRegisterData.num" disabled />
                </el-form-item>
                <el-form-item
                    label="处理方式"
                    prop="handleWay"
                    :rules="{
                        required: true, message: '请选择处理方式', trigger: 'blur'
                    }"
                >
                    <el-select
                        v-model="damageRegisterData.handleWay"
                        placeholder="请选择"
                        @change="(value)=>{
                            value=='1'&&(damageRegisterData.repairType=null,damageRegisterData.scrapType=null);
                            value=='2'&&(damageRegisterData.scrapType=null);
                            value=='4'&&(damageRegisterData.repairType=null);
                        }"
                    >
                        <el-option
                            v-for="item in handleWaySelect"
                            :key="item.value"
                            :disabled="item.disabled&&item.disabled(damageRegisterData.price)"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="修复方式"
                    prop="repairType"
                    :rules="{
                        required: damageRegisterData.handleWay=='4', message: '请选择处理方式', trigger: 'blur'
                    }"
                >
                    <el-select
                        v-model="damageRegisterData.repairType"
                        :disabled="damageRegisterData.handleWay!='4'"
                        :placeholder="damageRegisterData.handleWay!='4'?'无':'请选择'"
                    >
                        <el-option
                            v-for="item in repairTypeSelect"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="报废方式"
                    prop="scrapType"
                    :rules="{
                        required: damageRegisterData.handleWay=='2', message: '请输入次数', trigger: 'blur'
                    }"
                >
                    <el-select
                        v-model="damageRegisterData.scrapType"
                        :disabled="damageRegisterData.handleWay!='2'"
                        :placeholder="damageRegisterData.handleWay!='2'?'无':'请选择'"
                    >
                        <el-option
                            v-for="item in scrapTypeSelect"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="鉴定人" prop="appraiserName">
                    <el-input v-model="damageRegisterData.appraiserName" disabled />
                </el-form-item>
            </el-form>
            <el-row type="flex" justify="center">
                <el-button
                    @click="$refs.damageRegister.resetFields(),damageRegister_isShow=false"
                >取消</el-button>
                <el-button
                    type="primary"
                    @click="$refs.damageRegister.validate(validate=>validate&&before_damageRegister())"
                >保存</el-button>
            </el-row>
        </el-dialog>

        <!-- 批量损坏登记 -->
        <el-dialog title="备件批量损坏登记" :visible.sync="batchDamageRegister_isShow" width="900px">
            <tpmsTable
                :data="batchDamageRegisterData"
                :paginationIsShow='false'
                :columns="[
                    {props:'name',label:'备件名称'},
                    {props:'changeDate',label:'更换日期'},
                    {props:'specification',label:'型号规格'},
                    {props:'price',label:'原值'},
                    {props:'num',label:'数量'},
                    {props:'appraiserName',label:'鉴定人'},
                    {slotName:'handleWay',label:'处理方式',width:'120px'},
                    {slotName:'repairType',label:'修复方式',width:'120px'},
                    {slotName:'scrapType',label:'报废方式',width:'120px'},
                ]"
            >
                <template slot="handleWay" slot-scope="{row}">
                    <el-select
                        v-model="row.handleWay"
                        size="mini"
                        placeholder="请选择"
                        @change="(value)=>{
                            value=='1'&&(row.repairType=null,row.scrapType=null);
                            value=='2'&&(row.scrapType=null);
                            value=='4'&&(row.repairType=null);
                        }"
                    >
                        <el-option
                            v-for="item in handleWaySelect"
                            :key="item.value"
                            :disabled="item.disabled&&item.disabled(row.price)"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template>
                <template slot="repairType" slot-scope="{row}">
                    <el-select
                        v-model="row.repairType"
                        size="mini"
                        :disabled="row.handleWay!='4'"
                        :placeholder="row.handleWay!='4'?'无':'请选择'"
                    >
                        <el-option
                            v-for="item in repairTypeSelect"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </template>
                <template slot="scrapType" slot-scope="{row}">
                    <el-select
                        v-model="row.scrapType"
                        size="mini"
                        :disabled="row.handleWay!='2'"
                        :placeholder="row.handleWay!='2'?'无':'请选择'"
                    >
                        <el-option
                            v-for="item in scrapTypeSelect"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </template>
            </tpmsTable>
            <el-row type="flex" justify="center" style="margin-top:40px;">
                <el-button @click="batchDamageRegister_isShow=false">取消</el-button>
                <el-button type="primary" @click="before_batchDamageRegister">保存</el-button>
            </el-row>
        </el-dialog>

        <!-- 备件详情对话框 -->
        <el-dialog
            title="备件详情"
            :visible.sync="sparePartDialog"
            width="50%"
        >
            <el-row>
                <el-form :model="sparePartDialogForm" label-position="left" label-width="120px">
                    <el-col
                        v-for="(item,index) in sparePartDialogFormList"
                        :span="item.type==='textArea'?24:11"
                        :offset="index%2&&item.type!=='textArea'?2:0"
                        :key="item.label"
                    >
                        <el-form-item v-bind="item">
                            <el-select
                                style="width:100%;"
                                v-if="item.type==='radio'"
                                v-model="sparePartDialogForm[item.props]"
                                :placeholder="item.placeholder||''"
                                disabled
                            >
                                <el-option
                                    v-for="(item,i) in item.checkList"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.id"
                                />
                            </el-select>
                            <el-input v-else-if="item.type==='textArea'" disabled type="textarea" v-model="sparePartDialogForm[item.props]" />
                            <el-input v-else disabled v-model="sparePartDialogForm[item.props]" />
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <!-- <el-form class="spare-part-dialog-form" :model="sparePartDialogForm" label-width="80px">
                <el-form-item :label="item.label" v-for='(item,index) in sparePartDialogFormList' :key="index">
                    <el-input v-model='sparePartDialogForm[item.name]' disabled />
                </el-form-item>
            </el-form>-->
            <span slot="footer">
                <el-button type="primary" @click="sparePartDialog = false">返回</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { breakdown, getRepairLimitList, breakDownRegister, breakDownRegisterBatch } from '../../lib/api/spart';
import { deepClone } from '../../utils';
import { tpmsHeader, tpmsTable } from '../../components';
import { DamageListManage as buttomGroup } from './components/buttomGroups';
export default {
    data() {
        return {
            sparePartFormList: [         //  渲染头部功能区的列表
                { label: '备件名称', props: 'spareName', value: '' },
                { label: '备件编号', props: 'spareNo', value: '' },
                { label: "维修日期", props: "timeFrame", value: [], slotName:'time' },
                { label: '设备名称', props: 'deviceName', value: '', },
                { label: '设备编号', props: 'deviceNo', value: '', },
            ],
            sparePartTableData: [],// 表格的数据
            total: 0,//表格数据量
            sparePartTableList: [        // 渲染表格的表头
                { type: 'selection',width:"55", selectable: /** 状态为正常或损坏时可选 */({status}) => status==1||status==2 },
                { props: 'maintenanceNo', label: '关联维修单' },
                { props: 'no', label: '备件编号' },
                { props: 'name', label: '备件名称' },
                { props: 'price', label: '原值' },
                { props: 'specification', label: '型号规格' },
                { props: 'deviceNo', label: '所属设备编号', 'width': '120px' },
                { props: 'deviceName', label: '所属设备名称', 'width': '120px' },
                { props: 'materialNo', label: '东昌物料号' },
                { props: 'maintenanceTime', label: '维修时间', 'width': '120px' },
            ],
            sparePartDialog: false,          // 控制备件详情对话框的打开与关闭
            sparePartDialogForm: {},    // 控制备件详情对话框中的form表单
            sparePartDialogFormList: [       // 渲染备件详情对话框中的form表单内容
                { props: 'no', label: '备件编号' },
                { props: 'name', label: '备件名称' },
                { props: 'price', label: '原值' },
                { props: 'specification', label: '型号规格' },
                { props: 'deviceNo', label: '所属设备编号', slotName: 'deviceNos', 'width': '120px' },
                { props: 'deviceName', label: '所属设备名称', slotName: 'deviceNames', 'width': '120px' },
                { props: 'materialNo', label: '东昌物料号' },
                { props: 'maintenanceNo', label: '关联维修单', slotName: 'maintenanceNos', 'width': '120px' },
                { props: 'maintenanceTime', label: '维修时间', slotName: 'maintenanceTimes', 'width': '120px' },
                { props: 'comment', label: '备注' , type:'textArea' },
            ],
            repairLimitList: [],//返修上限列表
            handleWaySelect: [            // 处理方式下拉选择框内容
                { label: "工业垃圾", value: 1, disabled: (price) => price <= 1000 },
                { label: "报废备件", value: 2, disabled: (price) => price > 1000 },
                { label: "修复备件", value: 4 },
            ],
            repairTypeSelect: [            // 处理类型下拉选择框内容
                { label: "委内维修", value: 1 },
                { label: "委外维修", value: 2 }
            ],
            scrapTypeSelect: [
                { label: "金属报废", value: 1 },
                { label: "非金属报废", value: 2 },
            ],
            sparePartsSetting_isShow: false,//常用备件设置模态框
            sparePartsSetting: {
                key: '',
                value: ''
            },
            batchDamageRegister_isShow: false,//备件批量损坏登记模态框
            batchDamageRegisterData: [ 
            ],
            damageRegister_isShow: false,//单个备件损坏登记模态框
            damageRegisterData: {}
        }
    },
    components: {
        tpmsHeader, buttomGroup, tpmsTable
    },
    created() {
        getRepairLimitList().then(res => {
            this.repairLimitList = res.data.content;
        })
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
        },
        /**
          * @description 分页器中currentPage 改变时触发的事件
          * @param {val} 当前页
          */
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        /** 点击查询按钮 */
        inquireTableData() {
            this.$refs.tpmsTable.resetCurrentPage();
            this.getTableData();
        },
        /** 加载页面表格数据 */
        getTableData() {
            let data = this.$refs.tpmsHeader.getData();
            data.startTime=data.timeFrame.split(',')[0];
            data.endTime=data.timeFrame.split(',')[1];
            delete data.timeFrame;
            let pageData = this.$refs.tpmsTable.getData();
            breakdown.getList({ ...data, ...pageData, status: 2 }).then(res => {
                this.sparePartTableData = res.data.content;
                this.total = res.data.totalElements;
            })
        },
        /** 点击批量损坏登记按钮 */
        clickBatchDamageRegister() {
            let batchDamageRegisterData = this.$refs.tpmsTable.getSelectionList();
            if(batchDamageRegisterData.length===0){
                this.$message.warning('请选择备件');
                return;
            }
            this.batchDamageRegister_isShow = true;
            batchDamageRegisterData=deepClone(batchDamageRegisterData);
            batchDamageRegisterData.forEach(item=>{
                item.num = 1;
                item.repairType = null;
                item.scrapType = null;
                item.handleWay = null;
                item.appraiserName = $store.state.user.userInfo.principal.name;
                item.appraiserId = $store.state.user.userInfo.principal.id;
            })
            this.batchDamageRegisterData=batchDamageRegisterData.filter(item=>item.status==1||item.status==2);
            console.log(this.batchDamageRegisterData)
        },
        /** 点击单个设备的损坏登记 */
        clickDamageRegister(row) {
            this.damageRegister_isShow = true;
            const damageRegisterData = deepClone(row);
            damageRegisterData.num = 1;
            damageRegisterData.repairType = null;
            damageRegisterData.scrapType = null;
            damageRegisterData.handleWay = null;
            damageRegisterData.appraiserName = $store.state.user.userInfo.principal.name;
            damageRegisterData.appraiserId = $store.state.user.userInfo.principal.id;
            damageRegisterData.changeDate = damageRegisterData.maintenanceTime;
            this.damageRegisterData = damageRegisterData;
        },
        /** 打开备件详情的对话框 */
        showSparePartDialog(row) {
            this.sparePartDialog = true;
            this.sparePartDialogForm = {};
            breakdown.getDetail(null, row.id).then(res => {
                for (let key in res.data) {
                    if (Array.isArray(res.data[key])) {
                        res.data[key] = res.data[key].join('; ')
                    }
                }
                this.sparePartDialogForm = res.data;
            })
        },
        /**
         * 单个备件损坏登记之前
         */
        before_damageRegister() {
            const { inRepairTimes, outRepairTimes, repairType } = this.damageRegisterData;
            let text = '确认损坏登记?';
            if (repairType == '1') {//委内维修
                const repairLimit = this.repairLimitList.filter(item => item.key === '委内维修')[0].value;
                if (inRepairTimes > repairLimit) text = `此备件委内维修次数为${inRepairTimes},已超过返修上限${repairLimit},是否继续?`;
            }
            if (repairType == '2') {//委外维修
                const repairLimit = this.repairLimitList.filter(item => item.key === '委外维修')[0].value;
                if (outRepairTimes > repairLimit) text = `此备件委内维修次数为${outRepairTimes},已超过返修上限${repairLimit},是否继续?`;
            }
            this.$confirm(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(this.damageRegister)
                .catch(() => { });
        },
        /** 单个备件损坏登记 */
        damageRegister() {
            this.damageRegisterData.spareId = this.damageRegisterData.id;
            delete this.damageRegisterData.id;
            breakDownRegister(this.damageRegisterData).then(res => {
                this.damageRegister_isShow = false;
                this.$message.success('备件损坏登记完成');
                this.getTableData();
            }).catch(fail => {
                this.$message({
                    showClose: true,
                    message: '备件损坏登记失败',
                    type: 'error',
                    duration: 5 * 1000
                })
            })
        },
        /**
         * 批量备件损坏登记之前
         */
        before_batchDamageRegister() {
            const validate = this.batchDamageRegisterData.filter(item => {
                if (!item.handleWay) return true;
                if (item.handleWay == 2 && !item.scrapType) return true;
                if (item.handleWay == 4 && !item.repairType) return true;
                return false;
            });
            if (validate.length) {
                this.$message.warning('缺少必选项')
                return;
            };

            const sparePart_warning = this.batchDamageRegisterData.filter(item => {
                if (item.repairType == '1') {//委内维修
                    const repairLimit = this.repairLimitList.filter(item => item.key === '委内维修')[0].value;
                    if (item.inRepairTimes > repairLimit) {
                        return true;
                    };
                }
                if (item.repairType == '2') {//委外维修
                    const repairLimit = this.repairLimitList.filter(item => item.key === '委外维修')[0].value;
                    if (item.outRepairTimes > repairLimit) {
                        return true;
                    };
                }
                return false;
            });
            const sparePartNames = sparePart_warning.map(item => item.name).join('、');
            if (sparePartNames) {
                this.$confirm(`备件：${sparePartNames}；维修次数已超过返修上限, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(this.batchDamageRegister)
                    .catch(() => {
                        console.log('已取消')
                    })
                return;
            };
            this.batchDamageRegister();
        },
        /** 批量损坏登记 */
        batchDamageRegister(){
            this.batchDamageRegisterData.forEach(item=>{
                item.spareId = item.id;
                delete item.id;
            });
            breakDownRegisterBatch(this.batchDamageRegisterData).then(res=>{
                this.$message.success('批量损坏登记成功');
                this.batchDamageRegister_isShow=false;
                this.$refs.tpmsTable.$refs.table.clearSelection();
                this.getTableData();
            }).catch(fail=>{
                this.$message.error('批量损坏登记失败');
            })
        }
    }
};
</script>
<style lang="scss" scoped>
.spare-part-dialog-form {
    width: 4.3rem;
    margin: 0 auto;
}
.el-select {
    width: 100%;
}
</style>