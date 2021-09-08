import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {MapSelectorComponent} from '../map-selector.component';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {NzI18nService} from 'ng-zorro-antd';
import {MapService} from '../../../../core-module/api-service/index/map';
import {Result} from '../../../entity/result';
import {CommonUtil} from '../../../util/common-util';
import {iconSize} from '../map.config';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {PageModel} from '../../../model/page.model';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {ICON_SIZE} from '../../../service/map-service/map.config';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {LanguageEnum} from '../../../enum/language.enum';
import {ResultModel} from '../../../model/result.model';
import {MapConfig as BMapConfig} from '../../map/b-map.config';
import {AreaFacilityModel} from '../../../../business-module/index/shared/model/area-facility-model';
import {TableConfigModel} from '../../../model/table-config.model';
import {FacilitiesDetailsModel} from '../../../../core-module/model/index/facilities-details.model';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {MapStoreService} from '../../../../core-module/store/map.store.service';

declare const MAP_TYPE;

/**
 * 巡检设施地图选择器
 */
@Component({
  selector: 'xc-map-selector-inspection',
  templateUrl: './map-selector-inspection.component.html',
  styleUrls: ['./map-selector-inspection.component.scss']
})
export class MapSelectorInspectionComponent extends MapSelectorComponent implements OnInit, OnChanges, AfterViewInit {
  // 传入的设施集合
  @Input() deviceSet: any[];
  // 选择器类型 inspection 巡检 setDevice 关联设施（默认不传）
  @Input() selectorType: string;
  // 是否关联全集
  @Input() isSelectAll;
  // 设施右边表格能否去勾选
  @Input() noEdit: boolean;
  // 区域id
  @Input() areaId;
  // 设施类型
  @Input() deviceType: string | string[];
  // 重置键是否隐藏
  @Input() isHiddenButton = false;
  // 确定按钮赋予取消功能
  @Input() switchHiddenButton = true;
  // 确定键是否隐藏
  @Input() selectHiddenButton = false;
  // 是否去掉框选功能
  @Input() mapBoxSelect = false;
  // 设施设备类型
  @Input() selectMapType: string;
  // 设施id集合
  @Input() deviceIdList: string[];
  // 设备类型集合
  @Input() equipmentTypes: string[];
  // 已选择数据
  @Input() hasSelectData: string[] = [];
  // 设施类型
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // 选择器分页
  public selectPageBean: PageModel = new PageModel(10, 1, 0);
  // 语言类型
  public typeLg: string;
  public InspectionLanguage: InspectionLanguageInterface; // 国际化
  // 标题
  public orderSearchTypeName: string;
  // 设施或设备
  public deviceOrEquipName: string;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  private markerClusterer: any;
  private markersArr: any[] = [];


  // 多重设备点双击列表弹框
  public isShowTableWindow: boolean = false;
  // 多重设备数据
  public setData = [];
  // 表格配置
  public equipmentTableConfig: TableConfigModel;
  // 多重设备列表查询条件
  public queryConditions = [];
  // 多重设备列表查询数据
  public equipmentListData: Array<FacilitiesDetailsModel> = [];
  // 上次点击的多重设备点数据
  public targetMarker;
  // 设备分层数据
  public equipmentTypeList = [];
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 工具类
  public commonUtil = CommonUtil;
  // 设备类型枚举
  public indexEquipmentTypeEnum = EquipmentTypeEnum;
  // 设备分层选择数据
  public equipmentRadioValue: string;
  // 分层切换存储数据
  public equipmentSaveData = [];
  // 分层显示
  public selectEquipmentShow: boolean = false;

  constructor(public $mapService: MapService,
              public $mapStoreService: MapStoreService,
              public $modalService: FiLinkModalService,
              public $i18n: NzI18nService,
              private $facilityForCommonService: FacilityForCommonService,
  ) {
    super($mapService, $mapStoreService, $facilityForCommonService, $modalService, $i18n);
  }


  ngOnInit() {
    this.mapType = MAP_TYPE;
    this.language = this.$i18n.getLocaleData(LanguageEnum.common);
    this.indexLanguage = this.$i18n.getLocaleData(LanguageEnum.index);
    this.InspectionLanguage = this.$i18n.getLocaleData(LanguageEnum.inspection);
    this.setSelectMapConfig();
    // 语言类型
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    if (this.selectMapType === 'device') {
      this.deviceOrEquipName = this.indexLanguage.searchDeviceName;
      this.orderSearchTypeName = this.indexLanguage.searchDeviceName;
    } else if (this.selectMapType === 'equipment') {
      this.deviceOrEquipName = this.InspectionLanguage.equipmentName;
      this.orderSearchTypeName = this.InspectionLanguage.equipmentName;
    }
  }

  /**
   * 巡检工单设施应用类型切换
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.xcVisible) {
      if (this.selectMapType === 'device') {
        this.queryDeviceByArea();
      } else if (this.selectMapType === 'equipment') {
        if (!this.equipmentRadioValue) {
          this.equipmentRadioValue = this.equipmentTypes[0];
        }
        this.getEquipmentInfo();
        this.getEquipmentTypes();
      }
    }
    if ((this.selectorType === 'inspection' || this.selectorType === 'inspectionTask') && this.facilityData.length > 0) {
      this.restSelectData();
    }
  }

  /**
   * 页面初始化
   */
  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * 设备类型分层选择
   */
  public getEquipmentTypes() {
    if (this.equipmentTypes && this.equipmentTypes.length) {
      this.equipmentTypes.forEach(item => {
        this.equipmentTypeList.push({value: item, code: item});
      });
    }
  }

  /**
   * 分层选择change事件
   */
  public equipmentCheckChange(event) {
    this.equipmentRadioValue = event;
    this.equipmentSaveData = this.selectData;
    this.getEquipmentInfo();
  }

  /**
   * 分层显示
   */
  public selectEquipmentType() {
    this.selectEquipmentShow = !this.selectEquipmentShow;
  }


  /**
   * 确定
   */
  public handleOk(): void {
    if (this.selectorType === 'inspection' || this.selectorType === 'inspectionTask') {
      // this.selectDataChange.emit(this.selectData);
      // 确定时将当前数据发射给组件用于回显
      this.selectDataChange.emit(this.selectData);
      this.handleCancel();
    }
  }

  /**
   * 去选
   * param currentItem
   */
  public handleDelete(currentItem): boolean {
    if (currentItem) {
      if (this.isSelectAll === '1' || this.noEdit) {
        return false;
      }
      // 找到要删除的项目
      let index = -1;
      if (this.selectMapType === 'device') {
        index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
        this.selectData.splice(index, 1);
        this.childCmp.checkStatus();
        // 删除完刷新被选数据
        this.refreshSelectPageData();
        const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, currentItem.deviceType, '1');
        const icon = this.mapService.toggleIcon(imgUrl);
        this.mapService.getMarkerById(currentItem.deviceId).setIcon(icon);
      } else if (this.selectMapType === 'equipment') {
        index = this.selectData.findIndex(item => item.equipmentId === currentItem.equipmentId);
        this.selectData.splice(index, 1);
        this.childCmp.checkStatus();
        // 删除完刷新被选数据
        this.refreshSelectPageData();
        if (currentItem.positionId) {
          const imgUrls = CommonUtil.getEquipmentTypeIconUrl(iconSize, currentItem.equipmentType, '1');
          const icons = this.mapService.toggleIcon(imgUrls);
          this.mapService.getMarkerById(currentItem.positionId).setIcon(icons);
        }
      }
    }
  }

  /**
   * 添加到列表
   * param item
   */
  public pushToTable(item): void {
    let index = -1;
    if (this.selectMapType === 'device') {
      index = this.selectData.findIndex(_item => item.deviceId === _item.deviceId);
    } else if (this.selectMapType === 'equipment') {
      index = this.selectData.findIndex(_item => item.equipmentId === _item.equipmentId);
    }
    if (index === -1) {
      item.checked = true;
      if (item.areaId && item.areaId !== this.areaId) {
        // item.remarks = `当前选择属于${item.areaName}区`;
        // item.rowActive = true;
      }
      this.selectData = this.selectData.concat([item]);
    }
  }

  /**
   * 向地图中添加点
   * param {any[]} facilityData
   */
  public addMarkers(facilityData: any[]): void {
    const arr = [];
    facilityData.forEach(item => {
      let iconUrl = '';
      const status = item.checked ? '0' : '1';
      const urlSize = item.checked ? '36-48' : '18-24';
      if (this.selectMapType === 'device') {
        iconUrl = CommonUtil.getFacilityIconUrl(urlSize, item.deviceType, status);
      } else {
        iconUrl = CommonUtil.getEquipmentTypeIconUrl(urlSize, item.equipmentType, status);
      }
      const position = item.positionBase.split(',');
      item.lng = parseFloat(position[0]);
      item.lat = parseFloat(position[1]);
      this.mapService.iconSize = ICON_SIZE;
      const icon = this.mapService.toggleIcon(iconUrl, urlSize);
      const point = this.mapService.createPoint(item.lng, item.lat);
      const func = [
        {
          eventName: 'click',
          eventHandler: (event, __event) => {
            const targetIcon = event.target.getIcon();
            const data = this.mapService.getMarkerDataById(event.target.customData.id);
            if (data.equipmentList && data.equipmentList.length > 1) {
              // 为图标样式重置保存上一次数据
              this.targetMarker = event;
              this.equipmentTableWindow(data);
            }
            let _icon;
            let imgUrl = '';
            if (this.selectMapType === 'device') {
              imgUrl = CommonUtil.getFacilityIconUrl(iconSize, data.deviceType, '1');
            } else {
              imgUrl = CommonUtil.getEquipmentTypeIconUrl(iconSize, data.equipmentType, '1');
            }
            if (targetIcon.imageUrl === imgUrl || targetIcon.url === imgUrl) {
              let _imgUrl = CommonUtil.getFacilityIconUrl('36-48', data.deviceType);
              if (this.selectMapType === 'equipment') {
                _imgUrl = CommonUtil.getEquipmentTypeIconUrl('36-48', data.equipmentType);
              }
              _icon = this.mapService.toggleIcon(_imgUrl, '36-48');
              if (!data.equipmentList || (data.equipmentList && data.equipmentList.length < 2)) {
                this.pushToTable(data);
                this.refreshSelectPageData();
              }
            }
            event.target.setIcon(_icon);
          }
        },
        // 地图上的设施点悬浮显示信息面板
        {
          eventName: 'mouseover',
          eventHandler: (event, __event) => {
          }
        },
        {
          eventName: 'mouseout',
          eventHandler: () => {
            this.isShowInfoWindow = false;
          }
        }
      ];
      const marker = this.mapService.createNewMarker(point, icon, func);
      if (this.selectMapType === 'device') {
        marker.customData = {id: item.deviceId};
        arr.push(marker);
        this.mapService.setMarkerMap(item.deviceId, {marker: marker, data: item});
      } else if (this.selectMapType === 'equipment') {
        if (item.equipmentList && item.equipmentList.length > 1) {
          // 多重设备点添加数字
          marker.setLabel(this.mapService.getEPointNumber(item.equipmentList.length));
        }
        marker.customData = {id: item.equipmentId};
        arr.push(marker);
        this.mapService.setMarkerMap(item.equipmentId, {marker: marker, data: item});
      }
    });
    this.markerClusterer = this.mapService.addMarkerClusterer(arr);
  }


  /**
   * 重置
   */
  public restMapTable(): void {
    if (this.selectMapType === 'device') {
      this.queryDeviceByArea();
    } else if (this.selectMapType === 'equipment') {
      this.getEquipmentInfo();
    }
  }

  /***
   * 取消
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  public searchFacilityName(): void {
    if (this.selectMapType === 'device') {
      this.orderSearchTypeName = this.indexLanguage.searchDeviceName;
    } else if (this.selectMapType === 'equipment') {
      this.orderSearchTypeName = this.InspectionLanguage.equipmentName;
    }
    this.IndexObj = {
      facilityNameIndex: 1,
      bMapLocationSearch: -1,
      gMapLocationSearch: -1,
    };
  }

  /**
   * 地址搜索
   */
  public searchAddress(): void {
    this.orderSearchTypeName = this.indexLanguage.searchAddress;
    if (this.mapType === 'baidu') {
      this.IndexObj = {
        facilityNameIndex: -1,
        bMapLocationSearch: 1,
        gMapLocationSearch: -1,
      };
    } else if (this.mapType === 'google') {
      this.IndexObj = {
        facilityNameIndex: -1,
        bMapLocationSearch: -1,
        gMapLocationSearch: 1,
      };
    }
  }

  /**
   * 地址输入检索
   */
  public onInput(value: string): void {
    const _value = value.trim();
    this.options = [];
    this.facilityData.forEach(item => {
      if (this.selectMapType === 'device') {
        item.selectName = item.deviceName;
        item.selectId = item.deviceId;
        if (item.selectName.indexOf(_value) > -1) {
          this.options.push(item);
        }
      } else if (this.selectMapType === 'equipment') {
        item.selectName = item.equipmentName;
        item.selectId = item.equipmentId;
        if (item.selectName.indexOf(_value) > -1) {
          this.options.push(item);
        }
      }
    });
  }

  public optionChange(event, item): void {
    this.inputValue = item.selectName;
    this.selectMarker(item.selectId);
  }

  /**
   * 键盘回车事件
   * param event
   */
  public keyDownEvent(event): void {
    if (event.key === 'Enter') {
      this.selectMarker(this.inputValue);
    }
  }

  /**
   * 设置表格列
   */
  private setSelectMapConfig(): void {
    this.mapSelectorConfig.selectedColumn = [];
    this.mapSelectorConfig.showSearchSwitch = true;
    if (this.selectMapType === 'device') {
      // 是否需要过滤已有的设施类型 TODO
      /*const arr = FacilityForCommonUtil.getRoleFacility(this.$i18n);
      const device = [];
      if (this.deviceType.length > 0) {
        arr.forEach(item => {
          if (this.deviceType.includes(<string>item.code)) {
            device.push(item);
          }
        });
      }*/
      this.mapSelectorConfig.selectedColumn = [
        {
          title: this.InspectionLanguage.deviceName,
          key: 'deviceName', width: 80,
          searchable: true, searchConfig: {type: 'input'}, isShowSort: true
        },
        {
          title: this.InspectionLanguage.deviceCode,
          key: 'deviceCode', width: 60,
          searchable: true, searchConfig: {type: 'input'}, isShowSort: true
        },
        {
          title: this.InspectionLanguage.facilityType, key: 'deviceTypeName', width: 90,
          type: 'render', renderTemplate: this.deviceTypeTemp, isShowSort: true,
          searchKey: 'deviceType', searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$i18n),
            label: 'label', value: 'code'
          }
        },
        {
          title: this.InspectionLanguage.parentId,
          key: 'address', width: 80,
          searchable: true, searchConfig: {type: 'input'}, isShowSort: true
        }
      ];
    } else {
      this.mapSelectorConfig.selectedColumn = [
        {
          title: this.InspectionLanguage.equipmentName,
          key: 'equipmentName', width: 80,
          searchable: true, searchConfig: {type: 'input'}, isShowSort: true
        },
        {
          title: this.InspectionLanguage.deviceCode,
          key: 'equipmentCode', width: 80,
          searchable: true, searchConfig: {type: 'input'}, isShowSort: true
        },
        {
          title: this.InspectionLanguage.equipmentType, key: 'equipmentType', width: 90,
          type: 'render', renderTemplate: this.equipTemp, isShowSort: true, searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$i18n),
            label: 'label',
            value: 'code'
          }
        },
        {
          title: this.InspectionLanguage.parentId,
          key: 'address', width: 80,
          searchable: true, searchConfig: {type: 'input'}, isShowSort: true
        }
      ];
    }
    this.initSelectorConfig();
    this.selectorConfig.isDraggable = true;
  }

  /**
   * 获取区域下的设施
   */
  private queryDeviceByArea(): void {
    const data = new AreaDeviceParamModel();
    data.areaCode = this.areaId;
    if (this.deviceType && Array.isArray(this.deviceType) && this.deviceType.length > 0) {
      data.deviceTypes = this.deviceType;
    } else {
      data.deviceType = this.deviceType.toString();
    }
    this.showProgressBar();
    this.$facilityForCommonService.queryDeviceDataList(data).subscribe((result: Result) => {
      if (result.code === ResultCodeEnum.success) {
        this.hideProgressBar();
        this.$modalService.remove();
        // 每次切换数据先把原来的数据清空
        this.initMap();
        this.selectData = [];
        this.clearAll();
        this.facilityData = result.data || [];
        this.treeNodeSum = this.facilityData.length;
        this.firstData = [];
        // 默认该区域下没有设施
        this.areaNotHasDevice = true;
        this.facilityData.forEach(item => {
          if (item.deviceType) {
            item.iconType = item.deviceType;
            item.deviceTypeName = FacilityForCommonUtil.translateDeviceType(this.$i18n, item.deviceType);
            item.deviceIcon = CommonUtil.getFacilityIconClassName(item.deviceType);
          }
          item.address = item.areaInfo.areaName;
          this.areaNotHasDevice = false;
          // 选中全集
          if (this.isSelectAll === '1') {
            this.firstData.push(item);
            this.pushToTable(item);
          }
          // 加载已选数据
          if (this.deviceSet.length > 0) {
            if (this.deviceSet.includes(item.deviceId)) {
              item.checked = true;
              this.firstData.push(item);
              this.pushToTable(item);
            }
          } else {
            item.checked = false;
          }
          /*if (this.isSelectAll === '0' && !this.deviceSet.length) {
            item.checked = true;
            this.firstData.push(item);
            this.pushToTable(item);
          } else {
            // 找出属于传入设施集合的数据加入右边表格
            if (this.deviceSet.includes(item.deviceId)) {
              item.checked = true;
              this.firstData.push(item);
              this.pushToTable(item);
            }
          }*/
        });
        this.refreshSelectPageData();
        // 先清除上一次的点
        if (this.mapType === 'baidu' && this.markerClusterer) {
          this.markerClusterer.clearMarkers(this.markersArr);
        }
        this.addMarkers(this.facilityData);
        this.areaCenterAndZoom();
        // 该区域下没有设施定位到用户登陆到位置
        // if (this.areaNotHasDevice) {
        //   this.mapService.locateToUserCity();
        // }
      }
    }, () => {
      this.hideProgressBar();
      this.$modalService.remove();
    });
  }

  /**
   * 获取设施下的设备信息
   */
  private getEquipmentInfo(): void {
    const data = new AreaDeviceParamModel();
    /*data.areaCode = this.areaId;*/
    data.deviceIds = this.deviceIdList;
    data.equipmentTypes = this.equipmentTypes;
    // data.equipmentTypes = [this.equipmentRadioValue];
    this.$facilityForCommonService.listEquipmentBaseInfoByAreaCode(data).subscribe((result: Result) => {
      if (result.code === ResultCodeEnum.success) {
        this.hideProgressBar();
        this.$modalService.remove();
        // 每次切换数据先把原来的数据清空
        this.initMap();
        this.selectData = [];
        this.clearAll();
        this.facilityData = result.data || [];
        this.treeNodeSum = this.facilityData.length;
        this.firstData = [];
        // 默认该区域下没有设施
        this.areaNotHasDevice = true;
        /*if (this.treeNodeSum > 0) {
          this.areaId = this.facilityData[0].areaId;
        }*/
        if (this.equipmentSaveData.length) {
          this.selectData = this.equipmentSaveData;
        } else {
          this.facilityData.forEach(item => {
            item.iconType = item.equipmentType;
            if (item.equipmentType) {
              item.equipmentTypeName = FacilityForCommonUtil.translateEquipmentType(this.$i18n, item.equipmentType);
              item.equipIcon = CommonUtil.getEquipmentIconClassName(item.equipmentType);
            }
            this.areaNotHasDevice = false;
            item.positionBase = item.deviceInfo.positionBase;
            item.deviceStatus = item.deviceInfo.deviceStatus;
            if (this.isSelectAll === '1') {
              this.firstData.push(item);
              this.pushToTable(item);
            }
            item.address = item.areaInfo.areaName;
            // 比较已选择数据
            if (this.hasSelectData.length > 0) {
              if (this.hasSelectData.includes(item.equipmentId)) {
                // 只加载已选数据
                item.checked = true;
                this.firstData.push(item);
                this.pushToTable(item);
              }
            } else {
              item.checked = false;
            }
            item.equipmentList = [];
          });
        }
        this.refreshSelectPageData();
        // 先清除上一次的点
        if (this.mapType === 'baidu' && this.markerClusterer) {
          this.markerClusterer.clearMarkers(this.markersArr);
        }
        this.mapEquipmentData(this.facilityData);
        // 该区域下没有设施定位到用户登陆到位置
        // if (this.areaNotHasDevice) {
        //   this.mapService.locateToUserCity();
        // }
      }
    }, error => {
      this.hideProgressBar();
      this.$modalService.remove();
    });
  }

  /**
   * 地图设备数据处理
   */
  public mapEquipmentData(data) {
    // 深拷贝一份数据用作对比
    const deepData = CommonUtil.deepClone(data);
    // 将相同坐标数据push到每条数据的子集中——————多重设备列表使用
    const map = new Map();
    const arr = [];
    deepData.forEach(item => {
      if (map.has(item.positionBase)) {
        item.positionId = map.get(item.positionBase).equipmentId;
        map.get(item.positionBase).equipmentList.push(item);
      } else {
        item.positionId = item.equipmentId;
        item.equipmentList = [item];
        map.set(item.positionBase, item);
      }
    });
    map.forEach((value, key) => {
      arr.push(value);
    });
    // 根据坐标去重
    this.addMarkers(arr);
    this.areaCenterAndZoom();
  }


  // todo 区域选择器重构新方法  ////////////////////////////////////////////////////////////

  /**
   * 地图初始化中心点
   */
  public areaCenterAndZoom() {
    let requestHeader;
    const areaFacilityModel = new AreaFacilityModel;
    areaFacilityModel.filterConditions.area = [];
    areaFacilityModel.filterConditions.group = [];
    areaFacilityModel.polymerizationType = '1';
    areaFacilityModel.codeList = [this.areaId];
    if (this.selectMapType === 'device') {
      // 设施区域中心点查询参数
      areaFacilityModel.filterConditions.device = this.deviceType;
      requestHeader = this.$mapService.queryDevicePolymerizationsPointCenter(areaFacilityModel);
    } else {
      // 设备区域中心点查询参数
      // this.equipmentTypes;
      areaFacilityModel.filterConditions.equipment = [this.equipmentRadioValue];
      requestHeader = this.$mapService.queryEquipmentPolymerizationsPointCenter(areaFacilityModel);
    }
    // 获取设施区域中心点
    requestHeader.subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.positionCenter) {
        // 设置区域中心点
        const centerPoint = result.data.positionCenter.split(',');
        this.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.areaZoom);
      }
    });
  }

  /**
   * 地图添加监听(由于继承区域选择器，所以必须实现一个空方法，以免跟区域选择器功能冲突)
   */
  public addEventListenerToMap(): void {
    this.mapService.mapEventHook().subscribe(data => {
      const type = data.type;
      console.log(type);
      // 标记点
      /**
      if (type === 'zoomend') {

      } else if (type === 'dragend') {

      } else
       */
      if (type === 'click') {
        // 关闭多重设备列表并且清空数据
        this.isShowTableWindow = false;
        this.setData = [];
        this.equipmentListData = [];
      }
    });
  }


  /**
   * 多个设备点列表
   */
  public equipmentTableWindow(data): void {
    // 判断是否为多重设备
    if (data.equipmentList.length > 1) {
      this.equipmentListData = data.equipmentList.map(item => {
        return item;
      });
      this.setData = this.equipmentListData;
      this.isShowTableWindow = true;
      // 平移中心点
      this.mapService.panTo(data.lng, data.lat);
      // 初始化多重设备列表
      this.initEquipmentTableConfig();
    }
  }

  /**
   * 设备重合右键多重列表
   */
  public initEquipmentTableConfig(): void {
    this.equipmentTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '160px', y: '85px'},
      outHeight: 250,
      noAutoHeight: true,
      topButtons: [],
      noIndex: true,
      columnConfig: [
        {
          title: this.indexLanguage.equipmentName, key: 'equipmentName', width: 100,
          isShowSort: false,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedRight: true, style: {left: '0px'}}
        },
        {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 60, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: true,
      operation: [
        {
          // 定位
          text: this.language.addTo,
          className: 'fiLink-add',
          handle: (currentIndex) => {
            this.pushToTable(currentIndex);
            this.refreshSelectPageData();
          }
        },
      ],
      handleSearch: (event) => {
        this.queryConditions = event;
        this.filterData();
      }
    };
  }

  /**
   * 过滤数据
   */
  public filterData() {
    this.setData = this.equipmentListData.filter(item => {
      return this.checkFacility(item);
    });
  }

  /**
   * 校检名称
   * param item
   * returns {boolean}
   */
  public checkFacility(item) {
    let bol = true;
    this.queryConditions.forEach(q => {
      /**
      if (q.filterValue && q.operator === 'eq' && item[q.filterField] !== q.filterValue) {
        bol = false;
      } else if (q.filterValue && q.operator === 'like' && !item[q.filterField].includes(q.filterValue)) {
        bol = false;
      } else if (q.filterValue && q.operator === 'in' && (q.filterValue.indexOf(item[q.filterField]) < 0)) {
        bol = false;
      }
       */
      if (q.filterValue && ((q.operator === 'eq' && item[q.filterField] !== q.filterValue) ||
        (q.operator === 'like' && !item[q.filterField].includes(q.filterValue)) ||
        (q.operator === 'in' && (q.filterValue.indexOf(item[q.filterField]) < 0)))) {
        bol = false;
      }
    });
    return bol;
  }


}
