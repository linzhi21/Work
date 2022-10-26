export const userFormList = [
  { label: "工厂名称", props: "name", value: "" },
  { label: "工厂编号", props: "no", value: "" }
];

/**
 * 工厂设置
 */
export const formList = [
  {
    props: "name",
    label: "工厂名称",
    span: 12,
    type: "input"
  },
  {
    props: "no",
    label: "工厂简称/代号",
    span: 12,
    type: "input"
  },
  {
    props: "address",
    label: "工厂地址",
    span: 24,
    type: "input"
  },
  {
    props: "description",
    label: "工厂描述",
    span: 24,
    type: "textarea",
    rows: 5
  },
  {
    props: "sapNo",
    label: "SAP工厂编号",
    span: 24,
    type: "input",
  }
];

export const workShopFormList = [
  {
    props: "name",
    label: "车间名称",
    span: 12,
    type: "input"
  },
  {
    props: "no",
    label: "车间简称/代号",
    span: 12,
    type: "input"
  },
  {
    props: "enable",
    label: "状态",
    span: 24,
    type: "radio",
    radioList: [
      {
        label: "启用",
        id: true
      },
      {
        label: "禁用",
        id: false
      }
    ]
  },
  {
    props: "description",
    label: "车间描述",
    span: 24,
    type: "textarea",
    rows: 5
  },
  {
    props: "managerId",
    label: "车间负责人",
    span: 24,
    type: "checkbox",
    checkList: [],
  }
];

export const tableHeaderList = [
  {
    props: "no",
    label: "工厂编号"
  },
  {
    props: "name",
    label: "工厂名称"
  },
  {
    props: "description",
    label: "工厂描述"
  },
  {
    props: "managerName",
    label: "工厂负责人"
  },
  {
    label: "操作",
    slotName: "operation",
    fixed: "right",
    width: "240px"
  }
];

export const rules = {
  name: [
    {
      required: true,
      message: "请输入工厂名称",
      trigger: "blur"
    }
  ],
  no: [
    {
      required: true,
      message: "请输入工厂编号",
      trigger: "blur"
    }
  ],
  managerId: [
    {
      required: true,
      message: "请选择工厂负责人",
      trigger: "change"
    }
  ]
};

export const workshoprules = {
  name: [
    {
      required: true,
      message: "请输入车间名称",
      trigger: "blur"
    }
  ],
  no: [
    {
      required: true,
      message: "请输入车间编号",
      trigger: "blur"
    }
  ],
  managerId: [
    {
      required: true,
      message: "请选择工厂负责人",
      trigger: "blur"
    }
  ]
};