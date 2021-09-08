import {Component, Input, OnInit} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexApiService} from '../../service/index/index-api.service';
import {FacilityEquipmentConfigModel} from '../../shared/model/facility-equipment-config.model';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ProgramListModel} from '../../../../core-module/model/group/program-list.model';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {DeviceTabListEnum} from '../../shared/enum/index-enum';
import {SetEquipmentDataModel} from '../../shared/model/log-operating.model';
import {indexCoverageType} from '../../../../core-module/const/index/index.const';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AreaModel} from '../../shared/model/area.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';

@Component({
  selector: 'app-planning-list',
  templateUrl: './planning-list.component.html',
  styleUrls: ['./planning-list.component.scss']
})
export class PlanningListComponent implements OnInit {
  // 视图类型
  @Input() viewIndex: string;
// 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 规划数据
  public planningData: string[] = [indexCoverageType.noData];
  // 智慧杆型号选择结果
  public smartPoleModelData: string[] = [];
  // 建设状态选择结果
  public constructionStatusData: string[] = [];
  // 智慧杆型号出参数据模型
  public setSmartPoleModelData = [];
  // 建设状态出参数据模型
  public setConstructionStatusData = [];
  // 设备类型出参数据模型
  public equipmentTypeList: SetEquipmentDataModel[] = [];
  // 分组数据
  public groupList: string[] = [];
  // 设施设备类型组件配置
  public facilityEquipmentComponent: FacilityEquipmentConfigModel;
  // 节目信息
  public program: ProgramListModel = new ProgramListModel();
  // 分组权限
  public groupListRole: boolean = false;
  // 左侧tabList可选数据
  public deviceTabList = [
    {key: 'planning', value: 'planning'},
    {key: 'smartPoleModelPlanning', value: 'smartPoleModel'},
    {key: 'constructionStatusPlanning', value: 'constructionStatus'},
  ];
  // 左侧tabList选中数据
  public deviceActive: string = DeviceTabListEnum.planning;
  // 左侧tabList数据枚举
  public deviceTabListEnum = DeviceTabListEnum;
  // 是否第一次点击
  public firstClick: boolean = true;

  constructor(
    private $nzI18n: NzI18nService,
    private $indexApiService: IndexApiService,
    private $mapStoreService: MapStoreService,
    private $message: FiLinkModalService,
  ) {
  }

  public ngOnInit(): void {
    // 国际化翻译
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    // 分组权限查询
    this.groupListRole = SessionUtil.checkHasRole('09-2-2-2');
    // 设备状态权限
    this.facilityEquipmentConfig();
    // 获取设施类型
    this.getFacilityType();
    // 获取设备类型
    this.getEquipmentType();
  }

  /**
   * 区域选择结果
   * param evt
   */
  public planningDataEvent(evt: string[]): void {
    this.planningData = evt;
  }

  /**
   * 智慧杆型号选择器选择结果
   * param evt
   */
  public smartPoleModelSelect(evt: string[]): void {
    this.smartPoleModelData = evt;
  }

  /**
   * 建设状态选择器选择结果
   * param evt
   */
  public constructionStatusSelect(evt: string[]): void {
    this.constructionStatusData = evt;
  }

  /**
   * 分组数据
   * {string[]} evt
   */
  public selectGroupItem(evt: string[]): void {
    this.groupList = evt;
    this.$mapStoreService.logicGroupList = evt;
  }

  /**
   *左侧tabList改变
   */
  public tabChange(activeKey: string): void {
    this.deviceActive = activeKey;
    this.firstClick = false;
    if (activeKey === this.deviceTabListEnum.smartPoleModelPlanning) {
      this.facilityEquipmentComponent = {
        showConstructionStatusComponent: false,
        showSmartPoleModelComponent: true,
        showFacilitiesComponent: false,
        showEquipmentComponent: false,
        showWorkOrderStatusComponent: false,
        showWorkOrderTypeComponent: false,
        facilityTitleName: this.indexLanguage.constructionStatus,
        equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
      };
    } else if (activeKey === this.deviceTabListEnum.constructionStatusPlanning) {
      this.facilityEquipmentComponent = {
        showSmartPoleModelComponent: false,
        showConstructionStatusComponent: true,
        showFacilitiesComponent: false,
        showEquipmentComponent: false,
        showWorkOrderStatusComponent: false,
        showWorkOrderTypeComponent: false,
        facilityTitleName: this.indexLanguage.smartPoleModel,
        equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
      };
    } else {
      this.facilityEquipmentComponent = {
        showSmartPoleModelComponent: false,
        showConstructionStatusComponent: false,
        showFacilitiesComponent: false,
        showEquipmentComponent: false,
        showWorkOrderStatusComponent: false,
        showWorkOrderTypeComponent: false,
        facilityTitleName: this.indexLanguage.smartPoleModel,
        equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
      };
    }
  }

  /**
   * 设施设备选择器配置
   */
  private facilityEquipmentConfig(): void {
    this.facilityEquipmentComponent = {
      showFacilitiesComponent: false,
      showEquipmentComponent: false,
      showWorkOrderStatusComponent: false,
      showWorkOrderTypeComponent: false,
      facilityTitleName: this.indexLanguage.facilityTypeTitle,
      equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
    };
  }

  /**
   * 设施类型数据加载
   */
  private getFacilityType(): void {
    // 如果有规划集权限
    if (SessionUtil.checkHasProjectPlanningTypes('P001')) {
      this.$indexApiService.getPoleModel({}).subscribe((result: ResultModel<AreaModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.setSmartPoleModelData = result.data.map(item => {
            return {status: item, count: 0, checked: true};
          });
        }
      });
    }
    this.setConstructionStatusData = [
      {status: 'end', count: 0, checked: true},
      {status: 'running', count: 1, checked: true},
      {status: 'runnable', count: 2, checked: true},
    ];
  }

  /**
   * 设备类型数据加载
   */
  private getEquipmentType(): void {
    this.equipmentTypeList = [];
  }
}
