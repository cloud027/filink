import {CommonUtil} from '../../../../util/common-util';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import * as _ from 'lodash';

export class EquipmentGetConfigCommon {
  /**
   * 获取设备配置动态详情
   */
  public static queryGatewayPropertyConfig(id, tempData, that): void {
    that.$facilityCommonService.queryGatewayPropertyConfig(id).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        const resultConfig = result.data;
        that.equipmentConfigContent = [];
        // 判读网关的基本配置
        const config = tempData.find(item => item.tabId === 'gatewayConfig');
        if (!_.isEmpty(resultConfig.gatewayConfigInfo)) {
          const gateway = JSON.parse(resultConfig.gatewayConfigInfo);
          const list = config.configurationsList[0].configurationList;
          list.forEach((temp, index) => {
            Object.keys(gateway).forEach(itemValue => {
              if (itemValue === list[index].id) {
                list[index].configParamList.forEach(_item => {
                  Object.keys(gateway[itemValue]).forEach(_value => {
                    if (_value === _item.id) {
                      _item.defaultValue = gateway[itemValue][_value];
                      _item.col = 24;
                      _item.labelWidth = 140;
                    }
                  });
                });
              }
            });
          });
          config.configurationsList[0].configurationList = list;
        }
        that.equipmentConfigContent.push(config);

        // 判断网关设备配置配置是否有数据
        if (resultConfig.childEquipmentConfigInfo && resultConfig.childEquipmentConfigInfo.length > 0) {
          this.createTemplate(tempData, 'childConfiguration', resultConfig.childEquipmentConfigInfo, that);
        }

        // 判断传感器是否有数据
        if (resultConfig.propertyConfigInfo && resultConfig.propertyConfigInfo.length > 0) {
          this.createTemplate(tempData, 'sensorConfig', resultConfig.propertyConfigInfo, that);
        }
        that.openEquipmentConfigShow();
      }
    });
  }

  /**
   * 创建模板
   */
  public static createTemplate(tempData, tabId, info, that) {
    const config = tempData.find(item => item.tabId === tabId);
    const list = [];
    info.forEach(m => {
      const renderingConfig = this.renderingData(tabId, m, config.configurationsList);
      const copyConfig = CommonUtil.deepCopy(renderingConfig || []);
      copyConfig.forEach(item => {
        item.equipmentName = tabId === 'sensorConfig' ? m.sensorName : m.equipmentName;
        item.equipmentId = tabId === 'sensorConfig' ? m.sensorId : m.equipmentId;
        list.push(item);
      });
    });
    if (list.length) {
      config.configurationsList = list;
    }
    that.equipmentConfigContent.push(config);
  }

  /**
   * 动态渲染数据到模板
   */
  public static renderingData(tabId, info, config) {
    // 如果没有配置信息，直接渲染模板
    const type = tabId === 'sensorConfig' ? info.sensorType : info.equipmentType;
    const data = [];
    config.forEach(item => {
      if (item.id === type) {
        if (info.configInfo) {
          item.configurationList.forEach(temp => {
            const configKeys = Object.keys(JSON.parse(info.configInfo));
            const configInfo = JSON.parse(info.configInfo);
            configKeys.forEach(_config => {
              if (_config === temp.id) {
                temp.configParamList.forEach((_item) => {
                  Object.keys(configInfo[_config]).forEach(itemValue => {
                    if (itemValue === _item.id) {
                      _item.col = 24;
                      _item.labelWidth = 140;
                      _item.defaultValue = configInfo[_config][itemValue];
                    }
                  });
                });
              }
            });
          });
        }
        data.push(item);
      }
    });
    return data;
  }
}
