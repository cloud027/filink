/**
 * 告警等级默认颜色
 */
export const DefaultAlarmColor = [
  {
    alarmLevelCode: '1',
    alarmLevelColor: '111',
    alarmLevelName: '紧急',
    alarmLevelSound: 'a.mp3',
    color: {
      color: '#e61017',
      label: 'red',
      value: '111',
      style: {backgroundColor: '#e61017'}
    }
  },
  {
    alarmLevelCode: '2',
    alarmLevelColor: '222',
    alarmLevelName: '主要',
    alarmLevelSound: 'b.mp3',
    color: {
      value: '333',
      label: 'yellow',
      color: '#f1c620',
      style: {'backgroundColor': '#f1c620'},
    }
  },
  {
    alarmLevelCode: '3',
    alarmLevelColor: '333',
    alarmLevelName: '次要',
    alarmLevelSound: 'c.mp3',
    color: {
      value: '444',
      label: 'blue',
      color: '#58c1f0',
      style: {'backgroundColor': '#58c1f0'},
    }
  },
  {
    alarmLevelCode: '4',
    alarmLevelColor: '444',
    alarmLevelName: '提示',
    alarmLevelSound: 'd.mp3',
    color: {
      value: '777',
      label: 'green',
      color: '#0bda0b',
      style: {'backgroundColor': '#0bda0b'},
    }
  }
];
