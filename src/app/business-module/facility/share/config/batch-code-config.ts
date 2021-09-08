export class BatchCodeConfig {
  /**
   * 设施批量编码第二步表格配置
   */
  public static facilityTableConfig(language, deviceTypeTemp) {
    return [
      {type: 'select', key: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
      {
        type: 'serial-number', key: 'serial-number', width: 62, title: language.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      },
      { // 名称
        title: language.deviceName_a, key: 'deviceName', width: 150,
        fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        isShowSort: true,
      },
      { // 资产编号
        title: language.deviceCode, key: 'deviceCode', width: 150,
        isShowSort: true,
      },
      { // 类型
        title: language.deviceType, key: 'deviceType', width: 150,
        type: 'render',
        renderTemplate: deviceTypeTemp,
        isShowSort: true,
      },
      { // 型号
        title: language.deviceModel,
        key: 'deviceModel',
        width: 120,
        isShowSort: true,
      },
      {
        // 设备数量
        title: language.equipmentQuantity,
        key: 'equipmentQuantity',
        width: 170,
        isShowSort: true,
      },
      {  // 详细地址
        title: language.address, key: 'address', width: 150,
        isShowSort: true,
      }
    ];
  }

  /**
   * 设备批量编码第二步表格配置
   */
  public static equipmentTableConfig(language, deviceTypeTemp, equipmentStatusFilterTemp) {
    return [
      {type: 'select', key: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
      {
        type: 'serial-number', key: 'serial-number', width: 62, title: language.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      },
      { // 设备名称
        title: language.equipmentName, key: 'equipmentName', width: 150,
        fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        isShowSort: true,
      },
      { // 资产编码
        title: language.deviceCode,
        key: 'equipmentCode', width: 150,
        isShowSort: true,
      },
      { // 设备类型
        title: language.equipmentType,
        key: 'equipmentType', width: 150,
        type: 'render',
        renderTemplate: deviceTypeTemp,
        isShowSort: true,
      },
      { // 设备状态
        title: language.equipmentStatus,
        key: 'equipmentStatus',
        width: 120,
        type: 'render',
        renderTemplate: equipmentStatusFilterTemp,
        isShowSort: true,
      },
      { // 所属设施
        title: language.affiliatedDevice,
        key: 'deviceName',
        width: 120,
        isShowSort: true
      },
      {  // 详细地址
        title: language.address, key: 'address', width: 150,
        isShowSort: true,
      }
    ];
  }
}
