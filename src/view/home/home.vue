<template>
  <div>
    <el-container class="home">
      <!-- 左侧菜单导航栏 -->
      <el-aside width='240px' class="left-menu">
        <!-- 头部logo -->
        <div class="logo">
          <!-- <img src="@/assets/image/login/login_logo.png" alt=""> -->
          <span>TPMS</span>
        </div>
        <!-- 菜单导航栏 -->
        <el-menu background-color="#0077DC" text-color="#fff" active-text-color="#0077DC" :default-active='activePath'>
          <!-- 一级菜单 -->
          <el-submenu class="menu" v-for='(item,index) in menuList' :key='index' :index="'/'+item.path" @click='jumpItem(item.path,item.menuItemName)'>
            <template slot="title">
              <!-- <i :class="item.menuIcon"></i> -->
              <span>{{item.menuItemName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="(child) in item.children" :key='child.path' @click="jumpItem(child.path,item.menuItemName+'/'+child.menuItemName)"
                style="font-size:12px;background:#0077DC">{{child.menuItemName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import {
    getUserMenus
  } from "../../lib/api/userManage";
  export default {
    data() {
      return {
        menuList: [ // 左侧菜单的item内容
          // {path:'homeContent',menuIcon:'el-icon-setting',menuItemName:'主页'},
          {
            path: 'equipmentManage',
            menuIcon: 'el-icon-setting',
            menuItemName: '设备管理',
            children: [{
                path: 'equipmentResume',
                menuIcon: 'el-icon-setting',
                menuItemName: '设备履历'
              },
              {
                path: 'generalSpareParts',
                menuIcon: 'el-icon-setting',
                menuItemName: '通用备件'
              },
              {
                path: 'BOMassociatedSpareParts',
                menuIcon: 'el-icon-setting',
                menuItemName: 'BOM管理备件设置'
              },
              {
                path: 'equipmentStatusManagement',
                menuIcon: 'el-icon-setting',
                menuItemName: '设备状态管理'
              },
            ]
          },
          // {
          //   path: 'sparePartManage',
          //   menuIcon: 'el-icon-setting',
          //   menuItemName: '备件管理',
          //   children: [{
          //       path: 'sparePartContent',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '备件管理'
          //     },
          //     {
          //       path: 'repairLimitManage',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '返修上限'
          //     },
          //     {
          //       path: 'planReceiveCheck',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '备件领用查看'
          //     },
          //     {
          //       path: 'damageListManage',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '损坏备件管理'
          //     },
          //     {
          //       path: 'sparePartDamage',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '损坏备件处理'
          //     },
          //     {
          //       path: 'repairPartRegistList',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '修理备件登记列表'
          //     },
          //     {
          //       path: 'sparePartAccount',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '备件备查台账'
          //     },
          //     // {path:'sparePartDiscard',menuIcon:'el-icon-setting',menuItemName:'报废维修列表'},
          //     // {path:'internalRepairList',menuIcon:'el-icon-setting',menuItemName:'内部维修列表'},
          //     // {path:'externalRepairList',menuIcon:'el-icon-setting',menuItemName:'委外维修列表'},
          //     {
          //       path: 'SparePartApprove',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '备件批准管理'
          //     },
          //     {
          //       path: 'abnormalCollectionRecord',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '异常领用记录'
          //     },
          //   ]
          // },
          {
            path: 'repairManage',
            menuIcon: 'el-icon-setting',
            menuItemName: '维修管理',
            children: [{
                path: 'repairManageContent',
                menuIcon: 'el-icon-setting',
                menuItemName: '维修单管理'
              },
              // {
              //   path: 'problemRisingManage',
              //   menuIcon: 'el-icon-setting',
              //   menuItemName: '问题上升机制'
              // },
              // {
              //   path: 'emergencyManage',
              //   menuIcon: 'el-icon-setting',
              //   menuItemName: '紧急程度管理'
              // },
              // {
              //   path: 'faultTypeManage',
              //   menuIcon: 'el-icon-setting',
              //   menuItemName: '点检计故障种类管理'
              // },
              // {
              //   path: 'majorFailureSetting',
              //   menuIcon: 'el-icon-setting',
              //   menuItemName: '大故障记录时间设置'
              // },
            ]
          },
          {
            path: 'spotCheckManage',
            menuIcon: 'el-icon-setting',
            menuItemName: '点检管理',
            children: [{
                path: 'PlanManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '点检计划'
              },
              {
                path: 'WorkOrderManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '点检工单'
              },
              {
                path: 'ChangedRecords',
                menuIcon: 'el-icon-setting',
                menuItemName: '点检计划更改记录'
              },
              {
                path: 'PhotoLibrary',
                menuIcon: 'el-icon-setting',
                menuItemName: '图示库'
              },
            ]
          },
          {
            path: 'inSpectionManage',
            menuIcon: 'el-icon-setting',
            menuItemName: '巡检管理',
            children: [{
                path: 'inSpectionPlanManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '巡检计划'
              },
              {
                path: 'inSpectionWorkOrderManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '巡检工单'
              },
              {
                path: 'inSpectionChangedRecords',
                menuIcon: 'el-icon-setting',
                menuItemName: '巡检计划更改记录'
              },
              {
                path: 'inSpectionPhotoLibrary',
                menuIcon: 'el-icon-setting',
                menuItemName: '图示库'
              },
            ]
          },
          {
            path: 'upKeepManage',
            menuIcon: 'el-icon-setting',
            menuItemName: '保养管理',
            children:[{
              
                path: 'upKeepPlanManage',
                menuItemName: '保养计划管理',
                menuIcon: 'el-icon-setting',
              },
              {
                path: 'upKeepPhotoLibrary',
                menuItemName: '图示库',
                menuIcon: 'el-icon-setting',
              },
              {
                path: '/upKeepWorkOrderManage',
                menuItemName: '保养工单',
                menuIcon: 'el-icon-setting',
              },
              {
                path: '/upKeepChangePlan',
                menuItemName: '保养更改计划',
                menuIcon: 'el-icon-setting',
              
            }]
          },
          {
            path: 'workshopManage',
            menuIcon: 'el-icon-setting',
            menuItemName: '车间设置管理',
            children: [{
                path: 'factoryManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '工厂管理'
              },
              {
                path: 'sysConfigManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '数据字典'
              },
              {
                path: 'workshopManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '车间管理'
              },
              {
                path: 'areaManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '区域管理'
              },
              {
                path: 'jobManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '岗位管理'
              },
              {
                path: 'sectionManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '工段管理'
              },
              {
                path: 'teamManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '班组管理'
              },
              {
                path: 'workStationManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '工位管理'
              },
              {
                path: 'shiftManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '班次管理'
              },
              {
                path: 'cycleManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '周期管理'
              },
              {
                path: 'expertsManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '专家类型设置'
              },
              {
                path: 'hiftHandoverRecord',
                menuIcon: 'el-icon-setting',
                menuItemName: '交接班记录'
              },
            ]
          },
          // {
          //   path: '',
          //   menuIcon: 'el-icon-setting',
          //   menuItemName: '故障统计'
          // },
          // {
          //   path: 'dataManagePage',
          //   menuIcon: 'el-icon-setting',
          //   menuItemName: '资料库',
          //   children: [{
          //       path: 'dataSetting',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '资料类型设置'
          //     },
          //     {
          //       path: 'dataLists',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '资料列表'
          //     },
          //   ]
          // },
          // {
          //   path: 'expertManagePage',
          //   menuIcon: 'el-icon-setting',
          //   menuItemName: '专家智库',
          //   children: [{
          //       path: 'fileLists',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '文件列表'
          //     },
          //     {
          //       path: 'topicLists',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '话题列表'
          //     },
          //     {
          //       path: 'fileSetting',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '文件类型设置'
          //     },
          //     {
          //       path: 'commentReply',
          //       menuIcon: 'el-icon-setting',
          //       menuItemName: '评论回复'
          //     },
          //   ]
          // },
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
            path: 'userManagePage',
            menuIcon: 'el-icon-setting',
            menuItemName: '用户管理',
            children: [{
                path: 'userManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '用户管理'
              },
              {
                path: 'roleManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '角色管理'
              },
              {
                path: 'authManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '权限管理'
              },
            ]
          },
          {
            path: 'approvalManagePage',
            menuIcon: 'el-icon-setting',
            menuItemName: '审批管理',
            children: [{
                path: 'approvalSetting',
                menuIcon: 'el-icon-setting',
                menuItemName: '审批设置'
              },
              {
                path: 'approvalManage',
                menuIcon: 'el-icon-setting',
                menuItemName: '审批管理'
              },
            ]
          },
        ],
        // 被激活的链接地址
        activePath: '/homeContent'
      }
    },
    mounted() {
      getUserMenus().then(res => {
        console.log(res)
      })
    },
    created() {
      // this.$router.push('/changePassword');
    },
    methods: {
      jumpItem(path, name) {
        const _this = this
        _this.$router.push(path)
        window.title = name
      }
    }
  };
</script>
<style lang="scss">
  .home {
    width: 19.2rem;
    height: 100vh;

    .left-menu {
      background-color: #0077DC;
      color: #FFF;

      .logo {
        padding: 0.2rem 0.3rem;

        img {
          width: 0.3rem;
          height: 0.3rem;
          border-radius: 50%;
          vertical-align: -30%;
        }
      }

    }

    .menu {
      .el-icon-arrow-down:before {
        color: #FFF !important;
      }
    }
  }

  .is-active {
    background-color: #FFF !important;
  }

  .el-main {
    padding: 0;
  }

  .el-menu-item {
    height: 0.5rem;
    line-height: 0.5rem;

    i {
      color: #FFF;
    }
  }

  .el-menu-item.is-active i {
    color: #2d9bfb;
  }
</style>
