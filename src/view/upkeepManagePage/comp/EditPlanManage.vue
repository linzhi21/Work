<template>
  <div v-loading="loading">
    <el-row>
      <el-col :span="4">
        <div class="scroll">
          <el-tree :data="dataTree" node-key="id" @node-click="handleNodeClick">
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20">
        <el-row style="background: #f5f5f5; padding: 0.2rem">
          <el-col :span="11">
            <el-form-item label="设备编号">
              <el-input
                v-model="maintainContentColonies[nodeKey].deviceNos"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2" required="required">
            <el-form-item label="设备(生产线)名称">
              <el-input
                v-model="maintainContentColonies[nodeKey].deviceNames"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="版本" required="required">
              <el-input
                v-model="maintainContentColonies[nodeKey].version"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="2">
            <el-form-item label="编制人" required="required">
              <el-input
                readonly
                v-model="maintainContentColonies[nodeKey].creatorName"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="2">
            <el-form-item label="编制日期" required="required">
              <el-input
                readonly
                v-model="maintainContentColonies[nodeKey].createDate"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图示">
              <!-- 20230103 图片拖拽排序 -->
              <!-- 使用element-ui自带样式 -->
              <ul class="el-upload-list el-upload-list--picture-card">
                <draggable
                  v-model="
                    maintainContentColonies[nodeKey].maintainPlanPictures
                  "
                >
                  <li
                    v-for="(img, index) in maintainContentColonies[nodeKey]
                      .maintainPlanPictures"
                    :key="img.accessoryId"
                    class="el-upload-list__item is-success animated"
                  >
                    <img
                      :src="img.url"
                      alt=""
                      class="el-upload-list__item-thumbnail"
                    />
                    <i class="el-icon-close"></i>
                    <span class="el-upload-list__item-actions">
                      <!-- 预览 -->
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreviewFileDetail(img)"
                      >
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <!-- 删除 -->
                      <span
                        class="el-upload-list__item-delete"
                        @click="
                          handleRemoveFileDetail(
                            index,
                            maintainContentColonies[nodeKey]
                              .maintainPlanPictures
                          )
                        "
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </li>
                </draggable>
              </ul>
              <!-- :file-list="maintainContentColonies[nodeKey].maintainPlanPictures || []" -->
              <el-upload
                class="avatar-uploader"
                list-type="picture-card"
                multiple
                :show-file-list="false"
                :action="uploadImgUrl"
                :headers="uploadHeaders"
                accept=".jpg, .png, .jpeg"
                :on-error="(res, file) => handleAvatarError(res, file, item)"
                :on-success="
                  (res, file) => handleAvatarSuccess(res, file, item)
                "
                :on-remove="
                  (file, fileList) => handleRemove(file, fileList, item)
                "
                :before-upload="beforeAvatarUpload"
              >
                <el-button size="small" type="file">点击上传图示</el-button>
              </el-upload>
              <!-- 预览弹出层 -->
              <el-dialog
                :visible.sync="dialogVisibleDetail"
                :append-to-body="true"
              >
                <img width="100%" :src="dialogImageDetailUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-col>
          <!-- 表格区 -->
          <el-table
            :data="maintainContentColonies[nodeKey].maintainPlanContents"
            style="width: 100%"
            border
            :row-key="rowKeyFun"
            default-expand-all
            :tree-props="{
              children: 'childmaintainPlanContents',
              hasChildren: 'hasChildren',
            }"
          >
            <el-table-column
              align="center"
              type="index"
              label="项目"
              width="50"
            ></el-table-column>
            <el-table-column align="center" label="保养部件" width="100">
              <template slot-scope="scope">
                <el-input
                  v-show="scope.row.editShow"
                  v-model="scope.row.executionPart"
                ></el-input>
                <span
                  v-show="!scope.row.editShow"
                  :style="{
                    'text-decoration':
                      scope.row.deleted === true ? 'line-through' : '',
                  }"
                  >{{ scope.row.executionPart }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="保养位置" width="100">
              <template slot-scope="scope">
                <el-input
                  v-show="scope.row.editShow"
                  v-model="scope.row.executionNode"
                ></el-input>
                <span
                  v-show="!scope.row.editShow"
                  :style="{
                    'text-decoration':
                      scope.row.deleted === true ? 'line-through' : '',
                  }"
                  >{{ scope.row.executionNode }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="内容">
              <template slot-scope="scope">
                <el-input
                  v-show="scope.row.editShow"
                  v-model="scope.row.content"
                ></el-input>
                <span
                  v-show="!scope.row.editShow"
                  :style="{
                    'text-decoration':
                      scope.row.deleted === true ? 'line-through' : '',
                  }"
                  >{{ scope.row.content }}</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="周期" width="110">
              <template slot-scope="scope">
                <span v-if="!scope.row.editShow">{{
                  scope.row.cycleName
                }}</span>
                <el-select
                  v-model="scope.row.cycleName"
                  style="width: 100%"
                  v-if="scope.row.editShow"
                >
                  <el-option
                    v-for="(item, index) in cycleList"
                    :key="index"
                    :label="maintainContentColonies[nodeKey].label"
                    :value="maintainContentColonies[nodeKey].id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="顺序" width="110">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.sort"
                  style="width: 100%"
                  :disabled="!scope.row.editShow"
                >
                  <el-option
                    v-for="itemSort in maintainContentColonies[nodeKey]
                      .maintainPlanContents.length"
                    :key="itemSort"
                    :label="itemSort"
                    :value="itemSort"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              width="225"
              label="操作"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button size="small" @click="scope.row.editShow = true"
                  >编辑</el-button
                >
                <el-button
                  size="small"
                  type="primary"
                  @click="(scope.row.editShow = false), saveRow(scope.row)"
                  >保存</el-button
                >
                <el-button
                  size="small"
                  type="danger"
                  @click.native.prevent="
                    (scope.row.deleted = true),
                      deleteRow(
                        scope.$index,
                        maintainContentColonies[nodeKey].maintainPlanContents
                      ),
                      calcTime(item)
                  "
                  :disabled="scope.row.deleted"
                  style="margin-right: 10px"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import draggable from "vuedraggable"; // 引入插件
import { setHeadToken } from "@/utils";
import apiConfig from "../../../lib/api/apiConfig";

export default {
  name: "EditPlanManage",
  props: ["form", "cycleList"],
  components: {
    draggable,
  },
  created() {
    JSON.parse(localStorage.getItem("user_info")).principal.workshopId === 4
      ? (this.isShow = true)
      : (this.isShow = false);
  },
  data() {
    return {
      loading: true,
      maintainContentColonies: this.form.maintainContentColonies, // 计划内容对象
      dataTree: [],
      nodeKey: 0,

      apiConfig,
      uploadImgUrl: apiConfig.uploadAccessory + "/128",
      uploadHeaders: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },

      dialogImageDetailUrl: "",
      dialogVisibleDetail: false,
    };
  },
  watch: {
    form() {
      this.maintainContentColonies = this.form.maintainContentColonies;
      const contentColonies = this.form.maintainContentColonies;
      let ary = [];
      contentColonies.forEach((element, index) => {
        ary.push({
          id: element.id,
          label: element.deviceNames,
          deviceNames: element.deviceNames,
          index: index,
        });
      });
      this.dataTree = ary;
      this.loading = false;
    },
  },
  methods: {
    /**
     * 点击树显示数据
     */
    handleNodeClick(nodeObj, node, self) {
      this.loading = true;
      this.nodeKey = nodeObj.index;
      this.loading = false;
    },
    saveRow(row) {},
    getPlanData() {
      const validate = this.maintainContentColonies.some(
        ({ maintainPlanContents }) => {
          const arr = maintainPlanContents.map(({ sort }) => sort);
          return new Set(arr).size !== arr.length;
        }
      );
      if (validate) {
        this.$message.warning("工作内容顺序重复，请修改");
        return;
      }
      const validateDevices = this.maintainContentColonies.filter((item) => {
        const validateee = item.maintainPlanContents.filter((itemm) => {
          if (!itemm.executionNode) return true;
          if (!itemm.content) return true;
          if (!itemm.executionPart) return true;
          // if(!itemm.cycleId) return true;
          return false;
        });
        if (validateee.length) {
          this.$message.warning("缺少必填项!");
          return true;
        }
        return false;
      });
      if (validateDevices.length) {
        return;
      }
      delete this.form.status;
      console.log(JSON.stringify(this.form));
      this.form.maintainContentColonies = this.maintainContentColonies;
      return this.form;
    },

    rowKeyFun(row) {
      debugger;
      return row.id;
    },
    // zyl20230103 放大预览图片
    handlePictureCardPreviewFileDetail(file) {
      this.dialogImageDetailUrl = file.url;
      this.dialogVisibleDetail = true;
    },
    // zyl20230103 删除图片
    handleRemoveFileDetail(index, maintainPlanPictures) {
      maintainPlanPictures.splice(index, 1);
    },
    handleAvatarError() {},
    handleAvatarSuccess() {},
    handleRemove() {},
    // 图片上传之前
    beforeAvatarUpload(file) {
      setHeadToken(this.uploadHeaders);
      // console.log(file);
      const isLt10M = file.size / 1024 / 1024 < 10;

      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "png";
      const extension2 = testmsg === "jpeg";
      const extension3 = testmsg === "jpg";

      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: "上传文件只能是 png、jpeg、jpg格式的文件",
          type: "warning",
        });
      }

      if (!isLt10M) {
        this.$message.error("上传头像图片大小不能超过 10M!");
      }
      return (extension || extension2 || extension3) && isLt10M;
    },
  },
};
</script>

<style>
.scroll {
  width: 100%;
  height: auto;
  overflow-x: scroll;
}

.is-current {
  background-color: #f5f5f5;
}
</style>