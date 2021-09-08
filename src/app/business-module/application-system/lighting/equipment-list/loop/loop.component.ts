import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ApplicationService} from '../../../share/service/application.service';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ElectricConst, RouterJumpConst} from '../../../share/const/application-system.const';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LoopModel} from '../../../share/model/loop.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {DistributeModel} from '../../../share/model/distribute.model';
import {Router} from '@angular/router';
import {TableColumnConfig} from '../../../share/config/table-column.config';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {LoopUtil} from '../../../share/util/loop-util';
import {LightLoopTableEnum} from '../../../share/enum/auth.code.enum';
import {ControlInstructEnum} from '../../../../../core-module/enum/instruct/control-instruct.enum';
import {LoopViewDetailModel} from '../../../../../core-module/model/loop/loop-view-detail.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {FacilityForCommonService} from '../../../../../core-module/api-service';

/**
 * 设备列表-回路列表
 */
@Component({
  selector: 'app-loop',
  templateUrl: './loop.component.html',
  styleUrls: ['./loop.component.scss']
})
export class LoopComponent implements OnInit, OnChanges {
  @Input() tableColumn: TableConfigModel;
  // 地图操作引起的条件改变
  @Input() filterValueChange;
  // 地图勾选回路数据改变
  @Output() loopEvent = new EventEmitter();
  // 回路列表数据集合
  public dataSet: LoopModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 回路列表配置项
  public loopColumnConfig = [];
  // 表格多语言
  public language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 设施语言包
  public facilityLanguage: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;
  // 已选回路列表数据
  public loopSelectedData: LoopModel[] = [];
  // 表格查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 路由
    private $router: Router,
    // 提示
    private $message: FiLinkModalService,
    // 接口服务
    private $applicationService: ApplicationService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    if (!this.tableColumn) {
      this.initTableConfig();
    } else {
      this.tableConfig = this.tableColumn;
    }
    this.refreshData();
  }

  public ngOnChanges(changes: SimpleChanges) {
    // 忽略filterValueChange第一次改变
    if (changes.filterValueChange.currentValue && !changes.filterValueChange.firstChange) {
      // 根据地图操作选中的设施进行回路筛选
      if (changes.filterValueChange.currentValue.length > 0) {
        this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, this.filterValueChange)];
      } else {
        this.queryCondition.filterConditions = [];
      }
      // 根据地图操作选中的设施进行回路筛选
      this.refreshData();
    }
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
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.handleColumn();
    this.tableConfig = {
      outHeight: 108,
      primaryKey: LightLoopTableEnum.primaryKey,
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: this.loopColumnConfig,
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        // 拉闸
        {
          text: this.languageTable.equipmentTable.pull,
          needConfirm: true,
          canDisabled: true,
          permissionCode: LightLoopTableEnum.primaryPullKey,
          btnType: 'special',
          iconClassName: 'fiLink-filink-lazha-icon',
          confirmContent: `${this.languageTable.equipmentTable.confirmPull}?`,
          handle: (data: LoopModel[]) => {
            this.pullGate(data, ElectricConst.up);
          }
        },
        // 合闸
        {
          text: this.languageTable.equipmentTable.gate,
          needConfirm: true,
          canDisabled: true,
          permissionCode: LightLoopTableEnum.primaryGateKey,
          btnType: 'special',
          iconClassName: 'fiLink-filink-hezha-icon',
          confirmContent: `${this.languageTable.equipmentTable.confirmGate}?`,
          handle: (data: LoopModel[]) => {
            this.pullGate(data, ElectricConst.down);
          }
        },
      ],
      operation: [
        // 详情
        {
          text: this.languageTable.equipmentTable.details,
          className: 'fiLink-view-detail',
          permissionCode: LightLoopTableEnum.primaryDetailKey,
          handle: (data: LoopViewDetailModel) => {
            this.handEquipmentOperation(data);
          },
        },
        // 拉闸
        {
          text: this.languageTable.equipmentTable.pull,
          className: 'fiLink-pull-gate',
          needConfirm: true,
          permissionCode: LightLoopTableEnum.primaryPullKey,
          confirmContent: `${this.languageTable.equipmentTable.confirmPull}?`,
          handle: (currentIndex: LoopModel) => {
            this.pullGate([currentIndex], ElectricConst.up);
          }
        },
        // 合闸
        {
          text: this.languageTable.equipmentTable.gate,
          className: 'fiLink-close-gate',
          needConfirm: true,
          permissionCode: LightLoopTableEnum.primaryGateKey,
          confirmContent: `${this.languageTable.equipmentTable.confirmGate}?`,
          handle: (currentIndex: LoopModel) => {
            this.pullGate([currentIndex], ElectricConst.down);
          }
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
      },
      // 勾选列表地图画线
      handleSelect: (event: LoopModel[]) => {
        this.loopSelectedData = event;
        this.loopEvent.emit(this.loopSelectedData);
      }
    };
  }

  /**
   * 列的配置项
   */
  private handleColumn(): void {
    this.loopColumnConfig = TableColumnConfig.loopColumnConfig(
      this.facilityLanguage,
      this.assetLanguage,
      this.$nzI18n,
      true);
    this.loopColumnConfig.unshift({type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62});
  }


  /**
   * 拉闸/合闸
   * @ param data 选中的数据
   * @ param type 区分开和关
   */
  private pullGate(data: LoopModel[], type: string): void {
    const action = type === ElectricConst.up ? ControlInstructEnum.closeBreak : ControlInstructEnum.openBreak;
    const loopList = data.map((item) => {
      return {
        equipmentId: item.centralizedControlId,
        loopCode: item.loopCode
      };
    });
    const params: DistributeModel = {
      commandId: action,
      equipmentIds: data.map(item => item.centralizedControlId),
      param: {
        loopList: loopList
      }
    };
    this.instructDistribute(params);
  }

  /**
   * 指令接口
   */
  private instructDistribute(params: DistributeModel): void {
    // 校验是否可以指令下发
    this.checkEquipmentMode(params.equipmentIds).then( resolve => {
      if (resolve.code === ResultCodeEnum.success) {
        this.$applicationService.instructDistribute(params).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            // 弹出指令下发成功提示
            this.$message.success(`${this.languageTable.contentList.distribution}!`);
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
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$applicationService.loopListByPage(this.queryCondition).subscribe((res: ResultModel<LoopModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.tableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.dataSet = data;
        this.pageBean.Total = totalCount;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
        LoopUtil.loopFmt(this.dataSet, this.$nzI18n);
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 设备详情
   */
  private handEquipmentOperation(data): void {
    this.$router.navigate([`${RouterJumpConst.loopDetails}`], {
      queryParams: {
        distributionBoxName: data.distributionBoxName,
        controlledObject: data.centralizedControlName,
        loopName: data.loopName,
        loopCode: data.loopCode,
        loopId: data.loopId,
        remark: data.remark,
        centralizedControlId: data.centralizedControlId,
        createTime: data.createTime
      }
    }).then();
  }
  /**
   * 查询是手动控制还是自动
   */
  private checkEquipmentMode(data): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.checkEquipmentMode({loopControlEquipmentIdList: data}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }
}
