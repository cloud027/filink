import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService, UploadFile} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {EquipmentApiService} from '../../../share/service/equipment/equipment-api.service';
import {ImportMissionService} from '../../../../../core-module/mission/import.mission.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {Operation, TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition
} from '../../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {EquipmentStatisticsModel} from '../../../../../core-module/model/equipment/equipment-statistics.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {HIDDEN_SLIDER_HIGH_CONST, SHOW_SLIDER_HIGH_CONST} from '../../../share/const/facility-common.const';
import {EquipmentServiceUrlConst} from '../../../share/const/equipment-service-url.const';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {IrregularData, IS_TRANSLATION_CONST} from '../../../../../core-module/const/common.const';
import {BusinessStatusEnum} from '../../../share/enum/equipment.enum';
import {LoopApiService} from '../../../share/service/loop/loop-api.service';
import {Download} from '../../../../../shared-module/util/download';
import {SliderConfigModel} from '../../../../../core-module/model/facility/slider-config.model';
import {ListExportModel} from '../../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {FacilityListModel} from '../../../../../core-module/model/facility/facility-list.model';
import {ConfigDetailRequestModel} from '../../../../../core-module/model/equipment/config-detail-request.model';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {EquipmentStatusEnum, EquipmentTypeEnum, DismantleEquipmentStatusEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {ConfigResponseContentModel} from '../../../../../core-module/model/equipment/config-response-content.model';
import {DeployStatusEnum, FacilityListTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {EquipmentGetConfigCommon} from '../../../../../shared-module/component/business-component/equipment-detail-view/equipment-base-operate/equipment-get-config-common';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {EquipmentBathConfigModel} from '../../../share/model/equipment-bath-config.model';
import {HostTypeEnum} from '../../../../../core-module/enum/facility/Intelligent-lock/host-type.enum';
import {FacilityApiService} from '../../../share/service/facility/facility-api.service';

/**
 * ??????????????????
 * created by PoHe
 */
@Component({
  selector: 'app-dismantle-equipment',
  templateUrl: './dismantle-equipment.component.html',
  styleUrls: ['./dismantle-equipment.component.scss',
    '../../../facility-common.scss']
})
export class DismantleEquipmentComponent implements OnInit, OnDestroy {
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
  // ????????????????????????
  public leftBottomButtonsTemp = [];
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  public DismantleEquipmentStatusEnum = DismantleEquipmentStatusEnum;
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
  // ??????????????????
  public equipmentConfigContent: ConfigResponseContentModel[];
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
  // ??????????????????????????????
  public deviceConfiguration: boolean = true;
  // ????????????
  private resultEquipmentStatus: SelectModel[];
//  ??????????????????-??????
  private migration: boolean = true;
  /**
   * ?????????
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    public $nzModalService: NzModalService,
    private $equipmentAipService: EquipmentApiService,
    private $facilityCommonService: FacilityForCommonService,
    private $loopService: LoopApiService,
    private $refresh: ImportMissionService,
    private $download: Download,
    private $modalService: NzModalService,
    private $facilityApiService: FacilityApiService,
  ) {
  }

  /**
   * ???????????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // ?????????????????????
    this.resultEquipmentStatus = CommonUtil.codeTranslate(DismantleEquipmentStatusEnum, this.$nzI18n, null, this.languageEnum.facility) as SelectModel[];
    // ?????????????????????
    this.initTableConfig();
    // ????????????????????????
    this.queryEquipmentCount();
    this.tableRef.tableService.resetFilterConditions(this.tableRef.queryTerm);
    // ??????????????????
    this.refreshData();
    this.$refresh.refreshChangeHook.subscribe((event) => {
      // ????????????????????????
      this.queryEquipmentCount();
      // ??????????????????
      this.refreshData();
    });

  }
  public ngAfterViewInit(): void {
    this.tableRef.handleRest();
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
   * ?????????????????????
   */
  public slideShowChange(event: boolean): void {
    this.tableConfig.outHeight = event ? SHOW_SLIDER_HIGH_CONST : HIDDEN_SLIDER_HIGH_CONST;
    this.tableRef.calcTableHeight();
  }


  /**
   * ?????????????????????
   */
  public onSliderChange(event: SliderConfigModel): void {
    if (event.code !== null) {
      // ????????????????????????????????????
      this.tableRef.searchDate = {};
      this.tableRef.rangDateValue = {};
      this.tableRef.tableService.resetFilterConditions(this.tableRef.queryTerm);
      this.tableRef.handleSetControlData('equipmentType', [event.code]);
      this.tableRef.handleSearch();
    } else {
      this.tableRef.handleSetControlData('equipmentType', []);
      this.tableRef.handleRest();
    }
  }

  /**
   * ???????????????????????????
   * ???????????????any????????????????????????????????????
   */
  public getPramsConfig(equipmentID): void {
    this.$equipmentAipService.getEquipmentConfigByModel(equipmentID).subscribe((result: ResultModel<ConfigResponseContentModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentConfigContent = [];
        const temp = result.data || [];
        // ???????????????????????? ????????????????????????
        if (!_.isEmpty(temp)) {
          this.configEquipmentId = this.equipmentConfigId;
          this.configValueParam.equipmentId = this.equipmentConfigId;
          this.configValueParam.equipmentType = this.equipmentConfigType;
          if (this.equipmentConfigType === EquipmentTypeEnum.gateway) {
            EquipmentGetConfigCommon.queryGatewayPropertyConfig(this.configValueParam.equipmentId, temp, this);
            this.deviceConfiguration = false;
          } else {
            this.deviceConfiguration = true;
            this.equipmentConfigContent = temp;
            // ????????????????????????
            this.configOkDisabled = true;
            this.equipmentDeployShow = true;
          }
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
   * ???????????????????????? (????????? ????????????
   *
   */
  public openEquipmentConfigShow(): void {
    // ????????????????????????
    this.configOkDisabled = true;
    this.equipmentDeployShow = true;
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
    } else {
      const deviceNameArr = this.filterValue.filterName.split(',');
      this.selectFacility = this.filterValue.filterValue.map((item, index) => {
        return {deviceId: item, deviceName: deviceNameArr[index]};
      });
    }
  }

  /**
   * ??????????????????
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    this.filterValue.filterValue = event.map(item => {
      return item.deviceId;
    }) || [];
    this.selectFacility = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event.map(item => {
        return item.deviceName;
      }).join(',');
    } else {
      this.filterDeviceName = '';
    }
    this.filterValue.filterName = this.filterDeviceName;
  }

  // ????????????????????????
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = [file];
    const fileName = this.fileList[0].name;
    const index = fileName.lastIndexOf('\.');
    this.fileType = fileName.substring(index + 1, fileName.length);
    return false;
  }

  /**
   * ????????????
   */
  private routingJump(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * ??????????????????????????????
   */
  private queryEquipmentCount(): void {
    // ??????????????????
    this.$facilityCommonService.equipmentCountNew().subscribe(
      (result: ResultModel<EquipmentStatisticsModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          let roleEquip = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
          roleEquip = FacilityForCommonUtil.equipmentSort(roleEquip);
          const equipCods = roleEquip.map(v => v.code);
          // ???????????????????????????
          const equipmentTypeList: SliderConfigModel[] = [];
          const equipmentTypeData: EquipmentStatisticsModel[] = result.data || [];
          equipCods.forEach(row => {
            const temp = equipmentTypeData.find(item => item.equipmentType === row);
            let _iconClass;
            if (row === EquipmentTypeEnum.camera) {
              _iconClass = 'fiLink-camera-statistics camera-color';
            } else if (row === EquipmentTypeEnum.oneTouchCalling) {
              _iconClass = 'fiLink-alarm-fast alarm-fast-color';
            } else {
              _iconClass = CommonUtil.getEquipmentIconClassName(row as string);
            }
            equipmentTypeList.push({
              code: row as string,
              label: CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, row as string, LanguageEnum.facility) as string,
              sum: temp ? temp.equipmentNum : 0,
              textClass: CommonUtil.getEquipmentTextColor(row as string),
              iconClass: _iconClass
            });
          });
          // ?????????????????????
          const sum = _.sumBy(equipmentTypeData, 'equipmentNum') || 0;
          equipmentTypeList.unshift({
            // ????????????
            label: this.language.equipmentTotal,
            iconClass: CommonUtil.getEquipmentIconClassName(null),
            textClass: CommonUtil.getEquipmentTextColor(null),
            code: null, sum: sum
          });
          this.sliderConfig = equipmentTypeList;
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   *  ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$facilityCommonService.equipmentListByPageForListPageNew(this.queryCondition).subscribe((result: ResultModel<EquipmentListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        // ?????????????????????????????????co
        this.dataSet.forEach(item => {
          const statusArr: string[] = [EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled];
          item.deleteButtonShow = statusArr.includes(item.equipmentStatus);
          // ??????????????????
          const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
          item.facilityRelocation = true;
          item.deviceConfiguration = <string>item.equipmentModelType !== HostTypeEnum.PassiveLock;
          item.statusIconClass = iconStyle.iconClass;
          item.statusColorClass = iconStyle.colorClass;
          // ???????????????????????????
          item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
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
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      primaryKey: '03-8-13',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      showImport: false,
      columnConfig: [
        { // ??????
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62
        },
        { // ??????
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ??????
          title: this.language.name,
          key: 'equipmentName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        { // ????????????
          title: this.language.deviceCode,
          key: 'equipmentCode',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ??????id
          title: this.language.sequenceId,
          key: 'sequenceId',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
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
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
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
            selectInfo: this.resultEquipmentStatus,
            label: 'label',
            value: 'code'
          }
        },
        { //  ??????
          title: this.language.model,
          key: 'equipmentModel',
          width: 124,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ?????????
          title: this.language.supplierName,
          key: 'supplier',
          width: 125,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.scrapTime,
          key: 'scrapTime',
          width: 100,
          isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.affiliatedDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceFilterTemplate
          },
        },
        { // ????????????
          title: this.language.mountPosition,
          key: 'mountPosition',
          configurable: true,
          width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????????????????
          title: this.language.installationDate,
          width: 200,
          configurable: true,
          isShowSort: true,
          searchable: true,
          hidden: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd',
          searchConfig: {type: 'dateRang'},
          key: 'installationDate'
        },
        { // ????????????
          title: this.language.company, key: 'company',
          searchable: true,
          width: 150,
          configurable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.businessStatus, key: 'businessStatus',
          configurable: true,
          type: 'render',
          renderTemplate: this.equipmentBusinessTemp,
          width: 150,
          searchable: true,
          isShowSort: true,
          hidden: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(BusinessStatusEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // ????????????
          title: this.language.affiliatedArea, key: 'areaName',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // ????????????
          title: this.language.address, key: 'address',
          configurable: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // ????????????
          title: this.language.gatewayName, key: 'gatewayName',
          configurable: true,
          hidden: true,
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.language.remarks, key: 'remarks',
          configurable: true,
          hidden: true,
          width: 200,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 200,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-8-7',
          needConfirm: false,
          canDisabled: true,
          confirmContent: this.language.confirmDeleteData,
          handle: (data: EquipmentListModel[]) => {
            this.handelDeleteEquipment(data);
          }
        }
      ],
      operation: [
/*        { // ????????????
          permissionCode: '03-8-0-1',
          text: this.language.equipmentDetail, className: 'fiLink-view-detail',
          handle: (data: EquipmentListModel) => {
            this.routingJump('business/facility/dismantle-equipment-view-detail',
              {queryParams: {equipmentId: data.equipmentId}});
          },
        },*/
        { // ??????
          permissionCode: '03-8-7',
          text: this.commonLanguage.deleteBtn, className: 'fiLink-delete red-icon',
          handle: (data: EquipmentListModel) => {
            // ???????????? ?????? ????????????????????????????????????
            /* if (![EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled].includes(data.equipmentStatus)) {
               this.$message.warning(this.language.dataCanBeDelete);
               return;
             }*/
            this.handelDeleteEquipment([data]);
          }
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
        if (deviceIndex >= 0 && !_.isEmpty(event[deviceIndex].filterValue)) {
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
      //  ????????????
/*      handleExport: (event: ListExportModel<EquipmentListModel[]>) => {
        this.handelExportEquipment(event);
      },*/
    };
  }

  /**
   * ???????????????????????????
   */
  private initLeftBottomButton(): Operation[] {
    return this.leftBottomButtonsTemp.filter(item => SessionUtil.checkHasRole(item.permissionCode));
  }

  /**
   * ??????????????????
   */
  private handelImportEquipment() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    if (this.fileList.length === 1) {
      if (this.fileType === 'xls' || this.fileType === 'xlsx') {
        this.$equipmentAipService.batchImportEquipmentInfo(formData).subscribe((result: ResultModel<string>) => {
          this.fileList = [];
          this.fileType = null;
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
   * ??????????????????
   */
  private handelDeleteEquipment(data: EquipmentListModel[]): void {
    // ?????????????????????????????????????????????
    /* const statusArr: string[] = [EquipmentStatusEnum.unSet, EquipmentStatusEnum.dismantled];
     const tempArr = data.filter(item => !statusArr.includes(item.equipmentStatus));
     if (!_.isEmpty(tempArr)) {
       this.$message.warning(this.language.dataCanBeDelete);
       return;
     }*/
    // ???????????????????????????id
    const ids = data.map(v => {
      return v.equipmentId;
    });
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzOkType: 'danger',
      nzContent: `<span>${this.language.confirmDeleteEquipment}</span>`,
      nzOkText: this.commonLanguage.cancel,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.$equipmentAipService.deleteEquipmentByIds(ids).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.language.deleteEquipmentSuccess);
            this.queryCondition.pageCondition.pageNum = 1;
            this.queryEquipmentCount();
            this.refreshData();
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    });
  }

  /**
   * ????????????
   */
  private handelExportEquipment(event: ListExportModel<EquipmentListModel[]>): void {
    // ????????????
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    exportBody.columnInfoList.forEach(item => {
      // ???????????????????????????????????????????????????
      if (item.propertyName === 'installationDate') {
        item.propertyName = 'instDate';
      }
      if (['equipmentType', 'equipmentStatus', 'deviceName', 'instDate', 'businessStatus', 'areaName'].includes(item.propertyName)) {
        // ????????????????????????
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // ?????????????????????
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.equipmentId);
      const filter = new FilterCondition('equipmentId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // ??????????????????
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    // ??????????????????
    this.$equipmentAipService.exportEquipmentListNew(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.exportEquipmentSuccess);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
