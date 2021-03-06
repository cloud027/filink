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
 * ??????????????????
 */
@Component({
  selector: 'app-facility-particulars-card',
  templateUrl: './facility-particulars-card.component.html',
  styleUrls: ['./facility-particulars-card.component.scss']
})
export class FacilityParticularsCardComponent implements OnInit {
  // ????????????
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // ??????????????????
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  ??????????????????
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // ??????id
  @Input() facilityId: string;
  // ??????Name
  @Input() facilityName: string;
  // ????????????
  @Input() facilityCode: string;
  // ????????????id????????????
  @Input() idData;
  // ??????code
  @Input() facilityPowerCode = [];
  // ???????????????????????????
  @Input() isShowBusinessPicture: boolean;
  // ?????????
  public indexLanguage: IndexLanguageInterface;
  // ???????????????
  public language: FacilityLanguageInterface;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ????????????tab????????????index
  public selectedIndex = indexFacilityPanel.facilityDetail;
  // ????????????????????????tab
  public isShowFacilityDetailTab = true;
  // ??????????????????tab
  public isShowFacilityAlarmTab = false;
  // ????????????????????????tab
  public isShowFacilityLogAndOrderTab = false;
  // ?????????????????????tab
  public isShowFacilityRealSceneTab = false;
  // ????????????
  public indexType = this.$mapCoverageService.showCoverage;
  // ?????????
  public powerCode = DetailCode;
  // ??????????????????
  public roleDeviceOperating: boolean = false;
  // ?????????title
  public particularsName: string;
  // ??????title
  public alarmName: string;
  // ??????????????????
  public indexLayeredTypeEnum;
  // ??????????????????
  public currentAlarmRole: boolean = false;
  // ??????????????????
  public hisAlarmRole: boolean = false;
  // ????????????
  public workOrderRole: boolean = false;
  // ??????????????????
  public deviceLogRole: boolean = false;
  // ??????????????????
  public operationLogRole: boolean = false;
  // ??????????????????
  public operation: boolean = false;
  // ?????????????????????????????????
  public pictureClickShowOperating: boolean = false;
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;


  // ??????????????????
  public operationVisible: boolean = false;
  // ????????????
  public dataSet = [];
  // ????????????
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public tableConfig: TableConfigModel = new TableConfigModel();
  // ????????????????????????
  public filterDeviceName: string = '';
  // ????????????
  public filterValue: FilterCondition;
  // ?????????????????????
  public facilityVisible: boolean = false;
  // ?????????????????????
  public selectFacility: FacilityListModel[] = [];
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  // ????????????
  public equipmentStatus;
  // ????????????
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
    // ??????????????????
    this.roleDeviceOperating = SessionUtil.checkHasRole('05-2');
    // ????????????????????????
    this.currentAlarmRole = SessionUtil.checkHasRole('02-1');
    // ????????????????????????
    this.hisAlarmRole = SessionUtil.checkHasRole('02-2');
    // ??????????????????
    this.workOrderRole = SessionUtil.checkHasRole('06');
    // ????????????????????????
    this.deviceLogRole = SessionUtil.checkHasRole('03-5');
    // ????????????????????????
    this.operationLogRole = SessionUtil.checkHasRole('04-2-1');
    // ????????????????????????
    this.parseProtocol(this.idData.equipmentId, this.idData.equipmentType);
    // ???????????????????????????????????????title
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
    // ???????????????
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
   * ???????????????????????????
   */
  public checkHasTenantRole(code: string): boolean {
    return SessionUtil.checkHasTenantRole(code);
  }

  /**
   * tabs??????????????????
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
   * ????????????????????????
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
   * ????????????
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
   * ????????????
   * param evt
   */
  public mousemoveChange(evt): void {
  }

  /**
   * ??????
   */
  public goBack(): void {
    this.pictureClickShowOperating = false;
  }

  /**
   * ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    // ????????????
    this.refreshData();
  }

  /**
   * ??????????????????
   */
  public closeModal() {
    this.operationVisible = false;
    // ????????????
    this.dataSet = [];
    // ?????????????????????
    this.facilityVisible = false;
    // ?????????????????????
    this.selectFacility = [];
    this.tableComponent = null;
  }

  public showModal() {
    this.operationVisible = true;
    // ?????????????????????
    this.initTableConfig();
    this.queryCondition = new QueryConditionModel();
    // ????????????
    this.refreshData();
  }

  /**
   * ??????????????????
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
   * ?????????????????????????????????
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
   * ?????????????????????
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
        { // ??????
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}
        },
        { // ??????
          title: this.language.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ??????
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
        { // ??????
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
        { // ????????????
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
        { // ????????????
          permissionCode: '03-8-2',
          text: this.commonLanguage.control, className: 'fiLink-control',
          handle: (data: EquipmentListModel) => {
            this.selectEquipment(data);
          },
        },
      ],
      leftBottomButtons: [],
      rightTopButtons: [],
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // ??????????????????
      handleSearch: (event: FilterCondition[]) => {
        const deviceIndex = event.findIndex(row => row.filterField === 'deviceId');
        // ?????????????????????????????????????????????ID??????????????????
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

