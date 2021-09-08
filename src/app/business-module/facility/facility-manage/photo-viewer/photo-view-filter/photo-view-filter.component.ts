import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../../shared-module/model/alarm-selector-config.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {AreaModel} from '../../../../../core-module/model/facility/area.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {ImageFilterModel} from '../../../share/model/image-filter.model';
import {PicResourceEnum} from '../../../../../core-module/enum/picture/pic-resource.enum';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {FilterCondition} from '../../../../../shared-module/model/query-condition.model';

/**
 * 图片过滤组件
 */
@Component({
  selector: 'app-photo-view-filter',
  templateUrl: './photo-view-filter.component.html',
  styleUrls: ['./photo-view-filter.component.scss']
})
export class PhotoViewFilterComponent implements OnInit {
  // 条件切换时间
  @Output() public changeFilter = new EventEmitter<ImageFilterModel>();
  // 过滤条件
  public filterObj: ImageFilterModel = new ImageFilterModel();
  // 选择的设备数据
  public selectEquipments: EquipmentListModel[] = [];
  // 来源列表
  public resourceList: SelectModel[] = [];
  // 控制区域显示隐藏
  public areaSelectVisible = false;
  // 国际化配置
  public language: FacilityLanguageInterface;
  // 区域
  public areaSelectorConfig = new TreeSelectorConfigModel();
  // 设施选择器配置
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 勾选的告警对象
  public checkDeviceObject: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  public filterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 区域节点
  private areaNodes: AreaModel[] = [];

  constructor(
    private $facilityCommonService: FacilityForCommonService,
    private $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocaleData(LanguageEnum.facility);
  }

  /**
   *  初始化
   */
  public ngOnInit(): void {
    // 设施类型查询列表
    this.resourceList = [
      {
        label: this.language.picInfo.alarm,
        value: PicResourceEnum.alarm
      }, {
        label: this.language.picInfo.worker,
        value: PicResourceEnum.workOrder,
      }, {
        label: this.language.picInfo.picture,
        value: PicResourceEnum.realPic,
      }
      , {
        label: this.language.picInfo.openDoor,
        value: PicResourceEnum.trouble,
      }
    ] as SelectModel[];
    this.initAreaSelectorConfig();
    this.initDeviceObjectConfig();
  }

  /**
   * 打开设备选择器
   */
  public openEquipmentSelector(): void {
    this.equipmentVisible = true;
  }

  /**
   * 区域选择监听
   * param item
   */
  public areaSelectChange(item: AreaModel[]): void {
    if (item && item[0]) {
      this.filterObj.areaId = item[0].areaId;
      this.filterObj.areaName = item[0].areaName;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, item[0].areaId);

    } else {
      this.filterObj.areaId = '';
      this.filterObj.areaName = '';
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
    }
  }

  /**
   * 选择设备过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.filterObj.equipmentName = event.map(item => item.equipmentName).join(',') || '';
    this.filterObj.equipmentIds = event.map(row => row.equipmentId) || [];
  }

  /**
   * 手动查询
   */
  public handleSearch(): void {
    const filterObj = JSON.parse(JSON.stringify(this.filterObj));
    if (filterObj.deviceTypes && filterObj.deviceTypes.length > 0) {
      filterObj.deviceTypes = filterObj.deviceTypes.map(item => item.value);
    }
    this.changeFilter.emit(filterObj);
  }

  /**
   * 重置
   */
  public handleReset(): void {
    this.filterObj = new ImageFilterModel();
    this.selectEquipments = [];
    this.initDeviceObjectConfig();
    FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, null);
    this.changeFilter.emit(this.filterObj);
    this.filterValue.filterName = null;
  }

  /**
   * 设施选择器
   */
  public initDeviceObjectConfig(): void {
    this.deviceObjectConfig = {
      clear: !(this.filterObj && !_.isEmpty(this.filterObj.deviceIds)),
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkDeviceObject = event;
        this.filterObj.deviceIds = event.ids;
      }
    };
  }

  /**
   * 打开区域选择器
   */
  public openAreaSelector(): void {
    this.areaSelectVisible = true;
    this.areaSelectorConfig.treeNodes = this.areaNodes;
  }

  /**
   * 支持enter搜索
   * param item
   */
  public keydown(item): void {
    if (item.key === 'Enter') {
      this.handleSearch();
    }
  }

  /**
   * 初始化选择区域配置
   * param nodes
   */
  private initAreaSelectorConfig(): void {
    this.$facilityCommonService.queryAreaList().subscribe((res: ResultModel<AreaModel[]>) => {
      this.areaNodes = res.data || [];
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, null);
      this.areaSelectorConfig = {
        width: '500px',
        height: '300px',
        title: `${this.language.select}${this.language.area}`,
        treeSetting: {
          check: {
            enable: true,
            chkStyle: 'radio',
            radioType: 'all',
          },
          data: {
            simpleData: {
              enable: true,
              idKey: 'areaId',
            },
            key: {
              name: 'areaName'
            },
          },

          view: {
            showIcon: false,
            showLine: false
          }
        },
        treeNodes: this.areaNodes
      };
    });
  }
}
