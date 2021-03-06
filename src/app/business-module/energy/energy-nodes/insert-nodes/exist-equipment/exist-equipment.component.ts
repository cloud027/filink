import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { NzI18nService, NzModalService, UploadFile } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { EquipmentApiService } from '../../../../facility/share/service/equipment/equipment-api.service';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import { TableComponent } from '../../../../../shared-module/component/table/table.component';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import { PageModel } from '../../../../../shared-module/model/page.model';
import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { FormItem } from '../../../../../shared-module/component/form/form-config';
import { FormOperate } from '../../../../../shared-module/component/form/form-operate.service';
import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';
import { FacilityLanguageInterface } from '../../../../../../assets/i18n/facility/facility.language.interface';
import { EquipmentListModel } from '../../../../../core-module/model/equipment/equipment-list.model';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { EquipmentStatisticsModel } from '../../../../../core-module/model/equipment/equipment-statistics.model';
import { OperatorEnum } from '../../../../../shared-module/enum/operator.enum';
import {
  EquipmentStatusEnum,
  EquipmentTypeEnum,
  CommunicationEquipmentStatusEnum
} from '../../../../../core-module/enum/equipment/equipment.enum';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { IrregularData } from '../../../../../core-module/const/common.const';
import { BusinessStatusEnum } from '../../../../../core-module/enum/equipment/equipment.enum';
import { SliderConfigModel } from '../../../../../core-module/model/facility/slider-config.model';
import { ConfigDetailRequestModel } from '../../../../../core-module/model/equipment/config-detail-request.model';
import { FacilityForCommonUtil } from '../../../../../core-module/business-util/facility/facility-for-common.util';
import { AssetManagementLanguageInterface } from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import { ImportMissionService } from '../../../../../core-module/mission/import.mission.service';
import { FacilityListModel } from '../../../../../core-module/model/facility/facility-list.model';
import { EnergyOpearEquipmentTXEnum } from '../../../share/enum/energy-config.enum';
import { FacilityForCommonService } from '../../../../../core-module/api-service/facility';

@Component({
  selector: 'app-exist-equipment',
  templateUrl: './exist-equipment.component.html',
  styleUrls: ['./exist-equipment.component.scss'],
})
export class ExistEquipmentComponent implements OnInit, OnDestroy {
  // ????????????
  @ViewChild('tableComponent') private _tableComponent: TableComponent;
  // ????????????????????????key??????
  @Input() public selectEquipments: EquipmentListModel[] = [];

  /** ?????????????????? */
  @Input() public tableTitle: string;
  // ?????? ????????????  ????????????
  @Input() equipmentModalType: EnergyOpearEquipmentTXEnum = EnergyOpearEquipmentTXEnum.equipment;
  @Input() filterConditionsData: FilterCondition[] = [];

  /** ???????????? ????????? ??????????????? */
  filterConditionsYYData: FilterCondition[] = [
    new FilterCondition('equipmentType', OperatorEnum.in, ['E003']),
  ];

  // ??????????????????
  @Input()
  set equipmentVisible(params) {
    this._equipmentVisible = params;
    this.equipmentVisibleChange.emit(this._equipmentVisible);
  }
  // ??????modal???????????????
  get equipmentVisible() {
    return this._equipmentVisible;
  }
  // ??????id
  @Input()
  public selectEquipmentId: string = '';
  // ??????????????????
  @Output() public equipmentVisibleChange = new EventEmitter<any>();
  // ??????????????????
  @Output() public selectDataChange = new EventEmitter<any>();
  // ????????????
  public _selectedData: EquipmentListModel[] = [];
  // ????????????
  public _equipmentVisible = false;
  // ????????????
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  ??????????????????
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('tableComponent') tableRef: TableComponent;
  // ??????????????????
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // ????????????????????????
  @ViewChild('deviceNameTemplate') deviceNameTemplate: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('importEquipmentTemp') importEquipmentTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // ????????????
  public sliderConfig: SliderConfigModel[] = [];
  // ????????????
  public dataSet: EquipmentListModel[] = [];
  // ??????????????????
  public pageBean: PageModel = new PageModel();
  // ???????????????
  public language: FacilityLanguageInterface;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????????????????
  public assetsLanguage: AssetManagementLanguageInterface;
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  public businessStatusEnum = BusinessStatusEnum;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  public communicationEquipmentStatusEnum = CommunicationEquipmentStatusEnum;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ????????????
  public filterValue: FilterCondition;
  // ??????????????????
  public formColumn: FormItem[] = [];
  // ????????????
  public formStatus: FormOperate;
  // ??????????????????????????????
  public equipmentDeployShow: boolean = false;
  // ?????????????????????
  public facilityVisible: boolean = false;
  // ???????????????????????????
  public deviceInfo: FacilityListModel[] = [];
  // ????????????????????????
  public filterDeviceName: string = '';
  //  ??????????????????
  public equipmentModel: string;
  // ??????????????????
  public equipmentConfigType: EquipmentTypeEnum;
  // ????????????id
  public equipmentConfigId: string;
  // ?????????????????????
  public selectFacility: FacilityListModel[] = [];
  // ?????????????????? ?????????any??????????????????????????????????????????
  public equipmentConfigContent: any;
  // ????????????????????????????????????
  public configOkDisabled: boolean = true;
  // ????????????????????????
  public configValueParam: ConfigDetailRequestModel = new ConfigDetailRequestModel();
  // ????????????id
  public configEquipmentId: string;
  // ????????????
  public fileList: UploadFile[] = [];
  // ????????????
  public fileArray: UploadFile[] = [];
  // ????????????
  public fileType: string;
  // ??????????????????????????????
  public isVisible: boolean = false;
  display = {
    objTable: false,
  };

  /**
   * ?????????
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    public $nzModalService: NzModalService,
    private $equipmentAipService: EquipmentApiService,
    private $refresh: ImportMissionService,
    private $facilityCommonService: FacilityForCommonService,
  ) {}

  /**
   * ???????????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this._selectedData = this.selectEquipments || [];
    // ?????????????????????
    this.initTableConfig();
    // ????????????????????????
    this.queryEquipmentCount();
    // ??????????????????
    this.refreshData();
  }

  /**
   * ??????????????????????????????
   */
  public ngOnDestroy(): void {
    this.equipmentTypeTemp = null;
    this.deviceNameTemplate = null;
    this.equipmentStatusFilterTemp = null;
    this.tableRef = null;
    this.deviceFilterTemplate = null;
  }

  /**
   * ???????????????????????????
   * ???????????????any????????????????????????????????????
   */
  public getPramsConfig(equipmentModel: { equipmentModel: string }): void {
    this.$equipmentAipService
      .getEquipmentConfigByModel(equipmentModel)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.equipmentConfigContent = result.data || [];
          // ???????????????????????? ????????????????????????
          if (!_.isEmpty(this.equipmentConfigContent)) {
            this.configOkDisabled = true;
            // ????????????????????????
            this.equipmentDeployShow = true;
            this.configEquipmentId = this.equipmentConfigId;
            this.configValueParam.equipmentId = this.equipmentConfigId;
            this.configValueParam.equipmentType = this.equipmentConfigType;
          } else {
            this.$message.info(this.assetsLanguage.noEquipmentConfigTip);
          }
        } else {
          // ????????????????????????
          this.equipmentDeployShow = false;
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ?????????????????????????????????
   */
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    this.facilityVisible = true;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
  }

  /**
   * ??????????????????
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

  /**
   * ??????????????????????????????
   */
  private queryEquipmentCount(): void {
    // ??????????????????
    this.$facilityCommonService
      .equipmentCount()
      .subscribe((result: ResultModel<EquipmentStatisticsModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const roleEquip = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
          const equipCods = roleEquip.map((v) => v.code);
          // ???????????????????????????
          const equipmentTypeList: SliderConfigModel[] = [];
          const equipmentTypeData: EquipmentStatisticsModel[] = result.data || [];
          equipCods.forEach((row) => {
            const temp = equipmentTypeData.find((item) => item.equipmentType === row);
            equipmentTypeList.push({
              code: row as string,
              label: CommonUtil.codeTranslate(
                EquipmentTypeEnum,
                this.$nzI18n,
                row as string,
                LanguageEnum.facility,
              ) as string,
              sum: temp ? temp.equipmentNum : 0,
              textClass: CommonUtil.getEquipmentTextColor(row as string),
              iconClass:
                row === EquipmentTypeEnum.camera
                  ? 'fiLink-camera-statistics camera-color'
                  : CommonUtil.getEquipmentIconClassName(row as string),
            });
          });
          // ?????????????????????
          const sum = _.sumBy(equipmentTypeData, 'equipmentNum') || 0;
          equipmentTypeList.unshift({
            // ????????????
            label: this.language.equipmentTotal,
            iconClass: CommonUtil.getEquipmentIconClassName(null),
            textClass: CommonUtil.getEquipmentTextColor(null),
            code: null,
            sum: sum,
          });
          this.sliderConfig = equipmentTypeList;
        } else {
          this.$message.error(result.msg);
        }
      });
  }
  /**
   * ????????????
   */
  public onEquipmentChange(event: string, data: EquipmentListModel): void {
    this.selectEquipmentId = event;
    this._selectedData = [data];
  }
  Confirm() {
    const data = this._selectedData;
    this.selectDataChange.emit({ data, type: this.equipmentModalType });
    this.equipmentVisible = false;
  }
  close() {}
  clearSelectData() {
    this._tableComponent.keepSelectedData.clear();
    this._tableComponent.checkStatus();
    this._selectedData = [];
    this.selectEquipments = [];
    this.selectEquipmentId = null;
    this.refreshData();
  }

  /**
   * ???????????? ??????????????????
   */
  private handelFilterCondition(): void {
    if (!_.isEmpty(this.filterConditionsData)) {
      this.filterConditionsData.forEach((item) => {
        const index = this.queryCondition.filterConditions.findIndex(
          (v) => v.filterField === item.filterField,
        );
        if (index < 0) {
          this.queryCondition.filterConditions.push(item);
        } else {
          this.queryCondition.filterConditions[index].filterValue = _.intersection(
            this.queryCondition.filterConditions[index].filterValue,
            item.filterValue,
          );
        }
      });
    }
  }

  /**
   * ???????????? ??????????????????
   */
  handelFilterConditionYY() {
    if (!_.isEmpty(this.filterConditionsYYData)) {
      this.filterConditionsYYData.forEach((item) => {
        const index = this.queryCondition.filterConditions.findIndex(
          (v) => v.filterField === item.filterField,
        );
        if (index < 0) {
          this.queryCondition.filterConditions.push(item);
        } else {
          this.queryCondition.filterConditions[index].filterValue = _.intersection(
            this.queryCondition.filterConditions[index].filterValue,
            item.filterValue,
          );
        }
      });
    }
  }
  /**
   *  ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    if (this.equipmentModalType === EnergyOpearEquipmentTXEnum.communication) {
      this.handelFilterCondition();
    } else if (this.equipmentModalType === EnergyOpearEquipmentTXEnum.equipment) {
      this.handelFilterConditionYY();
         }

    this.$facilityCommonService.equipmentListByPage(this.queryCondition).subscribe(
      (result: ResultModel<EquipmentListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet = result.data || [];
          // ?????????????????????????????????co
          this.dataSet.forEach((item) => {
            const statusArr: string[] = [EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled];
            item.deleteButtonShow = statusArr.includes(item.equipmentStatus);
            // ??????????????????
            const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
            item.statusIconClass = iconStyle.iconClass;
            item.statusColorClass = iconStyle.colorClass;
            // ???????????????????????????
            item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
            item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
            item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
            // ?????????????????????????????????????????????????????????
            if (item.installationDate && item.scrapTime) {
              const now = new Date().getTime();
              const tempDate = new Date(Number(item.installationDate));
              tempDate.setFullYear(tempDate.getFullYear() + Number(item.scrapTime));
              item.rowStyle = now > tempDate.getTime() ? IrregularData : {};
            }
          });
        } else {
          this.$message.error(result.msg);
        }
      },
      () => {
        this.tableConfig.isLoading = false;
      },
    );
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: { x: '1804px', y: '340px' },
      noIndex: true,
      showSearchExport: false,
      showImport: false,
      columnConfig: [
        {
          // ??????
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
          width: 62,
        },
        {
          // ??????
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        {
          // ??????
          title: this.language.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '124px' } },
        },
        {
          // ????????????
          title: this.language.deviceCode,
          key: 'equipmentCode',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????id
          title: this.language.sequenceId,
          key: 'sequenceId',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.language.type,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          width: 160,
          searchable: false,
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
          // ??????
          title: this.language.status,
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
          //  ??????
          title: this.language.model,
          key: 'equipmentModel',
          width: 124,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ?????????
          title: this.language.supplierName,
          key: 'supplier',
          width: 125,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.scrapTime,
          key: 'scrapTime',
          width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.affiliatedDevice,
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
          // ????????????
          title: this.language.mountPosition,
          key: 'mountPosition',
          width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????????????????
          title: this.language.installationDate,
          width: 200,
          isShowSort: true,
          searchable: true,
          hidden: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          searchConfig: { type: 'dateRang' },
          key: 'installationDate',
        },
        {
          // ????????????
          title: this.language.company,
          key: 'company',
          searchable: true,
          width: 150,
          isShowSort: true,
          hidden: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.businessStatus,
          key: 'businessStatus',
          type: 'render',
          renderTemplate: this.equipmentBusinessTemp,
          width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(
              BusinessStatusEnum,
              this.$nzI18n,
              null,
              LanguageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // ????????????
          title: this.language.affiliatedArea,
          key: 'areaName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.address,
          key: 'address',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.gatewayName,
          key: 'gatewayName',
          hidden: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.language.remarks,
          key: 'remarks',
          hidden: true,
          width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 160,
          fixedStyle: { fixedRight: false, style: { right: '0px' } },
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      notShowPrint: true,
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      rightTopButtons: [],
      // ????????????
      handleSelect: (event: EquipmentListModel[]) => {
        this._selectedData = event;
        this.selectEquipments = event;
      },
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // ??????????????????
      handleSearch: (event: FilterCondition[]) => {
        console.log(event, 'event');
        const deviceIndex = event.findIndex((row) => row.filterField === 'deviceId');
        // ?????????????????????????????????????????????ID??????????????????
        if (deviceIndex >= 0 && !_.isEmpty(event[deviceIndex].filterValue)) {
          event[deviceIndex].operator = OperatorEnum.in;
        } else {
          this.filterDeviceName = '';
          this.filterValue = null;
          event = event.filter((item) => item.filterField !== 'deviceId');
          this.selectFacility = [];
        }
        this.queryCondition.filterConditions = event;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      },
    };
  }
}
