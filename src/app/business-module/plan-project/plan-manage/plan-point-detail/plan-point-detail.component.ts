import {AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {MapServiceUtil} from '../../../../shared-module/service/map-service/map-service.util';
import {BMapPlusService} from '../../../../shared-module/service/map-service/b-map/b-map-plus.service';
import {GMapPlusService} from '../../../../shared-module/service/map-service/g-map/g-map-plus.service';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ArrangementNumberEnum} from '../../../../core-module/enum/index/arrangement-number-enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {num} from '../../../../core-module/const/index/index.const';
import {GMapDrawingService} from '../../../../shared-module/service/map-service/g-map/g-map-drawing.service';
import {BMAP_DRAWING_POLYLINE, BMAP_DRAWING_RECTANGLE} from '../../../../shared-module/component/map-selector/map.config';
import {BMapDrawingService} from '../../../../shared-module/service/map-service/b-map/b-map-drawing.service';
import {MapLinePointUtil} from '../../../../shared-module/util/map-line-point-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {StepIndexEnum} from '../../../../core-module/enum/index/index.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {FacilityForCommonService} from '../../../../core-module/api-service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ColumnConfig, TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {PlanningListTableUtil} from '../../../../core-module/business-util/project/planning-list-table.util';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {PlanApiService} from '../../share/service/plan-api.service';
import {PointParamsModel} from '../../share/model/point-params.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {PlanPointRender} from '../../../../shared-module/component/plan/plan-point-render';
import {PointStatusEnum} from '../../../../core-module/enum/plan/point-status.enum';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DELETE_BTN, RENAME, SKIP, UN_SAVE} from '../../share/const/plan-project.const';
import {PointStatusIconEnum} from '../../../../core-module/enum/plan/point-status-icon.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {MapConfig as BMapConfig} from '../../../../shared-module/component/map/b-map.config';
import {WisdomPointInfoModel} from '../../../../core-module/model/plan/wisdom-point-info.model';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {PageSizeEnum} from '../../../../shared-module/enum/page-size.enum';
import * as lodash from 'lodash';
import {PlanProjectForCommonService} from '../../../../core-module/api-service/plan-project/plan-project-for-common.service';

declare const $;
declare const BMap;

/**
 * 录入规划智慧杆
 */
@Component({
  selector: 'app-plan-point-detail',
  templateUrl: './plan-point-detail.component.html',
  styleUrls: ['./plan-point-detail.component.scss']
})
export class PlanPointDetailComponent extends PlanPointRender implements OnInit, OnDestroy {
  // 区域选择模板
  @ViewChild('areaSelector') areaSelector: TemplateRef<any>;
  // 删除确认模板
  @ViewChild('deleteConfirmation') deleteConfirmation: TemplateRef<any>;
  // 重命名确认模板
  @ViewChild('renameConfirmation') renameConfirmation: TemplateRef<any>;
  // 删除确认表格模板
  @ViewChild('deleteTable') deleteTable: TableComponent;
  // 智慧杆状态
  @ViewChild('pointStatusTemp') pointStatusTemp: TemplateRef<HTMLDocument>;
  // 页面标题
  public pageTitle: string;
  // 是否正处于创建中
  public isCreating: boolean = false;
  // 创建规划弹框是否显示
  public createPlanVisible: boolean = false;

  // 是否只显示当前规划
  public showCurrentPlan: boolean = false;
  // 规划查询条件
  public planQueryCondition = new QueryConditionModel();
  // 规划点位查询条件
  public planPointQueryCondition = new QueryConditionModel();

  // 步骤常量
  public stepNum = num;
  // 当前步骤
  public stepIndex: number = 0;
  // 第一步的表单
  public formColumnFirst: FormItem[] = [];
  // 第二步的表单
  public formColumnSecond: FormItem[] = [];
  // 第一步表单状态
  public formStatusFirst: FormOperate;
  // 第二步表单状态
  public formStatusSecond: FormOperate;
  // 下一步按钮状态
  public isDisabledNext: boolean = false;
  // 确认按钮状态
  public isDisabledOk: boolean = true;

  // 画线参数 第一步第二步的值
  public lineParameters: any = {};
  // 保存loading状态
  public isLoading: boolean = false;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 规划语言包
  public language: PlanProjectLanguageInterface;
  // 公共国际化语言包
  public commonLanguage: CommonLanguageInterface;
  // 当前选择的区域名称
  public selectAreaName: string;
  // 区域树是否显示
  public treeVisible: boolean = false;

  // 已选智慧杆列表当前页数据源
  public selectWisdomDataSet = [];
  // 已选智慧杆列表表格配置
  public selectWisdomTableConfig: TableConfigModel;
  // 已选智慧杆列表翻页
  public selectWisdomPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 已选智慧杆表格查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 选中的所有数据源
  public selectedAllPoint: any[] = [];

  // 已选智慧杆列表当前页数据源
  public renameWisdomDataSet = [];
  // 已选智慧杆列表表格配置
  public renameWisdomTableConfig: TableConfigModel;
  // 已选智慧杆列表翻页
  public renameWisdomPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 选中的所有数据源
  public renameAllPoint: any[] = [];

  // 当前规划下的点列表显示
  public currentPlanPointListShow: boolean = false;
  public currentPlanPointListConfig: TableConfigModel;
  public currentPlanPointList: any[] = [];
  public currentPlanPointPageList: any[] = [];
  public currentPlanPointListPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  public currentPlanPointListQueryCondition: QueryConditionModel = new QueryConditionModel();

  // 搜索后的选项
  public searchOptions: any[] = [];
  // 智慧杆状态枚举
  public pointStatusEnum = PointStatusEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  public treeLoading = false;
  public checkPointStatus = [];
  // 点位状态面板显示隐藏
  public pointStatusPanelShow: boolean = false;
  // 地图服务类
  public mapService: BMapPlusService | GMapPlusService;
  // 地图绘制类
  public mapDrawUtil: GMapDrawingService;
  public currentWindowPointData: any = [];
  // 规划点
  public planPoint: any[] = [];
  // 绘制类型
  private drawType: string;
  // 线覆盖物
  private lineOverlays: any;
  // 是否开启编辑模式
  private isEnableEdit: boolean = false;
  // 页面类型
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // 当前规划id
  private planId: string;
  // 规划名称
  private planName: string;
  // 区域树实列
  private treeInstance: any;
  // 区域数据
  private areaNodes: AreaModel[] = [];
  // 关闭订阅流
  private destroy$ = new Subject<any>();
  // 删除类型
  private deleteType: string;
  // 保存规划节流阀
  private savePlanThrottle: boolean = false;

  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              private $active: ActivatedRoute,
              public $mapLinePointUtil: MapLinePointUtil,
              private $facilityCommonService: FacilityForCommonService,
              public $planApiService: PlanApiService,
              private $modal: NzModalService,
              private $ruleUtil: RuleUtil,
              public $message: FiLinkModalService,
              public $planProjectForCommonService: PlanProjectForCommonService) {
    super($planProjectForCommonService);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 获取页面使用的语言包
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);

    // 获取点位状态checkbook配置
    const arr = CommonUtil.codeTranslate(PointStatusEnum, this.$nzI18n, null, LanguageEnum.planProject) as any[];
    arr.forEach(item => {
      item.value = item.code;
      item.checked = true;
    });
    arr.push({label: this.language.unSave, value: UN_SAVE, checked: true});
    this.checkPointStatus = arr;

    // 根据路由控制页面
    this.$active.queryParams.pipe((takeUntil(this.destroy$))).subscribe(params => {
      this.pageType = this.$active.snapshot.params.type;
      this.planId = params.id;
      this.planName = params.planName;
      this.queryPlanPointByPlanId(this.planId);
      if (this.pageType !== OperateTypeEnum.add) {
        // 修改页面逻辑
        this.pageTitle = this.language.editPlanPoint;
      } else {
        // 新增页面逻辑
        this.pageTitle = this.language.addPlanPoint;
      }
      this.showCurrentPlan = true;
      this.planQueryCondition.filterConditions = [new FilterCondition('planId', OperatorEnum.in, [this.planId])];
      this.planPointQueryCondition.filterConditions.push(new FilterCondition('planId', OperatorEnum.in, [this.planId]));
      // 查询所有规划数据
      this.queryPlanData();
    });

    // 获取区域数据
    this.getAreaData();
    // 获取全部点位模型
    this.selectAllPointModel().then((modelList: any[]) => {
      const pointModelList = modelList.map(item => {
        return {label: item, code: item};
      });
      // 初始化创建规划表单数据
      this.initColumn(pointModelList);
    });

    // 初始化已选择智慧杆点位列表配置(用于删除列表弹框)
    this.initSelectWisdomTable();
    // 初始化当前规划点位列表配置
    this.initCurrentPlanPointList();
    // 初始化地图
    this.initMap();
    // 添加地图事件
    this.addMapEvent();

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  /**
   * 切换显示当前规划
   * param event
   */
  public toggleShowPlan(event: any): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.isCreating) {
      return;
    }
    this.showCurrentPlan = !this.showCurrentPlan;
    if (this.showCurrentPlan) {
      this.planQueryCondition.filterConditions = [new FilterCondition('planId', OperatorEnum.in, [this.planId])];
      this.planPointQueryCondition.filterConditions.push(new FilterCondition('planId', OperatorEnum.in, [this.planId]));
    } else {
      const index = this.planPointQueryCondition.filterConditions.findIndex(item => item.filterField === 'planId');
      if (index > -1) {
        this.planPointQueryCondition.filterConditions.splice(index, 1);
      }
      this.planQueryCondition.filterConditions = [];
    }
    this.queryPlanData(true).then(() => {
      this.triggerZoomEnd();
    });

  }

  /**
   * 点位状态多选框变化事件
   * param event
   */
  public checkPointStatusChange(event: any[]): void {
    const arr: any[] = event.filter(item => item.checked).map(item => item.value);
    this.planPointQueryCondition.filterConditions = [];
    if (arr.length) {
      this.planPointQueryCondition.filterConditions = [new FilterCondition('pointStatus', OperatorEnum.in, arr.filter(item => item !== UN_SAVE))];
    }
    // 如果当前是层级是展示点位层级则查点
    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      if (arr.filter(item => item !== UN_SAVE).length) {
        this.queryPlanPointData().then(() => {
          this.handleUnSavePoint(arr);
        });
      } else {
        // 只选择了"未保存"时则不调用查询接口
        // 清除点
        if (this.mapService.mapInstance) {
          this.mapService.mapInstance.clearOverlays();
        }
        if (this.mapService.markerClusterer) {
          this.mapService.markerClusterer.clearMarkers();
        }
        this.handleUnSavePoint(arr);
      }
    } else {
      this.handleUnSavePoint(arr);
    }
  }

  /**
   * 显示创建规划弹框
   */
  public showCreatePlanModal(): void {
    if (this.planPoint.length) {
      this.$modal.confirm({
        nzTitle: this.language.createPlanPointMsg,
        nzOkType: 'danger',
        nzContent: `<span>${this.language.createPlanPointContentMsg}</span>`,
        nzOkText: this.commonLanguage.cancel,
        nzMaskClosable: false,
        nzOnOk: () => {
        },
        nzCancelText: this.commonLanguage.confirm,
        nzOnCancel: () => {
          this.clearAllTempPoint();
          this.clearLineOverlays();
          this.planPoint = [];
          this.lineOverlays = null;
          this.createPlanVisible = true;
        }
      });
    } else {
      this.createPlanVisible = true;
    }
  }

  /**
   * 保存规划点位
   */
  public savePlanPoint(solution: string = ''): void {
    if (this.savePlanThrottle) {
      return;
    }
    // 开启节流阀防止重复提交
    this.savePlanThrottle = true;
    // 把画的线清除
    this.clearLineOverlays();
    const request = new PointParamsModel();
    request.planId = this.planId;
    const list = this.planPoint.map(item => {
      item.$detail.xposition = item.$detail.lng;
      item.$detail.yposition = item.$detail.lat;
      return item.$detail;
    });
    request.pointInfoList = list;
    request.pointNameList = list.map(item => item.pointName);
    request.startingNumber = this.lineParameters.startingNumber;
    request.solution = solution;
    this.$planApiService.insertPlanPoint(request).subscribe((result: ResultModel<string[]>) => {
      this.savePlanThrottle = false;
      if (result.code === ResultCodeEnum.success) {
        //  返回重复的名字list
        if (result.data && result.data.length) {
          this.renameAllPoint = result.data.map(item => {
            return {pointName: item};
          });
          this.renameWisdomDataSet = CommonUtil.frontEndQuery(this.renameAllPoint, new QueryConditionModel(), this.renameWisdomPageBean);
          this.createRenameModal();
        } else {
          // 新增成功
          this.$message.success(this.language.addPointSuccess);
          this.clearAllTempPoint();
          this.mapService.mapInstance.clearOverlays();
          this.planPoint = [];
          this.lineOverlays = null;
          // 根据当前地图层级渲染点
          if (this.mapService.getZoom() > BMapConfig.areaZoom) {
            this.queryPlanData(true);
            this.queryPlanPointData();
          } else {
            this.queryPlanData();
          }
          this.queryPlanPointByPlanId(this.planId);
          this.isCreating = false;
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.savePlanThrottle = false;
    });
  }

  /**
   * 撤销操作
   */
  public revoke(): void {
    //  将当前画的线和点删除
    this.clearLineOverlays();
    this.lineOverlays = null;
    this.isCreating = false;
    this.clearAllTempPoint();
    this.planPoint = [];
  }

  /**
   * 删除点位操作
   */
  public deletePlanPoint(deleteType: string): void {
    this.deleteType = deleteType;
    this.mapDrawUtil.open();
    this.mapDrawUtil.setDrawingMode(BMAP_DRAWING_RECTANGLE);
  }

  /**
   * 开启关闭编辑模式
   */
  public showModify(): void {
    // 如果当前正在绘制模式先关闭
    if (this.mapDrawUtil.getDrawingMode()) {
      this.mapDrawUtil.close();
      this.mapDrawUtil.setDrawingMode(null);
    }
    this.isEnableEdit = !this.isEnableEdit;
    if (this.isEnableEdit) {
      this.lineOverlays.enableEditing();
    } else {
      // 关闭编辑根据线段信息重新画点
      this.lineOverlays.disableEditing();
      this.clearAllTempPoint();
      this.drawCoordinateAdjustment(this.lineOverlays);
    }
  }

  /**
   * 地图画点上一步回到新增规划form
   */
  public previousStepHandle(): void {
    this.$router.navigate([`business/plan-project/plan-detail/update`], {preserveQueryParams: true}).then();
  }

  /**
   * 退出
   */
  public dropOut(): void {
    this.$message.confirm(this.language.completePlan, () => {
      this.$router.navigate(['business/plan-project/plan-list']).then();
    }, () => {
    });

  }

  /**
   * 关闭弹框
   */
  public closeModal(): void {
    this.createPlanVisible = false;
    this.treeVisible = false;
    this.treeInstance = null;
    this.selectAreaName = '';
    this.stepIndex = num.zero;
    this.formStatusFirst.resetData({});
    this.formStatusSecond.resetData({});
    this.isDisabledOk = true;
  }

  /**
   * 弹框内的下一步
   */
  public handleBack(): void {
    // 步骤条
    this.stepIndex = StepIndexEnum.back;
  }

  /**
   * 弹框内的下一步
   */
  public handleNext(): void {
    this.stepIndex = StepIndexEnum.next;
    this.lineParameters = Object.assign(this.lineParameters, this.formStatusFirst.getRealData());
  }

  /**
   * 弹框内的确定
   * 开启画线操作
   */
  public handleOk(): void {
    this.lineParameters = Object.assign(this.lineParameters, this.formStatusSecond.getRealData());
    this.closeModal();
    // 开启绘制
    this.mapDrawUtil.open();
    this.mapDrawUtil.setDrawingMode(BMAP_DRAWING_POLYLINE);
    this.drawType = BMAP_DRAWING_POLYLINE;
    this.isCreating = true;
  }

  /**
   * 表单回调函数
   */
  public formInstance(event: { instance: FormOperate }, step: number): void {
    if (step === num.one) {
      this.formStatusFirst = event.instance;
      event.instance.group.statusChanges.pipe((takeUntil(this.destroy$))).subscribe(() => {
        this.isDisabledNext = this.formStatusFirst.getValid();
      });
    } else {
      this.formStatusSecond = event.instance;
      event.instance.group.statusChanges.pipe((takeUntil(this.destroy$))).subscribe(() => {
        this.isDisabledOk = this.formStatusSecond.getRealValid();
      });
    }
  }

  /**
   * 清除所有的覆盖物
   */
  public clearLineOverlays(): void {
    this.mapService.removeOverlay(this.lineOverlays);
    this.mapDrawUtil.close();
    this.mapDrawUtil.setDrawingMode(null);
  }

  /**
   * 清除临时点
   */
  public clearAllTempPoint(): void {
    this.planPoint.forEach(item => {
      this.mapService.removeOverlay(item);
    });
  }

  /**
   * 重新新增临时点
   */
  public addAllTempPoint(): void {
    this.planPoint.forEach(item => {
      this.mapService.mapInstance.addOverlay(item);
    });
  }

  /**
   * 展开区域树
   */
  public openAreaTree(): void {
    this.treeVisible = !this.treeVisible;
    if (!this.treeInstance) {
      // 初始化 zTree
      const treeSetting = {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all'
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName'
          },
        },
        view: {
          showIcon: false,
          showLine: false
        },
        callback: {
          onCheck: (event, treeId, treeNode) => {
            this.selectAreaName = treeNode.areaName;
            this.lineParameters.areaName = treeNode.areaName;
            this.lineParameters.areaCode = treeNode.areaCode;
            this.formStatusFirst.resetControlData('area', this.selectAreaName);
          }
        }
      };
      this.treeInstance = $.fn.zTree.init($('#planPointArea'), treeSetting, this.areaNodes);
    }

  }

  /**
   * 获取区域数据
   */
  public getAreaData(): void {
    this.treeLoading = true;
    this.$facilityCommonService.queryAreaList().subscribe((res: ResultModel<AreaModel[]>) => {
      this.treeLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.areaNodes = res.data || [];
      }
    });
  }

  /**
   * 删除弹框列表分页
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 重命名弹框列表分页
   * param event
   */
  public renamePageChange(event: PageModel): void {
    const queryCondition = new QueryConditionModel();
    queryCondition.pageCondition.pageNum = event.pageIndex;
    queryCondition.pageCondition.pageSize = event.pageSize;
    this.renameWisdomDataSet = CommonUtil.frontEndQuery(this.renameAllPoint, queryCondition, this.renameWisdomPageBean);
  }

  /**
   * 当前点位列表分页
   * param event
   */
  public currentPlanPointListPageChange(event: PageModel): void {
    this.currentPlanPointListQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.currentPlanPointListQueryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCurrentPlanPointPageList();
  }

  /**
   * 处理未保存的点位
   */
  private handleUnSavePoint(arr: any[]): void {
    // 先清除未保存的点
    this.clearAllTempPoint();
    this.mapService.removeOverlay(this.lineOverlays);
    // 如果选中了unSave 再重新渲染未保存的点
    if (!arr || arr.length === 0) {
      // 清除点
      if (this.mapService.mapInstance) {
        this.mapService.mapInstance.clearOverlays();
      }
      if (this.mapService.markerClusterer) {
        this.mapService.markerClusterer.clearMarkers();
      }
      return;
    }
    if (arr.includes(UN_SAVE)) {
      this.addAllTempPoint();
      if (this.lineOverlays) {
        this.mapService.mapInstance.addOverlay(this.lineOverlays);
      }
    }
  }

  /**
   * 绘制坐标调整
   */
  private drawCoordinateAdjustment(e: any): void {
    this.planPoint = [];
    // 多少节线段，线段的长度
    const list = [];
    const linePoints = e.getPath();
    // 判断画线的操作
    if (linePoints && linePoints.length) {
      for (let i = 0; i < linePoints.length - 1; i++) {
        list.push({
          length: this.$mapLinePointUtil.getDistance(linePoints[i].lng, linePoints[i].lat, linePoints[i + 1].lng, linePoints[i + 1].lat),
          pointOne: linePoints[i],
          pointTwo: linePoints[i + 1]
        });
      }
    }
    // 不得超过20条线段
    if (list.length > 20) {
      this.$message.info(this.indexLanguage.noMoreThanLinesCanBeDrawnPleaseReselectToDraw);
      this.clearLineOverlays();
      return;
    }
    // 智慧杆数据
    let wisdomData = this.generateWisdomData();
    if (this.lineParameters.arrangementType === ArrangementNumberEnum.singleLine) {
      // 先判断生成的点位是否放得下
      wisdomData = this.$mapLinePointUtil.spliceData(this.lineParameters.spacing, list, wisdomData);
      // 单线
      this.$mapLinePointUtil.lineSegmentArrangement(wisdomData, list, this.lineParameters.spacing).forEach((item, index) => {
        // 画线 返回条线段的点
        const linePoint = this.$mapLinePointUtil.autoLinePointSingle(this.lineParameters.spacing,
          item.data, 0, list[index].pointOne, list[index].pointTwo,
          this.mapService);
        // 将每次画线的点放入规划点数组中
        this.planPoint.push(...linePoint);
      });
    } else {
      // 双线
      // 先判断生成的点位是否放得下
      wisdomData = this.$mapLinePointUtil.spliceData(this.lineParameters.spacing / 2, list, wisdomData, true);
      this.$mapLinePointUtil.doubleLineSegmentArrangement(wisdomData, list, this.lineParameters.spacing).forEach((item, index) => {
        const linePoint = this.$mapLinePointUtil.autoLinePointBoth(this.lineParameters.spacing,
          item.data, this.lineParameters.width, list[index].pointOne, list[index].pointTwo, this.mapService);
        // 将每次画线的点放入规划点数组中
        this.planPoint.push(...linePoint);
      });
    }
    // 创建地址解析器实例
    const geoCoder = new BMap.Geocoder();
    this.planPoint.forEach(item => {
      geoCoder.getLocation(item.point, (result) => {
        if (result && result.addressComponents) {
          item.$detail.address = `${result.addressComponents.province}?${result.addressComponents.city}?${result.addressComponents.district}?${result.address}`;
        }
      });
    });
  }

  /**
   * 根据第一步第二步的数据生成智慧杆数据
   */
  private generateWisdomData(): any[] {
    const wisdomData = [];
    for (let i = 0; i < this.lineParameters.count; i++) {
      wisdomData.push({
        pointName: `${this.lineParameters.prefix}_${String(Number(this.lineParameters.startingNumber) + i)}`,
        deviceId: CommonUtil.getUUid(),
        planName: this.planName,
        areaName: this.lineParameters.areaName,
        areaCode: this.lineParameters.areaCode,
        pointModel: this.lineParameters.pointModel,
        deviceType: DeviceTypeEnum.wisdom
      });
    }
    return wisdomData;
  }

  /**
   * 表单数据配置
   */
  private initColumn(pointModelList: any[]): void {
    this.formColumnFirst = [
      {
        label: this.language.area,
        key: 'area',
        type: 'custom',
        template: this.areaSelector,
        col: 24,
        require: true,
        rule: [
          {required: true},
        ],
        customRules: [],
        asyncRules: []
      },
      {
        label: this.language.count,
        key: 'count',
        type: 'input',
        col: 24,
        require: true,
        rule: [
          {required: true},
          this.$ruleUtil.oneToOneHundred()
        ],
        customRules: [],
        asyncRules: []
      },
      {
        label: this.language.model,
        key: 'pointModel',
        type: 'select',
        selectInfo: {
          data: pointModelList,
          label: 'label',
          value: 'code'
        },
        col: 24,
        require: true,
        rule: [{required: true}],
        customRules: [],
      },
      {
        label: this.language.prefix,
        key: 'prefix',
        type: 'input',
        col: 24,
        require: true,
        rule: [
          {required: true},
          // 不能包含下划线
          {pattern: '^((?!_).)*$', msg: this.commonLanguage.underscoresMsg}
        ],
        customRules: [],
        asyncRules: []
      },
      {
        label: this.language.startNumber,
        key: 'startingNumber',
        type: 'input',
        col: 24,
        require: true,
        rule: [
          {required: true},
          {max: 9999999},
          this.$ruleUtil.positiveInteger()
        ],
        customRules: [],
        asyncRules: []
      }
    ];
    this.formColumnSecond = [
      // 排布类型
      {
        label: this.indexLanguage.arrangementType,
        key: 'arrangementType',
        type: 'radio',
        width: 300,
        initialValue: ArrangementNumberEnum.singleLine,
        radioInfo: {
          data: [
            // 单线
            {label: this.indexLanguage.singleLine, value: ArrangementNumberEnum.singleLine},
            // 双线
            {label: this.indexLanguage.doubleLine, value: ArrangementNumberEnum.doubleLine},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key, formOperate) => {
          this.formStatusSecond.setColumnHidden(['width'], $event !== ArrangementNumberEnum.doubleLine);
          // 还原默认值15米
          this.formStatusSecond.resetControlData('width', 15);
        },
        require: true,
        rule: [{required: true}],
        customRules: [],
        asyncRules: []
      },
      {
        label: this.indexLanguage.spacing,
        key: 'spacing',
        type: 'input',
        initialValue: 50,
        require: true,
        width: 300,
        rule: [
          {required: true},
          this.$ruleUtil.oneToOneHundred()
        ],
        customRules: [],
        asyncRules: []
      },
      {
        label: this.indexLanguage.wide,
        key: 'width',
        type: 'input',
        initialValue: 15,
        require: true,
        hidden: true,
        width: 300,
        rule: [
          {required: true},
          this.$ruleUtil.oneToOneHundred()
        ],
        customRules: [],
        asyncRules: []
      }
    ];
  }

  /**
   * 初始化智慧杆删除确认table配置
   */
  private initSelectWisdomTable(): void {
    this.selectWisdomTableConfig = {
      noIndex: true,
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      notShowPrint: true,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 20, 30, 40],
      showSearchSwitch: true,
      showSearch: false,
      showPagination: true,
      keepSelected: true,
      selectedIdKey: 'pointId',
      scroll: {x: '510px', y: '340px'},
      columnConfig: PlanningListTableUtil.getDeleteWisdomColumnConfig(this, this.$nzI18n),
      operation: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }

  /**
   * 初始化当前规划所点位table配置
   */
  private initCurrentPlanPointList(): void {
    const columnConfig: ColumnConfig[] = [
      { // 序号
        type: 'serial-number',
        width: 62,
        title: this.commonLanguage.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '0px'}}
      },
      ...PlanningListTableUtil.getWisdomListColumnConfig(this, this.$nzI18n).filter(item => item.key),
      { // 操作列
        title: this.commonLanguage.operate,
        searchable: true,
        searchConfig: {type: 'operate'},
        key: '', width: 80,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
    this.currentPlanPointListConfig = {
      noIndex: true,
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      notShowPrint: true,
      showSizeChanger: false,
      showSearchSwitch: true,
      showPagination: true,
      simplePage: true,
      simplePageTotalShow: true,
      scroll: {x: '510px', y: '340px'},
      columnConfig: columnConfig,
      sort: (event: SortCondition) => {
        this.currentPlanPointListQueryCondition.sortCondition = event;
        this.queryCurrentPlanPointPageList();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.currentPlanPointListQueryCondition.pageCondition.pageNum = 1;
        this.currentPlanPointListQueryCondition.filterConditions = event;
        this.queryCurrentPlanPointPageList();
      },
      operation: [
        {
          text: this.commonLanguage.location, className: 'fiLink-location',
          handle: (currentIndex: WisdomPointInfoModel) => {
            const _lng = parseFloat(currentIndex.xposition);
            const _lat = parseFloat(currentIndex.yposition);
            // @ts-ignore
            this.mapService.setCenterAndZoom(_lng, _lat, BMapConfig.deviceZoom);
            this.highlightedPointId = currentIndex.pointId;
            this.triggerZoomEnd(BMapConfig.deviceZoom);
          }
        },
      ],
    };
  }

  /**
   * 初始化地图
   */
  private initMap(): void {
    this.mapService = MapServiceUtil.getPlusMap();
    this.mapService.createPlusMap('createWisdomDataMap');
    this.mapService.addLocationSearchControl('_suggestId', '_searchResultPanel');
    // 实例化鼠标绘制工具
    this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    this.mapDrawUtil.addEventListener('overlaycomplete', (e) => {
      const drawType = this.mapDrawUtil.getDrawingMode();
      // 绘制完成之后先关闭绘制模式
      this.mapDrawUtil.close();
      this.mapDrawUtil.setDrawingMode(null);
      switch (drawType) {
        // 画线操作
        case BMAP_DRAWING_POLYLINE:
          this.lineOverlays = e.overlay;
          this.drawCoordinateAdjustment(this.lineOverlays);
          break;
        // 框选操作
        case BMAP_DRAWING_RECTANGLE:
          // 获取框选内的点
          const pointStatus = this.selectWisdomTableConfig.columnConfig.find(item => item.key === 'pointStatus');
          if (this.deleteType === DELETE_BTN) {
            // 删除操作
            this.selectedAllPoint = this.currentWindowPointData.filter(item => e.overlay.containPoint(item.point)).map(item => item.$detail);
            pointStatus.searchable = true;
            pointStatus.isShowSort = true;
          } else {
            // 移除操作
            this.selectedAllPoint = this.planPoint.filter(item => e.overlay.containPoint(item.point)).map(item => item.$detail);
            pointStatus.searchable = false;
            delete pointStatus.isShowSort;
          }
          // 绘制完成删除框线
          this.mapService.removeOverlay(e.overlay);
          // 没有框到点不弹框
          if (!(this.selectedAllPoint && this.selectedAllPoint.length)) {
            this.$message.error(this.language.notSelectedMsg);
            return;
          }
          // 执行弹框删除操作
          // 获取删除弹框的第一页数据
          // 重置已选智慧杆列表翻页
          this.selectWisdomPageBean = new PageModel(PageSizeEnum.sizeFive);
          // 重置已选智慧杆表格查询条件
          this.queryCondition = new QueryConditionModel();
          this.refreshData();
          this.selectWisdomTableConfig.showSearch = false;
          this.selectWisdomTableConfig.selectedIdKey = this.deleteType === DELETE_BTN ? 'pointId' : 'deviceId';
          // 弹框显示点提示用户删除
          const modal = this.$modal.create({
            nzTitle: this.deleteType === DELETE_BTN ? this.language.deleteConfirmation : this.language.removeConfirmation,
            nzContent: this.deleteConfirmation,
            nzOkType: 'danger',
            nzWidth: 800,
            nzClassName: 'custom-create-modal',
            nzMaskClosable: false,
            nzFooter: [
              {
                label: this.commonLanguage.confirm,
                onClick: () => {
                  if (this.deleteType === DELETE_BTN) {
                    const ids = this.deleteTable.getDataChecked().map(item => item.pointId);
                    if (!ids.length) {
                      this.$message.error(this.language.selectWisdomMsg);
                      return;
                    }
                    this.handleDeletePlanPoint(ids).then(() => {
                      this.queryPlanPointData();
                      modal.destroy();
                    });
                  } else {
                    const checkedData = this.deleteTable.getDataChecked().map(item => item.deviceId);
                    if (!checkedData.length) {
                      this.$message.error(this.language.selectWisdomMsg);
                      return;
                    }
                    // 从后面往前删 防止索引改变
                    for (let i = this.planPoint.length - 1; i >= 0; i--) {
                      if (checkedData.includes(this.planPoint[i].$detail.deviceId)) {
                        this.mapService.removeOverlay(this.planPoint[i]);
                        this.planPoint.splice(i, 1);
                      }
                    }
                    modal.destroy();
                  }
                }
              },
              {
                // 授权按钮
                label: this.commonLanguage.cancel,
                type: 'danger',
                onClick: () => {
                  modal.destroy();
                }
              },
              {
                label: this.commonLanguage.cleanUp,
                type: 'danger',
                onClick: () => {
                  this.deleteTable.keepSelectedData.clear();
                  this.deleteTable.updateSelectedData();
                  this.deleteTable.checkStatus();
                }
              },
            ]
          });
          break;
        default:
          break;
      }
    });
    // 定位到当前城市
    const timer = setTimeout(() => {
      this.mapService.locateToUserCity();
      clearTimeout(timer);
    }, 300);
  }

  /**
   * 处理删除点位列表数据
   */
  private refreshData(): void {
    this.selectWisdomDataSet = lodash.cloneDeep(CommonUtil.frontEndQuery(this.selectedAllPoint, this.queryCondition, this.selectWisdomPageBean));
    this.selectWisdomDataSet.forEach(item => {
      item.statusIconClass = PointStatusIconEnum[item.pointStatus];
    });
  }

  /**
   * 处理删除点位数据
   * param ids
   */
  private handleDeletePlanPoint(ids: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$planApiService.deletePlanPoint(ids).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.language.deletePlanWisdomSuccess);
          // 删除跳第一页
          this.queryCondition.pageCondition.pageNum = 1;
          resolve();
        } else {
          this.$message.error(result.msg);
          reject();
        }
      }, () => {
        reject();
      });
    });
  }

  /**
   * 获取当时规划下的所有点
   * param planId
   */
  private queryPlanPointByPlanId(planId: string): void {
    this.$planApiService.selectPlanPointByPlanId(planId).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.currentPlanPointList = result.data || [];
        this.queryCurrentPlanPointPageList();
      }
    });
  }

  /**
   * 处理当前规划的列表数据
   */
  private queryCurrentPlanPointPageList(): void {
    this.currentPlanPointPageList = CommonUtil.frontEndQuery(this.currentPlanPointList, this.currentPlanPointListQueryCondition, this.currentPlanPointListPageBean);
    this.currentPlanPointPageList.forEach(item => {
      item.statusIconClass = PointStatusIconEnum[item.pointStatus];
      item.address = item.address ? item.address.replace(/\?/g, '') : item.address;
    });
  }

  /**
   * 查询所有的智慧杆型号
   * param id
   */
  private selectAllPointModel(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.$planApiService.selectAllPointModel().subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          // 规划不区分供应商，型号名字可相同 ,去重名字相同
          result.data = lodash.uniq(result.data);
          resolve(result.data);
        }
      });
    });
  }

  /**
   * 创建重命名弹框
   */
  private createRenameModal(): void {
    this.renameWisdomTableConfig = {
      noIndex: true,
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      notShowPrint: true,
      showSizeChanger: false,
      showSearchSwitch: false,
      simplePage: true,
      simplePageTotalShow: true,
      showPagination: true,
      scroll: {x: '200px', y: '340px'},
      columnConfig: [{ // 序号
        type: 'serial-number',
        width: 62,
        title: this.commonLanguage.serialNumber,
      },
        { // 智慧杆名称
          title: this.language.wisdomName, key: 'pointName', width: 80,
        }]
    };
    const modal = this.$modal.create({
      nzContent: this.renameConfirmation,
      nzOkType: 'danger',
      nzWidth: 500,
      nzClassName: 'custom-duplicate-name-modal custom-create-modal',
      nzMaskClosable: false,
      nzFooter: [
        {
          label: this.language.skip,
          onClick: () => {
            this.savePlanPoint(SKIP);
            modal.destroy();
          }
        },
        {
          label: this.language.rename,
          type: 'danger',
          onClick: () => {
            modal.destroy();
            this.savePlanPoint(RENAME);
          }
        },
      ]
    });
  }
}
