import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {indexFacilityPanel} from '../../shared/const/index-const';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {DetailCode} from '../../shared/enum/index-enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {MapTypeEnum} from '../../../../core-module/enum/index/index.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {IndexApiService} from '../../service/index/index-api.service';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import * as lodash from 'lodash';

/**
 * 设施详情卡片
 */
@Component({
  selector: 'app-facility-particulars-card',
  templateUrl: './facility-particulars-card.component.html',
  styleUrls: ['./facility-particulars-card.component.scss']
})
export class FacilityParticularsCardComponent implements OnInit {
  // 表格组件
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 设施id
  @Input() facilityId: string;
  // 设施Name
  @Input() facilityName: string;
  // 设施类型
  @Input() facilityCode: string;
  // 设施设备id对象集合
  @Input() idData;
  // 权限code
  @Input() facilityPowerCode = [];
  // 是否显示实景图信息
  @Input() isShowBusinessPicture: boolean;
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 首页语言包
  public commonLanguage: CommonLanguageInterface;
  // 设施详情tab页选中的index
  public selectedIndex = indexFacilityPanel.facilityDetail;
  // 是否显示设施详情tab
  public isShowFacilityDetailTab = true;
  // 是否显示告警tab
  public isShowFacilityAlarmTab = false;
  // 是否显示日志工单tab
  public isShowFacilityLogAndOrderTab = false;
  // 是否显示实景图tab
  public isShowFacilityRealSceneTab = false;
  // 地图分层
  public indexType = this.$mapCoverageService.showCoverage;
  // 权限码
  public powerCode = DetailCode;
  // 批量操作权限
  public roleDeviceOperating: boolean = false;
  // 详情卡title
  public particularsName: string;
  // 告警title
  public alarmName: string;
  // 首页分层类型
  public indexLayeredTypeEnum;
  // 当前告警权限
  public currentAlarmRole: boolean = false;
  // 历史告警权限
  public hisAlarmRole: boolean = false;
  // 工单权限
  public workOrderRole: boolean = false;
  // 设施日志权限
  public deviceLogRole: boolean = false;
  // 操作日志权限
  public operationLogRole: boolean = false;
  // 操作权限查询
  public operation: boolean = false;
  // 实景图点击切换设备操作
  public pictureClickShowOperating: boolean = false;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;


  // 列表弹窗开关
  public operationVisible: boolean = false;
  // 列表数据
  public dataSet = [];
  // 列表分页
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 过滤框显示设施名
  public filterDeviceName: string = '';
  // 设施过滤
  public filterValue: FilterCondition;
  // 设施过滤选择器
  public facilityVisible: boolean = false;
  // 已选择设施数据
  public selectFacility: FacilityListModel[] = [];
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备状态
  public equipmentStatus;
  // 设备类型
  public equipmentType;


  constructor(public $nzI18n: NzI18nService,
              private $mapCoverageService: MapCoverageService,
              private $indexApiService: IndexApiService,
              private $message: FiLinkModalService,
              private $facilityCommonService: FacilityForCommonService) {
    this.indexLanguage = $nzI18n.getLocaleData('index');
    this.indexLayeredTypeEnum = MapTypeEnum;
  }

  public ngOnInit(): void {
    // 批量操作权限
    this.roleDeviceOperating = SessionUtil.checkHasRole('05-2');
    // 当前告警权限验证
    this.currentAlarmRole = SessionUtil.checkHasRole('02-1');
    // 历史告警权限验证
    this.hisAlarmRole = SessionUtil.checkHasRole('02-2');
    // 工单权限验证
    this.workOrderRole = SessionUtil.checkHasRole('06');
    // 设施日志权限验证
    this.deviceLogRole = SessionUtil.checkHasRole('03-5');
    // 操作日志权限验证
    this.operationLogRole = SessionUtil.checkHasRole('04-2-1');
    // 设备操作权限查询
    this.parseProtocol(this.idData.equipmentId, this.idData.equipmentType);
    // 根据地图分层类型显示详情卡title
    if (this.indexType === MapTypeEnum.facility) {
      this.isShowFacilityRealSceneTab = false;
      this.particularsName = this.indexLanguage.facilityDetailPanelTitle;
      this.alarmName = this.indexLanguage.facilityAlarmPanelTitle;
    }
    if (this.indexType === MapTypeEnum.equipment) {
      this.isShowFacilityRealSceneTab = false;
      this.particularsName = this.indexLanguage.equipmentDetailPanelTitle;
      this.alarmName = this.indexLanguage.equipmentAlarmPanelTitle;
    }
    // 设施语言包
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTableConfig();
    this.equipmentStatus = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, LanguageEnum.facility);
    this.equipmentStatus = this.equipmentStatus.filter(item => item.code !== EquipmentStatusEnum.dismantled);
    this.equipmentType = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    if (this.equipmentType) {
      this.equipmentType = this.equipmentType.filter(item => item.code !== EquipmentTypeEnum.baseStation && item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
    }
  }

  /**
   * 判断是否有操作权限
   */
  public checkHasTenantRole(code: string): boolean {
    return SessionUtil.checkHasTenantRole(code);
  }

  /**
   * tabs页签选中变更
   */
  public selectedIndexChange(event): void {
    if (event === indexFacilityPanel.facilityDetail) {
      this.isShowFacilityDetailTab = true;
    } else if (event === indexFacilityPanel.facilityAlarm) {
      this.isShowFacilityAlarmTab = true;
    } else if (event === indexFacilityPanel.logAndOrderTab) {
      this.isShowFacilityLogAndOrderTab = true;
    } else if (event === indexFacilityPanel.RealSceneTab) {
      this.isShowFacilityRealSceneTab = true;
    }
  }

  /**
   * 获取单个操作权限
   * param id
   * param type
   */
  public parseProtocol(equipmentId: string, equipmentType: string): void {
    this.$indexApiService.parseProtocol({equipmentId: equipmentId}).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.operations && result.data.operations.length) {
          this.operation = true;
        }
      }
    });
  }

  /**
   * 点击事件
   * param evt
   */
  public clickChange(evt): void {
    this.idData = {
      deviceId: evt.$detail.deviceId,
      equipmentId: evt.$detail.equipmentId,
      equipmentModel: evt.$detail.equipmentModel,
      equipmentType: evt.$detail.equipmentType,
      name: evt.$detail.equipmentName,
    };
    this.pictureClickShowOperating = true;
  }

  /**
   * 移动事件
   * param evt
   */
  public mousemoveChange(evt): void {
  }

  /**
   * 返回
   */
  public goBack(): void {
    this.pictureClickShowOperating = false;
  }

  /**
   * 列表分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    // 加载数据
    this.refreshData();
  }

  /**
   * 弹窗关闭按钮
   */
  public closeModal() {
    this.operationVisible = false;
    // 列表数据
    this.dataSet = [];
    // 设施过滤选择器
    this.facilityVisible = false;
    // 已选择设施数据
    this.selectFacility = [];
    this.tableComponent = null;
  }

  public showModal() {
    this.operationVisible = true;
    // 初始化表格参数
    this.initTableConfig();
    this.queryCondition = new QueryConditionModel();
    // 刷新数据
    this.refreshData();
  }

  /**
   * 列表数据查询
   */
  public refreshData() {
    this.tableConfig.isLoading = true;
    const arr = [
      {
        'filterField': 'noMountPosition',
        'operator': 'eq',
        'filterValue': true
      }, {
        'filterField': 'deviceId',
        'operator': 'in',
        'filterValue': [this.facilityId]
      }
    ];
    this.queryCondition.filterConditions.push(...arr);
    this.$facilityCommonService.equipmentListByPage(this.queryCondition).subscribe((result: ResultModel<EquipmentListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }


  /**
   * 点击输入框弹出设施选择
   */
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    this.facilityVisible = true;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    } else {
      const deviceNameArr = this.filterValue.filterName.split(',');
      this.selectFacility = this.filterValue.filterValue.map((item, index) => {
        return {deviceId: item, deviceName: deviceNameArr[index]};
      });
    }
  }

  /**
   * 初始化表格参数
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      primaryKey: '03-8',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '800px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      showImport: false,
      notShowPrint: true,
      columnConfig: [
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        { // 名称
          title: this.language.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 类型
          title: this.language.type,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          configurable: true,
          width: 160,
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.equipmentType,
            label: 'label',
            value: 'code'
          }
        },
        { // 状态
          title: this.language.status,
          key: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.equipmentStatus,
            label: 'label',
            value: 'code'
          }
        },
        { // 详细地址
          title: this.language.address, key: 'address',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 80,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        { // 控制按钮
          permissionCode: '03-8-2',
          text: this.commonLanguage.control, className: 'fiLink-control',
          handle: (data: EquipmentListModel) => {
            this.selectEquipment(data);
          },
        },
      ],
      leftBottomButtons: [],
      rightTopButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 过滤查询数据
      handleSearch: (event: FilterCondition[]) => {
        const deviceIndex = event.findIndex(row => row.filterField === 'deviceId');
        // 使用设施选择器的设施之后对设施ID过滤进行处理
        if (deviceIndex >= 0 && !lodash.isEmpty(event[deviceIndex].filterValue)) {
          event[deviceIndex].operator = OperatorEnum.in;
        } else {
          this.filterDeviceName = '';
          this.filterValue = null;
          event = event.filter(item => item.filterField !== 'deviceId');
          this.selectFacility = [];
        }
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      },
    };
  }

  public selectEquipment(data) {
    this.idData = {
      deviceId: data.deviceId,
      equipmentId: data.equipmentId,
      equipmentModel: data.equipmentModel,
      equipmentType: data.equipmentType,
      name: data.equipmentName,
    };
    this.closeModal();
    // this.parseProtocol(data.equipmentId, data.equipmentType);
    this.pictureClickShowOperating = true;
  }

}

