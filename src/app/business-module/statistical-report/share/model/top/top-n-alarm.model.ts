export class TopNAlarmModel {
  bizCondition: {
    alarmCodes: [string];
    areaList: [string];
    beginTime: number;
    deviceIds: [string];
    deviceType: string;
    endTime: number;
    topCount: number;
    topTotal: number;
  };
}
