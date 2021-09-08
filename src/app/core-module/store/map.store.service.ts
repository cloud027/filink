import {Injectable} from '@angular/core';
import {CommonUtil} from '../../shared-module/util/common-util';
import {mapIconConfig} from '../../shared-module/service/map-service/map.config';

@Injectable({
  providedIn: 'root'
})
export class MapStoreService {
  // 地图类型
  private _mapType: string;
  // 上次选中的设施id
  private _mapLastID: string;
  // token
  private _token: string;
  // 设施数据集
  private _mapData: any;
  // 区域点数据集
  private _areaData: any;
  // 告警查询条件
  private _alarmDataConfig: any;
  // 聚合点查询条件
  private _polymerizationConfig: any;
  // 是否初始化了设施数据
  private _isInitData: boolean;
  // 是否初始化了配置
  private _isInitConfig: boolean;
  // 是否初始化了逻辑区域数据
  private _isInitLogicAreaData: boolean;
  // 是否初始化了逻辑规划数据
  private _isInitLogicPlanningData: boolean;
  // 是否初始化了逻辑规划数据
  private _isInitLogicSmartPoleModelData: boolean;
  // 是否初始化了逻辑区域数据
  private _workOrderIsInitLogicAreaData: boolean;
  // 是否初始化了逻辑设施类型数据
  private _isInitLogicFacilityData: boolean;
  // 是否初始化了逻辑设备类型数据
  private _isInitLogicEquipmentData: boolean;
  // 用户的设施类型配置
  private _facilityTypeConfig: any[];
  // 用户的设施图片大小
  private _facilityIconSize: string;
  // 设施状态选项列表
  private _facilityStatusList: any[];
  // 设施类型选项列表
  private _facilityTypeList: any[];
  //  逻辑区域列表
  private _logicAreaList: any[];
  //  逻辑规划列表
  private _logicPlanningList: any[];
  //  逻辑智慧杆型号列表
  private _logicSmartPoleModelList: any[];
  //  工单逻辑区域列表
  private _workOrderLogicAreaList: any[];
  //  区域选中结果
  private _areaSelectedResults: any[];
  //  规划选中结果
  private _planningSelectedResults: any[] = [];
  //  智慧杆型号选中结果
  private _smartPoleModelTreeSelectedResults: any[] = [];
  //  项目的智慧杆选中结果
  private _projectModelData: any = [];
  //  区域上次操作结果
  private _lastAreaData: any[];
  //  规划上次操作结果
  private _lastPlanningData: any[];
  //  智慧杆型号上次操作结果
  private _lastSmartPoleModelData: any[];
  //  工单区域选中结果
  private _workOrderAreaSelectedResults: any[];
  //  工单区域上次操作结果
  private _lastWorkOrderAreaData: any[];
  //  设施类型选中结果
  private _facilityTypeSelectedResults: any[];
  //  地图分层设施类型选中结果
  private _showFacilityTypeSelectedResults: any[];
  //  设备类型选中结果
  private _equipmentTypeSelectedResults: any[];
  //  地图分层设备类型选中结果
  private _ShowEquipmentTypeSelectedResults: any[];
  //  工单类型选中结果
  private _workOrderTypeSelectedResults: any[];
  //  工单状态选中结果
  private _workOrderStatusSelectedResults: any[];
  //  工单状态选中结果
  private _smartPoleModelSelectedResults: any[];
  //  工单状态选中结果
  private _constructionStatusSelectedResults: any[];
  //  逻辑设施类型列表
  private _logicFacilityList: any[];
  //  逻辑设备类型列表
  private _logicEquipmentList: any[];
  //  逻辑分组列表
  private _logicGroupList: any[];
  //  地图设施点集合
  private _mapDeviceList: any[];
  //  地图设备点集合
  private _mapEquipmentList: any[];
  //  地图区域操作记录对比数据
  private _mapAreaComparedList: any[];
  //  大数据列表
  private _areaDataList: any[];
  //  选择过的所有逻辑区域id
  private _chooseAllAreaID: any[];
  //  选择过的所有逻辑规划id
  private _chooseAllPlanningID: any[];
  //  选择过的所有逻辑规划id
  private _chooseAllSmartPoleModelID: any[];
  //  上次选择过的所有逻辑区域id
  private _selectLastAreaID: any[];
  private _locationProjectOrPlanId: string | null;

  constructor() {
    this._facilityIconSize = mapIconConfig.defaultIconSize;
    this.resetData();
    this.resetConfig();
  }

  set mapType(type) {
    this._mapType = type;
  }

  get mapType(): string {
    return this._mapType;
  }

  set mapLastID(type) {
    this._mapLastID = type;
  }

  get mapLastID(): string {
    return this._mapLastID;
  }

  set mapData(data) {
    this._mapData = data;
  }

  get mapData() {
    return this._mapData;
  }

  set areaData(data) {
    this._areaData = data;
  }

  get areaData() {
    return this._areaData;
  }

  set alarmDataConfig(data) {
    this._alarmDataConfig = data;
  }

  get alarmDataConfig() {
    return this._alarmDataConfig;
  }

  set polymerizationConfig(data) {
    this._polymerizationConfig = data;
  }

  get polymerizationConfig() {
    return this._polymerizationConfig;
  }

  set isInitConfig(bol) {
    this._isInitConfig = bol;
  }

  get isInitConfig() {
    return this._isInitConfig;
  }

  set isInitData(bol) {
    this._isInitData = bol;
  }

  get isInitData() {
    return this._isInitData;
  }

  set isInitLogicAreaData(bol) {
    this._isInitLogicAreaData = bol;
  }

  get isInitLogicAreaData() {
    return this._isInitLogicAreaData;
  }

  set isInitLogicPlanningData(bol) {
    this._isInitLogicPlanningData = bol;
  }

  get isInitLogicPlanningData() {
    return this._isInitLogicPlanningData;
  }

  set isInitLogicSmartPoleModelData(bol) {
    this._isInitLogicSmartPoleModelData = bol;
  }

  get isInitLogicSmartPoleModelData() {
    return this._isInitLogicSmartPoleModelData;
  }

  set workOrderIsInitLogicAreaData(bol) {
    this._workOrderIsInitLogicAreaData = bol;
  }

  get workOrderIsInitLogicAreaData() {
    return this._workOrderIsInitLogicAreaData;
  }

  set isInitLogicFacilityData(bol) {
    this._isInitLogicFacilityData = bol;
  }

  get isInitLogicFacilityData() {
    return this._isInitLogicFacilityData;
  }

  set isInitLogicEquipmentData(bol) {
    this._isInitLogicEquipmentData = bol;
  }

  get isInitLogicEquipmentData() {
    return this._isInitLogicEquipmentData;
  }

  set facilityTypeConfig(data) {
    this._facilityTypeConfig = CommonUtil.deepClone(data);
  }

  get facilityTypeConfig() {
    return this._facilityTypeConfig;
  }

  set facilityIconSize(data) {
    this._facilityIconSize = data;
  }

  get facilityIconSize() {
    return this._facilityIconSize;
  }

  set facilityStatusList(data) {
    this._facilityStatusList = data;
  }

  get facilityStatusList() {
    return this._facilityStatusList;
  }

  set facilityTypeList(data) {
    this._facilityTypeList = data;
  }

  get facilityTypeList() {
    return this._facilityTypeList;
  }

  set logicAreaList(data) {
    this._logicAreaList = data;
  }

  get logicAreaList() {
    return this._logicAreaList;
  }

  set logicPlanningList(data) {
    this._logicPlanningList = data;
  }

  get logicPlanningList() {
    return this._logicPlanningList;
  }

  set logicSmartPoleModelList(data) {
    this._logicSmartPoleModelList = data;
  }

  get logicSmartPoleModelList() {
    return this._logicSmartPoleModelList;
  }

  set workOrderLogicAreaList(data) {
    this._workOrderLogicAreaList = data;
  }

  get workOrderLogicAreaList() {
    return this._workOrderLogicAreaList;
  }

  set areaSelectedResults(data) {
    this._areaSelectedResults = data;
  }

  get areaSelectedResults() {
    return this._areaSelectedResults;
  }

  set planningSelectedResults(data) {
    this._planningSelectedResults = data;
  }

  get planningSelectedResults() {
    return this._planningSelectedResults;
  }

  set smartPoleModelTreeSelectedResults(data) {
    this._smartPoleModelTreeSelectedResults = data;
  }

  get smartPoleModelTreeSelectedResults() {
    return this._smartPoleModelTreeSelectedResults;
  }

  set projectModelData(data: any) {
    this._projectModelData = data;
  }

  get projectModelData() {
    return this._projectModelData;
  }

  set lastAreaData(data) {
    this._lastAreaData = data;
  }

  get lastAreaData() {
    return this._lastAreaData;
  }

  set lastPlanningData(data) {
    this._lastPlanningData = data;
  }

  get lastPlanningData() {
    return this._lastPlanningData;
  }

  set lastSmartPoleModelData(data) {
    this._lastSmartPoleModelData = data;
  }

  get lastSmartPoleModelData() {
    return this._lastSmartPoleModelData;
  }

  set workOrderAreaSelectedResults(data) {
    this._workOrderAreaSelectedResults = data;
  }

  get workOrderAreaSelectedResults() {
    return this._workOrderAreaSelectedResults;
  }

  set lastWorkOrderAreaData(data) {
    this._lastWorkOrderAreaData = data;
  }

  get lastWorkOrderAreaData() {
    return this._lastWorkOrderAreaData;
  }

  set facilityTypeSelectedResults(data) {
    this._facilityTypeSelectedResults = data;
  }

  get facilityTypeSelectedResults() {
    return this._facilityTypeSelectedResults;
  }

  set showFacilityTypeSelectedResults(data) {
    this._showFacilityTypeSelectedResults = data;
  }

  get showFacilityTypeSelectedResults() {
    return this._showFacilityTypeSelectedResults;
  }

  set equipmentTypeSelectedResults(data) {
    this._equipmentTypeSelectedResults = data;
  }

  get equipmentTypeSelectedResults() {
    return this._equipmentTypeSelectedResults;
  }

  set showEquipmentTypeSelectedResults(data) {
    this._ShowEquipmentTypeSelectedResults = data;
  }

  get showEquipmentTypeSelectedResults() {
    return this._ShowEquipmentTypeSelectedResults;
  }

  set workOrderTypeSelectedResults(data) {
    this._workOrderTypeSelectedResults = data;
  }

  get workOrderTypeSelectedResults() {
    return this._workOrderTypeSelectedResults;
  }

  set workOrderStatusSelectedResults(data) {
    this._workOrderStatusSelectedResults = data;
  }

  get workOrderStatusSelectedResults() {
    return this._workOrderStatusSelectedResults;
  }

  set smartPoleModelSelectedResults(data) {
    this._smartPoleModelSelectedResults = data;
  }

  get smartPoleModelSelectedResults() {
    return this._smartPoleModelSelectedResults;
  }

  set constructionStatusSelectedResults(data) {
    this._constructionStatusSelectedResults = data;
  }

  get constructionStatusSelectedResults() {
    return this._constructionStatusSelectedResults;
  }

  set logicFacilityList(data) {
    this._logicFacilityList = data;
  }

  get logicFacilityList() {
    return this._logicFacilityList;
  }

  set logicEquipmentList(data) {
    this._logicEquipmentList = data;
  }

  get logicEquipmentList() {
    return this._logicEquipmentList;
  }

  set logicGroupList(data) {
    this._logicGroupList = data;
  }

  get logicGroupList() {
    return this._logicGroupList;
  }

  set mapDeviceList(data) {
    this._mapDeviceList = data;
  }

  get mapDeviceList() {
    return this._mapDeviceList;
  }

  set mapEquipmentList(data) {
    this._mapEquipmentList = data;
  }

  get mapEquipmentList() {
    return this._mapEquipmentList;
  }

  set mapAreaComparedList(data) {
    this._mapAreaComparedList = data;
  }

  get mapAreaComparedList() {
    return this._mapAreaComparedList;
  }

  set areaDataList(data) {
    this._areaDataList = data;
  }

  get areaDataList() {
    return this._areaDataList;
  }

  set chooseAllAreaID(data) {
    this._chooseAllAreaID = data;
  }

  get chooseAllAreaID() {
    return this._chooseAllAreaID;
  }

  set chooseAllPlanningID(data) {
    this._chooseAllPlanningID = data;
  }

  get chooseAllSmartPoleModelID() {
    return this._chooseAllSmartPoleModelID;
  }

  set chooseAllSmartPoleModelID(data) {
    this._chooseAllSmartPoleModelID = data;
  }

  get chooseAllPlanningID() {
    return this._chooseAllPlanningID;
  }

  set selectLastAreaID(data) {
    this._selectLastAreaID = data;
  }

  get selectLastAreaID() {
    return this._selectLastAreaID;
  }

  set token(data) {
    this._token = data;
  }

  get token() {
    return this._token;
  }

  set locationProjectOrPlanId(data: string | null) {
    this._locationProjectOrPlanId = data;
  }

  get locationProjectOrPlanId() {
    return this._locationProjectOrPlanId;
  }

  updateMarker(facility, bol) {
    if (facility.code) {
      this._areaData.set(facility.code, {
        info: facility,
        isShow: bol
      });
    } else if (facility.deviceId) {
      this._mapData.set(facility.deviceId, {
        info: facility,
        isShow: bol
      });
    } else {
      this._mapData.set(facility.equipmentId, {
        info: facility,
        isShow: bol
      });
    }

  }


  updateMarkerData(facility) {
    let bol = true;
    if (this._mapData.get(facility.deviceId)) {
      bol = this._mapData.get(facility.deviceId).show;
    }
    const position = facility.positionBase.split(',');
    facility.lng = parseFloat(position[0]);
    facility.lat = parseFloat(position[1]);
    delete facility.positionBase;
    this.updateMarker(facility, bol);
  }

  deleteMarker(facilityId) {
    this._mapData.delete(facilityId);
  }

  getMarker(id) {
    const data = this._mapData.get(id);
    return data ? data.info : data;
  }

  resetData() {
    this._isInitData = false;
    this._isInitLogicAreaData = false;
    this._chooseAllAreaID = [];
    // 告警查询条件
    this._alarmDataConfig = {};
    // 聚合点查询条件
    this._polymerizationConfig = {};
    this.mapLastID = '';
    this._mapData = new Map();
    this._areaData = new Map();
  }

  resetConfig() {
    this._isInitConfig = false;
    this._facilityTypeConfig = [];
    this._facilityIconSize = '';
    this._facilityTypeConfig = [];
    this._facilityStatusList = [];
    this._facilityTypeList = [];
    this._planningSelectedResults = [];
    this._smartPoleModelSelectedResults = [];
    this._constructionStatusSelectedResults = [];
    // 告警查询条件
    this._alarmDataConfig = {};
    // 聚合点查询条件
    this._polymerizationConfig = {};
    // 区域点数据集
    // this._areaData = [];
    // 区域选中结果
    this._areaSelectedResults = [];
    // 逻辑分组列表
    this._logicGroupList = [];
    // 地图分层设施类型选中结果
    this._showFacilityTypeSelectedResults = [];
    // 设备类型选中结果
    this._equipmentTypeSelectedResults = [];
    // 地图分层设备类型选中结果
    this._ShowEquipmentTypeSelectedResults = [];
    // 地图设施点集合
    this._mapDeviceList = [];
    // 地图设备点集合
    this._mapEquipmentList = [];
    // 地图区域操作记录对比数据
    this._mapAreaComparedList = [];
    // 设施状态选项列表
    this._facilityStatusList = [];
    // 设施类型选项列表
    this._facilityTypeList = [];
    //  逻辑区域列表
    this._logicAreaList = [];
    //  工单逻辑区域列表
    this._workOrderLogicAreaList = [];
    //  区域选中结果
    this._areaSelectedResults = [];
    //  区域上次操作结果
    this._lastAreaData = [];
    this._lastPlanningData = [];
    //  工单区域上次操作结果
    this._lastWorkOrderAreaData = [];
    //  工单区域选中结果
    this._workOrderAreaSelectedResults = [];
    //  设施类型选中结果
    this._facilityTypeSelectedResults = [];
    //  工单类型选中结果
    this._workOrderTypeSelectedResults = [];
    //  工单状态选中结果
    this._workOrderStatusSelectedResults = [];
    //  逻辑设施类型列表
    this._logicFacilityList = [];
    //  逻辑设备类型列表
    this._logicEquipmentList = [];
    //  智慧杆型号选中结果
    this._smartPoleModelTreeSelectedResults = [];
    // 智慧杆型号上次操作结果
    this._lastSmartPoleModelData = [];
  }

  getFacilityInfo(id) {
    return this._mapData.get(id);
  }
}
