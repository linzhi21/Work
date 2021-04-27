// 审批流管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header
        ref="tpmsHeader"
        :Btnoffset="8"
        :formData="authFormList"
        @inquireTableData="inquireTableData"
      />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button type="primary" size="small" @click="dialog_add.isShow=true">新增</el-button>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :data="tableData.dataList"
        :total="tableData.total"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
        :columns="[
          { label: '话题名称', props: 'name' },
          { label: '话题类型', props: 'type', translate: (val) => ({1:'分享',2:'提问'}[val]) },
          { label: '主题类型', props: 'expertTypeStr' },
          { label: '专家类型', props: 'themeTypeStr' },
          { label: '关键字', props: 'keyword' },
          { label: '话题发起人', props: 'authorName' },
        ]"
      >
        <template slot-scope="{row}">
          <span class="button cursor" @click="getDetail(row)">详情</span>
        </template>
      </tpms-table>
    </el-row>

    <!-- 新增话题模态框 -->
    <el-dialog
      width="500px"
      title="新增话题"
      center
      :visible.sync="dialog_add.isShow"
      @close="$refs.dialog_add.resetFields()"
    >
      <el-form
        ref="dialog_add"
        label-width="100px"
        :model="dialog_add.data"
        :rules="dialog_add.rules"
      >
        <el-form-item label="主题贴标题" prop="name" required>
          <el-input v-model="dialog_add.data.name"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword" required>
          <el-input v-model="dialog_add.data.keyword"></el-input>
        </el-form-item>
        <el-form-item label="主题类型" prop="themeType" required>
          <el-select v-model="dialog_add.data.themeType" placeholder="请选择主题类型" class="width-fill">
            <el-option
              v-for="item in themeTypeList"
              :label="item.label"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专家类型" prop="expertType" required>
          <el-select v-model="dialog_add.data.expertType" placeholder="请选择专家类型" class="width-fill">
            <el-option
              v-for="item in expertTypeList"
              :label="item.label"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题贴内容" prop="content" required>
          <el-input v-model="dialog_add.data.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item v-if="dialog_add.data.originName" label="已上传文件" prop="originName">
          <el-input v-model="dialog_add.data.originName" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-row
        v-if="!dialog_add.data.originName"
        type="flex"
        justify="end"
        style="margin-bottom:15px;"
      >
        <!-- <el-button @click="uploadFile">上传文件</el-button> -->
        <tpms-choosefile @getFileData="uploadFile" accept type="default" text="上传文件"></tpms-choosefile>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button @click="dialog_add.isShow=false">取消</el-button>
        <el-button
          type="primary"
          @click="$refs.dialog_add.validate(validate=>validate&&beforeAddTheme())"
        >保存</el-button>
      </el-row>
    </el-dialog>

    <!-- 查看话题详情模态框 -->
    <el-dialog
      width="70%"
      title="话题详情"
      center
      :visible.sync="dialog_edit.isShow"
      @close="$refs.dialog_edit.resetFields()"
    >
      <el-row>
        <el-form ref="dialog_edit" label-width="100px" :model="dialog_edit.data" disabled>
          <el-col :span="11">
            <el-form-item label="主题贴标题" prop="name">
              <el-input v-model="dialog_edit.data.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="关键字" prop="keyword">
              <el-input v-model="dialog_edit.data.keyword"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="主题类型" prop="themeType">
              <el-select
                v-model="dialog_edit.data.themeType"
                placeholder="请选择主题类型"
                class="width-fill"
              >
                <el-option
                  v-for="item in themeTypeList"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="专家类型" prop="expertType">
              <el-select
                v-model="dialog_edit.data.expertType"
                placeholder="请选择专家类型"
                class="width-fill"
              >
                <el-option
                  v-for="item in expertTypeList"
                  :label="item.label"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="23">
            <el-form-item label="主题贴内容" prop="content">
              <el-input v-model="dialog_edit.data.content" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <tpms-table
        ref="commentTable"
        :data="dialog_edit.table.dataList"
        :total="dialog_edit.table.total"
        @getTableData="getCommentData"
        :columns="[
          { label: '问题', props: 'content' },
          { label: '回答', slotName: 'answerContent' }
        ]"
      >
        <template slot="answerContent" slot-scope="{row}">
          <el-input v-if="row.edit" placeholder="请输入回答" v-model="row.answerContent" />
          <span v-else>{{row.answerContent}}</span>
        </template>
        <template slot-scope="{row}">
          <span
            v-if="row.childComments.length===0&&row.edit===false"
            class="button cursor"
            @click="editAnswer(row)"
          >编辑回答</span>
          <span v-if="row.edit" class="button cursor" @click="answer(row)">提交回答</span>
        </template>
      </tpms-table>
      <!-- <el-row type="flex" justify="center">
        <el-button @click="dialog_edit.isShow=false">取消</el-button>
        <el-button
          type="primary"
          @click="$refs.dialog_edit.validate(validate=>validate&&beforeAddTheme())"
        >保存</el-button>
      </el-row>-->
    </el-dialog>
  </div>
</template>

<script>
import {
  tpmsHeader,
  tpmsTable,
  tpmsChoosefile
} from '../../components';
import { themeManage, themeTypeManage, expertTypeManage, fileManage } from '../../lib/api/expert';

const getListFuncs = [
  themeTypeManage.getList,
  expertTypeManage.getList
];

const [themeTypeList, expertTypeList] = getListFuncs.map(func => {
  const arr = [];
  const data = {
    page: 0,
    size: 50
  };
  func(data).then(res => {
    const { content } = res.data;
    content.forEach(item => item.label = item.name);
    arr.push(...content);
    console.log(arr)
  })
  return arr;
})

export default {
  data() {
    return {
      authFormList: [
        //  渲染头部功能区的列表
        { label: "主题名称", props: "name", value: "" },
        { label: "话题类型", props: "type", value: "", type: 'radio', checkList: [{ label: '分享', id: 1 }, { label: '提问', id: 2 }] },
        { label: "主题类型", props: "themeTypeId", value: "", type: 'radio', checkList: themeTypeList },
        { label: "专家类型", props: "expertTypeId", value: "", type: 'radio', checkList: expertTypeList },
        { label: "关键字", props: "keyword", value: "" }
      ],
      themeTypeList,//主题类型
      expertTypeList,//专家类型
      // 表格
      tableData: {
        dataList: [],
        total: 0,
      },
      // 新增智库模态框
      dialog_add: {
        isShow: false,
        data: {
          name: '',
          keyword: '',
          themeType: '',
          expertType: '',
          content: '',
          originName: ''
        },
        rules: {}
      },
      // 智库详情模态框
      dialog_edit: {
        isShow: false,
        id: '',
        data: {},
        table: {
          dataList: [],
          total: 0
        }
      },
    }
  },
  components: {
    tpmsHeader, tpmsTable, tpmsChoosefile
  },
  mounted() {
    this.getTableData()
    console.log(this.$store)

  },
  methods: {
    /** 点击查询按钮 */
    inquireTableData() {
      // 重置table页为第一页
      this.$refs.tpmsTable.resetCurrentPage();
      this.getTableData();
    },

    /** 加载页面表格数据 */
    getTableData() {
      // 获取头部搜索组数据
      let data = this.$refs.tpmsHeader.getData();
      let pageData = this.$refs.tpmsTable.getData();
      themeManage.getList({ ...data, ...pageData }).then(res => {
        const { content, totalElements } = res.data;
        this.tableData.dataList = content;
        this.tableData.total = totalElements;
      })
    },
    /** 上传文件 */
    uploadFile(file) {
      console.log(file)
      let formData = new FormData();
      formData.append('file', file);
      this.$store.commit('SET_UPLOADING', true)
      fileManage.upload(formData).then(res => {
        const { id, path, originName } = res;
        Object.assign(this.dialog_add.data, {
          accessoryId: id,
          accessoryUrl: path + originName,
          originName
        })
        console.log(res)
        this.$message.success('上传成功');
        this.$store.commit('SET_UPLOADING', false)
      })
    },
    /** 新增话题之前 */
    beforeAddTheme() {
      this.$confirm("确认新增？", "确认信息", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(this.addTheme)
        .catch(() => {
        });
    },
    /** 新增话题 */
    addTheme() {
      const { data } = this.dialog_add;
      themeManage.add({
        ...data,
        type: 2,   //提问还是分享,1为分享,2为提问
      }).then(res => {
        this.$message.success('新增完成');
        this.getTableData();
        this.dialog_add.isShow = false;
      })
    },
    /** 加载智库详情 */
    getDetail({ id }) {
      this.dialog_edit.isShow = true;
      this.dialog_edit.id = id;
      themeManage.getDetail(null, id).then(res => {
        this.dialog_edit.data = res.data;
      });
      this.$nextTick(() => {
        this.getCommentData();
      })
    },
    /** 加载评论列表 */
    getCommentData() {
      const { id } = this.dialog_edit;
      const pageData = this.$refs.commentTable.getData();
      themeManage.getComments(pageData, id).then(res => {
        const { content, totalElements } = res.data;
        content.forEach(item => {
          item.edit = false;
          if (item.childComments[0]) {
            item.answerContent = item.childComments[0].content;
          }
        })
        this.dialog_edit.table.dataList = content;
        this.dialog_edit.table.total = totalElements;
      })
    },
    /** 编辑回答 按钮 */
    editAnswer(row) {
      row.edit = true;
      console.log(row)
    },
    /** 提交回答 按钮 */
    answer(row) {
      const { replyToAuthorId, id: parentId, answerContent } = row;
      const { id: authorId } = this.$store.state.user.userInfo.principal;
      const data = {
        content: answerContent,   //评论内容
        authorId,                 //回复人ID
        replyToAuthorId,          //回复谁的ID
        parentId,                 //评论id
      };
      themeManage.addComment(data, this.dialog_edit.id).then(res => {
        this.$message.success('已回复');
        row.edit = false;
      })
    }

  }
};
</script>

<style lang='scss' scoped>
.width-fill {
  width: 100%;
}
.buttom-group {
  padding: 20px 30px 20px 0;
  div,
  > button {
    margin-left: 10px;
  }
}
</style>
