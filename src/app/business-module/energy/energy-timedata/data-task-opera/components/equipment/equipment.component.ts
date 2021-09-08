import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {NzI18nService, NzMessageService} from 'ng-zorro-antd';
import _ from 'lodash';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../../shared-module/model/query-condition.model';
import {EnergyLanguageInterface} from '../../../../../../../assets/i18n/energy/energy.language.interface';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {ApplicationInterface} from '../../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../../../shared-module/enum/operator.enum';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {EnergyApiService} from '../../../../share/service/energy/energy-api.service';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {EquipmentListModel} from '../../../../../../core-module/model/equipment/equipment-list.model';
import {FacilityForCommonUtil} from '../../../../../../core-module/business-util/facility/facility-for-common.util';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {
  EquipmentStatusEnum,
  EquipmentTypeEnum,
  CameraTypeEnum,
  CommunicationEquipmentStatusEnum
} from '../../../../../../core-module/enum/equipment/equipment.enum';
import {
  SwitchPageToTableEnum,
  ApplicationScopeTableEnum,
} from '../../../../share/enum/energy-config.enum';
import {FacilityListModel} from '../../../../../../core-module/model/facility/facility-list.model';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent implements OnInit, OnDestroy {
  // 设备类型
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  @ViewChild('tableTemp') tableTemp;
  // 判断是否是从 哪个页面进入 组件
  @Input() switchPageToTable: SwitchPageToTableEnum = SwitchPageToTableEnum.insert;
  // 编辑 详情页面需要传递的 过滤ids字段
  @Input() filterIds: Array<string> = [];
  @Input() isVisible: boolean = false;
  @Input() selectedData: any = [];
  @Output() tableDeleteItem = new EventEmitter<any>();
  @Output() editPageChangeData = new EventEmitter<any>();
  // 设备列表数据
  public dataSet: EquipmentListModel[] = [];
  // 分页实体
  public pageBean: PageModel = new PageModel();
  // 底部表格 前端分页
  bottomTablePage = {
    pageIndex: 1,
    pageSize: 10,
  };
  // 表格配置
  public tableConfig: TableConfigModel;
  // 设备列表分页条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  public equipmentTypeEnum = EquipmentTypeEnum;
  public communicationEquipmentStatusEnum = CommunicationEquipmentStatusEnum;
  // 设施过滤选择器
  public facilityVisible: boolean = false;
  // 过滤框显示设施名
  public filterDeviceName: string = '';
  // 设施过滤
  public filterValue: FilterCondition;
  // 已选择设施数据
  public selectFacility: FacilityListModel[] = [];

  public language: EnergyLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  public equipmentLanguage: FacilityLanguageInterface;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;

  constructor(
    private $nzI18n: NzI18nService,
    private $message: NzMessageService,
    private $energyApiService: EnergyApiService,
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    if (this.isVisible) {
      this.initTableConfig();
      this.refreshData();
      // 过滤重置
      this.tableTemp.handleRest();
    } else {
      //  编辑页面
      if (this.switchPageToTable === SwitchPageToTableEnum.edit) {
        const filterData = new FilterCondition('equipmentId', OperatorEnum.in, this.filterIds);
        this.queryCondition.filterConditions.push(filterData);
        /** 如果新增的时候没有选择数据，当编辑的时候，弹出框中选中了 区域之后，页面底部的区域列表就会刷新出现，会重新调用该组件，触发事件，防止事件触发的时候再次调用请求 */
        if (this.selectedData.length > 0) {
          return this.init_tableList(this.selectedData);
        }
        this.initTableConfig();
        this.refreshData();
      } else if (this.switchPageToTable === SwitchPageToTableEnum.details) {
        const filterData = new FilterCondition('equipmentId', OperatorEnum.in, this.filterIds);
        this.queryCondition.filterConditions.push(filterData);
        this.initTableConfig();
        this.refreshData();
        this.tableTemp.handleRest();
      } else {
        this.init_tableList(this.selectedData);
      }
    }
  }

  ngOnDestroy() {
    this.equipmentTypeTemp = null;
    this.equipmentStatusFilterTemp = null;
    this.deviceFilterTemplate = null;
  }

  // 表格的选择框 配置
  columnConfigSelect() {
    let columnConfigSelect = {};
    // 说明是详情页面
    if (this.switchPageToTable === SwitchPageToTableEnum.details) {
      columnConfigSelect = {
        type: '',
        width: 0,
        hidden: true,
      };
    }
    // 说明是 弹框中的数据展示
    if (this.isVisible) {
      columnConfigSelect = {
        type: 'select',
        width: 60,
      };
    }
    return columnConfigSelect;
  }

  // 弹出框的table
  initTableConfig() {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      showSizeChanger: this.isVisible || this.switchPageToTable === SwitchPageToTableEnum.details,
      notShowPrint: true,
      showSearchSwitch: true,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      primaryKey: '03-1',
      noIndex: true,
      columnConfig: [
        this.columnConfigSelect(),
        {
          // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
        },
        {
          // 名称
          title: this.language.nodesDetails.equipmentName,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          // 类型
          title: this.language.nodesDetails.equipmentType,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          width: 160,
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
        },
        {
          // 状态
          title: this.language.nodesDetails.equipmentStatus,
          key: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(
              CommunicationEquipmentStatusEnum,
              this.$nzI18n,
              null,
              this.languageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // 所属设施
          title: this.language.nodesDetails.facilities,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceFilterTemplate,
          },
        },
        {
          // 详细地址
          title: this.language.nodesDetails.detailedAddress,
          key: 'address',
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
          width: 160,
          fixedStyle: {fixedRight: false, style: {right: '0px'}},
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        // const deviceIndex = event.findIndex((row) => row.filterField === 'deviceId');
        // // 使用设施选择器的设施之后对设施ID过滤进行处理
        // if (deviceIndex >= 0 && !_.isEmpty(event[deviceIndex].filterValue)) {
        //   event[deviceIndex].operator = OperatorEnum.in;
        // } else {
        //   this.filterDeviceName = '';
        //   this.filterValue = null;
        //   event = event.filter((item) => item.filterField !== 'deviceId');
        //   this.selectFacility = [];
        // }
        //   this.queryCondition.pageCondition.pageNum = 1;
        // // this.queryCondition.filterConditions = event;
        //   const filterData = new FilterCondition('equipmentId', OperatorEnum.in, this.filterIds);
        //   this.queryCondition.filterConditions=[filterData, ...event]
        //   this.refreshData();

        const deviceIndex = event.findIndex((row) => row.filterField === 'deviceId');
        // 使用设施选择器的设施之后对设施ID过滤进行处理
        if (deviceIndex >= 0 && !_.isEmpty(event[deviceIndex].filterValue)) {
          event[deviceIndex].operator = OperatorEnum.in;
        } else {
          this.filterDeviceName = '';
          this.filterValue = null;
          event = event.filter((item) => item.filterField !== 'deviceId');
          this.selectFacility = [];
          this.queryCondition.pageCondition.pageNum = 1;
        }
        //  //  编辑页面
        if (this.isVisible) {
          this.queryCondition.filterConditions = event;
        } else if (this.switchPageToTable === SwitchPageToTableEnum.details) {
          const filterData = new FilterCondition('equipmentId', OperatorEnum.in, this.filterIds);
          this.queryCondition.filterConditions = [filterData, ...event]
        }
        this.refreshData();
      },
    };
  }

  /**
   * 设备分页
   * @ param event
   */
  pageChange(event: PageModel): void {
    // if (this.isVisible) {
    //     this.queryCondition.pageCondition.pageNum = event.pageIndex;
    //     this.queryCondition.pageCondition.pageSize = event.pageSize;
    //     this.refreshData();
    // } else {
    //     this.bottomTablePage.pageIndex = event.pageIndex;
    //     this.bottomTablePage.pageSize = event.pageSize;
    //     this.bottomTableRefresh();
    // }
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
    if (!this.isVisible) {
      this.bottomTablePage.pageIndex = event.pageIndex;
      this.bottomTablePage.pageSize = event.pageSize;
      this.bottomTableRefresh();
    }
  }

  refreshData() {
    this.tableConfig.isLoading = true;
    this.queryCondition.bizCondition['isApplicationEnergyConsumptionNode'] = '1';
    this.$energyApiService.equipmentListByPage_API(this.queryCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          const {data, totalCount, pageNum, size} = result;
          this.dataSet = data || [];
          this.pageBean.Total = totalCount;
          this.pageBean.pageIndex = pageNum;
          this.pageBean.pageSize = size;
          this.dataSet.forEach((item) => {
            // 设置状态样式
            const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
            item.statusIconClass = iconStyle.iconClass;
            item.statusColorClass = iconStyle.colorClass;
            // 获取设备类型的图标
            let iconClass;
            if (
              item.equipmentType === EquipmentTypeEnum.camera &&
              item.equipmentModelType === CameraTypeEnum.bCamera
            ) {
              // 摄像头球型
              iconClass = `iconfont facility-icon fiLink-shexiangtou-qiuji camera-color`;
            } else {
              iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
            }
            item.iconClass = iconClass;
            item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
          });
          // 编辑页面
          if (this.switchPageToTable === SwitchPageToTableEnum.edit) {
            this.editPageChangeData.emit({
              data: result.data,
              type: ApplicationScopeTableEnum.equipment,
            });
          }
        } else {
          this.$message.error(result.msg);
        }
      },
      () => {
        this.tableConfig.isLoading = false;
      },
    );
  }

  // 清空数据
  tableClearSelected() {
    this.tableTemp.keepSelectedData.clear();
    this.tableTemp.updateSelectedData();
    this.tableTemp.checkStatus();
  }

  // 底部的存在删除的 tableTemp
  init_tableList(params: any[]) {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      notShowPrint: true,
      primaryKey: '03-1',
      columnConfig: [
        {
          // 序号
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
        },
        {
          // 名称
          title: this.language.nodesDetails.equipmentName,
          key: 'equipmentName',
          width: 150,
          searchConfig: {type: 'input'},
        },
        {
          // 类型
          title: this.language.nodesDetails.equipmentType,
          key: 'equipmentType',
          type: 'render',
          width: 160,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
        },
        {
          // 状态
          title: this.language.nodesDetails.equipmentStatus,
          key: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(
              CommunicationEquipmentStatusEnum,
              this.$nzI18n,
              null,
              this.languageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // 所属设施
          title: this.language.nodesDetails.facilities,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          searchConfig: {
            type: 'input',
          },
        },
        {
          // 详细地址
          title: this.language.nodesDetails.detailedAddress,
          key: 'address',
          width: 150,
          searchConfig: {type: 'input'},
        },
        {
          title: this.commonLanguage.operate,
          searchConfig: {type: 'operate'},
          key: '',
          width: 80,
          fixedStyle: {fixedRight: false, style: {right: '0px'}},
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      pageSizeOptions: [5, 10, 20],
      operation: [
        {
          // 删除
          text: this.language.deleteHandle,
          className: 'fiLink-delete red-icon',
          permissionCode: '03-1-4',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: false,
          confirmContent: this.language.config.deleteConfim,
          handle: (data) => {
            const deepData = _.cloneDeep(this.selectedData);
            const getIndex = deepData.findIndex((item) => item.equipmentId === data.equipmentId);
            deepData.splice(getIndex, 1);
            this.pageBean.Total--;
            this.selectedData = deepData;
            this.tableDeleteItem.emit({data: deepData, type: 'equipment'});
            this.bottomTableRefresh();
          },
        },
      ],
    };
    // this.pageBean.pageSize = 5;
    // this.pageBean.pageIndex = 1;
    this.pageBean.Total = params.length;
    this.dataSet = params.slice(0, 10);
    setTimeout(() => {
      this.tableConfig.isLoading = false
      this.tableConfig.showSearch = false
    });
  }

  bottomTableRefresh() {
    const pageIndex = this.bottomTablePage.pageIndex;
    const pageSize = this.bottomTablePage.pageSize;
    const pageStart = (pageIndex - 1) * pageSize;
    const pageEnd = pageIndex * pageSize;
    this.dataSet = this.selectedData.slice(pageStart, pageEnd);
  }

  getDataChecked() {
    return (this.tableTemp && this.tableTemp.getDataChecked()) || [];
  }

  /**
   * 点击输入框弹出设施选择
   */
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    this.facilityVisible = true;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
  }

  /**
   * 选择设施数据
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    this.filterValue.filterValue =
      event.map((item) => {
        return item.deviceId;
      }) || [];
    this.selectFacility = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event
        .map((item) => {
          return item.deviceName;
        })
        .join(',');
    } else {
      this.filterDeviceName = '';
    }
  }
}
