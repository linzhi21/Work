module.exports = {
    // 192.168.8.120:9000/tpms
    // 47.116.138.243:9010
    /* ==================================测试======================================= */
    systemUrl: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc',
    /** 用户模块 */
    oauth2: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/oauth2',
    /** 系统设置模块 */
    system: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/system',
    /** 设备模块 */
    device: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/device/api/device',
    /** 备件模块 */
    spare: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/spare/',
    /** 商业模块 */
    business: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/business',
    /** 审批模块 */
    approval: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/approval',
    /** 附件管理 */
    accessory: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/accessory',
    /** 资料库 */
    database: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/database',  //服务器地址
    // /** 专家智库 */
    expert: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/expert',  //服务器地址
    /** 文件服务器地址 */
    accessoryFile: 'http://10.160.244.247:9000/tpms',
    log: 'http://tpms-gateway-runtime.ci-testapps.ocp.sitc/log',  // 日志地址

    sap: 'http://svlpod01.csvw.com:50000/RESTAdapter/rest/dongchang/ZMDCIF_TPMS_MATKC', // SAP 备件库存接口
    sapUsername: 'TPMS_PI_D',
    sapPassword: 'Abcd123456',
}
