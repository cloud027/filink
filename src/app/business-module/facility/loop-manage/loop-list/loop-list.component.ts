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
 * 回路列表主界面组件
 */
@Component({
  selector: 'app-loop-list',
  templateUrl: './loop-list.component.html',
  styleUrls: ['./loop-list.component.scss']
})

export class LoopListComponent extends LoopListCommon implements OnInit, OnDestroy {
  // 地图
  @ViewChild('mainMap') mainMap: LoopMapComponent;
  // 列表实例
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 回路状态
  @ViewChild('loopStatusRef') loopStatusRef: TemplateRef<HTMLDocument>;
  //  回路类型
  @ViewChild('loopTypeRef') loopTypeRef: TemplateRef<HTMLDocument>;
  // 地图配置
  public mapConfig: MapConfig;
  // 地图区域设施数据
  public data: LoopMapDeviceDataModel[] = [];
  // 列表数据
  public dataSet: LoopListModel[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 地图回路列表筛选条件
  public filterConditions: FilterCondition[] = [];
  // 地图框选的设施id集合
  public deviceIds: string[] = [];
  // 回路地图请求参数标识
  public areaFacilityByLoop: boolean = false;
  // 已选设施数据
  public selectFacility: boolean = true;
  // 回路状态枚举
  public loopStatusEnum = LoopStatusEnum;
  // 回路类型枚举
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
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    // 列表初始化
    this.initTableConfig();
    // 刷新列表数据
    this.refreshData();
    // 初始化地图数据
    this.initMapData();
    // 初始数据处理
    this.handleInitData();
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.mainMap = null;
    this.tableComponent = null;
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 地图事件回传
   */
  public mapEvent(event: MapEventModel): void {
    if (event.type === MapEventTypeEnum.selected) {
      this.deviceIds = [event.id];
      this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, [event.id])];
      this.refreshData();
      // 还原参数
      this.queryCondition.filterConditions = [];
    } else if (event.type === MapEventTypeEnum.mapBlackClick) {
      this.queryCondition.filterConditions = [];
      this.refreshData();
      // 清除回路线
      if (this.mainMap) {
        this.mainMap.clearLoopDrawLine();
        this.mainMap.loopDrawLineData = [];
        // 清除选中状态
        if (!_.isEmpty(this.deviceIds)) {
          this.mainMap.resetMarkersStyle(this.deviceIds);
        }
      }
      this.deviceIds = [];
      this.isShowButton = false;
    }
    // 区域点点击展开事件
    if (event.type === MapEventTypeEnum.areaPoint) {
      this.areaFacilityByLoop = false;
      if (this.mainMap) {
        // 清除地图所有的点
        this.mainMap.mapService.markerClusterer.clearMarkers();
        // 定位到当前区域点的中心点
        const centerPoint = event.data.split(',');
        this.mainMap.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.deviceZoom);
        // this.mainMap.mapService.panTo(event.data['lng'], event.data['lat']);
        // 创建设施点
        // this.mainMap.getMapDeviceData([event.data.code], 'area');
        this.mainMap.zoomLocation();
      }
    }
  }

  /**
   * 表格分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 初始化表格配置
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
        { // 回路名称
          title: this.language.loopName,
          key: 'loopName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        },
        { // 回路编号
          title: this.assetLanguage.loopCode,
          key: 'loopCode',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 回路类型
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
        { // 回路状态
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
        { // 所属配电箱
          title: this.language.distributionBox,
          key: 'distributionBoxName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 控制对象
          title: this.language.controlledObject,
          key: 'centralizedControlName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.language.remarks,
          key: 'remark',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // 操作
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
        { // 新增
          text: this.language.addArea,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '03-10-1',
          handle: () => {
            this.navigateToDetail('business/facility/loop-detail/add',
              {queryParams: {}});
          }
        },
        { // 批量删除
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
        { // 批量拉闸
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
        { // 批量合闸
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
        { // 编辑
          text: this.language.update,
          permissionCode: '03-10-2',
          className: 'fiLink-edit',
          handle: (data: LoopListModel) => {
            this.navigateToDetail('business/facility/loop-detail/update', {queryParams: {id: data.loopId}});
          }
        },
        { // 查看详情
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
        { // 拉闸
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
        { // 合闸
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
        { // 单个删除
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
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // 筛选
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      // 导出
      handleExport: (event: ListExportModel<LoopListModel[]>) => {
        this.handelExportLoop(event);
      },
      // 勾选列表地图画线
      handleSelect: (event: LoopListModel[]) => {
        this.loopSelectedData = event;
        // 判断所勾选的数据是否存在没有控制对象的数据，没有就需要将更多操作按钮里面的拉闸和合闸设置成disabled
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
   * 导出回路
   */
  private handelExportLoop(event: ListExportModel<LoopListModel[]>): void {
    // 处理参数
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    exportBody.columnInfoList.forEach(item => {
      if (['loopType', 'loopStatus'].includes(item.propertyName)) {
        // 后台处理字段标示
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.loopId);
      const filter = new FilterCondition('loopIds', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    // 调用后台接口
    this.$loopService.exportLoopList(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.assetLanguage.exportSucceededTip);
      } else {
        this.$message.error(result.msg);
      }
    });
  }


  /**
   * 删除回路操作
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
   * 拉合闸操作
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
    // 如果回路无控制对象和回路编号，无法做拉合闸操作
    if (!_.isEmpty(loopList)) {
      const param = new LoopPullCloseBreakModel(loopList);
      const requestParam = new InstructSendRequestModel<LoopPullCloseBreakModel>(commandId, equipmentIds, param);
      // 校验模式，是否可以下发指令
      this.checkEquipmentMode(equipmentIds).then( resolve => {
        if (resolve.code === ResultCodeEnum.success) {
          this.$loopService.pullBrakeOperate(requestParam).subscribe((result: ResultModel<string>) => {
            if (result.code === ResultCodeEnum.success) {
              // 弹出指令下发成功提示
              this.$message.success(`${this.languageTable.contentList.distribution}!`);
            } else {
              // 弹出指令下发错误结果提示
              this.$message.error(result.msg);
            }
          });
        } else {
          // 指令异常弹出指令模式提示
          this.$message.error(resolve.msg);
        }
      });
    } else {
      this.$message.info(this.assetLanguage.noCommandInfoTip);
    }
  }

  /**
   * 跳转到详情
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 回路列表
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
          // 如果没有控制对象就不显示拉闸和合闸
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
   * 查询是手动控制还是自动
   */
  private checkEquipmentMode(data): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityCommonService.checkEquipmentMode({loopControlEquipmentIdList: data}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }
}
