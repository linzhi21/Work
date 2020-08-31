<template>
    <div class="home-content">
        <!-- 头部四色卡片区 -->
        <el-row :gutter="10">
            <el-col :span="6">
                <el-card class="card first-card">
                    <div class="left">
                        <p>当前班次</p>
                        <p>{{worKClass}}</p>
                    </div>
                     <div class="right">
                        <p>用户角色</p>
                        <p>{{persionalRole}}</p>
                    </div>
                    <p class="separator"></p>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="card second-card">
                    <p>设备明细</p>
                    <p>
                        <span>{{equipment[0].name}}</span> 
                        <el-progress class="failure-equipment" :show-text='false' :percentage="20" color="#fff"></el-progress>
                        <i>{{equipment[0].num}}</i>
                    </p>
                    <p>
                        <span>{{equipment[1].name}}</span> 
                        <el-progress class="normal-equipment" :show-text='false' :percentage="60" color="#fff"></el-progress>
                        <i>{{equipment[1].num}}</i>
                    </p>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="card third-card">
                     <p>审批管理</p>
                    <p>
                        <span>{{approve[0].name}}</span> 
                        <el-progress class="not-reply" :show-text='false' :percentage="20" color="#fff"></el-progress>
                        <i>{{approve[0].num}}</i>
                    </p>
                    <p>
                        <span>{{approve[1].name}}</span> 
                        <el-progress class="reply" :show-text='false' :percentage="60" color="#fff"></el-progress>
                        <i>{{approve[1].num}}</i>
                    </p>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="card fourth-card">
                    <p>备件修复明细</p>
                    <div class="list">
                        <p>387</p>
                        <p class="small">正常设备</p>
                    </div>
                    <div class="list">
                        <p>129</p>
                        <p class="small">已修复</p>
                    </div>
                    <div class="list">
                        <p>98</p>
                        <p class="small">故障设备</p>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 任务单的区域 -->
        <el-row :gutter="10">
            <el-col :span="6" v-for="(item,index) in taskOrder" :key="index">
                <el-card class="task-list spot-check-list">
                    <h4 class="list-name">{{item.orderName}}</h4>
                    <div class="list-box">
                        <div class="progress">
                            <el-progress  type="dashboard" :width='100' :show-text='false' :percentage="40"></el-progress>
                            <div class="overtime-work-order">
                                <p>{{item.overtimeWorkOrder}}</p>
                                <span>超时工单</span>
                            </div>
                        </div>
                        <div class="list-content">
                            <div class="list-content-card data-not-reply">
                                <p class="selected">{{item.dataNotReply}}</p>
                                <span>当日待处理</span>
                            </div>
                            <div class="list-content-card data-reply">
                                <p>{{item.dataReply}}</p>
                                <span>当日已处理</span>
                            </div>
                            <div class="list-content-card month-reply">
                                <p>{{item.MonthReply}}</p>
                                <span>当月已处理</span>
                            </div>
                            <div class="list-content-card reply-list">
                                <p>{{item.ReplyList}}</p>
                                <span>共处理工单</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <!-- 图表区 -->
        <el-row :gutter="10">
            <el-col :span="8">
                <el-card class="prop-card">
                    <h4>设备故障类别占比</h4>
                    <div class="equipment-failure-chart"></div>
                </el-card>
                <el-card class="large-failure prop-card">
                    <h4>大故障发生占比</h4>
                    <div class="large-failure-chart"></div>
                </el-card>
            </el-col>
            <el-col :span="7">
                <el-card class="replacement-part">
                    <h4>备件领用/报废明细</h4>
                    <div class="replacement-part-chart"></div>
                </el-card>
            </el-col>
            <el-col :span="9">
                <div class="unrequired-equipment">
                    <h4>未修理设备</h4>
                    <el-table
                        :data="unrequiredEquipmentData"
                        >
                        <el-table-column
                            align="center"
                            prop="equipmentName"
                            label="设备名称">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="equipmentNumber"
                            label="设备编号">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="equipmentArea"
                            label="区域"
                            >
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="repairsTime"
                            label="报修时间"
                            min-width="140">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
// 导入echarts图表库
import echarts from 'echarts'
export default {
    data(){
        return{
            worKClass:'A班',        // 工作班次
            persionalRole:'操作工',     // 用户角色
            equipment:[             // 设备明细内容
                {name:'故障设备',num:40},
                {name:'正常设备',num:290},
            ],
            approve:[             // 审批管理内容
                {name:'待回复',num:40},
                {name:'已回复',num:290},
            ],
            taskOrder:[         // 任务单内容
                {orderName:'点检任务单',overtimeWorkOrder:23,dataNotReply:36,dataReply:98,MonthReply:387,ReplyList:482},
                {orderName:'巡检任务单',overtimeWorkOrder:23,dataNotReply:36,dataReply:98,MonthReply:387,ReplyList:482},
                {orderName:'保养任务单',overtimeWorkOrder:23,dataNotReply:36,dataReply:98,MonthReply:387,ReplyList:482},
                {orderName:'维修任务单',overtimeWorkOrder:23,dataNotReply:36,dataReply:98,MonthReply:387,ReplyList:482}
            ],
            unrequiredEquipmentData:[       // 未修理设备数据
                {equipmentName:'大设备',equipmentNumber:'abcdefg',equipmentArea:'A区域',repairsTime:'2019-04-13 11:40'},
                {equipmentName:'大设备',equipmentNumber:'abcdefg',equipmentArea:'A区域',repairsTime:'2019-04-13 11:40'},
                {equipmentName:'大设备',equipmentNumber:'abcdefg',equipmentArea:'A区域',repairsTime:'2019-04-13 11:40'},
                {equipmentName:'大设备',equipmentNumber:'abcdefg',equipmentArea:'A区域',repairsTime:'2019-04-13 11:40'},
                {equipmentName:'大设备',equipmentNumber:'abcdefg',equipmentArea:'A区域',repairsTime:'2019-04-13 11:40'}
            ]
        }
    },
    methods:{
        /**
         * @description 加载设备故障图表数据
         */
        showEquipmentFailureChart(){
            // 设备故障图表
            const equipmentFailureChart=echarts.init(document.getElementsByClassName('equipment-failure-chart')[0])
            const equipmentFailureOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: ['直接访问', '邮件营销', '联盟广告', '视频广告']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 335, name: '直接访问'},
                            {value: 310, name: '邮件营销'},
                            {value: 234, name: '联盟广告'},
                            {value: 135, name: '视频广告'}
                        ]
                    }
                ]
            };
            equipmentFailureChart.setOption(equipmentFailureOption)
        },
        /**
         * @description 加载大故障发生占比图表
         */
        showLargeFailureChart(){
            // 大故障发生占比
            const largeFailureChart=echarts.init(document.getElementsByClassName('large-failure-chart')[0])
            const largeFailureOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: ['直接访问', '邮件营销', '联盟广告', '视频广告']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 335, name: '直接访问'},
                            {value: 310, name: '邮件营销'},
                            {value: 234, name: '联盟广告'},
                            {value: 135, name: '视频广告'}
                        ]
                    }
                ]
            };
            largeFailureChart.setOption(largeFailureOption)
        },
        /**
         * @description 展示备件领用/报废明细图表
         */
        showReplacementPartChart(){
             // 备件领用/报废明细图表
            const replacementPartChart=echarts.init(document.getElementsByClassName('replacement-part-chart')[0])
            const replacementPartOption={
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['2011年', '2012年']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['巴西','中国']
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                series: [
                    {
                        name: '2011年',
                        type: 'bar',
                        data: [18203,  131744]
                    },
                    {
                        name: '2012年',
                        type: 'bar',
                        data: [19325,  134141]
                    }
                ]
            }
            replacementPartChart.setOption(replacementPartOption)
        }
    },
    mounted(){
        const _this=this
        _this.showEquipmentFailureChart()
        _this.showLargeFailureChart()
        _this.showReplacementPartChart()
    }
}
</script>
<style lang="scss" scoped>
    .card{
        height: 1.5rem;
        color: #FFF;
        line-height: 0.3rem;
    }
    .first-card{
        overflow: hidden;
        background-color: #fb9f51;
        text-align: center;
        .left,.right{
            width: 49%;
            height: 100%;
            line-height: 0.5rem;
        }
        .left{
            float: left;
        }
        .right{
            float: right;
        }
        .separator{
            width: 2px;
            height: 1rem;
            margin-left: 49%;
            background-color: #FFF;
        }
    }
    .second-card{
        background-color: #287ff1;
        span{
            font-size: 0.14rem;
        }
        .failure-equipment{
            display: inline-block;
            width: 0.6rem;
        }
        .normal-equipment{
            display: inline-block;
            width: 1.5rem;
        }
    }
    .third-card{
        background-color: #37BB64;
        span{
            font-size: 0.14rem;
        }
        .not-reply{
            display: inline-block;
            width: 0.6rem;
        }
        .reply{
            display: inline-block;
            width:1.5rem;
        }
    }
    .fourth-card{
        overflow: hidden;
        background-color: #f6bb4b;
        .list{
            float: left;
            width: 33%;
            height: 0.4rem;
            margin-top: 0.1rem;
            text-align: center;
            .small{
                font-size: 0.14rem;
            }
        }
    }
    .task-list{
        min-height: 160px;
        height: 2rem;
        .list-name{
            margin-bottom: 0.2rem;
        }
       .list-box{
            display: flex;
            justify-content: space-around;
            width: 100%;
            .progress{
                width: 100px; 
                height: 1.2rem;
                overflow: hidden;
                position: relative;
                .overtime-work-order{
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                    height: 0.6rem;
                    text-align: center;
                    p{
                        font-size: 16px;
                        color:#287ff1;
                    }
                    span{
                        font-size: 12px;
                        color: #8b8b8b;
                    }
                }
            }
            .list-content{
                width: 130px;
                height: 1.4rem;
                .list-content-card{
                    float: left;
                    min-width: 64px;
                    text-align: center;
                }
                .selected{
                    color:#f68b2f;
                }
                p{
                    font-size: 0.24rem;
                }
                span{
                    font-size: 0.14rem;
                    color: #8b8b8b;
                }
            }
       }
    }
    .prop-card{
        height: 2.4rem;
        h4{
            margin-bottom: 10px;
        }
    }
    .large-failure{
        margin-top: 0.1rem;
    }
    .replacement-part{
        height: 5rem;
        h4{
            margin-bottom: 10px;
        }
    }
    .unrequired-equipment{
        height: 5rem;
        padding: 10px;
        box-sizing: border-box;
        overflow: hidden;
        background-color: #FFF;
        h4{
            margin-bottom: 10px;
        }
        
    }
    .equipment-failure-chart,.large-failure-chart{
        width: 100%;
        height: 1.8rem;
        
    }
    .replacement-part-chart{
        width: 100%;
        height: 4rem;
    } 
</style>