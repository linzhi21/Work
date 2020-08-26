// 备件批准管理的按钮组
<template>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
        <el-button size="small" @click="$emit('add')">新增</el-button>
    </el-row>
</template>

<style lang="scss" scoped>
.buttom-group {
    padding: 20px calc(0.2rem + 30px) 20px 0;
    div,
    > button {
        margin-left: 10px;
    }
}
</style>