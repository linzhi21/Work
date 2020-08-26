<template>
    <el-row style="height:90vh;">
        <tpms-table :data="tableData" :columns="tableColumns" :paginationIsShow="false">
            <template slot="value" slot-scope="{row}">
                <el-input-number v-if="row.edit" v-model="row.value" :min="1" size="mini" />
                <span v-else>{{row.value}}</span>
            </template>
            <template slot-scope="{row}">
                <el-button v-if="row.edit" type="primary" size="mini" @click="confirmEdit(row)">保存</el-button>
                <el-button v-if="row.edit" type="warning" size="mini" @click="row.edit=false">取消</el-button>
                <el-button v-else type="primary" size="mini" @click="row.edit=true">编辑</el-button>
            </template>
        </tpms-table>
    </el-row>
</template>
<script>
import { tpmsTable } from '../../components';
import { getRepairLimitList, changeRepairLimit } from '../../lib/api/spart';

export default {
    data() {
        return {
            tableData: [],
            tableColumns: [
                { props: 'key', label: '返修类型' },
                { slotName: 'value', label: '返修上限', edit: false }
            ],
        }
    },
    components: {
        tpmsTable
    },
    created() {
        this.getTableData();
    },
    methods: {
        getTableData() {
            getRepairLimitList().then(res => {
                res.data.content.forEach(item => item.edit = false);
                this.tableData = res.data.content;
            })
        },
        confirmEdit(row) {
            row.edit = false;
            changeRepairLimit({ value: row.value }, row.id).then(res => {
                this.getTableData();
                this.$message.success('修改成功');
            }).catch(fail => {
                this.$message.error('修改失败');
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.input-width {
    width: 50px;
}
</style>