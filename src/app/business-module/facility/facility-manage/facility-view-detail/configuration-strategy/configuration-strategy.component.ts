import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {LockService} from '../../../../../core-module/api-service/lock';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityService} from '../../../../../core-module/api-service/facility/facility-manage';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ControlModel} from '../../../../../core-module/model/facility/control.model';
import {ConfigurationsModel} from '../../../../../core-module/model/equipment/config-response-content.model';

/**
 * 配置传感器阀值组件
 */
@Component({
  selector: 'app-configuration-strategy',
  templateUrl: './configuration-strategy.component.html',
  styleUrls: ['./configuration-strategy.component.scss']
})
export class ConfigurationStrategyComponent implements OnInit {
  // 提交按钮是否加载
  public isLoading = false;
  // 表单配置数据
  public formColumnData = [];
  // 参数配置值
  public pramsConfigData = [];
  // 没有数据
  public noDataShow = false;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 校验信息是否通过
  public checkedInfo = true;
  // 选择主控
  public selectedControl: any = 0;
  // 所有主控信息
  public controlInfoAll: ControlModel[] = [];
  public currentControl: ControlModel;
  // 设施id
  public deviceId: string;
  // 设施类型
  private deviceType: string;
  // 序列号
  private serialNum: string;

  constructor(private $lockService: LockService,
              private $modalService: FiLinkModalService,
              private $facilityService: FacilityService,
              private $facilityCommonService: FacilityForCommonService,
              private $nzI18n: NzI18nService,
              private $active: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.$active.queryParams.subscribe(params => {
      this.deviceId = params.id;
      this.serialNum = params.serialNum;
      this.deviceType = params.deviceType;
      // 获取表单html
      this.getPramsConfig();
    });
  }

  public formInstance(event, index): void {
    this.formColumnData[index]['formInstance'] = event;
    this.formColumnData[index]['formInstance'].instance.group.statusChanges.subscribe(() => {
      this.checkedInfo = this.checked();
    });
  }

  /**
   * 创建表单
   * param data
   */
  public createFormColumn(data): Array<any> {
    const arr = [];
    data.forEach(item => {
      const formItem = new FormItem();
      formItem.key = item.id;
      formItem.type = item.type;
      formItem.label = item.name;
      formItem.col = 24;
      formItem.require = true;
      formItem.rule = item.rules || [];
      if (item.placeholder) {
        formItem.placeholder = item.placeholder;
      }
      if (item.unit) {
        formItem.suffix = item.unit;
      }
      if (formItem.type === 'select') {
        formItem.selectInfo = {
          data: item.selectParams,
          label: 'name',
          value: 'id',
        };
      }
      arr.push(formItem);
    });
    return arr;
  }

  /**
   * 设置策略
   */
  public setControl(): void {
    const data = JSON.parse(sessionStorage.getItem('facility_config_info'));
    let body = {};
    this.formColumnData.forEach(item => {
      const formInstance = item.formInstance.instance as FormOperate;
      body = Object.assign(body, formInstance.getData());
    });
    const __body = {
      deviceIds: [],
      configParams: body
    };
    if (this.deviceId) {
      __body.deviceIds = [this.deviceId];
    } else {
      __body.deviceIds = data.map(item => item.deviceId);
    }
    this.$lockService.setControl(__body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$modalService.success(this.language.saveDeviceConfigSuccess);
        window.history.go(-1);
      } else {
        this.$modalService.error(result.msg);
      }
    });
  }

  /**
   * 获取参数配置
   * 每一种设备类型的配置对象不一样此处结果有any
   */
  public getPramsConfig(): void {
    this.$facilityCommonService.getPramsConfig(this.deviceType).subscribe((result: ResultModel<ConfigurationsModel[]>) => {
      this.noDataShow = true;
      this.pramsConfigData = result.data || [];
      this.pramsConfigData.forEach((item: any) => {
        item.formColumn = this.createFormColumn(item.configParams);
      });
      this.formColumnData = result.data;
      if (this.deviceId) {
        this.getConfigValue();
      }
    });
  }

  /**
   * 获取参数配置的值
   */
  public getConfigValue(): void {
    this.$lockService.getLockControlInfo(this.deviceId).subscribe((result: ResultModel<ControlModel[]>) => {
      this.controlInfoAll = result.data || [];
      if (this.controlInfoAll.length) {
        this.controlChange(this.selectedControl);
      }
    });
  }

  public controlChange(event): void {
    this.currentControl = this.controlInfoAll[event];
    if (this.currentControl.configValue && typeof this.currentControl.configValue === 'string') {
      this.currentControl.configValue = JSON.parse(this.currentControl.configValue);
    }
    this.formColumnData.forEach(item => {
      const formInstance = item.formInstance.instance as FormOperate;
      formInstance.resetData(this.currentControl.configValue.threshold);
    });
  }

  /**
   * 返回
   */
  public goBack(): void {
    window.history.go(-1);
  }

  public checked(): boolean {
    let pass = true;
    // 默认通过所有都通过校验
    this.formColumnData.forEach(item => {
      // 如果有一个没有通过校验
      if (!(item['formInstance'].instance.getValid())) {
        pass = false;
      }
    });
    return !pass;
  }
}
