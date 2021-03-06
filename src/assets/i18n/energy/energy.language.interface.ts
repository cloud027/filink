/**
 * 能耗 国际化接口
 */
export interface EnergyLanguageInterface {
  config: {
    statisticsMonth: string
    statisticsDay: string
    statisticsHour: string
    statisticsProject: string
    statisticsRegion: string
    statisticsLoop: string
    ActualElectricityConsumption: string
    TargetPowerConsumption: string
    EnergySavingRate: string
    Proportion: string
    electricityFees: string
    deleteConfim: string
    successful: string
    exportSuccess: string
    confirm: string
    result: string
    cancel: string
  };
  picInfo: {
    pleaseChoose: string
    mustChooseOne: string
    pleaceChooseSelected: string
    selectContent: string
    pleaseChooseStatis: string
    pleaseChooseTimeStatis: string
    chooseMonth: string
    chooseYear: string
    pleacrChooseTimeRange: string
    importTask: string
    selectTimeDisabled: string
    pleaseChooseEquipmentType: string
    day: string
  };
  checkout: string;
  devProject: string;
  testProject: string;
  serialNumber: string;
  // 能耗节点
  [propName: string]: any;
  energyNodes: string;
  equipmentCodeExist: string;
  insertEnergyNodes: string;
  editEnergyNodes: string;
  selectExistingDevice: string;
  existingEquipment: string;
  yes: string;
  no: string;
  energyConsumptionName: string;
  productTypeId: string;
  productModel: string;
  supplier: string;
  softwareVersionNumber: string;
  hardwareVersionNumber: string;
  nodeList: string;
  equipmentId: string;
  projectId: string;
  areaId: string;
  collectDeviceId: string;
  collectEquipmentId: string;
  collectLoopId: string;
  communicationEquipment: string;
  wisdom: string;
  mountPosition: string;
  gatewayPort: string;
  communicationStatus: string;
  energyConsumptionTarget: string;
  detailedAddress: string;
  remarks: string;
  add: string;
  delete: string;
  operate: string;
  importEquipment: string;
  selectImport: string;
  cancelText: string;
  okText: string;
  downloadTemplate: string;
  fileTypeTips: string;
  selectFileTips: string;
  importEnergyNodesSuccess: string;
  exportEnergyNodesSuccess: string;
  deleteEnergyNodesSuccess: string;
  deleteEnergyNodesFail: string;
  insertEnergyNodesSuccess: string;
  updateEnergyNodesSuccess: string;
  deleteEnergyNodesMsg: string;
  deleteHandle: string;
  updateHandle: string;
  detailHandle: string;
  handleOk: string;
  handleCancel: string;
  selectFile: string;
  selectEquipment: string;
  nodesDetails: {
    nodesDetails: string
    creationTime: string
    project: string
    deviceCode: string
    region: string
    communicationEquipment: string
    energyConsumptionTarget: string
    detailedAddress: string
    remarks: string
    nodeOperation: string
    deleteHandle: string
    updateHandle: string
    nodeAcquisition: string
    collectDeviceId: string
    collectEquipmentId: string
    collectLoopId: string
    facilityName: string
    facilityType: string
    model: string
    meter: string
    numberOfEquipment: string
    facilityStatus: string
    facilities: string
    circuitName: string
    circuitNumber: string
    circuitType: string
    circuitStatus: string
    distributionBox: string
    controlObject: string
    equipmentName: string
    equipmentType: string
    equipmentStatus: string
  };

  // 实时数据
  energyRealTimeData: string;
  dataAcquisitionCycle: string;
  inputVoltage: string;
  inputCurrent: string;
  power: string;
  aphaseVoltage: string;
  bphaseVoltage: string;
  cphaseVoltage: string;
  avgphaseVoltage: string;
  ablineVoltage: string;
  bclineVoltage: string;
  calineVoltage: string;
  avglineVoltage: string;
  aphaseCurrent: string;
  bphaseCurrent: string;
  cphaseCurrent: string;
  totalCurrent: string;
  leakageCurrent: string;
  aphaseActivePower: string;
  bphaseActivePower: string;
  cphaseActivePower: string;
  totalphaseActivePower: string;
  totalactiveElectricEnergy: string;
  aphaseReactivePower: string;
  bphaseReactivePower: string;
  cphaseReactivePower: string;
  totalReactivePower: string;
  totalReactiveEnergy: string;
  aphasePowerFactor: string;
  bphasePowerFactor: string;
  cphasePowerFactor: string;
  totalPowerFactor: string;
  collectionPeriod: string;
  acquisitionCycle: string;
  configurationScope: string;
  meteringNode: string;
  hourly: string;
  dayByDay: string;
  monthByMonth: string;
  errorTip_collectionPeriod: string;
  errorTip_acquisitionCycle: string;
  errorTip_configurationScope: string;
  taskName: string;
  founder: string;
  creationTime: string;
  updateTime: string;
  InsertDataAcquisitionTask: string;
  UpdateDataAcquisitionTask: string;
  collectionTime: string;
  status: string;
  collectionTaskStatusType: {
    inExecution: string
    notStarted: string
    completed: string
    error: string
    successExecution: string
  };
  selectLastOneMonth: string;
  enableStatus: string;
  Enable: string;
  Disable: string;
  hasEnableData: string;
  hasDisableData: string;
  scopeOfApplication: string;
  taskOperation: string;
  tabConfig: {
    areaList: string
    groupList: string
    groupDetail: string
    equipmentList: string
  };
  grouping: string;
  equipment: string;
  dataAcquisitionTaskDetails: string;

  // 能耗统计
  energyStatistics: string;
  selectArea: string;
  selectProject: string;
  reset: string;
  statistics: string;
  dayEnergyConsumption: string;
  monthEnergyConsumption: string;
  quarterEnergyConsumption: string;
  yearEnergyConsumption: string;
  electricityRanking: string;
  energyConsumption: string;
  energyTarget: string;
  saveEnergyPercent: string;
  statisticRanking: string;
  dailyEnergy: string;
  monthEnergy: string;
  yearEnergy: string;
  descendingOrder: string;
  ascendingOrder: string;
  proportion: string;
  energyStatisticsList: string;
  energyStatisticsListTable: {
    project: string
    region: string
    loop: string
    actualEnergy: string
    energyRating: string
    energySavingRate: string
    electricityCharge: string
  };
  powerRate: string;
  analysis: string;
  tariffStrategy: string;
  tariffStrategyName: string;
  viewDetail: string;
  deleteElectricStrategrMsg: string;
  insertTariffStrategy: string;
  step: {
    basicInfo: string
    strategyDetails: string
    done: string
  };
  basicInfoForm: {
    tariffStrategyName: string
    scopeOfApplication: string
    region: string
    project: string
    remarks: string
  };
  electricStrategy: {
    basicElectricityPrice: string
    addPolicy: string
    addMonthPolicy: string
    addHourPolicy: string
    startingPower: string
    endOfCharge: string
    startMonth: string
    endMonth: string
    startTime: string
    endTime: string
    unitPriceOfElectricity: string
    powerRange: string
    monthRange: string
    timeRange: string
    timePeriodCrossingErrTip: string
  };
  powerRange: string;
  unitPriceOfElectricity: string;
  doneComponent: {
    basicInformationOfStrategy: string
    basicInfo: string
    nameOfElectricityChargeStrategy: string
    scopeOfApplication: string
    remarks: string
    areaName: string
    region: string
    regionalLevel: string
    detailedAddress: string
    responsibleUnit: string
    strategyDetails: string
  };
  strategyInfo: {
    strategyInfo: string
    creationTime: string
    scopeOfApplication: string
    remarks: string
    basicOperationOfStrategy: string
    deleteHandle: string
    updateHandle: string
    areaName: string
    region: string
    regionalLevel: string
    detailedAddress: string
    responsibleUnit: string
    strategyDetails: string
    confirmDelete: string
  };

  // 能耗分析
  energyAnalysis: string;
  energyConsumptionDump: string;
  energyDumpSettings: string;
  date: string;
  month: string;
  year: string;
  enableEnergyConsumptionDataLogDump: string;
  triggerConditions: string;
  quantityOverrun: string;
  monthlyExecution: string;
  dumpQuantityThreshold: string;
  numberOfTransferOut: string;
  dumpInterval: string;
  postDumpOperation: string;
  deleteDataOnly: string;
  deleteAndSaveDataFile: string;
  dumpLocation: string;
  dumpToLocal: string;
  dumpToFileServer: string;
  save: string;
  cancel: string;
  restoreDefault: string;
  immediateExecution: string;
}
