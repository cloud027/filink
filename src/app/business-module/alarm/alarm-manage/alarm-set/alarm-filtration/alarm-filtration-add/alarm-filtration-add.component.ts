import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../../shared-module/model/alarm-selector-config.model';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {OperateTypeEnum} from '../../../../../../shared-module/enum/page-operate-type.enum';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {AlarmService} from '../../../../share/service/alarm.service';
import {AlarmInventoryEnum, AlarmEnableStatusEnum} from '../../../../share/enum/alarm.enum';
import {EquipmentListModel} from '../../../../../../core-module/model/equipment/equipment-list.model';
import {AlarmFiltrationModel} from '../../../../share/model/alarm-filtration.model';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {AlarmSelectorConfigTypeEnum} from '../../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {EquipmentAddInfoModel} from '../../../../../../core-module/model/equipment/equipment-add-info.model';
import {AlarmEquipmentNameModel} from '../../../../share/model/alarm-equipment-name.model';

/**
 * 告警过滤 新增和编辑页面
 */
@Component({
  selector: 'app-alarm-filtration-add',
  templateUrl: './alarm-filtration-add.component.html',
  styleUrls: ['./alarm-filtration-add.component.scss'],
})

export class AlarmFiltrationAddComponent implements OnInit {
  // 开始时间
  @ViewChild('startTime') private startTime;
  // 结束时间
  @ViewChild('endTime') private endTime;
  // 是否启用
  @ViewChild('isNoStartUsing') private isNoStartUsing;
  // 告警名称
  @ViewChild('alarmName') private alarmName;
  // 基本信息
  @ViewChild('titleDataTemplate') private titleDataTemplate;
  // 过滤条件信息
  @ViewChild('filtrationDataTemplate') private filtrationDataTemplate;
  // 设备名称(告警对象)
  @ViewChild('alarmEquipmentTemp') private alarmEquipmentTemp: TemplateRef<any>;
  // 国际化接口
  public language: AlarmLanguageInterface;
  // 页面类型
  public pageType: OperateTypeEnum = OperateTypeEnum.add;
  // 是否存库 默认 是
  public defaultStatus: AlarmInventoryEnum = AlarmInventoryEnum.yes;
  // 启用状态 默认 启用
  public isNoStartData: boolean = true;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 设备名称(告警对象)
  public checkAlarmEquipment: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 保存按钮加载中
  public isLoading: boolean = false;
  // 接收起始时间Value值
  public dateStart: number;
  // 接收结束时间Value值
  public dateEnd: number;
  public ruleName: string;
  // 历史告警设置表单项
  public formColumn: FormItem[] = [];
  // 历史告警表单项实例
  public formStatus: FormOperate;
  // 勾选的告警名称
  public checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // 弹窗控制
  public display = {
    alarmNameDisabled: true,
    rulePopUp: false,
  };
  // 告警名称配置
  public alarmNameConfig: AlarmSelectorConfigModel;
  // 标题
  public title: string = '';
  // 编辑id
  public updateParamsId: string;
  // 提交按钮禁启用
  public isDisabled: boolean;
  // 获取当前的时间
  private today: Date = new Date();

  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $alarmService: AlarmService,
    public $modalService: FiLinkModalService,
    private $ruleUtil: RuleUtil,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  /**
   * 初始化
   */
  ngOnInit() {
    this.initForm();
    this.pageType = this.$active.snapshot.params.type;
    if (this.pageType === OperateTypeEnum.add) {
      // 新增
      this.title = this.language.addAlarmFiltration;
      this.initAlarmNameConfig();
    } else {
      // 编辑
      this.title = this.language.updateAlarmFiltration;
      this.$active.queryParams.subscribe(params => {
        this.updateParamsId = params.id;
        this.getAlarmData(params.id);
      });
    }
  }

  /**
   * 表单
   */
  public initForm() {
    this.formColumn = [
      {
        // 基本类型
        label: '',
        key: 'title',
        type: 'custom',
        rule: [],
        asyncRules: [],
        template: this.titleDataTemplate,
      },
      {
        label: this.language.name,
        key: 'ruleName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          {maxLength: 32},
          this.$ruleUtil.getNameRule(),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        modelChange: (controls, event, key, formOperate) => {
          this.ruleName = event;
        },
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // 过滤条件信息
        label: '',
        key: 'title',
        type: 'custom',
        initialValue: '',
        rule: [],
        asyncRules: [],
        template: this.filtrationDataTemplate,
      },
      {
        // 告警对象
        label: this.language.alarmobject,
        key: 'alarmFilterRuleSourceList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.alarmEquipmentTemp,
      },
      {
        // 告警名称
        label: this.language.alarmName,
        key: 'alarmFilterRuleNameList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.alarmName,
      },
      {
        // 起始时间
        label: this.language.startTime,
        key: 'beginTime',
        type: 'custom',
        template: this.startTime,
        require: true,
        rule: [],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              // 异步校验起始时间是否有值
              return Observable.create(observer => {
                this.dateStart = control.value;
                if (this.dateStart) {
                  observer.next(null);
                  observer.complete();
                } else {
                  observer.next({error: true, duplicated: true});
                  observer.complete();
                }
              });
            },
          },
        ],
      },
      {
        // 结束时间
        label: this.language.endTime,
        key: 'endTime',
        type: 'custom',
        template: this.endTime,
        require: true,
        rule: [],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              this.dateEnd = control.value;
              if (!control.value) {
                return Observable.create(observer => {
                  observer.next(null);
                  observer.complete();
                });
              }
              const start = (new Date(this.dateStart)).getTime();
              const end = new Date(control.value).getTime();
              // 开始时间不能大于结束时间
              if (start > end) {
                this.$modalService.error(this.language.endTimeTip);
                this.dateEnd = null;
                this.formStatus.resetControlData('endTime', '');
                return Observable.create(observer => {
                  observer.next(null);
                  observer.complete();
                });
              }
              return Observable.create(observer => {
                // 结束时间必须大于起始时间
                if (this.dateEnd < this.dateStart && this.dateEnd) {
                  this.$modalService.info(this.language.endTimeTip);
                }
                if (control.value && control.value > this.dateStart) {
                  // 起始时间不能为空且小于结束时间
                  if (!this.dateStart || this.dateStart > this.dateEnd) {
                    this.$modalService.info(this.language.firstSelectEndDateTip);
                    this.formStatus.resetControlData('endTime', '');
                  }
                  observer.next(null);
                  observer.complete();
                } else {
                  observer.next({error: true, duplicated: true});
                  observer.complete();
                }
              });
            },
          },
        ],
      },
      {
        // 是否库存
        label: this.language.isNoStored,
        key: 'storeDatabase',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: this.defaultStatus,
        radioInfo: {
          data: [
            {label: this.language.yes, value: AlarmInventoryEnum.yes},
            {label: this.language.no, value: AlarmInventoryEnum.no},
          ],
          label: 'label',
          value: 'value',
        },
      },
      {
        // 是否启用
        label: this.language.openStatus,
        key: 'status',
        type: 'custom',
        template: this.isNoStartUsing,
        initialValue: this.isNoStartData,
        require: true,
        rule: [],
        asyncRules: [],
        radioInfo: {
          type: 'select',
          selectInfo: [
            AlarmUtil.translateDisableAndEnable(this.$nzI18n, null),
          ],
          label: 'label',
          value: 'value',
        },
      },
    ];
  }

  /**
   * 告警对象过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    // 告警名称弹框按钮禁启用
    if (event && event.length > 0) {
      this.display.alarmNameDisabled = false;
    } else {
      this.display.alarmNameDisabled = true;
    }
    this.selectEquipments = event;
    this.checkAlarmEquipment = {
      ids: event.map(v => v.equipmentId) || [],
      name: event.map(v => v.equipmentName).join(',') || '',
    };
    this.formStatus.resetControlData('alarmFilterRuleSourceList', this.checkAlarmEquipment.ids);
    // 告警对象发生变化，告警名称重置
    this.checkAlarmName = new AlarmSelectorInitialValueModel();
    this.formStatus.resetControlData('alarmFilterRuleNameList', null);
    this.initAlarmNameConfig();
  }

  /**
   * 告警对象弹框
   */
  public openEquipmentSelector(): void {
    this.equipmentVisible = true;
  }

  /**
   * 提交按钮判断
   */
  public confirmButtonIsGray(value: AlarmFiltrationModel): boolean {
    value.ruleName = value.ruleName ? value.ruleName.trim() : null;
    if (this.dateEnd && this.dateStart && this.checkAlarmEquipment.name && value.ruleName && value.ruleName.length <= 32 &&
      this.checkAlarmName.name && new Date(this.dateStart) < new Date(this.dateEnd)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 编辑告警过滤数据回显
   */
  public getAlarmData(id: string): void {
    this.$alarmService.queryAlarmById(id).subscribe((res: ResultModel<AlarmFiltrationModel>) => {
      if (res.code === 0) {
        const alarmData = res.data[0];
        // 设置告警对象
        if (alarmData.alarmFilterRuleSourceList && alarmData.alarmFilterRuleSourceList.length) {
          this.getAlarmFilterObjectName(alarmData.alarmFilterRuleSourceList).then((result: EquipmentAddInfoModel[]) => {
            alarmData.alarmFilterRuleSourceName = this.handleEquipmentDataToGetName(alarmData.alarmFilterRuleSourceList, result);
            if (alarmData.alarmFilterRuleSourceName) {
              this.checkAlarmEquipment = {
                name: alarmData.alarmFilterRuleSourceName.join(','),
                ids: alarmData.alarmFilterRuleSourceList,
              };
            }
            alarmData.alarmFilterRuleSourceList.map((v, index) => {
              const equipmentListModel = new EquipmentListModel();
              equipmentListModel.equipmentId = v;
              equipmentListModel.equipmentName = alarmData.alarmFilterRuleSourceName[index] || '';
              // 初始化告警对象勾选数据
              this.selectEquipments.push(equipmentListModel);
            });
            this.formStatus.resetControlData('alarmFilterRuleSourceList', this.checkAlarmEquipment.ids);
          });
        }
        // 设置告警名称
        if (alarmData.alarmFilterRuleNameList && alarmData.alarmFilterRuleNameList.length
          && alarmData.alarmFilterRuleNames && alarmData.alarmFilterRuleNames.length) {
          const alarmName = alarmData.alarmFilterRuleNames.join(',');
          this.checkAlarmName = new AlarmSelectorInitialValueModel(alarmName, alarmData.alarmFilterRuleNameList);
          this.formStatus.resetControlData('alarmFilterRuleNameList', this.checkAlarmName.ids);
          this.display.alarmNameDisabled = false;
        }
        this.initAlarmNameConfig();
        // 设置开始时间和结束时间
        alarmData.beginTime = new Date(CommonUtil.convertTime(new Date(alarmData.beginTime).getTime()));
        alarmData.endTime = new Date(CommonUtil.convertTime(new Date(alarmData.endTime).getTime()));
        if (alarmData.beginTime) {
          this.formStatus.resetControlData('beginTime',
            new Date(CommonUtil.convertTime(alarmData.beginTime)));
        }
        if (alarmData.endTime) {
          this.formStatus.resetControlData('endTime',
            new Date(CommonUtil.convertTime(alarmData.endTime)));
        }
        // 启用 禁用状态
        if (alarmData.status) {
          this.isNoStartData = alarmData.status === AlarmEnableStatusEnum.enable;
        }
        // 是否存库
        if (alarmData.storeDatabase) {
          alarmData.storeDatabase = String(alarmData.storeDatabase);
        }
        this.formStatus.resetData(alarmData);
      }
    });
  }

  /**
   * 根据设备id集合获取设备名字
   * @param equipmentIds 设备id数组
   */
  public getAlarmFilterObjectName(equipmentIds: string[]): Promise<EquipmentAddInfoModel[]> {
    const obj: AlarmEquipmentNameModel = new AlarmEquipmentNameModel(equipmentIds);
    return new Promise((resolve, reject) => {
        this.$alarmService.getAlarmFilterEquipmentList(obj).subscribe((res) => {
          if (res.code === ResultCodeEnum.success) {
            resolve(res.data);
          }
        }, (error) => {
          reject(error);
        });
      },
    );
  }

  /**
   * 根据设备id从设备列表筛选出对应设备名字
   * @param equipmentIds 设备id数组
   * @param equipmentData 设备信息列表
   */
  public handleEquipmentDataToGetName(equipmentIds: string[], equipmentData: EquipmentAddInfoModel[]): string[] {
    const name: string[] = [];
    equipmentIds.forEach((item) => {
      equipmentData.forEach(e => {
        if (item === e.equipmentId) {
          name.push(e.equipmentName);
        }
      });
    });
    return name;
  }

  /**
   * 提交按钮禁启用
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.valueChanges.subscribe((params) => {
      this.isDisabled = this.confirmButtonIsGray(params);
    });
  }

  /**
   * 起始时间当天之前的时间不能选
   */
  public disabledStartDate = (current: Date): boolean => {
    this.today = new Date();
    return differenceInCalendarDays(current, this.today) < 0 || CommonUtil.checkTimeOver(current);
  }
  /**
   * 结束时间大于起始时间
   */
  public disabledEndDate = (current: Date): boolean => {
    if (this.dateStart !== null) {
      return differenceInCalendarDays(current, this.dateStart) < 0 || CommonUtil.checkTimeOver(current);
    }
  }

  /**
   *新增告警
   */
  public submit(): void {
    this.isLoading = true;
    const alarmObj: AlarmFiltrationModel = this.formStatus.getData();
    alarmObj.ruleName = alarmObj.ruleName.trim();
    alarmObj.remark = alarmObj.remark && alarmObj.remark.trim();
    alarmObj.alarmFilterRuleSourceName = this.checkAlarmEquipment.name.split(',');
    // 禁启用状态 需要通过转化
    alarmObj.status = this.isNoStartData ? AlarmEnableStatusEnum.enable : AlarmEnableStatusEnum.disable;
    alarmObj.beginTime = CommonUtil.sendBackEndTime(new Date(alarmObj.beginTime).getTime());
    alarmObj.endTime = CommonUtil.sendBackEndTime(new Date(alarmObj.endTime).getTime());
    let requestPath: string = '';
    if (this.pageType === OperateTypeEnum.add) {
      // 新增
      requestPath = 'addAlarmFiltration';
    } else {
      // 编辑
      alarmObj.id = this.updateParamsId;
      requestPath = 'updateAlarmFiltration';
    }
    this.$alarmService[requestPath](alarmObj).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res && res.code === 0) {
        this.$message.success(res.msg);
        this.$router.navigate(['business/alarm/alarm-filtration']).then();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 取消
   */
  public cancel(): void {
    this.$router.navigate(['business/alarm/alarm-filtration']).then();
  }

  /**
   * 告警过滤规则
   */
  public ruleTable(event: AlarmFiltrationModel) {
    this.display.rulePopUp = false;
    if (event && event.id) {
      this.getAlarmData(event.id);
    }
  }

  /**
   * 告警名称
   */
  private initAlarmNameConfig() {
    this.alarmNameConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.checkAlarmName,
      disabled: this.display.alarmNameDisabled,
      clear: !this.checkAlarmName.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = new AlarmSelectorInitialValueModel(event.name, event.ids);
        this.formStatus.resetControlData('alarmFilterRuleNameList', this.checkAlarmName.ids);
      },
    };
  }
}
