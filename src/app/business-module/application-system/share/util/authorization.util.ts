import {
  DeployStatusEnum,
  DeviceStatusEnum,
  DeviceTypeEnum,
  WellCoverTypeEnum
} from '../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {UserForCommonUtil} from '../../../../core-module/business-util/user/user-for-common.util';
import { NzI18nService} from 'ng-zorro-antd';
import {QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {DoorNumberEnum} from '../const/door-number.const';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {AuthorityTypeEnum} from '../enum/authority.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
export class AuthorizationUtil {
  /**
   * 获取设施下的门锁
   */
  public static getLockList (data, i18n: NzI18nService, deviceType?) {
    if (data && data.length > 0) {
      const lockData = [];
      data.forEach(e => {
        // 当设施为人井的时候过滤掉外盖
        if (!(deviceType && deviceType === DeviceTypeEnum.well && e.doorNum === WellCoverTypeEnum.outCover)) {
          lockData.push(
            {
              // 翻译门编号名称
              label: CommonUtil.codeTranslate(DoorNumberEnum, i18n, e.doorNum, 'application.doorNumber'),
              value: e.doorNum,
              checked: false,
              deviceId: e.deviceId
            }
          );
        }
      });
      // 排序(升序)
      lockData.sort(UserForCommonUtil.sort);
      return lockData;
    }
  }


  /**
   * 授权范围列表初始化
   */
  public static initFacilityTableConfig(that) {
    // 设施列表配置
    that.facilityTableConfig = {
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1504px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          // 序号
          type: 'serial-number', width: 62, title: that.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // 名称
          title: that.facilityLanguage.deviceName, key: 'deviceName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          // 类型
          title: that.facilityLanguage.deviceType, key: 'deviceType', width: 200,
          configurable: true,
          type: 'render',
          renderTemplate: that.deviceTypeTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: that.deviceTypeCanSeeList,
            label: 'label',
            value: 'code'
          }
        },
        {
          // 门锁
          title: that.language.lockList, key: '_lockList', width: 340,
          type: 'render',
          minWidth: 340,
          renderTemplate: that.doorLocksTemp
        },
        {
          // 状态
          title: that.facilityLanguage.deviceStatus, key: 'deviceStatus', width: 100,
          type: 'render',
          renderTemplate: that.deviceStatusTemp,
          configurable: true,
          isShowSort: true,
          searchable: true,
          minWidth: 80,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: CommonUtil.codeTranslate(DeviceStatusEnum, that.$nzI18n, null), label: 'label', value: 'code'}
        },
        {
          // 资产编号
          title: that.facilityLanguage.deviceCode, key: 'deviceCode', width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 所属区域
          title: that.facilityLanguage.parentId, key: 'areaName', width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          // 部署状态
          title: that.facilityLanguage.deployStatus, key: 'deployStatus', configurable: true, width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: CommonUtil.codeTranslate(DeployStatusEnum, that.$nzI18n, null, LanguageEnum.facility), label: 'label', value: 'code'}
        },
        {
          // 备注
          title: that.facilityLanguage.remarks, key: 'remarks', width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: that.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      rightTopButtons: [],
      sort: (event: SortCondition) => {
        that.facilityQueryCondition.sortCondition.sortField = event.sortField;
        that.facilityQueryCondition.sortCondition.sortRule = event.sortRule;
        this._refreshData(that);
      },
      handleSearch: (event) => {
        if (event.length === 0) {
          this._refreshData(that, that.query_Conditions);
          that._query_Conditions_['filterConditions'] = [];
          that._query_Conditions_ = CommonUtil.deepClone(that.query_Conditions);
        } else {
          that._query_Conditions_['filterConditions'] = [];
          that._query_Conditions_ = CommonUtil.deepClone(that.query_Conditions);
          event.forEach(item => {
            that._query_Conditions_['filterConditions'].push(item);
          });
          this._refreshData(that, that._query_Conditions_);
        }
      }
    };
  }

  /**
   * 检测授权时间是否过期
   * @param time 授权时间
   * @param unexpired 未过期
   * @param expired 过期
   */
  public static checkExpirationTime(time: Date, unexpired: string , expired: string) {
    const nowTime = CommonUtil.getTimeStamp(new Date());
    const expirationTime = CommonUtil.getTimeStamp(new Date(time));
    try {
      if (time) {
        if (expirationTime > nowTime) {
          return unexpired;
        } else {
          return expired;
        }
      } else {
        return unexpired;
      }
    } catch (err) {
    }
  }

  /**
   * 未过期样式检测
   * @param time 时间
   */
  public static unexpiredCheck(time: Date) {
    const nowTime = CommonUtil.getTimeStamp(new Date());
    const expirationTime = CommonUtil.getTimeStamp(new Date(time));
    if (expirationTime > nowTime) {
      return true;
    }
  }

  /**
   *过期样式检测
   * @param time 时间
   */
  public static expiredCheck(time: Date) {
    const nowTime = CommonUtil.getTimeStamp(new Date());
    const expirationTime = CommonUtil.getTimeStamp(new Date(time));
    if (expirationTime < nowTime) {
      return true;
    }
  }

  /**
   * 长期有效样式检测
   * @param time 时间
   */
  public static longTermCheck(time: Date) {
    if (time === null) {
      return true;
    }
  }

  /**
   * 刷新设施列表数据
   * @param that 调用时的对象
   * @param body 查询条件
   */
  public static _refreshData(that, body?: QueryConditionModel) {
    that.facilityTableConfig.isLoading = true;
    that.$applicationService.deviceListByPage(body || that.facilityQueryCondition)
      .subscribe((result: ResultModel<FacilityListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          that.facilityPageBean.Total = result.totalCount;
          that.facilityPageBean.pageIndex = result.pageNum;
          that.facilityPageBean.pageSize = result.size;
          that.facilityTableConfig.isLoading = false;
          that.facilityDataSet = result.data || [];
          that.facilityDataSet.forEach(item => {
            item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
            item['_deviceType'] = item.deviceType;
            item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, that.$nzI18n, item.deviceType);
            item['_deviceStatus'] = item.deviceStatus;
            item.deviceStatus = CommonUtil.codeTranslate(DeviceStatusEnum, that.$nzI18n, item.deviceStatus);
            item.deployStatus = CommonUtil.codeTranslate(DeployStatusEnum, that.$nzI18n, item.deployStatus, LanguageEnum.facility);
            item['iconClass'] = CommonUtil.getFacilityIconClassName(item._deviceType);
            // 门锁
            if (that.authorityType === AuthorityTypeEnum.unifiedAuthority) {
              item._lockList = this.getLockList(item.lockList, that.$nzI18n, item._deviceType);
            } else {
              item._lockList = this.getLockList(item.lockList, that.$nzI18n);
            }
            item['deviceStatusIconClass'] = CommonUtil.getDeviceStatusIconClass(item._deviceStatus).iconClass;
            item['deviceStatusColorClass'] = CommonUtil.getDeviceStatusIconClass(item._deviceStatus).colorClass;
            setTimeout(() => {
              if (that.devicesAndDoorsData.length > 0 && item._lockList && item._lockList.length > 0) {
                for (let i = 0; i < that.devicesAndDoorsData.length; i++) {
                  const iDeviceId = that.devicesAndDoorsData[i].deviceId;
                  const iDoorId = that.devicesAndDoorsData[i].doorNum;
                  for (let t = 0; t < item._lockList.length; t++) {
                    if (iDeviceId === item._lockList[t].deviceId && iDoorId === item._lockList[t].value) {
                      // 勾选数据
                      item._lockList[t].checked = true;
                    }
                  }
                }
              }
            }, 0);
          });
        } else {
          that.facilityTableConfig.isLoading = false;
          that.$message.error(result.msg);
        }
      }, () => {
        that.facilityTableConfig.isLoading = false;
      });
  }

  /**
   * 获取当前用户能看到且有电子锁的设施类型(即最多只能筛选室外柜，人井，光交箱）
   * @param canSeeList 全部设施类型
   */
  public static getUserCanLookDeviceType(canSeeList) {
    const list = [];
    canSeeList.forEach(item => {
      item.value = item.code;
      // 获取当前用户权限下的设施类型，再选出有锁的类型
      if (SessionUtil.getUserInfo().role.roleDevicetypeList
        .filter(_item => _item.deviceTypeId === item.code &&
          (item.code === DeviceTypeEnum.opticalBox || item.code === DeviceTypeEnum.well || item.code === DeviceTypeEnum.outdoorCabinet)).length > 0) {
        list.push(item);
      }
    });
    canSeeList = list;
    return  canSeeList;
  }
}
