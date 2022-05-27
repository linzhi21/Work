<template>
    <el-row>
        <tpmsHeader ref="tpmsHeader" :formData="headerList" @inquireTableData="inquireTableData" />
        <buttomGroup @add='add' />
        <tpmsTable
            ref="tpmsTable"
            :data="tableData"
            :total="total"
            :columns="columns"
            @getTableData="getTableData"
            @inquireTableData="inquireTableData"
        >
            <template slot-scope="{row}">
                <el-button @click="seeDetail(row)" size="mini">查看</el-button>
                <el-button @click="clickEdit(row)" size="mini">编辑</el-button>
                <el-button @click="deleteApprove(row)" size="mini">删除</el-button>
            </template>
        </tpmsTable>
        <!-- 新增、编辑、详情 -->
        <el-dialog :visible.sync="dialog_approveIsShow" width="900px" :title="{add:'新增',edit:'编辑',detail:'详情'}[dialog_type]" @closed='cancelSpareApprove'>
            <el-form ref="form" :disabled="dialog_type==='detail'" :model="dialog_approveData" label-width="140px" label-position="left">
                <el-form-item label="备件批准审批名称">
                    <el-input v-model="dialog_approveData.name" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="dialog_approveData.comment" />
                </el-form-item>
            </el-form>

            <tpmsTable
                :data="dialog_approveData.tableData"
                :columns="[
                    {label:'条件', slotName:'condition',width:'140px' },
                    {label:'备件金额', slotName:'money',width:'120px' },
                    {label:'审批流', slotName:'workflowId' },
                    {label:'备注', slotName:'conditionComment' },
                    {slotName: 'btns', label: '操作', width:'120px' },
                ]"
                style="padding:0;"
            >
                <template slot="condition" slot-scope="{row}">
                    <el-select v-model="row.condition" placeholder="请选择" size="mini" :disabled="dialog_type==='detail'">
                        <el-option
                            v-for="item in conditions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template>
                <template slot="money" slot-scope="{row}">
                    <el-input v-model="row.money" placeholder="请输入" size="mini" :disabled="dialog_type==='detail'" />
                </template>
                <template slot="workflowId" slot-scope="{row}">
                    <el-select v-model="row.workflowId" placeholder="请选择审批流" size="mini" :disabled="dialog_type==='detail'">
                        <el-option
                            v-for="item in workflows"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template>
                <template slot="conditionComment" slot-scope="{row}">
                    <el-input v-model="row.conditionComment" type="textarea" placeholder="请输入备注" size="mini" :disabled="dialog_type==='detail'" />
                </template>
                <template slot='btns' slot-scope="scope" v-if="dialog_type!=='detail'">
                    <el-button
                        class="icon-size"
                        size="mini"
                        circle
                        type="text"
                        icon="el-icon-circle-plus-outline"
                        @click="addLine(scope)"
                    />
                    <el-button
                        v-if="scope.$index!==0"
                        class="icon-size"
                        size="mini"
                        circle
                        type="text"
                        icon="el-icon-remove-outline"
                        @click='removeLine(scope)'
                    />
                </template>
            </tpmsTable>
            <el-row v-if="dialog_type==='detail'" type="flex" justify="center">
                <el-button type="primary" @click="cancelSpareApprove">关闭</el-button>
            </el-row>
            <el-row v-else type="flex" justify="center">
                <el-button @click="cancelSpareApprove">取消</el-button>
                <el-button type="primary" @click="saveSpareApprove">保存</el-button>
            </el-row>
        </el-dialog>
    </el-row>
</template>

<script>
import { spareApprove } from '../../lib/api/spart';
import { tpmsHeader, tpmsTable } from '../../components';
import { SparePartApprove as buttomGroup } from './components/buttomGroups';
const approve = {
    conditionComment: '',
    money: '',
    workflowId: '',
    comment: ''
};
export default {
    data() {
        return {
            headerList: [
                { label: '备件批准审批名称', props: 'name', value: '', 'label-width': '130px' }
            ],
            tableData: [],
            total: 0,
            columns: [
                { props: 'name', label: '备件批准审批名称' },
                { props: 'comment', label: '备注' },
            ],
            dialog_approveIsShow: false,
            dialog_type:'add',
            dialog_approveData: {
                name: '',
                comment: '',
                tableData: [{ ...approve }]
            },
            conditions: [
                { label: '小于', value: 1 },
                { label: '小于等于', value: 2 },
                { label: '等于', value: 4 },
                { label: '大于', value: 8 },
                { label: '大于等于', value: 16 }
            ],
            // TODO 审批流接口先放着，等有审批流了再调；新增备件审批传给后端的是number
            workflows:[]
        }
    },
    mounted() {
        this.getTableData();
    },
    components: {
        tpmsHeader,
        tpmsTable,
        buttomGroup
    },
    methods: {
        /** 加载表格数据 */
        getTableData() {
            const data = this.$refs.tpmsHeader.getData();
            const pageData = this.$refs.tpmsTable.getData();
            spareApprove.getList({ ...data, ...pageData }).then(res => {
                this.tableData = res.data.content;
                this.total = res.data.totalElements;
            })
        },
        /** 加载表格详情 */
        getTableItemDetail(row) {
            spareApprove.getDetail({name:row.name}).then(res => {
                console.log(res)
                this.dialog_approveData.name=res.data[0].name;
                this.dialog_approveData.comment=res.data[0].comment;
                this.dialog_approveData.tableData=res.data;
            })
        },
        /** 点击查询按钮 */
        inquireTableData() {
            this.$refs.tpmsTable.resetCurrentPage();
            this.getTableData();
        },
        /** 点击新增按钮 */
        add(){
            this.dialog_approveIsShow=true;
            this.dialog_type='edit';
        },
        /** 点击加号按钮 */
        addLine(){
            this.dialog_approveData.tableData.push({...approve});
        },
        /** 点击减号按钮 */
        removeLine({$index}) {
            this.dialog_approveData.tableData.splice($index,1);
        },
        /** 新增｜编辑  备件批准审批 */
        saveSpareApprove(){
            const func = {
                add: spareApprove.add,//模态框是新增
                edit:spareApprove.change//模态框是编辑
            }
            const {dialog_approveData, dialog_type}=this;
            const {name,comment}=this.dialog_approveData;
            if(!dialog_approveData.name){
                this.$message.warning('请输入备件批准审批名称');
                return;
            }
            if(!dialog_approveData.tableData.every(item=>(item.condition&&item.money&&item.workflowId))){
                this.$message.warning('请选择或输入完整的条件信息')
                return;
            }
            dialog_approveData.tableData.forEach(item=>{
                item.name=name;
                item.comment=comment;
                delete item.id;
            })
            func[dialog_type](dialog_approveData.tableData).then(res=>{
                this.$message.success(`操作成功`)
                this.cancelSpareApprove();
                this.getTableData();
            }).catch(fail=>{
                this.$message.error(`操作失败`)
                this.cancelSpareApprove();
                this.getTableData();
            })
            console.log(dialog_approveData)
        },
        /** 关闭模态框，还原模态框数据 */
        cancelSpareApprove(){
            this.dialog_approveIsShow=false;
            this.dialog_approveData.name='';
            this.dialog_approveData.comment='';
            this.dialog_approveData.tableData=[{...approve}];
        },
        /** 点击查看按钮 */
        seeDetail(row){
            this.dialog_type='detail';
            this.dialog_approveIsShow=true;
            this.getTableItemDetail(row);
        },
        /** 点击编辑按钮 */
        clickEdit(row){
            this.dialog_type='edit';
            this.dialog_approveIsShow=true;
            this.getTableItemDetail(row);
        },
        /** 点击删除按钮 */
        deleteApprove(row){
            spareApprove.delete({name:row.name}).then(res=>{
                this.$message.success('删除成功');
                this.getTableData();
            }).catch(fail=>{
                this.$message.error('删除失败');
                this.getTableData();
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.icon-size {
    font-size: 25px;
}
</style>>