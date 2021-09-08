import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {StrategyListModel} from '../../../share/model/policy.control.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ExecStatusEnum, PolicyEnum, TargetTypeEnum} from '../../../share/enum/policy.enum';
import {SliderValueConst} from '../../../share/const/slider.const';
import {LinkageStrategyModel} from '../../../share/model/linkage.strategy.model';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {ApplicationService} from '../../../share/service/application.service';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {TableColumnConfig} from '../../../share/config/table-column.config';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {ConditionTypeEnum} from '../../../share/enum/condition-type.enum';
import {ConditionsMetEnum} from '../../../share/enum/conditions-met.enum';

/**
 * 联动策略第三步 执行动作下面的组件
 */
@Component({
  selector: 'app-finish-details',
  templateUrl: './finish-details.component.html',
  styleUrls: ['./finish-details.component.scss']
})
export class FinishDetailsComponent implements OnInit, OnChanges {
  // 策略信息
  @Input() lightingData: StrategyListModel;
  // 节目名称
  @Input() programName: string;
  // 禁用
  public nzDisabled: boolean = true;
  // 设备表格配置
  public tableEquipment: TableConfigModel;
  // 滑块值的常量
  public sliderValue = SliderValueConst;
  // 单控，集控
  public targetTypeEnum = TargetTypeEnum;
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 设备列表分页
  public equipmentPageBean: PageModel = new PageModel();
  // 表格多语言
  public language: CommonLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 表格数据
  public strategyRefList: any[] = [];
  // 设备id集合
  public equipmentIds: Array<string>;
  // 联动策略数据
  public linkageStrategyInfo: LinkageStrategyModel = new LinkageStrategyModel({});
  // 触发条件列表回显
  public tableConfigTrigger: TableConfigModel;
  public triggerSelectedList = [];
  public actionSelectedList = [];
  public tableConfigAction: TableConfigModel;
  public conditionTypeEnum = ConditionTypeEnum;
  public conditionsMetEnum = ConditionsMetEnum;
  // 开关枚举常量
  public ExecStatusEnum = ExecStatusEnum;
  // 表格所需要的条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();


  constructor(
    // 提示
    private $message: FiLinkModalService,
    // 接口服务
    private $applicationService: ApplicationService,
    // 多语言配置
    private $nzI18n: NzI18nService,
  ) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.initTable();
    this.tableConfigTrigger = TableColumnConfig.gatewayTableConfigTrigger(this.languageTable, this.language);
    this.tableConfigAction = TableColumnConfig.gatewayTableConfigAction(this.languageTable, this.language);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lightingData && changes.lightingData.currentValue) {
      this.strategyRefList = this.lightingData.strategyRefList;
      this.equipmentPageBean.Total = this.strategyRefList.length;
      this.updateStrategyRefList();
      if (this.lightingData.linkageStrategyInfo.conditionType !== ConditionTypeEnum.trigger) {
        return;
      }
      if (this.lightingData.linkageStrategyInfo.triggerSelectedList) {
        this.triggerSelectedList = this.lightingData.linkageStrategyInfo.triggerSelectedList;
      } else {
        if (typeof this.lightingData.linkageStrategyInfo.multipleConditions === 'string') {
          this.triggerSelectedList = JSON.parse(this.lightingData.linkageStrategyInfo.multipleConditions);
        }
      }
      if (this.lightingData.linkageStrategyInfo.actionBackup) {
        if (typeof this.lightingData.linkageStrategyInfo.actionBackup !== 'string') {
          this.actionSelectedList = this.lightingData.linkageStrategyInfo.actionBackup;
        } else {
          this.actionSelectedList = JSON.parse(this.lightingData.linkageStrategyInfo.actionBackup);
          this.lightingData.linkageStrategyInfo.actionBackup = this.actionSelectedList;
        }
      }
    }
  }

  /**
   * 设备列表
   */
  public initTable(): void {
    this.tableEquipment = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: false,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: false,
      columnConfig: [
        {
          type: 'serial-number', width: 62,
          title: this.language.serialNumber
        },
        {
          title: this.languageTable.equipmentTable.equipmentName,
          key: 'refName',
          width: 300,
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: []
    };
  }

  /**
   * 更新详情信息
   */
  public updateStrategyRefList(): void {
    this.linkageStrategyInfo = this.lightingData.linkageStrategyInfo;
    // if (this.linkageStrategyInfo.instructLightBase) {
    //   this.linkageStrategyInfo.instructLightBase.switchLight = this.linkageStrategyInfo.instructLightBase.switchLight
    //     === ExecStatusEnum.implement;
    // }
  }

  /**
   * 设备分页
   * @ param event
   */
  public equipmentPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshEquipmentData();
  }

  /**
   * 设备列表表格数据
   */
  private refreshEquipmentData() {
    // 默认查询选中的id数据
    const equipmentId = new FilterCondition(PolicyEnum.equipmentId, OperatorEnum.in, this.equipmentIds);
    this.queryCondition.filterConditions.push(equipmentId);
    this.$applicationService.equipmentListByPage(this.queryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      this.tableEquipment.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        const {totalCount, pageNum, size, data} = res;
        this.strategyRefList = data || [];
        this.equipmentPageBean.Total = totalCount;
        this.equipmentPageBean.pageIndex = pageNum;
        this.equipmentPageBean.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.tableEquipment.isLoading = false;
    });
  }
}
