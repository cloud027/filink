import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ConditionsMetEnum} from '../../share/enum/conditions-met.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {StrategyListModel} from '../../share/model/policy.control.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import * as lodash from 'lodash';
import {DimmingLightModel} from '../../share/model/equipment.model';
import {FacilityForCommonService} from '../../../../core-module/api-service';
import {SelectEquipmentComponent} from '../../components/select-equipment/select-equipment.component';
import {SwitchStatus, TargetTypeEnum} from '../../share/enum/policy.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TableColumnConfig} from '../../share/config/table-column.config';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {CurrentActionSelectedModel} from '../../share/model/current-action-selected.model';

/**
 * 网关策略组件
 */
@Component({
  selector: 'app-gateway-strategy',
  templateUrl: './gateway-strategy.component.html',
  styleUrls: ['./gateway-strategy.component.scss']
})
export class GatewayStrategyComponent implements OnInit, OnDestroy, OnChanges {
  // 策略模型
  @Input() stepsFirstParams: StrategyListModel = new StrategyListModel();
  // 网关策略的验证变化
  @Output() gatewayStrategyValidChange: EventEmitter<boolean> = new EventEmitter();
  // 执行动作列表实例
  @ViewChild('actionEquipmentTable') actionEquipmentTable: SelectEquipmentComponent;
  // 应用系统国际化
  public language: ApplicationInterface;
  // 满足条件的选项
  public conditionsMetOption = [];
  // 是否显示触发条件新增虚线框
  public isShowTriggerCondition: boolean = false;
  // 触发条件后台自定义模板配置项
  public triggerConditionRender: FormItem[] = [];
  // 当前已选择的触发条件
  public currentTriggerSelected: any = {};
  // 是否显示触发设备弹框
  public isShowTriggerSelect: boolean = false;
  // 当前已选择的执行动作
  public currentActionSelected: CurrentActionSelectedModel = new CurrentActionSelectedModel();
  // 已选择的触发条件列表
  public triggerSelectedList = [];
  // 触发条件回显列表配置
  public tableConfigTrigger: TableConfigModel;
  // 执行动作已选择列表
  public actionSelectedList = [];
  // 执行动作回显列表显示
  public tableConfigAction: TableConfigModel;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 选中触发设备
  public selectEquipment: DimmingLightModel = new DimmingLightModel();
  // 选择的执行动作设备
  public selectedData: any[] = [];
  // 是否显示执行动作新增
  public isShowAction: boolean = false;
  // 开关状态
  public switchStatus = SwitchStatus;
  // 网管策略查询条件
  public gatewayQueryMap: any = {};
  // 添加设备选择弹框
  public isAddEquipmentVisible: boolean = false;
  // 触发条件xml配置信息表单实列
  private triggerFormInstance: FormOperate;
  // 设备xml配置信息
  private equipmentConfigData: any[] = [];
  // 单控，集控
  public targetTypeEnum = TargetTypeEnum;

  constructor(private $nzI18n: NzI18nService,
              private $facilityForCommonService: FacilityForCommonService,
              private $message: FiLinkModalService
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.conditionsMetOption = <any[]>CommonUtil.codeTranslate(ConditionsMetEnum, this.$nzI18n, null,
      `${LanguageEnum.application}.conditionsMet`);
    this.initTriggerTable();
    this.initActionTable();
  }

  ngOnDestroy(): void {
    this.actionEquipmentTable = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.stepsFirstParams && changes.stepsFirstParams.currentValue) {
      //  执行回显逻辑
      if (typeof this.stepsFirstParams.linkageStrategyInfo.actionBackup === 'string') {
        this.actionSelectedList = JSON.parse(this.stepsFirstParams.linkageStrategyInfo.actionBackup);
        this.stepsFirstParams.linkageStrategyInfo.actionBackup = this.actionSelectedList;
      } else {
        this.actionSelectedList = this.stepsFirstParams.linkageStrategyInfo.actionBackup || [];
      }
      if (this.stepsFirstParams.linkageStrategyInfo.triggerSelectedList && this.stepsFirstParams.linkageStrategyInfo.triggerSelectedList.length) {
        this.triggerSelectedList = this.stepsFirstParams.linkageStrategyInfo.triggerSelectedList;
      } else {
        if (typeof this.stepsFirstParams.linkageStrategyInfo.multipleConditions === 'string') {
          this.triggerSelectedList = JSON.parse(this.stepsFirstParams.linkageStrategyInfo.multipleConditions);
          this.stepsFirstParams.linkageStrategyInfo.triggerSelectedList = this.triggerSelectedList;
        }
      }
      Promise.resolve().then(() => {
        this.gatewayStrategyValid();
      });
    }
  }

  public conditionChange(event): void {
  }

  /**
   * 打开选择设备弹框
   */
  public handleAddEquipment(): void {
    this.isAddEquipmentVisible = true;
  }

  /**
   * 对弹框回显的设备删除操作
   * param event
   */
  public deleteEquipmentChange(data): void {
    this.selectedData = data;
    this.currentActionSelected.selectEquipmentType = [...new Set(data.map(item => item.equipmentType))].join(',');
  }

  /**
   * 弹框选择ok
   * param event
   */
  public handleEquipmentSelectOk(event): void {
    this.selectedData = event.data;
    this.currentActionSelected.selectEquipmentType = event.targetType;
    this.isAddEquipmentVisible = false;
  }
  /**
   * 打开触发条件
   */
  public openTrigger(): void {
    this.isShowTriggerCondition = true;
    this.currentTriggerSelected = {};
    this.triggerConditionRender = [];
  }

  /**
   * 打开执行动作
   */
  public openAction() {
    if (!(this.triggerSelectedList && this.triggerSelectedList.length)) {
      this.$message.error(this.language.strategyList.triggerConditionMustMsg);
      return;
    }
    this.isShowAction = true;
    this.currentActionSelected = new CurrentActionSelectedModel();
    this.gatewayQueryMap.gatewayIdList = this.triggerSelectedList.map(item => item.gatewayId);
    this.gatewayQueryMap.equipmentIdList = this.makeGatewayQueryMap();
    this.gatewayQueryMap = lodash.cloneDeep(this.gatewayQueryMap);
    this.selectedData = [];
  }

  /**
   * 触发条件保存
   */
  public handleSave(): void {
    if (!this.selectEquipment.equipmentId) {
      this.$message.error(this.commonLanguage.requiredMsg);
      return;
    }
    if (!this.triggerFormInstance) {
      this.$message.error(this.language.strategyList.noXMlInfoMsg);
      return;
    }
    if (!this.triggerFormInstance.getValid()) {
      this.$message.error(this.commonLanguage.requiredMsg);
      return;
    }
    this.currentTriggerSelected.param = this.triggerFormInstance.getData();
    this.isShowTriggerCondition = false;
    // 拼接触发条件的值
    const strArr = [];
    this.triggerConditionRender.forEach(item => {
      strArr.push(`"${item.label}":"${this.currentTriggerSelected.param[item.key]}"`);
    });
    this.currentTriggerSelected['conditions'] = strArr.join(',');
    // 收集触发条件的值
    if (this.currentTriggerSelected.id) {
      this.triggerSelectedList.splice(this.triggerSelectedList.findIndex(item => item.id === this.currentTriggerSelected.id),
        1, lodash.cloneDeep(this.currentTriggerSelected));
    } else {
      this.currentTriggerSelected.id = CommonUtil.getUUid();
      this.triggerSelectedList.push(lodash.cloneDeep(this.currentTriggerSelected));
    }
    this.triggerSelectedList = this.triggerSelectedList.slice();
    // 触发条件的结果影响触发动作选择值
    this.isShowAction = false;
    this.gatewayStrategyValid();
    this.stepsFirstParams.linkageStrategyInfo.triggerSelectedList = this.triggerSelectedList;
  }

  /**
   * 执行动作保存
   */
  public handleActionSave(): void {
    // 获取执行动作的值
    const selectData = this.selectedData;
    if (!selectData.length) {
      this.$message.error(this.commonLanguage.selectEquipmentMsg);
      return;
    }
    this.currentActionSelected.selectedEquipment = selectData.map(item => {
      const {equipmentName, equipmentType, equipmentId} = item;
      return {equipmentName, equipmentType, equipmentId};
    });
    this.currentActionSelected.equipmentNames = selectData.map(item => item.equipmentName).join(',');
    this.currentActionSelected.switchLanguage = this.currentActionSelected.switchLight === SwitchStatus.on
      ? this.language.equipmentTable.switch : this.language.equipmentTable.shut;
    // tslint:disable-next-line:max-line-length
    this.currentActionSelected.actions = `"${this.language.strategyList.switch}":"${this.currentActionSelected.switchLanguage}","${this.language.equipmentTable.light}":"${this.currentActionSelected.light}"`;
    if (this.currentActionSelected.id) {
      this.actionSelectedList.splice(this.actionSelectedList.findIndex(item => item.id === this.currentActionSelected.id),
        1, lodash.cloneDeep(this.currentActionSelected));
    } else {
      this.currentActionSelected.id = CommonUtil.getUUid();
      this.actionSelectedList.push(lodash.cloneDeep(this.currentActionSelected));
    }
    this.actionSelectedList = this.actionSelectedList.slice();
    this.stepsFirstParams.linkageStrategyInfo.actionBackup = this.actionSelectedList;
    // 收集执行动作的值
    this.isShowAction = false;
    this.gatewayStrategyValid();
  }

  /**
   * 关闭触发条件
   */
  public handleClose(): void {
    this.isShowTriggerCondition = false;
  }

  /**
   * 关闭执行动作
   */
  public handleActionClose(): void {
    this.isShowAction = false;
  }

  /**
   * 打开触发条件设备选择
   */
  public handleTriggerSelectOpen(): void {
    this.selectEquipment.equipmentId = this.currentTriggerSelected.equipmentId;
    this.isShowTriggerSelect = true;
  }

  /**
   * 触发器选择设备
   * param selectEquipment
   */
  public handleTriggerSelectOk(selectEquipment): void {
    this.isShowTriggerSelect = false;
    this.currentTriggerSelected.equipmentName = selectEquipment.equipmentName;
    this.currentTriggerSelected.equipmentId = selectEquipment.equipmentId;
    this.currentTriggerSelected.gatewayId = selectEquipment.gatewayId;
    this.currentTriggerSelected.equipmentType = selectEquipment.equipmentType;
    this.getEquipmentConfigByModel(this.currentTriggerSelected);
  }

  public triggerFormInstanceHandle(event: { instance: FormOperate }): void {
    this.triggerFormInstance = event.instance;
  }

  /**
   * 执行动作开关指令
   * param event boolean
   */
  public switchLightChange(event: boolean): void {
    this.currentActionSelected.switchLight = event ? SwitchStatus.on : SwitchStatus.off;
  }

  /**
   * 根据设备id动态获取配置
   * param equipmentId
   */
  private getEquipmentConfigByModel(currentTriggerSelected): void {
    // 由于一次获取全量配置 如果有配置的则直接用原来获取的
    if (this.equipmentConfigData && this.equipmentConfigData.length) {
      this.createFormColumn(this.equipmentConfigData, currentTriggerSelected.equipmentType);
    } else {
      this.$facilityForCommonService.getEquipmentConfigByModel({
        equipmentId: currentTriggerSelected.gatewayId,
      }).subscribe((result: ResultModel<any[]>) => {
        this.equipmentConfigData = result.data || [];
        this.createFormColumn(this.equipmentConfigData, currentTriggerSelected.equipmentType);
      });
    }
  }

  /**
   * 根据后台xml返回的数据 创建form配置
   * param equipmentConfigData
   * param equipmentType
   */
  private createFormColumn(equipmentConfigData: any[], equipmentType): void {
    const config = equipmentConfigData.find(item => item.tabId === 'strategy');
    this.triggerConditionRender = [];
    const tempArr = [];
    // 从数组深处找到配置项
    if (config && config.configurationsList) {
      // 寻找与当前选择的设备类型符合的配置信息
      const currentSelectEquipmentConfig = config.configurationsList.find(item => item.id === equipmentType);
      if (currentSelectEquipmentConfig) {
        currentSelectEquipmentConfig.configurationList.forEach(temp => {
          temp.configParamList.forEach(_item => {
            // 如果有值说明是回显数据
            if (this.currentTriggerSelected.param && this.currentTriggerSelected.param[_item.id]) {
              _item.defaultValue = this.currentTriggerSelected.param[_item.id];
            }
            _item.col = 24;
            _item.labelWidth = 140;
            tempArr.push(_item);
          });
        });
      } else {
        this.$message.error(this.language.strategyList.noXMlInfoMsg);
        return;
      }
    }
    this.triggerConditionRender = FormOperate.createColumnTemp(tempArr);
  }

  /**
   * 网关策略验证
   */
  private gatewayStrategyValid(): void {
    const valid = this.actionSelectedList.length && this.triggerSelectedList.length && this.stepsFirstParams.linkageStrategyInfo.logic;
    this.gatewayStrategyValidChange.emit(Boolean(valid));
  }

  /**
   * 初始化触发条件回显列表配置
   */
  private initTriggerTable(): void {
    this.tableConfigTrigger = TableColumnConfig.gatewayTableConfigTrigger(this.language, this.commonLanguage, (data) => {
      this.currentTriggerSelected = lodash.cloneDeep(data);
      this.isShowTriggerCondition = true;
      this.getEquipmentConfigByModel(this.currentTriggerSelected);
    }, (data) => {
      const index = this.triggerSelectedList.findIndex(item => item.id === data.id);
      this.triggerSelectedList.splice(index, 1);
      this.triggerSelectedList = this.triggerSelectedList.slice();
      // 触发条件的结果影响触发动作选择值
      this.isShowAction = false;
      this.gatewayStrategyValid();
    });
  }

  /**
   * 初始化执行动作回显列表
   */
  private initActionTable(): void {
    this.tableConfigAction = TableColumnConfig.gatewayTableConfigAction(this.language, this.commonLanguage, (data) => {
      this.currentActionSelected = lodash.cloneDeep(data);
      this.gatewayQueryMap.equipmentIdList = this.makeGatewayQueryMap(this.currentActionSelected.selectedEquipment);
      this.gatewayQueryMap = lodash.cloneDeep(this.gatewayQueryMap);
      this.selectedData = this.currentActionSelected.selectedEquipment;
      this.isShowAction = true;
    }, (data) => {
      const index = this.actionSelectedList.findIndex(item => item.id === data.id);
      this.actionSelectedList.splice(index, 1);
      this.actionSelectedList = this.actionSelectedList.slice();
      // 已选择的设备结果影响触发动作选择值
      this.isShowAction = false;
      this.gatewayStrategyValid();
    });
  }

  /**
   * 处理网关选择设备的查询条件
   * param currentActionSelected
   */
  private makeGatewayQueryMap(currentActionSelected?): string[] {
    const allSelectedList = [];
    this.actionSelectedList.forEach(item => {
      if (item.selectedEquipment && item.selectedEquipment.length) {
        item.selectedEquipment.forEach(equipment => {
          // 修改时传入currentActionSelected 排除当前选择的id集合
          if (currentActionSelected && currentActionSelected.some(_item => _item.equipmentId === equipment.equipmentId)) {
            return;
          }
          allSelectedList.push(equipment.equipmentId);
        });

      }
    });
    return allSelectedList;
  }
}
