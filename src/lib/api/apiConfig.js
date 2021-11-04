
// const apiPath = require.context('../api/', false, /^(?!.*index).*\.js/).keys();
import dev from '../../../environment.dev';
import prod from '../../../environment.prod';

const urls = process.env.NODE_ENV === 'development' ? dev : prod;

export default {
    // 用户账号密码登录
    userLogin: `${urls.oauth2}/login`,
    // 刷新token
    refreshToken: `${urls.oauth2}/refresh-token`,
    // 登出
    userLogOut: `${urls.oauth2}/sys/logout`,
    // 获取用户信息
    principal: `${urls.oauth2}/principal`,
    client: `${urls.oauth2}/client`,
    // 用户可以看见的菜单列表
    userMenus:`${urls.oauth2}/menus`,
    //免密登录
    ivLogin:`${urls.oauth2}/iv/login`,
    //GET - 获取用户所有所属车间工厂
    userWorkshops: `${urls.oauth2}/workshops`,
    //GET - 将用户切换至该工厂下,并返回新的权限
    userWorkshop: `${urls.oauth2}/workshop`,
    // PATCH - 修改密码
    changPassword: `${urls.oauth2}/user/update-password`,


    // GET - 查询工厂列表|查询单个工厂; POST - 添加工厂; PATCH - 修改工厂信息;
    factory: `${urls.system}/factory`,
    // GET - 查询车间; POST - 新增车间;
    workshop: `${urls.system}/workshop`,
    // GET - 查询区域列表|查询打个区域详情; POST- 新增区域;
    workshopArea: `${urls.system}/workshopArea`,
    // GET - 查询设备履历页面区域下拉框列表；
    workshopAreaNames: `${urls.system}/workshopArea/names`,
    // GET - 查询岗位; POST - 增加岗位;
    sysPosition: `${urls.system}/sysPosition`,
    // GET - 查询工段; POST -新增测试工段
    workshopSection: `${urls.system}/workshopSection`,
    // GET - 查询班组列表|查询单个班组; POST - 新增班组;
    workshopTeam: `${urls.system}/workshopTeam`,


    // GET - 查询设备列表|查询单个设备; POST - 新增设备; PUT - 修改设备;
    device: `${urls.device}`,
    bom:`${urls.device}/bom`,

    // GET - 查询异常领用列表
    getAbnormalConsuming: `${urls.device}/getAbnormalConsuming`,
    // GET - 查询单条异常领用详情
    getAbnormalConsumingDetail: `${urls.device}/getAbnormalConsumingDetail`,
    // GET - 查询BOM列表
    getBom: `${urls.device}/bom`,
    // GET - 获取单个BOM备件详情
    getBomDetail: `${urls.device}/getBomDetail`,
    // GET - 获取设备状态列表|设备状态详情； POST - 新增设备状态； PUT - 修改设备状态；
    deviceStatus: `${urls.device}/status`,

    //GET - 获取BOM开关状态
    getEnableBom: `${urls.device}/getEnableBom`,
    // PATCH - 修改BOM开关
    enableBom: `${urls.device}/enableBom`,
    // GET - BOM开关历史记录
    bomHistory: `${urls.device}/bomHistory`,
    // GET - 下载bom表单
    bomDownload: `${urls.device}/bom/download`,
    // GET - 导出设备
    deviceDownload: `${urls.device}/download`,
    // GET - 导出bom备件
    deviceBomDownload: `${urls.device}/bom/download`,


    // GET - 查询通用备件列表｜查询单个通用备件详情； POST - 添加通用备件； PUT - 修改通用备件； PATCH - 启用/禁用通用备件
    universalSpare: `${urls.spare}/spare/universalSpare`,
    spairRrepair:`${urls.spare}spair-repair`,
    // GET - 查询备件列表｜查询单个备件详情；
    spare: `${urls.spare}api/spare`,
    // GET  - 查询返修上限列表; PATCH - 修改返修上限
    repairLimit: `${urls.spare}api/spare/repairLimit`,
    // GET - 手动同步东昌备件数据
    syncDcData: `${urls.spare}api/spare/sync-dc-data`,
    // POST - 单个备件损坏登记
    breakDownRegister: `${urls.spare}api/spareBreakDown`,
    // POST - 批量备件损坏登记
    breakDownRegisterBatch: `${urls.spare}api/spareBreakDown/BreakDownRegisterBatch`,
    //  GET  - 查询常用备件频次； PATCH - 修改常用备件频次
    commonSpare: `${urls.spare}api/spare/commonSpare`,
    // GET - 备件批准列表管理； POST - 添加备件批准； PUT - 修改备件批准
    spareApprove: `${urls.spare}api/spareApprove`,
    // GET - 单个备件批准详情
    spareApproveDetail: `${urls.spare}api/spareApprove/detail`,
    // GET - 备件领用列表｜单个备件领用详情；
    spareConsuming: `${urls.spare}api/spareConsuming`,
    // PATCH - 备件领用审批；
    approval: `${urls.spare}api/spareConsuming/approval`,
    // GET - 损坏备件处理列表
    spareBreakdown: `${urls.spare}api/spareBreakDown`,
    // GET - 查询单个工业垃圾详情
    rubbish: `${urls.spare}api/spareBreakDown/rubbish`,
    // GET - 查询单个报废备件详情
    scrap: `${urls.spare}api/spareBreakDown/scrap`,
    // PATCH - 工业垃圾审批
    rubbishApproval: `${urls.spare}api/spareBreakDown/rubbishApproval`,
    // PATCH - 备件报废审批
    scrapApproval: `${urls.spare}api/spareBreakDown/scrapApproval`,
    // PATCH - 委内维修审批
    inRepairApproval: `${urls.spare}api/spareBreakDown/inRepairApproval`,
    // PATCH - 备件报废转移
    scrapTransfer: `${urls.spare}api/spareBreakDown/scrapTransfer`,
    sap: `${urls.sap}`,
    sapUsername: `${urls.sapUsername}`,
    sapPassword: `${urls.sapPassword}`,
    sapUrl: `${urls.spare}`,


    // 维修管理
    maintenanceManage:`${urls.business}/maintenance`,
    // 问题上升设置管理
    problemUp:`${urls.business}/problem-up`,
    // 大故障时间管理
    bigFaultTime:`${urls.business}/maintenance/big-fault-time-config`,
    // 故障类型管理
    faultType:`${urls.business}/fault-type`,
    // 紧急程度管理
    emergencyDegree:`${urls.business}/emergency-degree`,
    systemUrl:`${urls.systemUrl}`,
    // 用户管理
    userManage: `${urls.system}/user`,
    //文件服务器地址
    accessoryFile:`${urls.accessoryFile}`,
    // 权限管理
    authManage: `${urls.system}/authority`,
    //工厂管理
    factoryManage: `${urls.system}/factory`,
    //车间管理
    workshopManage: `${urls.system}/workshop`,
    //车间下拉列表
    workshopSelect: `${urls.system}/workshop/names`,
    //区域管理
    workshopAreaManage: `${urls.system}/workshopArea`,
    //岗位管理
    sysPositionManage: `${urls.system}/sysPosition`,
    // 工段管理
    workshopSectionManage: `${urls.system}/workshopSection`,
    // 工段下拉列表
    workshopSectionSelect: `${urls.system}/workshopSection/names`,
    // 班次管理
    workshopShiftManage: `${urls.system}/workshopShift`,
    // 班组管理
    workshopTeamManage: `${urls.system}/workshopTeam`,
    // 角色管理
    roleManage: `${urls.system}/role`,
    // 工位管理
    workStationManage: `${urls.system}/workStation`,
    // 工位下拉列表
    workStationSelect: `${urls.system}/workStation/names`,
    //字典表管理
    sysConfigManage: `${urls.system}/sysConfig`,
    //字典表管理
    message: `${urls.system}/message`,
    //导入基础信息
    baseImport: `${urls.system}/base/import`,
    //导出基础信息模板
    baseDownload: `${urls.system}/base/download`,
    // 时限管理
    timeLimit: `${urls.system}/time-limit-config`,

    // 周期管理
    cycleManage: `${urls.business}/cycle`,

    // 交接班管理
    handoverManage: `${urls.business}/handover`,

    // 审批流管理
    workflowManage: `${urls.approval}/workflow`,
    // 审批流节点管理
    workflowNodeManage: `${urls.approval}/workflow/node`,
    // 进行中的审批流管理
    workflowRuningManage: `${urls.approval}/workflow/running`,


    //点检管理
    // GET - 查询点检计划列表; POST - 新增设备; PUT - 修改设备;
    plan: `${urls.business}/web/plan`,
    // 点检计划编号
    planNewNo: `${urls.business}/web/plan/newNo`,
    //状态列表
    planStatusSelect: `${urls.business}/web/plan/statusName`,
    // 周期列表
    cycleSelect: `${urls.business}/workshop`,
    // 同步图示库
    updatePlanPicture: `${urls.business}/web/plan/picture`,
    // 批量导入文件
    importURLPlanFile: `${urls.business}/web/plan/import`,
    // GET - 查询点检工单列表;
    checkWorkOrder: `${urls.business}/web/workOrder`,
    // GET - 查询点检计划更改记录列表
    checkPlanChanges: `${urls.business}/web/plan/planChanges`,
    // GET - 导出单个计划excel /web/plan/{id}/download
    exportExcel:`${urls.business}/web/plan`,
    // GET - 导出多个计划excel
    exportPlans:`${urls.business}/web/plan/download`,
    // PATCH - 操作工单
    updateOrderStatus: `${urls.business}/mobile/workorders/status`,

    childPlan: `${urls.business}/web/plan/child`,

    orderMobile: `${urls.business}/mobile`,


    // 附件管理
    //附件  delete  /accessory/{ids}
    accessory: `${urls.accessory}/accessory`,
    //下载附件   get /accessory/download/{id}
    downloadAccessory: `${urls.accessory}/accessory/download`,
    //上传单个附件  post  /accessory/upload/{module}
    // module 所属模块，1：用户基础数据模块；2：设备模块；4：备件模块；8：资料库；16：专家智库；32：统计；64：图示库；128：其他
    uploadAccessory: `${urls.accessory}/accessory/upload`,
    //批量上传附件  post /accessory/upload/batch/{module}
    uploadAccessoryBatch: `${urls.accessory}/accessory/upload/batch`,

    //保养管理
    maintainPlan:`${urls.business}/maintainPlan`,
    //保养变更记录
    maintainPlanChanges:`${urls.business}/maintainPlan/planChanges`,
    //保养工单
    maintainWorkOrder:`${urls.business}/maintainWorkOrder`,
    // GET - 导出单个保养计划excel  /maintainPlan/{id}/download
    exportMaintainPlan:`${urls.business}/maintainPlan`,
    // GET - 导出多个保养计划excel
    exportMaintainPlans:`${urls.business}/maintainPlan/download`,
    // 保养工单 - mobile
    maintainWorkOrderMobile:`${urls.business}/mobile`,

    // 资料库
    dataBase: `${urls.database}/deviceDataBases`,
    dataBasePreview: `${urls.database}/deviceDataBases/preview`,
    dataBaseType: `${urls.database}/deviceDataBaseType`,
    dataBaseTypeName: `${urls.database}/deviceDataBaseType/name`,

    // 专家智库
    theme: `${urls.expert}/theme`,
    // 主题类型
    themeType: `${urls.expert}/themeType`,
    // 主题类型
    expertType: `${urls.expert}/expertType`,

    // 日志
    log: `${urls.log}/log`,

    // 统计分析
    inspectionCountBasedOnArea: `${urls.business}/statistics/inspectionCountBasedOnArea`,
    statisticsForMaintain: `${urls.business}/statistics/maintain/receivedCount`,
    maintainCountBasedOnArea: `${urls.business}/statistics/maintainCountBasedOnArea`, //保养根据区域统计接单数量
    statisticsForMaintenanceCost: `${urls.business}/statistics/maintenance-cost`,
    statisticsForMaintenanceRepairList: `${urls.business}/statistics/maintenance-repair-list`,
    statisticsForMaintenanceSubmitList: `${urls.business}/statistics/maintenance-submit-list`,
    pointCheckCountBasedOnArea: `${urls.business}/statistics/pointCheckCountBasedOnArea`,
    statisticsForReceivedHour: `${urls.business}/statistics/receivedHour`,
    statisticsForWorkOrder: `${urls.business}/statistics/workOrder`,
}
