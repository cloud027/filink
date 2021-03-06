import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApplicationService} from '../../../../share/service/application.service';
import {ApplicationFinalConst} from '../../../../share/const/application-system.const';
import {QueryConditionModel, SortCondition} from '../../../../../../shared-module/model/query-condition.model';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {ApplicationInterface} from '../../../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {DistributeModel} from '../../../../share/model/distribute.model';
import {InstructConfig} from '../../../../share/config/instruct.config';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../../../core-module/enum/facility/facility.enum';
import {MoveInOrOutModel} from '../../../../../../core-module/model/loop/move-in-or-out.model';
import {AssetManagementLanguageInterface} from '../../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {LoopViewDetailModel} from '../../../../../../core-module/model/loop/loop-view-detail.model';
import {LightLoopTableEnum} from '../../../../share/enum/auth.code.enum';
import {FilinkMapEnum} from '../../../../../../shared-module/enum/filinkMap.enum';
import {ThumbnailComponent} from '../../../../../../shared-module/component/business-component/thumbnail/thumbnail.component';
import {ControlInstructEnum} from '../../../../../../core-module/enum/instruct/control-instruct.enum';
import {LoopTypeEnum} from '../../../../../../core-module/enum/loop/loop.enum';
import {FacilityForCommonService} from '../../../../../../core-module/api-service';
import {FacilityListModel} from '../../../../../../core-module/model/facility/facility-list.model';

/**
 * ????????????
 */
@Component({
  selector: 'app-loop-details',
  templateUrl: './loop-details.component.html',
  styleUrls: ['./loop-details.component.scss']
})
export class LoopDetailsComponent implements OnInit, OnDestroy {
  // ??????????????????
  @ViewChild('deviceTypeTemp') private deviceTypeTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('deviceStatusTemp') private deviceStatusTemp: TemplateRef<HTMLDocument>;
  //  ????????????
  @ViewChild('thumbnail') public thumbnail: ThumbnailComponent;
  // ??????/??????
  public controlInstructEnum = ControlInstructEnum;
  // ????????????????????????
  public dataSet: FacilityListModel[] = [];
  public sourceDataList = {
    strategyType: '',
    strategyRefList: []
  };
  // ???????????????????????????
  public heightStyle = {height: '100%'};
  // ????????????id
  public centralizedControlId: string = '';
  public loopData: LoopViewDetailModel = new LoopViewDetailModel();
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ????????????
  public deviceStatusEnum = DeviceStatusEnum;
  // ??????????????????
  public loopCode: string = '';
  public controlledObject: string = '';
  // ??????
  public userName: string = '';
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ??????id
  public loopId: string = '';
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ?????????????????????
  public languageTable: ApplicationInterface;
  // ???????????????
  public language: FacilityLanguageInterface;
  // ???????????????
  public assetLanguage: AssetManagementLanguageInterface;
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ????????????????????????
  public lightLoopTableEnum = LightLoopTableEnum;
  // ????????????
  public mapType: string = FilinkMapEnum.baiDu;

  constructor(
    // ????????????
    private $activatedRoute: ActivatedRoute,
    // ??????
    private $message: FiLinkModalService,
    private $facilityForCommonService: FacilityForCommonService,
    // ???????????????
    private $nzI18n: NzI18nService,
    // ????????????
    private $applicationService: ApplicationService,
  ) {
    // ?????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      this.centralizedControlId = queryParams.centralizedControlId;
      this.loopId = queryParams.loopId;
      this.loopCode = queryParams.loopCode;
      this.controlledObject = queryParams.controlledObject;
      this.sourceDataList.strategyType = this.languageTable.policyControl.lighting;
      this.sourceDataList.strategyRefList = [{
        refId: queryParams.loopId,
        refType: '3',
      }];
      this.loopDetailView(queryParams.loopId);
    });
    this.initTableConfig();
    this.refreshData();
  }

  /***
   * ??????????????????
   */
  private loopDetailView(loopId: string): void {
    // ??????????????????
    this.$facilityForCommonService.queryLoopDetail({loopId: loopId}).subscribe((result: ResultModel<LoopViewDetailModel>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.createTime) {
          result.data.createTime = CommonUtil.dateFmt(ApplicationFinalConst.dateType, new Date(result.data.createTime));
        }
        this.loopData = result.data;
        this.userName = this.loopData.createUser;
        this.loopData.loopType =  CommonUtil.codeTranslate(LoopTypeEnum, this.$nzI18n, this.loopData.loopType, LanguageEnum.facility) as any;
        // ???????????????????????? ?????????????????????
        if (this.loopData && this.loopData.loopDeviceRespList) {
          const baseInfoList = this.loopData.loopDeviceRespList.map(item => {
            return {
              positionBase: item.positionBase,
              deviceType: item.deviceType,
              deviceStatus: item.deviceStatus
            };
          });
          // ????????????
          this.thumbnail.loopDrawLine(this.loopData.loopDeviceRespList);
          // ?????????????????????
          this.thumbnail.moreMakeMarKer(baseInfoList);
        }
      }
    });
  }

  /**
   * ??????
   */
  public ngOnDestroy(): void {
    this.deviceTypeTemp = null;
    this.deviceStatusTemp = null;
    this.thumbnail = null;
  }

  /**
   * ??????
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
      outHeight: 108,
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: false,
      showSizeChanger: false,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        { // ????????????
          title: this.language.deviceName_a, key: 'deviceName',
          width: 150,
          configurable: false,
          searchable: false,
          isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ????????????
          title: this.language.deviceType_a, key: 'deviceType', width: 150,
          configurable: false,
          searchable: false,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          searchConfig: {type: 'input'},
        },
        { // ??????
          title: this.language.deviceModel,
          key: 'deviceModel',
          width: 120,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.equipmentQuantity,
          key: 'equipmentQuantity',
          width: 150,
          configurable: false,
          searchable: false,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // ????????????
          title: this.language.deviceStatus_a,
          key: 'deviceStatus',
          width: 150,
          type: 'render',
          renderTemplate: this.deviceStatusTemp,
          configurable: false,
          searchable: false,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.language.address,
          key: 'address',
          width: 150,
          configurable: false,
          searchable: false,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          title: this.language.operate,
          searchable: false,
          searchConfig: {type: 'operate'},
          key: '',
          width: 150,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        { // ????????????
          text: this.language.moveOutOfTheLoop,
          permissionCode: '09-1-2-3-1-1',
          needConfirm: true,
          canDisabled: true,
          confirmContent: this.assetLanguage.moveOutLoopBeforeTip,
          className: 'fiLink-move-out',
          handle: (data: FacilityListModel) => {
            const moveOutParam = {
              loopIds: [this.loopId],
              deviceIds: [data.deviceId],
            };
            this.moveOutLoop(moveOutParam);
          },
        },
      ],
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
    };
  }

  /**
   * ????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.bizCondition = {loopId: this.loopId};
    this.$facilityForCommonService.queryLoopDevicePageByLoopId(this.queryCondition)
      .subscribe((result: ResultModel<FacilityListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.dataSet = result.data || [];
        this.dataSet.forEach((item: FacilityListModel) => {
          // ????????????????????????
          item.iconClass = CommonUtil.getFacilityIconClassName(item.deviceType);
          // ???????????????????????????????????????
          item.deviceStatusIconClass = CommonUtil.getDeviceStatusIconClass(item.deviceStatus).iconClass;
          item.deviceStatusColorClass = CommonUtil.getDeviceStatusIconClass(item.deviceStatus).colorClass;
        });
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ????????????
   */
  private moveOutLoop(moveOutParam: MoveInOrOutModel): void {
    this.$facilityForCommonService.moveOutLoop(moveOutParam).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.assetLanguage.moveOutLoopSucceededTip);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ??????/??????
   * @ param type
   */
  public pullGate(type): void {
    const loopList = [{equipmentId: this.centralizedControlId, loopCode: this.loopCode}];
    const params: DistributeModel = {
      commandId: type,
      equipmentIds: [this.centralizedControlId],
      param: {
        loopList: loopList
      }
    };
    const instructConfig = new InstructConfig(this.$applicationService, this.$nzI18n, this.$message);
    instructConfig.instructDistribute(params);
  }

}
