/**
 * 能耗 国际化中文
 */
export default {
  config: {
    statisticsMonth: '年',
    statisticsDay: '月',
    statisticsHour: '日',
    statisticsProject: '项目',
    statisticsRegion: '区域',
    statisticsLoop: '回路',
    ActualElectricityConsumption: '实际用电量(kW·h)',
    TargetPowerConsumption: '目标用电量(kW·h)',
    EnergySavingRate: '节能率(%)',
    Proportion: '占比(%)',
    electricityFees: '电费(元)',
    deleteConfim: '确认删除？',
    successful: '执行成功',
    exportSuccess: '导出成功',
    confirm: '确认',
    result: '重置',
    cancel: '取消',
  },
  picInfo: {
    pleaseChoose: '请选择',
    mustChooseOne: '采集设施,采集设备,采集回路至少三选一',
    pleaceChooseSelected: '请先选择已有设备',
    selectContent: '选择内容',
    pleaseChooseStatis: '统计范围',
    pleaseChooseTimeStatis: '时间范围',
    chooseMonth: '请选择月',
    chooseYear: '请选择年',
    pleacrChooseTimeRange: '请选择统计的条件或时间范围',
    importTask: '导入数据正在后台执行，请耐心等待系统提示信息',
    selectTimeDisabled: '结束时间与开始时间间隔不得大于',
    pleaseChooseEquipmentType: '请先选择设备类型',
    day: '天',
  },
  checkout: '查看',
  testProject: '测试项目',
  devProject: '开发项目',
  serialNumber: '序号',
  energyNodes: '能耗节点',
  equipmentCodeExist: '资产编码已经存在',
  insertEnergyNodes: '新增能耗节点',
  editEnergyNodes: '编辑能耗节点',
  selectExistingDevice: '是否从已有设备选择',
  existingEquipment: '已有设备',
  yes: '是',
  no: '否',
  energyConsumptionName: '名称',
  productTypeId: '类型',
  productModel: '型号',
  supplier: '供应商',
  softwareVersionNumber: '软件版本号',
  hardwareVersionNumber: '硬件版本号',
  nodeList: '节点列表',
  equipmentId: '设备ID',
  projectId: '项目',
  areaId: '区域',
  collectDeviceId: '采集设施',
  wisdom: '智慧杆',
  mountPosition: '挂载位置',
  collectEquipmentId: '采集设备',
  collectLoopId: '采集回路',
  communicationEquipment: '通信设备',
  gatewayPort: '网关端口',
  communicationStatus: '通信设备状态',
  energyConsumptionTarget: '能耗目标值(kW·h)',
  detailedAddress: '详细地址',
  remarks: '备注',
  add: '增加',
  delete: '删除',
  operate: '操作',
  importEquipment: '导入',
  selectImport: '选择导入文件',
  cancelText: '取消',
  okText: '确定',
  downloadTemplate: '模板下载',
  fileTypeTips: '文件类型为EXCEL！',
  selectFileTips: '请先选择文件！',
  importEnergyNodesSuccess: '导入能耗节点成功',
  exportEnergyNodesSuccess: '导出能耗节点成功',
  deleteEnergyNodesSuccess: '删除能耗节点成功',
  deleteEnergyNodesFail: '删除失败原因描述：当前节点正在被调用能耗统计分析',
  insertEnergyNodesSuccess: '新增能耗节点成功',
  updateEnergyNodesSuccess: '更新能耗节点成功',
  deleteEnergyNodesMsg: '确定删除能耗节点？',
  deleteHandle: '删除',
  updateHandle: '编辑',
  detailHandle: '详情',
  handleOk: '确定',
  handleCancel: '取消',
  selectFile: '选择文件',
  selectEquipment: '请先选择设备类型',
  nodesDetails: {
    nodesDetails: '节点详情',
    creationTime: '创建时间',
    project: '项目',
    deviceCode: '资产编码',
    region: '区域',
    communicationEquipment: '通信设备',
    energyConsumptionTarget: '能耗目标值(kW·h)',
    detailedAddress: '详细地址',
    remarks: '备注',
    nodeOperation: '节点操作',
    deleteHandle: '删除',
    updateHandle: '编辑',
    nodeAcquisition: '节点采集',
    collectDeviceId: '采集设施',
    collectEquipmentId: '采集设备',
    collectLoopId: '采集回路',
    facilityName: '设施名称',
    facilityType: '设施类型',
    facilityStatus: '设施状态',
    numberOfEquipment: '设备数量',
    equipmentName: '设备名称',
    equipmentType: '设备类型',
    equipmentStatus: '设备状态',
    facilities: '所属设施',
    model: '型号',
    meter: '电表',
    circuitName: '回路名称',
    circuitNumber: '回路编号',
    circuitType: '回路类型',
    circuitStatus: '回路状态',
    distributionBox: '所属配电箱',
    controlObject: '控制对象',
  },

  // 实时数据
  energyRealTimeData: '实时数据',
  dataAcquisitionCycle: '数据采集任务',
  inputVoltage: '输入电压(V)',
  inputCurrent: '输入电流(A)',
  power: '功率(KW)',
  aphaseVoltage: 'A相电压(V)',
  bphaseVoltage: 'B相电压(V)',
  cphaseVoltage: 'C相电压(V)',
  avgphaseVoltage: '相平均电压(V)',
  ablineVoltage: 'AB线电压(V)',
  bclineVoltage: 'BC线电压(V)',
  calineVoltage: 'CA线电压(V)',
  avglineVoltage: '线平均电压(V)',
  aphaseCurrent: 'A相电流(A)',
  bphaseCurrent: 'B相电流(A)',
  cphaseCurrent: 'C相电流(A)',
  totalCurrent: '总电流(A)',
  leakageCurrent: '漏电流(A)',
  aphaseActivePower: 'A相有功功率(KW)',
  bphaseActivePower: 'B相有功功率(KW)',
  cphaseActivePower: 'C相有功功率(KW)',
  totalphaseActivePower: '总有功功率(KW)',
  totalactiveElectricEnergy: '总有功电能(kW·h)',
  aphaseReactivePower: 'A相无功功率(KW)',
  bphaseReactivePower: 'B相无功功率(KW)',
  cphaseReactivePower: 'C相无功功率(KW)',
  totalReactivePower: '总无功功率(KW)',
  totalReactiveEnergy: '总无功电能(kW·h)',
  aphasePowerFactor: 'A相功率因数',
  bphasePowerFactor: 'B相功率因数',
  cphasePowerFactor: 'C相功率因数',
  totalPowerFactor: '总功率因数',
  collectionPeriod: '采集时段',
  acquisitionCycle: '采集周期',
  configurationScope: '配置范围',
  meteringNode: '计量节点',
  hourly: '逐时',
  dayByDay: '逐天',
  monthByMonth: '逐月',
  errorTip_collectionPeriod: '请选择采集时段',
  errorTip_acquisitionCycle: '请选择采集周期',
  errorTip_configurationScope: '请选择配置范围',
  taskName: '任务名称',
  founder: '创建人',
  creationTime: '创建时间',
  updateTime: '更新时间',
  InsertDataAcquisitionTask: '新增数据采集任务',
  UpdateDataAcquisitionTask: '编辑数据采集任务',
  collectionTime: '采集时间',
  status: '状态',
  collectionTaskStatusType: {
    inExecution: '执行中',
    notStarted: '未开始',
    completed: '已完成',
    error: '执行失败',
    successExecution: '执行成功',
  },
  selectLastOneMonth: '最少选择一个月有效期',
  enableStatus: '启用状态',
  Enable: '启用',
  Disable: '禁用',
  hasEnableData: '所选任务有已启用状态，请重新选择',
  hasDisableData: '所选任务有已禁用状态，请重新选择',
  scopeOfApplication: '应用范围',
  taskOperation: '任务操作',
  tabConfig: {
    areaList: '区域列表',
    groupList: '分组列表',
    groupDetail: '分组详情',
    equipmentList: '能耗节点列表',
  },
  grouping: '分组',
  equipment: '设备',
  dataAcquisitionTaskDetails: '数据采集任务详情',

  // 能耗统计
  energyStatistics: '能耗统计',
  selectArea: '选择区域',
  selectProject: '选择项目',
  reset: '重置',
  statistics: '统计',
  dayEnergyConsumption: '今日总能耗',
  monthEnergyConsumption: '本月总能耗',
  quarterEnergyConsumption: '本季度总能耗',
  yearEnergyConsumption: '本年总能耗',
  electricityRanking: '电费排名',
  energyConsumption: '实际用电量(kW·h)',
  energyTarget: '额定用电量(kW·h)',
  saveEnergyPercent: '节能率(%)',
  statisticRanking: '统计排名',
  dailyEnergy: '日能耗',
  monthEnergy: '月能耗',
  yearEnergy: '年能耗',
  descendingOrder: '降序',
  ascendingOrder: '升序',
  proportion: '占比(%)',
  energyStatisticsList: '能耗统计列表',
  energyStatisticsListTable: {
    project: '项目',
    region: '区域',
    loop: '回路',
    actualEnergy: '能耗实际值(kW·h)',
    energyRating: '能耗额定值(kW·h)',
    energySavingRate: '节能率(%)',
    electricityCharge: '电费(元)',
  },
  powerRate: '电费策略',
  analysis: '分析',
  tariffStrategy: '电费策略',
  tariffStrategyName: '电费策略名称',
  viewDetail: '查看详情',
  deleteElectricStrategrMsg: '确定删除电费策略吗?',
  insertTariffStrategy: '新增电费策略',
  step: {
    basicInfo: '基本信息',
    strategyDetails: '策略详情',
    done: '完成',
  },
  basicInfoForm: {
    tariffStrategyName: '电费策略名称',
    scopeOfApplication: '应用范围',
    region: '区域',
    project: '项目',
    remarks: '备注',
  },
  electricStrategy: {
    basicElectricityPrice: '基础电价(元/kW·h)',
    addPolicy: '添加策略',
    addMonthPolicy: '添加月策略',
    addHourPolicy: '添加小时策略',
    startingPower: '起始电量(kWh)',
    endOfCharge: '终止电量(kWh)',
    startMonth: '起始月份',
    endMonth: '终止月份',
    startTime: '起始时间',
    endTime: '终止时间',
    unitPriceOfElectricity: '电费单价(元/kW·h)',
    powerRange: '电量范围',
    monthRange: '月份范围',
    timeRange: '时间范围',
    timePeriodCrossingErrTip: '结束时间不能大于开始时间',
  },
  powerRange: '电量范围',
  unitPriceOfElectricity: '电量单价',
  doneComponent: {
    basicInformationOfStrategy: '策略基本信息',
    basicInfo: '基本信息',
    nameOfElectricityChargeStrategy: '电费策略名称',
    scopeOfApplication: '应用范围',
    remarks: '备注',
    areaName: '区域名称',
    region: '所属区域',
    regionalLevel: '区域级别',
    detailedAddress: '详细地址',
    responsibleUnit: '责任单位',
    strategyDetails: '策略详情',
  },
  strategyInfo: {
    strategyInfo: '策略详情',
    creationTime: '创建时间',
    scopeOfApplication: '应用范围',
    remarks: '备注',
    basicOperationOfStrategy: '策略基本操作',
    deleteHandle: '删除',
    updateHandle: '编辑',
    areaName: '区域名称',
    region: '所属区域',
    regionalLevel: '区域级别',
    detailedAddress: '详细地址',
    responsibleUnit: '责任单位',
    strategyDetails: '策略详情',
    confirmDelete: '确认删除该节点吗?',
  },

  // 能耗分析
  energyAnalysis: '能耗分析',
  energyConsumptionDump: '能耗转储',
  energyDumpSettings: '能耗转储设置',
  date: '日期',
  month: '月份',
  year: '年份',
  enableEnergyConsumptionDataLogDump: '启用能耗数据日志转储',
  triggerConditions: '触发条件',
  quantityOverrun: '数量超限',
  monthlyExecution: '按月执行',
  dumpQuantityThreshold: '转储数量阈值',
  dumpInterval: '转储时间间隔',
  numberOfTransferOut: '转出条数',
  postDumpOperation: '转储后操作',
  deleteDataOnly: '仅删除数据',
  deleteAndSaveDataFile: '删除并保存数据文件',
  dumpLocation: '转储位置',
  dumpToLocal: '转储到本地',
  dumpToFileServer: '转储到文件服务器',
  save: '保存',
  cancel: '取消',
  restoreDefault: '恢复默认',
  immediateExecution: '立即执行',
};
