import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BMapPlusService} from '../../../../shared-module/service/map-service/b-map/b-map-plus.service';
import {GMapPlusService} from '../../../../shared-module/service/map-service/g-map/g-map-plus.service';
import {MapServiceUtil} from '../../../../shared-module/service/map-service/map-service.util';
import {FilinkMapEnum} from '../../../../shared-module/enum/filinkMap.enum';
import {BMapDrawingService} from '../../../../shared-module/service/map-service/b-map/b-map-drawing.service';
import {GMapDrawingService} from '../../../../shared-module/service/map-service/g-map/g-map-drawing.service';
import {takeUntil} from 'rxjs/operators';
import {BMAP_ARROW, BMAP_DRAWING_RECTANGLE} from '../../../../shared-module/component/map-selector/map.config';
import {Subject} from 'rxjs';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PlanningListTableUtil} from '../../../../core-module/business-util/project/planning-list-table.util';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {PlanInfoModel} from '../../../../core-module/model/plan/plan-info.model';
import * as _ from 'lodash';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {PlanPointRender} from '../../../../shared-module/component/plan/plan-point-render';
import {ActivatedRoute, Router} from '@angular/router';
import {MapConfig as BMapConfig} from '../../../../shared-module/component/map/b-map.config';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {PlanPointModel} from '../../share/model/plan-point.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {bigIconSize, defaultIconSize} from '../../../../shared-module/service/map-service/map.config';
import {PlanProjectApiService} from '../../share/service/plan-project.service';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {PointStatusEnum} from '../../../../core-module/enum/plan/point-status.enum';
import {PointStatusIconEnum} from '../../../../core-module/enum/plan/point-status-icon.enum';
import {WisdomPointInfoModel} from '../../../../core-module/model/plan/wisdom-point-info.model';
import {SelectPointTypeEnum} from '../../share/enum/select-point-type.enum';
import {ModelSetModel} from '../../share/model/model-set.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {MapSearchComponent} from '../../../../shared-module/component/map-selector/map-search/map-search.component';
import {ChoosePointStatusModel} from '../../share/model/choose-point-status.model';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {PlanProjectForCommonService} from '../../../../core-module/api-service/plan-project/plan-project-for-common.service';

/**
 * 项目管理-编辑项目-编辑项目点位
 */
@Component({
  selector: 'app-planning-point',
  templateUrl: './planning-point.component.html',
  styleUrls: ['./planning-point.component.scss']
})
export class PlanningPointComponent extends PlanPointRender implements OnInit, OnDestroy {
  // 智慧杆状态
  @ViewChild('pointStatusTemp') pointStatusTemp: TemplateRef<HTMLDocument>;
  // 规划列表表格
  @ViewChild('planListTable') public planListTable: TableComponent;
  // 地图搜索组件
  @ViewChild('mapSearchComponent') public mapSearchComponent: MapSearchComponent;
  // 智慧杆状态枚举
  public pointStatusEnum = PointStatusEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 判断当前页新增还是修改
  public pageType: OperateTypeEnum = OperateTypeEnum.add;

  // 页面标题
  public pageTitle: string;
  // 地图绘画工具
  public mapDrawUtil: any;
  // 绘制类型
  public drawType: string = BMAP_ARROW;
  // 覆盖物集合
  public overlays = [];
  // 地图类型
  public mapType: string = FilinkMapEnum.baiDu;
  // 关闭订阅流
  public destroy$ = new Subject<void>();
  // 项目规划语言包
  public language: PlanProjectLanguageInterface;
  // 产品管理国际化词条
  public productLanguage: ProductLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 框选开启
  public drawUtilOpen: boolean = false;
  // 开启框选后操作目的
  public selectPointType: SelectPointTypeEnum = SelectPointTypeEnum.add;
  // 框选点位类型枚举
  public selectPointTypeEnum = SelectPointTypeEnum;
  // 点位状态面板显示隐藏
  public pointStatusPanelShow: boolean = false;
  public checkPointStatus: { label: string; code: string, value: string, checked: boolean }[] = [];

  // 规划列表弹窗是否显示
  public isShowPlanList: boolean = false;
  // 规划列表弹窗表格数据源
  public planListDataSet: PlanInfoModel[] = [];
  // 规划列表弹窗翻页
  public planListPageBean: PageModel = new PageModel(5, 1);
  // 规划列表弹窗表格配置
  public tablePlanListConfig: TableConfigModel;
  // 查询参数对象集
  public planListQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 规划列表确定按钮是否禁用
  public planConfirmDisabled: boolean = true;

  // 已选规划列表
  public selectPlanList: PlanInfoModel[] = [];
  // 是否显示型号预设值和已选智慧杆浮窗
  public isShowSelect: boolean = false;
  // 型号预设施表格数据源 一页
  public modelPresetDataSet: ModelSetModel[] = [];
  // 型号预设施表格配置
  public modelPresetTableConfig: TableConfigModel;
  // 型号预设置翻页
  public modelPresetPageBean: PageModel = new PageModel(5, 1);
  // 型号预设值所有数据
  public modelPresetDataAll: ModelSetModel[] = [];

  // 已选智慧杆列表当前页数据
  public selectWisdomDataSet: WisdomPointInfoModel[] = [];
  // 已选智慧杆列表表格配置
  public selectWisdomTableConfig: TableConfigModel;
  // 已选智慧杆列表翻页
  public selectWisdomPageBean: PageModel = new PageModel();
  // 已选智慧杆列表全部数据源
  public selectWisdomAll: WisdomPointInfoModel[] = [];
  // 缓存地图应渲染的点位数据,包括选的规划下的点位和已选的智慧杆点位
  public pointDataInMap: WisdomPointInfoModel[] = [];

  // 已经存在于该项目的需高亮的点位数据，用于编辑回显用
  public existingWisdomData: WisdomPointInfoModel[] = [];
  // 批量修改规划型号弹窗显示
  public editProductModelVisible: boolean = false;
  // 地图需要显示的状态，待建、已建、在建
  public showPointStatusArr: string[] = [];

  // 是否展示产品列表弹窗
  public isShowProductList: boolean = false;
  // 当前操作选择型号的规划数据
  public currentPlanData = {
    planId: null,
    productId: null,
    productModel: null,
    supplierName: null,
  };
  // 地图本次框选到的数据
  public selectedAllPoint: any[] = [];

  // 当前项目id
  public projectId: string;
  // 地图服务类
  public mapService: BMapPlusService | GMapPlusService;

  // 是否显示型号预设置气泡tip
  public isShowModelTip: boolean = false;
  public isShowAddPointTip: boolean = false;
  private $interval;

  constructor(
    public $planProjectForCommonService: PlanProjectForCommonService,
    public $planProjectApiService: PlanProjectApiService,
    public $message: FiLinkModalService,
    private $nzI18n: NzI18nService,
    private $active: ActivatedRoute,
    private $modalService: NzModalService,
    private $router: Router,
  ) {
    super($planProjectForCommonService);
  }


  /**
   * 缩放防抖 重写
   */
  zoomEnd = _.debounce(() => {
    if (!this.mapService) {
      return;
    }

    // 关闭绘制模式
    this.drawType = BMAP_ARROW;
    this.mapDrawUtil.close();
    this.mapDrawUtil.setDrawingMode(null);
    this.drawUtilOpen = false;

    // 清除设施或设备以外所有的点
    this.clearAllMarkerPoint();
    this.hideWindow();
    // 缩放层级街道级别
    if (this.mapService.getZoom() >= BMapConfig.areaZoom) {
      if (!this.searchLocation) {
        // 地图窗口改变时 查询选了型号的规划下的点位
        if (!_.isEmpty(this.modelPresetDataAll.filter(v => !_.isEmpty(v.productModel)))) {
          this.selectPointByPlanIdAndNoProject().then();
        }
      }
      if (this.pointDataInMap && !_.isEmpty(this.pointDataInMap)) {
        // 渲染点位
        this.renderPlanPoint(this.pointDataInMap);
        if (!_.isEmpty(this.selectWisdomAll)) {
          this.highLightDevice(this.selectWisdomAll);
        }
        this.showOrHideMarkers();
      }
    }
  }, 100, {leading: false, trailing: true});

  /**
   * 平移拖动
   */
  dragEnd = _.debounce(() => {
    if (this.mapService.getZoom() >= BMapConfig.areaZoom) {
      // 渲染型号预设置的规划下的点位
      if (!_.isEmpty(this.modelPresetDataAll.filter(item => item.productId)) && !this.searchLocation) {
        this.selectPointByPlanIdAndNoProject().then(() => {
          this.highLightDevice(this.selectWisdomAll);
        });
      }
    }
  }, 100, {leading: false, trailing: true});

  public ngOnInit(): void {
    // 获取语言包
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化显示全部状态的智慧杆
    this.showPointStatusArr = Object.values(PointStatusEnum);
    // 获取点位状态checkbook配置
    this.getCheckPointStatus();
    // 路由参数获取项目id
    this.$active.queryParams.pipe(takeUntil(this.destroy$)).subscribe(param => {
      if (param.id) {
        this.projectId = param.id;
      }
      // 判断页面类型，新增or编辑点位
      this.$active.url.pipe(takeUntil(this.destroy$)).subscribe(url => {
        this.pageType = url.toString().includes(OperateTypeEnum.add) ? OperateTypeEnum.add : OperateTypeEnum.update;
      });
      this.pageTitle = this.pageType === OperateTypeEnum.add ? this.language.addProjectPoint : this.language.editProjectPoint;
    });
    if (!this.mapService) {
      this.initMap();
    }
    // 添加地图事件
    this.addMapEvent();
    // 初始化型号预设置列表表格配置
    this.initModelPresetTable();
    // 初始化已选智慧杆列表表格配置
    this.initSelectWisdomTable();
    if (this.pageType === OperateTypeEnum.update) {
      // 查询项目点位信息
      this.queryPointInfoByProjectId();
    } else {
      // 新增页面无项目点位信息则定位到当前城市
      this.mapService.locateToUserCity();
    }
  }


  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.$interval);
    this.$interval = null;
  }


  /**
   * 获取可选点位状态配置
   */
  public getCheckPointStatus(): void {
    const arr = CommonUtil.codeTranslate(PointStatusEnum, this.$nzI18n, null, LanguageEnum.planProject) as any[];
    arr.forEach(item => {
      item.value = item.code;
      item.checked = true;
    });
    this.checkPointStatus = arr;
  }

  /**
   * 点位状态多选框变化时间
   * @param event 勾选的点位状态
   */
  public checkPointStatusChange(event: ChoosePointStatusModel[]): void {
    // 地图需显示的状态
    this.showPointStatusArr = event.filter(item => item.checked).map(item => item.value);
    this.showOrHideMarkers();
  }

  /**
   * 判断当前地图点位显示隐藏
   */
  public showOrHideMarkers(): void {
    this.pointDataInMap.forEach(marker => {
      if (this.showPointStatusArr.includes(marker.pointStatus)) {
        //  需显示该状态（已建、在建、待建）的点位
        this.mapService.showMarker(marker.pointId);
      } else {
        // 地图隐藏该状态的点位
        this.mapService.hideMarker(marker.pointId);
      }
    });
  }

  /**
   * 查询项目点位信息
   */
  public queryPointInfoByProjectId(): void {
    this.$planProjectApiService.queryPointInfoByProjectId(this.projectId).subscribe((result) => {
      if (result.code === ResultCodeEnum.success && result.data) {
        // 回显已选智慧杆点位
        this.isShowSelect = true;
        if (result.data.positionCenterLatitude) {
          const lat = result.data.positionCenterLatitude;
          const lng = result.data.positionCenterLongitude;
          // @ts-ignore
          this.mapService.setCenterAndZoom(lng, lat, BMapConfig.deviceZoom);
        } else {
          // 定位到当前城市
          this.mapService.locateToUserCity();
        }
        if (!_.isEmpty(result.data.pointInfoList)) {
          this.selectWisdomAll = result.data.pointInfoList;
          this.selectWisdomAll.forEach(item => {
            item.statusIconClass = PointStatusIconEnum[item.pointStatus];
          });
          this.refreshSelectWisdomList(1, 5);
          // 处理成渲染地图点需要的结构
            result.data.pointInfoList.forEach(item => {
            item['facilityId'] = item.pointId;
            item['lng'] = parseFloat(item.xposition);
            item['lat'] = parseFloat(item.yposition);
            item['cloneCode'] = item.planId;
            item['code'] = null;
            item['show'] = true;
            item['deviceType'] = 'D002';
            // 去除问号
            item['address'] = item.address ? item.address.replace(/\?/g, '') : item.address;
          });
          this.pointDataInMap = _.cloneDeep(result.data.pointInfoList);
          // 缓存项目已有的规划点位
          this.existingWisdomData = _.cloneDeep(result.data.pointInfoList);
        }
      } else {
        this.mapService.locateToUserCity();
      }
    });
  }

  /**
   * 打开规划列表弹窗
   */
  public OpenPlanListWindow(): void {
    this.isShowPlanList = true;
    // 初始化规划列表
    this.initPlanListTable();
    this.planListQueryCondition = new QueryConditionModel();
    this.planListQueryCondition.pageCondition = new PageCondition(1, 5);
    this.refreshPlanList();
    this.selectPlanList = _.cloneDeep(this.modelPresetDataAll);
  }

  /**
   * 规划列表弹窗翻页操作
   */
  public planListPageChange(event: PageModel): void {
    this.planListQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.planListQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshPlanList();
  }

  /**
   * 规划列表弹窗确定
   */
  public handlePlanOk(): void {
    this.isShowPlanList = false;
    if (_.isEmpty(this.modelPresetDataAll)) {
      // 型号预设置列表数据更新
      this.modelPresetDataAll = _.cloneDeep(this.selectPlanList);
      this.modelPresetDataAll.forEach(item => {
        item.productModel = '';
        item.productId = null;
        item.supplierName = '';
        item.checked = false;
      });
    } else {
      this.selectPlanList.forEach((item) => {
        if (!this.modelPresetDataAll.map(v => v.planId).includes(item.planId)) {
          const obj = new ModelSetModel();
          obj.planName = item.planName;
          obj.planId = item.planId;
          this.modelPresetDataAll.push(obj);
        }
      });
    }
    this.refreshModelPresetList(1, 5);
    this.isShowPlanList = false;
    this.isShowSelect = true;
    this.isShowModelTip = true;
    this.$interval = setTimeout(() => {
    this.isShowModelTip = false;
    }, 5000);
  }

  /**
   * 规划列表弹窗取消
   */
  public handlePlanCancel(): void {
    this.isShowPlanList = false;
  }

  /**
   * 清空规划
   */
  public handlePlanCleanUp(): void {
    this.planListTable.keepSelectedData.clear();
    this.planListTable.updateSelectedData();
    this.planListTable.checkStatus();
    this.planConfirmDisabled = true;
    this.selectPlanList = [];
  }

  /**
   * 选中产品变化
   * @param event 产品数据
   */
  public selectProductChange(event: ProductInfoModel[]): void {
    this.isShowProductList = false;
    if (event.length === 1) {
      this.currentPlanData = {
        planId: this.currentPlanData.planId,
        productId: event[0].productId,
        productModel: event[0].productModel,
        supplierName: event[0].supplierName,
      };
      this.modelPresetDataAll.forEach(item => {
        if (item.planId === this.currentPlanData.planId) {
          item.productId = event[0].productId;
          item.productModel = event[0].productModel;
          item.pointModel = event[0].productModel;
          item.supplierName = event[0].supplierName;
        }
      });
      this.refreshModelPresetList(1, 5);
      this.selectPointByPlanIdAndNoProject().then((resolve: PlanPointModel) => {
        if (resolve.point) {
          const lng = parseFloat(resolve.point.xposition);
          const lat = parseFloat(resolve.point.yposition);
          // @ts-ignore
          this.mapService.setCenterAndZoom(lng, lat, BMapConfig.deviceZoom);
        }
      });
      this.isShowAddPointTip = true;
      this.$interval = setTimeout(() => {
        this.isShowAddPointTip = false;
      }, 5000);
    }
  }

  /**
   * 型号预设置翻页操作
   * @param e 翻页数据
   */
  public modelPresetPageChange(e: PageModel): void {
    this.refreshModelPresetList(e.pageIndex, e.pageSize);
  }

  /**
   * 刷新型号预设置列表
   */
  public refreshModelPresetList(pageIndex: number, pageSize: number, queryCondition?: QueryConditionModel): void {
    this.modelPresetPageBean.pageIndex = pageIndex;
    this.modelPresetPageBean.pageSize = pageSize;
    this.modelPresetDataSet = CommonUtil.frontEndQuery(this.modelPresetDataAll, queryCondition, this.modelPresetPageBean);
  }

  /**
   * 已选智慧杆翻页
   * @param e 翻页数据
   */
  public selectWisdomChange(e: PageModel): void {
    this.refreshSelectWisdomList(e.pageIndex, e.pageSize);
  }


  /**
   * 刷新已选智慧杆列表
   * @param pageIndex 当前页码
   * @param pageSize 页条数
   * @param queryCondition 查询条件
   */
  public refreshSelectWisdomList(pageIndex: number, pageSize: number, queryCondition?: QueryConditionModel): void {
    this.selectWisdomPageBean.pageIndex = pageIndex;
    this.selectWisdomPageBean.pageSize = pageSize;
    this.selectWisdomDataSet = CommonUtil.frontEndQuery(this.selectWisdomAll, queryCondition, this.selectWisdomPageBean);
  }

  /**
   * 重写PlanPointRender类searchInputChange方法
   * 地图搜索事件回调
   */
  public searchInputChange(value: string | null): void {
    // 调接口查询数据
    const queryCondition = new QueryConditionModel();
    queryCondition.filterConditions.push(new FilterCondition('pointName', OperatorEnum.like, value));
    this.$planProjectForCommonService.queryPoleByName(queryCondition).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.searchOptions = result.data || [];
      }
    });
    // 设施名字搜索无数据时候重新渲染点来去除之前搜索的设施的高亮
    if (!value) {
      this.reRenderMapPoint();
    }
  }

  /**
   * 打开框选工具
   * @param type 框选类型
   */
  public openDrawUtil(type: SelectPointTypeEnum): void {
    // 清空左上角搜索设施名字栏
    this.mapSearchComponent.inputValue = null;
    // 发射搜索栏变化事件
    this.mapSearchComponent.inputChange.emit(null);
    if (type !== this.selectPointType && this.drawUtilOpen) {
      this.drawType = BMAP_ARROW;
      this.mapDrawUtil.close();
      this.mapDrawUtil.setDrawingMode(null);
      this.drawUtilOpen = false;
    }
    this.drawUtilOpen = !this.drawUtilOpen;
    if (this.drawUtilOpen === true) {
      // 框选工具开启
      this.mapDrawUtil.open();
      this.mapDrawUtil.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    } else {
      this.drawType = BMAP_ARROW;
      this.mapDrawUtil.close();
      this.mapDrawUtil.setDrawingMode(null);
    }
    this.selectPointType = type;
  }

  /**
   * 保存规划点位信息操作
   */
  public onSavePointInfo(): void {
    const pointList = [];
    if (!_.isEmpty(this.selectWisdomAll)) {
      this.selectWisdomAll.forEach(item => {
        pointList.push({
          pointId: item.pointId,
          areaCode: item.areaCode,
          areaName: item.areaName,
          position: `${item.xposition},${item.yposition}`,
          productId: item.productId,
          pointModel: item.pointModel,
          pointStatus: item.pointStatus
        });
      });
    }
    const data = {
      projectId: this.projectId,
      pointInfoList: pointList
    };
    let requestUrl;
    if (this.pageType === OperateTypeEnum.add) {
      requestUrl = this.$planProjectApiService.addProjectPoint(data);
    } else {
      requestUrl = this.$planProjectApiService.updateProjectPoint(data);
    }
    requestUrl.subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.commonLanguage.operateSuccess);
        // 跳转至项目列表
        this.$router.navigate([`business/project-manage/project-list`]).then();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 取消规划点位操作
   */
  public handleCancelPointInfo(): void {
    // 跳转至项目列表
    this.$router.navigate([`business/project-manage/project-list`]).then();
  }


  /**
   *添加监听并获取数据
   */
  public addEventListener(): void {
    // 监听框选结果
    this.mapDrawUtil.addEventListener('overlaycomplete', (e) => {
      // 绘制完成之后先关闭绘制模式
      this.drawType = BMAP_ARROW;
      this.mapDrawUtil.close();
      this.mapDrawUtil.setDrawingMode(null);
      this.drawUtilOpen = false;
      // 获取框选内的点
      this.selectedAllPoint = this.currentWindowPointData.filter(item => e.overlay.containPoint(item.point)).map(item => item.$detail);
      // 绘制完成删除框线
      this.mapService.removeOverlay(e.overlay);
      // 没有框到
      if (!(this.selectedAllPoint && this.selectedAllPoint.length)) {
        this.$message.error(this.language.notSelectedMsg);
        return;
      }
      if (this.selectPointType === SelectPointTypeEnum.add) {
        // 框选添加智慧杆 已选智慧杆列表增加框选数据
        this.selectedAllPoint.forEach(item => {
          item.checked = false;
          // 删除pointId相同点位的数据
          this.selectWisdomAll.forEach((_item, index) => {
            if (item.pointId === _item.pointId) {
              item.checked = _item.checked;
              this.selectWisdomAll.splice(index, 1);
            }
          });
        });
        this.selectWisdomAll = _.cloneDeep(this.selectWisdomAll.concat(this.selectedAllPoint));
        this.refreshSelectWisdomList(1, 5);
        this.highLightDevice(this.selectWisdomAll);
      } else if (this.selectPointType === SelectPointTypeEnum.change) {
        // 框选的点的pointId
        const ids: string[] = this.selectedAllPoint.map(v => v.pointId);
        // 校验框选的点位可否修改型号
        this.$planProjectApiService.checkPointCanUpdate(ids).subscribe((res) => {
          if (res.code === ResultCodeEnum.success && res.data) {
            // 框选修改框选的智慧杆型号
            this.editProductModelVisible = true;
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    });

  }

  /**
   * 批量高亮设施
   * @param data 高亮的数据
   */
  public highLightDevice(data: WisdomPointInfoModel[]): void {
    data.forEach(item => {
      this.selectDeviceById(item.pointId);
    });
  }

  /**
   * 选中设施
   * @param id 区分地图标记点的id
   */
  public selectDeviceById(id: string): void {
    // 拿到标记点
    const marker = this.mapService.getMarkerById(id);
    const data = this.mapService.getMarkerDataById(id);
    // 获取设施图标
    const imgUrl = CommonUtil.getFacilityIconUrl(bigIconSize, data.deviceType);
    // 切换大图标
    let _icon;
    if (!(this.mapService instanceof GMapPlusService)) {
      _icon = this.mapService.toggleBigIcon(imgUrl);
    }
    marker.setIcon(_icon);
  }

  /**
   * 修改型号的智慧杆数据和选中的型号数据
   */
  public modelChange(event: { productData: any, pointIds: string[] }): void {
    this.$message.success(this.language.editModelInfo);
    this.pointDataInMap.forEach(item => {
      if (event.pointIds.includes(item.pointId)) {
        item.productId = event.productData.productId;
        item.productModel = event.productData.productModel;
        item.pointModel = event.productData.productModel;
        item.supplierName = event.productData.supplierName;
      }
    });
    this.currentWindowPointData = [].concat(this.pointDataInMap);

    this.clearAllMarkerPoint();
    // 渲染点位
    this.renderPlanPoint(this.pointDataInMap);
    // 地图高亮已选智慧杆列表中对应点位
    this.highLightDevice(this.selectWisdomAll);
    this.showOrHideMarkers();
  }

  /**
   * 初始化地图
   */
  private initMap(): void {
    this.mapService = MapServiceUtil.getPlusMap();
    this.mapService.createPlusMap('planningPointMap');
    // 地图搜索
    this.mapService.addLocationSearchControl('_suggestId', '_searchResultPanel');
    if (this.mapType === FilinkMapEnum.baiDu) {
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
    } else if (this.mapType === FilinkMapEnum.google) {
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new GMapDrawingService(this.mapService.mapInstance);
    }
    this.addEventListener();
  }

  /**
   * 根据标记点id清除高亮选中样式
   * @param ids 清除高亮的点位id集合
   *
   */
  private clearSelectStyleById(ids: string[]): void {
    ids.forEach(item => {
      // 拿到标记点
      const marker = this.mapService.getMarkerById(item);
      const data = this.mapService.getMarkerDataById(item);
      // 获取智慧杆未高亮选中图标
      const imgUrl = CommonUtil.getFacilityPointIconUrl(defaultIconSize, data.deviceType, data.pointStatus);
      const icon = this.mapService.toggleIcon(imgUrl);
      marker.setIcon(icon);
    });
  }

  /**
   * 规划列表弹窗列表配置初始化
   */
  private initPlanListTable(): void {
    this.tablePlanListConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      notShowPrint: true,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 20, 30, 40],
      showSearchSwitch: true,
      showPagination: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      selectedIdKey: 'planId',
      keepSelected: true,
      columnConfig: PlanningListTableUtil.getColumnConfig(this, this.$nzI18n),
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.planListQueryCondition.pageCondition.pageNum = 1;
        this.planListQueryCondition.filterConditions = event;
        this.refreshPlanList();
      },
      // 勾选
      handleSelect: (e: PlanInfoModel[]) => {
        this.selectPlanList = e;
        this.planConfirmDisabled = _.isEmpty(e);
      },
      // 排序
      sort: (event: SortCondition) => {
        this.planListQueryCondition.sortCondition = event;
        this.refreshPlanList();
      },
    };
  }

  /**
   * 刷新规划列表
   */
  private refreshPlanList(): void {
    this.tablePlanListConfig.isLoading = true;
    this.$planProjectForCommonService.selectPlanList(this.planListQueryCondition).subscribe((result: ResultModel<PlanInfoModel[]>) => {
      this.tablePlanListConfig.isLoading = false;
      this.planListDataSet = result.data || [];
      this.planListPageBean.pageIndex = result.pageNum;
      this.planListPageBean.Total = result.totalCount;
      this.planListPageBean.pageSize = result.size;
    });
  }

  /**
   * 初始化型号预设置表格配置
   */
  private initModelPresetTable(): void {
    this.modelPresetTableConfig = {
      isDraggable: true,
      simplePageTotalShow: true,
      simplePage: true,
      isLoading: false,
      outHeight: 108,
      notShowPrint: true,
      showSizeChanger: false,
      showSearchSwitch: true,
      showPagination: true,
      scroll: {x: '510px', y: '340px'},
      columnConfig: [
        { // 选择
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        // { // 序号
        //   type: 'serial-number',
        //   width: 62,
        //   title: this.commonLanguage.serialNumber,
        //   fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        // },
        { // 规划名称
          title: this.language.planName, key: 'planName', width: 150,
          isShowSort: true,
          searchable: true,
          // configurable: false,
          searchConfig: {type: 'input'}
        },
        { // 默认型号
          title: this.language.defaultModel,
          key: 'productModel', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // 供应商
          title: this.productLanguage.supplier,
          key: 'supplierName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 操作列
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      rightTopButtons: [
        {
          // 清空已选规划按钮
          text: this.language.clearPlan,
          iconClassName: 'fiLink-clear-all-icon',
          needConfirm: false,
          handle: () => {
            if (_.isEmpty(this.modelPresetDataAll)) {
              this.$message.info(this.language.noData);
              return;
            }
            // 清空规划二次确认弹窗
            this.$modalService.confirm(
              {
                nzTitle: this.language.confirmEmptyTitle,
                nzOkType: 'danger',
                nzContent: this.language.confirmEmptyPlanContent,
                nzOkText: this.commonLanguage.cancel,
                nzMaskClosable: false,
                nzOnOk: () => {
                },
                nzCancelText: this.commonLanguage.confirm,
                nzOnCancel: () => {
                  this.modelPresetDataAll = [];
                  this.selectPlanList = [];
                  this.pointDataInMap = _.cloneDeep(this.existingWisdomData);
                  // 已选智慧杆列表删除该规划下的点位，且不清除编辑时已添加至该项目的点位
                  this.selectWisdomAll = _.cloneDeep(this.existingWisdomData);
                  this.reRenderMapPoint();
                }
              }
            );
          }
        },
        {
          // 批量删除规划
          text: this.language.batchDelete,
          iconClassName: 'fiLink-delete',
          needConfirm: false,
          handle: (e) => {
            if (_.isEmpty(e)) {
              this.$message.info(this.language.noneData);
              return;
            }
            this.deleteModelPreset(e);
          }
        }
      ],
      operation: [
        // 设置型号
        {
          text: this.language.setModel,
          className: 'fiLink-flink_shezhixinghao-icon',
          handle: (e) => {
            this.currentPlanData.planId = e.planId;
            this.currentPlanData.productId = e.productId;
            this.isShowProductList = true;
          }
        },
        // 删除
        {
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          needConfirm: false,
          canDisabled: true,
          handle: (e) => {
            this.deleteModelPreset([e]);
          }
        }
      ],
      // 搜索
      handleSearch: (event) => {
        const queryCondition: QueryConditionModel = new QueryConditionModel();
        queryCondition.filterConditions = event;
        this.refreshModelPresetList(1, 5, queryCondition);
      },
      // 排序
      sort: (event) => {
        const queryCondition: QueryConditionModel = new QueryConditionModel();
        queryCondition.sortCondition.sortField = event.sortField;
        queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshModelPresetList(1, 5, queryCondition);
      }
    };
  }


  /**
   * 初始化已选智慧杆列表表格配置
   */
  private initSelectWisdomTable(): void {
    const columnConfig = PlanningListTableUtil.getWisdomListColumnConfig(this, this.$nzI18n);
    columnConfig.forEach(item => {
      item.configurable = false;
    });
    columnConfig.push(
      { // 操作列
        title: this.commonLanguage.operate,
        searchable: true,
        searchConfig: {type: 'operate'},
        key: '', width: 80,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      });
    this.selectWisdomTableConfig = {
      selectedIdKey: 'pointId',
      noIndex: true,
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      simplePageTotalShow: true,
      simplePage: true,
      notShowPrint: true,
      showSizeChanger: false,
      showSearchSwitch: true,
      showPagination: true,
      scroll: {x: '510px', y: '340px'},
      columnConfig: columnConfig,
      rightTopButtons: [
        {
          // 清空已选智慧杆
          text: this.language.clearWisdom,
          iconClassName: 'fiLink-clear-all-icon',
          handle: () => {
            if (_.isEmpty(this.selectWisdomAll)) {
              this.$message.info(this.language.noData);
              return;
            }
            if (!this.judgeCanDelete(this.selectWisdomAll)) {
              this.$message.info(this.language.cannotDelete);
              return;
            }
            // 清空智慧杆二次弹窗确认
            this.$modalService.confirm({
              nzTitle: this.language.confirmEmptyTitle,
              nzOkType: 'danger',
              nzContent: this.language.confirmEmptyWisdomContent,
              nzOkText: this.commonLanguage.cancel,
              nzMaskClosable: false,
              nzOnOk: () => {
              },
              nzCancelText: this.commonLanguage.confirm,
              nzOnCancel: () => {
                this.selectWisdomAll = [];
                this.refreshSelectWisdomList(1, 5);
                this.clearAllMarkerPoint();
                this.renderPlanPoint(this.pointDataInMap);
                this.showOrHideMarkers();
              }
            });
          }
        },
        {
          // 批量删除已选智慧杆
          text: this.language.batchDelete,
          iconClassName: 'fiLink-delete',
          needConfirm: false,
          canDisabled: true,
          handle: (e: WisdomPointInfoModel[]) => {
            if (_.isEmpty(e)) {
              this.$message.info(this.language.noneData);
              return;
            }
            if (!this.judgeCanDelete(e)) {
              this.$message.info(this.language.cannotDelete);
              return;
            }
            this.deleteWisdom(e.map(item => item.pointId));
          }
        }
      ],
      operation: [
        // 删除
        {
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          needConfirm: false,
          canDisabled: true,
          handle: (e: WisdomPointInfoModel) => {
            if (!this.judgeCanDelete([e])) {
              this.$message.info(this.language.cannotDelete);
              return;
            }
            this.deleteWisdom([e.pointId]);
          }
        }
      ],
      // 排序
      sort: (event) => {
        const queryCondition: QueryConditionModel = new QueryConditionModel();
        queryCondition.sortCondition.sortField = event.sortField;
        queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshSelectWisdomList(1, 5, queryCondition);
      },
      // 搜索
      handleSearch: (event) => {
        const queryCondition: QueryConditionModel = new QueryConditionModel();
        queryCondition.filterConditions = event;
        this.refreshSelectWisdomList(1, 5, queryCondition);
      },
    };
  }

  /**
   * 查询当前窗口下，根据规划id查询该规划中没有分配项目的智慧杆点位
   */
  private selectPointByPlanIdAndNoProject(): Promise<PlanPointModel> {
    // 项目选中的规划
    const planIdList = [];
    this.modelPresetDataAll.forEach(item => {
      if (item.productId) {
        planIdList.push(item.planId);
      }
    });
    // 当前窗口经纬度
    const points = MapServiceUtil.getWindowIsArea(this.mapService.mapInstance);
    const params = {
      planIdList: planIdList,
      points: points
    };
    return new Promise((resolve, reject) => {
      // 查询型号预设置列表选择了型号的规划在当前窗口下的智慧杆点位数据
      this.$planProjectForCommonService.selectPointByPlanIdAndNoProject(params).subscribe((result: ResultModel<PlanPointModel>) => {
        if (result.code === ResultCodeEnum.success && result.data) {
          if (!result.data.pointInfoList) {
            if (result.data.allUsed) {
              this.$message.info(`该规划下没有可分配的还未添加至项目的点位`);
            }
          } else {
            result.data.pointInfoList.forEach(item => {
              item['facilityId'] = item.pointId;
              item['lng'] = item.xposition;
              item['lat'] = item.yposition;
              item['cloneCode'] = item.planId;
              item['code'] = null;
              item['show'] = true;
              item['deviceType'] = 'D002';
              // 去除问号
              item['address'] = item.address ? item.address.replace(/\?/g, '') : item.address;
              item ['statusIconClass'] = PointStatusIconEnum[item.pointStatus];
              item['productModel'] = this.modelPresetDataAll.filter(v => v.planId === item.planId)[0].productModel;
              item['pointModel'] = this.modelPresetDataAll.filter(v => v.planId === item.planId)[0].pointModel;
              item['productId'] = this.modelPresetDataAll.filter(v => v.planId === item.planId)[0].productId;
              item['supplierName'] = this.modelPresetDataAll.filter(v => v.planId === item.planId)[0].supplierName;
            });
            // 清除设施或设备以外所有的点
            this.clearAllMarkerPoint();
            // 要渲染到地图的点
            this.currentWindowPointData = result.data.pointInfoList;
            // 清空要渲染的点位数据
            this.pointDataInMap = [];
            // 当前窗口未归属项目的点位数据加上本项目之前已存在的点位数据
            this.pointDataInMap = this.pointDataInMap.concat(this.currentWindowPointData, this.existingWisdomData);
            // 去重
            this.pointDataInMap = _.uniqBy(this.pointDataInMap, 'pointId');

            // 地图中的点部分型号被修改过，地图点位渲染情况以已选智慧杆列表型号为准
            if (!_.isEmpty(this.selectWisdomAll)) {
              this.pointDataInMap.forEach(item => {
                this.selectWisdomAll.forEach(_item => {
                  if (item.pointId === _item.pointId) {
                    item.productId = _item.productId;
                    item.productModel = _item.productModel;
                    item.pointModel = _item.pointModel;
                    item.supplierName = _item.supplierName;
                  }
                });
              });
            }
            this.renderPlanPoint(this.pointDataInMap);
            if (!_.isEmpty(this.selectWisdomAll)) {
              this.highLightDevice(this.selectWisdomAll);
            }
            this.showOrHideMarkers();
            resolve(result.data);
          }
        }
      }, (error) => {
        this.$message.error(this.indexLanguage.networkTips);
        reject(error);
      });
    });

  }

  /**
   * 清除所有地图标记点
   *
   */
  private clearAllMarkerPoint(): void {
    // 清除设施或设备以外所有的点
    if (this.mapService.markerClusterer) {
      if (this.mapService.mapInstance) {
        this.mapService.mapInstance.clearOverlays();
      }
      if (this.mapService.markerClusterer) {
        this.mapService.markerClusterer.clearMarkers();
      }
    }
  }

  /**
   * 删除已选智慧杆
   */
  private deleteWisdom(deleteIds: string[]): void {
    // 删除智慧杆二次确认弹窗
    this.$modalService.confirm(
      {
        nzTitle: this.language.confirmDeleteTitle,
        nzOkType: 'danger',
        nzContent: this.language.confirmDeleteWisdomContent,
        nzOkText: this.commonLanguage.cancel,
        nzMaskClosable: false,
        nzOnOk: () => {
        },
        nzCancelText: this.commonLanguage.confirm,
        nzOnCancel: () => {
          // 列表去除选中的删除
          this.selectWisdomAll = this.selectWisdomAll.filter(item => {
            return !deleteIds.includes(item.pointId);
          });
          this.refreshSelectWisdomList(1, 5);
          this.clearSelectStyleById(deleteIds);
        }
      }
    );
  }

  /**
   * 删除型号预设置数据
   * @param  data 要删除的型号预设置数据
   */
  private deleteModelPreset(data): void {
    this.$modalService.confirm(
      {
        nzTitle: this.language.confirmDeleteTitle,
        nzOkType: 'danger',
        nzContent: this.language.confirmDeletePlanContent,
        nzOkText: this.commonLanguage.cancel,
        nzMaskClosable: false,
        nzOnOk: () => {
        },
        nzCancelText: this.commonLanguage.confirm,
        nzOnCancel: () => {
          data.forEach(plan => {
            // 规划列表删除所选规划
            this.modelPresetDataAll = this.modelPresetDataAll.filter(item => item.planId !== plan.planId);
            // 地图上删除该规划下的点位，且不清除编辑时已添加至该项目的点位
            this.pointDataInMap = this.pointDataInMap.filter(item => {
              return (this.existingWisdomData.map(v => v.pointId).includes(item.pointId) || item.planId !== plan.planId);
            });
            // 已选智慧杆列表删除该规划下的点位，且不清除编辑时已添加至该项目的点位
            this.selectWisdomAll = this.selectWisdomAll.filter(item => {
              return (this.existingWisdomData.map(v => v.pointId).includes(item.pointId) || item.planId !== plan.planId);
            });
            this.selectPlanList = _.cloneDeep(this.modelPresetDataAll.filter(item => item.planId !== plan.planId));
          });
          this.reRenderMapPoint();
        }
      }
    );
  }

  /**
   * 根据点位重新渲染地图
   */
  private reRenderMapPoint(): void {
    // 刷新型号预设值列表
    this.refreshModelPresetList(1, 5);
    // 清除地图标记点
    this.clearAllMarkerPoint();
    // 渲染地图全部点
    this.renderPlanPoint(this.pointDataInMap);
    // 根据智慧杆状态勾选显示/隐藏对应点
    this.showOrHideMarkers();
    // 刷新已选智慧杆列表
    this.refreshSelectWisdomList(1, 5);
    // 地图高亮已选智慧杆列表中对应点位
    this.highLightDevice(this.selectWisdomAll);
  }

  /**
   * 判断是否可以删除
   * @param data 选中要删除的数据
   */
  private judgeCanDelete(data): boolean {
    let canDelete = true;
    data.forEach(item => {
      if (item.pointStatus === PointStatusEnum.hasBeenBuilt) {
        canDelete = false;
      }
    });
    return canDelete;
  }
}
