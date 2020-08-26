<template>
    <div>
        <el-row class="major-failure">
            <p>大故障记录时间：30分钟</p>
            <p>
                <span>大故障记录时间(分钟)</span>
                <el-select v-model="majorFailureTime" placeholder="">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </p>
            <el-button type="primary">
                <i class="el-icon-edit"></i>保存
            </el-button>
        </el-row>
    </div>
</template>
<script>
export default {
    data(){
        return{
            majorFailureTime:'',        // 大故障记录时间
            options:[{value:'15分钟',label:'15分钟'},{value:'30分钟',label:'30分钟'}]
        }
    }
}
</script>
<style lang="scss" scoped>
    .major-failure{
        height: 100vh;
        padding: .5rem 0;
        p{
            height:.5rem;
        }
        .el-button{
            margin-top: .5rem;
        }
    }
</style>