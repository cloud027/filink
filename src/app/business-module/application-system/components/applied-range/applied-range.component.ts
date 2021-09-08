import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {StrategyListModel} from '../../share/model/policy.control.model';
import {listFmt} from '../../share/util/tool.util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {GroupListModel} from '../../share/model/equipment.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ApplicationService} from '../../share/service/application.service';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {LoopModel} from '../../share/model/loop.model';
import {equipmentFmt} from '../../share/util/application.util';
import {PolicyEnum} from '../../share/enum/policy.enum';
import {TableColumnConfig} from '../../share/config/table-column.config';
import {StrategyListConst} from '../../share/const/application-system.const';
import {Router} from '@angular/router';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {LoopUtil} from '../../share/util/loop-util';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-applied-range',
  templateUrl: './applied-range.component.html',
  styleUrls: ['./applied-range.component.scss']
})
export class AppliedRangeComponent implements OnInit, OnDestroy, OnChanges {
  // 设备类型
  @ViewChild('equipmentTypeTemp')
  public equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemp')
  public equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 存储策略信息
  @Input()
  public lightingData: StrategyListModel = new StrategyListModel();
  // 是否为详情页面使用
  @Input()
  isDetail: boolean = false;
  // 表格数据
  public dataSet: EquipmentListModel[] = [];
  // 存储分组数据集合
  public groupSet: GroupListModel[] = [];
  // 信息发布策略不显示回路列表
  public isShow: boolean = true;
  // 存储分组数据集合
  public loopSet: LoopModel[] = [];
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 设施语言包
  public facilityLanguage: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 分页参数
  public groupPageBean: PageModel = new PageModel();
  // 分页参数
  public loopPageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 表格配置
  public tableGroupConfig: TableConfigModel;
  // 当前分组
  public currentGroup: GroupListModel;
  // 分组id集合
  public groupIds: Array<string> = [];
  // 表格配置
  public tableLoopConfig: TableConfigModel;
  // 多语言配置
  public language: OnlineLanguageInterface;
  // 设备id集合
  public equipmentIds: Array<string> = [];
  // 回路id集合
  public loopIds: Array<string> = [];
  // 分组详情弹窗
  public showGroupViewDetail: boolean = false;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 表格所需要的条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 表格所需要的条件
  private groupQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 表格所需要的条件
  private loopQueryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 路由
    private $router: Router,
    // 提示
    private $message: FiLinkModalService,
    // 接口服务
    private $applicationService: ApplicationService
  ) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 信息发布策略不显示回路列表
    this.isShow = this.lightingData._strategyType !== StrategyListConst.information && this.lightingData._strategyType !== StrategyListConst.broadcast;
    this.initTableConfig();
    this.initGroupTableConfig();
    this.initLoopTableConfig();
    this.initTableRender();
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.equipmentTypeTemp = null;
    this.equipmentStatusFilterTemp = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.lightingData.strategyRefList.length) {
      this.ngOnInit();
    }
  }

  /**
   * 列表分页查询
   * @ param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshEquipmentData();
  }

  /**
   * 分组分页查询
   * @ param event
   */
  public groupPageChange(event: PageModel): void {
    this.groupQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.groupQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshGroupData();
  }

  /**
   * 回路分页查询
   * @ param event
   */
  public loopPageChange(event: PageModel): void {
    this.loopQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.loopQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshLoopData();
  }

  /**
   * 初始化表格的数据
   */
  private initTableRender(): void {
    const strategyRefList = listFmt(this.lightingData.strategyRefList);
    this.equipmentIds = strategyRefList.equipment.map(item => item.refId);
    this.groupIds = strategyRefList.group.map(item => item.refId);
    this.loopIds = strategyRefList.loop.map(item => item.refId);
    if (this.equipmentIds.length) {
      this.refreshEquipmentData();
    } else {
      this.tableConfig.isLoading = false;
    }
    if (this.groupIds.length) {
      this.refreshGroupData();
    } else {
      this.tableGroupConfig.isLoading = false;
    }
    if (this.loopIds.length) {
      this.refreshLoopData();
    } else {
      this.tableLoopConfig.isLoading = false;
    }
  }

  /**
   * 设备初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      outHeight: 108,
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      notShowPrint: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: TableColumnConfig.equipmentColumnConfig(
        this.language,
        this.languageTable,
        this.equipmentTypeTemp,
        this.equipmentStatusFilterTemp,
        this.$nzI18n),
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      // 排序
      sort: (event: SortCondition) => {
        if (this.equipmentIds.length) {
          this.queryCondition.sortCondition.sortField = event.sortField;
          this.queryCondition.sortCondition.sortRule = event.sortRule;
          this.refreshEquipmentData();
        }
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        if (this.equipmentIds.length) {
          this.queryCondition.pageCondition.pageNum = 1;
          this.queryCondition.filterConditions = event;
          this.refreshEquipmentData();
        }
      }
    };
  }

  /**
   * 分组初始化表格配置
   */
  private initGroupTableConfig(): void {
    this.tableGroupConfig = {
      outHeight: 108,
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      notShowPrint: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: TableColumnConfig.groupColumnConfig(this.language, this.languageTable),
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        { // 分组详情
          permissionCode: '03-9-3',
          text: this.languageTable.frequentlyUsed.groupDetail,
          className: 'fiLink-view-detail',
          handle: (data: GroupListModel) => {
            this.currentGroup = data;
            this.showGroupViewDetail = true;
          },
        },
      ],
      // 排序
      sort: (event: SortCondition) => {
        if (this.groupIds.length) {
          this.groupQueryCondition.sortCondition.sortField = event.sortField;
          this.groupQueryCondition.sortCondition.sortRule = event.sortRule;
          this.refreshGroupData();
        }
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        if (this.groupIds.length) {
          this.groupQueryCondition.pageCondition.pageNum = 1;
          this.groupQueryCondition.filterConditions = event;
          this.refreshGroupData();
        }
      }
    };
  }

  /**
   * 回路初始化表格配置
   */
  private initLoopTableConfig(): void {
    this.tableLoopConfig = {
      outHeight: 108,
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      columnConfig: TableColumnConfig.loopColumnConfig(
        this.facilityLanguage,
        this.assetLanguage,
        this.$nzI18n),
      showPagination: true,
      bordered: false,
      showSearch: false,
      // 排序
      sort: (event: SortCondition) => {
        if (this.loopIds.length) {
          this.loopQueryCondition.sortCondition.sortField = event.sortField;
          this.loopQueryCondition.sortCondition.sortRule = event.sortRule;
          this.refreshLoopData();
        }
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        if (this.loopIds.length) {
          this.loopQueryCondition.pageCondition.pageNum = 1;
          this.loopQueryCondition.filterConditions = event;
          this.refreshLoopData();
        }
      }
    };
  }

  /**
   * 设备列表表格数据
   */
  private refreshEquipmentData() {
    let response: Observable<ResultModel<EquipmentListModel[]>>;
    // 如果详情页面 使用策略id查询
    if (this.isDetail) {
      // 修改为使用策略id 查询设备列表
      this.queryCondition.bizCondition.strategyId = this.lightingData.strategyId;
      response = this.$applicationService.equipmentListByStrategy(this.queryCondition)
    } else {
      const flag = this.queryCondition.filterConditions.some(item => item.filterField === PolicyEnum.equipmentId);
      if (!flag) {
        const equipmentId = new FilterCondition(PolicyEnum.equipmentId, OperatorEnum.in, this.equipmentIds);
        this.queryCondition.filterConditions.push(equipmentId);
      }
      response =  this.$applicationService.equipmentListByPage(this.queryCondition);
    }
    response.subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        const {totalCount, pageNum, size, data} = res;
        this.dataSet = data || [];
        equipmentFmt(this.dataSet, this.$nzI18n);
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
   * 分组列表表格数据
   */
  private refreshGroupData() {
    // 默认查询选中的id数据
    const flag = this.groupQueryCondition.filterConditions.some(item => item.filterField === PolicyEnum.groupId);
    if (!flag) {
      const equipmentId = new FilterCondition(PolicyEnum.groupId, OperatorEnum.in, this.groupIds);
      this.groupQueryCondition.filterConditions.push(equipmentId);
    }
    this.tableGroupConfig.isLoading = true;
    this.$applicationService.queryGroupInfoList(this.groupQueryCondition).subscribe((res: ResultModel<GroupListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableGroupConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.groupSet = data;
        this.groupPageBean.Total = totalCount;
        this.groupPageBean.pageIndex = pageNum;
        this.groupPageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableGroupConfig.isLoading = false;
    });
  }

  /**
   * 回路列表表格数据
   */
  private refreshLoopData(): void {
    // 默认查询选中的id数据
    const flag = this.loopQueryCondition.filterConditions.some(item => item.filterField === PolicyEnum.loopIds);
    if (!flag) {
      const loopId = new FilterCondition(PolicyEnum.loopIds, OperatorEnum.in, this.loopIds);
      this.loopQueryCondition.filterConditions.push(loopId);
    }
    this.tableLoopConfig.isLoading = true;
    this.$applicationService.loopListByPage(this.loopQueryCondition).subscribe((res: ResultModel<LoopModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableLoopConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.loopSet = data;
        LoopUtil.loopFmt(this.loopSet, this.$nzI18n);
        this.loopPageBean.Total = totalCount;
        this.loopPageBean.pageIndex = pageNum;
        this.loopPageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableLoopConfig.isLoading = false;
    });
  }
}
