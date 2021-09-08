import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {SmartService} from '../../../../core-module/api-service/facility/smart/smart.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {LabelTypeEnum, SmartLabelConfig, UploadTypeEnum} from '../../share/const/smart-label.config';
import {TemplateReqModel} from '../../../../core-module/model/facility/template.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {TemplateCodeRuleEnum} from '../../share/enum/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../shared-module/model/result.model';

/**
 * 配置业务信息组件
 */
@Component({
  selector: 'app-facility-business-information',
  templateUrl: './facility-business-information.component.html',
  styleUrls: ['./facility-business-information.component.scss']
})
export class FacilityBusinessInformationComponent implements OnInit {
  // 智能标签模板
  @ViewChild('smartLabelTemp') private smartLabelTemp: TemplateRef<Element>;
  // 页面是否加载
  public pageLoading = false;
  // 表单提交按钮是否加载
  public isLoading: boolean;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设施id
  public deviceId: string;
  // 设施类型
  public deviceType: DeviceTypeEnum;
  // 设施名称
  public deviceName: string;
  // 模板选择显示隐藏
  public templateShow = false;
  // 模板信息
  public smartLabelInfo: { id: string, name: string } = {id: '', name: ''};
  // 模板实体
  public templateReqDto: TemplateReqModel;
  // 模板禁用
  public templateDisabled: boolean;
  // 提交类型  // 0为新增 2 为修改
  private uploadType: UploadTypeEnum = UploadTypeEnum.add;

  constructor(private $nzI18n: NzI18nService,
              private $active: ActivatedRoute,
              private $smartService: SmartService,
              private $message: FiLinkModalService,
              private $ruleUtil: RuleUtil) {
  }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.$active.queryParams.subscribe(params => {
      this.deviceId = params.id;
      this.deviceType = params.deviceType;
      this.deviceName = params.deviceName;
      this.initFormColumn();
      this.queryFacilityBusinessInfoById();
    });
  }

  /**
   * 表单实例
   * param event
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
  }

  public goBack(): void {
    window.history.go(-1);
  }

  /**
   * 模版选择器结果
   * param event
   */
  public selectedTemplate(event: { id: string, name: string }): void {
    this.smartLabelInfo = event;
    this.templateShow = false;
    this.formStatus.group.controls['boxName'].reset(event.name);
  }

  /**
   * 保存设施业务信息
   */
  public saveInfo(): void {
    this.isLoading = true;
    const body = this.formStatus.group.getRawValue();
    const obj: any = {boxList: [body]};
    if (this.smartLabelInfo.id) {
      obj.boxTemplateId = this.smartLabelInfo.id;
    }
    // 当标签类型为无的时候置空标签状态
    if (body.labelType === LabelTypeEnum.NONE) {
      body.labelState = '';
    }
    obj.deviceId = this.deviceId;
    body.deviceId = this.deviceId;
    body.deviceName = this.deviceName;
    obj.deviceType = this.deviceType;
    obj.uploadType = this.uploadType;
    obj.boxTrend = body.boxTrend;
    obj.boxCodeRule = body.boxCodeRule;
    obj.frameTrend = body.frameTrend;
    obj.frameCodeRule = body.frameCodeRule;
    obj.discTrend = body.discTrend;
    obj.discCodeRule = body.discCodeRule;
    obj.boxName = body.boxName;
    obj.boardList = [];
    obj.portList = [];
    this.$smartService.uploadFacilityBusinessInfo(obj).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.goBack();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 查询设施业务信息
   */
  public queryFacilityBusinessInfoById(): void {
    this.pageLoading = true;
    this.$smartService.queryFacilityBusInfoById(this.deviceId, this.deviceType).subscribe((result: ResultModel<any>) => {
      this.pageLoading = false;
      if (result.code === 0) {
        if (result.data.boxList && result.data.boxList.length > 0) {
          this.uploadType = UploadTypeEnum.update;
          this.formStatus.resetData(result.data.boxList[0]);
          if (this.deviceType === DeviceTypeEnum.opticalBox || this.deviceType === DeviceTypeEnum.distributionFrame) {
            const {boxTrend, boxCodeRule, frameTrend, frameCodeRule, discTrend, discCodeRule, boxName} = result.data;
            const obj = {boxTrend, boxCodeRule, frameTrend, frameCodeRule, discTrend, discCodeRule, boxName};
            this.smartLabelInfo.name = result.data.boxName;
            this.formStatus.resetData(Object.assign(obj, result.data.boxList[0]));
            this.disableFormItem();
          }
        } else {
          this.uploadType = UploadTypeEnum.add;
        }
      }
    });
  }

  /**
   * 打开模板选择器并且传入所有箱架盘信息
   */
  public openSmartLabel(): void {
    const body: TemplateReqModel = this.formStatus.group.getRawValue() as TemplateReqModel;
    if (this.formStatus.getValid('boxTrend') &&
      this.formStatus.getValid('boxCodeRule') &&
      this.formStatus.getValid('frameTrend') &&
      this.formStatus.getValid('frameCodeRule') &&
      this.formStatus.getValid('discTrend') &&
      this.formStatus.getValid('discCodeRule')
    ) {
      this.templateReqDto = body;
      this.templateShow = true;
    } else {
      this.$message.error(this.language.pleaseGetAllInfoToRackAndTray);
    }
  }

  /**
   * 初始化表单配置
   */
  private initFormColumn(): void {
    // 公共
    const formColumnCommon = [
      {
        // 标签ID
        label: this.language.tagID, key: 'boxLabel', col: 24, type: 'input',
        disabled: true,
        rule: [
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
      },
      {
        // 制造商
        label: this.language.manufacturer, key: 'producer', col: 24, type: 'input',
        rule: [
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
      },
      {
        // 标签类型
        label: this.language.labelType, key: 'labelType',
        type: 'select',
        require: true,
        rule: [
          {required: true}
        ],
        col: 24,
        selectInfo: {
          data: SmartLabelConfig.getLabelTypeEnum(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event, key, formOperate: FormOperate) => {
          const labelStateColumn = formOperate.getColumn('labelState').item;
          // 标签类型为无的时候标签状态隐藏
          labelStateColumn.hidden = $event === LabelTypeEnum.NONE;
        },
      },
      {
        // 标签状态
        label: this.language.labelState, key: 'labelState',
        type: 'select',
        col: 24,
        hidden: true,
        selectInfo: {
          data: SmartLabelConfig.getLabelStateEnum(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        rule: [],
      },
    ];
    // 配线架
    const formColumnDistributionFrame = [
      {
        // 设施形态
        label: this.language.deviceForm, key: 'deviceForm',
        type: 'select',
        col: 24,
        selectInfo: {
          data: SmartLabelConfig.getDeviceFormEnum(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        require: true,
        rule: [{required: true}],
      },
      {
        // 机架行号
        label: this.language.rackLineNumber, key: 'lineNum', col: 24, type: 'input',
        rule: [RuleUtil.getNameMaxLengthRule()],
      },
      {
        // 机架列号
        label: this.language.rackColumnNumber, key: 'columnNum', col: 24, type: 'input',
        rule: [RuleUtil.getNameMaxLengthRule()],
      },
      {
        // 最大纤芯数
        label: this.language.fiberCoreNum,
        col: 24,
        key: 'maxFiberNum',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          this.$ruleUtil.getMaxFiberNumRule(),
        ],
      },
      {
        // 走向-箱架信息
        label: this.language.trend, key: 'boxTrend',
        col: 24,
        type: 'select',
        title: this.language.BoxRackInformation,
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          value: 'code',
          label: 'label'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 编号规则
        label: this.language.codeRule,
        type: 'select',
        key: 'boxCodeRule',
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          value: 'code',
          label: 'label'
        },
        require: true,
        col: 24,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 走向-框架信息
        label: this.language.trend, key: 'frameTrend',
        type: 'select',
        title: this.language.frameInformation,
        col: 24,
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          value: 'code',
          label: 'label'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 编号规则
        label: this.language.codeRule,
        type: 'select',
        key: 'frameCodeRule',
        col: 24,
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          value: 'code',
          label: 'label'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 走向-盘信息
        label: this.language.trend,
        type: 'select',
        key: 'discTrend',
        title: this.language.diskInformation,
        col: 24,
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          value: 'code',
          label: 'label'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 编号规则
        label: this.language.codeRule,
        key: 'discCodeRule',
        col: 24,
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          value: 'code',
          label: 'label'
        },
        type: 'select',
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 箱架模版
        label: this.language.boxTemplate, key: 'boxName', col: 24,
        type: 'custom',
        template: this.smartLabelTemp,
        require: true,
        rule: [
          {required: true},
        ],
      },
      {
        label: this.language.remarks, col: 24, key: 'memo', type: 'textarea',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
    // 光交箱
    const formColumnOpticalBox = [
      {
        // 最大纤芯数
        label: this.language.fiberCoreNum, key: 'maxFiberNum', col: 24, type: 'input',
        require: true,
        rule: [
          {required: true},
          this.$ruleUtil.getMaxFiberNumRule(),
        ],
      },
      {
        // 走向-箱架信息
        label: this.language.trend,
        title: this.language.BoxRackInformation,
        key: 'boxTrend',
        col: 24,
        type: 'select',
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          value: 'code',
          label: 'label'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 编号规则
        label: this.language.codeRule,
        type: 'select',
        key: 'boxCodeRule',
        col: 24,
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        asyncRules: [],
        require: true,
        rule: [{required: true}]
      },
      {
        // 走向-框架信息
        label: this.language.trend,
        key: 'frameTrend',
        title: this.language.frameInformation,
        col: 24,
        type: 'select',
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 编号规则
        key: 'frameCodeRule',
        label: this.language.codeRule,
        col: 24,
        type: 'select',
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 走向-盘信息
        key: 'discTrend',
        label: this.language.trend,
        title: this.language.diskInformation,
        type: 'select',
        col: 24,
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        require: true,
        rule: [{required: true}], asyncRules: []
      },
      {
        // 编号规则
        label: this.language.codeRule,
        key: 'discCodeRule',
        col: 24,
        type: 'select',
        selectInfo: {
          data: CommonUtil.codeTranslate(TemplateCodeRuleEnum, this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        rule: [{required: true}], asyncRules: [],
        require: true,
      },
      {
        // 箱架模版
        label: this.language.boxTemplate, key: 'boxName', col: 24,
        type: 'custom',
        template: this.smartLabelTemp,
        rule: [
          {required: true},
        ],
        require: true,
      },
      {
        label: this.language.remarks, col: 24, key: 'memo', type: 'textarea',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
    // 接头盒
    const formColumnJunctionBox = [
      {
        // 最大纤芯数
        label: this.language.fiberCoreNum, key: 'maxFiberNum', col: 24, type: 'input',
        require: true,
        rule: [
          {required: true},
          this.$ruleUtil.getMaxFiberNumRule(),
        ],
      },
      {
        // 密封方式
        label: this.language.sealMode, key: 'sealMode',
        type: 'select',
        col: 24,
        selectInfo: {
          data: SmartLabelConfig.getSealModeEnum(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        rule: [],
      },
      {
        // 敷设方式
        label: this.language.layMode, key: 'layMode',
        type: 'select',
        col: 24,
        selectInfo: {
          data: SmartLabelConfig.getLayModeEnum(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        rule: [],
      },
      {
        // 规格说明
        label: this.language.standard, key: 'standard',
        type: 'select',
        col: 24,
        selectInfo: {
          data: SmartLabelConfig.getStandardEnum(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        rule: [],
      },
      {
        // 接续信息
        label: this.language.follow, key: 'follow',
        type: 'select',
        col: 24,
        selectInfo: {
          data: SmartLabelConfig.getFollowEnum(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        rule: [],
      },
      {
        label: this.language.remarks, col: 24, key: 'memo', type: 'textarea',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];

    // 光交箱
    if (this.deviceType === DeviceTypeEnum.opticalBox) {
      this.formColumn = this.formColumn.concat(formColumnCommon, formColumnOpticalBox);
      // 配线架
    } else if (this.deviceType === DeviceTypeEnum.distributionFrame) {
      this.formColumn = this.formColumn.concat(formColumnCommon, formColumnDistributionFrame);

      // 接头盒
    } else if (this.deviceType === DeviceTypeEnum.junctionBox) {
      this.formColumn = this.formColumn.concat(formColumnCommon, formColumnJunctionBox);

    }
  }

  /**
   * 禁用模板相关字段
   */
  private disableFormItem(): void {
    this.formStatus.group.controls['boxTrend'].disable();
    this.formStatus.group.controls['boxCodeRule'].disable();
    this.formStatus.group.controls['frameTrend'].disable();
    this.formStatus.group.controls['frameCodeRule'].disable();
    this.formStatus.group.controls['discTrend'].disable();
    this.formStatus.group.controls['discCodeRule'].disable();
    this.templateDisabled = true;
  }
}
