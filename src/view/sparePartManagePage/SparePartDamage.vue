<template>
    <div>
        <el-row>
            <el-tabs v-model="handleWay" @tab-click="inquireTableData" style="width:6rem;">
                <el-tab-pane label="工业垃圾" name="1" />
                <el-tab-pane label="备件报废" name="2" />
                <el-tab-pane label="委内修复" name="4" />
                <el-tab-pane label="委外修复" name="4.1" />
            </el-tabs>
        </el-row>
        <!-- 头部功能区 -->
        <tpms-header
            ref="tpmsHeader"
            :formData="headerFormList.filter(item=>item.show?item.show.includes(handleWay):true)"
            @inquireTableData="inquireTableData"
        />

        <tpmsTable
            class="tpms-table"
            ref="tpmsTable"
            :data="tableData"
            :total="total"
            :columns="columns[handleWay]"
            @inquireTableData="getTableData"
        >
            <template slot-scope="{row}">
                <span class="button" @click="showSparePartDeatail(row)">查看</span>
                <span class="button" @click="showSparePartDeatail(row,'审批')">审批</span>
                <span v-if="handleWay==2" class="button" @click="showSparePartDeatail(row,'转移')">转移</span>
            </template>
        </tpmsTable>

        <!-- 备件详情对话框 -->
        <el-dialog
            :title="{1:'工业垃圾',2:'备件报废',4:'委内修复',4.1:'委外修复'}[handleWay]+dialogType"
            :visible.sync="sparePartDetailDialog"
            width="950px"
            @closed="dialogClosed"
        >
            <el-row>
                <el-form
                    class="form"
                    ref="sparePartDetail"
                    :model="sparePartDetail"
                    label-position="left"
                    label-width="130px"
                >
                    <el-col
                        :span="item.type==='textArea'?24:11"
                        v-for="item in sparePartDetailList[handleWay].filter(ever=>!ever.onlyShow||ever.onlyShow.includes(dialogType))"
                        :key="item.label"
                    >
                        <el-form-item v-bind="item" :prop="item.props">
                            <el-select
                                style="width:100%;"
                                v-if="item.type==='radio'"
                                v-model="sparePartDetail[item.props]"
                                :placeholder="item.placeholder||''"
                                :disabled="item.disabled===false?false:true"
                            >
                                <el-option
                                    v-for="(item,i) in item.checkList"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.id"
                                />
                            </el-select>
                            <el-input
                                v-else-if="item.type==='textArea'"
                                :disabled="item.disabled===false?false:true"
                                type="textarea"
                                v-model="sparePartDetail[item.props]"
                            />
                            <el-date-picker
                                v-else-if="item.type==='date'"
                                value-format="yyyy-MM-dd"
                                :disabled="item.disabled===false?false:true"
                                v-model="sparePartDetail[item.props]"
                                style="width:100%"
                            />
                            <el-upload
                                v-else-if="item.type==='upload'"
                                ref="upload"
                                :action="action"
                                :show-file-list="true"
                                :on-success="uploadSucess"
                                :on-error="uploadError"
                                :on-remove="remove"
                                multiple
                            >
                                <el-button size="mini">选择文件</el-button>
                            </el-upload>
                            <el-input
                                v-else
                                :disabled="item.disabled===false?false:true"
                                v-model="sparePartDetail[item.props]"
                            />
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-row type="flex" justify="center">
                <el-button
                    v-if="dialogType==='详情'"
                    type="primary"
                    @click="sparePartDetailDialog = false"
                >返 回</el-button>
                <el-button v-if="dialogType==='审批'" @click="approver(false)">审批驳回</el-button>
                <el-button v-if="dialogType==='审批'" type="primary" @click="approver(true)">审批通过</el-button>
                <el-button v-if="dialogType==='转移'" @click="sparePartDetailDialog = false">返 回</el-button>
                <el-button v-if="dialogType==='转移'" type="primary" @click="scrapTransfer(true)">转 移</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { spareBreakdown } from '../../lib/api/spart';
import apiConfig from '../../lib/api/apiConfig';
import { tpmsHeader, tpmsTable } from '../../components';

// 备件状态下拉选择框
const status = [
    { id: 1, label: '待审批' },
    { id: 2, label: '已处理' },
    { id: 3, label: '待转移' },
    { id: 4, label: '已退回' },
    { id: 5, label: '待处理' },
    { id: 6, label: '处理待审批' },
    { id: 7, label: '待送修' },
    { id: 8, label: '待签收' },
    { id: 9, label: '待验收' },
    { id: 10, label: '待确认' },
    { id: 11, label: '已修复' },
    { id: 12, label: '未修复' },
];

const statusObj = {};
status.map(state => {
    statusObj[state.id] = state.label;
})

const tables = {
    1: [//工业垃圾
        { props: 'no', label: '损坏备件登记单号', width:'150px' },
        { props: 'changeDate', label: '更换日期', width: '180px' },
        { props: 'spareNo', label: '备件编号' },
        { props: 'spareName', label: '备件名称' },
        { props: 'spareSpecification', label: '规格型号' },
        { props: 'sparePrice', label: '原值(元)' },
        { props: 'num', label: '数量' },
        { props: 'appraiserName', label: '鉴定人' },
        { props: 'handleDate', label: '提交日期', width:'110px' },
        { props: 'workflowDate', label: '审批日期', width:'110px' },
        { props: 'status', label: '状态', translate: (val) => statusObj[val] }
    ],
    2: [//备件报废
        { props: 'no', label: '损坏备件登记单号' },
        { props: 'changeDate', label: '更换日期' },
        { props: 'spareNo', label: '备件编号' },
        { props: 'spareName', label: '备件名称' },
        { props: 'spareSpecification', label: '规格型号' },
        { props: 'sparePrice', label: '原值(元)' },
        { props: 'num', label: '数量' },
        { props: 'appraiserName', label: '鉴定人' },
        { props: 'handleDate', label: '报废日期' },
        { props: 'scrapType', label: '报废类型', translate: (val) => ({1:'金属报废',2:'非金属报废'}[val]) },
        { props: 'status', label: '状态', translate: (val) => statusObj[val] }
    ],
    4: [//委内维修
        { props: 'no', label: '内部维修单号' },
        { props: 'changeDate', label: '申请人' },
        { props: 'changeDate', label: '电话' },
        { props: 'changeDate', label: '申请日期' },
        { props: 'spareNo', label: '备件编号' },
        { props: 'spareSpecification', label: '修理件名称' },
        { props: 'spareSpecification', label: '数量' },
        { props: 'spareSpecification', label: '产品系列号/部件修理号' },
        { props: 'spareSpecification', label: '型号/规格' },
        { props: 'spareSpecification', label: '部件使用设备及控制对象' },
        { props: 'spareSpecification', label: '故障现象描述' },
        { props: 'spareSpecification', label: '部件修理技术要求' },
        { props: 'spareSpecification', label: '要求完成日期' },
        { props: 'spareSpecification', label: '维修技术员' },
        { props: 'repairTime', label: '状态' }
    ],
    4.1: [//委外维修
        { props: 'no', label: '委外维修单号' },
        { props: 'changeDate', label: '申请人' },
        { props: 'changeDate', label: '电话' },
        { props: 'changeDate', label: '申请日期' },
        { props: 'spareNo', label: '备件编号' },
        { props: 'spareSpecification', label: '修理件名称' },
        { props: 'spareSpecification', label: '数量' },
        { props: 'spareSpecification', label: '产品系列号/部件修理号' },
        { props: 'spareSpecification', label: '型号/规格' },
        { props: 'spareSpecification', label: '部件使用设备及控制对象' },
        { props: 'spareSpecification', label: '故障现象描述' },
        { props: 'spareSpecification', label: '委外类型' },
        { props: 'spareSpecification', label: '推荐修理单位及初步报价' },
        { props: 'spareSpecification', label: '部件修理技术要求' },
        { props: 'spareSpecification', label: '要求完成日期' },
        { props: 'spareSpecification', label: '维修技术员' },
        { props: 'repairTime', label: '状态' }
    ],
};

const detailDialog = {
    1: [//工业垃圾
        { props: 'no', label: '损坏备件登记单号' },
        { props: 'changeDate', label: '更换日期' },
        { props: 'spareNo', label: '备件编号' },
        { props: 'spareName', label: '备件名称' },
        { props: 'spareSpecification', label: '规格型号' },
        { props: 'sparePrice', label: '原值(元)' },
        { props: 'num', label: '数量' },
        { props: 'appraiserName', label: '鉴定人' },
        { props: 'handleDate', label: '提交日期' },
        { props: 'workflowDate', label: '审批日期' },
        { props: 'status', label: '状态', type: 'radio', checkList: status }
    ],
    2: [//备件报废
        { props: 'no', label: '报废单号' },
        { props: 'handleDate', label: '报废日期' },
        { props: 'spareNo', label: '备件编号' },
        { props: 'spareName', label: '备件名称' },
        { props: 'spareSpecification', label: '规格型号' },
        { props: 'sparePrice', label: '原值(元)' },
        { props: 'num', label: '数量' },
        { props: 'scrapType', label: '报废类型' },
        { props: 'appraiserName', label: '鉴定人' },
        { props: 'handleDate', label: '处理日期' },
        { props: 'approverName', label: '审批人' },
        { props: 'workflowDate', label: '审批日期' },
        { props: 'agreeApprove', label: '是否同意' },
        { props: 'transferor', label: '转交人', onlyShow: ['转移'] },
        { props: 'receiveCompany', label: '接收单位', onlyShow: ['转移'], disabled: false, rules: [{ required: true, message: '接收单位不能为空', trigger: 'change' },] },
        { props: 'receiveDate', label: '接收日期', onlyShow: ['转移'], disabled: false, type: 'date', rules: [{ required: true, message: '请选择日期', trigger: 'change' }] },
        { props: 'comment', label: '备注', onlyShow: ['转移'], type: 'textArea', disabled: false },
        { props: 'receiptIds', label: '上传签收文件', onlyShow: ['转移'], type: 'upload', disabled: false, rules: [{ required: true, message: '请先上传签收文件', trigger: 'change' },] },
    ],
    4: [//委内维修
        { props: 'no', label: '内部维修单号' },
        { props: 'changeDate', label: '申请人' },
        { props: 'changeDate', label: '电话' },
        { props: 'changeDate', label: '申请日期' },
        { props: 'spareNo', label: '备件编号' },
        { props: 'spareSpecification', label: '修理件名称' },
        { props: 'spareSpecification', label: '数量' },
        { props: 'spareSpecification', label: '产品系列号/部件修理号' },
        { props: 'spareSpecification', label: '型号/规格' },
        { props: 'spareSpecification', label: '部件使用设备及控制对象' },
        { props: 'spareSpecification', label: '故障现象描述' },
        { props: 'spareSpecification', label: '部件修理技术要求' },
        { props: 'spareSpecification', label: '要求完成日期' },
        { props: 'spareSpecification', label: '维修技术员' },
        { props: 'repairTime', label: '状态' }
    ],
    4.1: [//委外维修
    ]
}
export default {
    data() {
        let self = this;
        return {
            handleWay: '1',
            headerFormList: [
                { label: '备件名称', props: 'name', value: '' },
                { label: '备件编号', props: 'no', value: '' },
                { label: '处理日期', props: 'handleDate', type: 'timeFrame', value: '', show: ['1', '2'] },
                { label: '维修日期', props: 'repaireDate', type: 'timeFrame', value: '', show: ['4', '4.1'] },
                { label: '状态', props: 'status', type: 'radio', value: '', checkList: status },
            ],
            columns: tables,
            tableData: [],// 表格的数据
            total: 0,
            sparePartDetailDialog: false,   // 控制备件详情对话框的打开与关闭
            dialogType: '',                  // 模态框类型。详情｜审批｜转移｜处理｜处理审批｜送修｜签收｜验收｜确认｜返修
            sparePartDetail: {},            // 备件详情
            action: apiConfig.uploadFile + '/4',// 文件上传地址
            sparePartDetailList: detailDialog,// 备件详情需要展示的字段,
            internalRepairDialog: false,        // 控制 备件内部维修申请单对话框的打开与关闭
            internalPepairForm: {               // 备件内部维修申请单的内容
                processType: '委内维修',         // 维修类型
                applicationPersion: '',         // 申请人
                telphone: '',                   // 电话
                applicationDate: '',            // 申请日期
                sparePartNumber: '',            // 备件编号
                repairName: '',                 // 修理件名称
                number: '',                     // 数量
                repairPartNumber: '',           // 产品系列号/部件修理号
                type: '',                       // 规格型号
                controlName: '',                // 部件使用设备及控制对象
                finishDate: '',                 // 要求完成日期
                faultPictures: '',              // 故障图片
                faultDescription: '',           // 故障现象描述
                technicalRequirement: '',       // 部件修理技术要求
            },
            internalPepairFormList: [               // 渲染备件内部维修申请单的表单内容
                { leftLabel: '电话', leftName: 'telphone', rightLabel: '申请日期', rightName: 'applicationDate' },
                { leftLabel: '备件编号', leftName: 'sparePartNumber', rightLabel: '修理件名称', rightName: 'repairName' },
                { leftLabel: '数量', leftName: 'number', rightLabel: '产品系列号/部件修理号', rightName: 'repairPartNumber' },
                { leftLabel: '规格型号', leftName: 'type', rightLabel: '部件使用设备及控制对象', rightName: 'controlName' },
            ],
        }
    },
    components: {
        tpmsHeader,
        tpmsTable
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
            const searchData = this.$refs.tpmsHeader.getData();
            const pageData = this.$refs.tpmsTable.getData();
            const handleWay = this.handleWay;
            const data = {
                ...searchData,
                ...pageData,
                handleWay: handleWay | 0, //字符串转数字且快速取整
            };
            if ((handleWay | 0) === 4) {
                // 1:委内修复； 2:委外修复
                data.repairType = { 4: 1, 4.1: 2 }[handleWay];
            };
            this.tableData = [];
            this.total = 0;
            spareBreakdown.getList(data).then(res => {
                console.log(res)
                this.tableData = res.data.content;
                this.total = res.data.numberOfElements;
            })
        },
        /** 点击查看按钮|加载备件详情
         * @param {String} type - 模态框类型
         */
        showSparePartDeatail(row, type = '详情') {
            const getDetailFuncs = {
                1: spareBreakdown.rubbish,//获取工业垃圾详情
                2: spareBreakdown.scrap,//获取备件报废详情
            };
            this.sparePartDetailDialog = true;
            this.dialogType = type;
            this.sparePartDetail = {};
            getDetailFuncs[this.handleWay](null, row.id).then(res => {
                res.data.transferor = this.$store.state.user.userInfo.name;
                this.sparePartDetail = res.data;
                this.sparePartDetail.receiptIds = [];
            })
        },
        /** 审批通过｜审批驳回
         * @param {Boolean} val
         */
        approver(val) {
            const approverFuncs = {
                1: spareBreakdown.rubbishApproval,//工业垃圾审批
                2: spareBreakdown.scrapApproval,//备件报废审批
                4: spareBreakdown.inRepairApproval,//委内维修审批
            };
            const id = this.sparePartDetail.id;
            approverFuncs[this.handleWay]({ agreeApprove: val }, id).then(res => {
                this.$message.success('审批完成');
            }).catch(fail => {
                this.$message.error('审批失败');
            })
        },
        /** 备件报废转移 */
        scrapTransfer() {
            this.$refs.sparePartDetail.validate(valid => {
                console.log(valid)
            })
            console.log(this.sparePartDetail)
            console.log(this.$refs.upload)
            const sparePartDetail = this.sparePartDetail;
            spareBreakdown.scrapTransfer(sparePartDetail, sparePartDetail.id).then(res => {
                console.log(res)
                this.$message.success('备件转移成功');
                this.sparePartDetailDialog = false;
            }).catch(fail => {
                this.$message.error('备件转移失败')
            })
        },
        uploadSucess(res, file, fileList) {
            console.log(res);
            console.log(file);
            console.log(fileList);
            this.sparePartDetail.receiptIds.push(file.response.id);
            this.$message({
                message: "文件上传完成",
                type: "success"
            });
        },
        uploadError(err, files, fileList) {
            console.log(err);
            this.$message({
                message: "文件上传失败",
                type: "error"
            });
        },
        remove(file, fileList) {
            let { receiptIds } = this.sparePartDetail;
            const index = receiptIds.indexOf(file.response.id);
            receiptIds.splice(index, 1);
        },
        /** 模态框关闭时的回调。清除模态框里的表单数据 */
        dialogClosed() {
            this.sparePartDetail = {};
            this.$refs.upload && this.$refs.upload[0].clearFiles();
            this.$refs.sparePartDetail.clearValidate();
        }
    }
};
</script>
<style lang="scss" scoped>
.form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.spare-part-dialog-form {
    width: 4.3rem;
    margin: 0 auto;
}
.internal-pepair-form {
    padding: 0.1rem 0.5rem;
    padding-right: 1.2rem;
}
.internal-pepair-item-right {
    float: right;
}
.internal-pepair-item-left {
    float: left;
}
.large-textarea {
    width: 8rem;
}
.medium-textarea {
    width: 3.2rem;
}
.upload-size {
    width: 2.1rem;
}
</style>