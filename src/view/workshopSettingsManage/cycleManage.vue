// 周期管理
<template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header ref='tpmsHeader' :formData='searchFormList' @inquireTableData='inquireTableData' />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button class="button-more" type="primary" size="small" style="margin-right:45px" @click='addDialog()'>新增
      </el-button>
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table ref='tpmsTable' :total='total' :data='tableLists' :columns='tableHeaderList' :column_index='true'
        @inquireTableData='inquireTableData' @getTableData='getTableData'>
        <template slot="operation" slot-scope="{row}">
          <span class="button cursor" @click="editDialog(row)">编辑</span>
          <span class="button cursor" @click="del(row)">删除</span>
        </template>
      </tpms-table>
    </el-row>
    <el-dialog :title="dialogTitleTxt" :visible.sync="dialogVisible" :before-close='dialogClose'>
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px" label-position="right">
        <el-row>
          <!-- <el-col :span="item.span" v-for="(item,index) in formList" :key="index">
            <el-form-item :prop="item.props" v-show="item.isshow?typeNum==item.typeNum:true" :label="item.label"
              :label-width="item.labelWidth" style="width: 100%;">
              <el-select v-model="form[item.props]" v-if="item.type==='checkbox'" :placeholder="item.placeholder"
                :multiple="item.multiple">
                <el-option v-for="(item,i) in item.checkList" :key="i" :label="item.key" :value="item.value"></el-option>
              </el-select>
              <el-input v-model="form[item.props]" v-else-if="item.type==='textarea'" :rows='item.rows' :type='item.type' />
              <el-radio @change='item.change?item.change(radio.id):""' v-model="form[item.props]" v-else-if="item.type==='radio'"
                :label='radio.id' v-for="(radio,i) in item.radioList" :key="i">
                {{radio.label}}
              </el-radio>

              <el-tree style="top: 8px;" :data="item.treedata" show-checkbox node-key="id" v-else-if="item.type==='tree'">
              </el-tree>

              <el-date-picker format="MM-dd" v-model="form[item.props]" placeholder="选中一个时间或多个时间" v-else-if="item.type==='dates'"
                :type='item.type'></el-date-picker>
              <el-input v-model="form[item.props]" v-else />
            </el-form-item>
          </el-col>

          表单 -->
          <el-col>
            <el-form-item label='周期名称'>
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label='周期描述'>
              <el-input v-model="form.description" />
            </el-form-item>
            <el-form-item label='所属车间'>
              <el-select @change='onChange' style="width: 100%;" v-model='form.workshopId' placeholder="请选择">
                <el-option v-for="item in workshopLists" :key="item.value" :label="item.key" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='所属模块'>
              <el-select @change='onChange' style="width: 100%;" v-model='form.module' placeholder="请选择">
                <el-option v-for="item in [
                  { label: '点检', id: 1 },
                  { label: '日常保养', id: 2 },
                  { label: '巡检', id: 3 },
                  { label: '保养', id: 4 }
                ]" :key="item.id" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='周期类型'>
              <el-radio-group v-model="form.type">
                <el-radio :label="1">按频率</el-radio>
                <el-radio :label="2">按日期</el-radio>
                <el-radio :label="3">按星期</el-radio>
                <el-radio :label="4">按班次</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label='频率' v-show='form.type == 1'>
              <el-select style="width: 100%;" v-model='form.hz' placeholder="请选择">
                <el-option v-for="item in hz" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='按日期' v-show='form.type == 2'>
              <el-date-picker style="width: 100%;" format="MM-dd" type="dates" v-model="form.day"
                placeholder="选择一个或多个日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label='按周期' v-show='form.type == 2'>
              <el-input v-model="form.whatWeeks" placeholder="输入第几周，多个周用英文逗号隔开，例: kw10,kw20" />

              <!-- <el-date-picker style="width: 100%;" format="第 WW 周" type="week" v-model="form.whatWeeks"
                placeholder="选择一周或多个周">
              </el-date-picker> -->
            </el-form-item>
            <el-form-item label='按星期' v-show='form.type == 3'>
              <el-select style="width: 100%;" v-model='form.week' multiple placeholder="请选择">
                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='班次' v-show='form.type == 4'>
              <el-select style="width: 100%;" v-model='form.shiftId' multiple placeholder="请选择">
                <el-option v-for="item in ShiftLists" :key="item.value" :label="item.key" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='是否班次'>
              <el-radio-group v-model="form.isShift">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label='周期状态'>
              <el-radio-group v-model="form.enable">
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">禁用</el-radio>
              </el-radio-group>
            </el-form-item>


          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok(dialogType)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  tpmsHeader,
  tpmsTable
} from '../../components';
import {
  cycleManage,
  workshopManage,
  workshopShiftManage
} from "../../lib/api/workshopSettingsManage";
import {
  getWeek
} from '../../utils/index.js';
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
      typeNum: 1,
      searchFormList: [
        //  渲染头部功能区的列表
        {
          label: "周期名称",
          props: "name",
          value: "",
          placeholder: '',
          type: 'input',
        },

        {
          label: "周期类型",
          props: "type",
          value: "",
          placeholder: '',
          type: 'radio',
          checkList: [{
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
          ],
        },
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
      tableHeaderList: [{
        props: 'name',
        label: '周期名称'
      },
      {
        props: 'workshopName',
        label: '车间名称'
      },
      {
        props: 'module',
        label: '所属模块',
      },
      {
        props: 'type',
        label: '周期类型',
        translate: (value) => {
          switch (value) {
            case 1:
              return '按频率'
              break;
            case 2:
              return '按日期'
              break;
            case 3:
              return '按星期'
              break;
            case 4:
              return '按班次'
              break;
          }
        }
      },
      {
        props: 'description',
        label: '周期描述'
      },
      {
        props: 'enable',
        label: '状态',
        translate: (value) => value ? '启用' : '禁用'
      },
      {
        label: "操作",
        slotName: "operation",
        fixed: "right",
        width: "200px",
      }
      ],
      form: {
        name: '',
        description: '',
        type: null,
        day: [],
        hz: null,
        interval: null,
        isShift: true,
        enable: true,
        shiftId: [],
        week: [],
        workshopId: '',
        whatWeeks: ''
      },

      formList: [{
        props: 'name',
        label: '周期名称',
        span: 24,
        type: 'input',
      },
      {
        props: 'description',
        label: '周期描述',
        span: 24,
        type: 'textarea',
      },
      {
        props: 'type',
        label: '周期类型',
        span: 24,
        type: 'radio',
        radioList: [
          // {
          //   label: '按频率',
          //   id: 1
          // },
          {
            label: '按日期',
            id: 2
          },
          {
            label: '按星期',
            id: 3
          }
        ],
        change: (value) => {
          this.typeNum = value
        }
      },
      {
        props: 'interval',
        label: '间隔',
        span: 24,
        type: 'input',
        isshow: true,
        typeNum: 1,
      },
      // {
      //   props: 'hz',
      //   label: '频率',
      //   span: 24,
      //   type: 'checkbox',
      //   checkList: [{
      //     key: '日',
      //     value: 1
      //   },
      //   {
      //     key: '周',
      //     value: 2
      //   },
      //   {
      //     key: '月',
      //     value: 4
      //   },
      //   {
      //     key: '年',
      //     value: 8
      //   },{
      //     key: '班次',
      //     value: 16
      //   }],
      //   isshow:true,
      //   typeNum:1,
      // },
      {
        props: 'day',
        label: '日期',
        span: 24,
        type: 'dates',
        multiple: true,
        isshow: true,
        typeNum: 1,
      },
      {
        props: 'week',
        label: '星期',
        span: 24,
        type: 'week',
        multiple: true,
        // checkList: [{
        //   key: '星期一',
        //   value: 1
        // }, {
        //   key: '星期二',
        //   value: 2
        // }, {
        //   key: '星期三',
        //   value: 3
        // }, {
        //   key: '星期四',
        //   value: 4
        // }, {
        //   key: '星期五',
        //   value: 5
        // }, {
        //   key: '星期六',
        //   value: 6
        // }, {
        //   key: '星期日',
        //   value: 7
        // }],
        isshow: true,
        typeNum: 2,
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
        }],
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
        }],
      }
      ],
      rules: {
        name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        },],
        no: [{
          required: true,
          message: '请输入编号',
          trigger: 'blur'
        },],
        enable: [{
          required: true,
          message: '请选择状态',
          trigger: 'change'
        }],
        workshopId: [{
          required: true,
          message: '请选择所属车间',
          trigger: 'change'
        }],
        type: [{
          required: true,
          message: '请选择类型',
          trigger: 'change'
        }],
        // day: [{
        //   required: true,
        //   message: '请选择上级区域',
        //   trigger: 'change'
        // }],
        hz: [{
          required: true,
          message: '请选择频率',
          trigger: 'change'
        }],
        // week: [{
        //   required: true,
        //   message: '请选择上级区域',
        //   trigger: 'change'
        // }],
        interval: [{
          required: true,
          message: '请填写间隔',
          trigger: 'input'
        }],
        // shiftId: [{
        //   required: true,
        //   message: '请选择班次',
        //   trigger: 'change'
        // }]

      },
      workshopLists: [], //所属车间
      ShiftLists: [], //班次
      cycleType: 1,
      hz: [{
        label: '日',
        value: 1
      },
      {
        label: '周',
        value: 2
      },
      {
        label: '月',
        value: 4
      },
      {
        label: '年',
        value: 8
      },
        // {
        //   label: '班次',
        //   value: 16
        // }
      ],
      week: [{
        label: '星期一',
        value: 1
      },
      {
        label: '星期二',
        value: 2
      },
      {
        label: '星期三',
        value: 3
      },
      {
        label: '星期四',
        value: 4
      },
      {
        label: '星期五',
        value: 6
      },
      {
        label: '星期日',
        value: 7
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
    workshopManage['getLists']().then(res => {
      let workshopLists = [];
      res.data.content.forEach((val) => {
        workshopLists.push({
          key: val.name,
          value: val.id
        })
      })

      this.workshopLists = workshopLists;
      // console.log(this.workshopLists)
      // this.workshopLists=workshopLists
      // this.formList.unshift({
      //   props: 'workshopId',
      //   label: '所属车间',
      //   span: 24,
      //   type: 'checkbox',
      //   filterable: true,
      //   checkList: workshopLists
      // })
    })

  },
  methods: {
    onChange(e) {
      console.log(e)
      let option = { workshopId: e }
      workshopShiftManage['getLists'](option).then(res => {
        let ShiftLists = [];
        res.data.content.forEach((val) => {
          ShiftLists.push({
            key: val.name,
            value: val.id
          })
        })
        this.ShiftLists = ShiftLists;
        // this.workshopLists=workshopLists
        this.formList.push({
          props: 'shiftId',
          label: '班次',
          span: 24,
          type: 'checkbox',
          filterable: true,
          checkList: ShiftLists
        })
      })
    },
    /**删除**/
    del(row) {
      this.$confirm('确定是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cycleManage.remove(null, row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getTableData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
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
      cycleManage['getLists']({
        ...data,
        ...pageData
      }).then(res => {
        console.log(res)
        this.tableLists = res.data.content
        this.total = res.data.totalElements
      })
    },
    addDialog() {
      this.dialogVisible = true
      this.dialogTitleTxt = '新增'
      this.dialogType = 'add'
      this.form = {}
    },
    dialogClose() {
      this.dialogVisible = false
      this.typeNum = 1
      this.form = {
        name: '',
        description: '',
        type: null,
        day: [],
        hz: null,
        interval: null,
        isShift: true,
        enable: true,
        shiftId: [],
        week: [],
        workshopId: null,
      }
    },
    editDialog(row) {
      cycleManage['getOne']('', row.id).then(res => {

        this.form = res.data
        // console.log(this.form)
        this.dialogVisible = true
        this.dialogTitleTxt = '编辑'
        this.dialogType = 'edit'
        // this.form.workshopId -= 0
        this.typeNum = this.form.type
        if (this.form.week) {
          this.form.week = this.form.week.split(',').map((item) => {
            return +item;
          });
        }
        if (this.form.day) {
          this.form.day = this.form.day.split(',').map(item => {
            return item.substr(0, 5)
          })
        }
        if (this.form.shiftId) {
          this.form.shiftId = this.form.shiftId.split(',').map((item) => {
            return +item;
          });
        }
      })
    },
    ok(dialogType) {
      var _self = this
      console.log(this.form.day)
      let option = {};
      let day = [];
      let year = new Date().getFullYear();
      if (Array.isArray(this.form.day)) {
        for (var i = 0; i < this.form.day.length; i++) {
          let time = year + '-' + this.form.day[i];
          let week = getWeek(time);
          // day.push(`${this.form.day[i]} kw${week}`);
          day.push(`${this.form.day[i]}`)
        }
      }
      this.form.shiftId = Array.isArray(this.form.shiftId) ? this.form.shiftId : [];
      this.form.week = Array.isArray(this.form.week) ? this.form.week : [];
      option = {
        name: this.form.name,
        description: this.form.description,
        type: this.form.type,
        day: null || day.join(',') + ',' + this.form.whatWeeks,
        hz: this.form.hz,
        interval: 1,
        isShift: this.form.isShift,
        enable: this.form.enable,
        shiftId: this.form.shiftId.join(','),
        week: this.form.week.join(','),
        workshopId: this.form.workshopId,
        module: this.form.module
      }

      console.log(JSON.stringify(option))
      console.log(this.form)
      console.log(option)

      // return false;
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // if (this.form.week) {
          //   this.form.week = String(this.form.week)
          // }
          // if (this.form.day) {

          // }
          cycleManage[dialogType](option, this.form.id).then(res => {
            this.dialogVisible = false
            this.typeNum = 1;
            this.$message.success('操作成功')
            this.getTableData();
            this.form = {
              name: '',
              description: '',
              type: null,
              day: [],
              hz: null,
              interval: null,
              isShift: true,
              enable: true,
              shiftId: [],
              week: [],
              workshopId: null,
            }
          })
        } else {
          return false;
        }
      });

    }

  }
};
</script>

<style>
.add-drawer {
  margin-top: 0.8rem;
}
</style>
