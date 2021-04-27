export const equipmentFormList = [
  //  渲染头部功能区的列表
  {
    label: "设备名称",
    props: "name",
    value: ""
  },
  {
    label: "设备编号",
    props: "no",
    value: ""
  },
  {
    label: "设备状态",
    props: "deviceStatus",
    value: "",
    type: "radio",
    checkList: deviceStatus
  },
  {
    label: "区域",
    props: "areaId",
    value: "",
    type: "radio",
    checkList: workshopAreas
  },
  {
    label: "车间",
    props: "workshopId",
    value: "",
    type: "radio",
    checkList: workshops
  },
  {
    label: "封存状态",
    props: "archiveState",
    value: "",
    type: "radio",
    checkList: [
      {
        label: "已封存",
        id: true
      },
      {
        label: "未封存",
        id: false
      }
    ]
  }
]