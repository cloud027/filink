import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { NzI18nService, NzModalService } from 'ng-zorro-antd';
import { addYears } from 'date-fns';
import * as _ from 'lodash';
import { FacilityListComponent } from '../../../../facility/facility-manage/facility-list/facility-list.component';
import { TableComponent } from '../../../../../shared-module/component/table/table.component';
import { ImportMissionService } from '../../../../../core-module/mission/import.mission.service';
import { LockService } from '../../../../../core-module/api-service/lock';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { FacilityService } from '../../../../../core-module/api-service/facility/facility-manage';
import { Download } from '../../../../../shared-module/util/download';
import { FacilityApiService } from '../../../../facility/share/service/facility/facility-api.service';
import {
  FilterCondition,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { FacilityForCommonUtil } from '../../../../../core-module/business-util/facility/facility-for-common.util';
import { OperatorEnum } from '../../../../../shared-module/enum/operator.enum';
import { SelectModel } from '../../../../../shared-module/model/select.model';
import { BusinessStatusEnum } from '../../../../../core-module/enum/equipment/equipment.enum';
import {
  DeviceStatusEnum,
  DeviceTypeEnum,
} from '../../../../../core-module/enum/facility/facility.enum';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { FacilityListModel } from '../../../../../core-module/model/facility/facility-list.model';
import { IrregularData } from '../../../../../core-module/const/common.const';
import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';
import { FacilityForCommonService } from '../../../../../core-module/api-service/facility';

@Component({
  selector: 'app-dismantle-device-name',
  templateUrl: './dismantle-device-name.component.html',
  styleUrls: ['./dismantle-device-name.component.scss'],
})
export class DismantleDeviceNameComponent extends FacilityListComponent implements OnInit {
  // ????????????
  @ViewChild('tableComponent') private _tableComponent: TableComponent;
  // ????????????
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // ????????????????????????key??????
  @Input() public selectDevices: any = [];
  /** title */
  @Input() title;
  /** ???????????? ?????? id ?????? */
  @Input() filterAreaId: string;

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
  /** ??????ID */
  @Input() public selectDeviceId: string = '';
  // ??????????????????
  @Output() public equipmentVisibleChange = new EventEmitter<any>();
  // ??????????????????
  @Output() public selectDataChange = new EventEmitter<any>();
  // ????????????
  public _equipmentVisible = false;
  // ????????????
  public resultDeviceStatus: SelectModel[];
  // ????????????????????????
  deviceFilterCondition: FilterCondition;
  // ???????????????????????????
  private deviceRoleTypeList: SelectModel[];
  /** ???????????? */
  public _selectedData: FacilityListModel[] = [];
  // ????????????
  public deviceTypeCode = DeviceTypeEnum;

  // ???????????????
  public commonLanguage: CommonLanguageInterface;

  /**
   * ?????????
   */
  constructor(
    public $nzModalService: NzModalService,
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $modal: NzModalService,
    public $lockService: LockService,
    public $facilityService: FacilityService,
    public $facilityApiService: FacilityApiService,
    public $refresh: ImportMissionService,
    public $download: Download,
    public $facilityCommonService: FacilityForCommonService,
    public $router: Router,
  ) {
    super(
      $nzModalService,
      $nzI18n,
      $message,
      $modal,
      $lockService,
      $facilityService,
      $facilityApiService,
      $refresh,
      $download,
      $facilityCommonService,
      $router,
    );
  }

  /**
   * ???????????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.deviceRoleTypeList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // ?????????????????????
    this.resultDeviceStatus = CommonUtil.codeTranslate(
      DeviceStatusEnum,
      this.$nzI18n,
      null,
    ) as SelectModel[];
    // this.resultDeviceStatus = this.resultDeviceStatus.filter(
    //   (item) => item.code !== this.deviceStatusEnum.dismantled,
    // );
    this.gainInitTableConfig();
    // ????????????????????????
    this.gainDefaultFilterCondition();
    // ??????????????????
    this.getRefreshData();
  }

  /**
   * ?????????????????????
   */
  gainInitTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      showSizeChanger: true,
      showSearchSwitch: true,
      scroll: { x: '1804px', y: '340px' },
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      columnConfig: [
        {
          // ??????
          type: 'render',
          title: '',
          renderTemplate: this.radioTemp,
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
          width: 62,
        },
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        {
          // ??????
          title: this.language.deviceName,
          key: 'deviceName',
          width: 150,
          fixedStyle: { fixedLeft: true, style: { left: '124px' } },
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.deviceCode,
          key: 'deviceCode',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.language.deviceType,
          key: 'deviceType',
          width: 150,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          minWidth: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceRoleTypeList,
            label: 'label',
            value: 'code',
          },
        },
        {
          // ??????
          title: this.language.deviceStatus,
          key: 'deviceStatus',
          width: 120,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          isShowSort: true,
          searchable: true,
          minWidth: 90,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.resultDeviceStatus,
            label: 'label',
            value: 'code',
          },
        },
        {
          // ??????
          title: this.language.deviceModel,
          key: 'deviceModel',
          width: 120,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ?????????
          title: this.language.supplierName,
          key: 'supplier',
          width: 120,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.scrapTime,
          key: 'scrapTime',
          width: 170,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.equipmentQuantity,
          key: 'equipmentQuantity',
          width: 170,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.businessStatus,
          key: 'businessStatus',
          width: 120,
          type: 'render',
          renderTemplate: this.businessStatusTemplate,
          hidden: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            notAllowClear: false,
            selectInfo: CommonUtil.codeTranslate(
              BusinessStatusEnum,
              this.$nzI18n,
              null,
              this.languageEnum.facility,
            ),
            label: 'label',
            value: 'code',
          },
        },
        {
          // ????????????
          title: this.language.installationDate,
          key: 'installationDate',
          width: 230,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          hidden: true,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'dateRang' },
        },
        {
          // ????????????
          title: this.language.parentId,
          key: 'areaName',
          width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.address,
          key: 'address',
          width: 150,
          isShowSort: true,
          searchable: true,
          hidden: false,
          searchConfig: { type: 'input' },
        },
        {
          // ??????
          title: this.language.remarks,
          key: 'remarks',
          isShowSort: true,
          searchable: true,
          hidden: true,
          width: 150,
          searchConfig: { type: 'input' },
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 100,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      rightTopButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.getRefreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.getRefreshData();
      },
    };
    this.lockInfoConfig = {
      noIndex: true,
      columnConfig: [
        { type: 'select', width: 62 },
        { type: 'serial-number', width: 62, title: this.language.serialNumber },
        { title: this.language.doorNum, key: 'doorNum', width: 100 },
        { title: this.language.doorName, key: 'doorName', width: 100 },
      ],
    };
  }

  /**
   * ??????????????????
   */
  getRefreshData(): void {
    this.tableConfig.isLoading = true;
    if (!this.queryCondition.filterConditions.some((item) => item.filterField === 'deviceType')) {
      this.queryCondition.filterConditions.push(this.deviceFilterCondition);
    }
    if (!this.queryCondition.filterConditions.some((item) => item.filterField === 'areaId')) {
      const areaFilter: FilterCondition = new FilterCondition('areaId', OperatorEnum.in, [
        this.filterAreaId,
      ]);
      this.queryCondition.filterConditions.push(areaFilter);
    }
    this.$facilityApiService.deviceListByPage(this.queryCondition).subscribe(
      (result: ResultModel<FacilityListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet = result.data || [];
          this.dataSet.forEach((item) => {
            item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
            item._deviceType = item.deviceType;
            item.iconClass = CommonUtil.getFacilityIconClassName(item._deviceType);
            // ??????????????????icon??????
            const statusStyle = CommonUtil.getDeviceStatusIconClass(item.deviceStatus);
            item.deviceStatusIconClass = statusStyle.iconClass;
            item.deviceStatusColorClass = statusStyle.colorClass;
            if (item.deviceId === this.selectDeviceId) {
              this._selectedData.push(item);
            }
            // ????????? ????????? ???????????????????????????????????????
            if (
              [
                DeviceTypeEnum.opticalBox,
                DeviceTypeEnum.distributionFrame,
                DeviceTypeEnum.junctionBox,
              ].includes(item._deviceType)
            ) {
              item.infoButtonShow = true;
            }
            // ????????? ?????? ???????????????????????????
            if (
              [
                DeviceTypeEnum.well,
                DeviceTypeEnum.opticalBox,
                DeviceTypeEnum.outdoorCabinet,
              ].includes(item._deviceType)
            ) {
              item.controlButtonShow = true;
            }
            // ?????????????????????????????????????????????????????????
            if (item.installationDate && item.scrapTime) {
              // ???????????????????????????????????????????????????
              const scrapped =
                Date.now() >
                addYears(new Date(item.installationDate), Number(item.scrapTime)).getTime();
              item.rowStyle = scrapped ? IrregularData : {};
            }
          });
          console.log(this.dataSet, 'this.dataSet');
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
   * ????????????????????????
   */
  gainDefaultFilterCondition(): void {
    if (!_.isEmpty(this.deviceRoleTypeList)) {
      const labelValue = [];
      this.deviceRoleTypeList.forEach((item) => {
        labelValue.push(item.code);
      });
      this.deviceFilterCondition = new FilterCondition('deviceType', OperatorEnum.in, labelValue);
    }
  }

  /**
   * ????????????
   */
  public onEquipmentChange(event: string, data): void {
    this.selectDeviceId = event;
    this._selectedData = [data];
  }

  Confirm() {
    const data = this._selectedData;
    this.selectDataChange.emit(data);
    this.equipmentVisible = false;
  }

  clearSelectData() {
    this._tableComponent.keepSelectedData.clear();
    this._tableComponent.checkStatus();
    this._selectedData = [];
    this.selectDevices = [];
    this.selectDeviceId = null;
    this.getRefreshData();
  }
}
