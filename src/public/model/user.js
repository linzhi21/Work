export const editForm = {
  comment: '',
  createDate: '',
  email: '',
  enabled: '',
  expertsRoleType: '',
  gender: '',
  id: '',
  lastEditDate: '',
  lastEditorId: '',
  managerId: '',
  name: '',
  phone: '',
  uuid: '',
  workNo: '',
  userWorkshops: [
    {
      factoryId: null,
      workshopId: null,
      workshopAreaId: null,
      workshopSectionId: null,
      workshopTeamId: null,
      workStationId: null,
      workshopShiftId: null,
      roleIds: [],
      positionIds: [],
      selectLists: {
        factoryList: [],
        workshopList: [],
        workshopAreaList: [],
        workshopSectionList: [],
        workStationList: []
      }
    }
  ]
};

export const form = {
  workNo: '',
  name: '',
  gender: '',
  phone: '',
  email: '',
  workshopName: '',
  workshopSectionName: '',
  workshopTeamName: '',
  workStationName: '',
  workshopShiftName: '',
  positionCodeSum: '',
  roleCodeSum: "",
  workshopAreaName: ''
};

export const genderList = [{
  label: '男',
  id: 1
}, {
  label: '女',
  id: 2
}];

export const enabledList = [{
  label: '启用',
  id: true
}, {
  label: '禁用',
  id: false
}];

export const editFormList = [{
  props: 'workNo',
  label: '工号',
  span: 12,
  type: 'input'
},
{
  props: 'name',
  label: '姓名',
  span: 12,
  type: 'input'
},
{
  props: 'gender',
  label: '性别',
  translate: (value) => value == 2 ? '女' : '男',
  type: 'radio',
  radioList: [{
    label: '男',
    id: 1
  }, {
    label: '女',
    id: 2
  }]
},
{
  props: 'phone',
  label: '电话',
  span: 12,
  type: 'input'
},
{
  props: 'email',
  label: '邮箱',
  span: 12,
  type: 'input'
},
{
  props: 'workshopName',
  label: '车间',
  span: 12,
  type: 'radio',
  radioList: []
},
{
  props: 'enabled',
  label: '员工状态',
  type: 'radio',
  span: 12,
  radioList: [{
    label: '启用',
    id: true
  }, {
    label: '禁用',
    id: false
  }]
},
];

export const userFormList = [
  {
    label: "工厂",
    props: "factoryId",
    value: "",
    type: 'radio',
    checkList: []
  },
  {
    label: "车间",
    props: "workshopId",
    value: "",
    type: 'radio',
    checkList: []
  },
  {
    label: "区域",
    props: "workshopAreaId",
    value: "",
    type: 'radio',
    checkList: []
  },
  {
    label: "工段",
    props: "workshopSectionId",
    value: "",
    type: 'radio',
    checkList: []
  },
  {
    label: "工位",
    props: "workStationId",
    value: "",
    type: 'radio',
    checkList: []
  },
  {
    label: "班组",
    props: "workshopTeamId",
    value: "",
    type: 'radio',
    checkList: []
  },
  {
    label: "班次",
    props: "workshopShiftId",
    value: "",
    type: 'radio',
    checkList: []
  },
  {
    label: "岗位",
    props: "positionCodeSum",
    value: "",
    type: 'radio',
    checkList: []
  },
  {
    label: "角色",
    props: "roleId",
    value: "",
    type: 'radio',
    checkList: []
  },
  {
    label: "姓名",
    props: "name",
    value: "",
    type: 'input',
    checkList: []
  },
  {
    label: "工号",
    props: "workNo",
    value: ""
  },
  {
    label: "状态",
    props: "enabled",
    value: "",
    placeholder: '请选择员工状态',
    type: 'radio',
    checkList: [{
      label: '启用',
      id: true
    }, {
      label: '禁用',
      id: false
    }]
  },
];

export const userTableList = [{
  props: 'name',
  label: '用户名'
},
{
  props: 'workNo',
  label: '工号'
},
{
  props: 'name',
  label: '姓名'
},
{
  props: 'gender',
  label: '性别',
  translate: (value) => ({ 1: '男', 2: '女' }[value])
},
{
  props: 'phone',
  label: '电话'
},
{
  props: 'email',
  label: '邮箱'
},
// {
//   props: 'workshopName',
//   label: '车间'
// },
// {
//   props: 'workshopSectionName',
//   label: '工段'
// },
// {
//   props: 'workshopTeamName',
//   label: '班组'
// },
// {
//   props: 'workStationName',
//   label: '工位'
// },
// {
//   props: 'workshopShiftName',
//   label: '班次'
// },
// {
//   props: 'positions',
//   label: '岗位'
// },
// {
//   props: 'roles',
//   label: '角色'
// },
// {
//   props: 'workshopAreaName',
//   label: '区域'
// },
{
  props: 'enabled',
  label: '状态',
  translate: (value) => value == true ? '启用' : '禁用'
},
{
  label: "操作",
  slotName: "operation",
  fixed: "right",
  width: "230px",
}
];

/**
 * 用户下拉权限参数对象
 */
export const userDropDownType = {
  spareConsumingQueryUserByRoles: 'SPARE_CONSUMING_QUERY_USER_BY_ROLES', // 备件领用用户下拉

}