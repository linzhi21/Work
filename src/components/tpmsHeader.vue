//
<template>
  <el-row>
    <el-form  class="tpms-header" ref="form" inline :label-width="$attrs['label-width']||'70px'" label-position="left" v-bind="$attrs">
      <!-- <el-col :span="8" v-for="(item,index) in formData" :key="index"> -->
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
                <el-option-group
                  v-show="item.groups"
                  v-for="(group,i) in item.groups"
                  :key='i'
                >
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
            <el-input v-else class="item" :placeholder="item.placeholder?item.placeholder:''" v-model="item.value" />
          </slot>
        </el-form-item>
      <!-- </el-col>-->
      <el-col v-if="formData.length%3===0" :span="8" />
        <el-form-item label=" ">
          <el-row class="padding-none" type="flex" justify="end" style="width:3.3rem;">
            <el-button size="small" @click="clear()">
              <!-- <i class="el-icon-edit"></i> -->
              重置
            </el-button>
            <el-button type="info" size="small" @click="inquireTableData()">
              <!-- <i class="el-icon-edit"></i> -->
              查询
            </el-button>
          </el-row>
        </el-form-item>
    </el-form>
  </el-row>
</template>
<script>
//
export default {
  data() {
    return {
      // formData:{
      // }
    };
  },
  props: {
    formData: {
      type: Array,
      default: () => []
    },
    Btnoffset:{
      
    }
  },
  methods: {
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
.tpms-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background: #f8f9f8;
  padding: 22px 20px 0px;
  border-radius: 18px;
  .item {
    width: 3.3rem;
  }
}
</style>
