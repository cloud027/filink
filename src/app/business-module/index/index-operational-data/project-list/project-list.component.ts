import {Component, Input, OnInit} from '@angular/core';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {indexCoverageType} from '../../../../core-module/const/index/index.const';
import {SetEquipmentDataModel} from '../../shared/model/log-operating.model';
import {FacilityEquipmentConfigModel} from '../../shared/model/facility-equipment-config.model';
import {ProgramListModel} from '../../../../core-module/model/group/program-list.model';
import {DeviceTabListEnum} from '../../shared/enum/index-enum';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexApiService} from '../../service/index/index-api.service';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  // 视图类型
  @Input() viewIndex: string;
// 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 区域数据
  public areaData: string[] = [indexCoverageType.noData];
  // 智慧杆型号数据
  public smartData: string[] = [indexCoverageType.noData];
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
    {key: 'project', value: 'project'},
    {key: 'smartPoleModelProject', value: 'smartPoleModel'},
    {key: 'constructionStatusProject', value: 'constructionStatus'},
  ];
  // 左侧tabList选中数据
  public deviceActive: string = DeviceTabListEnum.project;
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
   * 项目选择结果
   * param evt
   */
  public projectDataChange(evt: string[]): void {
    this.areaData = evt;
  }

  /**
   * 智慧杆型号选择结果
   * param evt
   */
  public smartPoleModelDataChange(evt: string[]): void {
    this.smartData = evt;
  }

  /**
   * 设备选择器选择结果
   * param evt
   */
  public smartPoleModelSelect(evt: string[]): void {
    this.smartPoleModelData = evt;
  }

  /**
   * 设备选择器选择结果
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
    if (activeKey === this.deviceTabListEnum.constructionStatusProject) {
      this.facilityEquipmentComponent = {
        showConstructionStatusComponent: true,
        showSmartPoleModelComponent: false,
        showFacilitiesComponent: false,
        showEquipmentComponent: false,
        showWorkOrderStatusComponent: false,
        showWorkOrderTypeComponent: false,
        facilityTitleName: this.indexLanguage.constructionStatus,
        equipmentTitleName: this.indexLanguage.equipmentTypeTitle,
      };
    } else {
      this.facilityEquipmentComponent = {
        showConstructionStatusComponent: false,
        showSmartPoleModelComponent: false,
        showFacilitiesComponent: false,
        showEquipmentComponent: false,
        showWorkOrderStatusComponent: false,
        showWorkOrderTypeComponent: false,
        facilityTitleName: this.indexLanguage.constructionStatus,
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
    this.setSmartPoleModelData = [
      {status: this.indexLanguage.toBeBuilt, count: 0, checked: true},
      {status: this.indexLanguage.underConstruction, count: 1, checked: true},
    ];
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
