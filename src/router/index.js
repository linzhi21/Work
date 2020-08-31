

import Vue from 'vue';
import Router from 'vue-router';
import {refreshToken}  from '../lib/api/user'
import {beforeEach} from './guards';
Vue.use(Router)

// 重复点击导航路由报错解决方法
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const route = new Router({
  routes: [
    {
      path:'*',
      redirect:"login"
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
              path: '/equipmentManage',
              name: 'EquipmentManage',
              component: () => import('@/view/equipmentManagePage/EquipmentManage'),
              redirect:'equipmentResume',
              hidden: true,
              children:[
                {path:'/abnormalCollectionRecord',name:'AbnormalCollectionRecord',component:() => import('@/view/equipmentManagePage/AbnormalCollectionRecord')},
                {path:'/BOMassociatedSpareParts',name:'BOMassociatedSpareParts',component:() => import('@/view/equipmentManagePage/BOMassociatedSpareParts')},
                {path:'/equipmentResume',name:'EquipmentResume',component:() => import('@/view/equipmentManagePage/EquipmentResume')},
                {path:'/equipmentStatusManagement',name:'EquipmentStatusManagement',component:() => import('@/view/equipmentManagePage/EquipmentStatusManagement')},
                {path:'/generalSpareParts',name:'GeneralSpareParts',component:() => import('@/view/equipmentManagePage/GeneralSpareParts')},
              ]
            },
            {
              path: '/sparePartManage',
              name: 'SparePartManage',
              component: () => import('@/view/sparePartManagePage'),
              hidden: true,
              redirect: '/sparePartContent',
              children: [
                {
                  path: '/sparePartContent',
                  name: 'SparePartContent',
                  component: () => import('@/view/sparePartManagePage/SparePartContent'),
                  hidden: true
                },
                {
                  path: '/repairLimitManage',
                  name: 'RepairLimitManage',
                  component: () => import('@/view/sparePartManagePage/RepairLimitManage'),
                  hidden: true
                },
                {
                  path: '/damageListManage',
                  name: 'DamageListManage',
                  component: () => import('@/view/sparePartManagePage/DamageListManage'),
                  hidden: true
                },
                {
                  path: '/sparePartDamage',
                  name: 'SparePartDamage',
                  component: () => import('@/view/sparePartManagePage/SparePartDamage'),
                  hidden: true
                },
                {
                  path: '/sparePartAccount',
                  name: 'SparePartAccount',
                  component: () => import('@/view/sparePartManagePage/SparePartAccount'),
                  hidden: true
                },
                {
                  path: '/repairPartRegistList',
                  name: 'RepairPartRegistList',
                  component: () => import('@/view/sparePartManagePage/RepairPartRegistList'),
                  hidden: true
                },
                {
                  path: '/repairLimitManage',
                  name: 'RepairLimitManage',
                  component: () => import('@/view/sparePartManagePage/RepairLimitManage'),
                  hidden: true
                },
                {
                  path: '/sparePartCheck',
                  name: 'SparePartCheck',
                  component: () => import('@/view/sparePartManagePage/SparePartCheck'),
                  hidden: true
                },
                {
                  path: '/commonSparePart',
                  name: 'CommonSparePart',
                  component: () => import('@/view/sparePartManagePage/CommonSparePart'),
                  hidden: true
                },
                {
                  path: '/planReceiveCheck',
                  name: 'PlanReceiveCheck',
                  component: () => import('@/view/sparePartManagePage/PlanReceiveCheck'),
                  hidden: true
                },
                {
                  path: '/sparePartApprove',
                  name: 'SparePartApprove',
                  component: () => import('@/view/sparePartManagePage/SparePartApprove'),
                  hidden: true
                },
              ]
            },
            {
              path: '/spotCheckManage',
              name: 'SpotCheckManage',
              component: () => import('@/view/spotCheckManagePage'),
              hidden: true,
              redirect: '/planManage',
              children: [
                {
                  path: '/planManage',
                  name: 'PlanManage',
                  component: () => import('@/view/spotCheckManagePage/PlanManage'),
                  hidden: true
                },
                {
                  path: '/photoLibrary',
                  name: 'PhotoLibrary',
                  component: () => import('@/view/spotCheckManagePage/PhotoLibrary'),
                  hidden: true
                },
                {
                  path: '/workOrderManage',
                  name: 'WorkOrderManage',
                  component: () => import('@/view/spotCheckManagePage/WorkOrderManage'),
                  hidden: true
                },
                {
                  path: '/changedRecords',
                  name: 'ChangedRecords',
                  component: () => import('@/view/spotCheckManagePage/ChangedRecords'),
                  hidden: true
                },
              ]
            },
            {
              path: '/inSpectionManage',
              name: 'InspectionManage',
              component: () => import('@/view/inspectionManagePage'),
              hidden: true,
              redirect: '/inSpectionPlanManage',
              children: [
                {
                  path: '/inSpectionPlanManage',
                  name: 'InspectionPlanManage',
                  component: () => import('@/view/inspectionManagePage/PlanManage'),
                  hidden: true
                },
                {
                  path: '/inSpectionPhotoLibrary',
                  name: 'InspectionPhotoLibrary',
                  component: () => import('@/view/inspectionManagePage/PhotoLibrary'),
                  hidden: true
                },
                {
                  path: '/inSpectionWorkOrderManage',
                  name: 'InspectionWorkOrderManage',
                  component: () => import('@/view/inspectionManagePage/WorkOrderManage'),
                  hidden: true
                },
                {
                  path: '/inSpectionChangedRecords',
                  name: 'InSpectionChangedRecords',
                  component: () => import('@/view/inspectionManagePage/inSpectionChangedRecords'),
                  hidden: true
                },
              ]
            },
            {
              path: '/upKeepManage',
              name: 'UpkeepManage',
              component: () => import('@/view/upkeepManagePage/SpotCheckManage'),
              hidden: true,
              redirect: '/upKeepPlanManage',
              children: [
                {
                  path: '/upKeepPlanManage',
                  name: 'UpkeepPlanManage',
                  component: () => import('@/view/upkeepManagePage/PlanManage'),
                  hidden: true
                },
                {
                  path: '/upKeepPhotoLibrary',
                  name: 'UpkeepPhotoLibrary',
                  component: () => import('@/view/upkeepManagePage/PhotoLibrary'),
                  hidden: true
                },
                {
                  path: '/upKeepWorkOrderManage',
                  name: 'UpkeepWorkOrderManage',
                  component: () => import('@/view/upkeepManagePage/WorkOrderManage'),
                  hidden: true
                },
                {
                  path: '/upKeepChangePlan',
                  name: 'UpkeepChangePlan',
                  component: () => import('@/view/upkeepManagePage/UpkeepChangePlan'),
                  hidden: true
                },
              ]
            },
            {
              path: '/repairManage',
              name: 'RepairManage',
              component: () => import('@/view/repairManagePage'),
              hidden: true,
              redirect: '/repairManageContent',
              children: [
                {
                  path: '/repairManageContent',
                  name: 'RepairManageContent',
                  component: () => import('@/view/repairManagePage/RepairManageContent'),
                  hidden: true
                },
                {
                  path: '/problemRisingManage',
                  name: 'ProblemRisingManage',
                  component: () => import('@/view/repairManagePage/ProblemRisingManage'),
                  hidden: true
                },
                {
                  path: '/emergencyManage',
                  name: 'EmergencyManage',
                  component: () => import('@/view/repairManagePage/EmergencyManage'),
                  hidden: true
                },
                {
                  path: '/faultTypeManage',
                  name: 'FaultTypeManage',
                  component: () => import('@/view/repairManagePage/FaultTypeManage'),
                  hidden: true
                },
                {
                  path: '/majorFailureSetting',
                  name: 'MajorFailureSetting',
                  component: () => import('@/view/repairManagePage/MajorFailureSetting'),
                  hidden: true
                },
              ]
            },
            {
              path: '/sparePartMore',
              name: 'SparePartMore',
              component: () => import('@/view/sparePartManagePage/SparePartMore'),
              hidden: true
            },
            {path:'/workshopSettingsManage',name:'WorkshopSettingsManage',component:() => import('@/view/workshopSettingsManage/workshopSettingsManage'),redirect:'/factoryManage',children:[
              {path:'/factoryManage',name:'FactoryManage',component:() => import('@/view/workshopSettingsManage/factoryManage')},
              {path:'/authManage',name:'AuthManage',component:() => import('@/view/workshopSettingsManage/authManage')},
              {path:'/workshopManage',name:'WorkshopManage',component:() => import('@/view/workshopSettingsManage/workshopManage')},
              {path:'/areaManage',name:'AreaManage',component:() => import('@/view/workshopSettingsManage/areaManage')},
              {path:'/cycleManage',name:'CycleManage',component:() => import('@/view/workshopSettingsManage/cycleManage')},
              {path:'/expertsManage',name:'ExpertsManage',component:() => import('@/view/workshopSettingsManage/expertsManage')},
              {path:'/hiftHandoverRecord',name:'HiftHandoverRecord',component:() => import('@/view/workshopSettingsManage/hiftHandoverRecord')},
              {path:'/jobManage',name:'JobManage',component:() => import('@/view/workshopSettingsManage/jobManage')},
              {path:'/sectionManage',name:'SectionManage',component:() => import('@/view/workshopSettingsManage/sectionManage')},
              {path:'/shiftManage',name:'ShiftManage',component:() => import('@/view/workshopSettingsManage/shiftManage')},
              {path:'/teamManage',name:'TeamManage',component:() => import('@/view/workshopSettingsManage/teamManage')},
              {path:'/workStationManage',name:'workStationManage',component:() => import('@/view/workshopSettingsManage/workStationManage')},
            {path:'/sysConfigManage',name:'sysConfigManage',component:() => import('@/view/workshopSettingsManage/sysConfigManage')},
            {path:'/roleManage',name:'roleManage',component:() => import('@/view/workshopSettingsManage/roleManage')},

            ]},
            {
              path: '/userManagePage',
              name: 'userManagePage',
              component: () => import('@/view/userManagePage/index'),
              hidden: true,
              children: [
                {
                  path: '/userManage',
                  name: 'userManage',
                  component: () => import('@/view/userManagePage/userManage'),
                  hidden: true
                }
               ]
            },
            {
              path: '/approvalManagePage',
              name: 'approvalManagePage',
              component: () => import('@/view/approvalManagePage/index'),
              hidden: true,
              children: [
                {
                  path: '/approvalManage',
                  name: 'approvalManage',
                  component: () => import('@/view/approvalManagePage/approvalManage'),
                  hidden: true
                },
                {
                  path: '/approvalSetting',
                  name: 'approvalSetting',
                  component: () => import('@/view/approvalManagePage/approvalSetting'),
                  hidden: true
                }
               ]
            },
            {
              path: '/dataManagePage',
              name: 'dataManagePage',
              component: () => import('@/view/dataManagePage/index'),
              hidden: true,
              children: [
                {
                  path: '/dataLists',
                  name: 'dataLists',
                  component: () => import('@/view/dataManagePage/dataLists'),
                  hidden: true
                },
                {
                  path: '/dataSetting',
                  name: 'dataSetting',
                  component: () => import('@/view/dataManagePage/dataSetting'),
                  hidden: true
                }
               ]
            },
            {
              path: '/expertManagePage',
              name: 'expertManagePage',
              component: () => import('@/view/expertManagePage/index'),
              hidden: true,
              children: [
                {
                  path: '/fileLists',
                  name: 'fileLists',
                  component: () => import('@/view/expertManagePage/fileLists'),
                  hidden: true
                },
                {
                  path: '/fileSetting',
                  name: 'fileSetting',
                  component: () => import('@/view/expertManagePage/fileSetting'),
                  hidden: true
                },
                {
                  path: '/topicLists',
                  name: 'topicLists',
                  component: () => import('@/view/expertManagePage/topicLists'),
                  hidden: true
                },
                {
                  path: '/commentReply',
                  name: 'commentReply',
                  component: () => import('@/view/expertManagePage/commentReply'),
                  hidden: true
                }
               ]
            },
          ]
        }
      ]
    }
  ]
})

route.beforeEach(beforeEach);
route.afterEach((to,from)=>{
  if(to.name === 'login'){
    
  }else{
    refreshToken()
  }
})
export default route;
