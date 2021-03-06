import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {LoopApiService} from '../../share/service/loop/loop-api.service';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {MapConfig} from '../../../../shared-module/component/map/map.config';
import {SelectGroupService} from '../../../../shared-module/service/index/select-group.service';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {LoopMapDeviceDataModel} from '../../share/model/loop-map-device-data.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {MapEventTypeEnum} from '../../../../shared-module/enum/filinkMap.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {LoopPullCloseBreakModel} from '../../share/model/loop-pull-close-break.model';
import {InstructSendRequestModel} from '../../../../core-module/model/group/instruct-send-request.model';
import {MapEventModel} from '../../../../core-module/model/map-event.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {LoopStatusEnum, LoopTypeEnum} from '../../../../core-module/enum/loop/loop.enum';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {LoopMapComponent} from '../../../../shared-module/component/business-component/loop-map/loop-map.component';
import {LoopListModel} from '../../../../core-module/model/loop/loop-list.model';
import {MapService} from '../../../../core-module/api-service/index/map';
import {LoopListCommon} from '../../../../shared-module/component/business-component/loop/loop-list-map/loop-list-common';
import {MapConfig as BMapConfig} from '../../../../shared-module/component/map/b-map.config';


/**
 * ???????????????????????????
 */
@Component({
  selector: 'app-loop-list',
  templateUrl: './loop-list.component.html',
  styleUrls: ['./loop-list.component.scss']
})

export class LoopListComponent extends LoopListCommon implements OnInit, OnDestroy {
  // ??????
  @ViewChild('mainMap') mainMap: LoopMapComponent;
  // ????????????
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // ????????????
  @ViewChild('loopStatusRef') loopStatusRef: TemplateRef<HTMLDocument>;
  //  ????????????
  @ViewChild('loopTypeRef') loopTypeRef: TemplateRef<HTMLDocument>;
  // ????????????
  public mapConfig: MapConfig;
  // ????????????????????????
  public data: LoopMapDeviceDataModel[] = [];
  // ????????????
  public dataSet: LoopListModel[] = [];
  // ??????????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????????????????
  public filterConditions: FilterCondition[] = [];
  // ?????????????????????id??????
  public deviceIds: string[] = [];
  // ??????????????????????????????
  public areaFacilityByLoop: boolean = false;
  // ??????????????????
  public selectFacility: boolean = true;
  // ??????????????????
  public loopStatusEnum = LoopStatusEnum;
  // ??????????????????
  public loopTypeEnum = LoopTypeEnum;

  constructor(
    public $facilityCommonService: FacilityForCommonService,
    public $message: FiLinkModalService,
    public $modalService: NzModalService,
    public $selectGroupService: SelectGroupService,
    public $mapService: MapService,
    public $mapStoreService: MapStoreService,
    private $router: Router,
    private $loopService: LoopApiService,
    private $nzI18n: NzI18nService,
  ) {
    super($facilityCommonService, $message, $modalService, $selectGroupService, $mapService, $mapStoreService);
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // ???????????????
    this.initTableConfig();
    // ??????????????????
    this.refreshData();
    // ?????????????????????
    this.initMapData();
    // ??????????????????
    this.handleInitData();
  }

  /**
   * ????????????
   */
  public ngOnDestroy(): void {
    this.mainMap = null;
    this.tableComponent = null;
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * ??????????????????
   */
  public mapEvent(event: MapEventModel): void {
    if (event.type === MapEventTypeEnum.selected) {
      this.deviceIds = [event.id];
      this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, [event.id])];
      this.refreshData();
      // ????????????
      this.queryCondition.filterConditions = [];
    } else if (event.type === MapEventTypeEnum.mapBlackClick) {
      this.queryCondition.filterConditions = [];
      this.refreshData();
      // ???????????????
      if (this.mainMap) {
        this.mainMap.clearLoopDrawLine();
        this.mainMap.loopDrawLineData = [];
        // ??????????????????
        if (!_.isEmpty(this.deviceIds)) {
          this.mainMap.resetMarkersStyle(this.deviceIds);
        }
      }
      this.deviceIds = [];
      this.isShowButton = false;
    }
    // ???????????????????????????
    if (event.type === MapEventTypeEnum.areaPoint) {
      this.areaFacilityByLoop = false;
      if (this.mainMap) {
        // ????????????????????????
        this.mainMap.mapService.markerClusterer.clearMarkers();
        // ????????????????????????????????????
        const centerPoint = event.data.split(',');
        this.mainMap.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.deviceZoom);
        // this.mainMap.mapService.panTo(event.data['lng'], event.data['lat']);
        // ???????????????
        // this.mainMap.getMapDeviceData([event.data.code], 'area');
        this.mainMap.zoomLocation();
      }
    }
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
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      primaryKey: '03-10',
      isDraggable: true,
      outHeight: 108,
      isLoading: true,
      showSearchSwitch: true,
      scroll: {x: '1804px', y: '340px'},
      showSizeChanger: true,
      showSearchExport: true,
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', title: this.language.serialNumber, width: 62,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ????????????
          title: this.language.loopName,
          key: 'loopName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        },
        { // ????????????
          title: this.assetLanguage.loopCode,
          key: 'loopCode',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.loopType,
          key: 'loopType',
          type: 'render',
          renderTemplate: this.loopTypeRef,
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(LoopTypeEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // ????????????
          title: this.assetLanguage.loopStatus,
          key: 'loopStatus',
          type: 'render',
          renderTemplate: this.loopStatusRef,
          width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(LoopStatusEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // ???????????????
          title: this.language.distributionBox,
          key: 'distributionBoxName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.controlledObject,
          key: 'centralizedControlName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.language.remarks,
          key: 'remark',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        { // ??????
          text: this.language.addArea,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '03-10-1',
          handle: () => {
            this.navigateToDetail('business/facility/loop-detail/add',
              {queryParams: {}});
          }
        },
        { // ????????????
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-10-4',
          needConfirm: true,
          canDisabled: true,
          confirmContent: this.assetLanguage.deleteLoopTip,
          handle: (data: LoopListModel[]) => {
            this.deleteLoopByIds(data);
          }
        }
      ],
      moreButtons: [
        { // ????????????
          text: this.language.brake,
          canDisabled: true,
          iconClassName: 'fiLink-pull-gate',
          permissionCode: '03-10-6',
          needConfirm: true,
          disabled: false,
          confirmContent: this.assetLanguage.pullBrakeOperateTip,
          handle: (data: LoopListModel[]) => {
            this.pullBrakeOperate(data, ControlInstructEnum.closeBreak);
          }
        },
        { // ????????????
          text: this.language.closing,
          canDisabled: true,
          iconClassName: 'fiLink-close-gate',
          permissionCode: '03-10-5',
          needConfirm: true,
          disabled: false,
          confirmContent: this.assetLanguage.closeBrakeOperateTip,
          handle: (data: LoopListModel[]) => {
            this.pullBrakeOperate(data, ControlInstructEnum.openBreak);
          }
        }
      ],
      operation: [
        { // ??????
          text: this.language.update,
          permissionCode: '03-10-2',
          className: 'fiLink-edit',
          handle: (data: LoopListModel) => {
            this.navigateToDetail('business/facility/loop-detail/update', {queryParams: {id: data.loopId}});
          }
        },
        { // ????????????
          text: this.language.viewDetail,
          className: 'fiLink-view-detail',
          permissionCode: '03-10-3',
          handle: (data: LoopListModel) => {
            this.navigateToDetail('business/facility/loop-view-detail',
              {
                queryParams: {id: data.loopId, code: data.loopCode, equipmentId: data.centralizedControlId}
              });
          }
        },
        { // ??????
          text: this.language.brake,
          permissionCode: '03-10-6',
          className: 'fiLink-pull-gate',
          needConfirm: true,
          disabled: true,
          key: 'isShowOperateIcon',
          confirmContent: this.assetLanguage.pullBrakeOperateTip,
          handle: (data: LoopListModel) => {
            this.pullBrakeOperate([data], ControlInstructEnum.closeBreak);
          }
        },
        { // ??????
          text: this.language.closing,
          permissionCode: '03-10-5',
          key: 'isShowOperateIcon',
          disabled: true,
          className: 'fiLink-close-gate',
          needConfirm: true,
          confirmContent: this.assetLanguage.closeBrakeOperateTip,
          handle: (data: LoopListModel) => {
            this.pullBrakeOperate([data], ControlInstructEnum.openBreak);
          }
        },
        { // ????????????
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          permissionCode: '03-10-4',
          confirmContent: this.assetLanguage.deleteLoopTip,
          handle: (data: LoopListModel) => {
            this.deleteLoopByIds([data]);
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
      // ??????
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      // ??????
      handleExport: (event: ListExportModel<LoopListModel[]>) => {
        this.handelExportLoop(event);
      },
      // ????????????????????????
      handleSelect: (event: LoopListModel[]) => {
        this.loopSelectedData = event;
        // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????disabled
        const data = this.loopSelectedData.filter(v => v.centralizedControlId === null);
        if (this.mainMap) {
          this.mainMap.selectedLoop = data;
        }
        const moreOperateDisable = !_.isEmpty(data);
        this.tableConfig.moreButtons.forEach(item => item.disabled = moreOperateDisable);
        const selectDataIds = event.map(item => {
          return {loopId: item.loopId};
        });
        this.loopDrawLine(selectDataIds);
      }
    };
  }

  /**
   * ????????????
   */
  private handelExportLoop(event: ListExportModel<LoopListModel[]>): void {
    // ????????????
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    exportBody.columnInfoList.forEach(item => {
      if (['loopType', 'loopStatus'].includes(item.propertyName)) {
        // ????????????????????????
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // ?????????????????????
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.loopId);
      const filter = new FilterCondition('loopIds', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // ??????????????????
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    // ??????????????????
    this.$loopService.exportLoopList(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.assetLanguage.exportSucceededTip);
      } else {
        this.$message.error(result.msg);
      }
    });
  }


  /**
   * ??????????????????
   */
  private deleteLoopByIds(data: LoopListModel[]): void {
    const loopIds = data.map(item => item.loopId);
    this.$loopService.deleteLoopByIds({loopIds: loopIds}).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.assetLanguage.deleteLoopSucceededTip);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ???????????????
   */
  private pullBrakeOperate(data: LoopListModel[], commandId: ControlInstructEnum): void {
    const loopList = [];
    const equipmentIds = [];
    data.forEach(item => {
      if (item.centralizedControlId !== null && item.loopCode !== null) {
        loopList.push({equipmentId: item.centralizedControlId, loopCode: item.loopCode});
        equipmentIds.push(item.centralizedControlId);
      }
    });
    // ?????????????????????????????????????????????????????????????????????
    if (!_.isEmpty(loopList)) {
      const param = new LoopPullCloseBreakModel(loopList);
      const requestParam = new InstructSendRequestModel<LoopPullCloseBreakModel>(commandId, equipmentIds, param);
      // ???????????????????????????????????????
      this.checkEquipmentMode(equipmentIds).then( resolve => {
        if (resolve.code === ResultCodeEnum.success) {
          this.$loopService.pullBrakeOperate(requestParam).subscribe((result: ResultModel<string>) => {
            if (result.code === ResultCodeEnum.success) {
              // ??????????????????????????????
              this.$message.success(`${this.languageTable.contentList.distribution}!`);
            } else {
              // ????????????????????????????????????
              this.$message.error(result.msg);
            }
          });
        } else {
          // ????????????????????????????????????
          this.$message.error(resolve.msg);
        }
      });
    } else {
      this.$message.info(this.assetLanguage.noCommandInfoTip);
    }
  }

  /**
   * ???????????????
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * ????????????
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$facilityCommonService.queryLoopList(this.queryCondition).subscribe((result: ResultModel<LoopListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        this.dataSet.forEach(item => {
          // ???????????????????????????????????????????????????
          item.isShowOperateIcon = !!item.centralizedControlId;
        });
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
  private checkEquipmentMode(data): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityCommonService.checkEquipmentMode({loopControlEquipmentIdList: data}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }
}
