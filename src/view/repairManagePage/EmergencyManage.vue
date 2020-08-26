<template>
    <div>
        <el-row>
            <el-form label-width="80px">
                <el-col :span="8">
                    <el-form-item label="紧急程度">
                        <el-select v-model="emergency" placeholder="">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :offset="8">
                    <el-form-item>
                        <el-button type="primary" size="mini">
                            <i class="el-icon-edit"></i>
                            查询
                        </el-button>
                        <el-button size="mini">
                            <i class="el-icon-edit"></i>
                            重置
                        </el-button>
                        <el-button size="mini" @click="showNewAddDialog">
                            <i class="el-icon-edit"></i>
                            新增
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-table :data='problemTable' @row-click='showCheckDialog'>
            <el-table-column align="center" type="index" label="序号"></el-table-column>
            <el-table-column align="center" label="紧急程度" prop="emengency"></el-table-column>
            <el-table-column align="center" label="紧急程度描述" prop="emengencyDescription"></el-table-column>
            <el-table-column align="center" label="操作">
                <span class="button" @click.stop="showEditDialog">编辑</span>
                <span class="button">删除</span>
            </el-table-column>
        </el-table>
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
        <!-- 查看问题上升机制的对话框 -->
        <el-dialog
        title="查看问题上升机制"
        :visible.sync="checkDialog"
        width="50%"
        :before-close="handleClose">
            <div class="check-dialog">
                <p>紧急程度:A</p>
                <p>紧急程度描述：紧急程度描述</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="checkDialog = false"><i class="el-icon-edit"></i>返 回</el-button>
            </span>
        </el-dialog>
        <!-- 编辑的对话框 -->
        <el-dialog
        title="编辑"
        :visible.sync="editDialog"
        width="50%"
        :before-close="handleClose">
            <el-form class="edit-form" :model="editForm" label-width="120px">
                <el-form-item label="紧急程度">
                    <el-input type="text" v-model="editForm.emergency" placeholder="1"></el-input>
                </el-form-item>
                <el-form-item label="紧急程度描述">
                      <el-input type="textarea" v-model="editForm.emergencyDescription"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="editDialog = false"><i class="el-icon-edit"></i>取 消</el-button>
                <el-button type="primary" @click="editDialog = false"><i class="el-icon-edit"></i>保 存</el-button>
            </span>
        </el-dialog>
        <!-- 新增的对话框 -->
        <el-dialog
        title="新增"
        :visible.sync="newAddDialog"
        width="50%"
        :before-close="handleClose">
            <el-form class="edit-form" :model="newAddForm" label-width="120px">
                <el-form-item label="紧急程度">
                    <el-input type="text" v-model="newAddForm.emergency" placeholder="1"></el-input>
                </el-form-item>
                <el-form-item label="紧急程度描述">
                      <el-input type="textarea" v-model="newAddForm.emergencyDescription"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="newAddDialog = false"><i class="el-icon-edit"></i>取 消</el-button>
                <el-button type="primary" @click="newAddDialog = false"><i class="el-icon-edit"></i>保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
           emergency:'',            // 紧急程度
            problemTable:[
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
                {emengency:'润滑油站',emengencyDescription:'紧急程度描述紧急程度描述紧急程度描述紧急程度描述'},
            ],
            checkDialog:false,              // 控制问题上升机制对话框的打开与关闭
            editDialog:false,                // 控制编辑对话框的打开与关闭
            editForm:{
                emergency:'',
                emergencyDescription:'',
            },
            newAddDialog:false,                // 控制新增对话框的打开与关闭
            newAddForm:{
                 emergency:'',
                emergencyDescription:'',
            },
            options:[{value:'选项1',label:'小龙虾'},{value:'选项2',label:'黄金糕'}]
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
       * @description 打开查看问题上升机制对话框
       */
      showCheckDialog(row){
          const _this=this
          _this.checkDialog=true
          _this.checkDialogContent=row
      },
      /**
       * @description 关闭所有的对话框
       */
      handleClose(){
          const _this=this
          _this.checkDialog=false
          _this.editDialog=false
          _this.newAddDialog=false
      },
      /**
       * @description 打开编辑的对话框
       */
      showEditDialog(){
          const _this=this
          _this.editDialog=true
      },
      /**
       * @description 打开新增的对话框
       */
      showNewAddDialog(){
          const _this=this
          _this.newAddDialog=true
      }
    }
}
</script>
<style lang="scss" scoped>
    .el-row{
        margin-top: 0.2rem;
    }
    .button{
        color:#2883FE;
    }
    
    .check-dialog{
        padding: .5rem 20%;
        p{
            padding: 0.1rem 1rem;
            border-bottom: 1px dashed #E9E9E9;
        }
    }
    .edit-form{
        width: 60%;
        margin: 0 20%;
       
    }
</style>