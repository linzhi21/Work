// 周期管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref='tpmsHeader' :formData='searchFormList' @inquireTableData='inquireTableData' />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button class="button-more" type="primary" size="small" style="margin-right:45px">导出</el-button>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table ref='tpmsTable' :total='total' :data='tableLists' :columns='tableHeaderList' :column_index='false'
        @inquireTableData='inquireTableData' @getTableData='getTableData'>
        <template slot-scope="{row}">
          <span class="button" @click="editDialog(row)">查看</span>
        </template>
      </tpms-table>
    </el-row>
    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible" :before-close='dialogClose'>
      <el-form :model="form" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item :label="item.label" :label-width="item.labelWidth" style="width: 100%;">
              <el-select v-model="form[item.props]" v-if="item.type==='checkbox'" :placeholder="item.placeholder">
                <el-option v-for="(item,i) in item.checkList" :key="i" :label="item.key" :value="item.value"></el-option>
              </el-select>
              <el-input v-model="form[item.props]" v-else-if="item.type==='textarea'" :rows='item.rows' :type='item.type' />
              <el-radio v-model="form[item.props]" v-else-if="item.type==='radio'" :label='radio.id' v-for="(radio,i) in item.radioList"
                :key="i">
                {{radio.label}}
              </el-radio>

              <el-tree style="top: 8px;" :data="item.treedata" show-checkbox node-key="id" v-else-if="item.type==='tree'">
              </el-tree>

              <el-input v-model="form[item.props]" v-else />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    tpmsHeader,
    tpmsTable
  } from '../../components';
  import {
    handoverManage
  } from "../../lib/api/workshopSettingsManage";
  export default {
    data() {
      return {
        dialogVisible: false,
        dialogTitleTxt: '',
        dialogType: '',
        total: 0,
        load: 'lazyLoad',
        rowKey: "id",
        lazy: 'lazy',
        parentId: null,
        tableLists: [],
        searchFormList: [
          //  渲染头部功能区的列表
          {
            label: "状态",
            props: "enable",
            value: "",
            placeholder: '请选择状态',
            type: 'radio',
            checkList: [{
              label: '启用',
              id: true
            }, {
              label: '禁用',
              id: false
            }]
          },
        ],
        tableHeaderList:[{
            props: 'id',
            label: 'No.'
          },
          {
            props: 'createDate',
            label: '日期'
          },{
            props: 'workshopShiftName',
            label: '班次'
          },
          {
            props: 'fromUserName',
            label: '交接人员'
          },
          {
            props: 'content',
            label: '交接内容'
          },
          {
            props: 'toUserName',
            label: '接班人员'
          },
          {
            props: 'type',
            label: '检查类型',
            translate: (value) => value==1 ? '点检' : '巡检'
          },
          {
            props: 'result',
            label: '检查情况',
            translate: (value) => value ? '正常' : '异常'
          },
        ],
        form: {
          content: '',
          createDate: '',
          fromId:null,
          fromUserName:'',
          result:null,
          toUserName:null,
          type:true,
          workshopShiftName: true,
          result:null,
        },

        formList: [{
            props: 'name',
            label: '周期名称',
            span: 24,
            type: 'input'
          },
          {
            props: 'description',
            label: '周期描述',
            span: 24,
            type: 'textarea'
          },
          {
            props: 'type',
            label: '周期类型',
            span: 24,
            type: 'radio',
            radioList: [{
                label: '按频率',
                id: 1
              }, {
                label: '按日期',
                id: 2
              },
              {
                label: '按星期',
                id: 3
              }
            ]
          },
          {
            props: 'interval',
            label: '间隔',
            span: 24,
            type: 'input'
          },
          {
            props: 'hz',
            label: '频率',
            span: 24,
            type: 'checkbox',
            checkList: [{
              key: '日',
              value: 1
            },
            {
              key: '周',
              value: 2
            },
            {
              key: '月',
              value: 4
            },
            {
              key: '年',
              value: 8
            },{
              key: '班次',
              value: 16
            }]
          },
          {
            props: 'isShift',
            label: '是否按班次',
            span: 24,
            type: 'radio',
            radioList: [{
              label: '是',
              id: true
            }, {
              label: '否',
              id: false
            }]
          },
          {
            props: 'enable',
            label: '周期状态',
            span: 24,
            type: 'radio',
            radioList: [{
              label: '启用',
              id: true
            }, {
              label: '禁用',
              id: false
            }]
          }
        ]
      }
    },
    components: {
      tpmsHeader,
      tpmsTable
    },
    mounted() {
      this.getTableData()

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
        handoverManage['getLists']({ ...data,
          ...pageData
        }).then(res => {
          this.tableLists = res.data.content
          this.total=res.data.totalElements
          console.log(res)
        })
      },
      addDialog() {
        this.dialogVisible = true
        this.dialogTitleTxt = '新增'
        this.dialogType = 'add'
      },
      dialogClose() {
        this.dialogVisible = false
      },
      editDialog(row){
        handoverManage['getOne']('',row.id).then(res => {
          this.form=res.data
          this.dialogVisible = true
          this.dialogTitleTxt = '查看'
          this.dialogType='edit'
          this.form.workshopId-=0
          console.log(this.form)
        })
      },
      ok(dialogType) {
        var _self = this
        cycleManage[dialogType](this.form, this.form.id).then(res => {
          this.dialogVisible = false
          this.getTableData();
          this.form = {
          name: '',
          description: '',
          type:null,
          day:'',
          hz:null,
          interval:null,
          isShift:true,
          enable: true,
          shiftId:null,
          week:null,
          workshopId:null,
        }
        })
      }

    }
  };
</script>

<style>
  .add-drawer {
    margin-top: 0.8rem;
  }
</style>
