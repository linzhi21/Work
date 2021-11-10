<template>
  <el-aside :width="isCollapse? '64px': '200px'" class="scrollbar">
    <!-- 头部logo -->
    <div @click="isCollapse=!isCollapse" class="logo">
      <h1>TPMS</h1>
      <span v-if="!isCollapse">设备管理系统</span>
    </div>

    <!-- 菜单导航栏 -->
    <el-menu :collapse="isCollapse" class="el-menu-vertical" active-text-color="#FFF">
      <!-- 一级菜单 -->
      <template v-for="(item,index) in $store.state.user.menus">
        <el-menu-item
          v-if="!item.children || item.children.length === 0"
          :key="index"
          :index="'/'+item.path"
          @click="jumpItem(item.path,item.menuItemName)"
        >
          <i :class="item.menuIcon"></i>
          <span slot="title">{{item.menuItemName}}</span>
        </el-menu-item>
        <el-submenu v-else :key="index" :index="'/'+item.path">
          <template
            slot="title"
            @click="jumpItem(child.path,item.menuItemName+'/'+child.menuItemName)"
          >
            <i :class="item.menuIcon"></i>
            <span slot="title">{{item.menuItemName}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="(child) in item.children"
              :key="child.path"
              :index="child.path"
              @click="jumpItem(child.path,item.menuItemName+'/'+child.menuItemName)"
            >{{child.menuItemName}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </el-aside>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false,
      menuList: [
        // 左侧菜单的item内容
        {
          path: "homeContent",
          menuIcon: "el-icon-s-home",
          menuItemName: "首页"
        },
        {
          path: "equipmentManage",
          menuIcon: "el-icon-mobile",
          menuItemName: "设备管理",
          children: [
            {
              path: "equipmentResume",
              menuIcon: "el-icon-setting",
              menuItemName: "设备履历"
            },
            {
              path: "generalSpareParts",
              menuIcon: "el-icon-setting",
              menuItemName: "通用备件"
            },
            {
              path: "BOMassociatedSpareParts",
              menuIcon: "el-icon-setting",
              menuItemName: "BOM管理备件设置"
            },
            {
              path: "equipmentStatusManagement",
              menuIcon: "el-icon-setting",
              menuItemName: "设备状态管理"
            }
          ]
        },
        {
          path: "sparePartManage",
          menuIcon: "el-icon-coordinate",
          menuItemName: "备件管理",
          children: [
            {
              path: "sparePartContent",
              menuIcon: "el-icon-setting",
              menuItemName: "备件管理"
            },
            {
              path: "planReceiveCheck",
              menuIcon: "el-icon-setting",
              menuItemName: "备件领用"
            },
            // {
            //   path: 'damageListManage',
            //   menuIcon: 'el-icon-setting',
            //   menuItemName: '损坏备件'
            // },
            {
              path: "sparePartDamage",
              menuIcon: "el-icon-setting",
              menuItemName: "损坏备件处理"
            },
            {
              path: "repairPartRegistList",
              menuIcon: "el-icon-setting",
              menuItemName: "修理备件登记"
            },
            {
              path: "sparePartAccount",
              menuIcon: "el-icon-setting",
              menuItemName: "备件备查台账"
            },
            // {path:'sparePartDiscard',menuIcon:'el-icon-setting',menuItemName:'报废维修列表'},
            // {path:'internalRepairList',menuIcon:'el-icon-setting',menuItemName:'内部维修列表'},
            // {path:'externalRepairList',menuIcon:'el-icon-setting',menuItemName:'委外维修列表'},
            // {
            //   path: 'SparePartApprove',
            //   menuIcon: 'el-icon-setting',
            //   menuItemName: '备件批准管理'
            // },
            // {
            //   path: 'abnormalCollectionRecord',
            //   menuIcon: 'el-icon-setting',
            //   menuItemName: '异常领用记录'
            // },
            {
              path: "repairLimitManage",
              menuIcon: "el-icon-setting",
              menuItemName: "返修上限"
            }
          ]
        },
        {
          path: "repairManage",
          menuIcon: "el-icon-first-aid-kit",
          menuItemName: "维修管理",
          children: [
            {
              path: "repairManageContent",
              menuIcon: "el-icon-setting",
              menuItemName: "维修单管理"
            },
            {
              path: 'faultTypeManage',
              menuIcon: 'el-icon-setting',
              menuItemName: '故障类型管理'
            },
            {
              path: 'problemRisingManage',
              menuIcon: 'el-icon-setting',
              menuItemName: '问题上升机制'
            },
            {
              path: 'emergencyManage',
              menuIcon: 'el-icon-setting',
              menuItemName: '紧急程度管理'
            },
            {
              path: 'majorFailureSetting',
              menuIcon: 'el-icon-setting',
              menuItemName: '大故障记录时间设置'
            },
          ]
        },
        {
          path: "spotCheckManage",
          menuIcon: "el-icon-thumb",
          menuItemName: "点检管理",
          children: [
            {
              path: "PlanManage",
              menuIcon: "el-icon-setting",
              menuItemName: "点检计划"
            },
            {
              path: "WorkOrderManage",
              menuIcon: "el-icon-setting",
              menuItemName: "点检工单"
            },
            {
              path: "ChangedRecords",
              menuIcon: "el-icon-setting",
              menuItemName: "点检计划更改记录"
            },
            {
              path: "PhotoLibrary",
              menuIcon: "el-icon-setting",
              menuItemName: "图示库"
            }
          ]
        },
        {
          path: "inSpectionManage",
          menuIcon: "el-icon-aim",
          menuItemName: "巡检管理",
          children: [
            {
              path: "inSpectionPlanManage",
              menuIcon: "el-icon-setting",
              menuItemName: "巡检计划"
            },
            {
              path: "inSpectionWorkOrderManage",
              menuIcon: "el-icon-setting",
              menuItemName: "巡检工单"
            },
            {
              path: "inSpectionChangedRecords",
              menuIcon: "el-icon-setting",
              menuItemName: "巡检计划更改记录"
            },
            {
              path: "inSpectionPhotoLibrary",
              menuIcon: "el-icon-setting",
              menuItemName: "图示库"
            }
          ]
        },
        {
          path: "upKeepManage",
          menuIcon: "el-icon-timer",
          menuItemName: "保养管理",
          children: [
            {
              path: "upKeepPlanManage",
              menuItemName: "保养计划",
              menuIcon: "el-icon-setting"
            },
            {
              path: "upKeepWorkOrderManage",
              menuItemName: "保养工单",
              menuIcon: "el-icon-setting"
            },
            {
              path: "upKeepChangePlan",
              menuItemName: "保养计划更改记录",
              menuIcon: "el-icon-setting"
            },
            {
              path: "upKeepPhotoLibrary",
              menuItemName: "图示库",
              menuIcon: "el-icon-setting"
            }
          ]
        },
        {
          path: "workshopManage",
          menuIcon: "el-icon-setting",
          menuItemName: "车间设置管理",
          children: [
            {
              path: "factoryManage",
              menuIcon: "el-icon-setting",
              menuItemName: "工厂管理"
            },
            {
              path: "workshopManage",
              menuIcon: "el-icon-setting",
              menuItemName: "车间管理"
            },
            {
              path: "areaManage",
              menuIcon: "el-icon-setting",
              menuItemName: "区域管理"
            },
            {
              path: "sectionManage",
              menuIcon: "el-icon-setting",
              menuItemName: "工段管理"
            },
            {
              path: "workStationManage",
              menuIcon: "el-icon-setting",
              menuItemName: "工位管理"
            },
            {
              path: "jobManage",
              menuIcon: "el-icon-setting",
              menuItemName: "岗位管理"
            },
            {
              path: "teamManage",
              menuIcon: "el-icon-setting",
              menuItemName: "班组管理"
            },
            {
              path: "shiftManage",
              menuIcon: "el-icon-setting",
              menuItemName: "班次管理"
            },
            {
              path: "sysConfigManage",
              menuIcon: "el-icon-setting",
              menuItemName: "数据字典"
            },
            {
              path: "cycleManage",
              menuIcon: "el-icon-setting",
              menuItemName: "周期管理"
            },
            {
              path: "expertsManage",
              menuIcon: "el-icon-setting",
              menuItemName: "专家类型设置"
            },
            {
              path: "hiftHandoverRecord",
              menuIcon: "el-icon-setting",
              menuItemName: "交接班记录"
            }
          ]
        },
        // {
        //   path: '',
        //   menuIcon: 'el-icon-setting',
        //   menuItemName: '故障统计'
        // },
        {
          path: "dataManagePage",
          menuIcon: "el-icon-files",
          menuItemName: "资料库",
          children: [
            {
              path: "dataSetting",
              menuIcon: "el-icon-setting",
              menuItemName: "资料类型设置"
            },
            {
              path: "dataLists",
              menuIcon: "el-icon-setting",
              menuItemName: "资料列表"
            }
          ]
        },
        {
          path: 'expertManagePage',
          menuIcon: 'el-icon-setting',
          menuItemName: '专家智库',
          children: [{
              path: 'fileLists',
              menuIcon: 'el-icon-setting',
              menuItemName: '文件列表'
            },
            {
              path: 'topicLists',
              menuIcon: 'el-icon-setting',
              menuItemName: '话题列表'
            },
            {
              path: 'fileSetting',
              menuIcon: 'el-icon-setting',
              menuItemName: '文件类型设置'
            },
            {
              path: 'themeType',
              menuIcon: 'el-icon-setting',
              menuItemName: '主题类型设置'
            },
            {
              path: 'expertType',
              menuIcon: 'el-icon-setting',
              menuItemName: '专家类型设置'
            },
            {
              path: 'commentReply',
              menuIcon: 'el-icon-setting',
              menuItemName: '评论回复'
            },
          ]
        },
        // {
        //   path: '',
        //   menuIcon: 'el-icon-setting',
        //   menuItemName: '统计报表'
        // },
        // {
        //   path: '',
        //   menuIcon: 'el-icon-setting',
        //   menuItemName: '时限管理'
        // },
        {
          path: "userManagePage",
          menuIcon: "el-icon-user",
          menuItemName: "用户管理",
          children: [
            {
              path: "userManage",
              menuIcon: "el-icon-setting",
              menuItemName: "用户管理"
            },
            {
              path: "roleManage",
              menuIcon: "el-icon-setting",
              menuItemName: "角色管理"
            },
            {
              path: "authManage",
              menuIcon: "el-icon-setting",
              menuItemName: "权限管理"
            }
          ]
        },
        {
          path: "approvalManagePage",
          menuIcon: "el-icon-monitor",
          menuItemName: "审批管理",
          children: [
            {
              path: "approvalSetting",
              menuIcon: "el-icon-setting",
              menuItemName: "审批设置"
            },
            {
              path: "approvalManage",
              menuIcon: "el-icon-setting",
              menuItemName: "审批管理"
            }
          ]
        }
      ],
      // 被激活的链接地址
      activePath: "/homeContent"
    };
  },
  methods: {
    jumpItem(path, name) {
      const _this = this;
      _this.$router.push(`/${path}`);
      window.title = name;
    }
  }
}
</script>
<style lang="scss">
.el-aside {
  background: #0077c8;

  .logo {
    padding: 22px 0;
    text-align: center;
    background: #0077c8;
    color: #fff;
    cursor: pointer;
  }

  i {
    color: #a6bbc8;
  }

  .el-menu {
    background: #0077c8;
    .el-submenu__title {
      color: #fff;
    }
  }

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100vh;
  }
  .el-menu-item {
    color: #fff !important;
    background: #0077c8;
  }
  .el-menu-item.is-active {
    color: #0077c8 !important;
    background: #fff;
  }
  .is-active i {
    color: #fff;
    font-weight: bold;
  }
}
</style>