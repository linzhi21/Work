

import Vue from 'vue';
import Router from 'vue-router';
import { refreshToken } from '../lib/api/user'
import { beforeEach } from './guards';
Vue.use(Router)

// 重复点击导航路由报错解决方法
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const route = new Router({
  routes: [
    {
      path: '*',
      redirect: "login"
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/view/login/login'),
      hidden: true
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/view/home/home'),
      hidden: true,
      redirect: '/title',
      children: [
        {
          path: '/title',
          name: 'title',
          component: () => import('@/view/title/title'),
          redirect: '/homeContent',
          children: [
            {
              path: '/homeContent',
              name: 'HomeContent',
              component: () => import('@/view/homePage/HomeContent'),
              hidden: true
            },
            {
              path: '/persional',
              name: 'Persional',
              component: () => import('@/view/homePage/Persional'),
              hidden: true
            },
            {
              path: '/changePassword',
              name: 'ChangePassword',
              component: () => import('@/view/homePage/ChangePassword'),
              hidden: true
            },
            {
              path: '/message',
              name: 'message',
              component: () => import('@/view/homePage/message'),
              hidden: true
            },
            {
              path: '/equipmentManage',
              name: 'EquipmentManage',
              meta: { title: '设备管理' },
              component: () => import('@/view/equipmentManagePage/EquipmentManage.vue'),
              redirect: 'equipmentResume',
              hidden: true,
              children: [
                { path: '/abnormalCollectionRecord', name: 'AbnormalCollectionRecord', meta: { title: '异常领用记录' }, component: () => import('@/view/equipmentManagePage/AbnormalCollectionRecord') },
                { path: '/BOMassociatedSpareParts', name: 'BOMassociatedSpareParts', meta: { title: 'BOM管理备件设置' }, component: () => import('@/view/equipmentManagePage/BOMassociatedSpareParts') },
                { path: '/equipmentResume', name: 'EquipmentResume', meta: { title: '设备履历' }, component: () => import('@/view/equipmentManagePage/EquipmentResume') },
                { path: '/equipmentStatusManagement', name: 'EquipmentStatusManagement', meta: { title: '设备状态管理' }, component: () => import('@/view/equipmentManagePage/EquipmentStatusManagement') },
                { path: '/generalSpareParts', name: 'GeneralSpareParts', meta: { title: '通用备件' }, component: () => import('@/view/equipmentManagePage/GeneralSpareParts') },
              ]
            },
            {
              path: '/sparePartManage',
              name: 'SparePartManage',
              meta: { title: '备件管理' },
              component: () => import('@/view/sparePartManagePage'),
              hidden: true,
              redirect: '/sparePartContent',
              children: [
                {
                  path: '/sparePartContent',
                  name: 'SparePartContent',
                  meta: { title: '备件管理' },
                  component: () => import('@/view/sparePartManagePage/SparePartContent'),
                  hidden: true
                },
                {
                  path: '/repairLimitManage',
                  name: 'RepairLimitManage',
                  meta: { title: '返修上限' },
                  component: () => import('@/view/sparePartManagePage/RepairLimitManage'),
                  hidden: true
                },
                {
                  path: '/damageListManage',
                  name: 'DamageListManage',
                  meta: { title: '损坏备件' },
                  component: () => import('@/view/sparePartManagePage/DamageListManage'),
                  hidden: true
                },
                {
                  path: '/sparePartDamage',
                  name: 'SparePartDamage',
                  meta: { title: '损坏备件处理' },
                  component: () => import('@/view/sparePartManagePage/SparePartDamage'),
                  hidden: true
                },
                {
                  path: '/sparePartAccount',
                  name: 'SparePartAccount',
                  meta: { title: '备件备查台账' },
                  component: () => import('@/view/sparePartManagePage/SparePartAccount'),
                  hidden: true
                },
                {
                  path: '/repairPartRegistList',
                  name: 'RepairPartRegistList',
                  meta: { title: '修理备件登记' },
                  component: () => import('@/view/sparePartManagePage/RepairPartRegistList'),
                  hidden: true
                },
                {
                  path: '/planReceiveCheck',
                  name: 'PlanReceiveCheck',
                  meta: { title: '备件领用' },
                  component: () => import('@/view/sparePartManagePage/PlanReceiveCheck'),
                  hidden: true
                },
                {
                  path: '/sparePartApprove',
                  name: 'SparePartApprove',
                  meta: { title: '备件管理' },
                  component: () => import('@/view/sparePartManagePage/SparePartApprove'),
                  hidden: true
                },
              ]
            },
            {
              path: '/spotCheckManage',
              name: 'SpotCheckManage',
              meta: { title: '点检管理' },
              component: () => import('@/view/spotCheckManagePage'),
              hidden: true,
              redirect: '/planManage',
              children: [
                {
                  path: '/planManage',
                  name: 'PlanManage',
                  meta: { title: '点检计划' },
                  component: () => import('@/view/spotCheckManagePage/PlanManage'),
                  hidden: true
                },
                {
                  path: '/photoLibrary',
                  name: 'PhotoLibrary',
                  meta: { title: '计划资料库' },
                  component: () => import('@/view/spotCheckManagePage/PhotoLibrary'),
                  hidden: true
                },
                {
                  path: '/workOrderManage',
                  name: 'WorkOrderManage',
                  meta: { title: '点检工单' },
                  component: () => import('@/view/spotCheckManagePage/WorkOrderManage'),
                  hidden: true
                },
                {
                  path: '/changedRecords',
                  name: 'ChangedRecords',
                  meta: { title: '点检计划变更' },
                  component: () => import('@/view/spotCheckManagePage/ChangedRecords'),
                  hidden: true
                },
              ]
            },
            {
              path: '/inSpectionManage',
              name: 'InspectionManage',
              meta: { title: '巡检管理' },
              component: () => import('@/view/inspectionManagePage'),
              hidden: true,
              redirect: '/inSpectionPlanManage',
              children: [
                {
                  path: '/inSpectionPlanManage',
                  name: 'InspectionPlanManage',
                  meta: { title: '巡检计划' },
                  component: () => import('@/view/inspectionManagePage/PlanManage'),
                  hidden: true
                },
                {
                  path: '/inSpectionPhotoLibrary',
                  name: 'InspectionPhotoLibrary',
                  meta: { title: '计划资料库' },
                  component: () => import('@/view/inspectionManagePage/PhotoLibrary'),
                  hidden: true
                },
                {
                  path: '/inSpectionWorkOrderManage',
                  name: 'InspectionWorkOrderManage',
                  meta: { title: '巡检工单' },
                  component: () => import('@/view/inspectionManagePage/WorkOrderManage'),
                  hidden: true
                },
                {
                  path: '/inSpectionChangedRecords',
                  name: 'InSpectionChangedRecords',
                  meta: { title: '巡检计划更改记录' },
                  component: () => import('@/view/inspectionManagePage/inSpectionChangedRecords'),
                  hidden: true
                },
              ]
            },
            {
              path: '/upKeepManage',
              name: 'UpkeepManage',
              meta: { title: '保养管理' },
              component: () => import('@/view/upkeepManagePage/SpotCheckManage'),
              hidden: true,
              redirect: '/upKeepPlanManage',
              children: [
                {
                  path: '/upKeepPlanManage',
                  name: 'UpkeepPlanManage',
                  meta: { title: '保养计划' },
                  component: () => import('@/view/upkeepManagePage/PlanManage'),
                  hidden: true
                },
                {
                  path: '/unPlanManage',
                  name: 'UnPlanManage',
                  meta: { title: '临时保养' },
                  component: () => import('@/view/upkeepManagePage/UnPlanManage'),
                  hidden: true
                },
                {
                  path: '/upKeepPhotoLibrary',
                  name: 'UpkeepPhotoLibrary',
                  meta: { title: '计划资料库' },
                  component: () => import('@/view/upkeepManagePage/PhotoLibrary'),
                  hidden: true
                },
                {
                  path: '/upKeepWorkOrderManage',
                  name: 'UpkeepWorkOrderManage',
                  meta: { title: '保养工单' },
                  component: () => import('@/view/upkeepManagePage/WorkOrderManage'),
                  hidden: true
                },
                {
                  path: '/upKeepChangePlan',
                  name: 'UpkeepChangePlan',
                  meta: { title: '保养计划更改记录' },
                  component: () => import('@/view/upkeepManagePage/UpkeepChangePlan'),
                  hidden: true
                },
              ]
            },
            {
              path: '/repairManage',
              name: 'RepairManage',
              meta: { title: '维修管理' },
              component: () => import('@/view/repairManagePage'),
              hidden: true,
              redirect: '/repairManageContent',
              children: [
                {
                  path: '/repairManageContent',
                  name: 'RepairManageContent',
                  meta: { title: '维修单管理' },
                  component: () => import('@/view/repairManagePage/RepairManageContent'),
                  hidden: true
                },
                {
                  path: '/problemRisingManage',
                  name: 'ProblemRisingManage',
                  meta: { title: '问题上升机制' },
                  component: () => import('@/view/repairManagePage/ProblemRisingManage'),
                  hidden: true
                },
                {
                  path: '/emergencyManage',
                  name: 'EmergencyManage',
                  meta: { title: '紧急程度管理' },
                  component: () => import('@/view/repairManagePage/EmergencyManage'),
                  hidden: true
                },
                {
                  path: '/faultTypeManage',
                  name: 'FaultTypeManage',
                  meta: { title: '故障类型管理' },
                  component: () => import('@/view/repairManagePage/FaultTypeManage'),
                  hidden: true
                },
                {
                  path: '/majorFailureSetting',
                  name: 'MajorFailureSetting',
                  meta: { title: '大故障记录时间设置' },
                  component: () => import('@/view/repairManagePage/MajorFailureSetting'),
                  hidden: true
                },
              ]
            },
            {
              path: '/workshopSettingsManage', name: 'WorkshopSettingsManage', meta: { title: '车间设置管理' }, component: () => import('@/view/workshopSettingsManage/workshopSettingsManage'), redirect: '/factoryManage', children: [
                { path: '/factoryManage', name: 'FactoryManage', meta: { title: '工厂管理' }, component: () => import('@/view/workshopSettingsManage/factoryManage') },
                { path: '/authManage', name: 'AuthManage', meta: { title: '权限管理' }, component: () => import('@/view/workshopSettingsManage/authManage') },
                { path: '/workshopManage', name: 'WorkshopManage', meta: { title: '车间管理' }, component: () => import('@/view/workshopSettingsManage/workshopManage') },
                { path: '/areaManage', name: 'AreaManage', meta: { title: '区域管理' }, component: () => import('@/view/workshopSettingsManage/areaManage') },
                { path: '/cycleManage', name: 'CycleManage', meta: { title: '周期管理' }, component: () => import('@/view/workshopSettingsManage/cycleManage') },
                { path: '/expertsManage', name: 'ExpertsManage', meta: { title: '专家类型设置' }, component: () => import('@/view/workshopSettingsManage/expertsManage') },
                { path: '/hiftHandoverRecord', name: 'HiftHandoverRecord', meta: { title: '交接班记录' }, component: () => import('@/view/workshopSettingsManage/hiftHandoverRecord') },
                { path: '/jobManage', name: 'JobManage', meta: { title: '岗位管理' }, component: () => import('@/view/workshopSettingsManage/jobManage') },
                { path: '/sectionManage', name: 'SectionManage', meta: { title: '工段管理' }, component: () => import('@/view/workshopSettingsManage/sectionManage') },
                { path: '/shiftManage', name: 'ShiftManage', meta: { title: '班次管理' }, component: () => import('@/view/workshopSettingsManage/shiftManage') },
                { path: '/teamManage', name: 'TeamManage', meta: { title: '班组管理' }, component: () => import('@/view/workshopSettingsManage/teamManage') },
                { path: '/workStationManage', name: 'workStationManage', meta: { title: '工位管理' }, component: () => import('@/view/workshopSettingsManage/workStationManage') },
                { path: '/sysConfigManage', name: 'sysConfigManage', meta: { title: '数据字典' }, component: () => import('@/view/workshopSettingsManage/sysConfigManage') },
                { path: '/roleManage', name: 'roleManage', meta: { title: '角色管理' }, component: () => import('@/view/workshopSettingsManage/roleManage') },
                { path: '/timeLimitManage/:type', name: 'timeLimitManage', meta: { title: '时限管理' }, component: () => import('@/view/workshopSettingsManage/timeLimitManage') },

              ]
            },
            {
              path: '/userManagePage',
              name: 'userManagePage',
              meta: { title: '用户管理' },
              component: () => import('@/view/userManagePage/index'),
              hidden: true,
              children: [
                {
                  path: '/userManage',
                  name: 'userManage',
                  meta: { title: '用户管理' },
                  component: () => import('@/view/userManagePage/userManage'),
                  hidden: true
                }
              ]
            },
            {
              path: '/approvalManagePage',
              name: 'approvalManagePage',
              meta: { title: '审批管理' },
              component: () => import('@/view/approvalManagePage/index'),
              hidden: true,
              children: [
                {
                  path: '/approvalManage',
                  name: 'approvalManage',
                  meta: { title: '审批管理' },
                  component: () => import('@/view/approvalManagePage/approvalManage'),
                  hidden: true
                },
                {
                  path: '/approvalSetting',
                  name: 'approvalSetting',
                  meta: { title: '审批设置' },
                  component: () => import('@/view/approvalManagePage/approvalSetting'),
                  hidden: true
                }
              ]
            },
            {
              path: '/dataManagePage',
              name: 'dataManagePage',
              meta: { title: '资料库' },
              component: () => import('@/view/dataManagePage/index'),
              hidden: true,
              children: [
                {
                  path: '/dataLists',
                  name: 'dataLists',
                  meta: { title: '资料列表' },
                  component: () => import('@/view/dataManagePage/dataLists'),
                  hidden: true
                },
                {
                  path: '/dataSetting',
                  name: 'dataSetting',
                  meta: { title: '资料类型设置' },
                  component: () => import('@/view/dataManagePage/dataSetting'),
                  hidden: true
                }
              ]
            },
            {
              path: '/expertManagePage',
              name: 'expertManagePage',
              meta: { title: '专家智库' },
              component: () => import('@/view/expertManagePage/index'),
              hidden: true,
              children: [
                {
                  path: '/fileLists',
                  name: 'fileLists',
                  meta: { title: '文件列表' },
                  component: () => import('@/view/expertManagePage/fileLists'),
                  hidden: true
                },
                {
                  path: '/fileSetting',
                  name: 'fileSetting',
                  meta: { title: '文件类型设置' },
                  component: () => import('@/view/expertManagePage/fileSetting'),
                  hidden: true
                },
                {
                  path: '/topicLists',
                  name: 'topicLists',
                  meta: { title: '话题列表' },
                  component: () => import('@/view/expertManagePage/topicLists'),
                  hidden: true
                },
                {
                  path: '/commentReply',
                  name: 'commentReply',
                  meta: { title: '评论回复' },
                  component: () => import('@/view/expertManagePage/commentReply'),
                  hidden: true
                },
                {
                  path: '/themeType',
                  name: 'themeType',
                  meta: { title: '主题类型设置' },
                  component: () => import('@/view/expertManagePage/themeType'),
                  hidden: true
                },
                {
                  path: '/expertType',
                  name: 'expertType',
                  meta: { title: '专家类型设置' },
                  component: () => import('@/view/expertManagePage/expertType'),
                  hidden: true
                },
              ]
            },
            {
              path: '/logManage',
              name: 'LogManage',
              meta: { title: '日志管理' },
              component: () => import('@/view/log/LogManage.vue'),
              // redirect:'equipmentResume',
              hidden: true,
              children: [
                { path: '/abnormalCollectionRecord', name: 'AbnormalCollectionRecord', meta: { title: '异常领用记录' }, component: () => import('@/view/equipmentManagePage/AbnormalCollectionRecord') },
              ]
            },
          ]
        }
      ]
    },
    {
      // path: '/redirect',
      // component: Layout,
      hidden: true,
      // children: [
      //   {
          path: '/redirect/:path(.*)',
          component: () => import('@/view/redirect/index')
      //   }
      // ]
    },
  ]
})

route.beforeEach(beforeEach);
route.afterEach((to, from) => {
  if (to.name === 'login') {

  } else {

  }
})
export default route;
