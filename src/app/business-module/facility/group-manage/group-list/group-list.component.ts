import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {GroupApiService} from '../../share/service/group/group-api.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ProgramListModel} from '../../../../core-module/model/group/program-list.model';
import {InstructSendParamModel} from '../../../../core-module/model/group/instruct-send-param.model';
import {InstructSendRequestModel} from '../../../../core-module/model/group/instruct-send-request.model';
import {GroupListModel} from '../../../../core-module/model/group/group-list.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {ApplicationSystemForCommonService} from '../../../../core-module/api-service/application-system';
import {GroupTypeEnum} from '../../../../core-module/enum/group/group.enum';
import {MapEventModel} from '../../../../core-module/model/map-event.model';
import {FilinkMapEnum, MapEventTypeEnum, MapIconSizeEnum, MapTypeEnum} from '../../../../shared-module/enum/filinkMap.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {SelectGroupService} from '../../../../shared-module/service/index/select-group.service';
import {MAP_DEFAULT_HEIGHT_CONST, MAX_HEIGHT_EDGE_CONST, MIN_HEIGHT_CONST} from '../../../../core-module/const/facility/facility.const';
import {MapConfig} from '../../../../shared-module/component/map/map.config';
import {LoopApiService} from '../../share/service/loop/loop-api.service';
import {FacilityShowService} from '../../../../shared-module/service/index/facility-show.service';
import {MapDataModel} from '../../../../core-module/model/index/map-data-model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {DeviceAreaModel} from '../../../index/shared/model/device-area.model';
import {EquipmentAreaModel} from '../../../../core-module/model/index/equipment-area.model';
import {AlarmAreaModel} from '../../../index/shared/model/alarm-area.model';
import {IndexApiService} from '../../../index/service/index/index-api.service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {mapIconConfig} from '../../../../shared-module/service/map-service/map.config';
import {ConfigModel} from '../../../index/shared/model/config-model';
import {OperationService} from '../../../../shared-module/service/index/operation.service';
import {MapGroupCommonComponent} from '../../../../shared-module/component/map/map-group-common.component';
import {MapService} from '../../../../core-module/api-service/index/map';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {MapConfig as BMapConfig} from '../../../../shared-module/component/map/b-map.config';
import {ViewEnum} from '../../../../core-module/enum/index/index.enum';
import {PermissionConst} from '../../../../core-module/const/facility/permission.const';
declare const MAP_TYPE;
declare var $: any;

/**
 * 分组列表组件
 */
@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit, OnDestroy {
  // 地图
  @ViewChild('mainMap') mainMap: MapGroupCommonComponent;
  // 视图枚举
  public maintenanceView = ViewEnum;
  // 当前视图
  public viewIndex = ViewEnum.maintenanceView;
  // 分组列表数据集
  public dataSet: GroupListModel[] = [];
  // 分组分页
  public pageBean: PageModel = new PageModel();
  // 列表配置信息
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 国际化
  public language: FacilityLanguageInterface;
  // 公用国际化
  public commonLanguage: CommonLanguageInterface;
  // 资产管理国际化
  public assetLanguage: AssetManagementLanguageInterface;
  // 是否显示分组详情的弹框
  public showGroupViewDetail: boolean = false;
  // 是否显示分组控制弹框
  public showGroupControlView: boolean = false;
  public commonDisableFlag: boolean = false;
  // 节目信息
  public program: ProgramListModel = new ProgramListModel();
  // 当前分组数据
  public currentGroup: GroupListModel = new GroupListModel();
  // 操作指令枚举
  public controlInstructEnum = ControlInstructEnum;
  // 设备类型数组
  public equipmentTypes: string[] = [];
  // 分组ids
  private groupIds: string[] = [];
  // 是否隐藏地图变小化按钮
  public isShowUpIcon: boolean = true;
  // 是否显示地图变大的按钮
  public isShowDownIcon: boolean = true;
  // 地图配置
  public mapConfig: MapConfig;
  // 地图区域设施数据
  public data: MapDataModel[];
  // 设施图标大小
  public iconSize: string;
  // 区域中心点
  public centerPoint: string[];
  // 回路地图请求参数标识
  public areaFacilityByLoop: boolean = false;
  // 地图类型
  public mapType: FilinkMapEnum;
  // 地图框选的设施id集合
  public deviceIds: string[] = [];
  // 地图框选的设备类型集合
  public equipmentIds: string[] = [];
  // 地图是否显示分组变更按钮
  public isShowButton: boolean = false;
  // 鼠标拖拽默认起始位置
  public srcPositionY: number;
  // 是否隐藏列表部分
  public isShowTable: boolean = true;
  // 地图全屏最大高度
  public maxHeight: number;
  // 分组变更弹框是否展开
  public isVisible: boolean = false;
  // 拖拽最新高度隐藏
  public minHeight: number = MIN_HEIGHT_CONST;
  // 区域数据
  public areaData: string[];
  // 是否显示加载进度条
  public isShowProgressBar: boolean = false;
  // 进度条初始进度
  public percent: number;
  // 进度条增长百分比
  public increasePercent: number;
  // 进度条的定时器
  private scheduleTime: number;
  // 设施交集数据
  public facilityStoreData = [];
  // 设备交集数据
  public equipmentStoreData: string[];
  // 地图设施/设备类型
  public mapTypeEnum = MapTypeEnum;
  // 设施图层区域模型
  public deviceAreaModel: DeviceAreaModel = new DeviceAreaModel;
  // 设备图层区域模型
  public equipmentAreaModel: EquipmentAreaModel = new EquipmentAreaModel;
  // 设施图层区域告警模型
  public alarmAreaModel: AlarmAreaModel = new AlarmAreaModel;
  // 告警权限
  public roleAlarm: boolean = false;
  // 地图设施图标大小
  public facilityIconSizeValue: string;
  // 地图设施图标大小配置
  public facilityIconSizeConfig: ConfigModel[];
  // 框选列表数据集
  public groupChangeDataSet: object[] = [];
  // 设施/设备地图
  public selectMapType: MapTypeEnum = MapTypeEnum.facility;
  // 是否展示框选弹框
  public isShowGroupChange: boolean = false;
  // 缓存列表勾选的分组包含的设备或设施数据
  public facilityInGroup: any;
  // 存取地图渲染数据（为放大重新渲染用）
  private storeMapData: any;
  public initMapDevice: boolean = false;
  // 关闭订阅流
  private destroy$ = new Subject<void>();

  /**
   * 构造器
   */
  constructor(private $nzI18n: NzI18nService,
              private $groupApiService: GroupApiService,
              private $applicationCommonService: ApplicationSystemForCommonService,
              private $message: FiLinkModalService,
              private $modalService: NzModalService,
              private $selectGroupService: SelectGroupService,
              private $loopService: LoopApiService,
              private $facilityShowService: FacilityShowService,
              private $mapStoreService: MapStoreService,
              private $mapCoverageService: MapCoverageService,
              private $indexApiService: IndexApiService,
              private $mapService: MapService,
              private $OperationService: OperationService,
              private $router: Router,
              private $facilityForCommonService: FacilityForCommonService) {
  }

  mapShowRefresh = _.debounce(() => {
    this.queryHomeData();
  }, 200, {leading: false, trailing: true});

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.roleAlarm = SessionUtil.checkHasRole('02');
    this.mapType = MAP_TYPE;
    this.mapConfig = new MapConfig('index-map', this.mapType, mapIconConfig.defaultIconSize, []);
    // 初始化地图类型
    this.$mapStoreService.mapType = this.mapType;
    // 配置图标大小
    this.facilityIconSizeConfig = mapIconConfig.iconConfig;
    // 默认设施图标大小
    this.iconSize = mapIconConfig.defaultIconSize;
    // 设施点图标大小
    this.facilityIconSizeValue = mapIconConfig.defaultIconSize;
    // 设置默认图层
    this.$mapCoverageService.showCoverage = this.mapTypeEnum.facility;
    // 地图分层切换重新获取设施或设备数据
    this.$facilityShowService.subject.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.mapShowType) {
        // 切换图层清空地图数据
        if (this.mainMap.mapService.mapInstance) {
          this.mainMap.mapService.mapInstance.clearOverlays();
        }
        if (this.mainMap.mapService.markerClusterer) {
          this.mainMap.mapService.markerClusterer.clearMarkers();
        }
      }
      // 获取区域点防抖
      this.mapShowRefresh();
    });
    // 初始化表格
    this.initGroupTableConfig();
    // 刷新列表数据
    this.refreshData();
    // 框选数据通知注册
    this.selectGroupDataInit();
    // 初始数据处理
    this.handleInitData();
    // 获取地图配置
    this.getAllMapConfig();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 框选数据通知注册
   */
  public selectGroupDataInit(): void {
    this.$selectGroupService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.datas && value.showCoverage) {
        this.$mapCoverageService.showCoverage = value.showCoverage;
        if (value.showCoverage === MapTypeEnum.facility) { // 分层设施地图
          this.groupChangeDataSet = value.datas;
          this.selectMapType = MapTypeEnum.device;
        } else { // 分层设备地图
          this.selectMapType = MapTypeEnum.equipment;
          const equipmentData = [];
          value.datas.forEach(item => {
            equipmentData.push(item.equipmentList);
          });
          this.groupChangeDataSet = _.flattenDeep(equipmentData);
        }
        this.groupChangeDataSet.forEach(item => {
          item['checked'] = false;
        });
        // this.isShowGroupChange = true;
      }
    });
  }

  /**
   * 获取地图配置信息
   */
  getAllMapConfig() {
    // 获取全部设施的配置
    this.$mapService.getALLFacilityConfig().subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        // 更新设施图标
        if (result.data && result.data.deviceIconSize) {
          this.facilityIconSizeValue = result.data.deviceIconSize;
          this.$mapStoreService.facilityIconSize = result.data.deviceIconSize;
          this.iconSize = result.data.deviceIconSize;
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.$message.remove();
    });
  }

  /**
   * 初始化数据处理
   */
  private handleInitData(): void {
    // 地图相关配置
    this.mapType = FilinkMapEnum.baiDu;
    this.mapConfig = new MapConfig('group-map', this.mapType, MapIconSizeEnum.defaultIconSize, []);
    this.iconSize = MapIconSizeEnum.defaultIconSize;
    this.$selectGroupService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && !value.isShow) {
        if (!_.isEmpty(value.datas)) {
          if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
            // 先清空之前的框选数据
            if (!_.isEmpty(this.deviceIds)) {
              this.mainMap.selectMarkerId();
              this.deviceIds = [];
            }
            // 筛选出智慧功能杆子id集合
            this.deviceIds = value.datas.map(item => item.deviceId) || [];
            value.datas.forEach(v => {
              if (this.mainMap) {
                // 框选的高亮
                this.mainMap.selectMarkerId(v.deviceId);
              }
            });
            this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, this.deviceIds)];
          } else {
            // 先清空之前的框选数据
            if (!_.isEmpty(this.equipmentIds)) {
              this.mainMap.selectMarkerId();
              this.equipmentIds = [];
            }
            // 筛选出设备id集合
            this.equipmentIds = value.datas.map(item => item.equipmentId) || [];
            value.datas.forEach(v => {
              if (this.mainMap) {
                // 框选的高亮
                this.mainMap.selectMarkerId(v.equipmentId);
              }
            });
            this.queryCondition.filterConditions = [new FilterCondition('equipmentIds', OperatorEnum.in, this.equipmentIds)];
          }
        } else {
          this.queryCondition.filterConditions = [];
        }
        this.refreshData();
      }
    });
    // this.$selectGroupService.eventEmit.emit({isShow: this.isShowButton});
  }

  /**
   *  切换页面
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.refreshData();
  }

  /**
   *  开关控制
   */
  public onCommonControl(event: ControlInstructEnum): void {
    const body = new InstructSendRequestModel<{}>(event, [], {}, this.groupIds);
    this.handleSendInstruct(body, true);
  }

  /**
   *  照明控制指令
   */
  public onLightChangeValue(event: number): void {
    const body = new InstructSendRequestModel<{ lightnessNum: number }>(
      this.controlInstructEnum.dimming,
      [],
      {lightnessNum: event},
      this.groupIds,
    );
    this.handleSendInstruct(body, true);
  }

  /**
   * 信息屏的亮度
   */
  public onSlideScreenLightChange(event: number): void {
    const body = new InstructSendRequestModel<{ lightnessNum: number }>(
      this.controlInstructEnum.dimming,
      [],
      {lightnessNum: event},
      this.groupIds
    );
    this.handleSendInstruct(body);
  }

  /**
   *  信息屏声音
   */
  public onScreenVolumeChangeValue(event: number): void {
    const body = new InstructSendRequestModel<{ volumeNum: number }>(
      this.controlInstructEnum.setVolume,
      [],
      {volumeNum: event},
      this.groupIds
    );
    this.handleSendInstruct(body);
  }

  /**
   * 指令确定事件 回调
   * @param event 是否需要查询设备自动手动模式
   */

  /**
   *  同步播放
   */
  public onScreenPlay(event: InstructSendParamModel): void {
    if (!event) {
      this.$message.info(this.language.noProgram);
      return;
    }
    const body = new InstructSendRequestModel<InstructSendParamModel>(
      this.controlInstructEnum.screenPlay,
      [],
      event,
      this.groupIds
    );
    this.handleSendInstruct(body);
  }

  /**
   * 执行指令
   */
  private handleSendInstruct(body: InstructSendRequestModel<{}>, isNeedCheckMode = false): void {
    if (isNeedCheckMode) {
      // 需查询指令模式
      this.checkEquipmentMode().then(resolve => {
        if (resolve.code === ResultCodeEnum.success) {
          this.canHandleSendInstruct(body);
        } else {
          // 指令异常弹出指令模式提示,不再下发指令
          this.$message.error(resolve.msg);
        }
      });
    } else {
      this.canHandleSendInstruct(body);
    }
  }

  /**
   * 执行指令操作
   * @param body 执行指令的数据
   */
  private canHandleSendInstruct(body: InstructSendRequestModel<{}>): void {
    this.$applicationCommonService.groupControl(body).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.assetLanguage.instructHasSent);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   * 路由跳转
   */
  private routingJump(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 初始化列表参数
   */
  private initGroupTableConfig(): void {
    this.tableConfig = {
      primaryKey: '03-9',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 选择
          title: this.language.select,
          type: 'select',
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        {
          type: 'serial-number', title: this.language.serialNumber, width: 62,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 分组名称
          title: this.language.groupName,
          key: 'groupName',
          width: 430,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks,
          key: 'remark',
          isShowSort: true,
          configurable: false,
          width: 450,
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        { // 操作
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 130,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      topButtons: [
        { // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '03-9-1',
          handle: () => {
            this.routingJump('business/facility/group-detail/add', {});
          }
        },
        { // 删除
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-9-4',
          needConfirm: false,
          canDisabled: true,
          confirmContent: this.language.confirmDeleteData,
          handle: (data: GroupListModel[]) => {
            data = data.filter(v => v.groupType !== GroupTypeEnum.equipmentGroup);
            const ids = data.map(item => {
              return item.groupId;
            });
            if (_.isEmpty(ids)) {
              this.$message.info(this.language.pleaseSelectNotEquipmentGroup);
              this.refreshData();
              return;
            }
            this.handelDeleteGroup(ids);
          }
        },
        { // 控制
          permissionCode: '03-9-5',
          text: this.assetLanguage.groupControl,
          className: 'table-top-control-btn',
          iconClassName: 'fiLink-control',
          canDisabled: true,
          handle: (data: GroupListModel[]) => {
            this.groupIds = data.map(item => item.groupId);
            this.queryGroupRefEquipmentType();
            this.showGroupControlView = true;
          }
        }
      ],
      leftBottomButtons: [],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        { // 编辑
          permissionCode: '03-9-2',
          key: 'isNotEquipmentGroup',
          text: this.commonLanguage.edit, className: 'fiLink-edit',
          handle: (data: GroupListModel) => {
            this.routingJump('business/facility/group-detail/update',
              {queryParams: {groupId: data.groupId}});
          },
        },
        { // 分组详情
          permissionCode: '03-9-3',
          text: this.language.groupDetail, className: 'fiLink-view-detail',
          handle: (data: GroupListModel) => {
            this.currentGroup = data;
            this.showGroupViewDetail = true;
          },
        },
        { // 控制
          permissionCode: '03-9-5',
          text: this.language.control, className: 'fiLink-control',
          handle: (data: GroupListModel) => {
            // 查询节目本次先注释，后期会增加此功能
            // this.queryProgramList();
            this.groupIds = [data.groupId];
            this.queryGroupRefEquipmentType();
            this.showGroupControlView = true;
          },
        },
        { // 删除
          permissionCode: '03-9-4',
          key: 'isNotEquipmentGroup',
          text: this.commonLanguage.deleteBtn, className: 'fiLink-delete red-icon',
          needConfirm: false,
          handle: (data: GroupListModel) => {
            const ids = [data.groupId];
            this.handelDeleteGroup(ids);
          }
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 过滤查询
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleSelect: (event) => {
        if (event.length === 0) {
          this.storeMapData = null;
          //  无选中数据清除地图上的点
          this.mainMap.resetAllTargetMarker();
          return;
        }
        if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
          this.getDeviceMapByGroupIds(event.map(item => item.groupId));
        } else {
          this.getEquipmentMapByGroupIds(event.map(item => item.groupId));
        }
      },
    };
  }

  /**
   *  处理删除数据
   */
  private handelDeleteGroup(groupList: string[]): void {
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzOkType: 'danger',
      nzOkText: this.commonLanguage.cancel,
      nzContent: `<span>${this.language.confirmDeleteData}</span>`,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.$groupApiService.delGroupInfByIds(groupList).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.assetLanguage.deleteGroupSuccess);
            this.refreshData();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    });
  }

  /**
   *  查询分组下面的所有可用的设备类型
   */
  private queryGroupRefEquipmentType(): void {
    this.$groupApiService.listEquipmentTypeByGroupId({groupIds: this.groupIds}).subscribe((res: ResultModel<string[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.equipmentTypes = res.data || [];
        if (this.equipmentTypes.length > 0) {
          // 批量操作中，分组中设备只有广播和分组时，批量开关才灰显；
          this.equipmentTypes.forEach(item => {
            if (item !== 'E030' && item !== 'E006') {
              // this.commonDisableFlag = false;
              this.commonDisableFlag = this.checkHasRole(PermissionConst.turnOn) ? true : false;
            } else {
              this.commonDisableFlag = true;
            }
          });
          // if (this.equipmentTypes.indexOf('E004') > -1 || this.equipmentTypes.indexOf('E006') > -1) {
          //   this.commonDisableFlag = true;
          // } else {
          //   this.commonDisableFlag = this.checkHasRole(PermissionConst.turnOn) ? true : false;
          // }
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }


  /**
   * 查询是手动控制还是自动
   */
  private checkEquipmentMode(): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.checkEquipmentMode({groupEquipmentIdList: this.groupIds}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }

  /**
   * 刷新列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$groupApiService.queryGroupInfoList(this.queryCondition).subscribe(
      (result: ResultModel<GroupListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet.forEach(item => {
            item.isNotEquipmentGroup = (item.groupType !== GroupTypeEnum.equipmentGroup);
          });
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 鼠标移动的时候地图部分高度变化
   */
  public dragoverHandle(e): void {
    // 如果地图隐藏了就直接返回不让推拽
    if (!this.isShowUpIcon) {
      return;
    }
    // 移动的时候表格显示
    this.isShowTable = true;
    // 获取鼠标拖拽距离
    const move_dist = e.pageY - this.srcPositionY;
    const doc = $('#drag-content');
    // 获取地图内容高度
    let afterAdjHeight = doc.height() + move_dist;
    afterAdjHeight = afterAdjHeight > this.minHeight ? afterAdjHeight : this.minHeight;
    // 最外层高度
    $('#drag-box').height(afterAdjHeight);
    doc.height(afterAdjHeight);
    this.srcPositionY = e.pageY;
    e.preventDefault();
  }

  /**
   * 拖拽鼠标松开触发事件
   */
  public dropHandle(e): void {
    // 如果地图隐藏了就直接返回不让推拽
    if (!this.isShowUpIcon) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * 地图事件回传
   */
  public mapEvent(event: MapEventModel): void {
    if (event.type === MapEventTypeEnum.selected) {
      this.deviceIds = [event.id];
      if (this.$mapCoverageService.showCoverage === MapTypeEnum.facility) {
        this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, [event.id])];
      } else {
        // 根据设备信息查询分组信息--接口
        this.queryCondition.filterConditions = [new FilterCondition('equipmentIds', OperatorEnum.in, [event.id])];
      }
      this.refreshData();
      this.queryCondition.bizCondition = null;
      this.queryCondition.filterConditions = [];
    } else if (event.type === MapEventTypeEnum.mapBlackClick) {
      console.log(1111);
      this.mainMap.resetAllTargetMarker();
      this.queryCondition.filterConditions = [];
      this.queryCondition.bizCondition = null;
      this.groupChangeDataSet = [];
      this.refreshData();
      this.deviceIds = [];
      this.storeMapData = null;
      this.isShowButton = false;
    } else if (event.type === MapEventTypeEnum.mapDrag) {
      // 地图拖动
      this.facilityInGroup = _.cloneDeep(this.storeMapData);
      if (this.facilityInGroup) {
        this.facilityInGroup.positionCenter = null;
      }
    }
    // 区域点点击展开事件
    if (event.type === MapEventTypeEnum.areaPoint) {
      this.areaFacilityByLoop = false;
      if (this.mainMap.mapService) {
        // 清除地图所有的点
        this.mainMap.mapService.markerClusterer.clearMarkers();
        // 定位到当前区域点的中心点
        this.mainMap.mapService.panTo(event.data['lng'], event.data['lat']);
        // 创建设施点
        this.mainMap.getMapDeviceData([event.data.code]);
      }
    }
  }

  /**
   * 点击框选事件
   */
  public mapSelectData(): void {
    // 发射关闭设施设备悬浮卡事件
    this.$OperationService.eventEmit.emit({selectGroup: false});
    // 先清空之前的框选数据
    if (!_.isEmpty(this.groupChangeDataSet)) {
      this.mainMap.selectMarkerId();
      this.groupChangeDataSet = [];
    }
    this.isShowButton = !this.isShowButton;
    this.$selectGroupService.eventEmit.emit({isShow: this.isShowButton});
  }

//   /**
//    * 未分组事件//逻辑没写
//    */
//   public noneGroupOperation(): void {
//     debugger
//     // 获取视图下的区域
//     if (this.mainMap.mapService.getZoom() <= BMapConfig.areaZoom) {
//       return;
//     }
//     const bound = this.mainMap.mapService.mapInstance.getBounds(); // 地图可视区域
//     const facilityListInWindow = [];
//     this.mainMap.mapService.getMarkerMap().forEach(value => {
//       if (bound.containsPoint(value.marker.point) === true && !value.data.code) {
//         facilityListInWindow.push(value.data);
//       }
//     });
//     if (facilityListInWindow.length === 0) {
//       return;
//     }
//     if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
//       this.queryCondition.filterConditions = [new FilterCondition('deviceType',
//         OperatorEnum.in, this.facilityStoreData), new FilterCondition('deviceIds', OperatorEnum.in, facilityListInWindow.map(item => item.deviceId))];
//       // [new FilterCondition('deviceType', OperatorEnum.in, ['D001', 'D002', 'D003', 'D004', 'D005'])];
//       this.$groupApiService.notInGroupForDeviceMap(this.queryCondition).subscribe((res: ResultModel<any>) => {
//         console.log(res);
//         if (res.code === ResultCodeEnum.success) {
//           // FacilityListModel
//           if (res.data.polymerizationData.length > 0) {
//             this.mainMap.locationByIds(res.data);
//           } else {
//             this.$message.info('当前视图内无未分组的设施');
//           }
//         } else {
//           this.$message.error(res.msg);
//         }
//       });
//     } else {
// this.queryCondition.filterConditions = [new FilterCondition('equipmentType', OperatorEnum.in, this.equipmentStoreData)];
//       console.log(facilityListInWindow);
//       this.queryCondition.filterConditions.push(new FilterCondition('equipmentId', OperatorEnum.in, facilityListInWindow.map(item => item.equipmentId)));
//       this.$groupApiService.notInGroupForEquipmentMap(this.queryCondition).subscribe((res: ResultModel<any>) => {
//         console.log(res);
//         if (res.code === ResultCodeEnum.success) {
//           // FacilityListModel
//           if (res.data.equipmentData.length > 0) {
//             this.mainMap.locationByIds(res.data);
//           } else {
//             this.$message.info('当前视图内无未分组的设备');
//           }
//         } else {
//           this.$message.error(res.msg);
//         }
//       });
//     }
//   }

  public noneGroupOperation() {
    const facilityListInWindow = FacilityForCommonUtil.getFacilityListInWindow(this, this.language);
    if (!facilityListInWindow) {
      return;
    }
    if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
      this.queryCondition.filterConditions = [new FilterCondition('deviceType',
        OperatorEnum.in, this.facilityStoreData), new FilterCondition('deviceIds', OperatorEnum.in, facilityListInWindow.map(item => item.deviceId))];
      // [new FilterCondition('deviceType', OperatorEnum.in, ['D001', 'D002', 'D003', 'D004', 'D005'])];
      this.$groupApiService.notInGroupForDeviceMap(this.queryCondition).subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          // FacilityListModel
          if (res.data.polymerizationData.length > 0) {
            if (this.mainMap) {
              this.mainMap.locationByIds(res.data);
            }
          } else {
            this.$message.info(this.assetLanguage.ungroupedFacilities);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      // 可能存在坐标相同聚合的设备，取聚合点上equipmentList 数据
      const equipmentIds = [];
      facilityListInWindow.forEach(item => {
        item.equipmentList.forEach( v => {
          equipmentIds.push(v.equipmentId);
        });
      });
      this.queryCondition.filterConditions = [new FilterCondition('equipmentType', OperatorEnum.in, this.equipmentStoreData)];
      this.queryCondition.filterConditions.push(new FilterCondition('equipmentId', OperatorEnum.in, equipmentIds));
      this.$facilityForCommonService.notInGroupForEquipmentMap(this.queryCondition).subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          // FacilityListModel
          if (res.data.equipmentData.length > 0) {
            if (this.mainMap) {
              this.mainMap.locationByIds(res.data, facilityListInWindow);
            }
          } else {
            this.$message.info(this.assetLanguage.ungroupedEquipment);
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }

  /**
   * 分组变更事件
   */
  public groupChange(): void {
    if (_.isEmpty(this.groupChangeDataSet)) {
      if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
        this.$message.info(this.assetLanguage.pleaseSelectDevice);
      } else {
        this.$message.info(this.assetLanguage.pleaseSelectEquipment);
      }
      return;
    }
    this.isShowButton = false;
    this.isShowGroupChange = true;
    this.$selectGroupService.eventEmit.emit({isShow: this.isShowButton});
  }

  /**
   * 获取初始拖拽位置坐标
   */
  public dragstartHandle(e): void {
    // 取起始位置
    this.srcPositionY = e.pageY;
  }

  /**
   * 地图变小化
   */
  public mapMinHeightChange(): void {
    // 表格部分
    this.isShowTable = true;
    this.isShowDownIcon = true;
    if ($('#drag-box').height() > (window.innerHeight / 2)) {
      $('#drag-content').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#drag-box').height(MAP_DEFAULT_HEIGHT_CONST);
    } else {
      // 地图部分和外层不显示
      $('#drag-content').height(0);
      $('#drag-box').height(0);
      $('#drag-content').hide();
      //  最小化隐藏变小按钮
      this.isShowUpIcon = false;
    }
    // 刷新列表数据
    // this.refreshData();
  }

  /**
   * 地图变大化
   */
  public mapBigHeightChange(): void {
    // 地图和最小化按钮显示
    this.isShowUpIcon = true;
    if ($('#drag-content').height() === 0) {
      // 刷新地图数据
      $('#drag-content').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#drag-box').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#drag-content').show();
      // this.initMapData();
    } else {
      // 地图全屏高度 = 浏览器高度 - 上下边距
      this.maxHeight = window.innerHeight - MAX_HEIGHT_EDGE_CONST;
      // 全屏显示地图部分
      $('#drag-content').height(this.maxHeight);
      $('#drag-box').height(this.maxHeight);
      $('#drag-content').show();
      // 表格
      this.isShowTable = false;
      this.isShowDownIcon = false;
    }
    if (this.mainMap.mapService.getZoom() > BMapConfig.areaZoom) {
      // 地图放大重新获取经纬度渲染设施或设备
      setTimeout(() => {
        if (this.mainMap) {
          this.mainMap.selectedFacility(this.storeMapData);
        }
      }, 100);
    }

  }

  /**
   * 显示加载进度条
   */
  public showProgressBar(): void {
    this.percent = 0;
    this.increasePercent = 5;
    this.isShowProgressBar = true;
    this.scheduleTime = window.setInterval(() => {
      if (this.percent >= 100) {
        clearInterval(this.scheduleTime);
      } else {
        this.percent += this.increasePercent;
        if (this.percent === 50) {
          this.increasePercent = 2;
        } else if (this.percent === 80) {
          this.increasePercent = 1;
        } else if (this.percent === 99) {
          this.increasePercent = 0;
        }
      }
    }, 500);
  }

  /**
   * 隐藏加载进度条
   */
  public hideProgressBar(): void {
    this.percent = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
  }

  facilityLayeredChange() {
    this.isShowButton = false;
    // this.$OperationService.eventEmit.emit({facility: false});
  }

  /**
   * 检查首次加载
   */
  public queryHomeDeviceArea() {
    // 缓存读取筛选条件区域数据
    const areaStoreData = this.$mapStoreService.areaSelectedResults || [];
    // 缓存读取筛选条件设施类型数据
    if (this.$mapStoreService.facilityTypeSelectedResults.length) {
      this.facilityStoreData = [];
      this.$mapStoreService.facilityTypeSelectedResults.forEach(item => {
        this.$mapStoreService.showFacilityTypeSelectedResults.forEach(_item => {
          if (item === _item) {
            this.facilityStoreData.push(item);
          }
        });
      });
      if (!this.facilityStoreData.length && this.initMapDevice && this.$mapStoreService.showFacilityTypeSelectedResults &&
        this.$mapStoreService.showFacilityTypeSelectedResults && this.$mapStoreService.showFacilityTypeSelectedResults.length) {
        this.facilityStoreData = ['noData'];
      }
    } else {
      this.facilityStoreData = this.$mapStoreService.showFacilityTypeSelectedResults;
    }
    // 缓存读取筛选条件设备类型数据
    if (this.$mapStoreService.equipmentTypeSelectedResults.length) {
      this.equipmentStoreData = [];
      this.$mapStoreService.equipmentTypeSelectedResults.forEach(item => {
        if (item === this.$mapStoreService.showEquipmentTypeSelectedResults[0]) {
          this.equipmentStoreData = [item];
        }
      });
      if (!this.equipmentStoreData.length) {
        this.equipmentStoreData = ['noData'];
      }
    } else {
      this.equipmentStoreData = this.$mapStoreService.showEquipmentTypeSelectedResults;
    }
    let requestHeader;
    if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
      // 设施参数
      this.deviceAreaModel.polymerizationType = '1';
      this.deviceAreaModel.filterConditions.area = areaStoreData ? areaStoreData : [];
      this.deviceAreaModel.filterConditions.device = this.facilityStoreData ? this.facilityStoreData : [];
      const testData = this.deviceAreaModel;
      this.$mapStoreService.polymerizationConfig = testData;
      requestHeader = this.$indexApiService.queryDevicePolymerizationList(testData);
    } else {
      // 设备参数
      this.equipmentAreaModel.polymerizationType = '1';
      this.equipmentAreaModel.filterConditions.area = areaStoreData ? areaStoreData : [];
      this.equipmentAreaModel.filterConditions.equipment = this.equipmentStoreData ? this.equipmentStoreData : [];
      const testData = this.equipmentAreaModel;
      this.$mapStoreService.polymerizationConfig = testData;
      requestHeader = this.$mapService.queryEquipmentPolymerizationList(testData);
    }
    return new Promise((resolve, reject) => {
      // 设施的区域接口
      requestHeader.subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data.polymerizationData && result.data.polymerizationData.length) {
            const data = result.data;
            resolve(data);
            this.hideProgressBar();
          } else {
            this.cacheData([]);
            if (this.mainMap) {
              this.mainMap.mapService.locateToUserCity();
            }
            this.hideProgressBar();
          }
        } else {
          if (this.mainMap) {
            this.mainMap.mapService.locateToUserCity();
          }
          this.hideProgressBar();
        }
      }, () => {
        if (this.mainMap) {
          this.mainMap.mapService.locateToUserCity();
        }
        this.hideProgressBar();
      });
    });
  }

  /**
   * 查询区域告警数据
   */
  public queryAlarmListHome(data) {
    if (!data.polymerizationData.length && this.mainMap.mapService) {
      this.mainMap.mapService.markerClusterer.clearMarkers();
      return;
    }
    this.centerPoint = data.positionCenter.split(',');
    const alarmData = new AlarmAreaModel();
    alarmData.filterConditions[0].filterField = this.$mapCoverageService.showCoverage === 'facility' ? 'alarm_device_type_id' : 'alarm_source_type_id';
    alarmData.filterConditions[0].filterValue = this.$mapCoverageService.showCoverage === 'facility' ? this.facilityStoreData : this.equipmentStoreData;
    this.$mapStoreService.alarmDataConfig = alarmData;
    this.cacheData(data.polymerizationData);
    this.hideProgressBar();
  }

  /**
   * 缓存数据
   * param data
   */
  public cacheData(data): void {
    // 更新标记点
    data.forEach(item => {
      if (item.positionCenter) {
        const position = item.positionCenter.split(',');
        item.lng = parseFloat(position[0]);
        item.lat = parseFloat(position[1]);
        delete item.positionCenter;
        if (this.$mapStoreService) {
          this.$mapStoreService.updateMarker(item, true);
        }
      }
    });
    // 更新地图数据
    this.data = data;
    this.initMapDevice = true;
  }

  /**
   * 区域数据查询
   */
  public queryHomeData(): void {
    this.showProgressBar();
    // 获取区域点
    if (this.$mapStoreService) {
      this.queryHomeDeviceArea().then(result => {
        this.listAreaByAreaCodeList(result).then(_result => {
          // 获取告警数据
          this.queryAlarmListHome(result);
        });
      });
    } else {
      this.hideProgressBar();
    }
  }

  /**
   * 获取全量的区域数据，包括子集
   */
  public listAreaByAreaCodeList(data) {
    return new Promise((resolve, reject) => {
      const areaList = data.polymerizationData.map(item => {
        return item.code;
      });
      this.$indexApiService.listAreaByAreaCodeList(areaList).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          resolve(result.data.map((item) => {
            return item.areaCode;
          }));
        }
      });
    });
  }

// 刷新数据
  public reloadGroup(event: string): void {
    this.$selectGroupService.eventEmit.emit({isShow: false});
    this.queryCondition.filterConditions = [];
    this.queryCondition.bizCondition = null;
    this.mainMap.resetAllTargetMarker();
    this.groupChangeDataSet = [];
    this.isShowButton = false;
    this.refreshData();
  }

  /**
   * 根据分组id获取地图中心点
   * @param ids 分组id数组
   */
  public getDeviceMapByGroupIds(ids: string[]) {
    const deviceMapQueryCondition = new QueryConditionModel();
    const deviceType = this.$mapStoreService.showFacilityTypeSelectedResults;
    deviceMapQueryCondition.filterConditions.push(new FilterCondition('groupId', OperatorEnum.in, ids));
    // 查询过滤后的设施中心点位置
    deviceMapQueryCondition.filterConditions.push(new FilterCondition('deviceTypeList', OperatorEnum.in, deviceType));
    this.$groupApiService.getDeviceMapByGroupIds(deviceMapQueryCondition).subscribe((result: ResultModel<any>) => {
      if (result.data.polymerizationData.length > 0) {
        if (this.mainMap) {
          this.mainMap.targetMarkerArr = [];
        }
        this.storeMapData = result.data;
        this.mainMap.selectedFacility(result.data);
      }
    });
  }

  public getEquipmentMapByGroupIds(ids: string[]) {
    const deviceMapQueryCondition = new QueryConditionModel();
    const equipmentType = this.$mapStoreService.showEquipmentTypeSelectedResults;
    deviceMapQueryCondition.filterConditions.push(new FilterCondition('groupId', OperatorEnum.in, ids));
    // 查询过滤后的设备中心点位置
    deviceMapQueryCondition.filterConditions.push(new FilterCondition('equipmentType', OperatorEnum.in, equipmentType));
    this.$facilityForCommonService.getEquipmentMapByGroupIds(deviceMapQueryCondition).subscribe((result: ResultModel<any>) => {
      if (result.data.polymerizationData.length > 0) {
        if (this.mainMap) {
          this.mainMap.targetMarkerArr = [];
          this.storeMapData = result.data;
          this.mainMap.selectedFacility(result.data);
        }
      }
    });
  }
  public checkHasRole(codes: string[]): boolean {
    if (_.isEmpty(codes)) {
      return true;
    }
    const userInfo = SessionUtil.getUserInfo();
    if (userInfo && userInfo.role && userInfo.role.permissionList) {
      const perCodeList = userInfo.role.permissionList.map(v => v.id) || [];
      const tempArr = _.intersection(codes, perCodeList);
      return _.isEmpty(tempArr);
    } else {
      return true;
    }
  }
}
