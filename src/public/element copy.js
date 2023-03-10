import Vue from 'vue'
// 按需引入element.js中的组件
import {
  Loading,checkbox,Form, FormItem, Card, Input, Button, Message, Container, Aside, Main, Row, Col, Menu, MenuItem, Submenu, MenuItemGroup, Breadcrumb, BreadcrumbItem, progress, Table, TableColumn, Upload, Dialog, Pagination, Dropdown, DropdownMenu, DropdownItem, Radio, RadioGroup, Select, Option, OptionGroup, DatePicker, MessageBox, Drawer, Popover, Switch, Notification, Tooltip, InputNumber, Tabs, TabPane,Tree,TimePicker,
  Header
} from 'element-ui'

Vue.use(Loading)
Vue.use(checkbox)
Vue.use(TimePicker)
Vue.use(Tree)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Card)
Vue.use(Input)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(progress)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.use(Drawer)
Vue.use(Popover)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(InputNumber)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(OptionGroup)
Vue.use(Header)

Vue.prototype.$message=Message;
Vue.prototype.$confirm=MessageBox.confirm;
Vue.prototype.$notify=Notification;
