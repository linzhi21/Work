<template>
    <div>
        <!-- 头部功能区 -->
        <tpmsHeader
            ref="tpmsHeader"
            :formData="sparePartFormList"
            @inquireTableData="inquireTableData"
        />
        <buttomGroup
            ref="buttomGroup"
            @setSpareParts="sparePartsSetting_isShow=true,getCommonSpareData()"
            @batchDamageRegister="clickBatchDamageRegister"
            @syncSpareParts="syncSpareParts"
        />
        <tpmsTable
            class="tpms-table"
            ref="tpmsTable"
            selection
            :data="sparePartTableData"
            :total="total"
            :columns="sparePartTableList"
            :row-class-name="({row})=>row.common?'success-row':''"
            @inquireTableData="inquireTableData"
        >
            <!-- 所属设备编号 插槽 -->
            <template slot="deviceNos" slot-scope="{row}">
                <span v-if="(!row.deviceNos)||row.deviceNos.length===0">无</span>
                <el-tooltip
                    v-else
                    :content="row.deviceNos.join('; ')"
                    placement="left"
                    effect="light"
                >
                    <el-button size="mini">{{pipe(row.deviceNos)}}</el-button>
                </el-tooltip>
            </template>
            <!-- 所属设备名称 插槽 -->
            <template slot="deviceNames" slot-scope="{row}">
                <span v-if="(!row.deviceNames)||row.deviceNames.length===0">无</span>
                <el-tooltip
                    v-else
                    :content="row.deviceNames.join('; ')"
                    placement="right"
                    effect="light"
                >
                    <el-button size="mini">{{pipe(row.deviceNames)}}</el-button>
                </el-tooltip>
            </template>
            <!-- 关联维修单 插槽 -->
            <template slot="maintenanceNos" slot-scope="{row}">
                <span v-if="(!row.maintenanceNos)||row.maintenanceNos.length===0">无</span>
                <el-tooltip
                    v-else
                    :content="row.maintenanceNos.join('; ')"
                    placement="left"
                    effect="light"
                >
                    <el-button size="mini">{{pipe(row.maintenanceNos)}}</el-button>
                </el-tooltip>
            </template>
            <!-- 维修时间 插槽 -->
            <template slot="maintenanceTimes" slot-scope="{row}">
                <span v-if="(!row.maintenanceTimes)||row.maintenanceTimes.length===0">无</span>
                <el-tooltip
                    v-else
                    :content="row.maintenanceTimes.join('; ')"
                    placement="right"
                    effect="light"
                >
                    <el-button size="mini">{{pipe(row.maintenanceTimes)}}</el-button>
                </el-tooltip>
            </template>
            <template slot-scope="{row}">
                <span class="button" @click="showSparePartDialog(row)">查看</span>
                <span
                    v-if="row.status==1||row.status==2"
                    class="button"
                    @click="clickDamageRegister(row)"
                >损坏登记</span>
            </template>
        </tpmsTable>

        <!-- 常用备件频率设置 -->
        <el-dialog title="常用备件频率设置" :visible.sync="sparePartsSetting_isShow" width="420px">
            <el-form
                ref="sparePartsSetting"
                label-width="60px"
                label-position="left"
                :model="sparePartsSetting"
            >
                <el-form-item
                    label="次数"
                    prop="key"
                    :rules="[
                        { required: true, message: '请输入次数', trigger: 'blur' },
                        { type: 'number', message: '请输入数字', trigger: 'blur'}
                    ]"
                >
                    <el-input
                        v-model.number="sparePartsSetting.key"
                        placeholder="期限内，备件使用频率>=该值时，为常用备件"
                    />
                </el-form-item>
                <el-form-item
                    label="周期"
                    prop="value"
                    :rules="{
                        required: true, message: '请选择周期', trigger: 'blur'
                    }"
                >
                    <el-select v-model="sparePartsSetting.value">
                        <el-option label="年" value="年" />
                        <el-option label="月" value="月" />
                        <el-option label="周" value="周" />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-row type="flex" justify="center">
                <el-button
                    @click="$refs.sparePartsSetting.resetFields(),sparePartsSetting_isShow=false"
                >取消</el-button>
                <el-button
                    type="primary"
                    @click="$refs.sparePartsSetting.validate(validate=>validate&&changeCommonSpareData())"
                >保存</el-button>
            </el-row>
        </el-dialog>

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
                :paginationIsShow="false"
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
        <el-dialog title="备件详情" :visible.sync="sparePartDialog" width="50%">
            <el-row>
                <el-form :model="sparePartDialogForm" label-position="left" label-width="120px">
                    <el-col
                        :span="11"
                        :offset="1"
                        v-for="(item) in sparePartDialogFormList"
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
import { querySpare as getTableData, getSpare, getRepairLimitList, breakDownRegister, getCommonSpare, changeCommonSpare, breakDownRegisterBatch } from '../../lib/api/spart';
import { deepClone } from '../../utils';
import { sysConfigManage } from '../../lib/api/workshopSettingsManage';
import { tpmsHeader, tpmsTable } from '../../components';
import { SparePartContent as buttomGroup } from './components/buttomGroups';
export default {
    data() {
        // 备件状态列表
        const sparePartStatus = [];
        let statusValue = {};
        sysConfigManage.getLists({ functionalCode: 5 }).then(res => {
            const { content } = res.data;
            content.forEach(item => {
                item.label = item.value;
                item.id = item.key;
                statusValue[item.key] = item.value;
            })
            sparePartStatus.push(...content);
        })
        return {
            sparePartForm: {             // 备件管理头部表单
                sparePartName: '',           // 备件名称
                sparePartNumber: '',         // 备件编号
                isCommon: ''
            },
            sparePartFormList: [         //  渲染头部功能区的列表
                { label: '备件名称', props: 'name', value: '' },
                { label: '备件编号', props: 'no', value: '' },
                { label: '是否常用', props: 'common', value: '', type: 'radio', checkList: [{ label: '是', id: true }, { label: '否', id: false }] },
                { label: '备件状态', props: 'status', value: '', type: 'radio', checkList: sparePartStatus },
            ],
            sparePartTableData: [],// 表格的数据
            total: 0,//表格数据量
            sparePartTableList: [        // 渲染表格的表头
                { type: 'selection', width: "55", selectable: /** 状态为正常或损坏时可选 */({ status }) => status == 1 || status == 2 },
                { props: 'no', label: '备件编号' },
                { props: 'name', label: '备件名称' },
                { props: 'common', label: '是否常用', translate: (val) => val ? '常用' : '不常用', },
                { props: 'status', label: '状态', translate: (val) => statusValue[val], },
                { props: 'price', label: '原值' },
                { props: 'specification', label: '型号规格' },
                { props: 'manufacturer', label: '制造商编号' },
                { props: 'deviceNos', label: '所属设备编号', slotName: 'deviceNos', 'width': '120px' },
                { props: 'deviceNames', label: '所属设备名称', slotName: 'deviceNames', 'width': '120px' },
                { props: 'materialNo', label: '东昌物料号' },
                { props: 'maintenanceNos', label: '关联维修单', slotName: 'maintenanceNos', 'width': '120px' },
                { props: 'maintenanceTimes', label: '维修时间', slotName: 'maintenanceTimes', 'width': '120px' },
                { props: 'status', label: '备件状态', translate: (val) => {
                        const obj = sparePartStatus.filter(item => item.id == val)[0];
                        return obj ? obj.label : '';
                    }                
                },
            ],
            sparePartDialog: false,          // 控制备件详情对话框的打开与关闭
            sparePartDialogForm: {},    // 控制备件详情对话框中的form表单
            sparePartDialogFormList: [       // 渲染备件详情对话框中的form表单内容
                { props: 'no', label: '备件编号' },
                { props: 'name', label: '备件名称' },
                { props: 'common', label: '是否常用', type: 'radio', checkList: [{ label: '是', id: true }, { label: '否', id: false }] },
                { props: 'status', label: '状态', type: 'radio', checkList: sparePartStatus },
                { props: 'price', label: '原值' },
                { props: 'specification', label: '型号规格' },
                { props: 'manufacturer', label: '制造商编号' },
                { props: 'deviceNos', label: '所属设备编号', slotName: 'deviceNos', 'width': '120px' },
                { props: 'deviceNames', label: '所属设备名称', slotName: 'deviceNames', 'width': '120px' },
                { props: 'materialNo', label: '东昌物料号' },
                { props: 'maintenanceNos', label: '关联维修单', slotName: 'maintenanceNos', 'width': '120px' },
                { props: 'maintenanceTimes', label: '维修时间', slotName: 'maintenanceTimes', 'width': '120px' }
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
            batchDamageRegisterData: [],//备件批量损坏登记数据
            damageRegister_isShow: false,//单个备件损坏登记模态框
            damageRegisterData: {}
        }
    },
    components: {
        tpmsHeader, buttomGroup, tpmsTable
    },
    created() {
        this.getCommonSpareData();
        getRepairLimitList().then(res => {
            this.repairLimitList = res.data.content;
        })
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        /** 点击查询按钮 */
        inquireTableData() {
            this.$refs.tpmsTable.resetCurrentPage();
            this.getTableData();
        },
        /** 加载页面表格数据 */
        getTableData() {
            let data = this.$refs.tpmsHeader.getData();
            let pageData = this.$refs.tpmsTable.getData();
            getTableData({ ...data, ...pageData }).then(res => {
                this.sparePartTableData = res.data.content;
                this.total = res.data.totalElements;
                // 异步获取每一个备件详情
                // this.sparePartTableData.forEach(item=>{
                //     getSpare(null, item.id).then(res => {
                //         const times = res.data.maintenanceTimes;
                //         item = times && times[0];
                //     })
                // })
            })
        },
        /** 表格数据超出省略号处理
         * @param {String[]} val
         */
        pipe(val) {
            if (val.length) {
                return val.join(';').slice(0, 5).padEnd(8, '.');
            } else {
                return '无';
            }
        },
        /** 获取常用备件库设置 */
        getCommonSpareData(val) {
            getCommonSpare(null, 2).then(res => {
                res.data.key = parseInt(res.data.key);
                this.sparePartsSetting = res.data;
            })
        },
        /** 常用备件频率设置 */
        changeCommonSpareData() {
            this.sparePartsSetting_isShow = false;
            this.sparePartsSetting.key = this.sparePartsSetting.key.toString();
            changeCommonSpare(this.sparePartsSetting, 2).then(res => {
                console.log(res)
                this.getCommonSpareData();
                this.$message.success('设置成功');
            }).catch(fail => {
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: '常用备件频率设置失败',
                    duration: 5 * 1000,
                })
            })
        },
        /** 点击批量损坏登记按钮 */
        clickBatchDamageRegister() {
            let batchDamageRegisterData = this.$refs.tpmsTable.getSelectionList();
            if (batchDamageRegisterData.length === 0) {
                this.$message.warning('请选择备件');
                return;
            }
            this.batchDamageRegister_isShow = true;
            batchDamageRegisterData = deepClone(batchDamageRegisterData);
            batchDamageRegisterData.forEach(item => {
                item.num = 1;
                item.repairType = null;
                item.scrapType = null;
                item.handleWay = null;
                item.appraiserName = $store.state.user.userInfo.principal.name;
                item.appraiserId = $store.state.user.userInfo.principal.id;
                // 异步获取每个备件的更换日期
                getSpare(null, item.id).then(res => {
                    const times = res.data.maintenanceTimes;
                    item = times && times[0];
                })
            })
            this.batchDamageRegisterData = batchDamageRegisterData.filter(item => item.status == 1 || item.status == 2);
            console.log(this.batchDamageRegisterData)
        },
        /** 点击同步按钮 */
        syncSpareParts() {
            setTimeout(() => {
                this.$refs.buttomGroup.syncing = false;
                this.$message.success('同步完成')
            }, 2000)
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
            damageRegisterData.changeDate = '';
            // 数组全部转成字符串显示，用逗号拼接
            for (let key in damageRegisterData) {
                if (Array.isArray(damageRegisterData[key])) {
                    damageRegisterData[key] = damageRegisterData[key].join(',')
                }
            }
            this.damageRegisterData = damageRegisterData;
            // 如果备件状态损坏，更换日期显示最新的一条，否则不显示
            if (damageRegisterData.status == 2) {
                // 异步获取备件的更换日期
                getSpare(null, row.id).then(res => {
                    const times = res.data.maintenanceTimes;
                    this.damageRegisterData.changeDate = times && times[0];
                })
            }
        },
        /** 打开备件详情的对话框 */
        showSparePartDialog(row) {
            this.sparePartDialog = true;
            this.sparePartDialogForm = {};
            getSpare(null, row.id).then(res => {
                res.data.status = res.data.status + '';
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
        batchDamageRegister() {
            this.batchDamageRegisterData.forEach(item => {
                item.spareId = item.id;
                delete item.id;
            });
            breakDownRegisterBatch(this.batchDamageRegisterData).then(res => {
                this.$message.success('批量损坏登记成功');
                this.batchDamageRegister_isShow = false;
                this.$refs.tpmsTable.$refs.table.clearSelection();
                this.getTableData();
            }).catch(fail => {
                this.$message.error('批量损坏登记失败');
            })
        }
    }
};
</script>
<style lang="scss">
.tpms-table {
    .success-row {
        background: #f0f9eb;
    }
}
.spare-part-dialog-form {
    width: 4.3rem;
    margin: 0 auto;
}
.el-select {
    width: 100%;
}
</style>