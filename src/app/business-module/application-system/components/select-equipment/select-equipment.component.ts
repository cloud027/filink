import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import * as _ from 'lodash';
import {PolicyEnum, TargetTypeEnum} from '../../share/enum/policy.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {ApplicationService} from '../../share/service/application.service';
import {CameraTypeEnum, EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {LinkageStrategyModel} from '../../share/model/linkage.strategy.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {EquipmentModel} from '../../share/model/equipment.model';
import {TableColumnConfig} from '../../share/config/table-column.config';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {Observable} from 'rxjs';
import {FacilityForCommonService} from '../../../../core-module/api-service';
import {SensorTypeEnum} from '../../../facility/share/enum/equipment.enum';


@Component({
  selector: 'app-select-equipment',
  templateUrl: './select-equipment.component.html',
  styleUrls: ['./select-equipment.component.scss']
})
export class SelectEquipmentComponent implements OnInit, OnChanges {
  @Input()
  selectType: string = 'checkbox';
  // 表格是否显示类型筛选
  @Input()
  isDisplay: boolean = false;
  // 设备列表显隐
  @Input()
  public isVisible: boolean = false;
  @Input()
  selectedData: EquipmentModel[] = [];
  @Input()
  targetType: string = EquipmentTypeEnum.singleLightController;
  @Input()
  public linkageStrategyInfo: LinkageStrategyModel = new LinkageStrategyModel({});
  // 单选
  @Input()
  selectEquipment = {equipmentId: '', equipmentName: '', equipmentModel: '', gatewayId: '', equipmentType: ''};
  @Input()
  selectEquipmentType: string = '';
  @Input()
  gatewayQueryMap: any = {};
  // 显示隐藏变化
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() selectChange = new EventEmitter<any>();
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // 设备列表单选
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // 设备列表
  @ViewChild('equipment') equipment: TableComponent;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 单控，集控
  public targetTypeEnum = TargetTypeEnum;
  // 设备列表数据集合
  public dataSet: EquipmentListModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 设备表格配置
  public equipmentTable: TableConfigModel;
  public commonLanguage: CommonLanguageInterface;
  public equipmentLanguage: FacilityLanguageInterface;
  // 表格查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 设备类型
  public equipmentTypeEnum = EquipmentTypeEnum;
  public languageEnum = LanguageEnum;
  public facilityVisible: boolean = false;
  // 设施过滤
  public filterValue: FilterCondition;
  // 已选择设施数据
  public selectFacility: FacilityListModel[] = [];
  // 过滤框显示设施名
  public filterDeviceName: string = '';

  constructor(public $nzI18n: NzI18nService,
              public $applicationService: ApplicationService,
              public $facilityForCommonService: FacilityForCommonService,
              private $message: FiLinkModalService) {
  }

  ngOnInit() {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.handleAddEquipment();
    this.refreshData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedData && !changes.selectedData.firstChange && changes.selectedData.currentValue) {
      this.cleanUpEquipment();
      this.refreshData();
    }
  }


  /**
   * 选择设备
   * @ param event
   * @ param data
   */
  public selectedEquipmentChange(event: string, data: EquipmentModel): void {
    this.selectEquipment.equipmentId = data.equipmentId;
    this.selectEquipment.equipmentName = data.equipmentName;
    this.selectEquipment.equipmentModel = data.equipmentModel;
    this.selectEquipment.gatewayId = data.gatewayId;
    this.selectEquipment.equipmentType = data.equipmentType;
  }

  /**
   * 清空设备
   */
  public cleanUpEquipment(): void {
    this.equipment.keepSelectedData.clear();
    this.equipment.updateSelectedData();
    this.equipment.checkStatus();
  }

  handleTableOk() {
    if (this.selectType === 'checkbox') {
      const data = this.equipment.getDataChecked();
      const equipmentType = [...new Set(data.map(item => item.equipmentType))].join(',');
      this.selectChange.emit({data: data, targetType: equipmentType});

    } else {
      this.selectChange.emit(this.selectEquipment);
    }

  }

  handleCancel() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  nzVisibleChange(event: boolean) {
    this.isVisible = event;
    this.isVisibleChange.emit(this.isVisible);
  }

  /**
   * 下拉切换设备列表
   */
  public handleChangeSelect(bool: boolean): void {
    if (!bool) {
      this.equipment.keepSelectedData.clear();
      this.equipment.updateSelectedData();
      this.refreshData();
    }
  }

  /**
   * 分页查询事件
   * @ param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 添加设备
   */
  public handleAddEquipment(): void {
    let column, selectAbleEquipment: SelectModel[];
    if (this.selectType === 'checkbox' || this.selectType === 'noModal') {
      column = {
        type: 'select',
        fixedStyle: {fixedLeft: true, style: {left: '0px'}},
        width: 62
      };
      let selectAbleType = [EquipmentTypeEnum.singleLightController, EquipmentTypeEnum.centralController, EquipmentTypeEnum.informationScreen];
      if (this.selectEquipmentType === 'gateway') {
        selectAbleType = [EquipmentTypeEnum.singleLightController];
      }
      selectAbleEquipment = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => selectAbleType.includes(<EquipmentTypeEnum>item.code));
    } else {
      column = {
        title: '',
        type: 'render',
        key: 'selectedEquipmentId',
        renderTemplate: this.radioTemp,
        fixedStyle: {fixedLeft: true, style: {left: '0px'}},
        width: 42
      };
      selectAbleEquipment = null;
    }
    this.equipmentTable = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '420px'},
      noIndex: true,
      noAutoHeight: true,
      notShowPrint: true,
      selectedIdKey: 'equipmentId',
      keepSelected: true,
      columnConfig: [
        column,
        // 序号
        ...TableColumnConfig.getEquipmentConfig(
          this.equipmentLanguage,
          this.$nzI18n, this.equipmentTypeTemp, this.equipmentStatusFilterTemp, this.deviceFilterTemplate, selectAbleEquipment),
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        // 没有值的时候重置已选数据
        if (!event.length) {
          this.filterDeviceName = '';
          this.selectFacility = [];
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
    // 对网关策略的设备单选作单独处理
    if (this.selectEquipmentType === 'gateway' && this.selectType === 'radio') {
      const equipmentTypeColumn = this.equipmentTable.columnConfig.find(item => item.key === 'equipmentType');
      if (equipmentTypeColumn) {
        const {temperatureSensor, humiditySensor} = SensorTypeEnum;
        Object.assign(this.equipmentTypeEnum, {temperatureSensor, humiditySensor});
        const temp = CommonUtil.codeTranslate({temperatureSensor, humiditySensor}, this.$nzI18n);
        equipmentTypeColumn.searchConfig.selectInfo.push(...temp);
      }
    }
  }

  /**
   * 默认查询条件
   */
  public defaultQuery() {
    if (this.selectType !== 'checkbox') {
      return;
    }
    const equipmentFlag = this.queryCondition.filterConditions.some(item => item.filterField === PolicyEnum.equipmentType);
    let arr = [EquipmentTypeEnum.singleLightController, EquipmentTypeEnum.centralController, EquipmentTypeEnum.informationScreen];
    if (this.selectEquipmentType === 'gateway') {
      arr = [EquipmentTypeEnum.singleLightController];
    }
    if (!equipmentFlag) {
      const equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, arr);
      this.queryCondition.filterConditions.push(equipmentTypes);
    }
  }

  /**
   * 点击输入框弹出设施选择
   */
  public onShowFacility(value: FilterCondition): void {
    this.filterValue = value;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.facilityVisible = true;
  }

  /**
   * 选择设施数据
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    this.selectFacility = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event.map(item => {
        return item.deviceName;
      }).join(',');
    } else {
      this.filterDeviceName = '';
    }
    this.filterValue.filterValue = event.map(item => {
      return item.deviceId;
    }) || [];
    this.filterValue.operator = OperatorEnum.in;
  }

  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    // 这个地方只能选择传感器的设备 一期没有 先使用future代替 todo
    if (this.targetType === 'future') {
      return;
    }
    this.equipmentTable.isLoading = true;
    this.defaultQuery();
    let response: Observable<ResultModel<EquipmentListModel[]>>;
    if (this.selectEquipmentType === 'gateway') {
      this.queryCondition.bizCondition = this.gatewayQueryMap;
      response = this.$facilityForCommonService.queryGatewaySubsetListByPage(this.queryCondition);
    } else {
      response = this.$applicationService.equipmentListByPage(this.queryCondition);
    }
    response.subscribe((res: ResultModel<EquipmentListModel[]>) => {
      this.equipmentTable.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        const {data, totalCount, pageNum, size} = res;
        this.dataSet = data || [];
        this.pageBean.Total = totalCount;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
        this.dataSet.forEach(item => {
          // 设置状态样式
          const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
          // 获取设备类型的图标
          let iconClass;
          if (item.equipmentType === EquipmentTypeEnum.camera && item.equipmentModelType === CameraTypeEnum.bCamera) {
            // 摄像头球型
            iconClass = `iconfont facility-icon fiLink-shexiangtou-qiuji camera-color`;
          } else {
            iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
          }
          if (<any>item.equipmentType === SensorTypeEnum.temperatureSensor || <any>item.equipmentType === SensorTypeEnum.humiditySensor) {
            iconClass = '';
          }
          item.iconClass = iconClass;
          item.statusIconClass = iconStyle.iconClass;
          item.statusColorClass = iconStyle.colorClass;
          item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
          // item.equipmentType = getEquipmentType(this.$nzI18n, item.equipmentType);
        });
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.equipmentTable.isLoading = false;
    });
  }
}
