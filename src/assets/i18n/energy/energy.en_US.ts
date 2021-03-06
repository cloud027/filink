/**
 * 能耗 国际化英文
 */
export default {
  config: {
    statisticsMonth: 'Month',
    statisticsDay: 'Day',
    statisticsHour: 'Hour',
    statisticsProject: 'Project',
    statisticsRegion: 'Region',
    statisticsLoop: 'Loop',
    ActualElectricityConsumption: 'Actual Electricity Consumption(kW·h)',
    TargetPowerConsumption: 'Target Power Consumption(kW·h)',
    EnergySavingRate: 'Energy Saving Rate(%)',
    Proportion: 'Proportion(%)',
    electricityFees: 'Electricity Fees(RMB)',
    deleteConfim: 'Delete Confim?',
    successful: 'Successful',
    exportSuccess: 'Export Success',
    confirm: 'Confirm',
    result: 'Result',
    cancel: 'Cancel',
  },
  testProject: 'Test Project',
  devProject: 'Development Project',
  picInfo: {
    pleaseChoose: 'Please Choose',
    mustChooseOne:
      'Collection Facilities,Collection Equipment, Collection Circuit,  At least one out of three',
    pleaceChooseSelected: 'Please select an existing device first',
    selectContent: 'Select Content',
    pleaseChooseStatis: 'Statistical range',
    pleaseChooseTimeStatis: 'Time frame',
    chooseMonth: 'Choose Month',
    chooseYear: 'Choose Year',
    pleacrChooseTimeRange: 'Please Choose Time Range',
    importTask: 'The task has been issued, please wait patiently',
    selectTimeDisabled: 'There should be no interval between the end time and the start time',
    pleaseChooseEquipmentType: 'Please select the device type first',
    day: 'day',
  },

  checkout: 'Checkout',
  serialNumber: 'Serial Number',
  energyNodes: 'Energy Nodes',
  equipmentCodeExist: 'Equipment Code Exist',
  insertEnergyNodes: 'Insert Energy Nodes',
  editEnergyNodes: 'Edit Energy Nodes',
  selectExistingDevice: 'Select Existing Device',
  existingEquipment: 'Existing Equipment',
  yes: 'Yes',
  no: 'No',
  energyConsumptionName: 'Name',
  productTypeId: 'Type',
  productModel: 'Model',
  supplier: 'Supplier',
  softwareVersionNumber: 'Software Version Number',
  hardwareVersionNumber: 'Hardware Version Number',
  nodeList: 'Node List',
  equipmentId: 'DeviceId',
  projectId: 'Porject',
  areaId: 'Region',
  collectDeviceId: 'Collection Facilities',
  collectEquipmentId: 'Collection Equipment',
  collectLoopId: 'Collection Circuit',
  communicationEquipment: 'Communication',
  gatewayPort: 'Gateway Port',
  wisdom: 'Wisdom',
  mountPosition: 'Mount Position',
  communicationStatus: 'Communication Status',
  energyConsumptionTarget: 'Target Value(kW·h)',
  detailedAddress: 'Detailed Address',
  remarks: 'Remarks',
  add: 'Add',
  delete: 'Delete',
  operate: 'Operate',
  importEquipment: 'Import Equipment',
  selectImport: 'Select Import File',
  cancelText: 'Cancel',
  okText: 'OK',
  downloadTemplate: 'DownloadTemplate',
  fileTypeTips: 'File Type Tips！',
  selectFileTips: 'Select File ！',
  importEnergyNodesSuccess: 'Import Energy Nodes Success',
  exportEnergyNodesSuccess: 'Export Energy Nodes Success',
  deleteEnergyNodesSuccess: 'Delete Energy Nodes Success',
  deleteEnergyNodesFail:
    'Deletion failure reason description: the current node is being called energy consumption statistical analysis',
  insertEnergyNodesSuccess: 'Insert Energy Nodes Success',
  updateEnergyNodesSuccess: 'Update Energy Nodes Success',
  deleteEnergyNodesMsg: 'Delete Energy Dodes Confirm?',
  deleteHandle: 'Delete',
  updateHandle: 'Modify',
  detailHandle: 'Details',
  handleOk: 'OK',
  handleCancel: 'Cancel',
  selectFile: 'Select File',
  selectEquipment: 'Please select device type first',
  nodesDetails: {
    nodesDetails: 'Nodes Details',
    creationTime: 'Creation Time',
    project: 'Project',
    deviceCode: 'Device Code',
    region: 'Region',
    communicationEquipment: 'Communication Equipment',
    energyConsumptionTarget: 'Energy Consumption Target(kW·h)',
    detailedAddress: 'Detailed Address',
    remarks: 'Remarks',
    nodeOperation: 'Node Operation',
    deleteHandle: 'Delete Handle',
    updateHandle: 'Update Handle',
    nodeAcquisition: 'Node Acquisition',
    collectDeviceId: 'Collection Facilities',
    collectEquipmentId: 'Collection Equipment',
    collectLoopId: 'Collection Circuit',
    facilityName: 'Facility Name',
    facilityType: 'Facility Type',
    model: 'Model',
    meter: 'Meter',
    numberOfEquipment: 'Number Of Equipment',
    facilityStatus: 'Facility Status',
    facilities: 'Facilities',
    circuitName: 'Circuit Name',
    circuitNumber: 'Circuit Number',
    circuitType: 'Circuit Type',
    circuitStatus: 'Circuit Status',
    distributionBox: 'Distribution Box',
    controlObject: 'Control Object',
    equipmentName: 'Equipment Name',
    equipmentType: 'Equipment Type',
    equipmentStatus: 'Equipment Status',
  },

  // 实时数据
  energyRealTimeData: 'Real Time Data',
  dataAcquisitionCycle: 'Data Acquisition Task',
  inputVoltage: 'Input Voltage(V)',
  inputCurrent: 'Input Current(A)',
  power: 'Power',
  aphaseVoltage: 'Aphase Voltage(V)',
  bphaseVoltage: 'Bphase Voltage(V)',
  cphaseVoltage: 'Cphase Voltage(V)',
  avgphaseVoltage: 'Avgphase Voltage(V)',
  ablineVoltage: 'ABline Voltage(V)',
  bclineVoltage: 'BCline Voltage(V)',
  calineVoltage: 'CAline Voltage(V)',
  avglineVoltage: 'Avgline Voltage(V)',
  aphaseCurrent: 'Aphase Current(A)',
  bphaseCurrent: 'Bphase Current(A)',
  cphaseCurrent: 'Cphase Current(A)',
  totalCurrent: 'Total Current(A)',
  leakageCurrent: 'Leakage Current(A)',
  aphaseActivePower: 'Aphase Active Power(KW)',
  bphaseActivePower: 'Bphase Active Power(KW)',
  cphaseActivePower: 'Cphase Active Power(KW)',
  totalphaseActivePower: 'Totalphase Active Power(KW)',
  totalactiveElectricEnergy: 'Total Active Electric Energy(kW·h)',
  aphaseReactivePower: 'Aphase Reactive Power(KW)',
  bphaseReactivePower: 'Bphase Reactive Power(KW)',
  cphaseReactivePower: 'Cphase Reactive Power(KW)',
  totalReactivePower: 'Total Reactive Power(KW)',
  totalReactiveEnergy: 'Total Reactive Energy(kW·h)',
  aphasePowerFactor: 'Aphase Power Factor',
  bphasePowerFactor: 'Bphase Power Factor',
  cphasePowerFactor: 'Cphase Power Factor',
  totalPowerFactor: 'Total Power Factor',
  collectionPeriod: 'Collection Period',
  acquisitionCycle: 'Acquisition Cycle',
  configurationScope: 'Configuration Scope',
  meteringNode: 'Metering Node',
  hourly: 'Hourly',
  dayByDay: 'Day By Day',
  monthByMonth: 'Month By Month',
  errorTip_collectionPeriod: 'Please Select Collection Period',
  errorTip_acquisitionCycle: 'Please Select Acquisition Cycle',
  errorTip_configurationScope: 'Please Select Configuration Scope',
  taskName: 'Task Name',
  founder: 'Founder',
  creationTime: 'Creation Time',
  updateTime: 'Update Time',
  InsertDataAcquisitionTask: 'Insert Data Acquisition Task',
  UpdateDataAcquisitionTask: 'Update Data Acquisition Task',
  collectionTime: 'Collection Time',
  status: 'Status',
  collectionTaskStatusType: {
    inExecution: 'In Execution',
    notStarted: 'Not Started',
    completed: 'Completed',
    error: 'Error',
    successExecution: 'Success Execution',
  },
  selectLastOneMonth: 'Select at least one month',
  enableStatus: 'Enable Status',
  Enable: 'Enable',
  Disable: 'Disable',
  hasEnableData: 'The selected mession has an enabled state, please select again',
  hasDisableData: 'The selected mession has a disabled state, please select again',
  scopeOfApplication: 'Scope Of Application',
  taskOperation: 'Task Operation',
  tabConfig: {
    areaList: 'Area List',
    groupList: 'Group List',
    groupDetail: 'Group Detail',
    equipmentList: 'Equipment List',
  },
  grouping: 'Grouping',
  equipment: 'Equipment',
  dataAcquisitionTaskDetails: 'Data acquisition task details',

  // 能耗统计
  energyStatistics: 'Energy Statistics',
  selectArea: 'Select Area',
  selectProject: 'Select Project',
  reset: 'Reset',
  statistics: 'Statistics',
  dayEnergyConsumption: 'Total Energy Consumption',
  monthEnergyConsumption: 'Month Energy Consumption',
  quarterEnergyConsumption: 'Quarter Energy Consumption',
  yearEnergyConsumption: 'Year Energy Consumption',
  electricityRanking: 'Electricity Ranking',
  energyConsumption: 'Energy Consumption(kW·h)',
  energyTarget: 'Energy Target(kW·h)',
  saveEnergyPercent: 'Save Energy Percent(%)',
  statisticRanking: 'Statistic Ranking',
  dailyEnergy: 'Daily Energy',
  monthEnergy: 'Month Energy',
  yearEnergy: 'Year Energy',
  descendingOrder: 'Descending Order',
  ascendingOrder: 'Ascending Order',
  proportion: 'Proportion (%)',
  energyStatisticsList: 'Energy Statistics List',
  energyStatisticsListTable: {
    project: 'Project',
    region: 'Region',
    loop: 'Loop',
    actualEnergy: 'Actual Energy(kW·h)',
    energyRating: 'Energy Rating(kW·h)',
    energySavingRate: 'Energy Saving Rate(%)',
    electricityCharge: 'Electricity Charge(Y)',
  },
  powerRate: 'Power Rate',
  analysis: 'Analysis',
  tariffStrategy: 'Tariff Strategy',
  tariffStrategyName: 'Tariff Strategy Name',
  viewDetail: 'View Detail',
  deleteElectricStrategrMsg: 'Are you sure to delete the tariff policy ?',
  insertTariffStrategy: 'Insert Tariff Strategy',
  step: {
    basicInfo: 'Basic Info',
    strategyDetails: 'Strategy Details',
    done: 'Done',
  },
  basicInfoForm: {
    tariffStrategyName: 'Tariff Strategy Name',
    scopeOfApplication: 'Scope Of Application',
    region: 'Region',
    project: 'Project',
    remarks: 'Remarks',
  },
  electricStrategy: {
    basicElectricityPrice: 'Basic Electricity Price(RMB/kW·h)',
    addPolicy: 'Add Policy',
    addMonthPolicy: 'Add Month Policy',
    addHourPolicy: 'Add Hour Policy',
    startingPower: 'Starting Power(kWh)',
    endOfCharge: 'End Of Charge(kWh)',
    startMonth: 'Start Month',
    endMonth: 'End Month',
    startTime: 'Start Time',
    endTime: 'End Time',
    unitPriceOfElectricity: 'Unit Price Of Electricity(RMB/kW·h)',
    powerRange: 'Power Range',
    monthRange: 'Month Range',
    timeRange: 'Time Range',
    timePeriodCrossingErrTip: 'The end time cannot be greater than the start time',
  },
  powerRange: 'Power Range',
  unitPriceOfElectricity: 'Unit Price Of Electricity',
  doneComponent: {
    basicInformationOfStrategy: 'Basic information of strategy',
    basicInfo: 'Basic Info',
    nameOfElectricityChargeStrategy: 'Name of electricity charge strategy',
    scopeOfApplication: 'Scope Of Application',
    remarks: 'Remarks',
    areaName: 'Area name',
    region: 'Region',
    regionalLevel: 'Regional level',
    detailedAddress: 'Detailed address',
    responsibleUnit: 'Responsible unit',
    strategyDetails: 'Strategy details',
  },
  strategyInfo: {
    strategyInfo: 'Strategy Info',
    creationTime: 'Creation Time',
    scopeOfApplication: 'Scope Of Application',
    remarks: 'Remarks',
    basicOperationOfStrategy: 'Basic Operation Of Strategy',
    deleteHandle: 'Delete',
    updateHandle: 'Modify',
    areaName: 'Area name',
    region: 'Region',
    regionalLevel: 'Regional level',
    detailedAddress: 'Detailed address',
    responsibleUnit: 'Responsible unit',
    strategyDetails: 'Strategy details',
    confirmDelete: 'Are you sure you want to delete this node?',
  },

  // 能耗分析
  energyAnalysis: 'Energy Analysis',
  energyConsumptionDump: 'Energy Consumption Dump',
  energyDumpSettings: 'Energy Dump Settings',
  date: 'Date',
  month: 'Month',
  year: 'Year',
  enableEnergyConsumptionDataLogDump: 'Enable energy consumption data log dump',
  triggerConditions: 'Trigger Conditions',
  quantityOverrun: 'Quantity Overrun',
  monthlyExecution: 'Monthly Execution',
  dumpQuantityThreshold: 'Dump Quantity Threshold',
  numberOfTransferOut: 'Number Of Transfer Out',
  postDumpOperation: 'Post Dump Operation',
  dumpInterval: 'Dump Interval',
  deleteDataOnly: 'Delete Data Only',
  deleteAndSaveDataFile: 'Delete And Save Data File',
  dumpLocation: 'Dump Location',
  dumpToLocal: 'Dump To Local',
  dumpToFileServer: 'Dump To File Server',
  save: 'Save',
  cancel: 'Cancel',
  restoreDefault: 'Restore Default',
  immediateExecution: 'Immediate Execution',
};
