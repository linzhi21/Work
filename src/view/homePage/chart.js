
import echarts from "echarts";

export function deviceChart() {
  alert('123213123');
}

export function workorderDashboard(p) {
  const data = p.data;
  const orders = [
    {
      orderName: "点检任务单",
      orderType: 'single',
      waitCompletedCount: data.singleWaitCompletedCount,
      allCount: data.singleAllCount,
      completedCount: data.singleCompletedCount,
      rate: (data.singleAllCount==0) ? 0 : (data.singleCompletedCount/data.singleAllCount*100).toFixed(0)
    },
    {
      orderType: 'patrol',
      orderName: "巡检任务单",
      waitCompletedCount: data.patrolWaitCompletedCount,
      allCount: data.patrolAllCount,
      completedCount: data.patrolCompletedCount,
      rate: (data.patrolAllCount==0) ? 0 : (data.patrolCompletedCount/data.patrolAllCount*100).toFixed(0)
    },
    {
      orderType: 'maintain',
      orderName: "保养任务单",
      waitCompletedCount: data.maintainWaitCompletedCount,
      allCount: data.maintainAllCount,
      completedCount: data.maintainCompletedCount,
      rate: (data.maintainAllCount==0) ? 0 : (data.maintainCompletedCount/data.maintainAllCount*100).toFixed(0)
    },
    {
      orderType: 'repair',
      orderName: "维修任务单",
      waitCompletedCount: data.repairWaitCompletedCount,
      allCount: data.repairAllCount,
      completedCount: data.repairCompletedCount,
      rate: (data.repairAllCount==0) ? 0 : (data.repairCompletedCount/data.repairAllCount*100).toFixed(0)
    }
  ];
  return orders;
}

export function deviceAndEquipment(p) {
  const data = p.data;
  const equipment = [
    {
      label: '在线设备',
      value: '761'
    },
    {
      label: '已修复',
      value: data.repairCompletedCount
    },
    {
      label: '异常中',
      value: data.repairWaitCompletedCount,
      action: true,
      style: {'color': '#f6bb4b'}
    },
  ];
  return equipment;
}

export function wordorderNums(data) {
  const nums = data;
  nums.singleRate = (data.singleAllCount==0) ? 0 : Number((data.singleCompletedCount/data.singleAllCount*100).toFixed(0));
  nums.patrolRate = (data.patrolAllCount==0) ? 0 : Number((data.patrolCompletedCount/data.patrolAllCount*100).toFixed(0));
  nums.maintainRate = (data.maintainAllCount==0) ? 0 : Number((data.maintainCompletedCount/data.maintainAllCount*100).toFixed(0));
  nums.repairRate = (data.repairAllCount==0) ? 0 : Number((data.repairCompletedCount/data.repairAllCount*100).toFixed(0));

  return nums;
}
