import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ApplicationService} from '../../share/service/application.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {Download} from '../../../../shared-module/util/download';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FileTypeEnum} from '../../share/enum/program.enum';
import {CheckUserModel} from '../../share/model/check.user.model';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {HistoryAudioModel} from '../../share/model/history.audio.model';
import {PageSizeEnum} from '../../../../shared-module/enum/page-size.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {
  DeviceTypeEnum, DeviceStatusEnum
} from '../../../../core-module/enum/facility/facility.enum';
/**
 * ??????????????????
 */
@Component({
  selector: 'app-history-audio-list',
  templateUrl: './history-audio-list.component.html',
  styleUrls: ['./history-audio-list.component.scss']
})
export class HistoryAudioListComponent implements OnInit, OnDestroy {
  /**
   * ???????????????????????????
   */
  @ViewChild('programFiles') programFiles: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  ??????????????????
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentBusinessTemp') equipmentBusinessTemp: TemplateRef<HTMLDocument>;
  // ??????????????????????????????
  @ViewChild('equipmentDeviceTypeTemp') equipmentDeviceTypeTemp: TemplateRef<HTMLDocument>;
  /**
   * ????????????????????????
   */
  @ViewChild('remarksTable') remarksTable: TemplateRef<any>;
  @ViewChild('equipmentRef') equipmentRef: TemplateRef<any>;
  /**
   * ????????????
   */
  public dataSet: HistoryAudioModel[] = [];
  public deviceList = [];
  // ???????????????????????????
  private deviceRoleTypes: SelectModel[];
  /**
   * ??????????????????
   */
  public pageBean: PageModel = new PageModel();
  // ??????????????????
  public _pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  /**
   * ????????????
   */
  public tableConfig: TableConfigModel;
  public deviceTableConfig: TableConfigModel;
  /**
   * ?????????
   */
  public language: ApplicationInterface;
  // ???????????????
  public equipmentLanguage: FacilityLanguageInterface;
  /**
   * ???????????????
   */
  public isVideo: boolean = true;
  /**
   * ???????????????
   */
  public isPreview: boolean = false;
  public showDeviceModal: boolean = false;
  /**
   * ????????????
   */
  public filePath: string = '';
  /**
   * ??????????????????
   */
  public reviewedBy: string;
  /**
   * ???????????????
   */
  public reviewedByArr: CheckUserModel[] = [];
  /**
   * ?????????????????????
   */
  private reviewedSearchList: RoleUnitModel[] = [];
  /**
   * ????????????
   */
  private rowData: HistoryAudioModel;
  /**
   * ??????????????????
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  private deviceQueryCondition: QueryConditionModel = new QueryConditionModel();
// ??????????????????
  public equipmentTypeList = [];
// ?????????????????????
  public facilityVisible: boolean = false;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ????????????
  public deviceTypeCode = DeviceTypeEnum;
  // ??????????????????
  public deviceStatusEnum = DeviceStatusEnum;
  /**
   * @param $nzI18n  ???????????????
   * @param $router  ??????????????????
   * @param $message  ??????????????????
   * @param $applicationService  ??????????????????????????????
   * @param $download  ????????????
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $applicationService: ApplicationService,
    private $download: Download
  ) {
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    this.getCheckUsers();
    this.initTableConfig();
    this.initDeviceTableConfig();
    this.refreshData();
  }

  /**
   * ????????????
   */
  public ngOnDestroy(): void {
    this.programFiles = null;
    this.remarksTable = null;
  }

  /**
   * ????????????
   * @param event ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  public _pageChange(event: PageModel): void {
    this.deviceQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.deviceQueryCondition.pageCondition.pageSize = event.pageSize;
    this.queryDeviceList();
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      primaryKey: '09-2-4',
      showSizeChanger: true,
      notShowPrint: false,
      showSearchExport: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        // ??????
        {
          type: 'serial-number', width: 62, title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // ????????????
        {
          title: this.language.historyAudioList.recordTime, key: 'recordTime', width: 200, isShowSort: true,
          pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // ??????
        // {
        //   title: this.language.historyAudioList.duration, key: 'duration', width: 150, isShowSort: true,
        //   configurable: true,
        //   searchable: true,
        //   searchConfig: {type: 'input'}
        // },
        // ??????
        {
          title: this.language.historyAudioList.format, key: 'mode', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.historyAudioList.size, key: 'size', width: 180, isShowSort: true,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ?????????
        {
          title: this.language.historyAudioList.recorder, key: 'recordUserName', width: 150,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.language.historyAudioList.device,
          key: 'device',
          configurable: true,
          width: 150,
          minWidth: 120,
          type: 'render',
          renderTemplate: this.equipmentRef,
        },
        // ??????
        {
          title: this.language.frequentlyUsed.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        {
          text: this.language.historyAudioList.download,
          iconClassName: 'fiLink-download-file',
          permissionCode: '09-2-4-1',
          handle: (data) => {
            // ????????????
            const ids = data.map(item => item.recordId);
            this.batchDownLoadRecords(ids);
          }
        },
        {
          text: this.language.frequentlyUsed.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '09-2-4-2',
          confirmContent: `${this.language.frequentlyUsed.confirmDelete}?`,
          handle: (data: HistoryAudioModel[]) => {
            // ????????????????????????????????????
            const recordList = data.map(item => {
              return item.recordId;
            });
            this.deleteSoundRecord(recordList);
          }
        },
      ],
      operation: [
        // ??????
        {
          text: this.language.historyAudioList.download,
          className: 'fiLink-download-file',
          handle: (data) => {
            this.$download.downloadFile(data.recordPath);
          }
        },
        // ??????
        {
          text: this.language.contentList.preview,
          className: 'fiLink-filink-yulan-icon',
          handle: (data: HistoryAudioModel) => {
            this.preview(data);
          }
        },
        // ??????
        {
          text: this.language.frequentlyUsed.delete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          // ????????????
          confirmContent: `${this.language.frequentlyUsed.confirmDelete}?`,
          handle: (data: HistoryAudioModel) => {
            this.deleteSoundRecord([data.recordId]);
          }
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        event.forEach(item => {
          if (item.filterField === 'programFileType' && item.filterValue.includes(FileTypeEnum.image)) {
            item.filterValue = item.filterValue.concat(FileTypeEnum.image.split('-'));
            item.filterValue = item.filterValue.filter(it => it !== FileTypeEnum.image);
          }
          // ??????
          if (item.filterField === 'size') {
            item.operator =  OperatorEnum.lte;
            item.filterValue = Number(item.filterValue) ? Number(item.filterValue) : 0;
          }
        });
        this.refreshData();
      },
      //  ????????????
      handleExport: (event: ListExportModel<HistoryAudioModel[]>) => {
        this.handelExportProgramList(event);
      },
    };
  }


  /**
   * ??????????????????
   */
  private refreshData(): void {
    // ???????????????
    this.tableConfig.isLoading = false;
    this.$applicationService.querySoundRecordList(this.queryCondition)
      .subscribe((result: ResultModel<HistoryAudioModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // this.tableConfig.isLoading = false;
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
        } else {
          this.$message.error(result.msg);
          this.tableConfig.isLoading = false;
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }
  /**
   * ??????????????????
   * @param programIdList programId??????
   */
  private deleteSoundRecord(recordList: Array<string>): void {
    this.$applicationService.deleteSoundRecord(recordList)
      .subscribe((result: ResultModel<HistoryAudioModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.frequentlyUsed.deleteSucceeded);
          // ??????????????????
          this.queryCondition.pageCondition.pageNum = 1;
          this.refreshData();
        } else {
          this.$message.error(result.msg);
        }
      });
  }
  /**
   * ??????
   * @param data ????????????
   */
  public preview(data: HistoryAudioModel): void {
    // this.isVideo = data.programFileType === getFileType(this.$nzI18n, FileNameTypeEnum.video);
    this.isPreview = true;
    // ???'\'??????'/'
    this.filePath = data.recordPath.replace(/\\/g, '/');
  }

  /**
   * ????????????
   */
  public onPreviewCancel(): void {
    this.isPreview = false;
    // ??????????????????
    this.filePath = '';
  }

  /**
   * ????????????
   */
  public onPreviewOk(): void {
    this.isPreview = false;
    // ??????????????????
    this.filePath = '';
  }
  /**
   * ??????????????????
   */
  private getCheckUsers(): void {
    this.$applicationService.getCheckUsers()
      .subscribe((result: ResultModel<CheckUserModel[]>) => {
          if (result.code === ResultCodeEnum.success) {
            if (!_.isEmpty(result.data)) {
              this.reviewedByArr = [...result.data] || [];
              this.reviewedBy = this.reviewedByArr[0].id;
              this.reviewedByArr.forEach(item => {
                this.reviewedSearchList.push({'label': item.userName, 'value': item.id});
              });
            }
          } else {
            this.$message.error(result.msg);
          }
        }
      );
  }
  /**
   * ???????????? ????????????
   * @param data ????????????
   */
  public downloadFile(data: HistoryAudioModel): void {
    this.$download.downloadFile(data.recordPath, data.recordName);
  }

  /**
   * ????????????
   */
  private handelExportProgramList(event: ListExportModel<HistoryAudioModel[]>): void {
    // ????????????
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    exportBody.columnInfoList.forEach((item, index) => {
      if (['programStatus', 'programFileType', 'createTime', 'reviewedTime'].includes(item.propertyName)) {
        // ????????????????????????
        item.isTranslation = IS_TRANSLATION_CONST;
      }
      if (item.propertyName === 'device') {
          exportBody.columnInfoList.splice(index, 1);
      }
    });
    // ?????????????????????
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.recordId);
      const filter = new FilterCondition('recordId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // ??????????????????
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    // ??????????????????
    this.$applicationService.exportRecordList(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  viewDevice (data) {
    this.deviceQueryCondition.bizCondition = {recordId: data.recordId};
    this.deviceQueryCondition.pageCondition.pageSize = 5;
    this.deviceQueryCondition.pageCondition.pageNum = 1;
    this.queryDeviceList();
  }
  queryDeviceList() {
    this.$applicationService.querySoundRecordEquipmentList(this.deviceQueryCondition)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.deviceList = result.data.map((itemData) => {
            const item = itemData;
            // ??????????????????
            const iconStyle = CommonUtil.getEquipmentStatusIconClass(
              item.equipmentStatus,
              'list'
            );
            item.statusIconClass = iconStyle.iconClass;
            item.statusColorClass = iconStyle.colorClass;
            item.deviceName = item.deviceInfo.deviceName;
            item.deviceType = item.deviceInfo.deviceType;
            item.address = item.deviceInfo.address;
            // ???????????????????????????
            item.iconClass = CommonUtil.getEquipmentTypeIcon(item);
            // ????????????
            item.deviceIconClass = CommonUtil.getFacilityIconClassName(
              item.deviceType
            );
            return item;
          });
          this._pageBean.Total = result.totalCount;
          this._pageBean.pageIndex = result.pageNum;
          this._pageBean.pageSize = result.size;
          this.showDeviceModal = true;
        } else {
          this.deviceList = [];
          this.$message.error(result.msg);
          this.tableConfig.isLoading = false;
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }
  deviceCancel() {
    this.showDeviceModal = false;
    this.deviceList = [];
  }
  deviceOk() {
    this.showDeviceModal = false;
    this.deviceList = [];
  }
  initDeviceTableConfig() {
    this.deviceTableConfig = {
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      notShowPrint: true,
      pageSizeOptions: [5, 10, 20, 30, 40],
      outHeight: 108,
      scroll: { x: '1804px', y: '450px' },
      noIndex: true,
      showSearchExport: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        // ??????
        {
          type: 'serial-number', width: 30, title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // ????????????
        {
          title: this.language.equipmentTable.equipmentName, key: 'equipmentName', width: 180, isShowSort: false,
          // configurable: true,
          searchable: false,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.language.equipmentTable.equipmentType, key: 'equipmentType', isShowSort: false,
          type: 'render',
          width: 120,
          searchable: false,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceRoleTypes,
            label: 'label',
            value: 'code'
          }
        },
        {
          // ??????
          title: this.language.equipmentTable.equipmentStatus,
          key: 'equipmentStatus',
          width: 110,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          searchable: false,
          isShowSort: false,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(
              EquipmentStatusEnum,
              this.$nzI18n,
              null,
              this.languageEnum.facility
            ),
            label: 'label',
            value: 'code'
          }
        },
        {
          // ????????????
          title: this.language.equipmentTable.equipmentDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          configurable: false,
          searchable: false,
          isShowSort: false,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceFilterTemplate
          }
        },
        // ????????????
        {
          title: this.language.equipmentTable.deviceType,
          key: 'deviceType',
          isShowSort: false,
          type: 'render',
          width: 150,
          searchable: false,
          renderTemplate: this.equipmentDeviceTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.deviceRoleTypes,
            label: 'label',
            value: 'code'
          }
        },
        {
          // ????????????
          title: this.language.equipmentTable.address,
          key: 'address',
          searchable: false,
          width: 150,
          configurable: false,
          searchConfig: { type: 'input' }
        },
        {
          title: this.language.frequentlyUsed.operate,
          searchable: false,
          searchConfig: { type: 'operate' },
          key: '',
          width: 120,
          fixedStyle: { fixedRight: true, style: { right: '0px' } }
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        event.forEach(item => {
          if (item.filterField === 'programFileType' && item.filterValue.includes(FileTypeEnum.image)) {
            item.filterValue = item.filterValue.concat(FileTypeEnum.image.split('-'));
            item.filterValue = item.filterValue.filter(it => it !== FileTypeEnum.image);
          }
        });
        // this.refreshData();
      },
    };
  }
  batchDownLoadRecords(recordList): void {
    this.$applicationService.batchDownLoadRecords(recordList)
      .subscribe((result: ResultModel<HistoryAudioModel>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.broadcastWorkbench.batchDownloadSuccess);
          // ??????????????????
          this.queryCondition.pageCondition.pageNum = 1;
          this.refreshData();
        } else {
          this.$message.error(result.msg);
        }
      });
  }
}
