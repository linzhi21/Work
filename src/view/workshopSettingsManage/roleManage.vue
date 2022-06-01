  // 角色管理
  <template>
  <div>
    <!-- 头部功能区 -->
    <el-row>
      <tpms-header
        ref="tpmsHeader"
        :formData="searchFormList"
        @inquireTableData="inquireTableData"
      />
    </el-row>
    <el-row class="buttom-group" type="flex" justify="end" align="middle">
      <el-button
        v-if="userInfo.includes('ROLE_EXPORT')"
        @click="exportRole"
        class="border-none"
        size="small"
        >导出角色</el-button
      >
      <el-button
        v-if="userInfo.includes('ROLE_ADD')"
        class="button-more"
        type="primary"
        size="small"
        @click="addDialog()"
        >新增</el-button
      >
    </el-row>
    <el-row>
      <!-- 底部表格 -->
      <tpms-table
        ref="tpmsTable"
        :total="total"
        :data="tableLists"
        :columns="tableHeaderList"
        :column_index="true"
        @inquireTableData="inquireTableData"
        @getTableData="getTableData"
      >
        <template
          v-if="userInfo.includes('ROLE_EDIT')"
          slot="operation"
          slot-scope="{ row }"
        >
          <span class="button cursor" @click="editDialog(row)">编辑</span>
        </template>
      </tpms-table>
    </el-row>

    <el-dialog
      :title="dialogTitleTxt"
      :visible.sync="dialogVisible"
      :before-close="dialogClose"
    >
      <el-form
        :model="form"
        size="small"
        label-width="100px"
        label-position="right"
      >
        <el-row>
          <el-col
            :span="item.span"
            v-for="(item, index) in formList"
            :key="index"
          >
            <el-form-item
              :label="item.label"
              :label-width="item.labelWidth"
              style="width: 100%"
            >
              <el-select
                v-model="form[item.props]"
                v-if="item.type === 'checkbox'"
                :placeholder="item.placeholder"
                style="width: 100%"
                clearable
                @change="(val) => selectChange(item, val)"
              >
                <el-option
                  v-for="(item, i) in item.checkList"
                  :key="i"
                  :label="item.key"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-autocomplete
                class="inline-input"
                v-model="form[item.props]"
                :fetch-suggestions="autocompleteSearch"
                v-else-if="item.type === 'autocomplete'"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="autocompleteSelect"
              ></el-autocomplete>
              <el-input
                v-model="form[item.props]"
                v-else-if="item.type === 'textarea'"
                :rows="item.rows"
                :type="item.type"
              />
              <el-radio
                v-model="form[item.props]"
                v-else-if="item.type === 'radio'"
                :label="radio.id"
                v-for="(radio, i) in item.radioList"
                :key="i"
                >{{ radio.label }}</el-radio
              >
              <!-- <el-radio-group v-else-if="item.type==='radio'" v-model="form[item.props]">
                  <el-radio v-for="(radio,i) in item.radioList" :label="radio.id" :key="i">{{radio.label}}</el-radio>
                </el-radio-group>-->

              <el-tree
                style="top: 8px"
                ref="tree"
                :data="treeData"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                v-else-if="item.type === 'tree'"
                @click="setCheckedNodes"
              ></el-tree>

              <!-- <el-table
                  :data="treeData"
                  v-else-if="item.type === 'tree'"
                  style="width: 400px"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column type="index" label="NO."  width="50"> </el-table-column>
                  <el-table-column prop="name" label="权限管理" width="180">
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button
                        @click="handleClick(scope.row)"
                        type="text"
                        size="small"
                        >查看子权限</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table> -->

              <el-input v-model="form[item.props]" v-else />
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
import axios from "axios";
import { tpmsHeader, tpmsTable } from "../../components";
import {
  workshopManage,
  factoryManage,
  roleManage,
  authManage,
} from "../../lib/api/workshopSettingsManage";
import { deepClone } from "../../utils";
import apiConfig from "../../lib/api/apiConfig";
export default {
  data() {
    const userInfoLocal = localStorage.getItem("user_info");
    return {
      userInfo: userInfoLocal,
      dialogVisible: false,
      dialogTitleTxt: "",
      dialogType: "",
      total: 0,
      load: "lazyLoad",
      rowKey: "id",
      lazy: "lazy",
      parentId: null,
      tableLists: [],
      treeData: [],
      defaultProps: {
        children: "menu",
        label: "name",
      },
      searchFormList: [
        //  渲染头部功能区的列表
        {
          label: "所属工厂",
          props: "factoryId",
          value: "",
          placeholder: "",
          type: "radio",
          checkList: [],
        },
        {
          label: "所属车间",
          props: "workshopId",
          value: "",
          placeholder: "",
          type: "radio",
          checkList: [],
        },
        {
          label: "角色名称",
          props: "name",
          value: "",
          placeholder: "",
          type: "input",
          checkList: [],
        },
        {
          label: "状态",
          props: "enabled",
          value: "",
          placeholder: "请选择状态",
          type: "radio",
          checkList: [
            {
              label: "启用",
              id: true,
            },
            {
              label: "禁用",
              id: false,
            },
          ],
        },
      ],
      tableHeaderList: [
        {
          props: "code",
          label: "角色编号",
        },
        {
          props: "name",
          label: "角色名称",
        },
        {
          props: "enabled",
          label: "状态",
          translate: (value) => (value ? "启用" : "禁用"),
        },
        {
          label: "操作",
          slotName: "operation",
          fixed: "right",
          width: "100px",
        },
      ],
      form: {
        factoryId: "",
        workshopId: "",
        code: "",
        name: "",
        enabled: true,
        description: "",
        authorities: null,
      },
      formList: [
        {
          label: "所属工厂",
          props: "factoryId",
          value: "",
          placeholder: "",
          type: "checkbox",
          span: 24,
          checkList: [],
        },
        {
          label: "所属车间",
          props: "workshopId",
          value: "",
          placeholder: "",
          type: "checkbox",
          span: 24,
          checkList: [],
        },
        {
          props: "name",
          label: "角色名称",
          span: 12,
          type: "input",
        },
        {
          props: "code",
          label: "角色编号",
          span: 12,
          type: "input",
        },
        {
          props: "description",
          label: "角色描述",
          span: 24,
          type: "textarea",
        },
        {
          props: "enabled",
          label: "角色状态",
          span: 24,
          type: "radio",
          radioList: [
            {
              label: "启用",
              id: true,
            },
            {
              label: "禁用",
              id: false,
            },
          ],
        },
        {
          props: "authorities",
          label: "角色数据权限",
          span: 24,
          type: "tree",
        },
      ],
    };
  },
  components: {
    tpmsHeader,
    tpmsTable,
  },
  mounted() {
    this.getTableData();
    this.loadChildren();
    factoryManage["getLists"]().then((res) => {
      const factory = res.data.content;
      let factoryList = [];
      factory.forEach((res) => {
        factoryList.push({
          id: res.id,
          label: res.name,
          key: res.name,
          value: res.id,
        });
      });
      this.searchFormList[0].checkList = factoryList;
      this.formList[0].checkList = factoryList;
    });
    this.workshopManage();
  },
  methods: {
    setCheckedNodes() {
      console.log(11);
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
      roleManage["getLists"]({ ...data, ...pageData }).then((res) => {
        this.tableLists = res.data.content;
        this.total = res.data.totalElements;
      });
    },
    // 选中表格列表
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击子权限展示
    handleClick(row) {
      console.log(row);
    },
    loadChildren() {
      authManage["getTree"]().then((res) => {
        this.treeData = res.data;
        console.log(this.treeData);
      });
    },
    addDialog() {
      this.dialogVisible = true;
      this.workshopManage();
      this.dialogTitleTxt = "新增";
      this.dialogType = "add";
      if (this.$refs.tree) {
        this.$refs.tree[0].setCheckedKeys([]);
      }
      this.form = {};
    },
    dialogClose() {
      this.dialogVisible = false;
      if (this.$refs.tree) {
        this.$refs.tree[0].setCheckedKeys([]);
      }
      this.form = {
        factoryId: "",
        workshopId: "",
        code: "",
        name: "",
        enabled: true,
        description: "",
        authorities: null,
      };
    },
    editDialog({ id }) {
      this.dialogVisible = true;
      this.workshopManage();
      this.dialogTitleTxt = "编辑";
      this.dialogType = "edit";
      roleManage.getOne(null, id).then((res) => {
        this.form = res.data;
        console.log(res.data);

        const arr = res.data.authorities;
        let arr1 = []

        // 获取第三层叶子节点
        function getLeaf(arr) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].parent != null) {
              if(arr[i].parent.parent != null) {
                arr1.push(arr[i].id)
              }
            }
          }
        }
        getLeaf(arr)
        // for (let i = 0; i < authoritiesNode.length; i++) {
        //   if (authoritiesNode.parent == null) {
        //     return;
        //   } else {
        //     for (let i = 0; i < authoritiesNode.length; i++) {
        //       if (authoritiesNode.parent.parent == null) {
        //         return;
        //       } else {
        //         this.form.authorities.map((item) => item.id);
        //       }
        //     }
        //   }
        // }
        // console.log(this.form.authorities.map((item) => item.id));
        console.log(arr1)
        this.$refs.tree[0].setCheckedKeys(
          arr1
        );
      });
    },
    selectChange({ props }, id) {
      if (props === "factoryId") {
        this.form.workshopId = "";
        workshopManage["getNames"]({ factoryId: id }).then((res) => {
          const data = res.data;

          data.forEach((item) => {
            item.key = item.label;
            item.value = item.id;
          });
          this.formList[1].checkList = res.data;
        });
      }
    },
    ok(dialogType) {
      const tree_dom = this.$refs.tree[0];
      const checkedKeys = tree_dom.getCheckedKeys();
      const halfCheckedKeys = tree_dom.getHalfCheckedKeys();
      this.form.authorityIds = [...halfCheckedKeys, ...checkedKeys];
      roleManage[dialogType](this.form, this.form.id).then((res) => {
        this.dialogVisible = false;
        this.getTableData();
        this.form = {
          factoryId: "",
          workshopId: "",
          code: "",
          name: "",
          enabled: true,
          description: "",
          authorities: [],
          authorityIds: [],
        };
      });
    },
    autocompleteSearch(queryString, cb) {
      var restaurants = this.formList[1].checkList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.key.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    autocompleteSelect(item) {
      console.log(item);
    },
    workshopManage() {
      workshopManage["getNames"]({ factoryId: this.form.factoryId }).then(
        (res) => {
          const data = res.data;

          data.forEach((item) => {
            item.key = item.label;
            item.value = item.id;
          });

          this.searchFormList[1].checkList = data;
          this.formList[1].checkList = data;
        }
      );
    },
    /**
     * 角色导出
     */
    exportRole() {
      let url = `${apiConfig.roleManage}/export`; //请求下载文件的地址
      let token = localStorage.getItem("access_token"); //获取token
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (!res) return;

          let fileName = "角色清单.xlsx";
          const disposition = res.headers["content-disposition"];
          if (disposition) {
            const name = disposition.split(";")[1].split("filename=")[1];
            fileName = decodeURI(name);
          }

          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", fileName); // 下载的文件
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
  },
};
</script>

  <style>
.add-drawer {
  margin-top: 0.8rem;
}
</style>
