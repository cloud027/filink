import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FormOperate} from '../../form/form-operate.service';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {ConfigDetailRequestModel} from '../../../../core-module/model/equipment/config-detail-request.model';
import {ConfigResponseContentModel, ConfigurationList} from '../../../../core-module/model/equipment/config-response-content.model';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {EquipmentConfigTabShowEnum} from '../../../enum/equipment-config-tab-show-enum';

/**
 * 设备配置组件
 */
@Component({
  selector: 'app-equipment-config-common',
  templateUrl: './equipment-config-common.component.html',
  styleUrls: ['./equipment-config-common.component.scss']
})
export class EquipmentConfigCommonComponent implements OnInit, OnChanges {
  // 设备配置详情参数
  @Input() public configValueParam: ConfigDetailRequestModel = new ConfigDetailRequestModel;
  // 设备配置项内容ConfigResponequipmentConfigContentseContentModel[] = [];
  @Input() public equipmentConfigContent: any = [];
  // 设备所属网关id
  @Input() public centerControlId: string;
  // 获取表单实例 initTabNum
  @Output() public getFormStatus = new EventEmitter<ConfigResponseContentModel[]>();
  // 获取表单tab标签下标
  @Output() public getCurrentTabIndex = new EventEmitter<number>();
  // 提交button状态
  @Output() public buttonStatus = new EventEmitter<boolean[]>();
  @Output() public okEvent = new EventEmitter();
  // 设备所属网关id
  @Input() public deviceConfiguration: boolean = false;
  // 表单配置数据
  public formColumnData: ConfigResponseContentModel[] = [];
  // 校验信息是否通过
  public checkedInfo: boolean[] = [];
  // 显示线缆设置
  public isShowCableSetting: boolean = false;
  // 配置table
  @ViewChild('showConfigTableTemp') private showConfigTableTemp: TemplateRef<HTMLDocument>;
  // 线缆设置获取回显数据
  public cableSettingConfigInfo: any;
  // 当前显示的tab index
  private currentTabIndex: number = 0;

  constructor(
    private $facilityCommonService: FacilityForCommonService,
    private $message: FiLinkModalService,
  ) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    if (this.deviceConfiguration){
      // 获取设备配置表单
      this.getPramsConfig();
    } else {
      this.getGatewayConfig();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  handleOkEvent(okEvent) {
    this.okEvent.emit(okEvent);
  }
  /**
   * 获取设备配置项(除网关外设备)
   */
  public getGatewayConfig(): void {
    this.equipmentConfigContent.forEach((item) => {
        item.configurationsList.forEach(k => {
          k.configurationList.forEach(config => {
            /*config.formColumn = FormOperate.createColumnTemp(config.configParamList, this.showConfigTableTemp) as FormItem[];*/
            config.formColumn = FormOperate.createColumnTemp(config.configParamList, this.showConfigTableTemp);
          });
        });
    });
    // 过滤只有设备配置需要展示的
    if (!this.deviceConfiguration) {
      this.equipmentConfigContent = this.equipmentConfigContent.filter(item => item.onShow !== EquipmentConfigTabShowEnum.noShow);
    }
    this.formColumnData = this.equipmentConfigContent;
  }

  /**
   * 获取设备配置项(除网关外设备)
   */
  public getPramsConfig(): void {
    this.equipmentConfigContent.forEach((item) => {
      if (item.type !== 'component') {
        item.configurationsList.forEach(k => {
          k.configurationList.forEach(config => {
            /*config.formColumn = FormOperate.createColumnTemp(config.configParamList, this.showConfigTableTemp) as FormItem[];*/
            config.formColumn = FormOperate.createColumnTemp(config.configParamList, this.showConfigTableTemp);
          });
        });
      }
    });
    // 过滤只有设备配置需要展示的
    if (this.deviceConfiguration) {
      this.equipmentConfigContent = this.equipmentConfigContent.filter(item => item.onShow !== EquipmentConfigTabShowEnum.noShow);
    }
    this.formColumnData = this.equipmentConfigContent;
    // 有设备配置项获取配置详情
    if (!_.isEmpty(this.equipmentConfigContent) && !_.isEmpty(this.configValueParam)) {
      this.getConfigValue(this.configValueParam);
    }
  }

  /**
   * 获取配置详情值
   */
  public getConfigValue(configValueParam: ConfigDetailRequestModel): void {
    if (configValueParam.equipmentType === EquipmentTypeEnum.intelligentEntranceGuardLock) {
      this.$facilityCommonService.getEquipmentLockConfigByModel({equipmentId: configValueParam.equipmentId}).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data && result.data.length && result.data[0].configValue) {
            const configValue = JSON.parse(result.data[0].configValue);
            if (configValue && configValue.threshold) {
              // 电子锁回显固定统一使用 threshold的值
              this.setFormValue(configValue.threshold, true);
            }
          }
        }
      });
    } else {
      this.$facilityCommonService.queryEquipmentConfigById(configValueParam).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data && !_.isEmpty(result.data.configInfo)) {
            const configValue = JSON.parse(result.data.configInfo);
            this.cableSettingConfigInfo = configValue;
            if (configValue) {
              this.setFormValue(configValue);
            }
          }
        } else {
          this.$message.error(result.msg);
        }
      });
    }

  }


  /**
   * 表单实例
   */
  public formInstance(event: { instance: FormOperate }, currentItem): void {
    currentItem.formInstance = event;
    event.instance.group.statusChanges.subscribe(() => {
      this.checkedInfo = this.checked();
      this.buttonStatus.emit(this.checkedInfo);
    });
    this.getFormStatus.emit(this.formColumnData);
  }

  /**
   * tab表单index
   */
  public changeTab(index: number): void {
    this.currentTabIndex = index;
    this.getCurrentTabIndex.emit(index);
    if (index === 2) {
      this.isShowCableSetting = true;
    } else {
      this.isShowCableSetting = false;
    }
  }

  /**
   * 表单验证
   */
  public checked(): boolean[] {
    const pass = [];
    let configurationList: ConfigurationList[];
    try {
      configurationList = this.formColumnData[this.currentTabIndex].configurationsList[0].configurationList;
    } catch (e) {
      configurationList = [];
    }
    // 默认通过所有都通过校验
    configurationList.forEach((item, index) => {
      // 如果有一个没有通过校验
      pass[index] = !item['formInstance'].instance.getValid();
    });
    return pass;
  }

  /**
   * 设置form 的值
   * param configValue
   */
  private setFormValue(configValue: any, isLock?: boolean): void {
    if (this.formColumnData[this.currentTabIndex]['type'] === 'component') {
      return;
    }
    this.formColumnData[this.currentTabIndex].configurationsList.forEach(item => {
      item.configurationList.forEach(config => {
        if (config.formInstance) {
          const formInstance = config.formInstance.instance;
          if (isLock) {
            formInstance.resetData(configValue);
          } else {
            const formDataBackTemp = configValue[config.id];
            // 基础参数存在回显
            if (formDataBackTemp) {
              formInstance.resetData(formDataBackTemp);
            }
          }
        }
      });
    });
  }
}
