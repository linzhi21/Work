<template>
  <el-drawer title="搜索" :visible.sync="isShow" :direction="direction" :before-close="handleClose">
    <div class="drawer-content">
      <el-form
        class="tpms-search"
        ref="form"
        inline
        :label-width="$attrs['label-width']||'70px'"
        label-position="left"
        v-bind="$attrs"
        size="mini"
      >
        <el-form-item v-for="(item,index) in formData" :key="index" v-bind="item">
          <slot class="item" :name="item.slotName" :row="item">
            <el-select
              class="item"
              v-if="item.type==='checkbox'||item.type==='radio'"
              v-model="item.value"
              :multiple="item.type==='checkbox'"
              collapse-tags
              :placeholder="item.placeholder"
            >
              <div v-if="item.groups">
                <el-option-group v-show="item.groups" v-for="(group,i) in item.groups" :key="i">
                  <el-option
                    v-for="option in group.checkList"
                    :key="option.id"
                    :label="option.label"
                    :value="option.id"
                  ></el-option>
                </el-option-group>
              </div>
              <div v-else>
                <el-option
                  v-for="option in item.checkList"
                  :key="option.id"
                  :label="option.label"
                  :value="option.id"
                ></el-option>
              </div>
            </el-select>
            <el-date-picker
              class="item"
              v-else-if="item.type==='timeFrame'"
              v-model="item.value"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-input
              v-else
              class="item"
              :placeholder="item.placeholder?item.placeholder:''"
              v-model="item.value"
            />
          </slot>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button size="small" @click="clear()">重置</el-button>
        <el-button type="primary" size="small" @click="inquireTableData()">查询</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
export default {
  props: {
    drawer: Boolean,
    formData: {
      type: Array,
      default: () => []
    },
    Btnoffset: {}
  },
  data() {
    return {
      isShow: this.drawer,
      direction: "rtl"
    };
  },
  computed: {
    drawerPropsData() {
      return this.drawer
    }
  },
  methods: {
    handleClose(done) {
      done();
      // this.$confirm("确认关闭？")
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    /** 1.点击查询按钮；2.通知父组件查询数据 */
    inquireTableData() {
      this.$emit("inquireTableData");
    },
    /**
     * 父组件调用获取头部搜索组数据
     * TODO: 父组件在mounted阶段才能调用
     */
    getData() {
      let data = {};
      this.formData.map(item => {
        if (Array.isArray(item.value)) {
          data[item.props] = item.value.join(",");
        } else {
          data[item.props] = item.value;
        }
      });
      return data;
    },
    /** 清空还原数据 */
    clear(target = this.formData) {
      if (Array.isArray(target)) {
        target.forEach(item => (item.value = ""));
      } else {
        for (let key in target) {
          target[key] = "";
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.drawer-content {
  display: flex;
  padding: 20px;
  flex-direction: column;
  height: 100%;
  form {
    flex: 1;
  }
}
.drawer-footer {
  display: flex;
  button {
    flex: 1;
  }
}
</style>