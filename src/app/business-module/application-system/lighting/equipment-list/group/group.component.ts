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
 * 设备列表-分组列表页面
 */
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit, OnDestroy {
  // 区分照明，信息屏，安防
  @Input() groupType: string = '';
  // 配置表格配置项
  @Input() tableColumn: TableConfigModel;
  // 勾选分组数据改变
  @Output() selectDataChange = new EventEmitter();
  // 存储分组数据集合
  public dataSet: GroupListModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel();
  public audioPageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 批量亮度集合
  public dimmingLight: GroupListModel[] = [];
  // 滑块值的常量
  public sliderValue = SliderValueConst;
  // 表格多语言
  public language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 控制亮度显隐
  public isBrightness: boolean = false;
  // 亮度值
  public dimmingLightValue: number = 0;
  // 分组表格配置
  public groupColumnConfig: ColumnConfig[] = [];
  // 关闭订阅流
  public destroy$ = new Subject<void>();
  // 表格初始化条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 批量选中的音量数据
  public volumeList: GroupListModel[] = [];
  public selectedEquipmentData: GroupListModel[] = [];
  public equipmentList = [];
  // 录音设备集合
  public recordEquipmentList = [];
  public isVolume: boolean = false;
  public isOnline: boolean = false;
  public isInsert: boolean = false;
  public sourceId: string;
  public volumeValue: number = 0;
  public onlineVolumeValue: number = 0;
  public insertType: number = 1;
  public audioQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 广播状态
  public radioStatus: boolean = false;
  public isStop: boolean = false;
  private savePlanThrottle: boolean = false;
  private insertVolumeValue: number;

  constructor(
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 路由
    private $router: Router,
    // 提示
    private $message: FiLinkModalService,
    private $energyApiService: EnergyApiService,
    // 接口服务
    private $applicationService: ApplicationService,
    private $selectTableEquipmentChangeService: SelectTableEquipmentChangeService,
    private $selectFacilityChangeService: SelectFacilityChangeService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   *初始化
   */
  public ngOnInit(): void {
    if (!this.tableColumn) {
      this.initTableConfig();
    } else {
      this.tableConfig = this.tableColumn;
    }
    // 监听地图选中设备变化
    this.$selectFacilityChangeService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.equipmentIds && value.equipmentIds.length) {
        // 联动列表筛选条件改变
        this.queryCondition.filterConditions = [new FilterCondition('equipmentIds', OperatorEnum.in, value.equipmentIds)];
      } else {
        this.queryCondition.filterConditions = [];
      }
      this.refreshData();
    });
    this.refreshData();
    // 查询话筒设备；
    this.queryEquipmentList();
  }

  ngOnDestroy(): void {
    // 取消订阅
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 分页查询
   * @ param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 取消操作
   */
  public handleCancel(): void {
    this.isBrightness = false;
    // 重置为初始
    this.dimmingLightValue = 0;
    this.volumeValue = 0;
    this.onlineVolumeValue = 0;
    this.insertVolumeValue = 0;
    this.isVolume = false;
    this.isOnline = false;
    this.isInsert = false;
  }

  /**
   * 亮度调整
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
   * 列的配置项
   */
  public handleColumn(): void {
    this.groupColumnConfig = TableColumnConfig.groupColumnConfig(this.language, this.languageTable, true);
    this.groupColumnConfig.unshift({type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62});
  }

  /**
   * 分组指令
   * @ param params
   */
  public groupControl(params: DistributeModel): void {
    // 校验设备的模式是否可以下发指令
    this.checkEquipmentMode(params.groupIds).then(resolve => {
      if (resolve.code === ResultCodeEnum.success) {
        // 模式可以下发指令
        this.$applicationService.groupControl(params).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            // 弹出指令下发成功提示
            this.$message.success(`${this.languageTable.contentList.distribution}!`);
            this.isBrightness = false;
            this.dimmingLightValue = 0;
            this.refreshData();
          } else {
            // 弹出指令下发错误结果提示
            this.$message.error(res.msg);
          }
        });
      } else {
        // 指令异常弹出指令模式提示
        this.$message.error(resolve.msg);
      }
    });
  }

  /**
   * 设备开关
   * @ param data 选中的数据
   * @ param type 区分开和关
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
   * 设备详情
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
   * 改变滑块值
   * @ param event
   */
  public handleSlider(event: number): void {
    this.dimmingLightValue = event;
  }

  /**
   * 初始化表格配置
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
        // 开
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
        // 关
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
        // 上电
        {
          text: this.languageTable.equipmentTable.upElectric,
          iconClassName: 'fiLink-up-electric disabled-icon',
          canDisabled: true,
          disabled: true,
          permissionCode: primaryKey.primaryUpKey,
          handle: () => {
          }
        },
        // 下电
        {
          text: this.languageTable.equipmentTable.downElectric,
          iconClassName: 'fiLink-down-electric disabled-icon',
          canDisabled: true,
          disabled: true,
          permissionCode: primaryKey.primaryDownKey,
          handle: () => {
          }
        },
        // 更多操作
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
        // 详情
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: primaryKey.primaryDetailKey,
          handle: (data: GroupListModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // 上电
        {
          text: this.languageTable.equipmentTable.upElectric,
          className: 'fiLink-up-electric disabled-icon',
          permissionCode: primaryKey.primaryUpKey,
          handle: () => {
          },
        },
        // 下电
        {
          text: this.languageTable.equipmentTable.downElectric,
          className: 'fiLink-down-electric disabled-icon',
          permissionCode: primaryKey.primaryDownKey,
          handle: () => {
          },
        },
        // 开
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
        // 关
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
        // 亮度
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
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      }
    };
    if (url.includes(ApplicationFinalConst.broadcast)) {
      this.tableConfig.topButtons = [
        // 插播
        {
          text: this.languageTable.equipmentTable.insertBroadcast,
          className: 'fiLink-filink-chabo-icon',
          canDisabled: true,
          disabled: false,
          permissionCode: BroadcastTableEnum.primaryInsertKey,
          handle: (data) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // 如果缓存有  说明已有广播
            if (d) {
              this.$message.warning('已有广播正在广播中！');
              return;
            }
            this.selectedEquipmentData = data;
            this.isInsert = true;
            this.insertVolumeValue = 0;
          }
        },
        // 现场广播
        {
          text: this.languageTable.equipmentTable.onlineBroadcast,
          className: 'fiLink-filink-xianchangguangbo-icon',
          canDisabled: true,
          disabled: false,
          permissionCode: BroadcastTableEnum.primaryOnline,
          handle: (data: GroupListModel[]) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // 如果缓存有  说明已有广播
            if (d) {
              this.$message.warning('已有广播正在广播中！');
              return;
            }
            this.equipmentList = data;
            this.isOnline = true;
          }
        },
      ];
      this.tableConfig.moreButtons = [
        // 音量
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
        // 停止播放
        {
          text: this.languageTable.equipmentTable.stopBroadcast,
          className: 'fiLink-suspend',
          canDisabled: true,
          disabled: false,
          permissionCode: BroadcastTableEnum.primaryShutKey,
          handle: (data: GroupListModel[]) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // 如果缓存有  说明已有广播
            if (d) {
              this.$message.warning('已有广播正在广播中！');
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
        // 详情
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: BroadcastGroupTableEnum.primaryDetail,
          handle: (data: GroupListModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // 插播
        {
          text: this.languageTable.equipmentTable.insertBroadcast,
          className: 'fiLink-filink-chabo-icon',
          permissionCode: BroadcastGroupTableEnum.primaryInsertKey,
          handle: (data: GroupListModel) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // 如果缓存有  说明已有广播
            if (d) {
              this.$message.warning('已有广播正在广播中！');
              return;
            }
            this.selectedEquipmentData = [data];
            this.isInsert = true;
            this.insertVolumeValue = 0;
          },
        },
        // 现场广播
        {
          text: this.languageTable.equipmentTable.onlineBroadcast,
          className: 'fiLink-filink-xianchangguangbo-icon',
          permissionCode: BroadcastGroupTableEnum.primaryOnline,
          handle: (data: GroupListModel) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // 如果缓存有  说明已有广播
            if (d) {
              this.$message.warning('已有广播正在广播中！');
              return;
            }
            this.equipmentList = [data];
            this.isOnline = true;
          },
        },
        // 音量
        {
          text: this.languageTable.equipmentTable.volume,
          className: 'fiLink-filink-yinliang-icon1',
          permissionCode: BroadcastGroupTableEnum.primaryVolume,
          handle: (data: GroupListModel) => {
            this.isVolume = true;
            this.volumeList = [data];
            // 调用接口查询指定设备的
            // this.queryBroadcastVolumeById(data.sequenceId);
          },
        },
        // 停止播放
        {
          text: this.languageTable.equipmentTable.stopBroadcast,
          className: 'fiLink-suspend',
          permissionCode: BroadcastGroupTableEnum.primaryShutKey,
          handle: (data: GroupListModel) => {
            const d = JSON.parse(sessionStorage.getItem('radioData'));
            // 如果缓存有  说明已有广播
            if (d) {
              this.$message.warning('已有广播正在广播中！');
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
        // 呼叫，暂不支持批量操作，先灰显
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
        // 监听
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
        // 详情
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: CallGroupTableEnum.primaryDetail,
          handle: (data: GroupListModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // 呼叫
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
        // 监听
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
   * 分组列表勾选分组联动地图
   */
  public getPositionMapByGroupIds(event): void {
    this.selectDataChange.emit(event);
    // 表格勾选数据
    const groupIds = [];
    if (event.length > 0) {
      event.forEach(item => {
        groupIds.push(item.groupId);
      });
    } else {
      return;
    }
    // 发射表格勾选数据变化
    this.$selectTableEquipmentChangeService.eventEmit.emit({type: 'groupId', groupIds: groupIds});
  }


  /**
   * 默认查询条件
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
   * 刷新表格数据
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
   * 查询分组信息
   * 单个设备调整亮度时需要回显亮度
   */
  private queryEquipmentInfo(data: GroupListModel): void {
    const queryBody = {
      groupIds: [data.groupId]
    };
    this.$applicationService.queryLightNumberByGroupId(queryBody)
      .subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          // 单个设备调整亮度时需要回显亮度
          this.dimmingLightValue = res.data[0].groupLight;
          this.isBrightness = true;
        } else {
          this.$message.error(res.msg);
        }
      });
  }

  /**
   * 查询是手动控制还是自动
   */
  private checkEquipmentMode(data): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.checkEquipmentMode({groupEquipmentIdList: data}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }

  /**
   * 改变音量滑块值的变化
   * @ param event
   */
  public handleVolumeSlider(event, type) {
    if (type === 0) {
      // 音量弹窗
      this.volumeValue = event;
    } else {
      // 插播
      this.onlineVolumeValue = event;
    }
  }

  public handleSource(event: string) {
    this.sourceId = event;
  }

  /**
   * 指令接口
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
   * 现场广播 开始、停止
   */
  public switchOnlineOperate(type) {
    // 校验是否选择录音设备
    if (this.sourceId) {
      const params = {
        commandId: ControlInstructEnum.broadcastOnline,
        groupIds: this.equipmentList.map(item => item.groupId),
        param: {
          sourceId: this.sourceId, // 录音设备真实id  sequenceId
          isStop: type, //  0 - 开始   1 - 停止.
        }
      };
      if (type === '1') {
        params.commandId = ControlInstructEnum.broadcastOnlineStop;
      }
      if (this.savePlanThrottle) {
        return;
      }
      // 开启节流阀防止重复提交
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
          // 存储广播数据
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
          type: 2, // 广播类型  1：列表广播  2：分组广播
          radioId: this.sourceId,
          radioName: this.equipmentList.map(item => item.groupName).toString(),
        });
      }
    }
    this.sourceId = null;
    this.isStop = false;
  }

  /**
   * 音量调整
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
