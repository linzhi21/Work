export const sparePartFormList = [ // 渲染头部功能区的列表
  { label: "名称|型号", props: "descSpec", value: "" },
  { label: "DC编号", props: "dcMatNum", value: "" },
  { label: "SVW编号", props: "svwMatNum", value: "" },
  { label: "产品码描述", props: "prodCodeDesc", value: "" },
  {
    label: "是否常用",
    props: "common",
    value: "",
    type: "radio",
    checkList: [
      { label: "是", id: true },
      { label: "否", id: false }
    ]
  },
  {
    label: "制造商", props: "mfr", value: ""
  },
  {
    label: "制造商编号", props: "mfrNo", value: ""
  }
];

export const sparePartTableList = [
  {
    type: "selection",
    width: "auto"
  },
  { props: "dcMatNum", label: "DC编号", width: "auto" },
  { props: "svwMatNum", label: "SVW编号", width: "auto" },
  {
    props: "descSpec",
    label: "名称|型号",
    width: "240px"
  },
  { props: "prodCodeDesc", label: "产品码描述", width: "240px" },
  {
    props: "common",
    label: "是否常用",
    translate: val => (val ? "常用" : "不常用")
  },
  { props: "price", label: "原值(元)" },
  { props: "unit", label: "单位" },
  { props: "mfr", label: "制造商" },
  { props: "mfrNo", label: "制造商编号" },
  { props: "abcCode", label: "ABC类" },
  {
    label: "操作",
    slotName: "operation",
    fixed: "right",
    width: "auto"
  }
];

export const sparePartDialogFormList = [ // 渲染备件详情对话框中的form表单内容
  { props: "dcMatNum", label: "DC编号" },
  { props: "svwMatNum", label: "SVW编号" },
  { props: "name", label: "物料名称(中|英文)" },
  { props: "specification", label: "物料规格型号" },
  { props: "unit", label: "单位" },
  { props: "price", label: "单价" },
  {
    props: "common",
    label: "是否常用",
    type: "radio",
    checkList: [
      { label: "是", id: true },
      { label: "否", id: false }
    ]
  },
  { props: "ogSpec", label: "原规格" },
  { props: "mfr", label: "制造商" },
  { props: "mfrNo", label: "制造商编号" }
];

export const handleWaySelect = [
  // 处理方式下拉选择框内容
  { label: "工业垃圾", value: 1, disabled: price => price <= 1000 },
  { label: "报废备件", value: 2, disabled: price => price > 1000 },
  { label: "修复备件", value: 4 }
];
export const repairTypeSelect = [
  // 处理类型下拉选择框内容
  { label: "委内维修", value: 1 },
  { label: "委外维修", value: 2 }
];
export const scrapTypeSelect = [
  { label: "金属报废", value: 1 },
  { label: "非金属报废", value: 2 }
];