module.exports = {
    // 192.168.8.120:9000
    // 47.116.138.243:9010
    systemUrl:'http://47.116.138.243:9010',
    /** 用户模块 */
    oauth2: 'http://47.116.138.243:9010/tpms/oauth2',  //服务器地址
    /** 系统设置模块 */
    system: 'http://47.116.138.243:9010/tpms/system',  //服务器地址
    /** 设备模块 */
    device: 'http://47.116.138.243:9010/tpms/device/api/device',  //服务器地址
    /** 备件模块 */
    spare: 'http://47.116.138.243:9010/tpms/spare/',  //服务器地址
    /** 点检模块*/
    business: 'http://47.116.138.243:9010/tpms/business',  //服务器地址
    /** 审批模块 */
    approval: 'http://47.116.138.243:9010/tpms/approval',  //服务器地址
    /** 附件管理 */
    accessory: 'http://47.116.138.243:9010/tpms/accessory',  //服务器地址
    /** 资料库 */
    database: 'http://47.116.138.243:9010/tpms/database',  //服务器地址
    /** 专家智库 */
    expert: 'http://47.116.138.243:9010/tpms/expert',  //服务器地址
    /** 文件服务器地址 */
    accessoryFile:'http://122.112.190.19:9000/tpms',
    log: 'http://47.116.138.243:9010/tpms/log',  // 日志地址
    /* ==================================测试======================================= */
    // systemUrl: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc',
    // /** 用户模块 */
    // oauth2: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/oauth2',
    // /** 系统设置模块 */
    // system: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/system',
    // /** 设备模块 */
    // device: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/device/api/device',
    // /** 备件模块 */
    // spare: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/spare/',
    // /** 商业模块 */
    // business: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/business',
    // /** 审批模块 */
    // approval: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/approval',
    // /** 附件管理 */
    // accessory: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/accessory',
    // /** 资料库 */
    // database: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/database',  //服务器地址
    // // /** 专家智库 */
    // expert: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/expert',  //服务器地址
    // /** 文件服务器地址 */
    // accessoryFile: 'http://10.160.244.189:9000/tpms',
    // log: 'http://tpms-gateway-runtime.ci-prodapps.ocp.sitc/log',  // 日志地址

    sap: 'http://svlpod01.csvw.com:50000/RESTAdapter/rest/dongchang/ZMDCIF_TPMS_MATKC', // SAP 备件库存接口
    sapUsername: 'TPMS_PI_D',
    sapPassword: 'Abcd123456',
}
