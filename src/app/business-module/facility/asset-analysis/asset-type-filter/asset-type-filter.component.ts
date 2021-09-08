import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {AssetAnalysisAssetDimensionEnum} from '../../share/enum/asset-analysis-asset-dimension.enum';
import {AssetAnalysisStatisticalDimensionEnum} from '../../share/enum/asset-analysis-statistical-dimension.enum';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {AssetAnalysisUtil} from '../../share/util/asset-analysis.util';

/**
 * 资产分析-资产类别组件
 */
@Component({
  selector: 'app-asset-type-filter',
  templateUrl: './asset-type-filter.component.html',
  styleUrls: ['./asset-type-filter.component.scss']
})
export class AssetTypeFilterComponent implements OnInit {
  @Output() public assetRatioFilterConditionEmit = new EventEmitter<any>();
  // 区域选择器模版
  @ViewChild('AreaSelectRef') public AreaSelectRef: TemplateRef<HTMLDocument>;
  // 项目弹窗模版
  @ViewChild('ProjectSelectRef') public ProjectSelectRef: TemplateRef<HTMLDocument>;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 公共语言包国际化
  public commonLanguage: CommonLanguageInterface;
  // 项目列表语言包
  public projectLanguage: PlanProjectLanguageInterface;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // form表单配置
  public formColumn: FormItem[] = [];
  // 区域树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 区域树数据
  public treeNodes: AreaModel[];
  // 区域名称
  public areaName: string = '';
  // 区域选择器显示控制
  public isVisible: boolean = false;
  // 区域id集合
  public selectAreaIds: string[] = [];
  // 选择项目弹窗显示
  public isShow: boolean = false;
  // 勾选项目id集合
  public selectProjectIds: string[] = [];
  // 勾选项目名称字符串
  public projectName: string = '';
  // 勾选项目名称数组
  public projectNameList: string[] = [];
  // 项目列表勾选数据
  public selectData: any[] = [];
  // 资产占比表单实例
  public formStatus: FormOperate;
  // 分析按钮是否可以点击
  public isClick: boolean = true;
  // 创建筛选实例
  public queryConditions = new QueryConditionModel();
  // 选中的筛选条件
  public filterCondition: any;
  // 表单筛选默认条件
  private formDefaultValue = {
    assetDimension: AssetAnalysisAssetDimensionEnum.facility,
    statisticalDimension: AssetAnalysisStatisticalDimensionEnum.area,
    selectAreaOrProject: []
  };
  private allAreaIdList: string[] = [];
  private allAreaName: string;

  constructor(
    public $nzI18n: NzI18nService,
    // 设施功能服务
    public $facilityCommonService: FacilityForCommonService,
    private $message: FiLinkModalService,
  ) {
  }

  ngOnInit() {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.projectLanguage = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    AssetAnalysisUtil.initTreeSelectorConfig(this);
    this.getAreaTreeData().then(() => {
      this.initColumn();
    }, () => {
      this.initColumn();
    }).catch(() => {
      this.initColumn();
    });

  }

  /**
   * 获取区域数数据源
   */
  public getAreaTreeData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          AssetAnalysisUtil.selectAllArea(result.data, this);
          this.treeNodes = result.data || [];
          this.setAreaSelectAll(this.treeNodes);
          AssetAnalysisUtil.addName(this.treeNodes);
          this.treeSelectorConfig.treeNodes = this.treeNodes;
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
   * 显示区域选择弹窗
   */
  public showAreaSelect(): void {
    this.isVisible = true;
  }

  /**
   * 显示项目列表选择弹窗
   */
  public showProjectSelect(): void {
    this.isShow = true;
  }

  /**
   * 项目选择器结果
   * param data
   */
  public projectSelectChange(data): void {
    this.selectProjectIds = [];
    this.projectNameList = [];
    this.selectData = data;
    data.forEach(item => {
      this.projectNameList.push(item.projectName);
      this.selectProjectIds.push(item.projectId);
    });
    this.projectName = this.projectNameList.toString();
    this.formStatus.resetControlData('selectAreaOrProject', this.selectProjectIds);
  }

  /**
   * 表单实例对象
   * param event
   */
  public formInstance(event: { instance: FormOperate }): void {
    if (!this.formColumn.length) {
      return;
    }
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isClick = !this.formStatus.getValid();
    });
    this.formStatus.resetData(this.formDefaultValue);
    if (this.allAreaIdList.length) {
      this.formStatus.resetControlData('selectAreaOrProject', this.allAreaIdList);
    }
    if (!this.isClick) {
      this.analysis();
    }
  }

  /**
   * 资产占比分析
   */
  public analysis(): void {
    const data = this.formStatus.getData();
    if (data.assetDimension === AssetAnalysisAssetDimensionEnum.facility && data.statisticalDimension === AssetAnalysisStatisticalDimensionEnum.area) {
      this.queryConditions.filterConditions = [{
        filterValue: this.selectAreaIds,
        filterField: 'areaId',
        operator: 'in'
      }];
      this.filterCondition = {
        assetType: AssetAnalysisAssetDimensionEnum.facility,
        statisticalDimension: AssetAnalysisStatisticalDimensionEnum.area,
        emitCondition: this.queryConditions.filterConditions
      };
    } else if (data.assetDimension === AssetAnalysisAssetDimensionEnum.facility && data.statisticalDimension === AssetAnalysisStatisticalDimensionEnum.project) {
      this.queryConditions.filterConditions = [{
        filterValue: this.selectProjectIds,
        filterField: 'projectId',
        operator: 'in'
      }];
      this.filterCondition = {
        assetType: AssetAnalysisAssetDimensionEnum.facility,
        statisticalDimension: AssetAnalysisStatisticalDimensionEnum.project,
        emitCondition: this.queryConditions.filterConditions
      };
    } else {
      this.queryConditions.filterConditions = [{
        filterValue: this.selectAreaIds,
        filterField: 'areaId',
        operator: 'in'
      }];
      this.filterCondition = {
        assetType: AssetAnalysisAssetDimensionEnum.equipment,
        statisticalDimension: AssetAnalysisStatisticalDimensionEnum.area,
        emitCondition: this.queryConditions.filterConditions
      };
    }
    this.assetRatioFilterConditionEmit.emit(this.filterCondition);
  }

  /**
   * 筛选条件重置为默认条件
   */
  public reset(): void {
    this.formStatus.resetData(this.formDefaultValue);
    if (this.allAreaIdList.length) {
      this.formStatus.resetControlData('selectAreaOrProject', this.allAreaIdList);
    }
    this.selectAreaIds = this.allAreaIdList;
    this.areaName = this.allAreaName;
    this.setAreaSelectAll(this.treeNodes);
    if (!this.isClick) {
      this.analysis();
    }
  }

  /**
   * 区域选择器选择结果
   */
  public selectDataChange(event) {
    this.selectAreaIds = [];
    const arr = [];
    if (event.length > 0) {
      event.forEach(item => {
        this.selectAreaIds.push(item.areaId);
        arr.push(item.areaName);
      });
      this.formStatus.resetControlData('selectAreaOrProject', this.selectAreaIds);
    } else {
      this.selectAreaIds = arr;
      this.formStatus.resetControlData('selectAreaOrProject', null);
    }
    FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, this.selectAreaIds);
    this.areaName = arr.toString();
  }

  /**
   * 表单配置
   */
  private initColumn(): void {
    const arr = CommonUtil.codeTranslate(AssetAnalysisStatisticalDimensionEnum, this.$nzI18n, null, `${LanguageEnum.facility}.assetAnalysis`) as any[];
    this.formColumn = [
      // 资产维度
      {
        label: this.language.assetAnalysis.assetDimension,
        key: 'assetDimension',
        type: 'select',
        col: 8,
        require: true,
        disabled: false,
        rule: [{required: true}],
        initialValue: AssetAnalysisAssetDimensionEnum.facility,
        selectInfo: {
          data: CommonUtil.codeTranslate(AssetAnalysisAssetDimensionEnum, this.$nzI18n, null, `${LanguageEnum.facility}.assetAnalysis`),
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event) => {
          const statisticalDimensionColumn = this.formColumn.find(item => item.key === 'statisticalDimension');
          if ($event === AssetAnalysisAssetDimensionEnum.facility) {
            if (statisticalDimensionColumn) {
              statisticalDimensionColumn.selectInfo.data = CommonUtil.codeTranslate(AssetAnalysisStatisticalDimensionEnum, this.$nzI18n, null, `${LanguageEnum.facility}.assetAnalysis`);
            }
          } else {
            if (statisticalDimensionColumn) {
              this.formStatus.resetControlData('statisticalDimension', AssetAnalysisStatisticalDimensionEnum.area);
              statisticalDimensionColumn.selectInfo.data.splice(1, 1);
            }
          }
        }
      },
      // 统计维度
      {
        label: this.language.assetAnalysis.statisticalDimension,
        key: 'statisticalDimension',
        type: 'select',
        col: 8,
        require: true,
        disabled: false,
        rule: [{required: true}],
        initialValue: AssetAnalysisStatisticalDimensionEnum.area,
        selectInfo: {
          data: arr,
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event) => {
          const selectAreaOrProjectColumn = this.formColumn.find(item => item.key === 'selectAreaOrProject');
          if (selectAreaOrProjectColumn) {
            if ($event === AssetAnalysisStatisticalDimensionEnum.area) {
              selectAreaOrProjectColumn.label = this.language.assetAnalysis.selectArea;
              selectAreaOrProjectColumn.template = this.AreaSelectRef;
              this.formStatus.resetControlData('selectAreaOrProject', this.selectAreaIds);
            } else {
              selectAreaOrProjectColumn.label = this.language.assetAnalysis.selectProject;
              selectAreaOrProjectColumn.template = this.ProjectSelectRef;
              this.formStatus.resetControlData('selectAreaOrProject', this.selectProjectIds);
            }
          }
        }

      },
      // 选择区域
      {
        label: this.language.assetAnalysis.selectArea,
        key: 'selectAreaOrProject',
        type: 'custom',
        col: 8,
        require: true,
        disabled: false,
        rule: [{required: true}],
        template: this.AreaSelectRef,
      },
    ];
  }

  /**
   * 设置区域选择器区域为全部勾选状态
   * param nodes
   */
   private setAreaSelectAll(nodes): void {
    nodes.forEach(item => {
      item.checked = true;
      if (item.children && item.children.length) {
        this.setAreaSelectAll(item.children);
      }
    });
  }
}
