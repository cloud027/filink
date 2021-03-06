import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {ColumnConfig, TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ApplicationService} from '../../../share/service/application.service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ApplicationFinalConst, RouterJumpConst, SwitchActionConst} from '../../../share/const/application-system.const';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {SliderValueConst} from '../../../share/const/slider.const';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {GroupListModel} from '../../../share/model/equipment.model';
import {DistributeModel} from '../../../share/model/distribute.model';
import {Router} from '@angular/router';
import {TableColumnConfig} from '../../../share/config/table-column.config';
import {PolicyEnum} from '../../../share/enum/policy.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {FilterValueConst} from '../../../share/const/filter.const';
import {BroadcastGroupTableEnum, BroadcastTableEnum, CallGroupTableEnum, LightGroupTableEnum, ReleaseGroupTableEnum} from '../../../share/enum/auth.code.enum';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {SelectTableEquipmentChangeService} from '../../../share/service/select-table-equipment-change.service';
import {SelectFacilityChangeService} from '../../../share/service/select-facility-change.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {CallTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {EnergyApiService} from '../../../../energy/share/service/energy/energy-api.service';

/**
 * ????????????-??????????????????
 */
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
  // ?????????????????????????????????
  @Input() groupType: string = '';
  // ?????????????????????
  @Input() tableColumn: TableConfigModel;
  // ????????????????????????
  @Output() selectDataChange = new EventEmitter();
  // ????????????????????????
  public dataSet: GroupListModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  public audioPageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public dimmingLight: GroupListModel[] = [];
  // ??????????????????
  public sliderValue = SliderValueConst;
  // ???????????????
  public language: OnlineLanguageInterface;
  // ?????????????????????
  public languageTable: ApplicationInterface;
  // ??????????????????
  public isBrightness: boolean = false;
  // ?????????
  public dimmingLightValue: number = 0;
  // ??????????????????
  public groupColumnConfig: ColumnConfig[] = [];
  // ???????????????
  public destroy$ = new Subject<void>();
  // ?????????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ???????????????????????????
  public volumeList: GroupListModel[] = [];
  public selectedEquipmentData: GroupListModel[] = [];
  public equipmentList = [];
  // ??????????????????
  public recordEquipmentList = [];
  public isVolume: boolean = false;
  public isOnline: boolean = false;
  public isInsert: boolean = false;
  public sourceId: string;
  public volumeValue: number = 0;
  public onlineVolumeValue: number = 0;
  public insertType: number = 1;
  public audioQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public radioStatus: boolean = false;
  public isStop: boolean = false;
  private savePlanThrottle: boolean = false;
  private insertVolumeValue: number;

  constructor(
    // ???????????????
    private $nzI18n: NzI18nService,
    // ??????
    private $router: Router,
    // ??????
    private $message: FiLinkModalService,
    private $energyApiService: EnergyApiService,
    // ????????????
    private $applicationService: ApplicationService,
    private $selectTableEquipmentChangeService: SelectTableEquipmentChangeService,
    private $selectFacilityChangeService: SelectFacilityChangeService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {
    // ?????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   *?????????
   */
  public ngOnInit(): void {
    if (!this.tableColumn) {
      this.initTableConfig();
    } else {
      this.tableConfig = this.tableColumn;
    }
    // ??????????????????????????????
    this.$selectFacilityChangeService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.equipmentIds && value.equipmentIds.length) {
        // ??????????????????????????????
        this.queryCondition.filterConditions = [new FilterCondition('equipmentIds', OperatorEnum.in, value.equipmentIds)];
      } else {
        this.queryCondition.filterConditions = [];
      }
      this.refreshData();
    });
    this.refreshData();
    // ?????????????????????
    this.queryEquipmentList();
  }

  ngOnDestroy(): void {
    // ????????????
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * ????????????
   * @ param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ????????????
   */
  public handleCancel(): void {
    this.isBrightness = false;
    // ???????????????
    this.dimmingLightValue = 0;
    this.volumeValue = 0;
    this.onlineVolumeValue = 0;
    this.insertVolumeValue = 0;
    this.isVolume = false;
    this.isOnline = false;
    this.isInsert = false;
  }

  /**
   * ????????????
   */
  public handleOk(): void {
    const params = {
      groupIds: this.dimmingLight.map(item => item.groupId),
      commandId: ControlInstructEnum.setBrightness,
      param: {
        lightnessNum: this.dimmingLightValue
      }
    };
    this.isBrightness = false;
    this.groupControl(params);
  }


  /**
   * ???????????????
   */
  public handleColumn(): void {
    this.groupColumnConfig = TableColumnConfig.groupColumnConfig(this.language, this.languageTable, true);
    this.groupColumnConfig.unshift({type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62});
  }

  /**
   * ????????????
   * @ param params
   */
  public groupControl(params: DistributeModel): void {
    // ?????????????????????????????????????????????
    this.checkEquipmentMode(params.groupIds).then(resolve => {
      if (resolve.code === ResultCodeEnum.success) {
        // ????????????????????????
        this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            // ??????????????????????????????
            this.$message.success(`${this.languageTable.contentList.distribution}!`);
            this.isBrightness = false;
            this.dimmingLightValue = 0;
            this.refreshData();
          } else {
            // ????????????????????????????????????
            this.$message.error(res.msg);
          }
        });
      } else {
        // ????????????????????????????????????
        this.$message.error(resolve.msg);
      }
    });
  }

  /**
   * ????????????
   * @ param data ???????????????
   * @ param type ???????????????
   */
  public switchLight(data: GroupListModel[], type: string): void {
    const params = {
      groupIds: data.map(item => item.groupId),
      commandId: type === SwitchActionConst.open ? ControlInstructEnum.turnOn : ControlInstructEnum.turnOff,
      param: {}
    };
    this.groupControl(params);
  }

  /**
   * ????????????
   */
  public handEquipmentOperation(data: GroupListModel): void {
    let path;
    if (this.groupType === ApplicationFinalConst.release) {
      path = RouterJumpConst.releaseGroupDetails;
    } else if (this.groupType === ApplicationFinalConst.broadcast) {
      path = RouterJumpConst.broadcastGroupDetails;
    } else if (this.groupType === ApplicationFinalConst.call) {
      path = RouterJumpConst.callGroupDetails;
    } else {
      path = RouterJumpConst.groupDetails;
    }
    this.$router.navigate([path], {
      queryParams: {
        groupId: data.groupId,
        groupName: data.groupName,
        remark: data.remark
      }
    }).then();
  }

  /**
   * ???????????????
   * @ param event
   */
  public handleSlider(event: number): void {
    this.dimmingLightValue = event;
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    const url = this.$router.url;
    let primaryKey;
    if (url.includes(ApplicationFinalConst.lighting)) {
      primaryKey = LightGroupTableEnum;
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      primaryKey = BroadcastGroupTableEnum;
    } else if (url.includes(ApplicationFinalConst.call)) {
      primaryKey = CallGroupTableEnum;
    } else {
      primaryKey = ReleaseGroupTableEnum;
    }
    this.handleColumn();
    this.tableConfig = {
      outHeight: 108,
      isDraggable: true,
      primaryKey: primaryKey.primaryKey,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      columnConfig: this.groupColumnConfig,
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        // ???
        {
          text: this.languageTable.equipmentTable.switch,
          needConfirm: true,
          canDisabled: true,
          permissionCode: primaryKey.primaryOpenKey,
          btnType: 'special',
          iconClassName: 'fiLink-open',
          confirmContent: `${this.languageTable.equipmentTable.confirmOpen}?`,
          handle: (data: GroupListModel[]) => {
            this.switchLight(data, SwitchActionConst.open);
          }
        },
        // ???
        {
          text: this.languageTable.equipmentTable.shut,
          needConfirm: true,
          canDisabled: true,
          permissionCode: primaryKey.primaryShutKey,
          btnType: 'special',
          iconClassName: 'fiLink-shut-off',
          confirmContent: `${this.languageTable.equipmentTable.confirmClose}?`,
          handle: (data: GroupListModel[]) => {
            this.switchLight(data, SwitchActionConst.close);
          }
        },
      ],
      moreButtons: [
        // ??????
        {
          text: this.languageTable.equipmentTable.upElectric,
          iconClassName: 'fiLink-up-electric disabled-icon',
          canDisabled: true,
          disabled: true,
          permissionCode: primaryKey.primaryUpKey,
          handle: () => {
          }
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.downElectric,
          iconClassName: 'fiLink-down-electric disabled-icon',
          canDisabled: true,
          disabled: true,
          permissionCode: primaryKey.primaryDownKey,
          handle: () => {
          }
        },
        // ????????????
        {
          text: this.languageTable.equipmentTable.light,
          canDisabled: true,
          permissionCode: primaryKey.primaryLightKey,
          iconClassName: 'fiLink-light',
          handle: (data: GroupListModel[]) => {
            this.dimmingLight = data;
            this.isBrightness = true;
          }
        },
      ],
      operation: [
        // ??????
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: primaryKey.primaryDetailKey,
          handle: (data: GroupListModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.upElectric,
          className: 'fiLink-up-electric disabled-icon',
          permissionCode: primaryKey.primaryUpKey,
          handle: () => {
          },
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.downElectric,
          className: 'fiLink-down-electric disabled-icon',
          permissionCode: primaryKey.primaryDownKey,
          handle: () => {
          },
        },
        // ???
        {
          text: this.languageTable.equipmentTable.switch,
          className: 'fiLink-open',
          needConfirm: true,
          permissionCode: primaryKey.primaryOpenKey,
          confirmContent: `${this.languageTable.equipmentTable.confirmOpen}?`,
          handle: (currentIndex: GroupListModel) => {
            this.switchLight([currentIndex], SwitchActionConst.open);
          }
        },
        // ???
        {
          text: this.languageTable.equipmentTable.shut,
          className: 'fiLink-shut-off',
          needConfirm: true,
          permissionCode: primaryKey.primaryShutKey,
          confirmContent: `${this.languageTable.equipmentTable.confirmClose}?`,
          handle: (currentIndex: GroupListModel) => {
            this.switchLight([currentIndex], SwitchActionConst.close);
          }
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.light,
          className: 'fiLink-light',
          permissionCode: primaryKey.primaryLightKey,
          handle: (data: GroupListModel) => {
            this.dimmingLight = [data];
            this.queryEquipmentInfo(data);
          },
        }
      ],
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
      }
    };
    if (url.includes(ApplicationFinalConst.broadcast)) {
      this.tableConfig.topButtons = [
        // ??????
        {
          text: this.languageTable.equipmentTable.insertBroadcast,
          className: 'fiLink-filink-chabo-icon',
          canDisabled: true,
          disabled: false,
          permissionCode: BroadcastTableEnum.primaryInsertKey,
          handle: (data) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // ???????????????  ??????????????????
            if (d) {
              this.$message.warning('??????????????????????????????');
              return;
            }
            this.selectedEquipmentData = data;
            this.isInsert = true;
            this.insertVolumeValue = 0;
          }
        },
        // ????????????
        {
          text: this.languageTable.equipmentTable.onlineBroadcast,
          className: 'fiLink-filink-xianchangguangbo-icon',
          canDisabled: true,
          disabled: false,
          permissionCode: BroadcastTableEnum.primaryOnline,
          handle: (data: GroupListModel[]) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // ???????????????  ??????????????????
            if (d) {
              this.$message.warning('??????????????????????????????');
              return;
            }
            this.equipmentList = data;
            this.isOnline = true;
          }
        },
      ];
      this.tableConfig.moreButtons = [
        // ??????
        {
          text: this.languageTable.equipmentTable.volume,
          iconClassName: 'fiLink-filink-yinliang-icon1',
          canDisabled: true,
          disabled: false,
          permissionCode: BroadcastTableEnum.primaryVolume,
          handle: (data: GroupListModel[]) => {
            this.isVolume = true;
            this.volumeList = data;
            this.volumeValue = 0;
          }
        },
        // ????????????
        {
          text: this.languageTable.equipmentTable.stopBroadcast,
          className: 'fiLink-suspend',
          canDisabled: true,
          disabled: false,
          permissionCode: BroadcastTableEnum.primaryShutKey,
          handle: (data: GroupListModel[]) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // ???????????????  ??????????????????
            if (d) {
              this.$message.warning('??????????????????????????????');
              return;
            }
            const params = {
              commandId: ControlInstructEnum.broadcastStop,
              groupIds: data.map(item => item.groupId),
              param: {}
            };
            this.instructDistribute(params);
          }
        },
      ];
      this.tableConfig.operation = [
        // ??????
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: BroadcastGroupTableEnum.primaryDetail,
          handle: (data: GroupListModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.insertBroadcast,
          className: 'fiLink-filink-chabo-icon',
          permissionCode: BroadcastGroupTableEnum.primaryInsertKey,
          handle: (data: GroupListModel) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // ???????????????  ??????????????????
            if (d) {
              this.$message.warning('??????????????????????????????');
              return;
            }
            this.selectedEquipmentData = [data];
            this.isInsert = true;
            this.insertVolumeValue = 0;
          },
        },
        // ????????????
        {
          text: this.languageTable.equipmentTable.onlineBroadcast,
          className: 'fiLink-filink-xianchangguangbo-icon',
          permissionCode: BroadcastGroupTableEnum.primaryOnline,
          handle: (data: GroupListModel) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // ???????????????  ??????????????????
            if (d) {
              this.$message.warning('??????????????????????????????');
              return;
            }
            this.equipmentList = [data];
            this.isOnline = true;
          },
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.volume,
          className: 'fiLink-filink-yinliang-icon1',
          permissionCode: BroadcastGroupTableEnum.primaryVolume,
          handle: (data: GroupListModel) => {
            this.isVolume = true;
            this.volumeList = [data];
            // TODO ?????????????????????????????????
            // this.queryBroadcastVolumeById(data.sequenceId);
          },
        },
        // ????????????
        {
          text: this.languageTable.equipmentTable.stopBroadcast,
          className: 'fiLink-suspend',
          permissionCode: BroadcastGroupTableEnum.primaryShutKey,
          handle: (data: GroupListModel) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // ???????????????  ??????????????????
            if (d) {
              this.$message.warning('??????????????????????????????');
              return;
            }
            const params = {
              commandId: ControlInstructEnum.broadcastStop,
              groupIds: [data.groupId],
              param: {}
            };
            this.instructDistribute(params);
          },
        },
      ];
    } else if (url.includes(ApplicationFinalConst.call)) {
      this.tableConfig.topButtons = [
        // ?????????????????????????????????????????????
        {
          text: this.languageTable.equipmentTable.call,
          needConfirm: true,
          canDisabled: true,
          disabled: true,
          // permissionCode: CallGroupTableEnum.primaryCallKey,
          permissionCode: '000000',
          iconClassName: 'fiLink-filink-jianting-icon',
          btnType: 'special',
          confirmContent: `${this.languageTable.equipmentTable.confirmCall}?`,
          handle: (data: GroupListModel[]) => {
            const params = {
              commandId: ControlInstructEnum.callStart,
              groupIds: data.map(item => item.groupId),
              param: {}
            };
            this.instructDistribute(params);
          }
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.monitor,
          needConfirm: true,
          canDisabled: true,
          disabled: true,
          // permissionCode: CallGroupTableEnum.primaryListenKey,
          permissionCode: '000000',
          iconClassName: 'fiLink-filink-jianting-icon',
          btnType: 'special',
          confirmContent: `${this.languageTable.equipmentTable.confirmMonitor}?`,
          handle: (data: GroupListModel[]) => {
            const params = {
              commandId: ControlInstructEnum.callMonitor,
              groupIds: data.map(item => item.groupId),
              param: {}
            };
            this.instructDistribute(params);
          }
        },
      ];
      this.tableConfig.moreButtons = [];
      this.tableConfig.operation = [
        // ??????
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: CallGroupTableEnum.primaryDetail,
          handle: (data: GroupListModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.call,
          needConfirm: true,
          // permissionCode: CallGroupTableEnum.primaryCallKey,
          permissionCode: '000000',
          className: 'fiLink-filink-hujiao-icon',
          confirmContent: `${this.languageTable.equipmentTable.confirmCall}?`,
          handle: (data: GroupListModel) => {
            const params = {
              commandId: ControlInstructEnum.callStart,
              groupIds: [data.groupId],
              param: {}
            };
            this.instructDistribute(params);
          }
        },
        // ??????
        {
          text: this.languageTable.equipmentTable.monitor,
          needConfirm: true,
          // permissionCode: CallGroupTableEnum.primaryListenKey,
          permissionCode: '000000',
          className: 'fiLink-filink-jianting-icon',
          confirmContent: `${this.languageTable.equipmentTable.confirmMonitor}?`,
          handle: (data: GroupListModel) => {
            const params = {
              commandId: ControlInstructEnum.callMonitor,
              groupIds: [data.groupId],
              param: {}
            };
            this.instructDistribute(params);
          }
        },
      ];
    }
  }

  /**
   * ????????????????????????????????????
   */
  public getPositionMapByGroupIds(event): void {
    this.selectDataChange.emit(event);
    // ??????????????????
    const groupIds = [];
    if (event.length > 0) {
      event.forEach(item => {
        groupIds.push(item.groupId);
      });
    } else {
      return;
    }
    // ??????????????????????????????
    this.$selectTableEquipmentChangeService.eventEmit.emit({type: 'groupId', groupIds: groupIds});
  }


  /**
   * ??????????????????
   */
  private defaultQuery() {
    const url = this.$router.url;
    const equipmentFlag = this.queryCondition.filterConditions.some(item => item.filterField === PolicyEnum.equipmentType);
    if (url.includes(ApplicationFinalConst.lighting)) {
      if (!equipmentFlag) {
        const equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.lightingFilter);
        this.queryCondition.filterConditions.push(equipmentTypes);
      }
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      if (!equipmentFlag) {
        const equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.broadcastFilter);
        this.queryCondition.filterConditions.push(equipmentTypes);
      }
    } else if (url.includes(ApplicationFinalConst.call)) {
      if (!equipmentFlag) {
        const equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.callFilter);
        this.queryCondition.filterConditions.push(equipmentTypes);
      }
    } else {
      if (!equipmentFlag) {
        const equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.informationFilter);
        this.queryCondition.filterConditions.push(equipmentTypes);
      }
    }
  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.defaultQuery();
    this.$applicationService.queryEquipmentGroupInfoList(this.queryCondition)
      .subscribe((res: ResultModel<GroupListModel[]>) => {
        if (res.code === ResultCodeEnum.success) {
          this.tableConfig.isLoading = false;
          const {data, totalCount, pageNum, size} = res;
          this.dataSet = data;
          this.pageBean.Total = totalCount;
          this.pageBean.pageIndex = pageNum;
          this.pageBean.pageSize = size;
        } else {
          this.$message.error(res.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * ??????????????????
   * ?????????????????????????????????????????????
   */
  private queryEquipmentInfo(data: GroupListModel): void {
    const queryBody = {
      groupIds: [data.groupId]
    };
    this.$applicationService.queryLightNumberByGroupId(queryBody)
      .subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          // ?????????????????????????????????????????????
          this.dimmingLightValue = res.data[0].groupLight;
          this.isBrightness = true;
        } else {
          this.$message.error(res.msg);
        }
      });
  }

  /**
   * ?????????????????????????????????
   */
  private checkEquipmentMode(data): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.checkEquipmentMode({groupEquipmentIdList: data}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }

  /**
   * ??????????????????????????????
   * @ param event
   */
  public handleVolumeSlider(event, type) {
    if (type === 0) {
      // ????????????
      this.volumeValue = event;
    } else {
      // ??????
      this.onlineVolumeValue = event;
    }
  }

  public handleSource(event: string) {
    this.sourceId = event;
  }

  /**
   * ????????????
   * @ param params
   */
  public instructDistribute(params: DistributeModel, type?: string): void {
    this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
        this.isBrightness = false;
        this.isVolume = false;
        this.dimmingLightValue = 0;
        this.volumeValue = 0;
        this.savePlanThrottle = false;
        this.refreshData();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * ???????????? ???????????????
   */
  public switchOnlineOperate(type) {
    // ??????????????????????????????
    if (this.sourceId) {
      const params = {
        commandId: ControlInstructEnum.broadcastOnline,
        groupIds: this.equipmentList.map(item => item.groupId),
        param: {
          sourceId: this.sourceId, // ??????????????????id  sequenceId
          isStop: type, //  0 - ??????   1 - ??????.
        }
      };
      if (type === '1') {
        params.commandId = ControlInstructEnum.broadcastOnlineStop;
      }
      if (this.savePlanThrottle) {
        return;
      }
      // ?????????????????????????????????
      this.savePlanThrottle = true;
      this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          const volumeParams = {
            commandId: ControlInstructEnum.broadcastVolume,
            groupIds: this.equipmentList.map(item => item.groupId),
            param: {
              volume: this.onlineVolumeValue
            }
          };
          this.instructDistribute(volumeParams, type);
          this.radioStatus = type !== '1';
          this.isStop = type !== '1';
          // ??????????????????
          sessionStorage.setItem('radioData', JSON.stringify(params));
          if (type === '1') {
            sessionStorage.removeItem('radioData');
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      this.$message.warning(this.language.selectDevice);
    }
  }

  public queryEquipmentList() {
    this.audioQueryCondition.filterConditions = [
      {
        filterValue: FilterValueConst.callFilter,
        filterField: 'equipmentType',
        operator: 'in'
      },
      {
        filterValue: CallTypeEnum.microphone,
        filterField: 'equipmentModelType',
        operator: 'eq'
      }
    ];
    this.audioQueryCondition.pageCondition.pageSize = 10;
    this.audioQueryCondition.pageCondition.pageNum = 1;
    this.$applicationService.equipmentListByPage(this.audioQueryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const {totalCount, pageNum, size, data} = res;
        this.recordEquipmentList = data || [];
        this.audioPageBean.Total = totalCount;
        this.audioPageBean.pageIndex = pageNum;
        this.audioPageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  public handleCloseOnline() {
    if (!this.sourceId) {
      this.isOnline = false;
    } else {
      this.isOnline = false;
      if (this.radioStatus) {
        this.$energyApiService.messageTopic.next({
          type: 2, // ????????????  1???????????????  2???????????????
          radioId: this.sourceId,
          radioName: this.equipmentList.map(item => item.groupName).toString(),
        });
      }
    }
    this.sourceId = null;
    this.isStop = false;
  }

  /**
   * ????????????
   */
  public confirmVolume(): void {
    const params: DistributeModel = {
      groupIds: this.volumeList.map(item => item.groupId),
      commandId: ControlInstructEnum.broadcastVolumeSave,
      param: {
        volume: this.volumeValue
      }
    };
    this.isVolume = false;
    this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        const volumeParams = {
          commandId: ControlInstructEnum.broadcastVolume,
          groupIds: this.volumeList.map(item => item.groupId),
          param: {
            volume: this.volumeValue
          }
        };
        this.instructDistribute(volumeParams);
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
