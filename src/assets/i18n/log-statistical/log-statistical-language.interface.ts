export interface LogStatisticalInterface {
  serialNumber: string;
  name: string;
  createTime: string;
  createUser: string;
  operate: string;
  add: string;
  update: string;
  delete: string;
  confirm: string;
  cancel: string;
  statisticsByTemplate: string;
  logStatisticalTemplate: string;
  logType: string;
  optType: string;
  dangerLevel: string;
  optUser: string;
  optTerminal: string;
  optTime: string;
  optObj: string;
  remark: string;
  config: {
    Operational_Log: string;
    Security_Log: string;
    System_Log: string;
    Web_Operational_Log: string;
    PDA_Log: string;
    Prompt: string;
    General: string;
    Danger: string;
    Log_Type: string;
    Operational_Type: string;
    Danger_Level_Type: string;
  };
  logStatisticalType: string;
  pleaseSelectType: string;
  statistical: string;
  operationalUser: string;
  operationalTerminal: string;
  operationalObject: string;
}


