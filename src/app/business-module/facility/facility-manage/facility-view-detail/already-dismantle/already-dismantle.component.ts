import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import {addYears} from 'date-fns';
import * as _ from 'lodash';
import {Operation, TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonService, FacilityService} from '../../../../../core-module/api-service';
import {LockService} from '../../../../../core-module/api-service/lock';
import {FacilityApiService} from '../../../share/service/facility/facility-api.service';
import {ImportMissionService} from '../../../../../core-module/mission/import.mission.service';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition
} from '../../../../../shared-module/model/query-condition.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {LockModel} from '../../../../../core-module/model/facility/lock.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {HIDDEN_SLIDER_HIGH_CONST, SHOW_SLIDER_HIGH_CONST} from '../../../share/const/facility-common.const';
import {Download} from '../../../../../shared-module/util/download';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {IrregularData, IS_TRANSLATION_CONST} from '../../../../../core-module/const/common.const';
import {SliderConfigModel} from '../../../../../core-module/model/facility/slider-config.model';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {
  DeployStatusEnum,
  DeviceStatusEnum,
  DeviceTypeEnum,
  FacilityListTypeEnum,
  WellCoverTypeEnum,
  DismantleDeviceStatusEnum
} from '../../../../../core-module/enum/facility/facility.enum';
import {FacilityListModel} from '../../../../../core-module/model/facility/facility-list.model';
import {BusinessStatusEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityServiceUrlConst} from '../../../share/const/facility-service-url.const';
import {DeviceTypeCountModel} from '../../../../../core-module/model/facility/device-type-count.model';
import {ListExportModel} from '../../../../../core-module/model/list-export.model';
import {FacilityTableColumnEnum} from '../../../share/enum/facility-table-column.enum';
import {TableService} from "../../../../../shared-module/component/table/table.service";


/**
 * ??????????????????
 */
@Component({
  selector: 'app-already-dismantle',
  templateUrl: './already-dismantle.component.html',
  styleUrls: ['./already-dismantle.component.scss'],
  providers: [TableService]
})
export class AlreadyDismantleComponent implements OnInit, AfterViewInit, OnDestroy {
  // ????????????
  @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('openLockTemp') openLockTemp: TemplateRef<{}>;
  // ??????????????????
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('businessStatusTemplate') businessStatusTemplate: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // ??????????????????
  @ViewChild('scrapTimeTemp') scrapTimeTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentQuantityTemp') equipmentQuantityTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('importFacilityTemp') importFacilityTemp: TemplateRef<HTMLDocument>;
  // ????????????
  public dataSet: FacilityListModel[] = [];
  // ??????????????????
  public pageBean: PageModel = new PageModel();
  // ??????????????????????????????
  public lockPageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ????????????????????????
  public lockInfoConfig: TableConfigModel;
  // ????????????????????????
  public lockInfo: LockModel[] = [];
  // ???????????????
  public language: FacilityLanguageInterface;
  // ???????????????
  public indexLanguage: IndexLanguageInterface;
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public sliderConfig: Array<SliderConfigModel> = [];
  // ??????????????????
  public businessStatus = BusinessStatusEnum;
  // ????????????
  public fileList: UploadFile[] = [];
  // ????????????
  public fileArray: UploadFile[] = [];
  // ????????????
  public fileType: string;
  // ????????????
  public languageEnum = LanguageEnum;
  // ??????????????????
  public deviceStatusEnum = DeviceStatusEnum;
  public dismantleDeviceStatusEnum = DismantleDeviceStatusEnum;
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ??????????????????
  public businessStatusEnum = BusinessStatusEnum;
  // ???????????????????????????
  private deviceRoleTypes: SelectModel[];
  // ????????????????????????
  private defaultFilterCondition: FilterCondition;
  // ????????????????????????
  public leftBottomButtonsTemp = [];
  // ??????????????????
  public tableOperation = [];
  // ????????????-??????
  private viewDetail = SessionUtil.checkHasTenantRole('7-1');
  // ????????????-??????
  private deleteOperation = true;
  // ????????????
  public resultDeviceStatus: SelectModel[];

  constructor(
    public  $nzModalService: NzModalService,
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
    public tableService: TableService) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // this.queryCondition.filterConditions = [];
    // ????????????????????????
    this.getTenantRole();
    // ?????????????????????
    this.resultDeviceStatus = CommonUtil.codeTranslate(DismantleDeviceStatusEnum, this.$nzI18n, null) as SelectModel[];
    // ??????????????????
    this.initTableConfig();
    // ???????????????????????????
    this.checkColumn();
    // ????????????????????????
    this.getDefaultFilterCondition();
    // ??????????????????
    this.refreshData();
    // ??????????????????
    this.queryDeviceTypeCount();

    // ????????????????????????
    this.$refresh.refreshChangeHook.subscribe(() => {
      // ????????????????????????
      this.queryDeviceTypeCount();
      // ??????????????????
      this.refreshData();
    });
  }

  public ngAfterViewInit(): void {
    this.tableComponent.handleRest();
  }


  public ngOnDestroy(): void {
    this.deviceStatusTemp = null;
    this.openLockTemp = null;
    this.deviceTypeTemp = null;
    this.tableComponent = null;
  }

  /**
   * ????????????????????????
   */
  public getTenantRole() {
    // ????????????-??????
   /* if (this.viewDetail) {
      this.tableOperation.push(
        {
          text: this.language.viewDetail, className: 'fiLink-view-detail', handle: (currentIndex) => {
            this.navigateToDetail('business/facility/remove-facility-view',
              {
                queryParams: {
                  id: currentIndex.deviceId, deviceType: currentIndex.deviceType,
                  serialNum: currentIndex.serialNum,
                  deviceStatus: currentIndex.deviceStatus,
                }
              });
          },
          permissionCode: '03-1-0-1',
        },
      );
    }*/
    // ????????????-??????
    if (this.deleteOperation) {
      this.tableOperation.push(
        { // ????????????
          text: this.language.deleteHandle,
          className: 'fiLink-delete red-icon',
          permissionCode: '03-1-4',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: false,
          confirmContent: this.language.deleteFacilityMsg,
          handle: (currentIndex: FacilityListModel) => {
            this.deleteDeviceByIds([currentIndex.deviceId]);
          }
        },
      );
    }
  }

  /**
   * ????????????
   * @param event PageModel
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ?????????????????????
   */
  public getLockInfo(deviceId: string, deviceType: string): Promise<LockModel[]> {
    return new Promise((resolve) => {
      this.lockInfoConfig.isLoading = true;
      this.$lockService.getLockInfo(deviceId).subscribe((result: ResultModel<Array<LockModel>>) => {
        this.lockInfoConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.lockInfo = result.data || [];
          // ???????????????????????????
          if (deviceType === DeviceTypeEnum.well) {
            this.lockInfo = this.lockInfo.filter(item => item.doorNum !== WellCoverTypeEnum.outCover);
          }
          resolve();
        }
      });
    });
  }

  /**
   * ??????
   * @param body ({deviceId: string, doorNumList: string})
   */
  public openLock(body: { deviceId: string, doorNumList: string[] }): void {
    this.$lockService.openLock(body).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.commandIssuedSuccessfully);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ?????????????????????????????????
   * param event
   */
  public sliderChange(event: SliderConfigModel): void {
    if (event.code) {
      // ????????????????????????????????????
      this.tableComponent.searchDate = {};
      this.tableComponent.rangDateValue = {};
      this.tableComponent.tableService.resetFilterConditions(this.tableComponent.queryTerm);
      this.tableComponent.handleSetControlData('deviceType', [event.code]);
      this.tableComponent.handleSearch();
    } else {
      this.tableComponent.handleRest();
    }
  }

  /**
   * ????????????
   * param event
   */
  public slideShowChange(event: SliderConfigModel): void {
    if (event) {
      this.tableConfig.outHeight = SHOW_SLIDER_HIGH_CONST;
    } else {
      this.tableConfig.outHeight = HIDDEN_SLIDER_HIGH_CONST;
    }
    this.tableComponent.calcTableHeight();
  }


  /**
   * ?????????????????????????????? ??????????????????????????????????????????
   * param selectData FacilityListModel[]
   * returns {boolean} ??????????????????????????????true
   */
  private checkCanNotChangeStatus(selectData: FacilityListModel[]): boolean {
    let deviceType, isSame = true, allHasControl = true;
    // ????????????????????????????????????
    selectData.forEach(item => {
      if (!deviceType) {
        deviceType = item.deviceType;
      } else {
        if (deviceType !== item.deviceType) {
          isSame = false;
          return;
        }
      }
      // ??????????????????????????????
      if (item.deviceType === DeviceTypeEnum.distributionFrame ||
        item.deviceType === DeviceTypeEnum.junctionBox) {
        allHasControl = false;
        return;
      }
    });
    // ??????????????????????????????
    if (!isSame) {
      this.$message.error(this.language.errMsg);
      return true;
    }
    // ?????????????????????????????????
    if (!allHasControl) {
      this.$message.error(this.language.noControlMsg);
      return true;
    }
  }

  /**
   * ????????????????????????
   */
  private getDefaultFilterCondition(): void {
    if (!_.isEmpty(this.deviceRoleTypes)) {
      const labelValue = [];
      this.deviceRoleTypes.forEach(item => {
        labelValue.push(item.code);
      });
      this.defaultFilterCondition = new FilterCondition('deviceType', OperatorEnum.in, labelValue);
    }
  }


  /**
   * ???????????????
   * param url
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    if (!this.queryCondition.filterConditions.some(item => item.filterField === 'deviceType')) {
      this.queryCondition.filterConditions.push(this.defaultFilterCondition);
    }
    this.$facilityCommonService.deviceListByPageForListPageNew(this.queryCondition).subscribe((result: ResultModel<FacilityListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          item.iconClass = CommonUtil.getFacilityIConClass(item.deviceType);
          // ??????????????????icon??????
          const statusStyle = CommonUtil.getDismantleDeviceStatusIconClass(item.deviceStatus);
          item.deviceStatusIconClass = statusStyle.iconClass;
          item.deviceStatusColorClass = statusStyle.colorClass;
          // ????????? ????????? ???????????????????????????????????????
          if ([DeviceTypeEnum.opticalBox, DeviceTypeEnum.distributionFrame,
            DeviceTypeEnum.junctionBox].includes(item.deviceType)) {
            item.infoButtonShow = true;
          }
          // ????????? ?????? ???????????????????????????
          if ([DeviceTypeEnum.well, DeviceTypeEnum.opticalBox, DeviceTypeEnum.outdoorCabinet].includes(item.deviceType)) {
            item.controlButtonShow = true;
          }
          if ([DeviceTypeEnum.wisdom].includes(item.deviceType)) {
            item.wisdomButtonShow = true;
          }
          item.facilityRelocation = true;
          // ?????????????????????????????????????????????????????????
          if (item.installationDate && item.scrapTime) {
            // ???????????????????????????????????????????????????
            const scrapped = Date.now() > addYears(new Date(item.installationDate), Number(item.scrapTime)).getTime();
            item.rowStyle = scrapped ? IrregularData : {};
          }
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ????????????????????????
   */
  private queryDeviceTypeCount(): void {
    this.$facilityCommonService.queryDeviceTypeCountNew().subscribe((result: ResultModel<Array<DeviceTypeCountModel>>) => {
      const data: Array<DeviceTypeCountModel> = result.data || [];
      // ????????????????????????
      const deviceTypes: Array<SliderConfigModel> = [];
      if (!_.isEmpty(this.deviceRoleTypes)) {
        this.deviceRoleTypes = FacilityForCommonUtil.deviceSort(this.deviceRoleTypes);
        this.deviceRoleTypes
          .map(item => item.code)
          .forEach(code => {
            const type = data.find(item => item.deviceType === code);
            deviceTypes.push({
              code: code as string,
              label: CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, code) as string,
              sum: type ? type.deviceNum : 0,
              textClass: CommonUtil.getFacilityTextColor(code as string),
              iconClass: CommonUtil.getFacilityIConClass(code),
            });
          });
      }
      // ?????????????????????
      const sum = _.sumBy(data, 'deviceNum') || 0;
      deviceTypes.unshift({
        // ????????????
        label: this.language.totalFacilities,
        iconClass: CommonUtil.getFacilityIConClass(null),
        textClass: CommonUtil.getFacilityTextColor(null),
        code: null, sum: sum
      });
      // ????????????
      this.sliderConfig = deviceTypes;
    });
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      keepSelected: true,
      selectedIdKey: 'deviceId',
      showSizeChanger: true,
      showSearchSwitch: true,
      primaryKey: '03-1-26',
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {type: 'select', key: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', key: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ??????
          title: this.language.deviceName, key: 'deviceName', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.deviceCode, key: 'deviceCode', width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.language.deviceType, key: 'deviceType', width: 150,
          configurable: true,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          minWidth: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceRoleTypes,
            label: 'label',
            value: 'code'
          }
        },
        { // ??????
          title: this.language.deviceStatus, key: 'deviceStatus', width: 120,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          configurable: true,
          isShowSort: true,
          searchable: true,
          minWidth: 90,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.resultDeviceStatus,
            label: 'label',
            value: 'code'
          }
        },
        { // ??????
          title: this.language.deviceModel,
          key: 'deviceModel',
          width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ?????????
          title: this.language.supplierName,
          key: 'supplier', width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.scrapTime,
          key: 'scrapTime',
          width: 170,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
/*        {
          // ????????????
          title: this.language.equipmentQuantity,
          key: 'equipmentQuantity',
          width: 170,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },*/
        { // ????????????
          title: this.language.businessStatus,
          key: 'businessStatus', width: 120,
          type: 'render',
          renderTemplate: this.businessStatusTemplate,
          hidden: true,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            notAllowClear: false,
            selectInfo: CommonUtil.codeTranslate(BusinessStatusEnum, this.$nzI18n, null, this.languageEnum.facility),
            label: 'label',
            value: 'code'
          },
        },
        { // ????????????
          title: this.language.installationDate,
          key: 'installationDate', width: 230,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          hidden: true,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'dateRang'}
        },
        { // ????????????
          title: this.language.parentId, key: 'areaName', width: 100,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {  // ????????????
          title: this.language.address, key: 'address', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          hidden: false,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.language.remarks, key: 'remarks',
          configurable: true,
          searchable: true,
          isShowSort: true,
          hidden: true,
          width: 150,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 200, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-1-4',
          needConfirm: true,
          canDisabled: true,
          confirmContent: this.language.deleteFacilityMsg,
          handle: (data: Array<FacilityListModel>) => {
            this.deleteHandle(data);
          }
        },
      ],
      operation: this.tableOperation,
      moreButtons: this.leftBottomButtonsTemp,
      rightTopButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      // ??????
     /* handleExport: (event: ListExportModel<FacilityListModel[]>) => {
        // ????????????
        const body = new ExportRequestModel(event.columnInfoList, event.excelType, new QueryConditionModel());
        body.columnInfoList.forEach(item => {
          // ???????????????????????????????????????????????????
          if (item.propertyName === 'installationDate') {
            item.propertyName = 'instDate';
          }
          if (['instDate', 'businessStatus', 'deviceType', 'deviceStatus', 'deployStatus'].includes(item.propertyName)) {
            // ????????????????????????
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        body.columnInfoList = body.columnInfoList.filter(item => {
          if ((item.propertyName !== 'select') && (item.propertyName !== 'serial-number')) {
            return item;
          }
        });
        // ?????????????????????
        if (event.selectItem.length > 0) {
          const ids = event.selectItem.map(item => item.deviceId);
          const filter = new FilterCondition('deviceId', OperatorEnum.in, ids);
          body.queryCondition.filterConditions.push(filter);
        } else {
          // ??????????????????
          body.queryCondition.filterConditions = event.queryTerm;
        }
        this.$facilityApiService.exportDeviceListNew(body).subscribe((res: ResultModel<string>) => {
          if (res.code === 0) {
            this.$message.success(this.language.exportFacilitySuccess);
          } else {
            this.$message.error(res.msg);
          }
        });
      }*/
    };
    this.lockInfoConfig = {
      noIndex: true,
      columnConfig: [
        {type: 'select', width: 62},
        {type: 'serial-number', width: 62, title: this.language.serialNumber},
        {title: this.language.doorNum, key: 'doorNum', width: 100},
        {title: this.language.doorName, key: 'doorName', width: 100},
      ]
    };
  }

  /**
   *  ??????????????????????????????????????????
   */
  private checkColumn(): void {
    let list = [];
    if (localStorage.getItem('userInfo') && localStorage.getItem('userInfo') !== 'undefined') {
      list = JSON.parse(localStorage.getItem('userInfo')).tenantElement.deviceElementList;
    }
    const codeList = [];
    const column = this.tableConfig.columnConfig.concat([]);

    if (list[1].children && list[1].children.length) {
      list[1].children.forEach(value => {
        if (value.isShow === '1') {
          codeList.push(FacilityTableColumnEnum[value.elementCode]);
        }
      });
    }

    // ???????????????????????????????????????
    const arr = ['select', 'serial-number'];
    codeList.push(...arr);

    column.forEach(item => {
      item.hidden = !(codeList.includes(item.key) || item.searchConfig.type === 'operate');
    });

    this.tableConfig.columnConfig = column;
  }

  /**
   * ???????????????????????????
   */
  private initLeftBottomButton(): Operation[] {
    return this.leftBottomButtonsTemp.filter(item => SessionUtil.checkHasRole(item.permissionCode));
  }

  /**
   * ????????????
   */
  private handleImport(): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    if (this.fileList.length === 1) {
      if (this.fileType === 'xls' || this.fileType === 'xlsx') {
        this.$facilityApiService.importDeviceInfo(formData).subscribe((result: ResultModel<string>) => {
          this.fileType = null;
          this.fileList = [];
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.language.importTask);
            this.fileArray = [];
          } else {
            this.$message.error(result.msg);
          }
        });
      } else {
        this.$message.info(this.language.fileTypeTips);
      }
    } else {
      this.$message.info(this.language.selectFileTips);
    }
  }

  /**
   * ????????????
   * @param data (Array<FacilityListModel>)
   */
  private deleteHandle(data: Array<FacilityListModel>): void {
    const ids: Array<string> = data.map(item => item.deviceId);
    this.deleteDeviceByIds(ids);
  }

  /**
   * ????????????
   */
  private controlHandle(facilityListModelIndex: FacilityListModel): void {
    if ([DeviceTypeEnum.well, DeviceTypeEnum.opticalBox, DeviceTypeEnum.outdoorCabinet]
      .includes(facilityListModelIndex.deviceType)) {
      this.lockInfo = [];
      this.getLockInfo(facilityListModelIndex.deviceId, facilityListModelIndex.deviceType).then(() => {
        const modal = this.$modal.create({
          nzTitle: this.language.control,
          nzContent: this.openLockTemp,
          nzOkText: this.language.handleCancel,
          nzCancelText: this.language.handleOk,
          nzOkType: 'danger',
          nzClassName: 'custom-create-modal',
          nzMaskClosable: false,
          nzFooter: [
            {
              // ??????????????????
              label: this.language.remoteUnlock,
              disabled: () => {
                // ??????????????????id
                const appAccessPermission = '03-1-11';
                return !SessionUtil.checkHasRole(appAccessPermission);
              },
              onClick: () => {
                const slotNum = this.lockClickCommon();
                if (slotNum.length === 0) {
                  this.$message.error(this.language.chooseDoorLock);
                  return;
                }
                const body = {
                  deviceId: facilityListModelIndex.deviceId,
                  doorNumList: slotNum
                };
                this.openLock(body);
                modal.destroy();
              }
            },
            {
              // ????????????
              label: this.language.authorization,
              type: 'danger',
              disabled: () => {
                // ??????????????????id
                const appAccessPermission = '09-5-1-2';
                return !SessionUtil.checkHasRole(appAccessPermission);
              },
              onClick: () => {
                const slotNum = this.lockClickCommon();
                if (slotNum.length === 0) {
                  this.$message.error(this.language.chooseDoorLock);
                  return;
                }
                // ?????????????????????????????????id?????????
                this.$router.navigate(['/business/application/facility-authorization/unified-details/add'],
                  {queryParams: {id: facilityListModelIndex.deviceId, slotNum: slotNum.join(',')}}).then(() => {
                  modal.destroy();
                });
              }
            },
            {
              label: this.language.handleCancel,
              type: 'danger',
              onClick: () => {
                modal.destroy();
              }
            },
          ]
        });
      }, () => {
      }).catch();
    } else {
      this.$message.error(this.language.noSupport);
    }
  }

  /**
   * ??????lock??????????????????????????????
   */
  private lockClickCommon(): string[] {
    const slotNum = [];
    this.lockInfo.forEach(item => {
      if (item.checked) {
        slotNum.push(item.doorNum);
      }
    });
    return slotNum;
  }

  /**
   * ???????????????????????????
   */
  private deleteDeviceByIds(ids: string[]): void {
    this.tableConfig.isLoading = true;
    this.$facilityApiService.deleteDeviceDyIds(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.deleteFacilitySuccess);
        // ??????????????????
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryDeviceTypeCount();
        this.refreshData();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ??????????????????
   * param {string} deviceStatus
   * param {any[]} devices
   */
  private updateDeviceStatus(deviceStatus: string, devices: any[]): void {
    const arr = devices.map(item => item.deviceId);
    const body = {deviceIds: arr, deployStatus: deviceStatus};
    this.tableConfig.isLoading = true;
    this.$lockService.updateDeviceStatus(body).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.deployCommandIssuedSuccessfully);
        this.refreshData();
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ???????????????????????? ??????/??????
   * @param  data  ????????????
   * @param  businessStatus ??????????????????
   */
  private updateStatusByIds(data: FacilityListModel[], businessStatus: BusinessStatusEnum) {
    const params = {
      // ??????????????????
      deviceIdList: data.map(item => item.deviceId),
      // ????????????
      businessStatus: businessStatus
    };
    this.$facilityApiService.updateDeviceStatusByIds(params).subscribe((result) => {
      if (result.code === ResultCodeEnum.success) {
        if (businessStatus === BusinessStatusEnum.release) {
          this.$message.success(`${this.language.release}${this.language.success}`);
        } else {
          this.$message.success(`${this.language.lockEquipment}${this.language.success}`);
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

}
